import { detectSetups } from './strat/patterns';
import { buildContinuity, scoreContinuity } from './strat/continuity';
import { computeLevels } from './strat/levels';
import { scoreConfidence } from './strat/confidence';
import { buildExplanation } from './strat/explain';
import { Candle, Signal, Timeframe, TIMEFRAMES } from './strat/types';
import { fetchTimeframe, TimeframeSeries } from './data/yahoo';

export interface ScanError {
  symbol: string;
  message: string;
}

export interface ScanResult {
  signals: Signal[];
  errors: ScanError[];
  scannedAt: number;
}

/** Minimum completed bars required before we trust a timeframe's structure. */
const MIN_BARS = 6;

function signalsForSymbol(symbol: string, series: TimeframeSeries[]): Signal[] {
  // Current candle per timeframe for FTFC — prefer the forming bar, fall back
  // to the last completed bar (e.g. weekend for equities).
  const current: Partial<Record<Timeframe, Candle>> = {};
  for (const s of series) {
    const c = s.forming ?? s.completed[s.completed.length - 1];
    if (c) current[s.timeframe] = c;
  }
  const continuityMap = buildContinuity(current);
  const lastPrice = series.find((s) => s.timeframe === 'D')?.lastPrice ?? series[0]?.lastPrice ?? 0;
  const name = series.find((s) => s.name)?.name;

  const signals: Signal[] = [];
  for (const s of series) {
    if (s.completed.length < MIN_BARS) continue;
    const matches = detectSetups(s.completed);
    for (const m of matches) {
      const levels = computeLevels(s.completed, m.direction);
      const triggered = s.forming
        ? m.direction === 'bullish'
          ? s.forming.high >= levels.entry
          : s.forming.low <= levels.entry
        : false;
      const contScore = scoreContinuity(continuityMap, m.direction);
      const conf = scoreConfidence({
        pattern: m,
        continuity: contScore,
        levels,
        completed: s.completed,
        triggered,
      });
      signals.push({
        symbol,
        symbolName: name,
        lastPrice,
        timeframe: s.timeframe,
        direction: m.direction,
        pattern: m.name,
        sequence: m.sequence,
        status: triggered ? 'TRIGGERED' : 'SETUP',
        isReversal: m.isReversal,
        confidence: conf.score,
        confidenceLabel: conf.label,
        factors: conf.factors,
        explanation: buildExplanation(symbol, s.timeframe, m, contScore, levels, triggered),
        levels,
        continuity: continuityMap,
        setupBarTime: m.triggerBar.time,
      });
    }
  }
  return signals;
}

async function scanSymbol(symbol: string): Promise<Signal[]> {
  const series = await Promise.all(TIMEFRAMES.map((tf) => fetchTimeframe(symbol, tf)));
  return signalsForSymbol(symbol, series);
}

export async function scanMarket(
  symbols: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<ScanResult> {
  const signals: Signal[] = [];
  const errors: ScanError[] = [];
  let done = 0;

  const CONCURRENCY = 3;
  const queue = [...symbols];

  async function worker() {
    while (queue.length > 0) {
      const symbol = queue.shift();
      if (!symbol) break;
      try {
        signals.push(...(await scanSymbol(symbol)));
      } catch (e) {
        errors.push({ symbol, message: e instanceof Error ? e.message : String(e) });
      }
      done += 1;
      onProgress?.(done, symbols.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, symbols.length) }, worker));

  signals.sort((a, b) => b.confidence - a.confidence);
  return { signals, errors, scannedAt: Date.now() };
}

export { signalsForSymbol };
