import { describe, expect, it } from 'vitest';
import { buildStructure } from '../crypto/structure';
import { buildWriteup, WriteupInput } from '../crypto/writeup';
import { DcaPlan } from '../strat/dca';
import { Candle } from '../strat/types';

const bar = (i: number, open: number, high: number, low: number, close: number): Candle => ({
  time: 1_700_000_000 + i * 604800,
  open,
  high,
  low,
  close,
  volume: 1000,
});

/** Bars that step up, then one that stays fully inside the one before it. */
const insideLast = [
  bar(0, 100, 120, 90, 115),
  bar(1, 115, 140, 110, 135),
  bar(2, 135, 170, 130, 165),
  bar(3, 165, 200, 160, 195),
  bar(4, 195, 214, 186, 205),
  bar(5, 205, 210, 190, 200), // inside the bar before it
];

const lowerLows = [
  bar(0, 200, 210, 190, 195),
  bar(1, 195, 200, 175, 180),
  bar(2, 180, 185, 160, 165),
  bar(3, 165, 170, 145, 150),
  bar(4, 150, 155, 130, 135),
  bar(5, 135, 140, 115, 120),
];

const plan = (over: Partial<DcaPlan> = {}): DcaPlan => ({
  symbol: 'SOL-USD',
  lastPrice: 196,
  stance: 'neutral',
  stanceReason: '',
  weeklyType: '2u',
  monthlyType: '1',
  weeklyTrend: 'up',
  monthlyTrend: 'flat',
  rungs: [
    { price: 186, discountPct: 5.3, allocationPct: 100, source: 'Prior week low', timeframe: 'W', rationale: '' },
  ],
  averageFill: 186,
  ...over,
});

const input = (over: Partial<WriteupInput> = {}): WriteupInput => ({
  symbol: 'SOL-USD',
  name: 'Solana',
  lastPrice: 196,
  weekChangePct: 5.5,
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'down' },
  structure: buildStructure(insideLast, insideLast, 196),
  dca: plan(),
  ...over,
});

const all = (w: ReturnType<typeof buildWriteup>): string =>
  [w.standing, w.higher, w.lower, w.picture, w.approach, w.watch].join(' ');

describe('buildStructure', () => {
  it('reads the last completed bar as the decision levels', () => {
    const s = buildStructure(insideLast, insideLast, 196);
    expect(s.weekly.type).toBe('1'); // last bar sits inside the one before
    expect(s.weekly.triggerUp).toBe(210);
    expect(s.weekly.triggerDown).toBe(190);
  });

  it('counts a run of consecutive lower lows', () => {
    const s = buildStructure(lowerLows, lowerLows, 120);
    expect(s.weekly.type).toBe('2d');
    expect(s.weekly.run).toBeGreaterThanOrEqual(3);
  });

  it('measures targets beyond the decision level, not beyond spot', () => {
    // Where price travels *after* a break — anything between spot and the
    // trigger is on the way there, not a destination.
    const s = buildStructure(insideLast, insideLast, 150);
    const { triggerUp, triggerDown } = s.monthly;
    expect(s.targetsUp.every((t) => t > triggerUp!)).toBe(true);
    expect(s.targetsDown.every((t) => t < triggerDown!)).toBe(true);
    expect(s.targetsUp).toEqual([...s.targetsUp].sort((a, b) => a - b));
    expect(s.targetsDown).toEqual([...s.targetsDown].sort((a, b) => b - a));
  });

  it('falls back to traded highs and lows when no swing point is confirmed', () => {
    // A steadily rising series confirms no swing lows, but the market has
    // still traded through real levels — saying "nothing below" would be a lie.
    const rising = insideLast;
    const s = buildStructure(rising, rising, 196);
    expect(s.targetsDown.length).toBeGreaterThan(0);
  });
});

describe('buildWriteup', () => {
  it('never uses Strat notation a regular reader would not know', () => {
    const text = all(buildWriteup(input()));
    // The framework's vocabulary stays out of the prose entirely.
    expect(text).not.toMatch(/\b2u\b|\b2d\b|\binside bar\b|\boutside bar\b/i);
    expect(text).not.toMatch(/FTFC|continuity|magnitude|broadening|actionable|invalidat/i);
    expect(text).not.toMatch(/\bpivot\b/i);
  });

  it('still carries the principles, in plain words', () => {
    const text = all(buildWriteup(input()));
    expect(text).toMatch(/inside the month before it/i);
    expect(text).toMatch(/tighter the range/i);
    expect(text).toMatch(/trapped|underwater|offside/i);
  });

  it('names both decision levels and where each one travels', () => {
    const w = buildWriteup(input());
    expect(w.higher).toContain('$210');
    expect(w.lower).toContain('$190');
    expect(w.watch).toContain('$210');
  });

  it('describes a long decline as a run, not a single week', () => {
    const w = buildWriteup(
      input({ structure: buildStructure(lowerLows, lowerLows, 120), lastPrice: 120 }),
    );
    expect(w.standing).toMatch(/in a row of lower lows/);
    expect(w.standing).toMatch(/weakest thing a chart can do/);
  });

  it('calls out a failed drop when price recovered the same week', () => {
    const s = buildStructure(lowerLows, insideLast, 130);
    const w = buildWriteup(input({ structure: s, weekChangePct: 4.2, lastPrice: 130 }));
    expect(w.standing).toMatch(/did not hold/i);
  });

  it('reads full agreement and full disagreement differently', () => {
    const up = buildWriteup(input({ continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' } }));
    expect(up.picture).toMatch(/all trading above where they opened/);

    const down = buildWriteup(
      input({ continuity: { '4H': 'down', D: 'down', W: 'down', M: 'down' } }),
    );
    expect(down.picture).toMatch(/fighting every clock/);

    expect(buildWriteup(input()).picture).toMatch(/Mixed/);
  });

  it('explains the ladder shape from the stance', () => {
    expect(buildWriteup(input({ dca: plan({ stance: 'defensive' }) })).approach).toMatch(
      /being early into a fall this clean is expensive/,
    );
    expect(buildWriteup(input({ dca: plan({ stance: 'accumulate' }) })).approach).toMatch(
      /whole ladder is live/,
    );
  });

  it('says so plainly when there is nothing above to aim at', () => {
    // Last bar makes the highest high in the series: a market at new highs.
    const newHighs = [...insideLast, bar(6, 205, 230, 200, 225)];
    const w = buildWriteup({
      ...input(),
      lastPrice: 225,
      structure: buildStructure(newHighs, newHighs, 225),
    });
    expect(w.higher).toMatch(/never traded before/);
  });
});
