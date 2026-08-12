import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAlpacaTimeframe, isCryptoSymbol, parseBars, toAlpacaSymbol } from '../data/alpaca';
import { fetchTimeframeWithProvider } from '../data/market';
import { splitForming } from '../data/series';
import { Candle } from '../strat/types';

const HOUR = 3600;

const alpacaBar = (iso: string, o: number, h: number, l: number, c: number, v = 100) => ({
  t: iso,
  o,
  h,
  l,
  c,
  v,
});

/** A day of bars ending well in the past, so nothing counts as still forming. */
const dailyBars = (n: number) =>
  Array.from({ length: n }, (_, i) =>
    alpacaBar(new Date(Date.UTC(2024, 0, i + 1)).toISOString(), 100 + i, 105 + i, 95 + i, 102 + i),
  );

const jsonResponse = (body: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => body,
  text: async () => JSON.stringify(body),
});

describe('symbol mapping', () => {
  it('converts watchlist symbols to Alpaca pairs', () => {
    expect(toAlpacaSymbol('BTC-USD')).toBe('BTC/USD');
    expect(toAlpacaSymbol('btc-usd')).toBe('BTC/USD');
  });

  it('routes only plain coin pairs to the crypto feed', () => {
    for (const s of ['BTC-USD', 'ETH-USD', 'HYPE-USD', 'DOGE-USD']) {
      expect(isCryptoSymbol(s)).toBe(true);
    }
    for (const s of ['SPY', 'AAPL', 'EURUSD=X', 'GC=F', '^GSPC']) {
      expect(isCryptoSymbol(s)).toBe(false);
    }
  });
});

describe('parseBars', () => {
  it('converts RFC-3339 timestamps to unix seconds in ascending order', () => {
    const candles = parseBars([
      alpacaBar('2024-01-02T00:00:00Z', 2, 3, 1, 2.5),
      alpacaBar('2024-01-01T00:00:00Z', 1, 2, 0.5, 1.5),
    ]);
    expect(candles.map((c) => c.time)).toEqual([
      Date.UTC(2024, 0, 1) / 1000,
      Date.UTC(2024, 0, 2) / 1000,
    ]);
    expect(candles[0].close).toBe(1.5);
  });

  it('drops malformed bars rather than feeding zeros to the engine', () => {
    const candles = parseBars([
      alpacaBar('2024-01-01T00:00:00Z', 0, 0, 0, 0),
      alpacaBar('not-a-date', 1, 2, 0.5, 1.5),
      alpacaBar('2024-01-03T00:00:00Z', 1, 2, 0.5, 1.5),
    ]);
    expect(candles).toHaveLength(1);
  });
});

describe('splitForming', () => {
  const bar = (time: number): Candle => ({ time, open: 1, high: 2, low: 0.5, close: 1.5, volume: 1 });

  it('treats the last bar as forming while its window is still open', () => {
    const now = Math.floor(Date.now() / 1000);
    const { completed, forming } = splitForming([bar(now - 10 * HOUR), bar(now - HOUR)], '4H');
    expect(completed).toHaveLength(1);
    expect(forming?.time).toBe(now - HOUR);
  });

  it('treats a closed window as completed', () => {
    const now = Math.floor(Date.now() / 1000);
    const { completed, forming } = splitForming([bar(now - 20 * HOUR), bar(now - 9 * HOUR)], '4H');
    expect(completed).toHaveLength(2);
    expect(forming).toBeNull();
  });
});

describe('fetchAlpacaTimeframe', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => vi.unstubAllGlobals());

  it('requests the native timeframe and keys bars off the pair', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ bars: { 'BTC/USD': dailyBars(10) } }));
    const series = await fetchAlpacaTimeframe('BTC-USD', '4H');

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain('symbols=BTC%2FUSD');
    expect(url).toContain('timeframe=4Hour');
    expect(series.completed.length + (series.forming ? 1 : 0)).toBe(10);
    expect(series.lastPrice).toBeGreaterThan(0);
  });

  it('follows pagination until the feed is exhausted', async () => {
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ bars: { 'BTC/USD': dailyBars(5) }, next_page_token: 'page2' }),
      )
      .mockResolvedValueOnce(jsonResponse({ bars: { 'BTC/USD': dailyBars(5) } }));
    const series = await fetchAlpacaTimeframe('BTC-USD', 'D');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toContain('page_token=page2');
    expect(series.completed.length).toBeGreaterThan(0);
  });

  it('returns an empty series for a token Alpaca does not list', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ bars: {} }));
    const series = await fetchAlpacaTimeframe('HYPE-USD', 'D');
    expect(series.completed).toEqual([]);
    expect(series.forming).toBeNull();
  });

  it('throws on an HTTP error so the caller can fall back', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'forbidden' }, false, 403));
    await expect(fetchAlpacaTimeframe('BTC-USD', 'D')).rejects.toThrow(/403/);
  });
});

describe('provider routing', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    delete process.env.CRYPTO_PROVIDER;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.CRYPTO_PROVIDER;
  });

  it('serves crypto from Alpaca when it has the bars', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ bars: { 'BTC/USD': dailyBars(30) } }));
    const out = await fetchTimeframeWithProvider('BTC-USD', 'D');
    expect(out.provider).toBe('alpaca');
    expect(out.fallbackReason).toBeUndefined();
  });

  it('falls back to Yahoo for a token Alpaca does not carry', async () => {
    fetchMock.mockImplementation((url: string) =>
      String(url).includes('alpaca')
        ? Promise.resolve(jsonResponse({ bars: {} }))
        : Promise.resolve(
            jsonResponse({
              chart: {
                result: [
                  {
                    meta: { regularMarketPrice: 42, gmtoffset: 0 },
                    timestamp: [1, 2, 3],
                    indicators: {
                      quote: [{ open: [1, 2, 3], high: [2, 3, 4], low: [0, 1, 2], close: [1, 2, 3], volume: [1, 1, 1] }],
                    },
                  },
                ],
              },
            }),
          ),
    );
    const out = await fetchTimeframeWithProvider('HYPE-USD', 'D');
    expect(out.provider).toBe('yahoo');
    expect(out.fallbackReason).toMatch(/0 bars/);
  });

  it('falls back to Yahoo when Alpaca errors', async () => {
    fetchMock.mockImplementation((url: string) =>
      String(url).includes('alpaca')
        ? Promise.resolve(jsonResponse({}, false, 500))
        : Promise.resolve(
            jsonResponse({
              chart: {
                result: [
                  {
                    meta: { regularMarketPrice: 42, gmtoffset: 0 },
                    timestamp: [1, 2, 3],
                    indicators: {
                      quote: [{ open: [1, 2, 3], high: [2, 3, 4], low: [0, 1, 2], close: [1, 2, 3], volume: [1, 1, 1] }],
                    },
                  },
                ],
              },
            }),
          ),
    );
    const out = await fetchTimeframeWithProvider('BTC-USD', 'D');
    expect(out.provider).toBe('yahoo');
    expect(out.fallbackReason).toMatch(/500/);
  });

  it('never sends equities, FX or futures to the crypto feed', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        chart: {
          result: [
            {
              meta: { regularMarketPrice: 500, gmtoffset: 0 },
              timestamp: [1, 2],
              indicators: { quote: [{ open: [1, 2], high: [2, 3], low: [0, 1], close: [1, 2], volume: [1, 1] }] },
            },
          ],
        },
      }),
    );
    for (const symbol of ['SPY', 'EURUSD=X']) {
      const out = await fetchTimeframeWithProvider(symbol, 'D');
      expect(out.provider).toBe('yahoo');
    }
    for (const call of fetchMock.mock.calls) expect(String(call[0])).not.toContain('alpaca');
  });

  it('pins back to Yahoo when CRYPTO_PROVIDER says so', async () => {
    process.env.CRYPTO_PROVIDER = 'yahoo';
    fetchMock.mockResolvedValue(
      jsonResponse({
        chart: {
          result: [
            {
              meta: { regularMarketPrice: 42, gmtoffset: 0 },
              timestamp: [1, 2],
              indicators: { quote: [{ open: [1, 2], high: [2, 3], low: [0, 1], close: [1, 2], volume: [1, 1] }] },
            },
          ],
        },
      }),
    );
    const out = await fetchTimeframeWithProvider('BTC-USD', 'D');
    expect(out.provider).toBe('yahoo');
    for (const call of fetchMock.mock.calls) expect(String(call[0])).not.toContain('alpaca');
  });
});
