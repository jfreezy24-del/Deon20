import { describe, expect, it } from 'vitest';
import {
  aggregate,
  backtestSymbol,
  DEFAULT_BACKTEST_OPTIONS,
  monthStart,
  weekStart,
} from '../strat/backtest';
import { Candle } from '../strat/types';

const DAY = 86400;
/** 2024-01-01 was a Monday — a clean start for week-boundary assertions. */
const MONDAY = Date.UTC(2024, 0, 1) / 1000;

/** Deterministic pseudo-random walk, so the replay is reproducible. */
function walk(n: number, seed = 42): Candle[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  const out: Candle[] = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    const drift = (rnd() - 0.48) * 4;
    const open = price;
    const close = Math.max(1, open + drift);
    const high = Math.max(open, close) + rnd() * 2;
    const low = Math.min(open, close) - rnd() * 2;
    out.push({
      time: MONDAY + i * DAY,
      open,
      high,
      low: Math.max(0.5, low),
      close,
      volume: Math.round(1000 + rnd() * 500),
    });
    price = close;
  }
  return out;
}

describe('calendar bucketing', () => {
  it('snaps to the UTC Monday of the week', () => {
    expect(weekStart(MONDAY)).toBe(MONDAY);
    expect(weekStart(MONDAY + 3 * DAY)).toBe(MONDAY); // Thursday
    expect(weekStart(MONDAY + 6 * DAY)).toBe(MONDAY); // Sunday
    expect(weekStart(MONDAY + 7 * DAY)).toBe(MONDAY + 7 * DAY); // next Monday
  });

  it('snaps to the first of the month', () => {
    const jan15 = Date.UTC(2024, 0, 15) / 1000;
    expect(monthStart(jan15)).toBe(Date.UTC(2024, 0, 1) / 1000);
    expect(monthStart(Date.UTC(2024, 1, 29) / 1000)).toBe(Date.UTC(2024, 1, 1) / 1000);
  });
});

describe('aggregate', () => {
  it('rolls daily bars into one candle: first open, last close, extremes, summed volume', () => {
    const bars: Candle[] = [
      { time: 1, open: 10, high: 12, low: 9, close: 11, volume: 100 },
      { time: 2, open: 11, high: 15, low: 8, close: 14, volume: 200 },
      { time: 3, open: 14, high: 14, low: 13, close: 13, volume: 300 },
    ];
    expect(aggregate(bars, 0)).toEqual({
      time: 0,
      open: 10,
      high: 15,
      low: 8,
      close: 13,
      volume: 600,
    });
  });
});

describe('backtestSymbol', () => {
  const daily = walk(900);

  it('returns nothing when history is too short to publish anything', () => {
    expect(backtestSymbol('X', walk(10))).toEqual([]);
    expect(backtestSymbol('X', [])).toEqual([]);
  });

  it('publishes signals across every requested timeframe', () => {
    const signals = backtestSymbol('X', daily);
    const tfs = new Set(signals.map((s) => s.timeframe));
    expect(tfs).toEqual(new Set(['D', 'W', 'M']));
    expect(signals.length).toBeGreaterThan(100);
  });

  it('resolves the overwhelming majority of what it publishes', () => {
    const signals = backtestSymbol('X', daily);
    const unresolved = signals.filter((s) => s.status === 'OPEN' || s.status === 'PENDING');
    // Only the tail of the history should still be open.
    expect(unresolved.length / signals.length).toBeLessThan(0.15);
  });

  it('anchors weekly setups to Mondays and monthly setups to the first', () => {
    // The key encodes the actionable bar's time; a weekly bar starts on a
    // Monday and a monthly one on the first, or the aggregation is wrong.
    const barTime = (key: string) => Number(key.split('|').pop());

    for (const s of backtestSymbol('X', daily, { timeframes: ['W'] })) {
      expect(weekStart(barTime(s.key))).toBe(barTime(s.key));
    }
    for (const s of backtestSymbol('X', daily, { timeframes: ['M'] })) {
      expect(monthStart(barTime(s.key))).toBe(barTime(s.key));
    }
  });

  it('publishes each higher-timeframe setup once, not once per day', () => {
    const weekly = backtestSymbol('X', daily, { timeframes: ['W'] });
    // Two scenarios per actionable bar at most, over ~128 weeks of history.
    expect(weekly.length).toBeLessThan(300);
    expect(weekly.length).toBeGreaterThan(50);
  });

  it('honours the confidence floor', () => {
    const all = backtestSymbol('X', daily, { minConfidence: 0 });
    const high = backtestSymbol('X', daily, { minConfidence: 70 });
    expect(high.length).toBeLessThan(all.length);
    expect(high.every((s) => s.confidence >= 70)).toBe(true);
  });

  it('never awards the in-force bonus, which cannot exist at a bar close', () => {
    const signals = backtestSymbol('X', daily);
    expect(signals.some((s) => s.factorKeys.includes('in-force'))).toBe(false);
  });

  it('spans the full confidence range, so calibration has something to compare', () => {
    const signals = backtestSymbol('X', daily);
    const confidences = signals.map((s) => s.confidence);
    expect(Math.min(...confidences)).toBeLessThan(45);
    expect(Math.max(...confidences)).toBeGreaterThan(60);
  });
});

describe('backtestSymbol — no look-ahead', () => {
  it('scores a signal identically whether or not the future exists', () => {
    // The strongest guarantee available: truncate the history right after a
    // signal was published and its confidence, levels and continuity must be
    // bit-for-bit identical. Anything that peeked at later bars would move.
    const full = walk(600);
    const cut = 420;
    const truncated = full.slice(0, cut);

    const fromFull = backtestSymbol('X', full);
    const fromTruncated = backtestSymbol('X', truncated);

    const cutTime = full[cut - 1].time;
    const comparable = (s: { date: string }) => Date.parse(`${s.date}T00:00:00Z`) / 1000 < cutTime;

    const a = fromFull.filter(comparable);
    const b = fromTruncated.filter(comparable);
    expect(b.length).toBeGreaterThan(20);
    expect(a.length).toBe(b.length);

    for (let i = 0; i < b.length; i++) {
      expect(a[i].key).toBe(b[i].key);
      expect(a[i].confidence).toBe(b[i].confidence);
      expect(a[i].promisedR).toBe(b[i].promisedR);
      expect(a[i].aligned).toBe(b[i].aligned);
      expect(a[i].opposed).toBe(b[i].opposed);
      expect(a[i].factorKeys).toEqual(b[i].factorKeys);
    }
  });

  it('reconstructs a partial week rather than the whole one', () => {
    // A week that closes far above its midweek level: if continuity read the
    // finished weekly bar, midweek signals would all show the week as up.
    const bars: Candle[] = [];
    for (let w = 0; w < 40; w++) {
      for (let d = 0; d < 7; d++) {
        const t = MONDAY + (w * 7 + d) * DAY;
        // Down all week until the last day, which rips higher.
        const base = 100 - w * 0.1;
        const isLast = d === 6;
        const open = isLast ? base - 5 : base - d;
        const close = isLast ? base + 8 : base - d - 1;
        bars.push({
          time: t,
          open,
          high: Math.max(open, close) + 0.5,
          low: Math.min(open, close) - 0.5,
          close,
          volume: 1000,
        });
      }
    }
    const signals = backtestSymbol('X', bars, { timeframes: ['D'], minConfidence: 0 });
    // Midweek daily longs must not be credited with an up week: at least some
    // bullish midweek signals should show the weekly timeframe opposing them.
    const bullish = signals.filter((s) => s.direction === 'bullish');
    expect(bullish.some((s) => s.opposed > 0)).toBe(true);
  });
});

describe('DEFAULT_BACKTEST_OPTIONS', () => {
  it('keeps the confidence floor at zero so losing signals stay in the sample', () => {
    expect(DEFAULT_BACKTEST_OPTIONS.minConfidence).toBe(0);
  });

  it('excludes 4H, which daily history cannot reconstruct', () => {
    expect(DEFAULT_BACKTEST_OPTIONS.timeframes).not.toContain('4H');
  });
});
