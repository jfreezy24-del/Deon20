import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RESOLVE_OPTIONS,
  resolvePlan,
  TradePlan,
  triggerBarEndFrom,
} from '../strat/outcomes';
import { Candle } from '../strat/types';

const DAY = 86400;
const T0 = 1_700_000_000;

/** Daily resolution bars starting the day the "?" bar opened. */
const bars = (rows: [number, number, number, number][]): Candle[] =>
  rows.map(([open, high, low, close], i) => ({
    time: T0 + i * DAY,
    open,
    high,
    low,
    close,
    volume: 1000,
  }));

/** Bullish daily plan: entry 110, stop 99, T1 121 (1R), T2 143 (3R). */
const plan = (over: Partial<TradePlan> = {}): TradePlan => ({
  direction: 'bullish',
  timeframe: 'D',
  levels: { entry: 110, stop: 99, target1: 121, target2: 143, rr1: 1, rr2: 3 },
  setupBarTime: T0 - DAY,
  triggerBarEnd: T0,
  ...over,
});

// Far past every deadline, so nothing resolves as PENDING/OPEN by accident.
const LATER = T0 + 400 * DAY;

describe('resolvePlan — the entry window', () => {
  it('expires a plan whose "?" bar never took the trigger', () => {
    const r = resolvePlan(plan(), bars([[100, 108, 96, 104]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('EXPIRED');
    expect(r.r).toBeUndefined();
  });

  it('is PENDING, not EXPIRED, while the "?" bar is still to come', () => {
    const r = resolvePlan(plan(), [], DEFAULT_RESOLVE_OPTIONS, T0 + 3600);
    expect(r.status).toBe('PENDING');
  });

  it('ignores a trigger taken after the window closed', () => {
    // Day 1 does nothing; day 2 would have triggered but is out of window.
    const r = resolvePlan(
      plan(),
      bars([
        [100, 108, 96, 104],
        [104, 130, 103, 128],
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('EXPIRED');
  });

  it('honours a widened entry window', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [100, 108, 96, 104],
        [104, 130, 103, 128],
      ]),
      { ...DEFAULT_RESOLVE_OPTIONS, entryWindowBars: 2 },
      LATER,
    );
    expect(r.status).toBe('TARGET1');
  });

  it('only counts bars from the "?" bar onward', () => {
    // A bar belonging to the trigger bar itself (before triggerBarEnd) trades
    // clean through entry and target and must be ignored entirely.
    const early: Candle = { time: T0 - DAY, open: 100, high: 200, low: 99, close: 190, volume: 1 };
    const r = resolvePlan(
      plan(),
      [early, ...bars([[100, 108, 96, 104]])],
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('EXPIRED');
  });
});

describe('resolvePlan — outcomes', () => {
  it('records a target-1 win at the promised R', () => {
    const r = resolvePlan(plan(), bars([[105, 125, 104, 124]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('TARGET1');
    expect(r.fill).toBe(110);
    expect(r.exit).toBe(121);
    expect(r.r).toBe(1);
    expect(r.barsHeld).toBe(1);
  });

  it('records a stop-out at -1R', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [105, 112, 105, 111],
        [111, 112, 90, 92],
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('STOPPED');
    expect(r.r).toBe(-1);
    expect(r.barsHeld).toBe(2);
  });

  it('assumes the stop when one bar contains both stop and target', () => {
    const r = resolvePlan(plan(), bars([[105, 125, 95, 100]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('STOPPED');
    expect(r.ambiguousBar).toBe(true);
    expect(r.r).toBe(-1);
  });

  it('flags extended magnitude without paying for it', () => {
    const r = resolvePlan(plan(), bars([[105, 150, 104, 148]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('TARGET1');
    expect(r.reachedTarget2).toBe(true);
    // Exit is still target 1 — the policy closes there.
    expect(r.r).toBe(1);
  });

  it('marks a stalled trade to market after the hold window', () => {
    // Triggers on day 1 then drifts sideways well past maxHoldBars.
    const rows: [number, number, number, number][] = [[105, 112, 104, 111]];
    for (let i = 0; i < 10; i++) rows.push([111, 113, 108, 112]);
    const r = resolvePlan(plan(), bars(rows), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('TIMEOUT');
    expect(r.barsHeld).toBe(DEFAULT_RESOLVE_OPTIONS.maxHoldBars);
    // Marked out around the drift price: a small win, nothing like +1R.
    expect(r.r).toBeGreaterThan(0);
    expect(r.r).toBeLessThan(0.5);
  });

  it('stays OPEN while the trade is live and the window has not elapsed', () => {
    const r = resolvePlan(plan(), bars([[105, 112, 104, 111]]), DEFAULT_RESOLVE_OPTIONS, T0 + DAY);
    expect(r.status).toBe('OPEN');
    expect(r.triggeredAt).toBe(T0);
    expect(r.r).toBeUndefined();
  });
});

describe('resolvePlan — gaps are filled honestly', () => {
  it('fills a gapped entry at the open and widens the risk', () => {
    // Opens at 116, six points above the 110 trigger: real risk is 17, not 11.
    const r = resolvePlan(plan(), bars([[116, 125, 115, 124]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.gappedEntry).toBe(true);
    expect(r.fill).toBe(116);
    // Target 1 at 121 is now only 5 points away against 17 of risk.
    expect(r.r).toBeCloseTo(5 / 17, 3);
  });

  it('fills a gapped stop at the open, so the loss is worse than -1R', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [105, 112, 105, 111],
        [90, 92, 88, 89],
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('STOPPED');
    expect(r.exit).toBe(90);
    expect(r.r).toBeLessThan(-1);
  });
});

describe('resolvePlan — bearish plans mirror', () => {
  const short = plan({
    direction: 'bearish',
    levels: { entry: 90, stop: 101, target1: 79, target2: 57, rr1: 1, rr2: 3 },
  });

  it('pays target 1 on a break lower', () => {
    const r = resolvePlan(short, bars([[95, 96, 75, 78]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('TARGET1');
    expect(r.r).toBe(1);
  });

  it('stops out on a break higher', () => {
    const r = resolvePlan(short, bars([[95, 105, 88, 104]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.status).toBe('STOPPED');
    expect(r.r).toBe(-1);
  });
});

describe('resolvePlan — excursions', () => {
  it('tracks the best and worst points of an eventual loser', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [105, 118, 106, 117], // +0.73R at best
        [117, 118, 90, 91], // stopped
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('STOPPED');
    expect(r.mfeR).toBeCloseTo(8 / 11, 2);
    expect(r.maeR).toBeGreaterThanOrEqual(1);
  });
});

describe('triggerBarEndFrom', () => {
  const c = (time: number): Candle => ({ time, open: 1, high: 2, low: 0, close: 1, volume: 0 });

  it('uses the forming bar open — the exact moment the trigger bar closed', () => {
    expect(triggerBarEndFrom([c(T0)], c(T0 + DAY), 'D')).toBe(T0 + DAY);
  });

  it('falls back to the nominal span when no bar is forming', () => {
    expect(triggerBarEndFrom([c(T0)], null, 'D')).toBe(T0 + DAY);
  });
});

describe('resolvePlan — extended magnitude is observed, never paid', () => {
  it('sees a runner reach target 2 on a later bar', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [105, 125, 104, 124], // triggers and pays target 1 at 121
        [124, 150, 123, 148], // would have run on to target 2 at 143
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('TARGET1');
    expect(r.reachedTarget2).toBe(true);
    // Observation only: R is still the target-1 exit.
    expect(r.r).toBe(1);
  });

  it('does not credit a runner that rolls back through the stop first', () => {
    const r = resolvePlan(
      plan(),
      bars([
        [105, 125, 104, 124], // target 1
        [124, 126, 95, 96], // back through the 99 stop
        [96, 150, 95, 148], // only then to target 2 — too late
      ]),
      DEFAULT_RESOLVE_OPTIONS,
      LATER,
    );
    expect(r.status).toBe('TARGET1');
    expect(r.reachedTarget2).toBe(false);
  });

  it('stops observing at the hold deadline', () => {
    const rows: [number, number, number, number][] = [[105, 125, 104, 124]];
    for (let i = 0; i < 10; i++) rows.push([124, 126, 122, 125]);
    rows.push([125, 200, 124, 199]); // target 2, but long past the window
    const r = resolvePlan(plan(), bars(rows), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.reachedTarget2).toBe(false);
  });

  it('still catches target 2 reached on the target-1 bar itself', () => {
    const r = resolvePlan(plan(), bars([[105, 150, 104, 148]]), DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(r.reachedTarget2).toBe(true);
    expect(r.r).toBe(1);
  });
});
