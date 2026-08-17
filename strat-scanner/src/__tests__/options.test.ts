import { describe, expect, it } from 'vitest';
import {
  blackScholes,
  impliedMove,
  normalCdf,
  realisedVolatility,
} from '../options/blackScholes';
import {
  DEFAULT_EXPRESSION_OPTIONS,
  defaultStrikeIncrement,
  expressAsOptions,
  ExpressionInput,
  renderExpression,
} from '../options/expression';
import { Levels } from '../strat/types';

describe('normalCdf', () => {
  it('is symmetric around zero', () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(1) + normalCdf(-1)).toBeCloseTo(1, 5);
  });

  it('matches known values closely enough for sizing', () => {
    expect(normalCdf(1.96)).toBeCloseTo(0.975, 3);
    expect(normalCdf(-1.645)).toBeCloseTo(0.05, 3);
  });
});

describe('blackScholes', () => {
  const base = { spot: 100, strike: 100, years: 1, volatility: 0.2, rate: 0.05 };

  it('prices a textbook ATM call', () => {
    // Standard reference value for these inputs is ~10.45.
    expect(blackScholes({ ...base, kind: 'call' }).price).toBeCloseTo(10.45, 1);
  });

  it('respects put-call parity', () => {
    const c = blackScholes({ ...base, kind: 'call' }).price;
    const p = blackScholes({ ...base, kind: 'put' }).price;
    const parity = base.spot - base.strike * Math.exp(-base.rate * base.years);
    expect(c - p).toBeCloseTo(parity, 2);
  });

  it('gives an ATM call a delta near a half', () => {
    expect(blackScholes({ ...base, kind: 'call' }).delta).toBeGreaterThan(0.5);
    expect(blackScholes({ ...base, kind: 'call' }).delta).toBeLessThan(0.75);
  });

  it('gives puts negative delta', () => {
    expect(blackScholes({ ...base, kind: 'put' }).delta).toBeLessThan(0);
  });

  it('collapses to intrinsic value at expiry rather than returning NaN', () => {
    const itm = blackScholes({ ...base, strike: 90, years: 0, kind: 'call' });
    expect(itm.price).toBe(10);
    expect(itm.delta).toBe(1);
    const otm = blackScholes({ ...base, strike: 110, years: 0, kind: 'call' });
    expect(otm.price).toBe(0);
  });

  it('survives degenerate inputs', () => {
    expect(blackScholes({ ...base, spot: 0, kind: 'call' }).price).toBe(0);
    expect(blackScholes({ ...base, volatility: 0, kind: 'call' }).price).toBe(0);
    expect(Number.isNaN(blackScholes({ ...base, years: -1, kind: 'call' }).price)).toBe(false);
  });

  it('prices more time as more premium', () => {
    const near = blackScholes({ ...base, years: 0.1, kind: 'call' }).price;
    const far = blackScholes({ ...base, years: 1, kind: 'call' }).price;
    expect(far).toBeGreaterThan(near);
  });
});

describe('realisedVolatility', () => {
  it('is zero for a flat series', () => {
    expect(realisedVolatility(Array(50).fill(100))).toBe(0);
  });

  it('rises with the size of the swings', () => {
    const calm = Array.from({ length: 60 }, (_, i) => 100 + (i % 2 ? 0.1 : -0.1));
    const wild = Array.from({ length: 60 }, (_, i) => 100 + (i % 2 ? 6 : -6));
    expect(realisedVolatility(wild)).toBeGreaterThan(realisedVolatility(calm));
  });

  it('does not divide by zero on a short series', () => {
    expect(realisedVolatility([])).toBe(0);
    expect(realisedVolatility([100])).toBe(0);
  });
});

describe('impliedMove', () => {
  it('scales with the square root of time', () => {
    const one = impliedMove(100, 0.2, 1);
    const quarter = impliedMove(100, 0.2, 0.25);
    expect(one).toBeCloseTo(20, 5);
    expect(quarter).toBeCloseTo(10, 5);
  });
});

describe('defaultStrikeIncrement', () => {
  it('widens with price', () => {
    expect(defaultStrikeIncrement(600)).toBe(5);
    expect(defaultStrikeIncrement(150)).toBe(1);
    expect(defaultStrikeIncrement(40)).toBe(0.5);
  });
});

describe('expressAsOptions', () => {
  const levels = (over: Partial<Levels> = {}): Levels => ({
    entry: 100,
    stop: 90,
    target1: 130,
    target2: 150,
    rr1: 3,
    rr2: 5,
    ...over,
  });

  const input = (over: Partial<ExpressionInput> = {}): ExpressionInput => ({
    symbol: 'AAPL',
    direction: 'bullish',
    timeframe: 'D',
    spot: 99,
    levels: levels(),
    realisedVol: 0.3,
    ...over,
  });

  it('maps a long to calls and a short to puts', () => {
    expect(expressAsOptions(input())?.optionKind).toBe('call');
    expect(
      expressAsOptions(
        input({
          direction: 'bearish',
          levels: levels({ entry: 100, stop: 110, target1: 70, target2: 50 }),
          spot: 101,
        }),
      )?.optionKind,
    ).toBe('put');
  });

  it('buys the strike at the trigger and sells the strike at the objective', () => {
    const e = expressAsOptions(input());
    const spread = e?.structures.find((s) => s.kind === 'debit-spread');
    expect(spread?.longStrike).toBe(100);
    expect(spread?.shortStrike).toBe(130);
  });

  it('derives the expiry from the plan hold window, with buffer', () => {
    const daily = expressAsOptions(input({ timeframe: 'D' }));
    const monthly = expressAsOptions(input({ timeframe: 'M' }));
    // 6 daily bars x2 buffer is ~12 days; 6 monthly bars x2 is ~a year.
    expect(daily?.minDays).toBe(12);
    expect(monthly?.minDays).toBeGreaterThan(300);
    expect(monthly?.minDays).toBeGreaterThan(daily?.minDays as number);
  });

  it('honours a widened expiry buffer', () => {
    const tight = expressAsOptions(input(), { expiryBuffer: 1 });
    const loose = expressAsOptions(input(), { expiryBuffer: 4 });
    expect(loose?.minDays).toBeGreaterThan(tight?.minDays as number);
  });

  it('sizes contracts so the defined-risk structure fits the budget', () => {
    const e = expressAsOptions(input(), { riskBudget: 1000 });
    const spread = e?.structures.find((s) => s.kind === 'debit-spread');
    expect(spread?.totalCost).toBeLessThanOrEqual(1000);
    expect(spread?.contracts).toBe(
      Math.floor(1000 / (spread?.maxLossPerContract as number)),
    );
  });

  it('caps the spread and leaves the single open-ended', () => {
    const e = expressAsOptions(input());
    const spread = e?.structures.find((s) => s.kind === 'debit-spread');
    const single = e?.structures.find((s) => s.kind === 'long-single');
    expect(spread?.maxGainPerContract).toBeGreaterThan(0);
    expect(single?.maxGainPerContract).toBeNull();
    expect(single?.rewardToRisk).toBeNull();
  });

  it('prices the single above the spread, since the spread sells premium back', () => {
    const e = expressAsOptions(input());
    const spread = e?.structures.find((s) => s.kind === 'debit-spread');
    const single = e?.structures.find((s) => s.kind === 'long-single');
    expect(single?.debit).toBeGreaterThan(spread?.debit as number);
  });

  it('marks up realised volatility, because implied is what you pay', () => {
    const e = expressAsOptions(input({ realisedVol: 0.4 }));
    expect(e?.volatility).toBeCloseTo(0.4 * DEFAULT_EXPRESSION_OPTIONS.ivPremium, 6);
    expect(e?.volatility).toBeGreaterThan(0.4);
  });

  it('refuses a spread whose strikes round to the same price', () => {
    const e = expressAsOptions(input({ levels: levels({ target1: 100.2, rr1: 0.02 }) }));
    expect(e?.structures.some((s) => s.kind === 'debit-spread')).toBe(false);
    expect(e?.warnings.join(' ')).toContain('too tight to express');
  });

  it('warns when the objective is a fraction of the risk', () => {
    // Exactly what the target-quality diagnostic found: T1 well inside 1R.
    // Survivable in shares, usually negative expectancy in options.
    const e = expressAsOptions(input({ levels: levels({ target1: 101.4, rr1: 0.14 }) }));
    expect(e?.warnings.join(' ')).toContain('0.14R from the trigger');
    expect(e?.warnings.join(' ')).toContain('negative expectancy');
  });

  it('stays quiet about that when the objective is a real multiple of risk', () => {
    const e = expressAsOptions(input());
    expect(e?.warnings.join(' ')).not.toContain('negative expectancy');
  });

  it('warns when the objective needs an extraordinary move', () => {
    // Objective far beyond one expected move over a short daily window.
    const e = expressAsOptions(
      input({ levels: levels({ target1: 200 }), realisedVol: 0.15 }),
    );
    expect(e?.targetInMoves).toBeGreaterThan(1.5);
    expect(e?.warnings.join(' ')).toContain('unusually large travel');
  });

  it('warns when a single contract will not fit the budget', () => {
    const e = expressAsOptions(input({ spot: 900, levels: levels({ entry: 900, stop: 850, target1: 1100 }) }), {
      riskBudget: 20,
    });
    expect(e?.warnings.join(' ')).toContain('risk budget');
  });

  it('returns null rather than a structure built on nonsense', () => {
    // Target on the wrong side of entry.
    expect(expressAsOptions(input({ levels: levels({ target1: 80 }) }))).toBeNull();
    // No risk.
    expect(expressAsOptions(input({ levels: levels({ stop: 100 }) }))).toBeNull();
    // No volatility to price with.
    expect(expressAsOptions(input({ realisedVol: 0 }))).toBeNull();
  });

  it('carries the plan levels through untouched', () => {
    const e = expressAsOptions(input());
    expect(e?.entry).toBe(100);
    expect(e?.stop).toBe(90);
    expect(e?.target).toBe(130);
  });
});

describe('renderExpression', () => {
  it('renders both structures and the expiry requirement', () => {
    const e = expressAsOptions({
      symbol: 'NVDA',
      direction: 'bullish',
      timeframe: 'D',
      spot: 99,
      levels: { entry: 100, stop: 90, target1: 130, target2: 150, rr1: 3, rr2: 5 },
      realisedVol: 0.35,
    });
    const md = renderExpression(e as NonNullable<typeof e>);
    expect(md).toContain('NVDA LONG');
    expect(md).toContain('debit spread');
    expect(md).toContain('long call');
    expect(md).toContain('expiry on or after');
  });

  it('surfaces warnings rather than burying them', () => {
    const e = expressAsOptions({
      symbol: 'SPY',
      direction: 'bullish',
      timeframe: 'D',
      spot: 99,
      levels: { entry: 100, stop: 90, target1: 100.4, target2: 120, rr1: 0.04, rr2: 2 },
      realisedVol: 0.2,
    });
    expect(renderExpression(e as NonNullable<typeof e>)).toContain('⚠️');
  });
});
