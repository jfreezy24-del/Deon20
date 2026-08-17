import { Candle } from '../strat/types';
import { fetchAlpacaTimeframe, isCryptoSymbol } from './alpaca';
import { fetchDailyCandles } from './yahoo';

/**
 * Deep daily history, for the backtest only.
 *
 * The live scanner deliberately asks for a year of daily bars: its deepest
 * lookback is 21, and pulling a decade on every fifteen-minute sweep would be
 * pure waste. Calibration has the opposite need — the whole point is a sample
 * large enough to argue with — so it gets its own fetch path rather than
 * widening the one the scanner uses.
 *
 * Routing mirrors `data/market`: crypto to Alpaca, everything else to Yahoo,
 * with the same automatic fallback. A symbol degrading to the older source
 * beats a symbol dropping out of the sample, and a thinner sample that is
 * honest about its provenance beats a fuller one that is not.
 */

/** Enough bars to be worth replaying at all. */
const MIN_USABLE_BARS = 120;

export interface HistoryResult {
  symbol: string;
  candles: Candle[];
  provider: 'alpaca' | 'yahoo';
  fallbackReason?: string;
}

/** Yahoo range strings are fixed tokens, so years map onto the nearest one up. */
function yahooRange(years: number): string {
  if (years <= 1) return '1y';
  if (years <= 2) return '2y';
  if (years <= 5) return '5y';
  if (years <= 10) return '10y';
  return 'max';
}

export async function fetchDailyHistory(symbol: string, years = 10): Promise<HistoryResult> {
  if (isCryptoSymbol(symbol)) {
    try {
      const series = await fetchAlpacaTimeframe(symbol, 'D', Math.ceil(years * 365));
      const candles = series.forming ? [...series.completed, series.forming] : series.completed;
      if (candles.length >= MIN_USABLE_BARS) return { symbol, candles, provider: 'alpaca' };
      return {
        ...(await viaYahoo(symbol, years)),
        fallbackReason: `Alpaca returned ${candles.length} bars`,
      };
    } catch (e) {
      return {
        ...(await viaYahoo(symbol, years)),
        fallbackReason: e instanceof Error ? e.message : String(e),
      };
    }
  }
  return viaYahoo(symbol, years);
}

async function viaYahoo(symbol: string, years: number): Promise<HistoryResult> {
  const res = await fetchDailyCandles(symbol, yahooRange(years));
  return { symbol, candles: res.candles, provider: 'yahoo' };
}
