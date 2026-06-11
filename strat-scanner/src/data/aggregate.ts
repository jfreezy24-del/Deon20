import { Candle } from '../strat/types';

/**
 * Aggregate 1-hour candles into 4-hour candles.
 *
 * Buckets are anchored to the first bar of each exchange-local trading day
 * (gmtOffsetSeconds comes from the exchange metadata), so:
 *  - 24h markets (crypto/FX) produce clean 00:00/04:00/08:00... bars, and
 *  - equities produce session-anchored bars (e.g. 9:30 and 13:30 for a US
 *    6.5h session), matching how charting platforms draw 4H stock candles.
 */
export function aggregateTo4H(oneHour: Candle[], gmtOffsetSeconds: number): Candle[] {
  if (oneHour.length === 0) return [];
  const sorted = [...oneHour].sort((a, b) => a.time - b.time);
  const out: Candle[] = [];

  let curDay = -1;
  let idxInDay = 0;
  let bucket: Candle | null = null;

  for (const c of sorted) {
    const day = Math.floor((c.time + gmtOffsetSeconds) / 86400);
    if (day !== curDay) {
      curDay = day;
      idxInDay = 0;
    }
    const newBucket = idxInDay % 4 === 0;
    idxInDay += 1;

    if (newBucket) {
      bucket = { ...c };
      out.push(bucket);
    } else if (bucket) {
      bucket.high = Math.max(bucket.high, c.high);
      bucket.low = Math.min(bucket.low, c.low);
      bucket.close = c.close;
      bucket.volume += c.volume;
    }
  }
  return out;
}
