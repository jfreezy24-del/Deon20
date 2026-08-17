import { describe, expect, it } from 'vitest';
import {
  annualisedVol,
  buildRegimeCalendar,
  SMA_PERIOD,
  trendAt,
  volAt,
  volRegime,
  VOL_PERIOD,
} from '../strat/regime';
import { Candle } from '../strat/types';

const DAY = 86400;
const T0 = Date.UTC(2020, 0, 1) / 1000;

const closes = (values: number[]): Candle[] =>
  values.map((c, i) => ({
    time: T0 + i * DAY,
    open: c,
    high: c * 1.01,
    low: c * 0.99,
    close: c,
    volume: 1000,
  }));

const iso = (i: number) => new Date((T0 + i * DAY) * 1000).toISOString().slice(0, 10);

describe('annualisedVol', () => {
  it('is zero for a flat series', () => {
    expect(annualisedVol(closes(Array(30).fill(100)))).toBe(0);
  });

  it('rises with the size of the swings', () => {
    const calm = closes(Array.from({ length: 40 }, (_, i) => 100 + (i % 2 ? 0.1 : -0.1)));
    const wild = closes(Array.from({ length: 40 }, (_, i) => 100 + (i % 2 ? 5 : -5)));
    expect(annualisedVol(wild)).toBeGreaterThan(annualisedVol(calm));
  });

  it('does not divide by zero on a degenerate sample', () => {
    expect(annualisedVol([])).toBe(0);
    expect(annualisedVol(closes([100]))).toBe(0);
    expect(annualisedVol(closes([100, 101]))).toBe(0);
  });
});

describe('volRegime', () => {
  it('bands on fixed thresholds, not sample quantiles', () => {
    expect(volRegime(0.05)).toBe('Low vol (<12%)');
    expect(volRegime(0.15)).toBe('Normal vol (12–20%)');
    expect(volRegime(0.45)).toBe('High vol (>20%)');
  });
});

describe('buildRegimeCalendar', () => {
  // A long uptrend, so late dates sit above the 200-day average.
  const rising = closes(Array.from({ length: 300 }, (_, i) => 100 + i));
  const cal = buildRegimeCalendar('SPY', rising);

  it('labels nothing before there is enough history for the average', () => {
    expect(cal.trend.has(iso(0))).toBe(false);
    expect(cal.trend.has(iso(SMA_PERIOD - 2))).toBe(false);
    expect(cal.trend.has(iso(SMA_PERIOD - 1))).toBe(true);
  });

  it('calls a sustained uptrend risk-on', () => {
    expect(trendAt(cal, iso(280))).toBe('Risk-on (above 200DMA)');
  });

  it('calls a sustained downtrend risk-off', () => {
    const falling = closes(Array.from({ length: 300 }, (_, i) => 400 - i));
    const c = buildRegimeCalendar('SPY', falling);
    expect(trendAt(c, iso(280))).toBe('Risk-off (below 200DMA)');
  });

  it('starts volatility labels after its own shorter warm-up', () => {
    expect(cal.vol.has(iso(VOL_PERIOD - 1))).toBe(false);
    expect(cal.vol.has(iso(VOL_PERIOD))).toBe(true);
  });

  it('reports Unknown for a date it does not carry rather than guessing', () => {
    // A weekend crypto signal has no equity-benchmark label. Falling back to
    // the nearest weekday would silently attribute it to Friday's regime.
    expect(trendAt(cal, '1999-01-01')).toBe('Unknown');
    expect(volAt(cal, '1999-01-01')).toBe('Unknown');
  });

  it('records the span it covers', () => {
    expect(cal.benchmark).toBe('SPY');
    expect(cal.firstDate).toBe(iso(0));
    expect(cal.lastDate).toBe(iso(299));
  });

  it('handles an empty benchmark without throwing', () => {
    const empty = buildRegimeCalendar('SPY', []);
    expect(empty.trend.size).toBe(0);
    expect(empty.firstDate).toBeUndefined();
  });
});
