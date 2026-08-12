import { Candle, Timeframe } from '../strat/types';
import { splitForming, TimeframeSeries } from './series';

/**
 * Market data via Alpaca's crypto bars API.
 *
 * Preferred over Yahoo for crypto for two reasons: it is a documented,
 * versioned endpoint rather than a scraped one, and it serves 4H, daily,
 * weekly and monthly bars natively — no 1H→4H aggregation, so the bars match
 * what a chart draws instead of what we reconstruct.
 *
 * Coverage is US-compliance limited, so tokens Alpaca does not list simply
 * return no bars. That is not an error condition here: the caller (data/market)
 * falls back to Yahoo for those.
 *
 * Auth is optional — headers are sent only when credentials are present, so
 * this works both keyless and with a free paper-account key pair.
 */

const BASE = 'https://data.alpaca.markets/v1beta3/crypto/us/bars';

/** Alpaca's native timeframe strings; every one of ours maps directly. */
const TF_PARAM: Record<Timeframe, string> = {
  '4H': '4Hour',
  D: '1Day',
  W: '1Week',
  M: '1Month',
};

/** How far back to ask for each timeframe, in days. */
const TF_LOOKBACK_DAYS: Record<Timeframe, number> = {
  '4H': 90,
  D: 400,
  W: 5 * 365,
  M: 10 * 365,
};

interface AlpacaBar {
  /** RFC-3339 bar open timestamp */
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface BarsResponse {
  bars?: Record<string, AlpacaBar[] | undefined>;
  next_page_token?: string | null;
  message?: string;
}

/** `BTC-USD` (our watchlist form) → `BTC/USD` (Alpaca's form). */
export const toAlpacaSymbol = (symbol: string): string =>
  symbol.trim().toUpperCase().replace(/-/g, '/');

/** Symbols Alpaca's crypto feed can serve: plain `<COIN>-USD` pairs. */
export const isCryptoSymbol = (symbol: string): boolean =>
  /^[A-Z0-9]{2,10}-USD$/.test(symbol.trim().toUpperCase());

/**
 * Credentials, when the host provides them. Read defensively: this module is
 * also bundled into the React Native app, where `process` may not exist.
 */
function credentials(): Record<string, string> {
  const env = typeof process !== 'undefined' ? process.env : undefined;
  const key = env?.APCA_API_KEY_ID?.trim();
  const secret = env?.APCA_API_SECRET_KEY?.trim();
  return key && secret ? { 'APCA-API-KEY-ID': key, 'APCA-API-SECRET-KEY': secret } : {};
}

export function parseBars(bars: AlpacaBar[]): Candle[] {
  return bars
    .map((b) => ({
      time: Math.floor(new Date(b.t).getTime() / 1000),
      open: b.o,
      high: b.h,
      low: b.l,
      close: b.c,
      volume: b.v ?? 0,
    }))
    .filter((c) => Number.isFinite(c.time) && c.open > 0 && c.high > 0 && c.low > 0 && c.close > 0)
    .sort((a, b) => a.time - b.time);
}

const isoDaysAgo = (days: number): string =>
  new Date(Date.now() - days * 86400 * 1000).toISOString();

/**
 * Fetch one timeframe, following pagination until the feed is exhausted.
 * Throws on transport or API errors; returns an empty series when Alpaca
 * simply does not list the symbol.
 */
export async function fetchAlpacaTimeframe(
  symbol: string,
  tf: Timeframe,
): Promise<TimeframeSeries> {
  const pair = toAlpacaSymbol(symbol);
  const headers = { Accept: 'application/json', ...credentials() };
  const candles: Candle[] = [];
  let pageToken: string | undefined;
  let pages = 0;

  do {
    const params = new URLSearchParams({
      symbols: pair,
      timeframe: TF_PARAM[tf],
      start: isoDaysAgo(TF_LOOKBACK_DAYS[tf]),
      limit: '10000',
      sort: 'asc',
    });
    if (pageToken) params.set('page_token', pageToken);

    const res = await fetch(`${BASE}?${params.toString()}`, { headers });
    if (!res.ok) {
      throw new Error(`${symbol}: Alpaca HTTP ${res.status}`);
    }
    const json = (await res.json()) as BarsResponse;
    if (json.message && !json.bars) throw new Error(`${symbol}: Alpaca: ${json.message}`);

    candles.push(...parseBars(json.bars?.[pair] ?? []));
    pageToken = json.next_page_token ?? undefined;
    pages += 1;
    // Guard against a feed that keeps handing back tokens.
  } while (pageToken && pages < 10);

  const { completed, forming } = splitForming(candles, tf);
  return {
    timeframe: tf,
    completed,
    forming,
    lastPrice: candles[candles.length - 1]?.close ?? 0,
  };
}
