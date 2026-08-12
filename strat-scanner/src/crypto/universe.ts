import { LadderProfile } from '../strat/dca';

/**
 * The crypto scanning universe for the weekly report.
 *
 * Symbols are Yahoo Finance tickers (the same provider the rest of the
 * scanner uses), so everything here is `<COIN>-USD`. The list is deliberately
 * kept to names with real liquidity and a multi-year monthly chart — Strat
 * structure is only meaningful when the higher timeframes have enough history
 * to have printed pivots.
 */

export type CryptoTier = 'major' | 'large' | 'high-beta';

/** Majors: the two assets the rest of the market takes its direction from. */
export const CRYPTO_MAJORS = ['BTC-USD', 'ETH-USD'];

/** Large caps: deep liquidity, established higher-timeframe structure. */
export const CRYPTO_LARGE_CAPS = [
  'SOL-USD',
  'XRP-USD',
  'BNB-USD',
  'ADA-USD',
  'AVAX-USD',
  'LINK-USD',
  'DOT-USD',
  'LTC-USD',
  'DOGE-USD',
];

/** High beta: faster, thinner, deeper drawdowns — laddered differently. */
export const CRYPTO_HIGH_BETA = ['HYPE-USD', 'SUI-USD', 'TAO-USD', 'JUP-USD'];

export const CRYPTO_UNIVERSE = [...CRYPTO_MAJORS, ...CRYPTO_LARGE_CAPS, ...CRYPTO_HIGH_BETA];

const NAMES: Record<string, string> = {
  'BTC-USD': 'Bitcoin',
  'ETH-USD': 'Ethereum',
  'SOL-USD': 'Solana',
  'XRP-USD': 'XRP',
  'BNB-USD': 'BNB',
  'ADA-USD': 'Cardano',
  'AVAX-USD': 'Avalanche',
  'LINK-USD': 'Chainlink',
  'DOT-USD': 'Polkadot',
  'LTC-USD': 'Litecoin',
  'DOGE-USD': 'Dogecoin',
  'HYPE-USD': 'Hyperliquid',
  'SUI-USD': 'Sui',
  'TAO-USD': 'Bittensor',
  'JUP-USD': 'Jupiter',
};

export const cryptoName = (symbol: string): string | undefined => NAMES[symbol.toUpperCase()];

export function tierFor(symbol: string): CryptoTier {
  const s = symbol.toUpperCase();
  if (CRYPTO_MAJORS.includes(s)) return 'major';
  if (CRYPTO_LARGE_CAPS.includes(s)) return 'large';
  return 'high-beta';
}

/**
 * How wide to build the DCA ladder for each tier.
 *
 * Majors hold their higher-timeframe pivots more often, so the ladder sits
 * tighter and front-loads size. High-beta names routinely trade through the
 * first pivot on the way to a deeper one, so their ladder is back-weighted:
 * the deepest rungs — the ones that only fill on a real flush — carry the size.
 */
export function ladderProfileFor(symbol: string): LadderProfile {
  const tier = tierFor(symbol);
  return tier === 'major' ? 'tight' : tier === 'large' ? 'balanced' : 'wide';
}
