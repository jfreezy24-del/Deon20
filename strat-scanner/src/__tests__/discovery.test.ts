import { describe, expect, it } from 'vitest';
import {
  buildDiscoveryReport,
  CandidateMetrics,
  correlation,
  DEFAULT_GATES,
  logReturns,
  magnitudeAvailabilityFrom,
  medianDollarVolume,
  renderDiscoveryReport,
  scoreCandidate,
  setupDensityFrom,
} from '../strat/discovery';
import { Candle } from '../strat/types';

const DAY = 86400;
const T0 = 1_700_000_000;

const bars = (closes: number[], volume = 1_000_000): Candle[] =>
  closes.map((c, i) => ({
    time: T0 + i * DAY,
    open: c,
    high: c * 1.01,
    low: c * 0.99,
    close: c,
    volume,
  }));

describe('medianDollarVolume', () => {
  it('multiplies price by volume and takes the median', () => {
    expect(medianDollarVolume(bars([10, 10, 10], 1000))).toBe(10_000);
  });

  it('is robust to a single freak session', () => {
    const normal = bars(Array(59).fill(10), 1000);
    const spike: Candle = { time: T0 + 60 * DAY, open: 10, high: 10, low: 10, close: 10, volume: 1e9 };
    // A median ignores the outlier; a mean would not.
    expect(medianDollarVolume([...normal, spike])).toBe(10_000);
  });

  it('ignores sessions with no volume rather than counting them as zero', () => {
    const withGaps = [...bars([10, 10], 1000), ...bars([10], 0)];
    expect(medianDollarVolume(withGaps)).toBe(10_000);
  });

  it('returns zero for an empty series', () => {
    expect(medianDollarVolume([])).toBe(0);
  });
});

describe('correlation', () => {
  const a = Array.from({ length: 100 }, (_, i) => Math.sin(i / 5));

  it('is 1 against itself', () => {
    expect(correlation(a, a)).toBeCloseTo(1, 6);
  });

  it('is -1 against its inverse', () => {
    expect(correlation(a, a.map((v) => -v))).toBeCloseTo(-1, 6);
  });

  it('refuses to report on too little overlap', () => {
    // A confident-looking correlation from 10 points is worse than none.
    expect(correlation(a.slice(0, 10), a.slice(0, 10))).toBe(0);
  });

  it('aligns from the end, so unequal lengths still compare', () => {
    expect(correlation(a, a.slice(20))).toBeCloseTo(1, 6);
  });

  it('does not divide by zero on a flat series', () => {
    expect(correlation(Array(100).fill(1), a)).toBe(0);
  });
});

describe('logReturns', () => {
  it('produces one fewer value than bars', () => {
    expect(logReturns(bars([10, 11, 12]))).toHaveLength(2);
  });

  it('skips non-positive prices rather than producing NaN', () => {
    const withZero = bars([10, 0, 12]);
    expect(logReturns(withZero).every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe('structure summaries', () => {
  it('reports setups per 100 trading days', () => {
    expect(setupDensityFrom({ signals: 20, withRealTarget: 10, bars: 1000 })).toBe(2);
  });

  it('reports the share of setups with a real level to measure to', () => {
    expect(magnitudeAvailabilityFrom({ signals: 20, withRealTarget: 15, bars: 1000 })).toBe(0.75);
  });

  it('does not divide by zero', () => {
    expect(setupDensityFrom({ signals: 0, withRealTarget: 0, bars: 0 })).toBe(0);
    expect(magnitudeAvailabilityFrom({ signals: 0, withRealTarget: 0, bars: 100 })).toBe(0);
  });
});

describe('scoreCandidate', () => {
  const metrics = (over: Partial<CandidateMetrics> = {}): CandidateMetrics => ({
    symbol: 'TEST',
    bars: 800,
    lastPrice: 100,
    dollarVolume: 500_000_000,
    volatility: 0.45,
    setupDensity: 8,
    magnitudeAvailability: 0.8,
    maxCorrelation: 0.3,
    incumbent: false,
    ...over,
  });

  it('passes a liquid, moving, uncorrelated name', () => {
    const c = scoreCandidate(metrics(), DEFAULT_GATES);
    expect(c.passed).toBe(true);
    expect(c.failures).toEqual([]);
    expect(c.score).toBeGreaterThan(50);
  });

  it('rejects a name that is too thin to trade', () => {
    const c = scoreCandidate(metrics({ dollarVolume: 2_000_000 }), DEFAULT_GATES);
    expect(c.passed).toBe(false);
    expect(c.failures.join(' ')).toContain('median daily volume');
  });

  it('rejects a name too quiet to pay for its own risk', () => {
    const c = scoreCandidate(metrics({ volatility: 0.05 }), DEFAULT_GATES);
    expect(c.failures.join(' ')).toContain('too quiet');
  });

  it('rejects a lottery ticket', () => {
    const c = scoreCandidate(metrics({ volatility: 4 }), DEFAULT_GATES);
    expect(c.failures.join(' ')).toContain('lottery ticket');
  });

  it('rejects a new name that duplicates something already watched', () => {
    const c = scoreCandidate(
      metrics({ maxCorrelation: 0.97, closestTo: 'SPY' }),
      DEFAULT_GATES,
    );
    expect(c.passed).toBe(false);
    expect(c.failures.join(' ')).toContain('correlated to SPY');
  });

  it('does not reject an incumbent for being correlated', () => {
    // You already own the decision to watch it; correlation is a criterion for
    // what to ADD, not a reason to evict.
    const c = scoreCandidate(
      metrics({ maxCorrelation: 0.99, closestTo: 'QQQ', incumbent: true }),
      DEFAULT_GATES,
    );
    expect(c.passed).toBe(true);
  });

  it('rewards a genuine diversifier over a near-duplicate', () => {
    const unique = scoreCandidate(metrics({ maxCorrelation: 0.1 }), DEFAULT_GATES);
    const dupe = scoreCandidate(metrics({ maxCorrelation: 0.85 }), DEFAULT_GATES);
    expect(unique.score).toBeGreaterThan(dupe.score);
  });

  it('rewards a symbol whose targets come from real levels', () => {
    const real = scoreCandidate(metrics({ magnitudeAvailability: 0.9 }), DEFAULT_GATES);
    const invented = scoreCandidate(metrics({ magnitudeAvailability: 0.1 }), DEFAULT_GATES);
    expect(real.score).toBeGreaterThan(invented.score);
  });

  it('scores volatility as a band, not as more-is-better', () => {
    const mid = scoreCandidate(metrics({ volatility: 0.45 }), DEFAULT_GATES);
    const extreme = scoreCandidate(metrics({ volatility: 2.0 }), DEFAULT_GATES);
    expect(mid.score).toBeGreaterThan(extreme.score);
  });

  it('rejects a symbol without enough history to have structure', () => {
    const c = scoreCandidate(metrics({ bars: 100 }), DEFAULT_GATES);
    expect(c.failures.join(' ')).toContain('daily bars');
  });
});

describe('buildDiscoveryReport', () => {
  const cand = (symbol: string, score: number, over: Partial<CandidateMetrics> = {}) =>
    scoreCandidate(
      {
        symbol,
        bars: 800,
        lastPrice: 100,
        dollarVolume: 500_000_000,
        volatility: 0.45,
        setupDensity: 8,
        magnitudeAvailability: score / 100,
        maxCorrelation: 0.2,
        incumbent: false,
        ...over,
      },
      DEFAULT_GATES,
    );

  it('proposes only new names, never ones already watched', () => {
    const report = buildDiscoveryReport(
      [cand('NEW', 90), cand('OLD', 90, { incumbent: true })],
      2,
      1,
    );
    expect(report.additions.map((c) => c.symbol)).toEqual(['NEW']);
  });

  it('caps the proposal list', () => {
    const many = Array.from({ length: 40 }, (_, i) => cand(`S${i}`, 80));
    expect(buildDiscoveryReport(many, 40, 0, 5).additions).toHaveLength(5);
  });

  it('flags watched symbols that stopped qualifying', () => {
    const report = buildDiscoveryReport(
      [cand('STALE', 50, { incumbent: true, dollarVolume: 1_000 })],
      1,
      1,
    );
    expect(report.removals.map((c) => c.symbol)).toEqual(['STALE']);
  });

  it('orders proposals best first', () => {
    const report = buildDiscoveryReport(
      [cand('LOW', 10), cand('HIGH', 95), cand('MID', 50)],
      3,
      0,
    );
    expect(report.additions[0].symbol).toBe('HIGH');
  });
});

describe('renderDiscoveryReport', () => {
  const meta = {
    generatedAt: new Date('2026-08-17'),
    provenance: 'Test pool.',
    gates: DEFAULT_GATES,
  };
  const cand = (symbol: string, over: Partial<CandidateMetrics> = {}) =>
    scoreCandidate(
      {
        symbol,
        bars: 800,
        lastPrice: 100,
        dollarVolume: 500_000_000,
        volatility: 0.45,
        setupDensity: 8,
        magnitudeAvailability: 0.8,
        maxCorrelation: 0.2,
        incumbent: false,
        ...over,
      },
      DEFAULT_GATES,
    );

  it('says plainly when nothing was screened', () => {
    expect(renderDiscoveryReport(buildDiscoveryReport([], 0, 0), meta)).toContain(
      'No candidates screened',
    );
  });

  it('treats an empty proposal list as a real answer, not a failure', () => {
    const md = renderDiscoveryReport(
      buildDiscoveryReport([cand('SPY', { incumbent: true })], 1, 1),
      meta,
    );
    expect(md).toContain('Nothing cleared the gates');
    expect(md).toContain('already cover');
  });

  it('states the anti-selection-bias rule prominently', () => {
    const md = renderDiscoveryReport(buildDiscoveryReport([cand('AAA')], 1, 0), meta);
    expect(md).toContain('never on backtested profit');
  });

  it('renders proposals, removals and the gates', () => {
    const md = renderDiscoveryReport(
      buildDiscoveryReport(
        [cand('AAA'), cand('STALE', { incumbent: true, volatility: 0.01 })],
        2,
        1,
      ),
      meta,
    );
    expect(md).toContain('## Proposed additions');
    expect(md).toContain('## Flagged for removal');
    expect(md).toContain('## Gates');
    expect(md).toContain('AAA');
    expect(md).toContain('STALE');
  });

  it('admits the candidate pool is itself survivorship-biased', () => {
    const md = renderDiscoveryReport(buildDiscoveryReport([cand('AAA')], 1, 0), meta);
    expect(md).toContain('survivorship-biased');
  });
});
