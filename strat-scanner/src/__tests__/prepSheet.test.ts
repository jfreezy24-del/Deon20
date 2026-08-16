import { describe, expect, it } from 'vitest';
import {
  buildPrepSheet,
  calendarNotes,
  distanceToTrigger,
  firstTradingDayOfMonth,
  lastTradingDayOfMonth,
  prepDigest,
  renderPrepSheet,
} from '../strat/prepSheet';
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
  factors: [],
  explanation: 'x',
  levels: { entry: 101, stop: 99, target1: 104, target2: 106, rr1: 1.5, rr2: 2.5 },
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'down' },
  setupBarTime: 1_700_000_000,
  triggerBarEnd: 1_700_086_400,
  ...over,
});

const meta = { symbolsScanned: 10, symbolErrors: 0 };

describe('distanceToTrigger', () => {
  it('measures how far a long still has to travel up', () => {
    expect(distanceToTrigger(100, 102, 'bullish')).toBeCloseTo(2, 5);
  });

  it('measures how far a short still has to travel down', () => {
    expect(distanceToTrigger(100, 98, 'bearish')).toBeCloseTo(2, 5);
  });

  it('goes negative once price is already through the trigger', () => {
    expect(distanceToTrigger(105, 102, 'bullish')).toBeLessThan(0);
    expect(distanceToTrigger(95, 98, 'bearish')).toBeLessThan(0);
  });

  it('does not divide by a missing price', () => {
    expect(distanceToTrigger(0, 102, 'bullish')).toBe(0);
  });
});

describe('trading-day calendar', () => {
  it('finds the first weekday of a month that opens on a weekend', () => {
    // 2026-08-01 is a Saturday, so the first trading day is Monday the 3rd.
    expect(firstTradingDayOfMonth(new Date('2026-08-16T00:00:00Z'))).toBe(3);
    // 2026-06-01 is a Monday.
    expect(firstTradingDayOfMonth(new Date('2026-06-15T00:00:00Z'))).toBe(1);
  });

  it('finds the last weekday of a month that ends on a weekend', () => {
    // 2026-08-31 is a Monday.
    expect(lastTradingDayOfMonth(new Date('2026-08-16T00:00:00Z'))).toBe(31);
    // 2026-05-31 is a Sunday, so the last trading day is Friday the 29th.
    expect(lastTradingDayOfMonth(new Date('2026-05-15T00:00:00Z'))).toBe(29);
  });
});

describe('calendarNotes', () => {
  it('flags a new weekly candle on Monday', () => {
    const notes = calendarNotes(new Date('2026-08-17T08:00:00Z')); // Monday
    expect(notes.join(' ')).toContain('New weekly candle opens today');
  });

  it('flags the weekly close on Friday', () => {
    const notes = calendarNotes(new Date('2026-08-21T08:00:00Z')); // Friday
    expect(notes.join(' ')).toContain('Weekly candle closes');
  });

  it('counts the day of the week mid-week instead', () => {
    const notes = calendarNotes(new Date('2026-08-19T08:00:00Z')); // Wednesday
    expect(notes.join(' ')).toContain('Day 3 of 5');
    expect(notes.join(' ')).not.toContain('New weekly candle');
  });

  it('flags a new monthly candle on the first trading day', () => {
    // 2026-09-01 is a Tuesday and the first trading day of September.
    const notes = calendarNotes(new Date('2026-09-01T08:00:00Z'));
    expect(notes.join(' ')).toContain('New monthly candle opens today');
  });

  it('flags the monthly close on the last trading day', () => {
    // 2026-08-31 is a Monday — both a new week and the monthly close.
    const notes = calendarNotes(new Date('2026-08-31T08:00:00Z'));
    const text = notes.join(' ');
    expect(text).toContain('Monthly candle closes');
    expect(text).toContain('New weekly candle opens today');
  });

  it('says so at the weekend', () => {
    const notes = calendarNotes(new Date('2026-08-15T08:00:00Z')); // Saturday
    expect(notes.join(' ')).toContain('Weekend');
  });
});

describe('buildPrepSheet', () => {
  it('ranks daily setups by how close the trigger is', () => {
    const sheet = buildPrepSheet(
      [
        sig({ symbol: 'FAR', levels: { entry: 103, stop: 99, target1: 108, target2: 110, rr1: 1.2, rr2: 2 } }),
        sig({ symbol: 'NEAR', levels: { entry: 100.2, stop: 99, target1: 104, target2: 106, rr1: 3, rr2: 5 } }),
      ],
      meta,
    );
    expect(sheet.inPlay.map((r) => r.symbol)).toEqual(['NEAR', 'FAR']);
  });

  it('drops daily triggers a session could not reach', () => {
    const sheet = buildPrepSheet(
      [sig({ symbol: 'MILES', levels: { entry: 140, stop: 99, target1: 200, target2: 220, rr1: 1, rr2: 2 } })],
      meta,
    );
    expect(sheet.inPlay).toHaveLength(0);
  });

  it('applies the confidence floor', () => {
    const sheet = buildPrepSheet([sig({ confidence: 10 })], meta);
    expect(sheet.inPlay).toHaveLength(0);
  });

  it('puts higher-timeframe compression at the top of its section', () => {
    const sheet = buildPrepSheet(
      [
        sig({ symbol: 'A', timeframe: 'W', compression: false, confidence: 90 }),
        sig({ symbol: 'B', timeframe: 'M', compression: true, confidence: 50 }),
      ],
      meta,
    );
    // Compression outranks a higher raw confidence.
    expect(sheet.higherTimeframe[0].symbol).toBe('B');
  });

  it('separates daily from higher-timeframe rows', () => {
    const sheet = buildPrepSheet(
      [sig({ timeframe: 'D' }), sig({ timeframe: 'W' }), sig({ timeframe: 'M' })],
      meta,
    );
    expect(sheet.inPlay).toHaveLength(1);
    expect(sheet.higherTimeframe).toHaveLength(2);
  });

  it('lists symbols in full continuity on each side', () => {
    const sheet = buildPrepSheet(
      [
        sig({ symbol: 'UP', continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' } }),
        sig({ symbol: 'DOWN', continuity: { '4H': 'down', D: 'down', W: 'down', M: 'down' } }),
        sig({ symbol: 'MIXED', continuity: { '4H': 'up', D: 'down', W: 'up', M: 'down' } }),
      ],
      meta,
    );
    expect(sheet.fullContinuityUp).toEqual(['UP']);
    expect(sheet.fullContinuityDown).toEqual(['DOWN']);
  });

  it('does not call two aligned timeframes full continuity', () => {
    const sheet = buildPrepSheet([sig({ symbol: 'THIN', continuity: { D: 'up', W: 'up' } })], meta);
    expect(sheet.fullContinuityUp).toEqual([]);
  });

  it('surfaces daily-against-weekly conflicts', () => {
    const sheet = buildPrepSheet(
      [sig({ symbol: 'FIGHT', continuity: { D: 'up', W: 'down', M: 'down' } })],
      meta,
    );
    expect(sheet.conflicts).toHaveLength(1);
    expect(sheet.conflicts[0].symbol).toBe('FIGHT');
  });

  it('does not call a flat timeframe a conflict', () => {
    const sheet = buildPrepSheet(
      [sig({ symbol: 'FLAT', continuity: { D: 'up', W: 'flat' } })],
      meta,
    );
    expect(sheet.conflicts).toHaveLength(0);
  });
});

describe('renderPrepSheet', () => {
  it('renders every section', () => {
    const sheet = buildPrepSheet([sig(), sig({ timeframe: 'W' })], meta);
    const md = renderPrepSheet(sheet);
    expect(md).toContain('# Prep sheet —');
    expect(md).toContain('## Higher-timeframe structure');
    expect(md).toContain('## In play today (daily)');
    expect(md).toContain('## Timeframe continuity');
  });

  it('says plainly when nothing is in reach rather than padding', () => {
    const sheet = buildPrepSheet([], { symbolsScanned: 10, symbolErrors: 0 });
    const md = renderPrepSheet(sheet);
    expect(md).toContain('A quiet day is a real answer');
    expect(md).toContain('Nothing actionable on weekly or monthly structure');
  });

  it('reports failed symbols instead of hiding them', () => {
    const sheet = buildPrepSheet([sig()], { symbolsScanned: 10, symbolErrors: 3 });
    expect(renderPrepSheet(sheet)).toContain('3 failed');
  });
});

describe('prepDigest', () => {
  it('stays short enough for a lock screen', () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      sig({ symbol: `S${i}`, levels: { entry: 100.5, stop: 99, target1: 104, target2: 106, rr1: 2, rr2: 4 } }),
    );
    const digest = prepDigest(buildPrepSheet(many, meta));
    expect(digest.split('\n').length).toBeLessThanOrEqual(10);
    expect(digest.length).toBeLessThan(600);
  });

  it('leads with the notable calendar events and drops the mundane ones', () => {
    const monday = buildPrepSheet([sig()], { ...meta, now: new Date('2026-08-17T08:00:00Z') });
    expect(prepDigest(monday)).toContain('New weekly candle opens today');

    const wednesday = buildPrepSheet([sig()], { ...meta, now: new Date('2026-08-19T08:00:00Z') });
    expect(prepDigest(wednesday)).not.toContain('Day 3 of 5');
  });

  it('says when nothing is in reach', () => {
    const sheet = buildPrepSheet([], { symbolsScanned: 5, symbolErrors: 0 });
    expect(prepDigest(sheet)).toContain('No daily trigger within reach');
  });

  it('names higher-timeframe compressions', () => {
    const sheet = buildPrepSheet([sig({ symbol: 'BTC-USD', timeframe: 'W', compression: true })], meta);
    expect(prepDigest(sheet)).toContain('HTF compression: BTC-USD W');
  });
});
