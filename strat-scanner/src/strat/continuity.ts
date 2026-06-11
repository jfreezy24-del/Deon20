import { Candle, ContinuityMap, Direction, TFTrend, Timeframe, TIMEFRAMES } from './types';

/** Direction of a (typically still-forming) candle: trading above or below its open. */
export function candleTrend(c: Candle): TFTrend {
  if (c.close > c.open) return 'up';
  if (c.close < c.open) return 'down';
  return 'flat';
}

/**
 * Build the full-timeframe-continuity (FTFC) map from the current candle of
 * each timeframe. In TheStrat, when the 4H, Day, Week and Month candles are
 * all trading in the same direction relative to their opens, all participants
 * are pointed the same way and trades in that direction have the wind at
 * their back.
 */
export function buildContinuity(current: Partial<Record<Timeframe, Candle>>): ContinuityMap {
  const map: ContinuityMap = {};
  for (const tf of TIMEFRAMES) {
    const c = current[tf];
    if (c) map[tf] = candleTrend(c);
  }
  return map;
}

export interface ContinuityScore {
  aligned: Timeframe[];
  opposed: Timeframe[];
  full: boolean;
}

export function scoreContinuity(map: ContinuityMap, direction: Direction): ContinuityScore {
  const want: TFTrend = direction === 'bullish' ? 'up' : 'down';
  const aligned: Timeframe[] = [];
  const opposed: Timeframe[] = [];
  for (const tf of TIMEFRAMES) {
    const t = map[tf];
    if (!t || t === 'flat') continue;
    if (t === want) aligned.push(tf);
    else opposed.push(tf);
  }
  const known = aligned.length + opposed.length;
  return { aligned, opposed, full: known >= 3 && opposed.length === 0 };
}
