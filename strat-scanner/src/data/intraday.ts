import { Candle } from '../strat/types';
import { fetchAlpacaHourly, isCryptoSymbol } from './alpaca';
import { fetchIntradayCandles } from './yahoo';

/**
 * Hourly bars, for entry timing only.
 *
 * Deliberately outside the `Timeframe` union. The engine is built on 4H/D/W/M
 * — continuity, scoring, the reports and the whole record assume those four —
 * and 60m is not a fifth member of that set. It never produces a setup, never
 * votes in timeframe continuity and never appears in a signal. Its only job is
 * to answer "now that the daily trigger has broken, where is the *real* risk
 * on this bar?", which is a question about execution rather than selection.
 *
 * Keeping it out of the union is what stops that distinction from eroding:
 * there is no way to accidentally scan 60m for setups, because nothing
 * downstream can represent a 60m signal.
 *
 * **Coverage is short and that is a hard limit.** Yahoo serves 1h bars for
 * about 60 days and Alpaca's crypto history is longer but still not deep. Any
 * measurement built on this covers weeks, not years — which is enough to see
 * whether tighter stops get whipsawed, and nowhere near enough to claim an
 * edge. Callers are expected to say so.
 */

/** The most history either provider will serve at hourly resolution. */
export const INTRADAY_MAX_DAYS = 60;

export interface IntradayResult {
  symbol: string;
  candles: Candle[];
  provider: 'alpaca' | 'yahoo';
  fallbackReason?: string;
}

/** Enough hourly bars to be worth timing an entry against. */
const MIN_USABLE_BARS = 50;

export async function fetchHourly(
  symbol: string,
  days: number = INTRADAY_MAX_DAYS,
): Promise<IntradayResult> {
  if (isCryptoSymbol(symbol)) {
    try {
      const candles = await fetchAlpacaHourly(symbol, days);
      if (candles.length >= MIN_USABLE_BARS) return { symbol, candles, provider: 'alpaca' };
      return {
        ...(await viaYahoo(symbol, days)),
        fallbackReason: `Alpaca returned ${candles.length} hourly bars`,
      };
    } catch (e) {
      return {
        ...(await viaYahoo(symbol, days)),
        fallbackReason: e instanceof Error ? e.message : String(e),
      };
    }
  }
  return viaYahoo(symbol, days);
}

async function viaYahoo(symbol: string, days: number): Promise<IntradayResult> {
  const range = `${Math.min(days, INTRADAY_MAX_DAYS)}d`;
  const res = await fetchIntradayCandles(symbol, range);
  return { symbol, candles: res.candles, provider: 'yahoo' };
}
