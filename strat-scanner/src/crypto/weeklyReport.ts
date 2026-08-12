import { buildContinuity } from '../strat/continuity';
import { buildDcaPlan, DcaPlan } from '../strat/dca';
import { Candle, ContinuityMap, Signal, Timeframe, TIMEFRAMES } from '../strat/types';
import { fetchTimeframe, TimeframeSeries } from '../data/yahoo';
import { signalsForSymbol } from '../scanner';
import { cryptoName, ladderProfileFor } from './universe';

/**
 * The weekly crypto report: for every asset in the universe, the Strat setups
 * worth an entry this week plus the standing DCA ladder underneath price.
 *
 * Entries answer "where does a trade start and where is it wrong"; the ladder
 * answers "where do I add if it never triggers and just bleeds lower". The two
 * are deliberately separate — one is a stop-entry with an invalidation, the
 * other is planned accumulation into higher-timeframe structure.
 */

export interface WeeklyOptions {
  /** Timeframes eligible to produce entry ideas (4H is noise on a weekly cadence) */
  entryTimeframes: Timeframe[];
  /** Minimum confidence for a setup to be listed as an entry */
  minEntryConfidence: number;
  /** Cap on entry ideas listed per asset */
  maxEntriesPerAsset: number;
  /** Cap on assets called out in the headline section */
  maxHighlights: number;
}

export const DEFAULT_WEEKLY_OPTIONS: WeeklyOptions = {
  entryTimeframes: ['D', 'W', 'M'],
  minEntryConfidence: 50,
  maxEntriesPerAsset: 2,
  maxHighlights: 5,
};

export interface WeeklyAsset {
  symbol: string;
  name?: string;
  lastPrice: number;
  /** Move of the current (or last completed) weekly candle, open to close */
  weekChangePct: number | null;
  continuity: ContinuityMap;
  /** Best pending setups for the week ahead, highest confidence first */
  entries: Signal[];
  dca: DcaPlan;
}

export interface WeeklyError {
  symbol: string;
  message: string;
}

export interface WeeklyReport {
  generatedAt: number;
  /** ISO date (UTC) of the Monday that starts the week being planned */
  weekOf: string;
  assets: WeeklyAsset[];
  errors: WeeklyError[];
  breadth: {
    scanned: number;
    /** Assets whose 4H/D/W/M candles are all pointed up (or all down) */
    fullContinuityUp: number;
    fullContinuityDown: number;
    accumulate: number;
    defensive: number;
    entries: number;
  };
  /** Highest-confidence setups across the whole universe */
  highlights: Signal[];
}

const changePct = (c: Candle | null | undefined): number | null =>
  c && c.open > 0 ? Number((((c.close - c.open) / c.open) * 100).toFixed(2)) : null;

/**
 * Monday (UTC) of the week the report plans for. The scheduled run happens
 * just after the weekly candle closes (Monday 01:00 UTC), so Monday–Saturday
 * names the current week; a Sunday run names the week about to start.
 */
export function weekOf(at: number): string {
  const d = new Date(at);
  const day = d.getUTCDay(); // 0 = Sunday
  const offset = day === 0 ? 1 : 1 - day;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offset));
  return monday.toISOString().slice(0, 10);
}

export function buildWeeklyAsset(
  symbol: string,
  series: TimeframeSeries[],
  opts: WeeklyOptions = DEFAULT_WEEKLY_OPTIONS,
): WeeklyAsset {
  const byTf = new Map(series.map((s) => [s.timeframe, s]));
  const weekly = byTf.get('W');
  const monthly = byTf.get('M');

  const current: Partial<Record<Timeframe, Candle>> = {};
  for (const s of series) {
    const c = s.forming ?? s.completed[s.completed.length - 1];
    if (c) current[s.timeframe] = c;
  }

  const lastPrice =
    byTf.get('D')?.lastPrice ?? series.find((s) => s.lastPrice > 0)?.lastPrice ?? 0;

  const entries = signalsForSymbol(symbol, series)
    .filter((s) => opts.entryTimeframes.includes(s.timeframe))
    .filter((s) => s.confidence >= opts.minEntryConfidence)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, opts.maxEntriesPerAsset);

  const dca = buildDcaPlan({
    symbol,
    lastPrice,
    weekly: { completed: weekly?.completed ?? [], forming: weekly?.forming ?? null },
    monthly: { completed: monthly?.completed ?? [], forming: monthly?.forming ?? null },
    profile: ladderProfileFor(symbol),
  });

  return {
    symbol,
    name: series.find((s) => s.name)?.name ?? cryptoName(symbol),
    lastPrice,
    weekChangePct: changePct(weekly?.forming ?? weekly?.completed[weekly.completed.length - 1]),
    continuity: buildContinuity(current),
    entries,
    dca,
  };
}

export function buildWeeklyReport(
  assets: WeeklyAsset[],
  errors: WeeklyError[],
  opts: WeeklyOptions = DEFAULT_WEEKLY_OPTIONS,
  at: number = Date.now(),
): WeeklyReport {
  const allUp = (a: WeeklyAsset) => TIMEFRAMES.every((tf) => a.continuity[tf] === 'up');
  const allDown = (a: WeeklyAsset) => TIMEFRAMES.every((tf) => a.continuity[tf] === 'down');

  const ranked = [...assets].sort((a, b) => {
    const top = (x: WeeklyAsset) => x.entries[0]?.confidence ?? 0;
    return top(b) - top(a);
  });

  const highlights = assets
    .flatMap((a) => a.entries)
    .sort((x, y) => y.confidence - x.confidence)
    .slice(0, opts.maxHighlights);

  return {
    generatedAt: at,
    weekOf: weekOf(at),
    assets: ranked,
    errors,
    breadth: {
      scanned: assets.length,
      fullContinuityUp: assets.filter(allUp).length,
      fullContinuityDown: assets.filter(allDown).length,
      accumulate: assets.filter((a) => a.dca.stance === 'accumulate').length,
      defensive: assets.filter((a) => a.dca.stance === 'defensive').length,
      entries: assets.reduce((n, a) => n + a.entries.length, 0),
    },
    highlights,
  };
}

/** Fetch every timeframe for every symbol and assemble the weekly report. */
export async function scanCryptoWeekly(
  symbols: string[],
  opts: WeeklyOptions = DEFAULT_WEEKLY_OPTIONS,
  onProgress?: (done: number, total: number) => void,
): Promise<WeeklyReport> {
  const assets: WeeklyAsset[] = [];
  const errors: WeeklyError[] = [];
  const queue = [...symbols];
  let done = 0;

  const CONCURRENCY = 3;
  async function worker() {
    for (;;) {
      const symbol = queue.shift();
      if (!symbol) return;
      try {
        const series = await Promise.all(TIMEFRAMES.map((tf) => fetchTimeframe(symbol, tf)));
        assets.push(buildWeeklyAsset(symbol, series, opts));
      } catch (e) {
        errors.push({ symbol, message: e instanceof Error ? e.message : String(e) });
      }
      done += 1;
      onProgress?.(done, symbols.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, symbols.length) }, worker));
  return buildWeeklyReport(assets, errors, opts);
}
