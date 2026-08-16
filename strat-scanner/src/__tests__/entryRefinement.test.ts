import { describe, expect, it } from 'vitest';
import {
  buildRefinementComparison,
  DEFAULT_REFINEMENT_OPTIONS,
  planWithRefinedStop,
  RefinedEntry,
  refineEntry,
  RefinementRow,
  renderRefinementReport,
} from '../strat/entryRefinement';
import { GradedSignal } from '../strat/edgeReport';
import { DEFAULT_RESOLVE_OPTIONS, resolvePlan, TradePlan } from '../strat/outcomes';
import { Candle } from '../strat/types';

const HOUR = 3600;
const DAY = 86400;
const T0 = 1_700_000_000;

/** Hourly bars beginning the moment the "?" day opened. */
const hourly = (rows: [number, number, number, number][], start = T0): Candle[] =>
  rows.map(([open, high, low, close], i) => ({
    time: start + i * HOUR,
    open,
    high,
    low,
    close,
    volume: 100,
  }));

/** Daily plan: entry 110, stop 99 (11 points of risk), T1 132, T2 154. */
const plan = (over: Partial<TradePlan> = {}): TradePlan => ({
  direction: 'bullish',
  timeframe: 'D',
  levels: { entry: 110, stop: 99, target1: 132, target2: 154, rr1: 2, rr2: 4 },
  setupBarTime: T0 - DAY,
  triggerBarEnd: T0,
  ...over,
});

describe('refineEntry — when there is nothing to refine', () => {
  it('returns null when the trigger never broke', () => {
    const bars = hourly([
      [105, 108, 104, 107],
      [107, 109, 106, 108],
    ]);
    expect(refineEntry(plan(), bars)).toBeNull();
  });

  it('returns null with no intraday bars at all', () => {
    expect(refineEntry(plan(), [])).toBeNull();
  });

  it('ignores a break that happens after the entry window closed', () => {
    // Two days later — the daily "?" bar is long gone.
    const late = hourly([[105, 130, 104, 129]], T0 + 2 * DAY);
    expect(refineEntry(plan(), late)).toBeNull();
  });

  it('ignores bars belonging to the trigger bar itself', () => {
    const early = hourly([[105, 130, 104, 129]], T0 - 5 * HOUR);
    expect(refineEntry(plan(), early)).toBeNull();
  });
});

describe('refineEntry — tightening the stop', () => {
  it('puts the stop under intraday structure, not under the daily bar', () => {
    const bars = hourly([
      [105, 107, 104, 106],
      [106, 109, 105.5, 108],
      [108, 112, 107, 111], // takes the 110 trigger
    ]);
    const r = refineEntry(plan(), bars);
    expect(r).not.toBeNull();
    // Lowest low of the last three bars is 104 — well above the 99 daily stop.
    expect(r?.stop).toBe(104);
    expect(r?.stopSource).toBe('intraday-pivot');
    expect(r?.risk).toBeCloseTo(6, 5);
    expect(r?.originalRisk).toBeCloseTo(11, 5);
  });

  it('leaves the trigger and the targets exactly where they were', () => {
    const bars = hourly([
      [105, 107, 104, 106],
      [106, 112, 105, 111],
    ]);
    const r = refineEntry(plan(), bars);
    // Selection belongs to the higher timeframe; only risk moves.
    expect(r?.entry).toBe(110);
    const refinedPlan = planWithRefinedStop(plan(), r as NonNullable<typeof r>);
    expect(refinedPlan.levels.target1).toBe(132);
    expect(refinedPlan.levels.target2).toBe(154);
    expect(refinedPlan.levels.entry).toBe(110);
  });

  it('turns the same objective into a bigger R', () => {
    const bars = hourly([
      [105, 107, 104, 106],
      [106, 112, 105, 111],
    ]);
    const r = refineEntry(plan(), bars);
    // T1 at 132 is 22 points away. Against 11 of risk that is 2R; against the
    // refined 6 it is closer to 3.7R.
    expect(r?.originalRr1).toBeCloseTo(2, 2);
    expect(r?.rr1).toBeGreaterThan(3.5);
    expect(r?.tightening).toBeGreaterThan(1.5);
  });

  it('uses the trigger bar alone when it is the first bar available', () => {
    const bars = hourly([[105, 112, 104, 111]]);
    expect(refineEntry(plan(), bars)?.stopSource).toBe('intraday-trigger-bar');
  });
});

describe('refineEntry — the guards', () => {
  it('declines when intraday structure is wider than the daily invalidation', () => {
    // The hourly bar's low is below the 99 daily stop: refining would widen it.
    const bars = hourly([[105, 112, 95, 111]]);
    const r = refineEntry(plan(), bars);
    expect(r?.stopSource).toBe('higher-timeframe');
    expect(r?.stop).toBe(99);
    expect(r?.tightening).toBe(1);
    expect(r?.declinedReason).toContain('wider');
  });

  it('declines a stop so tight it is inside the noise', () => {
    // Low of 109.99 against a 110 entry — one hundredth of a percent of risk.
    const bars = hourly([[109.99, 112, 109.99, 111]]);
    const r = refineEntry(plan(), bars);
    expect(r?.stopSource).toBe('higher-timeframe');
    expect(r?.declinedReason).toContain('noise');
  });

  it('declines a stop far tighter than the original, however wide in percent', () => {
    // 1.5 points of risk against 11 is under the 20% floor, and 1.36% of price
    // clears the percent floor — so only the fraction guard catches this.
    const bars = hourly([[108.5, 112, 108.5, 111]]);
    const r = refineEntry(plan(), bars);
    expect(r?.stopSource).toBe('higher-timeframe');
    expect(r?.declinedReason).toContain('original');
  });

  it('never reports a refined risk larger than the original', () => {
    for (const low of [95, 99, 104, 108, 109.99]) {
      const r = refineEntry(plan(), hourly([[low, 112, low, 111]]));
      expect(r?.risk).toBeLessThanOrEqual(r?.originalRisk as number);
    }
  });

  it('honours a caller-widened noise floor', () => {
    const bars = hourly([[105, 112, 104, 111]]);
    const strict = refineEntry(plan(), bars, {
      ...DEFAULT_REFINEMENT_OPTIONS,
      minRiskFraction: 0.9,
    });
    expect(strict?.stopSource).toBe('higher-timeframe');
  });
});

describe('refineEntry — bearish plans mirror', () => {
  const short = plan({
    direction: 'bearish',
    levels: { entry: 90, stop: 101, target1: 68, target2: 46, rr1: 2, rr2: 4 },
  });

  it('puts the stop above intraday structure', () => {
    const bars = hourly([
      [95, 96, 94, 95],
      [95, 96, 88, 89], // takes the 90 trigger
    ]);
    const r = refineEntry(short, bars);
    expect(r?.stop).toBe(96);
    expect(r?.risk).toBeCloseTo(6, 5);
    expect(r?.rr1).toBeGreaterThan(3.5);
  });

  it('declines when the intraday high is above the daily stop', () => {
    const bars = hourly([[95, 105, 88, 89]]);
    expect(refineEntry(short, bars)?.stopSource).toBe('higher-timeframe');
  });
});

describe('the trade-off refinement makes', () => {
  // The point of the whole module: a tighter stop buys a better R and buys
  // more stop-outs. These two cases show both sides on the same bars.
  const bars = hourly([
    [105, 107, 104, 106],
    [106, 112, 105, 111], // triggers at 110, refined stop 104
    [111, 113, 103, 105], // dips below 104 but holds the 99 daily stop
    [105, 135, 104, 134], // then runs clean through T1 at 132
  ]);

  it('the refined stop gets whipsawed out of a trade the daily stop survives', () => {
    const original = resolvePlan(plan(), bars, DEFAULT_RESOLVE_OPTIONS, T0 + 30 * DAY);
    const r = refineEntry(plan(), bars) as NonNullable<ReturnType<typeof refineEntry>>;
    const refined = resolvePlan(
      planWithRefinedStop(plan(), r),
      bars,
      DEFAULT_RESOLVE_OPTIONS,
      T0 + 30 * DAY,
    );

    expect(original.status).toBe('TARGET1');
    expect(refined.status).toBe('STOPPED');
  });

  it('but pays a larger multiple when it is not', () => {
    const clean = hourly([
      [105, 107, 104, 106],
      [106, 112, 105, 111],
      [111, 135, 110, 134],
    ]);
    const r = refineEntry(plan(), clean) as NonNullable<ReturnType<typeof refineEntry>>;
    const refined = resolvePlan(
      planWithRefinedStop(plan(), r),
      clean,
      DEFAULT_RESOLVE_OPTIONS,
      T0 + 30 * DAY,
    );
    const original = resolvePlan(plan(), clean, DEFAULT_RESOLVE_OPTIONS, T0 + 30 * DAY);

    expect(refined.status).toBe('TARGET1');
    expect(original.status).toBe('TARGET1');
    expect(refined.r as number).toBeGreaterThan(original.r as number);
  });
});

describe('buildRefinementComparison', () => {
  let k = 0;
  const graded = (over: Partial<GradedSignal> = {}): GradedSignal => ({
    key: `k${k}`,
    symbol: 'SPY',
    timeframe: 'D',
    direction: 'bullish',
    pattern: '2-1-2 Reversal',
    sequence: '2d-1-?',
    scenario: 'reversal',
    compression: true,
    isReversal: true,
    confidence: 60,
    factorKeys: ['base'],
    aligned: 2,
    opposed: 0,
    fullContinuity: false,
    promisedR: 2,
    status: 'TARGET1',
    r: 2,
    date: '2026-08-01',
    ...over,
  });

  const refinedEntry = (over: Partial<RefinedEntry> = {}): RefinedEntry => ({
    entry: 110,
    stop: 104,
    stopSource: 'intraday-pivot',
    triggeredAt: T0,
    risk: 6,
    originalRisk: 11,
    tightening: 11 / 6,
    rr1: 3.67,
    rr2: 7.33,
    originalRr1: 2,
    ...over,
  });

  const row = (
    baseline: Partial<GradedSignal>,
    refined: Partial<GradedSignal>,
    entry: RefinedEntry | null,
  ): RefinementRow => {
    k += 1;
    const key = `p${k}`;
    return {
      baseline: graded({ ...baseline, key }),
      refined: graded({ ...refined, key }),
      entry,
    };
  };

  it('compares the two variants on an identical population', () => {
    const rows = [
      row({ status: 'TARGET1', r: 2 }, { status: 'STOPPED', r: -1 }, refinedEntry()),
      row({ status: 'EXPIRED', r: undefined }, { status: 'EXPIRED', r: undefined }, null),
    ];
    const c = buildRefinementComparison(rows);
    expect(c.baseline.n).toBe(c.refined.n);
    expect(c.baseline.n).toBe(2);
  });

  it('keeps never-triggered signals in both columns rather than dropping them', () => {
    // Dropping them would remove exactly the cases where the two agree and
    // inflate whatever difference is left.
    const rows = [
      row({ status: 'EXPIRED', r: undefined }, { status: 'EXPIRED', r: undefined }, null),
      row({ status: 'TARGET1', r: 2 }, { status: 'TARGET1', r: 4 }, refinedEntry()),
    ];
    const c = buildRefinementComparison(rows);
    expect(c.neverTriggered).toBe(1);
    expect(c.baseline.n).toBe(2);
    // +2R over two signals baseline, +4R refined.
    expect(c.baseline.avgRPerSignal).toBeCloseTo(1, 5);
    expect(c.refined.avgRPerSignal).toBeCloseTo(2, 5);
  });

  it('excludes signals still unresolved under either variant', () => {
    const rows = [
      row({ status: 'TARGET1', r: 2 }, { status: 'OPEN', r: undefined }, refinedEntry()),
      row({ status: 'TARGET1', r: 2 }, { status: 'TARGET1', r: 4 }, refinedEntry()),
    ];
    expect(buildRefinementComparison(rows).sample).toBe(1);
  });

  it('counts tightened, declined and never-triggered separately', () => {
    const rows = [
      row({}, {}, refinedEntry()),
      row({}, {}, refinedEntry({ stopSource: 'higher-timeframe', declinedReason: 'too tight' })),
      row({}, {}, null),
    ];
    const c = buildRefinementComparison(rows);
    expect(c.tightened).toBe(1);
    expect(c.declined).toBe(1);
    expect(c.neverTriggered).toBe(1);
    expect(c.declineReasons).toEqual([{ reason: 'too tight', count: 1 }]);
  });

  it('averages tightening over refined entries only, not declines', () => {
    const rows = [
      row({}, {}, refinedEntry({ tightening: 3 })),
      row({}, {}, refinedEntry({ stopSource: 'higher-timeframe', tightening: 1 })),
    ];
    expect(buildRefinementComparison(rows).meanTightening).toBe(3);
  });

  it('reports the promised R before and after refinement', () => {
    const rows = [row({}, {}, refinedEntry({ originalRr1: 2, rr1: 5 }))];
    const c = buildRefinementComparison(rows);
    expect(c.meanRr1Before).toBe(2);
    expect(c.meanRr1After).toBe(5);
  });
});

describe('renderRefinementReport', () => {
  const meta = { provenance: 'Test.', generatedAt: new Date('2026-08-16'), days: 60 };
  let k = 0;
  const pair = (baseR: number, refinedR: number): RefinementRow => {
    k += 1;
    const base = {
      key: `r${k}`,
      symbol: 'SPY',
      timeframe: 'D' as const,
      direction: 'bullish' as const,
      pattern: '2-1-2 Reversal',
      sequence: '2d-1-?',
      scenario: 'reversal' as const,
      compression: true,
      isReversal: true,
      confidence: 60,
      factorKeys: ['base' as const],
      aligned: 2,
      opposed: 0,
      fullContinuity: false,
      promisedR: 2,
      date: '2026-08-01',
    };
    return {
      baseline: { ...base, status: baseR > 0 ? 'TARGET1' : 'STOPPED', r: baseR },
      refined: { ...base, status: refinedR > 0 ? 'TARGET1' : 'STOPPED', r: refinedR },
      entry: {
        entry: 110,
        stop: 104,
        stopSource: 'intraday-pivot',
        triggeredAt: T0,
        risk: 6,
        originalRisk: 11,
        tightening: 1.8,
        rr1: 3.6,
        rr2: 7,
        originalRr1: 2,
      },
    };
  };

  it('always carries the short-window caveat, however big the sample', () => {
    const rows = Array.from({ length: 500 }, () => pair(1, 2));
    const md = renderRefinementReport(buildRefinementComparison(rows), meta);
    expect(md).toContain('shortest-horizon report in the repo');
  });

  it('adds a second warning when the sample is below the floor', () => {
    const md = renderRefinementReport(buildRefinementComparison([pair(1, 2)]), meta);
    expect(md).toContain('below the');
  });

  it('says the refined stop wins when it does', () => {
    const rows = Array.from({ length: 400 }, () => pair(1, 3));
    expect(renderRefinementReport(buildRefinementComparison(rows), meta)).toContain(
      'the refined stop wins',
    );
  });

  it('says the refined stop loses when the whipsaw costs more', () => {
    const rows = Array.from({ length: 400 }, () => pair(1, -1));
    expect(renderRefinementReport(buildRefinementComparison(rows), meta)).toContain(
      'the refined stop loses',
    );
  });

  it('calls a wash a wash rather than picking a side', () => {
    const rows = Array.from({ length: 400 }, () => pair(1, 1));
    expect(renderRefinementReport(buildRefinementComparison(rows), meta)).toContain('a wash');
  });

  it('says plainly when nothing fell inside the window', () => {
    expect(renderRefinementReport(buildRefinementComparison([]), meta)).toContain(
      'nothing to compare',
    );
  });

  it('renders the behaviour and slice sections', () => {
    const rows = Array.from({ length: 400 }, () => pair(1, 2));
    const md = renderRefinementReport(buildRefinementComparison(rows), meta);
    expect(md).toContain('## The trade-off');
    expect(md).toContain('## What refinement did');
    expect(md).toContain('## By timeframe');
    expect(md).toContain('60m never selects');
  });
});
