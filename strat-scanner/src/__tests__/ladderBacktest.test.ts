import { describe, expect, it } from 'vitest';
import {
  indexOfDate,
  naivePlan,
  replayLadder,
  spotBuy,
  weeklyDca,
} from '../crypto/ladderBacktest';
import {
  aggregateStrategy,
  buildLadderReport,
  renderLadderReport,
  sourceStats,
  stanceStats,
  SymbolBundle,
} from '../crypto/ladderReport';
import { Candle } from '../strat/types';

const DAY = 86400;
/** 2016-01-04 was a Monday. */
const START = Date.UTC(2016, 0, 4) / 1000;

const bar = (i: number, price: number, lowMult = 0.98, highMult = 1.02): Candle => ({
  time: START + i * DAY,
  open: price,
  high: price * highMult,
  low: price * lowMult,
  close: price,
  volume: 1000,
});

/** A long series that drifts down then recovers, so rungs actually fill. */
function cycle(n: number): Candle[] {
  return Array.from({ length: n }, (_, i) => {
    // One slow 40% drawdown and recovery across the whole series.
    const phase = (i / n) * Math.PI * 2;
    const price = 100 * (1 - 0.25 * (1 - Math.cos(phase)) / 1);
    return bar(i, Math.max(5, price));
  });
}

/** A series that only ever goes up — nothing below spot ever fills. */
const rising = (n: number): Candle[] =>
  Array.from({ length: n }, (_, i) => bar(i, 100 * (1 + i * 0.002)));

describe('naivePlan', () => {
  it('places rungs at fixed percentages with the tier weights', () => {
    const plan = naivePlan('BTC-USD', 100, 'balanced', [10, 20, 30, 40]);
    expect(plan.rungs.map((r) => r.price)).toEqual([90, 80, 70, 60]);
    expect(plan.rungs.reduce((s, r) => s + r.allocationPct, 0)).toBe(100);
  });

  it('back-loads size on the wide profile and front-loads on tight', () => {
    const wide = naivePlan('X', 100, 'wide', [10, 20, 30, 40]);
    const tight = naivePlan('X', 100, 'tight', [10, 20, 30, 40]);
    expect(wide.rungs[3].allocationPct).toBeGreaterThan(wide.rungs[0].allocationPct);
    expect(tight.rungs[0].allocationPct).toBeGreaterThan(tight.rungs[3].allocationPct);
  });
});

describe('replayLadder', () => {
  const bars = cycle(1400);

  it('refuses to replay a history too short to have structure', () => {
    const run = replayLadder('X', bars.slice(0, 100));
    expect(run.plansPublished).toBe(0);
    expect(run.deployed).toBe(0);
    expect(run.terminalValue).toBe(run.budget);
  });

  it('publishes one plan per week, not one per day', () => {
    const run = replayLadder('X', bars);
    // ~200 weeks in 1400 days, minus the 30-week warm-up.
    expect(run.plansPublished).toBeGreaterThan(120);
    expect(run.plansPublished).toBeLessThan(200);
  });

  it('fills rungs and deploys capital through a drawdown', () => {
    const run = replayLadder('X', bars);
    expect(run.fills.length).toBeGreaterThan(0);
    expect(run.deployed).toBeGreaterThan(0);
    expect(run.units).toBeGreaterThan(0);
    expect(run.averageCost).not.toBeNull();
  });

  it('never spends more than the budget', () => {
    const run = replayLadder('X', bars, { budget: 5000 });
    expect(run.deployed).toBeLessThanOrEqual(5000 + 1e-6);
    expect(run.cash).toBeGreaterThanOrEqual(-1e-6);
    expect(run.deployed + run.cash).toBeCloseTo(5000, 4);
  });

  it('deploys nothing when price never trades below the ladder', () => {
    const run = replayLadder('X', rising(1000));
    expect(run.deployed).toBe(0);
    expect(run.averageCost).toBeNull();
    // Untouched cash is still worth its face value.
    expect(run.terminalValue).toBe(run.budget);
  });

  it('records a stance for every plan it publishes', () => {
    const run = replayLadder('X', bars);
    expect(run.stances).toHaveLength(run.plansPublished);
    for (const s of run.stances) {
      expect(['accumulate', 'neutral', 'defensive']).toContain(s.stance);
    }
  });

  it('counts each distinct rung placement once, however often it is republished', () => {
    const run = replayLadder('X', bars);
    const placed = Object.values(run.placementsBySource).reduce((a, b) => a + b, 0);
    // A weekly republish of the same four levels must not count 4x per week.
    expect(placed).toBeLessThan(run.plansPublished * 4);
    expect(placed).toBeGreaterThan(0);
  });

  it('expires more rungs on a short TTL than a long one', () => {
    const short = replayLadder('X', bars, { ttlDays: 14 });
    const long = replayLadder('X', bars, { ttlDays: 100_000 });
    expect(short.expiredCount).toBeGreaterThan(long.expiredCount);
    expect(long.expiredCount).toBe(0);
  });

  it('is deterministic', () => {
    const a = replayLadder('X', bars);
    const b = replayLadder('X', bars);
    expect(a.deployed).toBe(b.deployed);
    expect(a.fills.length).toBe(b.fills.length);
  });

  it('runs the control ladder over the same bars with fixed depths', () => {
    const run = replayLadder('X', bars, { rungs: 'naive', naiveDepths: [10, 20, 30, 40] });
    expect(run.style).toBe('naive');
    expect(run.fills.every((f) => f.source.startsWith('Fixed'))).toBe(true);
  });

  it('attributes fills to the structural source that produced them', () => {
    const run = replayLadder('X', bars);
    const sources = new Set(run.fills.map((f) => f.source));
    expect(sources.size).toBeGreaterThan(0);
    for (const s of sources) {
      expect(s).not.toContain('Fixed');
    }
  });
});

describe('benchmarks', () => {
  const bars = cycle(1000);

  it('spot buy deploys everything at the starting price', () => {
    const r = spotBuy(bars, 0, 10_000);
    expect(r.deployed).toBe(10_000);
    expect(r.cash).toBe(0);
    expect(r.averageCost).toBeCloseTo(bars[0].close, 6);
  });

  it('weekly DCA spreads the budget across the requested weeks', () => {
    const r = weeklyDca(bars, 0, 10_000, 26);
    expect(r.deployed).toBeCloseTo(10_000, 4);
    // Its average cost sits inside the range of prices it bought through.
    const prices = bars.slice(0, 200).map((b) => b.close);
    expect(r.averageCost as number).toBeGreaterThan(Math.min(...prices));
    expect(r.averageCost as number).toBeLessThan(Math.max(...prices));
  });

  it('weekly DCA buys once per week, not once per bar', () => {
    const r = weeklyDca(bars, 0, 10_000, 4);
    // Four equal slices only.
    expect(r.deployed).toBeCloseTo(10_000, 4);
    expect(r.cash).toBeCloseTo(0, 4);
  });

  it('indexOfDate finds the first bar at or after a date', () => {
    const d = new Date((bars[10].time as number) * 1000).toISOString().slice(0, 10);
    expect(indexOfDate(bars, d)).toBe(10);
    expect(indexOfDate(bars, '1990-01-01')).toBe(0);
  });
});

describe('aggregateStrategy', () => {
  const result = (deployed: number, avg: number | null, terminal: number) => ({
    label: 'x',
    budget: 100,
    deployed,
    cash: 100 - deployed,
    units: 1,
    averageCost: avg,
    terminalValue: terminal,
  });

  it('excludes assets that never filled from cost efficiency', () => {
    // A strategy is not credited with a good price for declining to trade.
    const agg = aggregateStrategy('x', [
      { result: result(50, 80, 120), meanPrice: 100 },
      { result: result(0, null, 100), meanPrice: 100 },
    ]);
    expect(agg.costEfficiency).toBeCloseTo(0.8, 6);
    expect(agg.symbolsFilled).toBe(1);
    expect(agg.symbols).toBe(2);
  });

  it('reports deployment against the whole budget, filled or not', () => {
    const agg = aggregateStrategy('x', [
      { result: result(50, 80, 120), meanPrice: 100 },
      { result: result(0, null, 100), meanPrice: 100 },
    ]);
    expect(agg.deploymentRate).toBeCloseTo(0.25, 6);
  });

  it('does not divide by zero on an empty set', () => {
    const agg = aggregateStrategy('x', []);
    expect(agg.costEfficiency).toBe(0);
    expect(agg.multiple).toBe(0);
  });
});

describe('sourceStats', () => {
  it('separates a source offered constantly from one offered rarely', () => {
    const run = replayLadder('X', cycle(1400));
    const stats = sourceStats([run]);
    for (const s of stats) {
      expect(s.fillRate).toBeLessThanOrEqual(1);
      expect(s.fillRate).toBeGreaterThanOrEqual(0);
      // Fill rate is per placement, so it can never exceed one.
      expect(s.filled).toBeLessThanOrEqual(s.placed);
    }
    expect(stats.reduce((a, s) => a + s.shareOfSpend, 0)).toBeCloseTo(1, 4);
  });

  it('handles a run that never filled anything', () => {
    const stats = sourceStats([replayLadder('X', rising(1000))]);
    for (const s of stats) {
      expect(s.filled).toBe(0);
      expect(s.shareOfSpend).toBe(0);
    }
  });
});

describe('stanceStats', () => {
  it('summarises forward returns per stance', () => {
    const stats = stanceStats([
      { date: '2020-01-01', stance: 'accumulate', price: 100, forward30: 10, forward90: 20 },
      { date: '2020-02-01', stance: 'accumulate', price: 100, forward30: 0, forward90: -10 },
      { date: '2020-03-01', stance: 'defensive', price: 100, forward30: -20, forward90: -30 },
    ]);
    const acc = stats.find((s) => s.stance === 'accumulate');
    const def = stats.find((s) => s.stance === 'defensive');
    expect(acc?.meanForward30).toBe(5);
    expect(acc?.fellRate).toBe(0.5);
    expect(def?.meanForward90).toBe(-30);
    expect(def?.fellRate).toBe(1);
  });

  it('ignores observations whose forward window ran off the end of the data', () => {
    const stats = stanceStats([
      { date: '2020-01-01', stance: 'neutral', price: 100, forward30: 5, forward90: null },
      { date: '2020-02-01', stance: 'neutral', price: 100, forward30: null, forward90: null },
    ]);
    expect(stats[0].n).toBe(2);
    expect(stats[0].meanForward30).toBe(5);
    expect(stats[0].meanForward90).toBe(0);
  });

  it('returns nothing for an empty set', () => {
    expect(stanceStats([])).toEqual([]);
  });
});

describe('buildLadderReport / renderLadderReport', () => {
  const bars = cycle(1400);
  const bundle = (symbol: string): SymbolBundle => {
    const structural = replayLadder(symbol, bars, { profile: 'balanced' });
    const control = replayLadder(symbol, bars, { profile: 'balanced', rungs: 'naive' });
    return {
      symbol,
      tier: 'major',
      profile: 'balanced',
      provider: 'yahoo',
      bars: bars.length,
      meanPrice: structural.meanPrice,
      finalPrice: structural.finalPrice,
      firstPlanDate: structural.firstPlanDate,
      lastDate: structural.lastDate,
      strategies: [structural, control, spotBuy(bars, 0, 10_000), weeklyDca(bars, 0, 10_000, 26)],
      structural,
      ttlVariants: [30, 90, 100_000].map((ttlDays) => ({
        ttlDays,
        run: replayLadder(symbol, bars, { profile: 'balanced', ttlDays }),
      })),
      profileVariants: (['tight', 'balanced', 'wide'] as const).map((profile) => ({
        profile,
        run: replayLadder(symbol, bars, { profile }),
      })),
    };
  };

  const meta = { provenance: 'Test.', generatedAt: new Date('2026-08-16'), budget: 10_000 };

  it('says plainly when there is nothing to measure', () => {
    expect(renderLadderReport(buildLadderReport([]), meta)).toContain('No plans replayed');
  });

  it('renders every section', () => {
    const md = renderLadderReport(buildLadderReport([bundle('BTC-USD')]), meta);
    expect(md).toContain('## Does the structure beat round numbers?');
    expect(md).toContain('## Which rung source earns its place?');
    expect(md).toContain('## Is 90 days the right expiry?');
    expect(md).toContain('## Does the tier skew pay?');
    expect(md).toContain('## Was DEFENSIVE ever the right call?');
    expect(md).toContain('## By asset');
  });

  it('insists on reading cost efficiency alongside deployment', () => {
    const md = renderLadderReport(buildLadderReport([bundle('BTC-USD')]), meta);
    expect(md).toContain('Read cost efficiency and deployment together');
  });

  it('marks the profile the live system assigns each tier', () => {
    const md = renderLadderReport(buildLadderReport([bundle('BTC-USD')]), meta);
    expect(md).toContain('⬅︎');
  });

  it('compares strategies over the same population and budget', () => {
    const report = buildLadderReport([bundle('BTC-USD'), bundle('ETH-USD')]);
    const budgets = new Set(report.strategies.map((s) => s.budget));
    expect(budgets.size).toBe(1);
    expect(report.strategies).toHaveLength(4);
  });

  it('surfaces over-commitment rather than hiding it', () => {
    const md = renderLadderReport(buildLadderReport([bundle('BTC-USD')]), meta);
    expect(md).toContain('of requested spend had no cash behind it');
  });
});
