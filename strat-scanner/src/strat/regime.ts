import { Candle } from './types';

/**
 * Market regime labels, so an edge can be checked for stability rather than
 * quoted as one number.
 *
 * A ten-year backtest reports a single expectancy. That number hides the only
 * question that matters for trusting it: was the edge there throughout, or was
 * it one year? An edge that lived entirely in 2020 and has been flat since
 * reads identically to a durable one until you split it.
 *
 * Two splits, both computed from a benchmark's daily bars — no new data source,
 * and both are things a trader can actually see on the day:
 *
 *  - **Trend** — benchmark above or below its 200-day average. The crudest
 *    risk-on/risk-off line there is, and the one most widely watched.
 *  - **Volatility** — annualised 20-day realised volatility, banded. A proxy
 *    for VIX that needs no options data.
 *
 * Both use **fixed thresholds**, never sample quantiles. Terciles computed over
 * the whole history would label each day using volatility that had not happened
 * yet — mild look-ahead, and exactly the kind that makes a regime split look
 * more decisive than it is.
 */

export type TrendRegime = 'Risk-on (above 200DMA)' | 'Risk-off (below 200DMA)';
export type VolRegime = 'Low vol (<12%)' | 'Normal vol (12–20%)' | 'High vol (>20%)';

export interface RegimeCalendar {
  /** ISO yyyy-mm-dd → trend label. */
  trend: Map<string, TrendRegime>;
  /** ISO yyyy-mm-dd → volatility label. */
  vol: Map<string, VolRegime>;
  /** Benchmark the labels were derived from. */
  benchmark: string;
  firstDate?: string;
  lastDate?: string;
}

export const SMA_PERIOD = 200;
export const VOL_PERIOD = 20;

/** Annualised realised volatility bands, as decimals. */
export const VOL_BANDS = { low: 0.12, high: 0.2 };

const isoDate = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

/** Annualised standard deviation of daily log returns over `bars`. */
export function annualisedVol(bars: Candle[]): number {
  if (bars.length < 3) return 0;
  const returns: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1].close;
    const cur = bars[i].close;
    if (prev > 0 && cur > 0) returns.push(Math.log(cur / prev));
  }
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252);
}

export const volRegime = (annualised: number): VolRegime =>
  annualised < VOL_BANDS.low
    ? 'Low vol (<12%)'
    : annualised > VOL_BANDS.high
      ? 'High vol (>20%)'
      : 'Normal vol (12–20%)';

/**
 * Label every date in the benchmark's history.
 *
 * Dates before there is enough history to compute an average are simply left
 * unlabelled rather than guessed at; the report shows them as "Unknown" so a
 * thin early sample is visible instead of silently folded into one of the real
 * buckets.
 */
export function buildRegimeCalendar(benchmark: string, daily: Candle[]): RegimeCalendar {
  const bars = [...daily].sort((a, b) => a.time - b.time);
  const trend = new Map<string, TrendRegime>();
  const vol = new Map<string, VolRegime>();

  let smaSum = 0;
  for (let i = 0; i < bars.length; i++) {
    smaSum += bars[i].close;
    if (i >= SMA_PERIOD) smaSum -= bars[i - SMA_PERIOD].close;

    const date = isoDate(bars[i].time);

    if (i >= SMA_PERIOD - 1) {
      const sma = smaSum / SMA_PERIOD;
      trend.set(date, bars[i].close >= sma ? 'Risk-on (above 200DMA)' : 'Risk-off (below 200DMA)');
    }
    if (i >= VOL_PERIOD) {
      vol.set(date, volRegime(annualisedVol(bars.slice(i - VOL_PERIOD, i + 1))));
    }
  }

  return {
    trend,
    vol,
    benchmark,
    firstDate: bars.length > 0 ? isoDate(bars[0].time) : undefined,
    lastDate: bars.length > 0 ? isoDate(bars[bars.length - 1].time) : undefined,
  };
}

/**
 * Look a date up, tolerating dates the calendar does not carry.
 *
 * Crypto trades at the weekend and the equity benchmark does not, so a Saturday
 * signal has no same-day label. Falling back to "Unknown" rather than to the
 * nearest weekday keeps the buckets honest — the alternative silently attributes
 * weekend crypto to Friday's regime.
 */
export const trendAt = (cal: RegimeCalendar, date: string): string =>
  cal.trend.get(date) ?? 'Unknown';

export const volAt = (cal: RegimeCalendar, date: string): string =>
  cal.vol.get(date) ?? 'Unknown';
