import { Candle, CandleType } from './types';

/** Classify a candle against the bar before it (TheStrat 1 / 2u / 2d / 3). */
export function classifyCandle(prev: Candle, cur: Candle): CandleType {
  const brokeHigh = cur.high > prev.high;
  const brokeLow = cur.low < prev.low;
  if (brokeHigh && brokeLow) return '3';
  if (brokeHigh) return '2u';
  if (brokeLow) return '2d';
  return '1';
}

/**
 * Classify a whole series. Index 0 has no previous bar and is returned as null.
 */
export function classifySeries(candles: Candle[]): (CandleType | null)[] {
  return candles.map((c, i) => (i === 0 ? null : classifyCandle(candles[i - 1], c)));
}
