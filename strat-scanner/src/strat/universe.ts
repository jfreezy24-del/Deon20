/**
 * The Algo Alerts trade universe: Mag 7 stocks plus the most liquid US ETFs.
 * No penny stocks, no lottery tickets — only structure from names that move
 * the needle. Kept free of React Native imports so the alert server can use
 * it directly.
 */

export const MAG7 = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA'];

export const LIQUID_ETFS = [
  'SPY', // S&P 500
  'QQQ', // Nasdaq-100
  'IWM', // Russell 2000
  'DIA', // Dow Jones
  'SMH', // Semiconductors
  'XLK', // Technology
  'XLF', // Financials
  'XLE', // Energy
  'XLV', // Health care
  'XLY', // Consumer discretionary
  'XLI', // Industrials
  'XLP', // Consumer staples
  'XLU', // Utilities
  'XLC', // Communication services
  'GLD', // Gold
  'TLT', // 20y+ Treasuries
];

export const ALGO_UNIVERSE = [...LIQUID_ETFS, ...MAG7];

const ETF_NAMES: Record<string, string> = {
  SPY: 'S&P 500',
  QQQ: 'Nasdaq-100',
  IWM: 'Russell 2000',
  DIA: 'Dow Jones',
  SMH: 'Semiconductors',
  XLK: 'Technology',
  XLF: 'Financials',
  XLE: 'Energy',
  XLV: 'Health Care',
  XLY: 'Consumer Discretionary',
  XLI: 'Industrials',
  XLP: 'Consumer Staples',
  XLU: 'Utilities',
  XLC: 'Communication Services',
  GLD: 'Gold',
  TLT: 'Long Treasuries',
};

/**
 * Members of each ETF drawn from the universe itself, so an ETF alert can
 * surface related plays from the same sweep (and vice versa). Only heavy
 * index weights are listed — the point is "the spark for related setups in
 * that sector", not a full constituent list.
 */
const ETF_MEMBERS: Record<string, string[]> = {
  SPY: MAG7,
  QQQ: MAG7,
  DIA: ['AAPL', 'MSFT', 'NVDA', 'AMZN'],
  SMH: ['NVDA'],
  XLK: ['AAPL', 'MSFT', 'NVDA'],
  XLC: ['GOOGL', 'META'],
  XLY: ['AMZN', 'TSLA'],
};

export const isEtf = (symbol: string): boolean => LIQUID_ETFS.includes(symbol);

export const etfName = (symbol: string): string | undefined => ETF_NAMES[symbol];

/** Universe stocks inside an ETF (empty for non-ETFs and unmapped ETFs). */
export function etfMembers(symbol: string): string[] {
  return ETF_MEMBERS[symbol] ?? [];
}

/** ETFs in the universe that hold this stock as a heavy weight. */
export function sectorEtfsFor(symbol: string): string[] {
  return Object.keys(ETF_MEMBERS).filter((etf) => ETF_MEMBERS[etf].includes(symbol));
}

/** All symbols related to `symbol`: an ETF's members, or a stock's sector ETFs. */
export function relatedSymbols(symbol: string): string[] {
  return isEtf(symbol) ? etfMembers(symbol) : sectorEtfsFor(symbol);
}
