import { describe, expect, it } from 'vitest';
import {
  buildTargetQuality,
  pivotTarget,
  renderTargetQuality,
  sampleTarget,
  TargetSample,
} from '../strat/targetQuality';
import { computeLevels } from '../strat/levels';
import { rewardRiskPoints } from '../strat/confidence';
import { Candle, Levels } from '../strat/types';

const DAY = 86400;
const T0 = 1_700_000_000;

const bar = (i: number, high: number, low: number): Candle => ({
  time: T0 + i * DAY,
  open: (high + low) / 2,
  high,
  low,
  close: (high + low) / 2,
  volume: 1000,
});

describe('pivotTarget', () => {
  // A clear swing high at index 5 (high 130), surrounded by lower highs.
  const withPivot: Candle[] = [
    bar(0, 110, 100),
    bar(1, 112, 101),
    bar(2, 115, 102),
    bar(3, 118, 103),
    bar(4, 120, 104),
    bar(5, 130, 105), // swing high
    bar(6, 121, 106),
    bar(7, 119, 107),
    bar(8, 117, 108),
    bar(9, 116, 109),
    bar(10, 105, 95), // trigger bar
  ];

  it('finds the swing high above entry', () => {
    expect(pivotTarget(withPivot, 'bullish', 106)).toBe(130);
  });

  it('ignores pivots that are not beyond entry', () => {
    expect(pivotTarget(withPivot, 'bullish', 140)).toBeNull();
  });

  it('mirrors for shorts, finding the swing low', () => {
    const withLow: Candle[] = [
      bar(0, 120, 110),
      bar(1, 119, 108),
      bar(2, 118, 106),
      bar(3, 117, 90), // swing low
      bar(4, 118, 104),
      bar(5, 119, 106),
      bar(6, 120, 108),
      bar(7, 125, 115), // trigger bar
    ];
    expect(pivotTarget(withLow, 'bearish', 103)).toBe(90);
  });

  it('returns null when there is nothing to find', () => {
    expect(pivotTarget([], 'bullish', 100)).toBeNull();
  });
});

describe('sampleTarget — classification', () => {
  const levels = (over: Partial<Levels> = {}): Levels => ({
    entry: 106,
    stop: 94,
    target1: 130,
    target2: 150,
    rr1: 2,
    rr2: 3.6,
    ...over,
  });

  const series: Candle[] = [
    bar(0, 110, 100),
    bar(1, 112, 101),
    bar(2, 115, 102),
    bar(3, 118, 103),
    bar(4, 120, 104),
    bar(5, 130, 105), // swing high
    bar(6, 121, 106),
    bar(7, 119, 107),
    bar(8, 117, 108),
    bar(9, 116, 109),
    bar(10, 105, 95),
  ];

  it('recognises a target that came from a swing pivot', () => {
    const s = sampleTarget(series, 'bullish', 'D', levels({ target1: 130 }), 60);
    expect(s?.source).toBe('pivot');
  });

  it('recognises a target that came from an ordinary bar high', () => {
    // 116 is a bar high in the window but not a swing pivot.
    const s = sampleTarget(series, 'bullish', 'D', levels({ target1: 116 }), 60);
    expect(s?.source).toBe('bar-high');
  });

  it('recognises the measured 1.5R fallback', () => {
    // entry 106, stop 94 → risk 12 → 1.5R projection is 124.
    const s = sampleTarget(series, 'bullish', 'D', levels({ target1: 124 }), 60);
    expect(s?.source).toBe('measured');
  });

  it('refuses to sample a plan with no risk', () => {
    expect(sampleTarget(series, 'bullish', 'D', levels({ stop: 106 }), 60)).toBeNull();
  });
});

describe('sampleTarget — the confidence consequence', () => {
  const series: Candle[] = [
    bar(0, 110, 100),
    bar(1, 112, 101),
    bar(2, 115, 102),
    bar(3, 118, 103),
    bar(4, 120, 104),
    bar(5, 160, 105), // distant swing high
    bar(6, 121, 106),
    bar(7, 119, 107),
    bar(8, 117, 108),
    bar(9, 116, 109),
    bar(10, 105, 95),
  ];

  it('measures how far a nearby target undersells the reward/risk', () => {
    // Published target 107 is barely above entry; the pivot is at 160.
    const s = sampleTarget(
      series,
      'bullish',
      'D',
      { entry: 106, stop: 94, target1: 107, target2: 120, rr1: 0.08, rr2: 1.2 },
      48,
    );
    expect(s?.rr1).toBeCloseTo(1 / 12, 4);
    expect(s?.pivotRr1).toBeCloseTo(54 / 12, 4);
    // rr-poor (-5) becomes rr-strong (+10): a 15-point swing.
    expect(s?.confidenceDelta).toBe(15);
  });

  it('reports no confidence movement when the band does not change', () => {
    const s = sampleTarget(
      series,
      'bullish',
      'D',
      { entry: 106, stop: 94, target1: 130, target2: 150, rr1: 2, rr2: 3.6 },
      60,
    );
    // Both published and pivot targets land in the >= 2R band.
    expect(s?.confidenceDelta).toBe(0);
  });

  it('uses the same banding the confidence model uses', () => {
    // One definition, so tuning the model cannot silently desync the report.
    expect(rewardRiskPoints(0.1)).toBe(-5);
    expect(rewardRiskPoints(1.5)).toBe(5);
    expect(rewardRiskPoints(3)).toBe(10);
  });
});

describe('sampleTarget against the real computeLevels', () => {
  it('classifies what the engine actually publishes', () => {
    const series: Candle[] = [
      bar(0, 110, 100),
      bar(1, 112, 101),
      bar(2, 115, 102),
      bar(3, 118, 103),
      bar(4, 120, 104),
      bar(5, 130, 105),
      bar(6, 121, 106),
      bar(7, 119, 107),
      bar(8, 117, 108),
      bar(9, 116, 109),
      bar(10, 105, 95),
    ];
    const levels = computeLevels(series, 'bullish');
    const s = sampleTarget(series, 'bullish', 'D', levels, 55);
    expect(s).not.toBeNull();

    // The whole point, in one assertion. Entry is 105.01, and the engine takes
    // the LOWEST overhead bar high — which is bar 0's 110, the oldest bar in
    // the window and structurally meaningless. The obvious swing high at 130
    // sits right there and is ignored.
    expect(levels.target1).toBe(110);
    expect(s?.source).toBe('bar-high');

    // 130 against 105.01 is a far better objective over the same risk.
    expect(s?.pivotRr1).toBeGreaterThan((s?.rr1 as number) * 2);
    // And it is the difference between "reward under the risk" and "strong".
    expect(s?.confidenceDelta).toBe(15);
  });
});

describe('buildTargetQuality', () => {
  let n = 0;
  const sample = (over: Partial<TargetSample> = {}): TargetSample => ({
    timeframe: 'D',
    direction: 'bullish',
    source: 'bar-high',
    rr1: 0.2,
    pivotRr1: 2.5,
    confidence: 48 + (n++ % 3),
    confidenceDelta: 15,
    ...over,
  });

  it('returns an empty shape rather than dividing by zero', () => {
    const q = buildTargetQuality([]);
    expect(q.n).toBe(0);
    expect(q.medianRr1).toBe(0);
    expect(q.bySource).toEqual([]);
  });

  it('reports the reward/risk distribution', () => {
    const q = buildTargetQuality([
      sample({ rr1: 0.1 }),
      sample({ rr1: 0.5 }),
      sample({ rr1: 1.5 }),
      sample({ rr1: 3 }),
    ]);
    expect(q.medianRr1).toBeCloseTo(1.0, 5);
    expect(q.belowOneRShare).toBe(0.5);
    expect(q.q1Rr1).toBeLessThan(q.medianRr1);
    expect(q.q3Rr1).toBeGreaterThan(q.medianRr1);
  });

  it('breaks down where targets came from', () => {
    const q = buildTargetQuality([
      sample({ source: 'pivot' }),
      sample({ source: 'bar-high' }),
      sample({ source: 'bar-high' }),
      sample({ source: 'measured' }),
    ]);
    expect(q.bySource.map((s) => s.source)).toEqual(['pivot', 'bar-high', 'measured']);
    expect(q.bySource.find((s) => s.source === 'bar-high')?.share).toBe(0.5);
  });

  it('counts only signals that would actually cross an alert floor', () => {
    const q = buildTargetQuality([
      // 48 -> 63 crosses both 50 and 60.
      sample({ confidence: 48, confidenceDelta: 15 }),
      // 70 -> 75 crosses neither.
      sample({ confidence: 70, confidenceDelta: 5 }),
      // 30 -> 30 cannot cross anything.
      sample({ confidence: 30, confidenceDelta: 0 }),
    ]);
    expect(q.crossed50Share).toBeCloseTo(1 / 3, 5);
    expect(q.crossed60Share).toBeCloseTo(1 / 3, 5);
  });

  it('counts a moved target only when the reward/risk actually differs', () => {
    const q = buildTargetQuality([
      sample({ rr1: 1, pivotRr1: 1 }),
      sample({ rr1: 1, pivotRr1: 2 }),
    ]);
    expect(q.movedShare).toBe(0.5);
  });

  it('slices by timeframe', () => {
    const q = buildTargetQuality([
      sample({ timeframe: 'D' }),
      sample({ timeframe: 'W' }),
      sample({ timeframe: 'W' }),
    ]);
    expect(q.byTimeframe.map((t) => t.timeframe)).toEqual(['D', 'W']);
    expect(q.byTimeframe.find((t) => t.timeframe === 'W')?.n).toBe(2);
  });
});

describe('renderTargetQuality', () => {
  const many = (rr1: number, count: number): TargetSample[] =>
    Array.from({ length: count }, () => ({
      timeframe: 'D' as const,
      direction: 'bullish' as const,
      source: 'bar-high' as const,
      rr1,
      pivotRr1: 2.5,
      confidence: 55,
      confidenceDelta: 15,
    }));

  it('says plainly when there is nothing sampled', () => {
    expect(renderTargetQuality(buildTargetQuality([]))).toContain('No targets sampled');
  });

  it('warns hard when most targets sit closer than the stop', () => {
    const md = renderTargetQuality(buildTargetQuality(many(0.15, 50)));
    expect(md).toContain('Most published targets sit closer than the risk');
    // It must name both consequences, not just the cosmetic one.
    expect(md).toContain('rr-poor');
    expect(md).toContain('at target 1');
  });

  it('stays quiet about that when targets are healthy', () => {
    const md = renderTargetQuality(buildTargetQuality(many(2.5, 50)));
    expect(md).not.toContain('Most published targets sit closer than the risk');
  });

  it('points at the policy sweep rather than recommending a change', () => {
    const md = renderTargetQuality(buildTargetQuality(many(0.15, 50)));
    expect(md).toContain('diagnostic, not a recommendation');
    expect(md).toContain('Hold for T2');
  });

  it('renders the breakdown tables', () => {
    const md = renderTargetQuality(buildTargetQuality(many(0.15, 50)));
    expect(md).toContain('## Are the magnitude targets real?');
    expect(md).toContain('Target came from');
    expect(md).toContain('Pivot-only median');
  });
});
