import { Candle, Direction, Levels, Timeframe } from './types';
import { TF_SECONDS } from '../data/series';

/**
 * Outcome resolution: what actually happened to a plan the engine published.
 *
 * Every signal the scanner emits is a complete, falsifiable statement — entry
 * here, wrong there, first magnitude objective at this price. This module is
 * the other half of that: it walks bars forward from the trigger and decides
 * whether the trigger was ever taken, and if it was, which side paid.
 *
 * The same resolver serves the live tracker (forward record of what the
 * alerters actually sent) and the historical backtest (a calibration sample
 * large enough to argue with), so an edge measured one way is measured the
 * same way the other. Divergence between the two would otherwise be
 * indistinguishable from a bug in one of them.
 *
 * Resolution runs on DAILY bars regardless of the signal's own timeframe. A
 * daily bar that trades through a weekly stop hit that stop; waiting for the
 * weekly bar to close would credit the plan with a week of hindsight it never
 * had.
 */

export type OutcomeStatus =
  /** Entry window still open, trigger not yet taken. */
  | 'PENDING'
  /** The "?" bar came and went without taking the trigger. Never a trade. */
  | 'EXPIRED'
  /** Triggered, still running. */
  | 'OPEN'
  /** First magnitude objective paid. */
  | 'TARGET1'
  /** Invalidated at the other side of the actionable bar. */
  | 'STOPPED'
  /** Triggered, then neither side resolved inside the hold window. */
  | 'TIMEOUT'
  /**
   * Taken out by a trailing stop that had already moved off the plan's
   * original invalidation. Distinct from STOPPED because it is often a
   * profitable exit — only the sweep's policies can produce it.
   */
  | 'TRAILED';

/** Statuses that will never change again. */
export const TERMINAL: OutcomeStatus[] = [
  'EXPIRED',
  'TARGET1',
  'STOPPED',
  'TIMEOUT',
  'TRAILED',
];

export const isTerminal = (s: OutcomeStatus): boolean => TERMINAL.includes(s);

/** A closed outcome that actually became a trade — the only kind with an R. */
export const isTrade = (s: OutcomeStatus): boolean =>
  s === 'TARGET1' || s === 'STOPPED' || s === 'TIMEOUT' || s === 'TRAILED';

export interface TradePlan {
  direction: Direction;
  timeframe: Timeframe;
  levels: Levels;
  /** Open time of the trigger (actionable) bar, unix seconds. */
  setupBarTime: number;
  /**
   * Unix seconds at which the trigger bar closed — equivalently, when the "?"
   * bar opened. Supplied by the caller rather than derived from
   * `setupBarTime + one timeframe`, because months are not 31 days and weeks
   * are not 7 trading days; both callers know the real boundary exactly (the
   * forming bar's open time live, the next bar's open time in a replay).
   */
  triggerBarEnd: number;
}

/**
 * How a triggered plan is taken off.
 *
 * The live record uses `target1` and always will: target 1 is the objective the
 * engine publishes and `rr1` is what the confidence model scores on, so keeping
 * realised R comparable to promised R is the whole point of measuring. The
 * other policies exist so the sweep can ask whether that choice is any good,
 * against the same signals and the same bars.
 *
 *  - `target1`  — close everything at the first magnitude objective.
 *  - `target2`  — ignore target 1 and hold for extended magnitude.
 *  - `rMultiple`— close at a fixed multiple of risk. The control: if a naive
 *                 2R target matches the pivot-based ones, then the magnitude
 *                 logic in `computeLevels` is not adding anything.
 *  - `trail`    — no target; trail the stop behind the last N bars' extreme and
 *                 let the trade run until it is taken out.
 *  - `scale`    — take `fraction` off at target 1 and let the rest run to
 *                 target 2, optionally moving the stop to the fill.
 */
export type ExitPolicy =
  | { kind: 'target1' }
  | { kind: 'target2' }
  | { kind: 'rMultiple'; r: number }
  | { kind: 'trail'; barsBack: number }
  | { kind: 'scale'; fraction: number; breakeven: boolean };

export const DEFAULT_EXIT: ExitPolicy = { kind: 'target1' };

export interface ResolveOptions {
  /**
   * How many bars of the signal's own timeframe the trigger stays actionable.
   *
   * Default 1 — TheStrat's "?" is the very next bar. A 2-1-2 that needs four
   * more sessions to trigger is not that 2-1-2 any more; new structure has
   * printed and a new signal will describe it. Keeping this at 1 is what stops
   * the record from quietly crediting the engine for setups it never called.
   */
  entryWindowBars: number;
  /**
   * Bars of the signal's own timeframe to hold before calling it a timeout.
   * Magnitude is supposed to resolve to the prior pivot; a plan that has done
   * neither after this long is dead money, and marking it to market says so
   * rather than leaving it open forever.
   */
  maxHoldBars: number;
  /** How the position is taken off once it triggers. */
  exit: ExitPolicy;
}

export const DEFAULT_RESOLVE_OPTIONS: ResolveOptions = {
  entryWindowBars: 1,
  maxHoldBars: 6,
  exit: DEFAULT_EXIT,
};

export interface Resolution {
  status: OutcomeStatus;
  /** Bar time the trigger was taken. */
  triggeredAt?: number;
  /** Actual entry price — the plan's entry, or the open on a gap through it. */
  fill?: number;
  /** Bar time the position closed. */
  closedAt?: number;
  /** Price the final portion closed at. */
  exit?: number;
  /**
   * Realised R, risk measured from the actual fill to the plan's ORIGINAL
   * stop. The R unit is fixed at entry and never moves, so a policy that
   * trails or goes to breakeven cannot flatter itself by shrinking the
   * denominator it is measured against.
   */
  r?: number;
  /** Best excursion in R while the trade was open. */
  mfeR?: number;
  /** Worst excursion in R while the trade was open. */
  maeR?: number;
  /** Resolution bars consumed, entry bar included. */
  barsHeld?: number;
  /** Whether extended magnitude (target 2) was reached at any point. */
  reachedTarget2?: boolean;
  /** Price gapped through the entry, so the fill is worse than the plan. */
  gappedEntry?: boolean;
  /**
   * A single bar contained both the stop and the profit objective. OHLC cannot
   * say which came first, so the stop is assumed — see `resolveRange`.
   */
  ambiguousBar?: boolean;
  /** Last resolution bar examined, for the run log. */
  lastBarTime?: number;
}

const round = (v: number) => Number(v.toFixed(4));

/**
 * Resolve `plan` against `bars[from..to)`.
 *
 * The indexed form exists for the policy sweep, which re-resolves the same
 * hundreds of thousands of signals under dozens of policies: slicing or
 * filtering a fresh array per signal per policy costs more than the resolution
 * itself. `resolvePlan` is the friendly wrapper for everything else.
 *
 * `bars[from]` must be the first bar of the "?" period, sorted ascending.
 *
 * Three conventions, all chosen to bias against the engine rather than
 * flatter it:
 *
 *  - **Same-bar stop and objective counts as the stop.** OHLC cannot order two
 *    touches inside one bar. Assuming the target would inflate every edge
 *    number by exactly the cases that are hardest to verify.
 *  - **Gaps fill at the open, not at the level** — on entries and on stops
 *    alike, so a plan that gaps in gets the worse fill and the wider risk it
 *    would really have had.
 *  - **A trailing stop is set from bars that have already closed**, never from
 *    the bar it is then tested against, which would let it dodge inside its
 *    own candle.
 */
export function resolveRange(
  plan: TradePlan,
  bars: Candle[],
  from: number,
  to: number,
  opts: ResolveOptions = DEFAULT_RESOLVE_OPTIONS,
  asOf: number = Date.now() / 1000,
): Resolution {
  const span = TF_SECONDS[plan.timeframe];
  const bull = plan.direction === 'bullish';
  const { entry, stop: planStop, target1, target2 } = plan.levels;
  const entryDeadline = plan.triggerBarEnd + opts.entryWindowBars * span;
  const hi = Math.min(to, bars.length);
  const lastBarTime = hi > from ? bars[hi - 1].time : undefined;
  const base: Omit<Resolution, 'status'> = { lastBarTime };

  let fill = 0;
  let risk = 0;
  let triggeredAt: number | undefined;
  let entryIndex = -1;
  let holdDeadline = Infinity;
  let stop = planStop;
  let stopMoved = false;
  let mfeR = 0;
  let maeR = 0;
  let barsHeld = 0;
  /** Fraction of the position still on. */
  let remaining = 1;
  /** R already banked from portions taken off earlier. */
  let banked = 0;
  let scaled = false;
  /** Did the plan ever reach its profit objective? Decides the status. */
  let hitObjective = false;
  let reachedTarget2 = false;
  let gappedEntry = false;
  let ambiguousBar = false;
  let lastClose: number | undefined;

  const rAt = (price: number) =>
    risk > 0 ? (bull ? price - fill : fill - price) / risk : 0;

  const finish = (status: OutcomeStatus, closedAt: number, exitPrice: number): Resolution => ({
    ...base,
    // Reaching the objective is what "won" means, even if a scaled runner or a
    // breakeven stop takes the remainder off afterwards.
    status: hitObjective ? 'TARGET1' : status,
    triggeredAt,
    fill: round(fill),
    closedAt,
    exit: round(exitPrice),
    r: round(banked + remaining * rAt(exitPrice)),
    mfeR: round(mfeR),
    maeR: round(maeR),
    barsHeld,
    reachedTarget2,
    gappedEntry,
    ...(ambiguousBar ? { ambiguousBar: true } : {}),
  });

  /** The price this policy is currently trying to exit at, if any. */
  const objective = (): number | null => {
    switch (opts.exit.kind) {
      case 'target1':
        return target1;
      case 'target2':
        return target2;
      case 'rMultiple':
        return bull ? fill + opts.exit.r * risk : fill - opts.exit.r * risk;
      case 'trail':
        return null;
      case 'scale':
        return scaled ? target2 : target1;
    }
  };

  for (let i = from; i < hi; i++) {
    const bar = bars[i];

    if (triggeredAt === undefined) {
      // Still hunting for the trigger.
      if (bar.time >= entryDeadline) break; // window closed unfilled
      if (!(bull ? bar.high >= entry : bar.low <= entry)) continue;

      // A bar that opens beyond the trigger filled at the open, not the level.
      const gapped = bull ? bar.open > entry : bar.open < entry;
      fill = gapped ? bar.open : entry;
      gappedEntry = gapped;
      risk = Math.abs(fill - planStop);
      triggeredAt = bar.time;
      entryIndex = i;
      holdDeadline = bar.time + opts.maxHoldBars * span;
      barsHeld = 1;
    } else {
      if (bar.time >= holdDeadline) {
        return finish('TIMEOUT', bar.time, lastClose ?? fill);
      }
      barsHeld += 1;
    }

    if (risk > 0) {
      const favourable = bull ? bar.high - fill : fill - bar.low;
      const adverse = bull ? fill - bar.low : bar.high - fill;
      if (favourable / risk > mfeR) mfeR = favourable / risk;
      if (adverse / risk > maeR) maeR = adverse / risk;
    }
    if (bull ? bar.high >= target2 : bar.low <= target2) reachedTarget2 = true;

    const obj = objective();
    const hitStop = bull ? bar.low <= stop : bar.high >= stop;
    const hitObj = obj !== null && (bull ? bar.high >= obj : bar.low <= obj);

    if (hitStop && hitObj) {
      // Unknowable from OHLC — assume the loss.
      ambiguousBar = true;
      return finish(stopMoved ? 'TRAILED' : 'STOPPED', bar.time, stopFill(bar, stop, bull));
    }
    if (hitStop) {
      return finish(stopMoved ? 'TRAILED' : 'STOPPED', bar.time, stopFill(bar, stop, bull));
    }
    if (hitObj && obj !== null) {
      const exitPrice = targetFill(bar, obj, bull);
      if (opts.exit.kind === 'scale' && !scaled) {
        // Bank the scaled-out portion and let the rest run to target 2.
        banked += opts.exit.fraction * rAt(exitPrice);
        remaining = 1 - opts.exit.fraction;
        scaled = true;
        hitObjective = true;
        if (opts.exit.breakeven && (bull ? fill > stop : fill < stop)) {
          stop = fill;
          // Not a trail: the trade reached its objective, so the status is
          // already decided and `stopMoved` would only muddy it.
        }
        if (remaining <= 0) return finish('TARGET1', bar.time, exitPrice);
      } else {
        hitObjective = true;
        // Only the target1 policy leaves a runner worth observing; the others
        // either exit at target 2 or never had one.
        if (opts.exit.kind === 'target1') {
          reachedTarget2 =
            reachedTarget2 || ranToTarget2(bars, i, hi, holdDeadline, target2, stop, bull);
        }
        return finish('TARGET1', bar.time, exitPrice);
      }
    }

    // Trail from bars that have already closed, including this one, so the
    // stop applies from the NEXT bar onward.
    if (opts.exit.kind === 'trail' && entryIndex >= 0) {
      const start = Math.max(entryIndex, i - opts.exit.barsBack + 1);
      // Bull trades trail behind the lowest low of the window, bears above the
      // highest high.
      let ext = bull ? Infinity : -Infinity;
      for (let j = start; j <= i; j++) {
        ext = bull ? Math.min(ext, bars[j].low) : Math.max(ext, bars[j].high);
      }
      if (bull ? ext > stop : ext < stop) {
        stop = ext;
        stopMoved = true;
      }
    }

    lastClose = bar.close;
  }

  if (triggeredAt === undefined) {
    // No bar took the trigger. Whether that is final depends on whether the
    // window has actually elapsed yet in wall-clock terms.
    return { ...base, status: asOf >= entryDeadline ? 'EXPIRED' : 'PENDING' };
  }

  // Triggered and still running — unless the hold window has already elapsed
  // without a bar arriving to close it out, in which case mark to market.
  if (asOf >= holdDeadline) {
    return finish('TIMEOUT', lastBarTime as number, lastClose ?? fill);
  }
  return {
    ...base,
    status: 'OPEN',
    triggeredAt,
    fill: round(fill),
    mfeR: round(mfeR),
    maeR: round(maeR),
    barsHeld,
    reachedTarget2,
    gappedEntry,
  };
}

/**
 * Resolve `plan` against any set of bars.
 *
 * Deliberately a full replay from the trigger every time rather than an
 * incremental update from a stored cursor: re-deriving the whole outcome from
 * bars is idempotent and self-correcting, so a bad run or a revised bar cannot
 * leave a permanently wrong record behind.
 */
export function resolvePlan(
  plan: TradePlan,
  bars: Candle[],
  opts: ResolveOptions = DEFAULT_RESOLVE_OPTIONS,
  asOf: number = Date.now() / 1000,
): Resolution {
  const forward = bars
    .filter((b) => b.time >= plan.triggerBarEnd)
    .sort((a, b) => a.time - b.time);
  return resolveRange(plan, forward, 0, forward.length, opts, asOf);
}

/**
 * Would a runner left on after target 1 have reached extended magnitude?
 *
 * Walks on from the target-1 bar until price touches target 2 (yes) or falls
 * back through the stop (no), stopping at the hold deadline either way. Purely
 * observational — the position closed at target 1 and this changes no R — but
 * it is what turns "the exit policy is arbitrary" into a question with an
 * answer: if most winners run on, the policy is costing money.
 */
function ranToTarget2(
  bars: Candle[],
  from: number,
  to: number,
  holdDeadline: number,
  target2: number,
  stop: number,
  bull: boolean,
): boolean {
  for (let i = from; i < to; i++) {
    const bar = bars[i];
    if (bar.time >= holdDeadline) return false;
    if (bull ? bar.high >= target2 : bar.low <= target2) return true;
    // A runner does not survive a trade back through the original stop.
    if (i > from && (bull ? bar.low <= stop : bar.high >= stop)) return false;
  }
  return false;
}

/** A stop gapped through fills at the open, not at the level. */
function stopFill(bar: Candle, stop: number, bull: boolean): number {
  return bull ? Math.min(stop, bar.open) : Math.max(stop, bar.open);
}

/**
 * A target gapped through fills at the open — better than planned, and real:
 * a limit order at the target would have been taken out on the gap.
 */
function targetFill(bar: Candle, target: number, bull: boolean): number {
  return bull ? Math.max(target, bar.open) : Math.min(target, bar.open);
}

/**
 * The moment a series' last completed bar closed — i.e. when its "?" bar
 * opened. The forming bar's own open time is that moment exactly; without one
 * (a market that is closed, e.g. equities at the weekend) fall back to the
 * nominal timeframe span.
 */
export function triggerBarEndFrom(
  completed: Candle[],
  forming: Candle | null,
  tf: Timeframe,
): number {
  if (forming) return forming.time;
  const last = completed[completed.length - 1];
  return (last?.time ?? 0) + TF_SECONDS[tf];
}
