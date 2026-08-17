import { describe, expect, it } from 'vitest';
import {
  BASELINE_ID,
  buildSweepReport,
  CANDIDATE_EXITS,
  exitStage,
  orderingAgreement,
  PolicyResult,
  rankPolicies,
  renderSweepReport,
  splitByDate,
  timingStage,
} from '../strat/policySweep';
import { bucketStats, GradedSignal } from '../strat/edgeReport';
import { DEFAULT_RESOLVE_OPTIONS } from '../strat/outcomes';
import { buildRegimeCalendar } from '../strat/regime';
import { Candle } from '../strat/types';

let n = 0;
const sig = (over: Partial<GradedSignal> = {}): GradedSignal => ({
  key: `k${n++}`,
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
  promisedR: 1.5,
  status: 'TARGET1',
  r: 1,
  date: '2024-01-01',
  ...over,
});

describe('the policy grid', () => {
  it('compares every candidate exit at the live timing in stage one', () => {
    const stage = exitStage(DEFAULT_RESOLVE_OPTIONS);
    expect(stage).toHaveLength(CANDIDATE_EXITS.length);
    for (const s of stage) {
      expect(s.resolve.entryWindowBars).toBe(DEFAULT_RESOLVE_OPTIONS.entryWindowBars);
      expect(s.resolve.maxHoldBars).toBe(DEFAULT_RESOLVE_OPTIONS.maxHoldBars);
    }
  });

  it('includes the live policy so the sweep has a baseline to beat', () => {
    expect(exitStage().some((s) => s.id === BASELINE_ID)).toBe(true);
  });

  it('gives every policy within a stage a unique id', () => {
    for (const stage of [exitStage(), timingStage({ kind: 'target2' })]) {
      expect(new Set(stage.map((s) => s.id)).size).toBe(stage.length);
    }
  });

  it('overlaps the two stages at exactly one policy — the winner at live timing', () => {
    // Stage two re-proposes the winning exit at the live window and hold,
    // which stage one already measured. The job dedupes on id; if the ids did
    // not collide the winner would be entered in the leaderboard twice and
    // skew the walk-forward ranking.
    const one = exitStage();
    const two = timingStage({ kind: 'target2' });
    const shared = two.filter((s) => one.some((o) => o.id === s.id));
    expect(shared.map((s) => s.id)).toEqual(['t2|w1|h6']);
  });

  it('stays a two-stage grid rather than a full cross-product', () => {
    // The whole point: fewer noisy numbers to pick a maximum out of.
    const twoStage = exitStage().length + timingStage({ kind: 'target1' }).length;
    const crossProduct = CANDIDATE_EXITS.length * 2 * 3;
    expect(twoStage).toBeLessThan(crossProduct);
  });

  it('carries a fixed-R control, so pivot magnitude can be judged against it', () => {
    expect(CANDIDATE_EXITS.some((e) => e.kind === 'rMultiple')).toBe(true);
  });
});

describe('splitByDate', () => {
  const rows = ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01'].flatMap(
    (date) => [sig({ date }), sig({ date })],
  );

  it('splits chronologically, never randomly', () => {
    const { inSample, outOfSample, cutoff } = splitByDate(rows, 0.6);
    expect(inSample.every((s) => s.date < cutoff)).toBe(true);
    expect(outOfSample.every((s) => s.date >= cutoff)).toBe(true);
    expect(inSample.length + outOfSample.length).toBe(rows.length);
  });

  it('never puts the same date on both sides, which would leak the answer', () => {
    const { inSample, outOfSample } = splitByDate(rows, 0.6);
    const isDates = new Set(inSample.map((s) => s.date));
    expect(outOfSample.some((s) => isDates.has(s.date))).toBe(false);
  });

  it('degrades gracefully when there is only one date', () => {
    const { inSample, outOfSample } = splitByDate([sig(), sig()]);
    expect(outOfSample).toHaveLength(0);
    expect(inSample).toHaveLength(2);
  });
});

describe('orderingAgreement', () => {
  const result = (id: string, avg: number): PolicyResult => ({
    spec: { id, label: id, stage: 'exit', resolve: DEFAULT_RESOLVE_OPTIONS },
    stats: { ...bucketStats(id, []), avgRPerSignal: avg },
  });

  it('is 1 when the two periods rank policies identically', () => {
    const a = [result('x', 3), result('y', 2), result('z', 1)];
    const b = [result('x', 30), result('y', 20), result('z', 10)];
    expect(orderingAgreement(a, b)).toBeCloseTo(1, 5);
  });

  it('is -1 when the ordering completely reverses', () => {
    const a = [result('x', 3), result('y', 2), result('z', 1)];
    const b = [result('x', 1), result('y', 2), result('z', 3)];
    expect(orderingAgreement(a, b)).toBeCloseTo(-1, 5);
  });

  it('returns zero rather than NaN when there is too little to compare', () => {
    expect(orderingAgreement([], [])).toBe(0);
    expect(orderingAgreement([result('x', 1)], [result('x', 1)])).toBe(0);
  });
});

describe('rankPolicies', () => {
  it('ranks by R per signal published, not per trade taken', () => {
    const high = { ...bucketStats('a', []), avgR: 5, avgRPerSignal: 0.1 };
    const low = { ...bucketStats('b', []), avgR: 0.2, avgRPerSignal: 0.9 };
    const ranked = rankPolicies([
      { spec: { id: 'a', label: 'a', stage: 'exit', resolve: DEFAULT_RESOLVE_OPTIONS }, stats: high },
      { spec: { id: 'b', label: 'b', stage: 'exit', resolve: DEFAULT_RESOLVE_OPTIONS }, stats: low },
    ]);
    expect(ranked[0].spec.id).toBe('b');
  });
});

describe('buildSweepReport', () => {
  const policies = exitStage();
  const dates = Array.from({ length: 40 }, (_, i) => `2024-${String((i % 12) + 1).padStart(2, '0')}-15`);

  /** Same signals under every policy, with one policy made clearly better. */
  const gradedFor = (winnerId: string) => {
    const map = new Map<string, GradedSignal[]>();
    for (const p of policies) {
      map.set(
        p.id,
        dates.map((date, i) =>
          sig({
            key: `s${i}`,
            date,
            status: 'TARGET1',
            r: p.id === winnerId ? 2 : 0.1,
          }),
        ),
      );
    }
    return map;
  };

  it('ranks the genuinely better policy first', () => {
    const report = buildSweepReport(policies, gradedFor('t2|w1|h6'));
    expect(report.ranked[0].spec.id).toBe('t2|w1|h6');
  });

  it('identifies the live policy as the baseline', () => {
    const report = buildSweepReport(policies, gradedFor('t2|w1|h6'));
    expect(report.baseline?.spec.id).toBe(BASELINE_ID);
  });

  it('compares every policy on an identical population of signals', () => {
    const graded = gradedFor('t2|w1|h6');
    const counts = new Set([...graded.values()].map((rows) => rows.length));
    expect(counts.size).toBe(1);
    const report = buildSweepReport(policies, graded);
    expect(new Set(report.ranked.map((r) => r.stats.n)).size).toBe(1);
  });

  it('produces a walk-forward result that names an out-of-sample rank', () => {
    const report = buildSweepReport(policies, gradedFor('t2|w1|h6'));
    expect(report.walkForward).toBeDefined();
    expect(report.walkForward?.outOfSampleRank).toBeGreaterThanOrEqual(1);
    expect(report.walkForward?.policyCount).toBe(policies.length);
  });

  it('excludes unresolved signals from every policy', () => {
    const map = new Map<string, GradedSignal[]>();
    for (const p of policies) {
      map.set(p.id, [sig({ status: 'TARGET1', r: 1 }), sig({ status: 'OPEN', r: undefined })]);
    }
    expect(buildSweepReport(policies, map).ranked[0].stats.n).toBe(1);
  });

  it('slices by year, and by regime when a benchmark is supplied', () => {
    const bars: Candle[] = Array.from({ length: 400 }, (_, i) => {
      const c = 100 + i;
      return {
        time: Date.UTC(2023, 0, 1) / 1000 + i * 86400,
        open: c,
        high: c + 1,
        low: c - 1,
        close: c,
        volume: 1000,
      };
    });
    const cal = buildRegimeCalendar('SPY', bars);
    const report = buildSweepReport(policies, gradedFor('t2|w1|h6'), cal);
    expect(report.byYear.length).toBeGreaterThan(0);
    expect(report.byTrendRegime.length).toBeGreaterThan(0);
  });

  it('omits the regime tables entirely when no benchmark is available', () => {
    const report = buildSweepReport(policies, gradedFor('t2|w1|h6'));
    expect(report.byTrendRegime).toEqual([]);
    expect(report.byVolRegime).toEqual([]);
  });
});

describe('renderSweepReport', () => {
  const meta = { provenance: 'Test sample.', generatedAt: new Date('2026-08-16') };
  const policies = exitStage();

  const gradedWith = (rFor: (id: string, i: number) => number, count = 400) => {
    const map = new Map<string, GradedSignal[]>();
    for (const p of policies) {
      map.set(
        p.id,
        Array.from({ length: count }, (_, i) =>
          sig({
            key: `s${i}`,
            date: `202${Math.floor(i / 100)}-0${(i % 9) + 1}-15`,
            status: 'TARGET1',
            r: rFor(p.id, i),
          }),
        ),
      );
    }
    return map;
  };

  it('says plainly when there is nothing to compare', () => {
    const md = renderSweepReport(buildSweepReport(policies, new Map()), meta);
    expect(md).toContain('No settled signals');
  });

  it('warns loudly on a sample too small to pick a policy from', () => {
    const md = renderSweepReport(buildSweepReport(policies, gradedWith(() => 1, 10)), meta);
    expect(md).toContain('far too small to choose a policy from');
  });

  it('leads with the walk-forward section, not the leaderboard', () => {
    const md = renderSweepReport(buildSweepReport(policies, gradedWith(() => 1)), meta);
    expect(md.indexOf('Does the best policy stay best?')).toBeLessThan(
      md.indexOf('Policy leaderboard'),
    );
  });

  it('calls out a sweep whose ordering does not survive out-of-sample', () => {
    // Each policy's edge is confined to the first half, then reverses.
    let flip = 0;
    const md = renderSweepReport(
      buildSweepReport(
        policies,
        gradedWith((id, i) => {
          flip = (flip + 1) % 7;
          const early = i < 200;
          const bonus = policies.findIndex((p) => p.id === id) / 10;
          return early ? bonus + flip * 0.01 : -bonus + flip * 0.01;
        }),
      ),
      meta,
    );
    expect(md).toContain('does not survive');
  });

  it('marks the live policy in the leaderboard so the comparison is obvious', () => {
    const md = renderSweepReport(buildSweepReport(policies, gradedWith(() => 1)), meta);
    expect(md).toContain('_(live)_');
  });

  it('renders the stability sections', () => {
    const md = renderSweepReport(buildSweepReport(policies, gradedWith(() => 1)), meta);
    expect(md).toContain('## Year by year');
    expect(md).toContain('R is always measured against the plan');
  });
});
