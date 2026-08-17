import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RESOLVE_OPTIONS,
  ResolveOptions,
  resolvePlan,
  resolveRange,
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

describe('resolvePlan — exit policies', () => {
  const opts = (exit: ResolveOptions['exit']): ResolveOptions => ({
    ...DEFAULT_RESOLVE_OPTIONS,
    exit,
  });

  // Runs to target 1 (121) on day 1, drifts, then reaches target 2 (143).
  const runner = bars([
    [105, 125, 104, 124],
    [124, 130, 122, 129],
    [129, 150, 128, 148],
  ]);

  it('target1 banks 1R and leaves the rest', () => {
    const r = resolvePlan(plan(), runner, opts({ kind: 'target1' }), LATER);
    expect(r.status).toBe('TARGET1');
    expect(r.r).toBe(1);
    expect(r.reachedTarget2).toBe(true);
  });

  it('target2 holds through target 1 for the bigger objective', () => {
    const r = resolvePlan(plan(), runner, opts({ kind: 'target2' }), LATER);
    expect(r.status).toBe('TARGET1'); // reached its objective
    expect(r.exit).toBe(143);
    expect(r.r).toBe(3);
  });

  it('target2 gives the whole thing back when price reverses first', () => {
    const reversal = bars([
      [105, 125, 104, 124], // through target 1, but target 2 policy holds
      [124, 126, 90, 92], // straight back through the stop
    ]);
    const t1 = resolvePlan(plan(), reversal, opts({ kind: 'target1' }), LATER);
    const t2 = resolvePlan(plan(), reversal, opts({ kind: 'target2' }), LATER);
    expect(t1.r).toBe(1);
    expect(t2.status).toBe('STOPPED');
    expect(t2.r).toBe(-1);
  });

  it('rMultiple exits at a fixed multiple of risk, ignoring the pivots', () => {
    // Risk is 11 (110 entry, 99 stop), so 2R is 132 — past target 1 at 121.
    const r = resolvePlan(plan(), runner, opts({ kind: 'rMultiple', r: 2 }), LATER);
    expect(r.exit).toBe(132);
    expect(r.r).toBe(2);
  });

  it('scale banks half at target 1 and runs the rest to target 2', () => {
    const r = resolvePlan(
      plan(),
      runner,
      opts({ kind: 'scale', fraction: 0.5, breakeven: true }),
      LATER,
    );
    // Half at +1R, half at +3R.
    expect(r.status).toBe('TARGET1');
    expect(r.r).toBeCloseTo(0.5 * 1 + 0.5 * 3, 3);
  });

  it('scale still counts as a win when the runner is stopped out after banking', () => {
    const fade = bars([
      [105, 125, 104, 124], // target 1 — half off, stop to breakeven
      [124, 126, 105, 108], // back through the 110 fill
    ]);
    const r = resolvePlan(
      plan(),
      fade,
      opts({ kind: 'scale', fraction: 0.5, breakeven: true }),
      LATER,
    );
    expect(r.status).toBe('TARGET1');
    // Half at +1R, half out at breakeven.
    expect(r.r).toBeCloseTo(0.5, 3);
  });

  it('trail rides a move and exits at the trailing stop, not the original one', () => {
    const trend = bars([
      [105, 115, 104, 114],
      [114, 125, 113, 124],
      [124, 135, 123, 134],
      [134, 136, 108, 112], // takes out the trail behind the last two bars
    ]);
    const r = resolvePlan(plan(), trend, opts({ kind: 'trail', barsBack: 2 }), LATER);
    expect(r.status).toBe('TRAILED');
    // Trail sat at 113 (lowest low of the prior two bars), well above the 99
    // original stop, so the trade came off profitable.
    expect(r.exit).toBe(113);
    expect(r.r).toBeGreaterThan(0);
  });

  it('a trailing stop never sets itself from the bar it is tested against', () => {
    // One bar that runs up then collapses. A trail computed from this bar's own
    // low would exit at that low; it must still be on the original stop.
    const spike = bars([[105, 140, 98, 99]]);
    const r = resolvePlan(plan(), spike, opts({ kind: 'trail', barsBack: 1 }), LATER);
    expect(r.status).toBe('STOPPED');
    expect(r.r).toBe(-1);
  });

  it('measures R from the original stop even after the stop moves', () => {
    // Breakeven scaling must not shrink the risk denominator to flatter itself.
    const r = resolvePlan(
      plan(),
      runner,
      opts({ kind: 'scale', fraction: 0.5, breakeven: true }),
      LATER,
    );
    expect(r.fill).toBe(110);
    // 1R is still 11 points, so the target-2 leg is exactly 3R.
    expect(r.r).toBeCloseTo(2, 3);
  });

  it('leaves every policy EXPIRED when the trigger was never taken', () => {
    const quiet = bars([[100, 108, 96, 104]]);
    for (const exit of [
      { kind: 'target1' } as const,
      { kind: 'target2' } as const,
      { kind: 'trail', barsBack: 3 } as const,
      { kind: 'scale', fraction: 0.5, breakeven: false } as const,
    ]) {
      expect(resolvePlan(plan(), quiet, opts(exit), LATER).status).toBe('EXPIRED');
    }
  });
});

describe('resolveRange', () => {
  it('matches resolvePlan when given the same bars as an index range', () => {
    const rows = bars([
      [105, 112, 105, 111],
      [111, 125, 110, 124],
    ]);
    const viaPlan = resolvePlan(plan(), rows, DEFAULT_RESOLVE_OPTIONS, LATER);
    const viaRange = resolveRange(plan(), rows, 0, rows.length, DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(viaRange).toEqual(viaPlan);
  });

  it('honours the upper bound, so a sweep can cap how far it looks', () => {
    const rows = bars([
      [105, 112, 105, 111],
      [111, 125, 110, 124], // would pay target 1, but is out of range
    ]);
    const clipped = resolveRange(plan(), rows, 0, 1, DEFAULT_RESOLVE_OPTIONS, LATER);
    expect(clipped.status).not.toBe('TARGET1');
  });
});
