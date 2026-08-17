import { Candle, Direction, Levels, Timeframe, TIMEFRAMES } from './types';
import { findPivotHighs, findPivotLows } from './dca';
import { rewardRiskPoints } from './confidence';

/**
 * Where the published first target actually comes from.
 *
 * `computeLevels` calls its target logic "magnitude" and its comment says
 * "Pivots", but the code takes the nearest of *every* bar high above entry in a
 * 20-bar window. A bar high partway down a decline is not a place price turned
 * and not a broadening-formation point — it is just the smallest number that
 * cleared a filter.
 *
 * That matters more than it looks, because `rr1` is not decoration:
 *
 *  - it feeds `scoreConfidence` through the `rr-strong` / `rr-ok` / `rr-poor`
 *    terms, so a measurement artefact moves the published score by up to 15
 *    points and can push a signal across an alert threshold;
 *  - the outcome record's default exit policy closes trades **at target 1**, so
 *    a target sitting a fraction of a risk unit away caps realised R at that
 *    fraction while losses still pay a full −1R.
 *
 * This module measures the problem rather than assuming it. It classifies every
 * published target, reports the `rr1` distribution, and shows what restricting
 * targets to genuine swing pivots would change — including how many signals
 * would cross the alert thresholds. Read it before changing `computeLevels`:
 * the point is to see the real number on real data first.
 */

export type TargetSource =
  /** A confirmed swing pivot — a place price actually turned. */
  | 'pivot'
  /** An ordinary bar high/low that happened to be the nearest one beyond entry. */
  | 'bar-high'
  /** Nothing beyond entry in the window, so the measured 1.5R projection stood. */
  | 'measured';

export interface TargetSample {
  timeframe: Timeframe;
  direction: Direction;
  source: TargetSource;
  /** Reward/risk to the published first target. */
  rr1: number;
  /** Reward/risk if the target were restricted to swing pivots. */
  pivotRr1: number;
  /** Confidence as published. */
  confidence: number;
  /** How much the score would move, via the reward/risk band only. */
  confidenceDelta: number;
}

/**
 * The first target a pivot-only rule would pick, or null when no swing pivot
 * lies beyond entry in the window.
 *
 * Deliberately mirrors `computeLevels` — same window, same "nearest beyond
 * entry" choice — so the only difference under test is *which bars are
 * eligible to be a target at all*.
 */
export function pivotTarget(
  completed: Candle[],
  direction: Direction,
  entry: number,
  lookback = 20,
): number | null {
  const bull = direction === 'bullish';
  const start = Math.max(0, completed.length - 1 - lookback);
  const window = completed.slice(start, completed.length - 1);
  const pivots = bull ? findPivotHighs(window) : findPivotLows(window);
  const beyond = pivots
    .map((c) => (bull ? c.high : c.low))
    .filter((p) => (bull ? p > entry : p < entry))
    .sort((a, b) => (bull ? a - b : b - a));
  return beyond.length > 0 ? beyond[0] : null;
}

/** Close enough to be the same price, given the rounding `computeLevels` does. */
const same = (a: number, b: number) => Math.abs(a - b) <= Math.max(Math.abs(b), 1) * 1e-4;

/**
 * Classify a published target and measure the pivot-only alternative.
 *
 * `completed` must be the exact window the engine scored from, so the
 * classification describes the signal that actually shipped rather than a
 * reconstruction of it.
 */
export function sampleTarget(
  completed: Candle[],
  direction: Direction,
  timeframe: Timeframe,
  levels: Levels,
  confidence: number,
  lookback = 20,
): TargetSample | null {
  const bull = direction === 'bullish';
  const risk = Math.abs(levels.entry - levels.stop);
  if (risk <= 0) return null;

  const measured = bull ? levels.entry + 1.5 * risk : levels.entry - 1.5 * risk;
  const pivot = pivotTarget(completed, direction, levels.entry, lookback);

  // Order matters: a pivot can coincide with the nearest bar high, and when it
  // does the target genuinely came from structure.
  let source: TargetSource;
  if (pivot !== null && same(levels.target1, pivot)) source = 'pivot';
  else if (same(levels.target1, measured)) source = 'measured';
  else source = 'bar-high';

  const pivotT1 = pivot ?? measured;
  const rr1 = Math.abs(levels.target1 - levels.entry) / risk;
  const pivotRr1 = Math.abs(pivotT1 - levels.entry) / risk;

  return {
    timeframe,
    direction,
    source,
    rr1,
    pivotRr1,
    confidence,
    confidenceDelta: rewardRiskPoints(pivotRr1) - rewardRiskPoints(rr1),
  };
}

/* ── aggregation ───────────────────────────────────────────────────────── */

const quantile = (sorted: number[], q: number): number => {
  if (sorted.length === 0) return 0;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};

export interface SourceBreakdown {
  source: TargetSource;
  n: number;
  share: number;
  medianRr1: number;
}

export interface TimeframeBreakdown {
  timeframe: Timeframe;
  n: number;
  medianRr1: number;
  pivotMedianRr1: number;
  belowOneRShare: number;
}

export interface TargetQuality {
  n: number;
  bySource: SourceBreakdown[];
  byTimeframe: TimeframeBreakdown[];
  q1Rr1: number;
  medianRr1: number;
  q3Rr1: number;
  /** Share of signals whose first target is closer than the stop. */
  belowOneRShare: number;
  pivotMedianRr1: number;
  /** Share whose target would move at all under a pivot-only rule. */
  movedShare: number;
  /** Shares that would cross the two live alert floors. */
  crossed50Share: number;
  crossed60Share: number;
  /** Mean absolute confidence movement, in points. */
  meanAbsConfidenceDelta: number;
}

const SOURCE_ORDER: TargetSource[] = ['pivot', 'bar-high', 'measured'];

export function buildTargetQuality(samples: TargetSample[]): TargetQuality {
  const n = samples.length;
  const empty: TargetQuality = {
    n: 0,
    bySource: [],
    byTimeframe: [],
    q1Rr1: 0,
    medianRr1: 0,
    q3Rr1: 0,
    belowOneRShare: 0,
    pivotMedianRr1: 0,
    movedShare: 0,
    crossed50Share: 0,
    crossed60Share: 0,
    meanAbsConfidenceDelta: 0,
  };
  if (n === 0) return empty;

  const rr = [...samples.map((s) => s.rr1)].sort((a, b) => a - b);
  const pivotRr = [...samples.map((s) => s.pivotRr1)].sort((a, b) => a - b);

  const crosses = (floor: number) =>
    samples.filter((s) => s.confidence < floor !== s.confidence + s.confidenceDelta < floor).length;

  return {
    n,
    bySource: SOURCE_ORDER.filter((src) => samples.some((s) => s.source === src)).map((source) => {
      const group = samples.filter((s) => s.source === source);
      return {
        source,
        n: group.length,
        share: group.length / n,
        medianRr1: quantile(
          group.map((s) => s.rr1).sort((a, b) => a - b),
          0.5,
        ),
      };
    }),
    byTimeframe: TIMEFRAMES.filter((tf) => samples.some((s) => s.timeframe === tf)).map((tf) => {
      const group = samples.filter((s) => s.timeframe === tf);
      return {
        timeframe: tf,
        n: group.length,
        medianRr1: quantile(
          group.map((s) => s.rr1).sort((a, b) => a - b),
          0.5,
        ),
        pivotMedianRr1: quantile(
          group.map((s) => s.pivotRr1).sort((a, b) => a - b),
          0.5,
        ),
        belowOneRShare: group.filter((s) => s.rr1 < 1).length / group.length,
      };
    }),
    q1Rr1: quantile(rr, 0.25),
    medianRr1: quantile(rr, 0.5),
    q3Rr1: quantile(rr, 0.75),
    belowOneRShare: samples.filter((s) => s.rr1 < 1).length / n,
    pivotMedianRr1: quantile(pivotRr, 0.5),
    movedShare: samples.filter((s) => Math.abs(s.pivotRr1 - s.rr1) > 1e-9).length / n,
    crossed50Share: crosses(50) / n,
    crossed60Share: crosses(60) / n,
    meanAbsConfidenceDelta:
      samples.reduce((a, s) => a + Math.abs(s.confidenceDelta), 0) / n,
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const p1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const r2 = (v: number) => `${v.toFixed(2)}R`;

const SOURCE_LABEL: Record<TargetSource, string> = {
  pivot: 'Swing pivot (real structure)',
  'bar-high': 'Ordinary bar high/low',
  measured: 'Measured 1.5R fallback',
};

function table(headers: string[], rows: string[][]): string {
  return [headers, headers.map(() => '---'), ...rows]
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');
}

export function renderTargetQuality(q: TargetQuality): string {
  const lines: string[] = [];
  lines.push('## Are the magnitude targets real?');
  lines.push('');

  if (q.n === 0) {
    lines.push('_No targets sampled._');
    return lines.join('\n');
  }

  lines.push(
    '`computeLevels` calls its first target "magnitude" — the nearest prior pivot price should ' +
      'travel to. In practice it takes the nearest of **every** bar high above entry in a 20-bar ' +
      'window, and an ordinary bar high partway down a decline is not a place price turned. This ' +
      'section measures how often that happens and what it costs.',
  );
  lines.push('');
  lines.push(
    table(
      ['Target came from', 'Signals', 'Share', 'Median R:R'],
      q.bySource.map((s) => [SOURCE_LABEL[s.source], String(s.n), p1(s.share), r2(s.medianRr1)]),
    ),
  );
  lines.push('');

  lines.push(
    `Published first target: **median ${r2(q.medianRr1)}** ` +
      `(quartiles ${r2(q.q1Rr1)} – ${r2(q.q3Rr1)}). ` +
      `**${p1(q.belowOneRShare)}** of signals promise a first objective closer than the stop.`,
  );
  lines.push('');

  if (q.belowOneRShare > 0.5) {
    lines.push(
      `> ⚠️ **Most published targets sit closer than the risk.** Two things follow, and neither ` +
        `is cosmetic. The \`rr-poor\` penalty fires on the majority of signals, so a term meant to ` +
        `flag bad reward/risk is mostly reporting a measurement artefact. And the outcome record ` +
        `closes trades **at target 1**, so a winner pays ${r2(q.medianRr1)} while a loser still ` +
        `pays −1.00R — which caps measured expectancy no matter how good the setups are.`,
    );
    lines.push('');
  }

  lines.push('### What a pivot-only rule would change');
  lines.push('');
  lines.push(
    `Restricting targets to confirmed swing pivots (the detector already in \`dca.ts\`, used by ` +
      `the DCA ladder but not by \`computeLevels\`), falling back to the same 1.5R projection when ` +
      `no pivot lies beyond entry:`,
  );
  lines.push('');
  lines.push(`- Median R:R would move from **${r2(q.medianRr1)}** to **${r2(q.pivotMedianRr1)}**.`);
  lines.push(`- **${p1(q.movedShare)}** of targets would move at all.`);
  lines.push(
    `- Confidence would shift by **${q.meanAbsConfidenceDelta.toFixed(1)} points** on average, ` +
      `moving **${p1(q.crossed50Share)}** of signals across the 50 alert floor and ` +
      `**${p1(q.crossed60Share)}** across the 60 algo floor.`,
  );
  lines.push('');
  lines.push(
    '_This is a diagnostic, not a recommendation. Pushing targets further out trades more, ' +
      'smaller wins for fewer, larger ones — the same trade-off the policy sweep already measures ' +
      'as `Exit at T1` against `Hold for T2` and `Fixed 2R`. Read that leaderboard before ' +
      'changing anything here: if holding for a more distant target loses there, it will likely ' +
      'lose here too._',
  );
  lines.push('');
  lines.push(
    table(
      ['Timeframe', 'Signals', 'Median R:R', 'Pivot-only median', 'Below 1R'],
      q.byTimeframe.map((t) => [
        t.timeframe,
        String(t.n),
        r2(t.medianRr1),
        r2(t.pivotMedianRr1),
        p1(t.belowOneRShare),
      ]),
    ),
  );

  return lines.join('\n');
}
