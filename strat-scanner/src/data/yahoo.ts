import { Candle, Timeframe } from '../strat/types';
import { aggregateTo4H } from './aggregate';
import { splitForming, TimeframeSeries } from './series';

export type { TimeframeSeries };

/**
 * Market data via Yahoo Finance's public chart API. Works for stocks, ETFs,
 * indices (^GSPC), crypto (BTC-USD), FX (EURUSD=X) and futures (GC=F) with no
 * API key. Yahoo has no native 4H interval, so 4H is built from 1H bars.
 */

const BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';

interface ChartResponse {
  chart: {
    result?: {
      meta: {
        regularMarketPrice?: number;
        gmtoffset?: number;
        shortName?: string;
        longName?: string;
      };
      timestamp?: number[];
      indicators: {
        quote: {
          open: (number | null)[];
          high: (number | null)[];
          low: (number | null)[];
          close: (number | null)[];
          volume: (number | null)[];
        }[];
      };
    }[];
    error?: { code: string; description: string } | null;
  };
}

export interface SeriesResult {
  candles: Candle[];
  lastPrice: number;
  gmtOffsetSeconds: number;
  name?: string;
}

async function fetchChart(symbol: string, interval: string, range: string): Promise<SeriesResult> {
  const url = `${BASE}${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false&events=div%2Csplit`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StratScanner/1.0)',
      Accept: 'application/json',
    },
  });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status} from data provider`);
  const json = (await res.json()) as ChartResponse;
  if (json.chart.error) throw new Error(`${symbol}: ${json.chart.error.description}`);
  const result = json.chart.result?.[0];
  if (!result?.timestamp?.length) throw new Error(`${symbol}: no data returned`);

  const q = result.indicators.quote[0];
  const candles: Candle[] = [];
  for (let i = 0; i < result.timestamp.length; i++) {
    const o = q.open[i];
    const h = q.high[i];
    const l = q.low[i];
    const c = q.close[i];
    if (o == null || h == null || l == null || c == null) continue;
    candles.push({
      time: result.timestamp[i],
      open: o,
      high: h,
      low: l,
      close: c,
      volume: q.volume[i] ?? 0,
    });
  }
  return {
    candles,
    lastPrice: result.meta.regularMarketPrice ?? candles[candles.length - 1]?.close ?? 0,
    gmtOffsetSeconds: result.meta.gmtoffset ?? 0,
    name: result.meta.shortName ?? result.meta.longName,
  };
}

export async function fetchTimeframe(symbol: string, tf: Timeframe): Promise<TimeframeSeries> {
  let series: SeriesResult;
  let candles: Candle[];

  if (tf === '4H') {
    series = await fetchChart(symbol, '1h', '60d');
    candles = aggregateTo4H(series.candles, series.gmtOffsetSeconds);
  } else if (tf === 'D') {
    series = await fetchChart(symbol, '1d', '1y');
    candles = series.candles;
  } else if (tf === 'W') {
    series = await fetchChart(symbol, '1wk', '5y');
    candles = series.candles;
  } else {
    series = await fetchChart(symbol, '1mo', '10y');
    candles = series.candles;
  }

  const { completed, forming } = splitForming(candles, tf);
  return { timeframe: tf, completed, forming, lastPrice: series.lastPrice, name: series.name };
}
