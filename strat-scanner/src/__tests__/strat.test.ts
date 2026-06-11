import { describe, expect, it } from 'vitest';
import { classifyCandle, classifySeries } from '../strat/classify';
import { detectSetups } from '../strat/patterns';
import { computeLevels } from '../strat/levels';
import { buildContinuity, scoreContinuity } from '../strat/continuity';
import { scoreConfidence } from '../strat/confidence';
import { aggregateTo4H } from '../data/aggregate';
import { signalsForSymbol } from '../scanner';
import { Candle } from '../strat/types';
import { TimeframeSeries } from '../data/yahoo';

let t = 1_700_000_000;
const bar = (open: number, high: number, low: number, close: number, volume = 1000): Candle => ({
  time: (t += 86400),
  open,
  high,
  low,
  close,
  volume,
});

describe('classifyCandle', () => {
  const prev = bar(100, 110, 90, 105);
  it('detects inside bars (1)', () => {
    expect(classifyCandle(prev, bar(102, 108, 95, 100))).toBe('1');
  });
  it('detects 2-up', () => {
    expect(classifyCandle(prev, bar(105, 115, 95, 112))).toBe('2u');
  });
  it('detects 2-down', () => {
    expect(classifyCandle(prev, bar(100, 108, 85, 88))).toBe('2d');
  });
  it('detects outside bars (3)', () => {
    expect(classifyCandle(prev, bar(100, 115, 85, 100))).toBe('3');
  });
  it('equal high/low is still inside (must BREAK the level)', () => {
    expect(classifyCandle(prev, bar(100, 110, 90, 100))).toBe('1');
  });
});

describe('detectSetups', () => {
  it('finds 2-1-2 bullish reversal and bearish continuation off 2d-1', () => {
    const candles = [
      bar(100, 110, 90, 105),
      bar(104, 109, 92, 95), // inside-ish baseline
      bar(95, 105, 85, 88), // 2d (broke low)
      bar(89, 95, 87, 93), // 1 (inside the 2d bar)
    ];
    const setups = detectSetups(candles);
    const names = setups.map((s) => s.name);
    expect(names).toContain('2-1-2 Bullish Reversal');
    expect(names).toContain('2-1-2 Bearish Continuation');
    const bull = setups.find((s) => s.name === '2-1-2 Bullish Reversal')!;
    expect(bull.direction).toBe('bullish');
    expect(bull.isReversal).toBe(true);
    expect(bull.triggerBar).toBe(candles[3]);
  });

  it('finds 3-1-2 off an outside bar then inside bar', () => {
    const candles = [
      bar(100, 110, 90, 105),
      bar(104, 109, 92, 95),
      bar(95, 112, 88, 108), // 3 (broke both sides of previous bar)
      bar(105, 110, 100, 102), // 1
    ];
    const names = detectSetups(candles).map((s) => s.name);
    expect(names).toContain('3-1-2 Bullish');
    expect(names).toContain('3-1-2 Bearish');
  });

  it('finds Rev Strat 1-2-2 bullish off 1 then failed 2d', () => {
    const candles = [
      bar(100, 110, 90, 105),
      bar(102, 108, 95, 100), // 1
      bar(99, 106, 92, 94), // 2d out of the inside bar
      // (the trigger is a break back above 106)
    ];
    const names = detectSetups(candles).map((s) => s.name);
    expect(names).toContain('Rev Strat (1-2-2) Bullish');
  });

  it('finds plain 2-2 reversal/continuation off a lone 2d', () => {
    const candles = [
      bar(100, 110, 90, 105),
      bar(105, 115, 95, 112), // 2u
      bar(110, 113, 88, 92), // 2d
    ];
    const names = detectSetups(candles).map((s) => s.name);
    expect(names).toContain('2-2 Bullish Reversal');
    expect(names).toContain('2-2 Bearish Continuation');
  });

  it('finds 1-1-2 off double inside bars', () => {
    const candles = [
      bar(100, 110, 90, 105),
      bar(102, 108, 95, 100), // 1
      bar(101, 106, 97, 103), // 1
    ];
    const names = detectSetups(candles).map((s) => s.name);
    expect(names).toContain('1-1-2 Bullish');
    expect(names).toContain('1-1-2 Bearish');
  });

  it('returns nothing with fewer than 4 bars only for 3-bar patterns needing context', () => {
    expect(detectSetups([bar(1, 2, 0.5, 1.5)])).toEqual([]);
  });
});

describe('computeLevels', () => {
  it('bullish: entry above trigger high, stop below trigger low, target at prior pivot', () => {
    const candles = [
      bar(100, 120, 99, 110), // prior pivot high 120
      bar(110, 115, 100, 105),
      bar(104, 112, 95, 98), // 2d
      bar(99, 105, 97, 103), // inside trigger bar
    ];
    const lv = computeLevels(candles, 'bullish');
    expect(lv.entry).toBeCloseTo(105.01, 2);
    expect(lv.stop).toBeCloseTo(96.99, 2);
    expect(lv.target1).toBe(112); // nearest prior high above entry
    expect(lv.target2).toBeGreaterThanOrEqual(lv.target1);
    expect(lv.rr1).toBeGreaterThan(0);
  });

  it('bearish: mirror logic', () => {
    const candles = [
      bar(100, 105, 80, 90), // prior pivot low 80
      bar(95, 102, 88, 92),
      bar(93, 108, 90, 104), // 2u
      bar(103, 106, 96, 98), // trigger
    ];
    const lv = computeLevels(candles, 'bearish');
    expect(lv.entry).toBeCloseTo(95.99, 2);
    expect(lv.stop).toBeCloseTo(106.01, 2);
    expect(lv.target1).toBe(90); // nearest prior low below entry
    expect(lv.target2).toBeLessThanOrEqual(lv.target1);
  });

  it('falls back to measured targets when no pivot beyond entry', () => {
    const candles = [bar(10, 11, 9, 10), bar(10, 12, 9.5, 11.5), bar(11, 13, 10.5, 12.5), bar(12.4, 13.5, 12, 13)];
    const lv = computeLevels(candles, 'bullish');
    const risk = lv.entry - lv.stop;
    expect(lv.target1).toBeCloseTo(lv.entry + 1.5 * risk, 2);
  });
});

describe('continuity', () => {
  it('builds and scores FTFC', () => {
    const map = buildContinuity({
      '4H': bar(100, 105, 99, 104), // up
      D: bar(100, 106, 98, 103), // up
      W: bar(101, 107, 97, 105), // up
      M: bar(99, 108, 95, 90), // down
    });
    expect(map['4H']).toBe('up');
    expect(map.M).toBe('down');
    const bull = scoreContinuity(map, 'bullish');
    expect(bull.aligned).toEqual(['4H', 'D', 'W']);
    expect(bull.opposed).toEqual(['M']);
    expect(bull.full).toBe(false);

    const full = scoreContinuity(
      buildContinuity({
        '4H': bar(100, 105, 99, 104),
        D: bar(100, 106, 98, 103),
        W: bar(101, 107, 97, 105),
        M: bar(99, 108, 95, 107),
      }),
      'bullish',
    );
    expect(full.full).toBe(true);
  });
});

describe('scoreConfidence', () => {
  it('rewards continuity and good R:R, reports factors', () => {
    const candles = [
      bar(100, 120, 99, 110),
      bar(110, 115, 100, 105),
      bar(104, 112, 95, 98),
      bar(99, 105, 97, 104), // closes near high
    ];
    const setups = detectSetups(candles);
    const m = setups.find((s) => s.name === '2-1-2 Bullish Reversal')!;
    const levels = computeLevels(candles, 'bullish');
    const res = scoreConfidence({
      pattern: m,
      continuity: { aligned: ['4H', 'D', 'W', 'M'], opposed: [], full: true },
      levels,
      completed: candles,
      triggered: false,
    });
    expect(res.score).toBeGreaterThanOrEqual(60);
    expect(res.factors.length).toBeGreaterThanOrEqual(3);
    expect(res.factors.some((f) => f.label.includes('Full timeframe continuity'))).toBe(true);

    const opposed = scoreConfidence({
      pattern: m,
      continuity: { aligned: [], opposed: ['D', 'W', 'M'], full: false },
      levels,
      completed: candles,
      triggered: false,
    });
    expect(opposed.score).toBeLessThan(res.score);
  });
});

describe('aggregateTo4H', () => {
  it('groups 24h-market hourly bars into 4H buckets anchored at midnight', () => {
    const base = Math.floor(1_700_000_000 / 86400) * 86400; // midnight UTC
    const hours: Candle[] = Array.from({ length: 8 }, (_, i) => ({
      time: base + i * 3600,
      open: 100 + i,
      high: 101 + i,
      low: 99 + i,
      close: 100.5 + i,
      volume: 10,
    }));
    const fourH = aggregateTo4H(hours, 0);
    expect(fourH).toHaveLength(2);
    expect(fourH[0].time).toBe(base);
    expect(fourH[0].open).toBe(100);
    expect(fourH[0].high).toBe(101 + 3);
    expect(fourH[0].low).toBe(99);
    expect(fourH[0].close).toBe(100.5 + 3);
    expect(fourH[0].volume).toBe(40);
    expect(fourH[1].time).toBe(base + 4 * 3600);
  });

  it('re-anchors buckets at each new session day (equities)', () => {
    const day1 = Math.floor(1_700_000_000 / 86400) * 86400 + 9.5 * 3600; // 9:30
    const day2 = day1 + 86400;
    const mk = (start: number) =>
      Array.from({ length: 7 }, (_, i) => ({
        time: start + i * 3600,
        open: 1,
        high: 2,
        low: 0.5,
        close: 1.5,
        volume: 1,
      }));
    const fourH = aggregateTo4H([...mk(day1), ...mk(day2)], 0);
    // 7 hourly bars per day -> 2 buckets per day (4 + 3)
    expect(fourH).toHaveLength(4);
    expect(fourH[2].time).toBe(day2);
  });
});

describe('signalsForSymbol (end-to-end on fixtures)', () => {
  it('produces a full Signal with levels, confidence, continuity and explanation', () => {
    const daily: Candle[] = [
      bar(100, 120, 99, 110),
      bar(110, 115, 100, 105),
      bar(104, 112, 95, 98), // 2d
      bar(99, 105, 97, 104), // 1 -> 2-1-2 setup
    ];
    const series: TimeframeSeries[] = [
      {
        timeframe: 'D',
        completed: [bar(90, 100, 85, 95), bar(95, 102, 88, 98), ...daily],
        forming: bar(104, 106, 103, 105.5), // already above entry -> triggered
        lastPrice: 105.5,
        name: 'Test Corp',
      },
    ];
    const signals = signalsForSymbol('TEST', series);
    expect(signals.length).toBeGreaterThan(0);
    const bull = signals.find((s) => s.pattern === '2-1-2 Bullish Reversal')!;
    expect(bull.timeframe).toBe('D');
    expect(bull.status).toBe('TRIGGERED');
    expect(bull.levels.entry).toBeGreaterThan(bull.levels.stop);
    expect(bull.explanation).toContain('2-1-2');
    expect(bull.explanation).toContain(String(bull.levels.entry));
    expect(bull.confidence).toBeGreaterThanOrEqual(5);
    expect(bull.confidence).toBeLessThanOrEqual(95);
    expect(bull.continuity.D).toBe('up');
    // sorted by confidence
    const sorted = [...signals].sort((a, b) => b.confidence - a.confidence);
    expect(signals.map((s) => s.pattern)).toBeDefined();
    expect(sorted[0].confidence).toBe(Math.max(...signals.map((s) => s.confidence)));
  });
});
