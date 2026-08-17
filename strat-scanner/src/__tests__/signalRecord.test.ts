import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ENROLL_OPTIONS,
  isoDate,
  planOf,
  selectForEnrollment,
  toGraded,
  toTracked,
  trackKey,
} from '../strat/signalRecord';
import { Signal } from '../strat/types';

const sig = (over: Partial<Signal> = {}): Signal => ({
  symbol: 'SPY',
  lastPrice: 100,
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  status: 'POTENTIAL',
  scenario: 'reversal',
  compression: true,
  isReversal: true,
  confidence: 70,
  confidenceLabel: 'High',
  factors: [
    { key: 'base', label: 'base', points: 32 },
    { key: 'ftfc-full', label: 'ftfc', points: 24 },
  ],
  explanation: 'x',
  levels: { entry: 101, stop: 99, target1: 104, target2: 106, rr1: 1.5, rr2: 2.5 },
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'down' },
  setupBarTime: 1_700_000_000,
  triggerBarEnd: 1_700_086_400,
  ...over,
});

describe('trackKey', () => {
  it('is stable across a POTENTIAL -> TRIGGERED transition', () => {
    // The alerters key on status because they want to ping twice. The record
    // must not, or every trade is counted twice.
    expect(trackKey(sig({ status: 'POTENTIAL' }))).toBe(trackKey(sig({ status: 'TRIGGERED' })));
  });

  it('separates the two scenarios one actionable bar can publish', () => {
    const bull = sig({ direction: 'bullish', pattern: '2-1-2 Reversal' });
    const bear = sig({ direction: 'bearish', pattern: '2-1-2 Continuation' });
    expect(trackKey(bull)).not.toBe(trackKey(bear));
  });

  it('separates the same setup on different timeframes and bars', () => {
    expect(trackKey(sig({ timeframe: 'W' }))).not.toBe(trackKey(sig({ timeframe: 'D' })));
    expect(trackKey(sig({ setupBarTime: 1 }))).not.toBe(trackKey(sig({ setupBarTime: 2 })));
  });
});

describe('toTracked', () => {
  it('counts aligned and opposed timeframes for the trade direction', () => {
    const t = toTracked(sig(), '2026-01-01');
    expect(t.aligned).toBe(3); // 4H, D, W up
    expect(t.opposed).toBe(1); // M down
    expect(t.fullContinuity).toBe(false);
  });

  it('flips alignment for a short', () => {
    const t = toTracked(sig({ direction: 'bearish' }), '2026-01-01');
    expect(t.aligned).toBe(1);
    expect(t.opposed).toBe(3);
  });

  it('recognises full continuity', () => {
    const t = toTracked(sig({ continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' } }), '2026-01-01');
    expect(t.fullContinuity).toBe(true);
    expect(t.opposed).toBe(0);
  });

  it('ignores flat timeframes on both sides of the count', () => {
    const t = toTracked(sig({ continuity: { D: 'up', W: 'flat', M: 'flat' } }), '2026-01-01');
    expect(t.aligned).toBe(1);
    expect(t.opposed).toBe(0);
    // One aligned timeframe is not full continuity, however few disagree.
    expect(t.fullContinuity).toBe(false);
  });

  it('carries the confidence factor keys, not their labels', () => {
    expect(toTracked(sig(), '2026-01-01').factorKeys).toEqual(['base', 'ftfc-full']);
  });

  it('starts every record PENDING', () => {
    expect(toTracked(sig(), '2026-01-01').resolution.status).toBe('PENDING');
  });
});

describe('planOf', () => {
  it('carries the real trigger-bar boundary rather than re-deriving it', () => {
    const plan = planOf(toTracked(sig(), '2026-01-01'));
    expect(plan.triggerBarEnd).toBe(1_700_086_400);
    expect(plan.levels.entry).toBe(101);
  });
});

describe('toGraded', () => {
  it('flattens the resolution and keeps the promised R for comparison', () => {
    const t = toTracked(sig(), '2026-01-01');
    const g = toGraded({
      ...t,
      resolution: { status: 'TARGET1', r: 1.5, mfeR: 2, maeR: 0.2, reachedTarget2: true },
    });
    expect(g.status).toBe('TARGET1');
    expect(g.r).toBe(1.5);
    expect(g.promisedR).toBe(1.5);
    expect(g.reachedTarget2).toBe(true);
    expect(g.date).toBe('2026-01-01');
    expect(g.key).toBe(t.key);
  });
});

describe('selectForEnrollment', () => {
  it('skips signals already on the record', () => {
    const s = sig();
    expect(selectForEnrollment([s], new Set([trackKey(s)]))).toHaveLength(0);
    expect(selectForEnrollment([s], new Set())).toHaveLength(1);
  });

  it('applies the confidence floor', () => {
    const low = sig({ confidence: 20 });
    expect(selectForEnrollment([low], new Set())).toHaveLength(0);
    expect(
      selectForEnrollment([low], new Set(), { ...DEFAULT_ENROLL_OPTIONS, minConfidence: 0 }),
    ).toHaveLength(1);
  });

  it('excludes 4H, which daily bars cannot resolve honestly', () => {
    expect(selectForEnrollment([sig({ timeframe: '4H' })], new Set())).toHaveLength(0);
    expect(selectForEnrollment([sig({ timeframe: 'M' })], new Set())).toHaveLength(1);
  });

  it('enrols each scenario of one actionable bar separately', () => {
    const both = [
      sig({ direction: 'bullish', pattern: '2-1-2 Reversal' }),
      sig({ direction: 'bearish', pattern: '2-1-2 Continuation' }),
    ];
    expect(selectForEnrollment(both, new Set())).toHaveLength(2);
  });
});

describe('isoDate', () => {
  it('formats a Date and a unix-seconds timestamp the same way', () => {
    expect(isoDate(new Date('2026-08-16T12:00:00Z'))).toBe('2026-08-16');
    expect(isoDate(1_700_000_000)).toBe('2023-11-14');
  });
});
