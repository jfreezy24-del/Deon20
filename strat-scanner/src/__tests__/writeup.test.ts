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

/** Real SOL weeks: a flat base, then two weeks that nearly double it. */
const rallyWeeks = [
  bar(0, 76.77, 77.5, 70.58, 73.63),
  bar(1, 73.64, 77.84, 71.98, 76.27),
  bar(2, 76.26, 77.33, 74.1, 74.61),
  bar(3, 74.62, 102.74, 74.43, 95.43),
  bar(4, 95.44, 110.6, 93.26, 101.75),
];

/** The months behind that rally: July closed at $72, high $83.98. */
const staleMonths = [
  bar(0, 82.45, 83.1, 60.13, 73.67),
  bar(1, 83.19, 90.73, 76.7, 83.09),
  bar(2, 84.35, 97.68, 78.96, 83.2),
  bar(3, 73.67, 83.98, 72.25, 72.87),
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

  it('measures targets beyond the decision level', () => {
    // Where price travels *after* a break — anything between spot and the
    // trigger is on the way there, not a destination.
    const s = buildStructure(insideLast, insideLast, 150);
    const { triggerUp, triggerDown } = s.weekly;
    expect(s.targetsUp.every((t) => t > triggerUp!)).toBe(true);
    expect(s.targetsDown.every((t) => t < triggerDown!)).toBe(true);
    expect(s.targetsUp).toEqual([...s.targetsUp].sort((a, b) => a - b));
    expect(s.targetsDown).toEqual([...s.targetsDown].sort((a, b) => b - a));
  });

  it('never names a target price has already traded through', () => {
    // A fast rally leaves last month's high far below spot. Anchoring the
    // filter to the monthly bar alone reported levels *beneath* the market as
    // places price was headed: spot $101, "targets" at $90 and $97.
    const s = buildStructure(rallyWeeks, staleMonths, 101.75);
    expect(s.targetsUp.every((t) => t > 101.75)).toBe(true);
    expect(s.targetsDown.every((t) => t < 101.75)).toBe(true);
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
  const SEEDS = Array.from({ length: 40 }, (_, i) => `COIN${i}-USD:2026-08-${(i % 28) + 1}`);

  it('never uses Strat notation a regular reader would not know', () => {
    const text = SEEDS.map((seed) => all(buildWriteup(input({ seed })))).join(' ');
    // The framework's vocabulary stays out of the prose entirely.
    expect(text).not.toMatch(/\b2u\b|\b2d\b|\binside bar\b|\boutside bar\b/i);
    expect(text).not.toMatch(/FTFC|continuity|magnitude|broadening|actionable|invalidat/i);
    expect(text).not.toMatch(/\bpivot\b/i);
  });

  it('punctuates with commas, never dashes', () => {
    const cases = [
      input(),
      input({ structure: buildStructure(lowerLows, lowerLows, 120), lastPrice: 120 }),
      input({ continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' } }),
      input({ continuity: { '4H': 'down', D: 'down', W: 'down', M: 'down' } }),
      input({ dca: plan({ stance: 'defensive' }) }),
      input({ dca: plan({ stance: 'accumulate' }) }),
    ];
    for (const c of cases) {
      for (const seed of SEEDS) {
        // Em and en dashes only. Hyphens inside words ("4-hour") are untouched.
        expect(all(buildWriteup({ ...c, seed }))).not.toMatch(/[—–]/);
      }
    }
  });

  it('reads differently for different coins in the same state', () => {
    // Four coins in one report used to produce four identical paragraphs.
    const texts = ['SOL-USD', 'BTC-USD', 'ETH-USD', 'HYPE-USD'].map((symbol, i) =>
      // The real seed format: week and position, no symbol.
      all(buildWriteup(input({ symbol, seed: `2026-08-17#${i}` }))),
    );
    expect(new Set(texts).size).toBe(texts.length);
  });

  it('separates consecutive coins section by section, not just overall', () => {
    // Hashing alone let coins collide on a section by chance; the position
    // offset makes consecutive coins take different variants by construction.
    // Four alternates per phrase means a four-coin report cannot repeat.
    const seeds = [0, 1, 2, 3].map((i) => `2026-08-17#${i}`);
    const section = (pickSection: (w: ReturnType<typeof buildWriteup>) => string) =>
      new Set(seeds.map((seed) => pickSection(buildWriteup(input({ seed }))))).size;

    expect(section((w) => w.standing)).toBe(4);
    expect(section((w) => w.higher)).toBe(4);
    expect(section((w) => w.lower)).toBe(4);
    expect(section((w) => w.picture)).toBe(4);
    expect(section((w) => w.approach)).toBe(4);
    expect(section((w) => w.watch)).toBe(4);
  });

  it('is stable for the same coin and week, so a rerun reads the same', () => {
    const once = all(buildWriteup(input({ seed: '2026-08-17#0' })));
    const twice = all(buildWriteup(input({ seed: '2026-08-17#0' })));
    expect(once).toBe(twice);
  });

  it('refreshes the wording next week', () => {
    const thisWeek = all(buildWriteup(input({ seed: '2026-08-17#0' })));
    const nextWeek = all(buildWriteup(input({ seed: '2026-08-24#0' })));
    expect(thisWeek).not.toBe(nextWeek);
  });

  it('still carries the principles, in plain words', () => {
    const text = all(buildWriteup(input()));
    expect(text).toMatch(/inside the month before it|within the prior month's range|never left the previous one's range|boxed inside the prior range/i);
    expect(text).toMatch(/tighter the range|ranges like this coil|a tight range means|quiet stretches like this end in a move/i);
    expect(text).toMatch(/trapped|underwater|offside/i);
  });

  it('names both decision levels and where each one travels', () => {
    const w = buildWriteup(input());
    expect(w.higher).toContain('$210');
    expect(w.lower).toContain('$190');
    expect(w.watch).toContain('$210');
  });

  it('leads with last week, not last month', () => {
    // The monthly bar does not change until the month does, so quoting it as
    // the headline repeated the same two numbers across every weekly report
    // in a calendar month while price ran away from both.
    const w = buildWriteup(
      input({
        lastPrice: 101.75,
        structure: buildStructure(rallyWeeks, staleMonths, 101.75),
      }),
    );
    expect(w.higher).toContain('$110.60'); // last week's high
    expect(w.lower).toContain('$93.26'); // last week's low
    expect(w.higher).not.toContain('$83.98'); // last month's high
    expect(w.lower).not.toContain('$72.25'); // last month's low
  });

  it('moves its levels as soon as a new week closes', () => {
    // The reported symptom: consecutive weekly reports quoting identical
    // support and resistance while the week in between had a 28% range.
    const lastWeek = buildWriteup(
      input({ lastPrice: 95.43, structure: buildStructure(rallyWeeks.slice(0, 4), staleMonths, 95.43) }),
    );
    const thisWeek = buildWriteup(
      input({ lastPrice: 101.75, structure: buildStructure(rallyWeeks, staleMonths, 101.75) }),
    );
    expect(thisWeek.higher).not.toBe(lastWeek.higher);
    expect(thisWeek.lower).not.toBe(lastWeek.lower);
  });

  it('describes a long decline as a run, not a single week', () => {
    const w = buildWriteup(
      input({ structure: buildStructure(lowerLows, lowerLows, 120), lastPrice: 120 }),
    );
    expect(w.standing).toMatch(/lower lows|lower low \d+ (weeks|months) running/);
    expect(w.standing).toMatch(/weakest thing a chart can do|cannot look much weaker|no sign of buyers|prices to watch, not prices to buy/);
  });

  it('calls out a failed drop when price recovered the same week', () => {
    const s = buildStructure(lowerLows, insideLast, 130);
    const w = buildWriteup(input({ structure: s, weekChangePct: 4.2, lastPrice: 130 }));
    expect(w.standing).toMatch(/did not hold|already been reclaimed|came straight back/i);
  });

  it('reads full agreement and full disagreement differently', () => {
    const up = buildWriteup(input({ continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' } }));
    expect(up.picture).toMatch(/all trading above where they opened|every timeframe agrees|all four clocks are pointing up/i);

    const down = buildWriteup(
      input({ continuity: { '4H': 'down', D: 'down', W: 'down', M: 'down' } }),
    );
    expect(down.picture).toMatch(/fighting every clock|every timeframe is red|all four clocks point down|not one timeframe is offering support/i);

    expect(buildWriteup(input()).picture).toMatch(/Mixed|clocks disagree|half the picture/i);
  });

  it('explains the ladder shape from the stance', () => {
    expect(buildWriteup(input({ dca: plan({ stance: 'defensive' }) })).approach).toMatch(
      /being early into a fall this clean is expensive|buying it twice|rarely stop where you first want|better price behind this one/,
    );
    expect(buildWriteup(input({ dca: plan({ stance: 'accumulate' }) })).approach).toMatch(
      /whole ladder is live|every rung is worth funding/,
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
    expect(w.higher).toMatch(/never traded before|never been tested|no history above this price|Above here is unmapped/i);
  });
});
