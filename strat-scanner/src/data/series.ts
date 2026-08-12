import { Candle, Timeframe } from '../strat/types';

/**
 * Shape every market-data provider returns, plus the one rule they all share:
 * telling a finished bar from the one still printing. The Strat engine reads
 * structure off completed bars only, and continuity off the forming one, so
 * getting this split wrong quietly corrupts both.
 */

export interface TimeframeSeries {
  timeframe: Timeframe;
  /** Fully closed candles; the last one is the actionable trigger bar. */
  completed: Candle[];
  /** The live, still-forming candle (if the market produced one). */
  forming: Candle | null;
  lastPrice: number;
  name?: string;
}

/** Approximate bar duration in seconds, used to decide if the last bar is still forming. */
export const TF_SECONDS: Record<Timeframe, number> = {
  '4H': 4 * 3600,
  D: 86400,
  W: 7 * 86400,
  M: 31 * 86400,
};

export function splitForming(
  candles: Candle[],
  tf: Timeframe,
): { completed: Candle[]; forming: Candle | null } {
  if (candles.length === 0) return { completed: [], forming: null };
  const last = candles[candles.length - 1];
  const now = Date.now() / 1000;
  const isForming = now < last.time + TF_SECONDS[tf];
  return isForming
    ? { completed: candles.slice(0, -1), forming: last }
    : { completed: candles, forming: null };
}
