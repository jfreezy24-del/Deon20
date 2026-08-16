/**
 * Algo Alerts selection: distill a full market sweep down to the handful of
 * high-conviction, CONFIRMED-trigger signals worth an inbox alert — no
 * pending "maybes", one alert per name, daily structure and up. Expect a few
 * per week, sometimes zero; the structure is either there or it isn't.
 */
import { Signal, Timeframe } from './types';
import { RefinedEntry } from './entryRefinement';
import { etfName, isEtf, relatedSymbols } from './universe';

export interface AlgoOptions {
  /** Minimum confidence for a confirmed trigger to alert */
  minConfidence: number;
  /** Timeframes eligible for alerts (daily structure and up by default) */
  timeframes: Timeframe[];
}

export const DEFAULT_ALGO_OPTIONS: AlgoOptions = {
  minConfidence: 60,
  timeframes: ['D', 'W', 'M'],
};

export interface RelatedPlay {
  symbol: string;
  /** Sector/index name when the related symbol is an ETF */
  name?: string;
  pattern: string;
  sequence: string;
  timeframe: Timeframe;
  status: Signal['status'];
  confidence: number;
}

export interface AlgoAlert {
  signal: Signal;
  /** Stop placement from the setup's Strat structure — the line in the sand */
  riskLine: number;
  /**
   * Optional 60-minute entry timing, attached by the alerter after the fact.
   *
   * Selection never depends on it: the alert exists, and says exactly the same
   * thing about direction, trigger and targets, whether or not intraday data
   * was available. It only offers a tighter place to put the stop.
   */
  refined?: RefinedEntry;
  /**
   * Same-direction structure in related names: an ETF alert lists setups in
   * its heavy constituents (the sector spark), a stock alert lists its sector
   * ETFs confirming the move.
   */
  relatedPlays: RelatedPlay[];
}

const RELATED_CAP = 4;

/**
 * Confirmed triggers only, on eligible timeframes, above the confidence bar,
 * collapsed to the single best signal per symbol+direction (highest
 * confidence wins; ties go to the higher timeframe).
 */
export function selectAlgoSignals(
  signals: Signal[],
  opts: AlgoOptions = DEFAULT_ALGO_OPTIONS,
): Signal[] {
  const tfRank = (tf: Timeframe) => opts.timeframes.indexOf(tf);
  const eligible = signals
    .filter(
      (s) =>
        s.status === 'TRIGGERED' &&
        opts.timeframes.includes(s.timeframe) &&
        s.confidence >= opts.minConfidence,
    )
    .sort((a, b) => b.confidence - a.confidence || tfRank(b.timeframe) - tfRank(a.timeframe));

  const seen = new Set<string>();
  const picked: Signal[] = [];
  for (const s of eligible) {
    const key = `${s.symbol}-${s.direction}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(s);
  }
  return picked;
}

/**
 * Same-direction signals (confirmed or still forming) among the alert
 * symbol's related names, best signal per related symbol, triggered and
 * higher-confidence structure first.
 */
export function findRelatedPlays(alert: Signal, allSignals: Signal[]): RelatedPlay[] {
  const related = relatedSymbols(alert.symbol);
  if (related.length === 0) return [];

  const bestPer = new Map<string, Signal>();
  for (const s of allSignals) {
    if (s.symbol === alert.symbol) continue;
    if (s.direction !== alert.direction) continue;
    if (!related.includes(s.symbol)) continue;
    const cur = bestPer.get(s.symbol);
    const better =
      !cur ||
      (s.status === 'TRIGGERED' && cur.status !== 'TRIGGERED') ||
      (s.status === cur.status && s.confidence > cur.confidence);
    if (better) bestPer.set(s.symbol, s);
  }

  return [...bestPer.values()]
    .sort(
      (a, b) =>
        Number(b.status === 'TRIGGERED') - Number(a.status === 'TRIGGERED') ||
        b.confidence - a.confidence,
    )
    .slice(0, RELATED_CAP)
    .map((s) => ({
      symbol: s.symbol,
      name: isEtf(s.symbol) ? etfName(s.symbol) : undefined,
      pattern: s.pattern,
      sequence: s.sequence,
      timeframe: s.timeframe,
      status: s.status,
      confidence: s.confidence,
    }));
}

/** Full pipeline: sweep signals in, ready-to-send algo alerts out. */
export function buildAlgoAlerts(
  signals: Signal[],
  opts: AlgoOptions = DEFAULT_ALGO_OPTIONS,
): AlgoAlert[] {
  return selectAlgoSignals(signals, opts).map((signal) => ({
    signal,
    riskLine: signal.levels.stop,
    relatedPlays: findRelatedPlays(signal, signals),
  }));
}
