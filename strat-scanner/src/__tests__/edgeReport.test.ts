import { describe, expect, it } from 'vitest';
import {
  bucketStats,
  buildEdgeReport,
  confidenceRankCorrelation,
  continuityBucket,
  edgeDigest,
  factorLifts,
  GradedSignal,
  renderEdgeReport,
} from '../strat/edgeReport';
import { OutcomeStatus } from '../strat/outcomes';

let n = 0;
const sig = (over: Partial<GradedSignal> = {}): GradedSignal => ({
  key: `k${n}`,
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
  status: 'TARGET1' as OutcomeStatus,
  r: 1.5,
  mfeR: 1.8,
  maeR: 0.3,
  reachedTarget2: false,
  date: `2026-01-${String((n++ % 28) + 1).padStart(2, '0')}`,
  ...over,
});

const win = (o: Partial<GradedSignal> = {}) => sig({ status: 'TARGET1', r: 1, ...o });
const loss = (o: Partial<GradedSignal> = {}) => sig({ status: 'STOPPED', r: -1, ...o });
const expired = (o: Partial<GradedSignal> = {}) =>
  sig({ status: 'EXPIRED', r: undefined, mfeR: undefined, maeR: undefined, ...o });

describe('bucketStats', () => {
  it('separates trigger rate from win rate', () => {
    // 4 signals, 2 triggered, 1 of those won.
    const b = bucketStats('x', [win(), loss(), expired(), expired()]);
    expect(b.n).toBe(4);
    expect(b.trades).toBe(2);
    expect(b.triggerRate).toBe(0.5);
    expect(b.winRate).toBe(0.5);
  });

  it('counts never-triggered signals as zero R per signal, not as absent', () => {
    // +1R over 2 trades is +0.5R per trade, but over 4 signals it is +0.25R.
    const b = bucketStats('x', [win({ r: 2 }), loss(), expired(), expired()]);
    expect(b.avgR).toBe(0.5);
    expect(b.avgRPerSignal).toBe(0.25);
    expect(b.totalR).toBe(1);
  });

  it('reports promised against delivered R', () => {
    const b = bucketStats('x', [win({ r: 0.4, promisedR: 3 }), win({ r: 0.6, promisedR: 3 })]);
    expect(b.avgPromisedR).toBe(3);
    expect(b.avgR).toBeCloseTo(0.5, 5);
  });

  it('handles an empty bucket without dividing by zero', () => {
    const b = bucketStats('x', []);
    expect(b.winRate).toBe(0);
    expect(b.avgR).toBe(0);
    expect(b.triggerRate).toBe(0);
  });
});

describe('factorLifts', () => {
  it('scores a term that predicts nothing as zero lift', () => {
    const signals = [
      win({ factorKeys: ['base', 'volume'] }),
      loss({ factorKeys: ['base', 'volume'] }),
      win({ factorKeys: ['base'] }),
      loss({ factorKeys: ['base'] }),
    ];
    const volume = factorLifts(signals).find((f) => f.key === 'volume');
    expect(volume?.lift).toBe(0);
  });

  it('surfaces a term that genuinely separates winners from losers', () => {
    const signals = [
      win({ factorKeys: ['base', 'ftfc-full'] }),
      win({ factorKeys: ['base', 'ftfc-full'] }),
      loss({ factorKeys: ['base'] }),
      loss({ factorKeys: ['base'] }),
    ];
    const ftfc = factorLifts(signals).find((f) => f.key === 'ftfc-full');
    expect(ftfc?.lift).toBe(2); // +1R per signal with, -1R without
    expect(ftfc?.withWinRate).toBe(1);
    expect(ftfc?.withoutWinRate).toBe(0);
  });

  it('catches a term that is actively harmful', () => {
    const signals = [
      loss({ factorKeys: ['base', 'compression'] }),
      loss({ factorKeys: ['base', 'compression'] }),
      win({ factorKeys: ['base'] }),
    ];
    const c = factorLifts(signals).find((f) => f.key === 'compression');
    expect(c?.lift).toBeLessThan(0);
  });
});

describe('confidenceRankCorrelation', () => {
  it('is strongly positive when higher confidence really does win more', () => {
    const signals = [
      loss({ confidence: 30, r: -1 }),
      loss({ confidence: 40, r: -0.8 }),
      win({ confidence: 70, r: 1 }),
      win({ confidence: 85, r: 2 }),
    ];
    expect(confidenceRankCorrelation(signals)).toBeCloseTo(1, 5);
  });

  it('is negative when the score is inverted', () => {
    const signals = [
      win({ confidence: 30, r: 2 }),
      win({ confidence: 40, r: 1 }),
      loss({ confidence: 70, r: -1 }),
      loss({ confidence: 85, r: -2 }),
    ];
    expect(confidenceRankCorrelation(signals)).toBeCloseTo(-1, 5);
  });

  it('returns zero rather than NaN on a degenerate sample', () => {
    expect(confidenceRankCorrelation([win(), win()])).toBe(0);
    expect(confidenceRankCorrelation([])).toBe(0);
    // All confidences identical — no ordering to correlate with.
    expect(
      confidenceRankCorrelation([
        win({ confidence: 60, r: 1 }),
        loss({ confidence: 60, r: -1 }),
        win({ confidence: 60, r: 2 }),
      ]),
    ).toBe(0);
  });

  it('ignores signals that never became trades', () => {
    // The expired ones carry no R and must not be ranked as zeros.
    const signals = [
      loss({ confidence: 30, r: -1 }),
      win({ confidence: 90, r: 1 }),
      expired({ confidence: 95 }),
      expired({ confidence: 10 }),
    ];
    expect(confidenceRankCorrelation(signals)).toBe(0); // only 2 trades, below the floor
  });
});

describe('continuityBucket', () => {
  it('labels each continuity state', () => {
    expect(continuityBucket(sig({ fullContinuity: true, aligned: 4, opposed: 0 }))).toBe(
      'Full continuity',
    );
    expect(continuityBucket(sig({ fullContinuity: false, aligned: 2, opposed: 0 }))).toBe(
      'Aligned, not full',
    );
    expect(continuityBucket(sig({ fullContinuity: false, aligned: 2, opposed: 1 }))).toBe('Mixed');
    expect(continuityBucket(sig({ fullContinuity: false, aligned: 0, opposed: 3 }))).toBe(
      'Counter-continuity',
    );
    expect(continuityBucket(sig({ fullContinuity: false, aligned: 0, opposed: 0 }))).toBe(
      'Flat / unknown',
    );
  });
});

describe('buildEdgeReport', () => {
  it('excludes unresolved signals from the statistics but counts them', () => {
    const report = buildEdgeReport([
      win(),
      loss(),
      sig({ status: 'OPEN', r: undefined }),
      sig({ status: 'PENDING', r: undefined }),
    ]);
    expect(report.overall.n).toBe(2);
    expect(report.openCount).toBe(1);
    expect(report.pendingCount).toBe(1);
  });

  it('slices by every dimension the model scores on', () => {
    const report = buildEdgeReport([
      win({ pattern: '2-1-2 Reversal', timeframe: 'D' }),
      loss({ pattern: '3-1-2 Reversal', timeframe: 'W' }),
      win({ pattern: '2-1-2 Reversal', timeframe: 'W', compression: false, isReversal: false }),
    ]);
    expect(report.byPattern.map((b) => b.label).sort()).toEqual([
      '2-1-2 Reversal',
      '3-1-2 Reversal',
    ]);
    expect(report.byTimeframe.map((b) => b.label)).toEqual(['D', 'W']);
    expect(report.byScenario.map((b) => b.label).sort()).toEqual(['Continuation', 'Reversal']);
    expect(report.byCompression).toHaveLength(2);
  });

  it('keeps confidence bands in ascending order', () => {
    const report = buildEdgeReport([win({ confidence: 80 }), loss({ confidence: 30 })]);
    expect(report.byConfidence.map((b) => b.label)).toEqual(['< 45 (Low)', '75+ (High)']);
  });
});

describe('renderEdgeReport', () => {
  const meta = { title: 'Edge Report', provenance: 'Test sample.', generatedAt: new Date('2026-08-16') };

  it('says plainly when there is nothing to measure', () => {
    const md = renderEdgeReport(buildEdgeReport([]), meta);
    expect(md).toContain('No settled signals yet');
  });

  it('warns loudly on a sample too small to mean anything', () => {
    const md = renderEdgeReport(buildEdgeReport([win(), loss()]), meta);
    expect(md).toContain('is not a sample');
  });

  it('calls out a score that ranks nothing', () => {
    // Confidence uncorrelated with outcome.
    const flat = [
      win({ confidence: 60, r: 1 }),
      loss({ confidence: 60, r: -1 }),
      win({ confidence: 60, r: 1 }),
    ];
    expect(renderEdgeReport(buildEdgeReport(flat), meta)).toContain('decoration');
  });

  it('calls out an inverted score', () => {
    const inverted = [
      win({ confidence: 20, r: 2 }),
      win({ confidence: 30, r: 1 }),
      loss({ confidence: 80, r: -1 }),
      loss({ confidence: 90, r: -2 }),
    ];
    expect(renderEdgeReport(buildEdgeReport(inverted), meta)).toContain('inverted');
  });

  it('renders every section with a real sample', () => {
    const many = Array.from({ length: 40 }, (_, i) =>
      i % 2 === 0 ? win({ confidence: 70 + i }) : loss({ confidence: 30 + i }),
    );
    const md = renderEdgeReport(buildEdgeReport(many), meta);
    expect(md).toContain('## Headline');
    expect(md).toContain('## Does confidence mean anything?');
    expect(md).toContain('## Which confidence terms are earning their weight?');
    expect(md).toContain('## By pattern');
    expect(md).toContain('## By timeframe continuity');
    expect(md).not.toContain('is not a sample');
  });
});

describe('edgeDigest', () => {
  it('fits the headline into a push notification', () => {
    const d = edgeDigest(buildEdgeReport([win(), loss(), expired()]));
    expect(d).toContain('settled signals');
    expect(d.split('\n')).toHaveLength(2);
  });

  it('handles an empty record', () => {
    expect(edgeDigest(buildEdgeReport([]))).toContain('still filling up');
  });
});
