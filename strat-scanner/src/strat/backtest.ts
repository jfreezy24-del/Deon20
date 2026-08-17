import { Candle, Timeframe } from './types';
import { detectPotentialSetups } from './patterns';
import { computeLevels } from './levels';
import { buildContinuity, scoreContinuity } from './continuity';
import { scoreConfidence } from './confidence';
import { GradedSignal } from './edgeReport';
import { DEFAULT_RESOLVE_OPTIONS, ResolveOptions, resolveRange, TradePlan } from './outcomes';
import { sampleTarget, TargetSample } from './targetQuality';
import { TF_SECONDS } from '../data/series';

/**
 * Historical replay of the live engine, for calibration.
 *
 * The confidence model is hand-tuned: full timeframe continuity is worth 24
 * points, compression 6, volume expansion 5. Those numbers have never been
 * checked against an outcome. This module produces the sample that checks
 * them — the same detection, levels, continuity and scoring code the scanner
 * runs, replayed over years of bars, with every signal resolved by the same
 * resolver the live tracker uses.
 *
 * **No look-ahead.** Everything is evaluated as of the close of daily bar `i`,
 * using only bars up to and including `i`. Higher-timeframe candles are
 * reconstructed from the daily bars rather than fetched, so a partially formed
 * week is genuinely partial: it contains the days that had actually traded at
 * that moment and nothing more. Fetching weekly bars directly would hand every
 * historical signal the whole week's outcome as its own continuity input,
 * which is the single easiest way to backtest a fantasy.
 *
 * Two honest differences from live running, both documented rather than
 * papered over:
 *
 *  1. **4H is not modelled**, because daily history cannot reconstruct it.
 *     Continuity therefore scores over D/W/M only. The `ftfc-full` term needs
 *     three known timeframes, so it can still fire — but on a slightly easier
 *     test than live, where a conflicting 4H bar can veto it.
 *  2. **Continuity uses the just-closed daily bar** as the current-candle
 *     proxy. Live, the scanner reads a partially formed bar. Neither is
 *     available to the other; this is the closest same-instant snapshot.
 */

export interface BacktestOptions {
  /** Which timeframes to replay. 4H is unavailable from daily history. */
  timeframes: Timeframe[];
  /** Confidence floor. Zero by default: calibration needs the losers too. */
  minConfidence: number;
  /** Bars of history required in a timeframe before it may publish. */
  minBars: number;
  resolve: ResolveOptions;
}

export const DEFAULT_BACKTEST_OPTIONS: BacktestOptions = {
  timeframes: ['D', 'W', 'M'],
  // Deliberately not the live alerter's 50. Asking "is a 70 better than a 50"
  // is unanswerable from a sample that only kept the 50s and up.
  minConfidence: 0,
  minBars: 25,
  resolve: DEFAULT_RESOLVE_OPTIONS,
};

/**
 * Bars of history handed to the engine at each step.
 *
 * 60 is comfortably more than the deepest lookback any component uses (the
 * 20-bar pivot window in `computeLevels`, the 21-bar volume window in
 * `scoreConfidence`), so a bounded window is exactly equivalent to passing the
 * full series — and turns an O(n²) replay into a linear one.
 */
const ENGINE_WINDOW = 60;

/** UTC Monday of the week containing `t`. */
export function weekStart(t: number): number {
  const d = new Date(t * 1000);
  const mondayOffset = (d.getUTCDay() + 6) % 7;
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - mondayOffset) / 1000;
}

/** UTC first-of-month for the month containing `t`. */
export function monthStart(t: number): number {
  const d = new Date(t * 1000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / 1000;
}

/** Roll a run of daily bars up into the single candle they compose. */
export function aggregate(bars: Candle[], time: number): Candle {
  let high = -Infinity;
  let low = Infinity;
  let volume = 0;
  for (const b of bars) {
    if (b.high > high) high = b.high;
    if (b.low < low) low = b.low;
    volume += b.volume;
  }
  return {
    time,
    open: bars[0].open,
    high,
    low,
    close: bars[bars.length - 1].close,
    volume,
  };
}

const tail = <T>(xs: T[], n: number): T[] => (xs.length <= n ? xs : xs.slice(xs.length - n));

const isoDate = (t: number) => new Date(t * 1000).toISOString().slice(0, 10);

/** Everything about a replayed signal that does not depend on the exit policy. */
export type SignalIdentity = Omit<
  GradedSignal,
  'status' | 'r' | 'mfeR' | 'maeR' | 'reachedTarget2'
>;

export interface ReplayedSignal {
  identity: SignalIdentity;
  plan: TradePlan;
  /** Index into the replay's bars where the "?" bar begins. */
  fromIndex: number;
  /**
   * Where this signal's first target came from, sampled here because this is
   * the only place the exact window the engine scored from is still in hand.
   * For weekly and monthly signals that window is an aggregate that cannot be
   * recovered from `fromIndex` afterwards.
   */
  target: TargetSample | null;
}

export interface Replay {
  symbol: string;
  /** The sorted daily bars every `fromIndex` refers into. */
  bars: Candle[];
  signals: ReplayedSignal[];
  /** Wall-clock cutoff: nothing after the last bar can be observed. */
  asOf: number;
}

/**
 * Replay one symbol's daily history and return every signal it would have
 * published — detected, scored and levelled, but **not resolved**.
 *
 * Detection and scoring are by far the expensive half and are identical no
 * matter how the position is later taken off, so the policy sweep runs this
 * once per symbol and then re-resolves the same signals under each policy.
 * Resolving inside the replay would multiply the whole cost by the size of the
 * grid for no extra information.
 */
export function replaySymbol(
  symbol: string,
  daily: Candle[],
  options: Partial<BacktestOptions> = {},
): Replay {
  const opts: BacktestOptions = { ...DEFAULT_BACKTEST_OPTIONS, ...options };
  const bars = [...daily].sort((a, b) => a.time - b.time);
  if (bars.length < opts.minBars + 2) {
    return { symbol, bars, signals: [], asOf: 0 };
  }

  // Nothing after the final bar can be observed, so treat the replay's "now"
  // as the moment that bar closed.
  const asOf = bars[bars.length - 1].time + TF_SECONDS.D;

  const out: ReplayedSignal[] = [];

  const weeklyCompleted: Candle[] = [];
  const monthlyCompleted: Candle[] = [];
  let weekBars: Candle[] = [];
  let monthBars: Candle[] = [];
  let curWeek = weekStart(bars[0].time);
  let curMonth = monthStart(bars[0].time);
  // History almost never starts on a Monday or a first-of-month, so the first
  // bucket of each is a fragment of a real bar. Dropping it costs one week and
  // one month at the very start; keeping it would feed the classifier a bar
  // whose open and range are simply wrong.
  let firstWeek = true;
  let firstMonth = true;

  // Stop one short: the boundary test and the "?" bar both need bars[i + 1].
  for (let i = 0; i < bars.length - 1; i++) {
    const bar = bars[i];
    const next = bars[i + 1];

    const wk = weekStart(bar.time);
    if (wk !== curWeek) {
      if (weekBars.length > 0 && !firstWeek) weeklyCompleted.push(aggregate(weekBars, curWeek));
      firstWeek = false;
      weekBars = [];
      curWeek = wk;
    }
    const mo = monthStart(bar.time);
    if (mo !== curMonth) {
      if (monthBars.length > 0 && !firstMonth) monthlyCompleted.push(aggregate(monthBars, curMonth));
      firstMonth = false;
      monthBars = [];
      curMonth = mo;
    }
    weekBars.push(bar);
    monthBars.push(bar);

    if (i < opts.minBars) continue;

    const partialWeek = aggregate(weekBars, curWeek);
    const partialMonth = aggregate(monthBars, curMonth);

    // Continuity as of this close. Only bars that have actually traded are in
    // scope; the week and month are partial unless today happens to end them.
    const continuityMap = buildContinuity({ D: bar, W: partialWeek, M: partialMonth });

    // The "?" bar opens with the next daily bar, whichever timeframe published.
    const triggerBarEnd = next.time;

    const publish = (tf: Timeframe, completed: Candle[]) => {
      if (!opts.timeframes.includes(tf) || completed.length < opts.minBars) return;
      const window = tail(completed, ENGINE_WINDOW);

      for (const match of detectPotentialSetups(window)) {
        const levels = computeLevels(window, match.direction);
        const contScore = scoreContinuity(continuityMap, match.direction);
        const conf = scoreConfidence({
          pattern: match,
          continuity: contScore,
          levels,
          completed: window,
          // A historical replay evaluates at a bar close, so the "?" has not
          // printed yet and the in-force bonus can never apply. Live it can,
          // which the report notes when that term shows no sample.
          triggered: false,
        });
        if (conf.score < opts.minConfidence) continue;

        out.push({
          plan: {
            direction: match.direction,
            timeframe: tf,
            levels,
            setupBarTime: match.triggerBar.time,
            triggerBarEnd,
          },
          fromIndex: i + 1,
          target: sampleTarget(window, match.direction, tf, levels, conf.score),
          identity: {
            key: `${symbol}|${tf}|${match.direction}|${match.name}|${match.triggerBar.time}`,
            symbol,
            timeframe: tf,
            direction: match.direction,
            pattern: match.name,
            sequence: match.sequence,
            scenario: match.scenario,
            compression: match.compression,
            isReversal: match.isReversal,
            confidence: conf.score,
            factorKeys: conf.factors.map((f) => f.key),
            aligned: contScore.aligned.length,
            opposed: contScore.opposed.length,
            fullContinuity: contScore.full,
            promisedR: levels.rr1,
            date: isoDate(triggerBarEnd),
          },
        });
      }
    };

    // Pre-windowed: `publish` would trim to the same bars anyway, and slicing
    // the whole history at every step is what makes a replay quadratic.
    publish('D', bars.slice(Math.max(0, i + 1 - ENGINE_WINDOW), i + 1));

    // Higher timeframes publish only on the bar that completes them — the last
    // daily bar of the week or month. On every other day the same actionable
    // bar would be re-detected, which is the live scanner's job (it re-alerts
    // until the bar changes) but would be double-counting here.
    if (weekStart(next.time) !== curWeek) {
      publish('W', tail([...weeklyCompleted, partialWeek], ENGINE_WINDOW));
    }
    if (monthStart(next.time) !== curMonth) {
      publish('M', tail([...monthlyCompleted, partialMonth], ENGINE_WINDOW));
    }
  }

  return { symbol, bars, signals: out, asOf };
}

/**
 * Resolve a replay under one set of options, producing report-ready rows.
 *
 * Signals still unresolved at the end of the history come back as OPEN or
 * PENDING and are excluded from the report by `buildEdgeReport` — a trade the
 * data cannot settle must not be counted as either a win or a loss.
 */
export function gradeReplay(replay: Replay, resolve: ResolveOptions): GradedSignal[] {
  return replay.signals.map((s) => {
    const to = s.fromIndex + forwardSpan(s.plan.timeframe, resolve);
    const resolution = resolveRange(s.plan, replay.bars, s.fromIndex, to, resolve, replay.asOf);
    return {
      ...s.identity,
      status: resolution.status,
      r: resolution.r,
      mfeR: resolution.mfeR,
      maeR: resolution.maeR,
      reachedTarget2: resolution.reachedTarget2,
    };
  });
}

/**
 * Replay one symbol's daily history and return every signal it would have
 * published, graded under a single set of options.
 */
export function backtestSymbol(
  symbol: string,
  daily: Candle[],
  options: Partial<BacktestOptions> = {},
): GradedSignal[] {
  const opts: BacktestOptions = { ...DEFAULT_BACKTEST_OPTIONS, ...options };
  return gradeReplay(replaySymbol(symbol, daily, opts), opts.resolve);
}

/**
 * How many forward bars a plan could possibly resolve against: its entry window
 * plus its hold window, with a margin for non-trading days. Bounding the walk
 * is what keeps the replay linear instead of quadratic, and letting the
 * resolver work on an index range rather than a slice keeps the sweep from
 * allocating a fresh array per signal per policy.
 */
function forwardSpan(tf: Timeframe, resolve: ResolveOptions): number {
  const seconds = (resolve.entryWindowBars + resolve.maxHoldBars + 1) * TF_SECONDS[tf];
  // Calendar days to trading bars, plus slack for weekends and holidays.
  return Math.ceil(seconds / TF_SECONDS.D) + 10;
}
