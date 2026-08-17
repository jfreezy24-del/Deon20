import { describe, expect, it } from 'vitest';
import { buildDcaPlan, findPivotLows, monthlyPivotBreak } from '../strat/dca';
import { Candle } from '../strat/types';

const WEEK = 7 * 86400;

/** Monthly bars written as [low, close], so a break can be aimed precisely. */
const monthlyBars = (bars: [low: number, close: number][]): Candle[] =>
  bars.map(([low, close], i) => ({
    time: 1_700_000_000 + i * 30 * 86400,
    open: close,
    high: Math.max(low, close) + 5,
    low,
    close,
    volume: 1000,
  }));

/** A confirmed monthly pivot low at 80, never closed below. */
const INTACT: [number, number][] = [
  [100, 106],
  [90, 96],
  [80, 86],
  [90, 96],
  [100, 106],
  [110, 116],
  [120, 126],
];

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

  it('reports the average fill between the shallowest and deepest rung', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    const deepest = plan.rungs[plan.rungs.length - 1].price;
    expect(plan.averageFill).toBeGreaterThan(deepest);
    expect(plan.averageFill).toBeLessThan(plan.rungs[0].price);
  });

  it('is not defensive merely because price sits below a monthly pivot', () => {
    // Being below the level is a downtrend, and buying weakness in a downtrend
    // is what this ladder is for. The old rule fired here, and so fired every
    // week of every decline.
    expect(buildDcaPlan(weeklyInput(95)).stance).not.toBe('defensive');
  });

  it('no longer turns defensive on two half-formed candles being red', () => {
    const down = (low: number): Candle => ({
      time: 1_800_000_000,
      open: low + 12,
      high: low + 14,
      low,
      close: low + 1,
      volume: 1000,
    });
    const base = weeklyInput(150);
    const plan = buildDcaPlan({
      ...base,
      weekly: { ...base.weekly, forming: down(142) },
      monthly: { ...base.monthly, forming: down(138) },
    });
    // A month that is fractionally red on day three is not a broken sequence.
    expect(plan.stance).toBe('neutral');
  });

  it('turns defensive on the month the pivot actually gives way', () => {
    const base = weeklyInput(95);
    const plan = buildDcaPlan({
      ...base,
      monthly: { completed: monthlyBars([...INTACT, [70, 76]]), forming: null },
    });
    expect(plan.stance).toBe('defensive');
    expect(plan.stanceReason).toMatch(/monthly pivot at 80/i);
  });

  it('clears once the break is old news', () => {
    const base = weeklyInput(95);
    const plan = buildDcaPlan({
      ...base,
      monthly: {
        completed: monthlyBars([...INTACT, [70, 76], [68, 74], [66, 72], [64, 70]]),
        forming: null,
      },
    });
    // Three months below the level: this is a downtrend, not a break.
    expect(plan.stance).not.toBe('defensive');
  });
});

describe('monthlyPivotBreak', () => {
  it('says nothing while the sequence holds', () => {
    expect(monthlyPivotBreak(monthlyBars(INTACT))).toBeNull();
  });

  it('needs a monthly close below the pivot, not a wick through it', () => {
    // Low of 70 pierces the 80 pivot; the close of 86 does not.
    expect(monthlyPivotBreak(monthlyBars([...INTACT, [70, 86]]))).toBeNull();
  });

  it('dates the break from the month it happened', () => {
    expect(monthlyPivotBreak(monthlyBars([...INTACT, [70, 76]]))).toEqual({
      monthsSince: 0,
      pivotLow: 80,
    });
    expect(monthlyPivotBreak(monthlyBars([...INTACT, [70, 76], [68, 74]]))?.monthsSince).toBe(1);
  });

  it('counts only the crossing, not every month spent below', () => {
    const broken = monthlyBars([...INTACT, [70, 76], [68, 74], [66, 72], [64, 70]]);
    // Four months below the pivot, but one break — three months ago.
    expect(monthlyPivotBreak(broken)?.monthsSince).toBe(3);
  });

  it('reports the fresh break when a level is lost, reclaimed and lost again', () => {
    const twice = monthlyBars([...INTACT, [75, 76], [74, 79], [110, 116], [64, 70]]);
    expect(monthlyPivotBreak(twice)?.monthsSince).toBe(0);
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
    expect(plan.weeklyType).toBeNull();
    expect(plan.rungs.every((r) => r.price < 10)).toBe(true);
  });

  it('classifies the last completed weekly and monthly bars', () => {
    const plan = buildDcaPlan(weeklyInput(150));
    expect(plan.weeklyType).toBe('2u'); // 140 low > 130 low, high also higher
    expect(plan.monthlyType).toBe('2u');
  });
});
