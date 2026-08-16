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
  | 'TIMEOUT';

/** Statuses that will never change again. */
export const TERMINAL: OutcomeStatus[] = ['EXPIRED', 'TARGET1', 'STOPPED', 'TIMEOUT'];

export const isTerminal = (s: OutcomeStatus): boolean => TERMINAL.includes(s);

/** A closed outcome that actually became a trade — the only kind with an R. */
export const isTrade = (s: OutcomeStatus): boolean =>
  s === 'TARGET1' || s === 'STOPPED' || s === 'TIMEOUT';

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
}

export const DEFAULT_RESOLVE_OPTIONS: ResolveOptions = {
  entryWindowBars: 1,
  maxHoldBars: 6,
};

export interface Resolution {
  status: OutcomeStatus;
  /** Bar time the trigger was taken. */
  triggeredAt?: number;
  /** Actual entry price — the plan's entry, or the open on a gap through it. */
  fill?: number;
  /** Bar time the position closed. */
  closedAt?: number;
  /** Price the position closed at. */
  exit?: number;
  /** Realised R, risk measured from the actual fill to the stop. */
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
   * A single bar contained both the stop and target 1. OHLC cannot say which
   * came first, so the stop is assumed — see `resolvePlan`.
   */
  ambiguousBar?: boolean;
  /** Last resolution bar examined, for the run log. */
  lastBarTime?: number;
}

const round = (v: number) => Number(v.toFixed(4));

/**
 * Walk `bars` forward and resolve `plan`.
 *
 * Deliberately a full replay from the trigger every time rather than an
 * incremental update from a stored cursor: re-deriving the whole outcome from
 * bars is idempotent and self-correcting, so a bad run or a revised bar cannot
 * leave a permanently wrong record behind.
 *
 * Two conventions, both chosen to bias against the engine:
 *
 *  - **Same-bar stop and target counts as the stop.** OHLC cannot order two
 *    touches inside one bar. Assuming the target would inflate every edge
 *    number in the report by exactly the cases that are hardest to verify.
 *  - **Gaps fill at the open, not at the level.** A plan that gaps in gets the
 *    worse entry and the wider risk it would really have had.
 *
 * The exit policy is "close the whole thing at target 1". Target 1 is the
 * objective the engine publishes and `rr1` is what the confidence model scores
 * on, so realised R stays directly comparable to promised R — which is the
 * whole point of measuring. Whether price ran on to target 2 is recorded
 * separately, as information rather than as profit.
 */
export function resolvePlan(
  plan: TradePlan,
  bars: Candle[],
  opts: ResolveOptions = DEFAULT_RESOLVE_OPTIONS,
  asOf: number = Date.now() / 1000,
): Resolution {
  const span = TF_SECONDS[plan.timeframe];
  const bull = plan.direction === 'bullish';
  const { entry, stop, target1, target2 } = plan.levels;
  const entryDeadline = plan.triggerBarEnd + opts.entryWindowBars * span;

  // Only bars from the "?" bar onward can act on the plan. Anything earlier is
  // the trigger bar itself or its history.
  const forward = bars
    .filter((b) => b.time >= plan.triggerBarEnd)
    .sort((a, b) => a.time - b.time);

  const lastBarTime = forward.length > 0 ? forward[forward.length - 1].time : undefined;
  const base: Omit<Resolution, 'status'> = { lastBarTime };

  let fill: number | undefined;
  let risk = 0;
  let triggeredAt: number | undefined;
  let holdDeadline = Infinity;
  let mfeR = 0;
  let maeR = 0;
  let barsHeld = 0;
  let reachedTarget2 = false;
  let gappedEntry = false;
  let lastClose: number | undefined;

  const close = (status: OutcomeStatus, closedAt: number, exit: number): Resolution => ({
    ...base,
    status,
    triggeredAt,
    fill: fill === undefined ? undefined : round(fill),
    closedAt,
    exit: round(exit),
    r: risk > 0 ? round(((bull ? exit - (fill as number) : (fill as number) - exit)) / risk) : 0,
    mfeR: round(mfeR),
    maeR: round(maeR),
    barsHeld,
    reachedTarget2,
    gappedEntry,
  });

  for (let i = 0; i < forward.length; i++) {
    const bar = forward[i];
    if (triggeredAt === undefined) {
      // Still hunting for the trigger.
      if (bar.time >= entryDeadline) break; // window closed unfilled
      const took = bull ? bar.high >= entry : bar.low <= entry;
      if (!took) continue;

      // A bar that opens beyond the trigger filled at the open, not the level.
      const gapped = bull ? bar.open > entry : bar.open < entry;
      fill = gapped ? bar.open : entry;
      gappedEntry = gapped;
      risk = Math.abs(fill - stop);
      triggeredAt = bar.time;
      holdDeadline = bar.time + opts.maxHoldBars * span;
      barsHeld = 1;
    } else {
      if (bar.time >= holdDeadline) {
        return close('TIMEOUT', bar.time, lastClose ?? (fill as number));
      }
      barsHeld += 1;
    }

    const f = fill as number;
    if (risk > 0) {
      const favourable = bull ? bar.high - f : f - bar.low;
      const adverse = bull ? f - bar.low : bar.high - f;
      mfeR = Math.max(mfeR, favourable / risk);
      maeR = Math.max(maeR, adverse / risk);
    }

    const hitStop = bull ? bar.low <= stop : bar.high >= stop;
    const hitT1 = bull ? bar.high >= target1 : bar.low <= target1;

    if (hitStop && hitT1) {
      // Unknowable from OHLC — assume the loss.
      return { ...close('STOPPED', bar.time, stopFill(bar, stop, bull)), ambiguousBar: true };
    }
    if (hitStop) return close('STOPPED', bar.time, stopFill(bar, stop, bull));
    if (hitT1) {
      // The trade closes here, but keep watching: whether extended magnitude
      // followed is the only evidence on whether this exit policy is leaving
      // money behind. Recorded, never paid — it does not touch R.
      reachedTarget2 = ranToTarget2(forward, i, holdDeadline, target2, stop, bull);
      return close('TARGET1', bar.time, targetFill(bar, target1, bull));
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
    return close('TIMEOUT', lastBarTime as number, lastClose ?? (fill as number));
  }
  return {
    ...base,
    status: 'OPEN',
    triggeredAt,
    fill: round(fill as number),
    mfeR: round(mfeR),
    maeR: round(maeR),
    barsHeld,
    reachedTarget2,
    gappedEntry,
  };
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
  forward: Candle[],
  from: number,
  holdDeadline: number,
  target2: number,
  stop: number,
  bull: boolean,
): boolean {
  for (let i = from; i < forward.length; i++) {
    const bar = forward[i];
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
