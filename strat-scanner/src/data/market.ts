import { Timeframe } from '../strat/types';
import { fetchAlpacaTimeframe, isCryptoSymbol } from './alpaca';
import { fetchTimeframe as fetchYahooTimeframe } from './yahoo';
import { TimeframeSeries } from './series';

/**
 * Provider router.
 *
 * Crypto goes to Alpaca — documented endpoint, native 4H/D/W/M bars. Equities,
 * FX and futures stay on Yahoo, which is the only one of the two that serves
 * them at all.
 *
 * Alpaca's crypto list is US-compliance limited, so a token it does not carry
 * comes back empty rather than wrong. That, and any Alpaca outage, falls
 * through to Yahoo: a symbol degrading to the older source beats a symbol
 * dropping out of the scan entirely.
 */

/** Enough bars to type a bar against its predecessor and find a pivot. */
const MIN_USABLE_BARS = 6;

export type ProviderName = 'alpaca' | 'yahoo';

export interface FetchOutcome {
  series: TimeframeSeries;
  provider: ProviderName;
  /** Why Alpaca was not used, when it was tried and passed over */
  fallbackReason?: string;
}

/**
 * Set CRYPTO_PROVIDER=yahoo to pin everything back to the old source without
 * a deploy — the escape hatch if Alpaca misbehaves in a scheduled run.
 */
function cryptoProviderPinned(): ProviderName | null {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const pin = env?.CRYPTO_PROVIDER?.trim().toLowerCase();
  return pin === 'yahoo' || pin === 'alpaca' ? pin : null;
}

export async function fetchTimeframeWithProvider(
  symbol: string,
  tf: Timeframe,
): Promise<FetchOutcome> {
  const pin = cryptoProviderPinned();
  const useAlpaca = isCryptoSymbol(symbol) && pin !== 'yahoo';

  if (useAlpaca) {
    try {
      const series = await fetchAlpacaTimeframe(symbol, tf);
      if (series.completed.length >= MIN_USABLE_BARS) return { series, provider: 'alpaca' };
      if (pin === 'alpaca') return { series, provider: 'alpaca' };
      return {
        series: await fetchYahooTimeframe(symbol, tf),
        provider: 'yahoo',
        fallbackReason: `Alpaca returned ${series.completed.length} bars`,
      };
    } catch (e) {
      if (pin === 'alpaca') throw e;
      return {
        series: await fetchYahooTimeframe(symbol, tf),
        provider: 'yahoo',
        fallbackReason: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return { series: await fetchYahooTimeframe(symbol, tf), provider: 'yahoo' };
}

/** Drop-in replacement for the Yahoo client's fetchTimeframe. */
export async function fetchTimeframe(symbol: string, tf: Timeframe): Promise<TimeframeSeries> {
  return (await fetchTimeframeWithProvider(symbol, tf)).series;
}

export type { TimeframeSeries };
