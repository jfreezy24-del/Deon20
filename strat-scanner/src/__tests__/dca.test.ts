import { describe, expect, it } from 'vitest';
import { buildDcaPlan, findPivotHighs, findPivotLows } from '../strat/dca';
import { Candle } from '../strat/types';

const WEEK = 7 * 86400;

/** Series where each bar's low drives structure; highs sit 10 above the low. */
const series = (lows: number[], step = WEEK): Candle[] =>
  lows.map((low, i) => ({
    time: 1_700_000_000 + i * step,
    open: low + 4,
    high: low + 10,
    low,
    close: low + 6,
    volume: 1000,
  }));

// A long base that steps up, leaving clean pivot lows at 90 (idx 2) and
// 98 (idx 6), then trends higher into the current price of 150.
const WEEKLY_LOWS = [100, 95, 90, 95, 100, 105, 98, 103, 110, 115, 120, 118, 125, 130, 140];
// Monthly structure with an old deep pivot at 50 and a recent one at 100.
const MONTHLY_LOWS = [60, 55, 50, 62, 70, 68, 80, 92, 105, 100, 118, 132, 120, 100, 105, 130, 140];

const weeklyInput = (lastPrice: number) => ({
  symbol: 'BTC-USD',
  lastPrice,
  weekly: { completed: series(WEEKLY_LOWS), forming: null },
  monthly: { completed: series(MONTHLY_LOWS, 30 * 86400), forming: null },
});

describe('pivot detection', () => {
  it('finds swing lows that hold against the bars on both sides', () => {
    const lows = findPivotLows(series(WEEKLY_LOWS)).map((c) => c.low);
    expect(lows).toContain(90);
    expect(lows).toContain(98);
    expect(lows).not.toContain(140); // last bars can never be confirmed pivots
  });

  it('finds swing highs as the mirror image', () => {
    const highs = findPivotHighs(series([100, 110, 130, 108, 99, 104, 96])).map((c) => c.high);
    expect(highs).toEqual([140]); // idx 2: low 130 + 10
  });

  it('returns nothing when there are not enough bars to confirm a pivot', () => {
    expect(findPivotLows(series([100, 90, 95]))).toEqual([]);
  });
});

describe('buildDcaPlan', () => {
  it('places every rung below the current price, deepest last', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    expect(plan.rungs.length).toBeGreaterThan(1);
    for (const r of plan.rungs) {
      expect(r.price).toBeLessThan(150);
      expect(r.discountPct).toBeGreaterThan(0);
    }
    const prices = plan.rungs.map((r) => r.price);
    expect([...prices].sort((a, b) => b - a)).toEqual(prices);
  });

  it('allocates exactly 100% across the ladder', () => {
    for (const profile of ['tight', 'balanced', 'wide'] as const) {
      const plan = buildDcaPlan({ ...weeklyInput(150), profile });
      expect(plan.rungs.reduce((sum, r) => sum + r.allocationPct, 0)).toBe(100);
    }
  });

  it('front-loads majors and back-loads high-beta names', () => {
    const tight = buildDcaPlan({ ...weeklyInput(150), profile: 'tight' }).rungs;
    const wide = buildDcaPlan({ ...weeklyInput(150), profile: 'wide' }).rungs;
    expect(tight[0].allocationPct).toBeGreaterThan(tight[tight.length - 1].allocationPct);
    expect(wide[0].allocationPct).toBeLessThan(wide[wide.length - 1].allocationPct);
  });

  it('spaces rungs apart instead of stacking them on one level', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    for (let i = 1; i < plan.rungs.length; i++) {
      const gap = (plan.rungs[i - 1].price - plan.rungs[i].price) / plan.rungs[i - 1].price;
      expect(gap).toBeGreaterThanOrEqual(0.02);
    }
  });

  it('refuses rungs deeper than the profile allows', () => {
    // The 50 pivot is ~67% below price: structure, but not a bid worth resting.
    for (const [profile, maxDepth] of [
      ['tight', 35],
      ['balanced', 50],
      ['wide', 65],
    ] as const) {
      const plan = buildDcaPlan({ ...weeklyInput(150), profile });
      for (const r of plan.rungs) expect(r.discountPct).toBeLessThanOrEqual(maxDepth);
    }
  });

  it('sets invalidation below the deepest rung', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    expect(plan.invalidation).toBeLessThan(plan.rungs[plan.rungs.length - 1].price);
  });

  it('reports the average fill and the nearest magnitude above price', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    const deepest = plan.rungs[plan.rungs.length - 1].price;
    expect(plan.averageFill).toBeGreaterThan(deepest);
    expect(plan.averageFill).toBeLessThan(150);
    expect(plan.magnitude === null || plan.magnitude > 150).toBe(true);
  });

  it('turns defensive once price loses the last monthly pivot low', () => {
    const plan = buildDcaPlan(weeklyInput(95));
    expect(plan.stance).toBe('defensive');
    expect(plan.stanceReason).toMatch(/monthly/i);
  });

  it('accumulates when the weekly and monthly candles are both trading up', () => {
    const up = (low: number): Candle => ({
      time: 1_800_000_000,
      open: low + 1,
      high: low + 12,
      low,
      close: low + 10,
      volume: 1000,
    });
    const base = weeklyInput(150);
    const plan = buildDcaPlan({
      ...base,
      weekly: { ...base.weekly, forming: up(142) },
      monthly: { ...base.monthly, forming: up(138) },
    });
    expect(plan.stance).toBe('accumulate');
  });

  it('falls back to measured rungs when price is below all prior structure', () => {
    const plan = buildDcaPlan(weeklyInput(45));
    expect(plan.rungs.length).toBeGreaterThanOrEqual(2);
    expect(plan.rungs.some((r) => r.source === 'Measured move')).toBe(true);
    for (const r of plan.rungs) expect(r.price).toBeLessThan(45);
  });

  it('survives an empty series without throwing', () => {
    const plan = buildDcaPlan({
      symbol: 'NEW-USD',
      lastPrice: 10,
      weekly: { completed: [], forming: null },
      monthly: { completed: [], forming: null },
    });
    expect(plan.invalidation).toBeLessThan(10);
    expect(plan.weeklyType).toBeNull();
    expect(plan.rungs.every((r) => r.price < 10)).toBe(true);
  });

  it('classifies the last completed weekly and monthly bars', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    expect(plan.weeklyType).toBe('2u'); // 140 low > 130 low, high also higher
    expect(plan.monthlyType).toBe('2u');
  });
});
