import { describe, expect, it } from 'vitest';
import { signalsForSymbol } from '../scanner';
import { TimeframeSeries } from '../data/series';
import { Candle, Timeframe } from '../strat/types';
import { isTerminal, resolvePlan } from '../strat/outcomes';
import { planOf, toGraded, toTracked, trackKey } from '../strat/signalRecord';
import { buildEdgeReport, renderEdgeReport } from '../strat/edgeReport';

/**
 * End-to-end cover for the record: scanner output → tracked record → resolved
 * outcome → edge report.
 *
 * The units are tested individually elsewhere. What this catches is the seam
 * between them — most importantly that `triggerBarEnd` survives the trip from
 * the scanner into the resolver, because if it silently defaults the whole
 * record measures the wrong bars and every number in the report is quietly
 * wrong rather than obviously broken.
 */

const DAY = 86400;
const T0 = Date.UTC(2026, 0, 5) / 1000; // a Monday

const bar = (
  time: number,
  open: number,
  high: number,
  low: number,
  close: number,
  volume = 1000,
): Candle => ({ time, open, high, low, close, volume });

/** A rising base, then a 2d bar, then an inside bar: a live 2d-1-? fork. */
function dailyCandles(): Candle[] {
  const out: Candle[] = [];
  for (let i = 0; i < 24; i++) {
    const base = 100 + i * 0.5;
    out.push(bar(T0 + i * DAY, base, base + 2, base - 1, base + 1));
  }
  const n = out.length;
  const prev = out[n - 1];
  // 2d: breaks the prior low only.
  out.push(bar(prev.time + DAY, prev.close, prev.high - 0.5, prev.low - 3, prev.low - 2));
  const d = out[out.length - 1];
  // 1: inside the 2d bar.
  out.push(bar(d.time + DAY, d.close, d.high - 0.5, d.low + 0.5, d.close));
  return out;
}

const series = (timeframe: Timeframe, completed: Candle[], forming: Candle | null): TimeframeSeries => ({
  timeframe,
  completed,
  forming,
  lastPrice: (forming ?? completed[completed.length - 1]).close,
});

describe('scanner → record → resolution → report', () => {
  const daily = dailyCandles();
  const insideBar = daily[daily.length - 1];
  // The forming bar opens the day after the inside bar closed: that instant is
  // the trigger-bar boundary the whole record depends on.
  const formingTime = insideBar.time + DAY;
  const forming = bar(formingTime, insideBar.close, insideBar.close + 0.2, insideBar.close - 0.2, insideBar.close);

  const signals = signalsForSymbol('TEST', [
    series('D', daily, forming),
    series('W', daily.filter((_, i) => i % 5 === 0), null),
    series('M', daily.filter((_, i) => i % 20 === 0), null),
  ]);

  it('publishes the inside-bar fork off the last completed bar', () => {
    const d = signals.filter((s) => s.timeframe === 'D');
    expect(d.length).toBeGreaterThan(0);
    expect(d.every((s) => s.sequence.endsWith('-?'))).toBe(true);
    expect(d.some((s) => s.compression)).toBe(true);
  });

  it('carries the real trigger-bar boundary from the scanner, not a guess', () => {
    for (const s of signals.filter((x) => x.timeframe === 'D')) {
      expect(s.triggerBarEnd).toBe(formingTime);
      expect(s.setupBarTime).toBe(insideBar.time);
    }
  });

  it('resolves a plan that runs to target against forward bars', () => {
    const long = signals.find((s) => s.timeframe === 'D' && s.direction === 'bullish');
    expect(long).toBeDefined();
    const t = toTracked(long as NonNullable<typeof long>, '2026-02-01');

    // Forward bars that clear the trigger and run straight to target 1.
    const forward = [
      bar(formingTime, t.levels.entry - 0.5, t.levels.target1 + 1, t.levels.entry - 1, t.levels.target1),
    ];
    const resolution = resolvePlan(planOf(t), forward);
    expect(resolution.status).toBe('TARGET1');
    expect(resolution.r).toBeCloseTo(t.levels.rr1, 1);
  });

  it('expires a plan whose "?" bar never took the trigger', () => {
    const long = signals.find((s) => s.timeframe === 'D' && s.direction === 'bullish');
    const t = toTracked(long as NonNullable<typeof long>, '2026-02-01');
    const quiet = [bar(formingTime, t.levels.stop + 0.5, t.levels.entry - 0.5, t.levels.stop + 0.2, t.levels.stop + 0.4)];
    const resolution = resolvePlan(planOf(t), quiet, undefined, formingTime + 30 * DAY);
    expect(resolution.status).toBe('EXPIRED');
    expect(isTerminal(resolution.status)).toBe(true);
  });

  it('produces stable, unique keys across the whole sweep', () => {
    const keys = signals.map(trackKey);
    expect(new Set(keys).size).toBe(keys.length);
    // Re-deriving from the same signal must give the same key.
    expect(trackKey(signals[0])).toBe(trackKey({ ...signals[0] }));
  });

  it('renders a report from graded records without a real sample', () => {
    const rows = signals.map((s) => {
      const t = toTracked(s, '2026-02-01');
      return toGraded({ ...t, resolution: { status: 'STOPPED', r: -1, mfeR: 0.4, maeR: 1 } });
    });
    const md = renderEdgeReport(buildEdgeReport(rows), {
      title: 'T',
      provenance: 'p',
      generatedAt: new Date('2026-08-16'),
    });
    expect(md).toContain('## Headline');
    // A handful of signals must be flagged as too small to mean anything.
    expect(md).toContain('is not a sample');
  });

  it('keeps promised R comparable with realised R', () => {
    const s = signals[0];
    const t = toTracked(s, '2026-02-01');
    const g = toGraded({ ...t, resolution: { status: 'TARGET1', r: s.levels.rr1 } });
    expect(g.promisedR).toBe(s.levels.rr1);
    expect(g.r).toBe(s.levels.rr1);
  });
});
