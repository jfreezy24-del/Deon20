import { Signal, Timeframe } from './types';
import { GradedSignal } from './edgeReport';
import { Resolution, TradePlan } from './outcomes';

/**
 * The forward record: every signal the scanner published, and what became of
 * it.
 *
 * Kept deliberately separate from the backtest. The backtest answers "does
 * this pattern work, historically" over a large in-sample population; this
 * answers the narrower and more uncomfortable question of whether the signals
 * *actually sent to the phone* made money. Those diverge for real reasons —
 * live runs see the universe on a schedule, miss bars, and enrol only what
 * clears the alert bar — and the divergence is worth being able to see.
 *
 * Storage is split by lifecycle, not by type:
 *
 *  - unsettled records live in a small JSON file that is rewritten each run,
 *    because their resolution changes daily until it stops changing;
 *  - settled records are appended to a JSONL history and never touched again,
 *    which keeps the committed diff to "n lines added" instead of a rewrite of
 *    the entire history every day.
 */

export interface TrackedSignal {
  key: string;
  symbol: string;
  symbolName?: string;
  timeframe: Timeframe;
  direction: Signal['direction'];
  pattern: string;
  sequence: string;
  scenario: Signal['scenario'];
  compression: boolean;
  isReversal: boolean;
  confidence: number;
  confidenceLabel: Signal['confidenceLabel'];
  factorKeys: GradedSignal['factorKeys'];
  aligned: number;
  opposed: number;
  fullContinuity: boolean;
  status: Signal['status'];
  levels: Signal['levels'];
  setupBarTime: number;
  triggerBarEnd: number;
  /** ISO yyyy-mm-dd the signal was first seen and enrolled. */
  enrolledOn: string;
  /** Latest replay of the outcome. Rewritten in full on every run. */
  resolution: Resolution;
}

/**
 * Identity of a tracked signal.
 *
 * Includes the pattern name because one actionable bar can publish two
 * scenarios in the same direction over its life, and excludes status so a
 * signal that goes POTENTIAL -> TRIGGERED stays one record rather than
 * becoming two. The alerters key on status deliberately (they *want* to ping
 * twice); a record that did the same would double-count every trade.
 */
export const trackKey = (s: {
  symbol: string;
  timeframe: Timeframe;
  direction: string;
  pattern: string;
  setupBarTime: number;
}) => `${s.symbol}|${s.timeframe}|${s.direction}|${s.pattern}|${s.setupBarTime}`;

export const isoDate = (d: Date | number): string =>
  new Date(typeof d === 'number' ? d * 1000 : d).toISOString().slice(0, 10);

export function toTracked(signal: Signal, enrolledOn: string): TrackedSignal {
  const aligned: Timeframe[] = [];
  const opposed: Timeframe[] = [];
  const want = signal.direction === 'bullish' ? 'up' : 'down';
  for (const [tf, trend] of Object.entries(signal.continuity)) {
    if (!trend || trend === 'flat') continue;
    (trend === want ? aligned : opposed).push(tf as Timeframe);
  }

  return {
    key: trackKey(signal),
    symbol: signal.symbol,
    symbolName: signal.symbolName,
    timeframe: signal.timeframe,
    direction: signal.direction,
    pattern: signal.pattern,
    sequence: signal.sequence,
    scenario: signal.scenario,
    compression: signal.compression,
    isReversal: signal.isReversal,
    confidence: signal.confidence,
    confidenceLabel: signal.confidenceLabel,
    factorKeys: signal.factors.map((f) => f.key),
    aligned: aligned.length,
    opposed: opposed.length,
    fullContinuity: aligned.length >= 3 && opposed.length === 0,
    status: signal.status,
    levels: signal.levels,
    setupBarTime: signal.setupBarTime,
    triggerBarEnd: signal.triggerBarEnd,
    enrolledOn,
    resolution: { status: 'PENDING' },
  };
}

export const planOf = (t: TrackedSignal): TradePlan => ({
  direction: t.direction,
  timeframe: t.timeframe,
  levels: t.levels,
  setupBarTime: t.setupBarTime,
  triggerBarEnd: t.triggerBarEnd,
});

/** Flatten a tracked record into the shape the edge report slices on. */
export const toGraded = (t: TrackedSignal): GradedSignal => ({
  key: t.key,
  symbol: t.symbol,
  timeframe: t.timeframe,
  direction: t.direction,
  pattern: t.pattern,
  sequence: t.sequence,
  scenario: t.scenario,
  compression: t.compression,
  isReversal: t.isReversal,
  confidence: t.confidence,
  factorKeys: t.factorKeys,
  aligned: t.aligned,
  opposed: t.opposed,
  fullContinuity: t.fullContinuity,
  promisedR: t.levels.rr1,
  status: t.resolution.status,
  r: t.resolution.r,
  mfeR: t.resolution.mfeR,
  maeR: t.resolution.maeR,
  reachedTarget2: t.resolution.reachedTarget2,
  date: t.enrolledOn,
});

export interface EnrollOptions {
  /** Only track signals at or above this confidence. */
  minConfidence: number;
  /** Timeframes eligible for tracking. */
  timeframes: Timeframe[];
}

export const DEFAULT_ENROLL_OPTIONS: EnrollOptions = {
  // Matches the alerters' floor: the record should mirror what actually gets
  // sent, not a wider population that was never acted on.
  minConfidence: 50,
  // 4H is excluded because resolution runs on daily bars — a 4H plan whose
  // entry and stop both sit inside one daily bar cannot be resolved honestly
  // at that granularity, and guessing would quietly fabricate results.
  timeframes: ['D', 'W', 'M'],
};

/**
 * Pick out signals from a sweep that are not already on the record.
 *
 * Re-enrolment is the failure mode that matters here: the same actionable bar
 * is re-detected on every run until a new bar closes, so anything keyed on
 * "seen this sweep" would record one setup dozens of times and weight the
 * statistics toward whatever happened to be scanned most often.
 */
export function selectForEnrollment(
  signals: Signal[],
  known: Set<string>,
  opts: EnrollOptions = DEFAULT_ENROLL_OPTIONS,
): Signal[] {
  return signals.filter(
    (s) =>
      opts.timeframes.includes(s.timeframe) &&
      s.confidence >= opts.minConfidence &&
      !known.has(trackKey(s)),
  );
}
