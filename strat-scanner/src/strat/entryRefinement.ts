import { Candle, Levels } from './types';
import { DEFAULT_RESOLVE_OPTIONS, ResolveOptions, TradePlan } from './outcomes';
import { BucketStats, bucketStats, GradedSignal } from './edgeReport';
import { TF_SECONDS } from '../data/series';

/**
 * Lower-timeframe entry refinement.
 *
 * Standard Strat practice is to take the *setup* from the higher timeframe and
 * *time the entry* on a lower one. A daily 2-1-2 says "long above 450.20, wrong
 * below 443.10". Sitting a stop order at 450.20 accepts the whole daily bar as
 * risk. Watching the 60-minute chart once 450.20 breaks lets the stop sit under
 * the hourly bar that did the breaking instead — often a third of the distance,
 * for exactly the same trade.
 *
 * The rules this module holds to, in order of importance:
 *
 *  1. **60m never selects.** The setup, the direction and the trigger price all
 *     come from the higher timeframe, untouched. The scanner's own stated
 *     design is that 4H is the lowest timeframe scanned, and this does not
 *     change that — refinement runs *after* a trigger has broken and only moves
 *     the stop. Nothing here can create, cancel or re-rank a signal.
 *  2. **Targets never move.** Magnitude is a higher-timeframe concept — it
 *     measures to the prior pivot on the chart that produced the setup. Only
 *     the risk changes, which is the whole point: the same objective over a
 *     smaller denominator is a bigger R.
 *  3. **It only ever tightens.** If intraday structure would put the stop
 *     wider than the higher-timeframe invalidation, the higher-timeframe stop
 *     stands. Refinement is allowed to reduce risk, never to increase it.
 *  4. **It refuses to be noise.** A stop four ticks from entry is not a tighter
 *     stop, it is a coin flip with good optics — the R multiple looks enormous
 *     right up until it gets hit on a spread. Both a floor in percent of price
 *     and a floor relative to the original risk are enforced, and hitting
 *     either falls back to the higher-timeframe stop.
 *
 * Whether any of this actually pays is a genuinely open question — a tighter
 * stop buys a better R and buys more stop-outs, and which wins is an empirical
 * matter. `server/entry-refinement.ts` measures it by resolving both variants
 * against the same intraday bars.
 */

export type StopSource =
  /** Structure low/high across the last few intraday bars. */
  | 'intraday-pivot'
  /** The intraday bar that took the trigger, when that is all there is. */
  | 'intraday-trigger-bar'
  /** Refinement declined: the higher-timeframe invalidation stands. */
  | 'higher-timeframe';

export interface RefinementOptions {
  /**
   * Intraday bars behind the trigger bar to take the structure stop from.
   * Three is about one quarter of a session — enough to sit under the swing
   * that produced the break rather than under one candle's wick.
   */
  pivotBars: number;
  /** Minimum refined risk as a percent of entry price. */
  minRiskPct: number;
  /**
   * Minimum refined risk as a fraction of the original. A stop twenty times
   * tighter is not a better stop; it means the intraday bar was tiny and the
   * level is about to be revisited.
   */
  minRiskFraction: number;
}

export const DEFAULT_REFINEMENT_OPTIONS: RefinementOptions = {
  pivotBars: 3,
  minRiskPct: 0.15,
  minRiskFraction: 0.2,
};

export interface RefinedEntry {
  /** Unchanged — the higher timeframe owns the trigger. */
  entry: number;
  /** Refined invalidation, or the original when refinement declined. */
  stop: number;
  stopSource: StopSource;
  /** Open time of the intraday bar that took the trigger. */
  triggeredAt: number;
  /** Price risk after refinement. */
  risk: number;
  /** Price risk the higher-timeframe plan carried. */
  originalRisk: number;
  /** How many times tighter the refined stop is. 1 means unchanged. */
  tightening: number;
  /** Targets are untouched; only the R multiples move. */
  rr1: number;
  rr2: number;
  originalRr1: number;
  /** Why refinement declined, when it did. */
  declinedReason?: string;
}

/**
 * Find the intraday bar that took the higher-timeframe trigger and derive a
 * tighter stop from the structure around it.
 *
 * Returns `null` when there is nothing to refine — no intraday bars, or the
 * trigger simply has not broken inside its entry window yet. That is the
 * common case and not an error: most published signals expire without ever
 * triggering, and there is no entry to time.
 *
 * Uses only bars up to and including the one that triggered, so the refined
 * stop is knowable at the moment of entry rather than after the fact.
 */
export function refineEntry(
  plan: TradePlan,
  intraday: Candle[],
  options: Partial<RefinementOptions> = {},
  resolve: ResolveOptions = DEFAULT_RESOLVE_OPTIONS,
): RefinedEntry | null {
  const opts: RefinementOptions = { ...DEFAULT_REFINEMENT_OPTIONS, ...options };
  const bull = plan.direction === 'bullish';
  const { entry, stop: planStop, target1, target2 } = plan.levels;
  const originalRisk = Math.abs(entry - planStop);
  if (originalRisk <= 0) return null;

  const entryDeadline =
    plan.triggerBarEnd + resolve.entryWindowBars * TF_SECONDS[plan.timeframe];

  const bars = intraday
    .filter((b) => b.time >= plan.triggerBarEnd && b.time < entryDeadline)
    .sort((a, b) => a.time - b.time);

  const i = bars.findIndex((b) => (bull ? b.high >= entry : b.low <= entry));
  if (i < 0) return null; // trigger not taken inside the window — nothing to time

  const trigger = bars[i];

  // Structure across the last few bars, the trigger bar included.
  const from = Math.max(0, i - opts.pivotBars + 1);
  let pivot = bull ? Infinity : -Infinity;
  for (let j = from; j <= i; j++) {
    pivot = bull ? Math.min(pivot, bars[j].low) : Math.max(pivot, bars[j].high);
  }
  const source: StopSource = i > from ? 'intraday-pivot' : 'intraday-trigger-bar';

  const decline = (reason: string): RefinedEntry => ({
    entry,
    stop: planStop,
    stopSource: 'higher-timeframe',
    triggeredAt: trigger.time,
    risk: originalRisk,
    originalRisk,
    tightening: 1,
    rr1: rr(entry, planStop, target1, bull),
    rr2: rr(entry, planStop, target2, bull),
    originalRr1: rr(entry, planStop, target1, bull),
    declinedReason: reason,
  });

  // Rule 3: only ever tighten.
  const tighter = bull ? pivot > planStop : pivot < planStop;
  if (!tighter) {
    return decline('intraday structure sits wider than the higher-timeframe invalidation');
  }

  // Rule 4: refuse to be noise.
  const risk = Math.abs(entry - pivot);
  const pctFloor = (opts.minRiskPct / 100) * entry;
  const fractionFloor = opts.minRiskFraction * originalRisk;
  if (risk < pctFloor) {
    return decline(
      `refined risk ${risk.toFixed(4)} is under ${opts.minRiskPct}% of price — inside the noise`,
    );
  }
  if (risk < fractionFloor) {
    return decline(
      `refined risk is under ${Math.round(opts.minRiskFraction * 100)}% of the original — too tight to be structure`,
    );
  }

  return {
    entry,
    stop: round(pivot, entry),
    stopSource: source,
    triggeredAt: trigger.time,
    risk,
    originalRisk,
    tightening: originalRisk / risk,
    rr1: rr(entry, pivot, target1, bull),
    rr2: rr(entry, pivot, target2, bull),
    originalRr1: rr(entry, planStop, target1, bull),
  };
}

const round = (v: number, reference: number) => Number(v.toFixed(reference >= 1 ? 2 : 5));

function rr(entry: number, stop: number, target: number, bull: boolean): number {
  const risk = Math.abs(entry - stop);
  if (risk <= 0) return 0;
  const reward = bull ? target - entry : entry - target;
  return Number((reward / risk).toFixed(2));
}

/**
 * The same plan with the refined stop substituted, for resolution.
 *
 * The trigger and both targets are carried over untouched; only `stop`, `rr1`
 * and `rr2` change. Feeding this to the resolver alongside the original is what
 * makes the comparison apples-to-apples — identical signals, identical bars,
 * one difference.
 */
export function planWithRefinedStop(plan: TradePlan, refined: RefinedEntry): TradePlan {
  const levels: Levels = {
    ...plan.levels,
    stop: refined.stop,
    rr1: refined.rr1,
    rr2: refined.rr2,
  };
  return { ...plan, levels };
}

/* ── measuring whether it pays ─────────────────────────────────────────── */

/**
 * One signal resolved both ways against the same intraday bars.
 *
 * Both variants must come from the *same* population, expired signals
 * included. A comparison restricted to signals that triggered would drop
 * exactly the cases where the two policies agree, and inflate whatever
 * difference remains.
 */
export interface RefinementRow {
  baseline: GradedSignal;
  refined: GradedSignal;
  /** Null when the trigger never broke, so there was no entry to time. */
  entry: RefinedEntry | null;
}

export interface RefinementComparison {
  baseline: BucketStats;
  refined: BucketStats;
  byTimeframe: { label: string; baseline: BucketStats; refined: BucketStats }[];
  byPattern: { label: string; baseline: BucketStats; refined: BucketStats }[];
  /** Signals whose stop was genuinely tightened. */
  tightened: number;
  /** Triggered, but refinement declined and the daily stop stood. */
  declined: number;
  /** Never triggered — identical under both, by construction. */
  neverTriggered: number;
  declineReasons: { reason: string; count: number }[];
  /** Mean tightening factor across refined entries only. */
  meanTightening: number;
  meanRr1Before: number;
  meanRr1After: number;
  sample: number;
  firstDate?: string;
  lastDate?: string;
}

const meanOf = (xs: number[]) => (xs.length > 0 ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

function pairedGroups(
  rows: RefinementRow[],
  keyOf: (r: RefinementRow) => string,
): { label: string; baseline: BucketStats; refined: BucketStats }[] {
  const map = new Map<string, RefinementRow[]>();
  for (const r of rows) {
    const k = keyOf(r);
    const list = map.get(k);
    if (list) list.push(r);
    else map.set(k, [r]);
  }
  return [...map.keys()]
    .sort()
    .map((k) => {
      const group = map.get(k) as RefinementRow[];
      return {
        label: k,
        baseline: bucketStats(k, group.map((r) => r.baseline)),
        refined: bucketStats(k, group.map((r) => r.refined)),
      };
    })
    .sort((a, b) => b.baseline.n - a.baseline.n);
}

export function buildRefinementComparison(all: RefinementRow[]): RefinementComparison {
  // Only settled signals; an unresolved trade would bias whichever side
  // happens to resolve faster, and tighter stops resolve faster.
  const rows = all.filter(
    (r) =>
      r.baseline.status !== 'OPEN' &&
      r.baseline.status !== 'PENDING' &&
      r.refined.status !== 'OPEN' &&
      r.refined.status !== 'PENDING',
  );

  const refinedEntries = rows
    .map((r) => r.entry)
    .filter((e): e is RefinedEntry => e !== null && e.stopSource !== 'higher-timeframe');
  const declinedEntries = rows
    .map((r) => r.entry)
    .filter((e): e is RefinedEntry => e !== null && e.stopSource === 'higher-timeframe');

  const reasons = new Map<string, number>();
  for (const e of declinedEntries) {
    const reason = e.declinedReason ?? 'unspecified';
    reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
  }

  const dates = rows.map((r) => r.baseline.date).sort();

  return {
    baseline: bucketStats('Higher-timeframe stop', rows.map((r) => r.baseline)),
    refined: bucketStats('60m refined stop', rows.map((r) => r.refined)),
    byTimeframe: pairedGroups(rows, (r) => r.baseline.timeframe),
    byPattern: pairedGroups(rows, (r) => r.baseline.pattern),
    tightened: refinedEntries.length,
    declined: declinedEntries.length,
    neverTriggered: rows.filter((r) => r.entry === null).length,
    declineReasons: [...reasons.entries()]
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count),
    meanTightening: meanOf(refinedEntries.map((e) => e.tightening)),
    meanRr1Before: meanOf(refinedEntries.map((e) => e.originalRr1)),
    meanRr1After: meanOf(refinedEntries.map((e) => e.rr1)),
    sample: rows.length,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
  };
}

const p1 = (v: number) => `${(v * 100).toFixed(0)}%`;
const r2 = (v: number) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3));
const r2s = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

function mdTable(headers: string[], rows: string[][]): string {
  return [headers, headers.map(() => '---'), ...rows]
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');
}

/**
 * Below this the comparison is arithmetic, not evidence. The intraday window
 * is weeks long by provider limit, so this bar matters more here than
 * anywhere else in the repo.
 */
export const MIN_REFINEMENT_SAMPLE = 300;

export interface RefinementMeta {
  provenance: string;
  generatedAt: Date;
  days: number;
}

export function renderRefinementReport(
  c: RefinementComparison,
  meta: RefinementMeta,
): string {
  const lines: string[] = [];
  lines.push('# Entry Refinement — is a 60-minute stop worth it?');
  lines.push('');
  lines.push(
    `_Generated ${meta.generatedAt.toISOString().slice(0, 10)}_ · **${c.sample}** settled signals` +
      (c.firstDate ? ` from ${c.firstDate} to ${c.lastDate}` : '') +
      ` · ${meta.days} days of hourly history`,
  );
  lines.push('');
  lines.push(meta.provenance);
  lines.push('');

  if (c.sample === 0) {
    lines.push('No settled signals inside the intraday window — nothing to compare.');
    return lines.join('\n');
  }

  lines.push(
    '> ⚠️ **This is the shortest-horizon report in the repo, and it cannot be otherwise.** ' +
      'Both data providers cap hourly history at roughly 60 days, so this covers weeks and one ' +
      'market regime. It is enough to see whether tighter stops get whipsawed; it is nowhere ' +
      'near enough to claim an edge. Re-run it periodically and look for a consistent answer ' +
      'rather than acting on one run.',
  );
  lines.push('');
  if (c.sample < MIN_REFINEMENT_SAMPLE) {
    lines.push(
      `> ⚠️ **${c.sample} signals is below the ${MIN_REFINEMENT_SAMPLE} this comparison needs** ` +
        'to mean anything at all.',
    );
    lines.push('');
  }

  /* Headline */
  const b = c.baseline;
  const r = c.refined;
  const delta = r.avgRPerSignal - b.avgRPerSignal;
  const verdict =
    Math.abs(delta) < 0.01
      ? '**a wash** — the tighter stop buys exactly as much as it costs'
      : delta > 0
        ? '**the refined stop wins** — the better multiple more than pays for the extra stop-outs'
        : '**the refined stop loses** — the extra whipsaw costs more than the better multiple buys';

  lines.push('## The trade-off');
  lines.push('');
  lines.push(
    'A tighter stop buys a bigger R on the same objective and buys more stop-outs. Which wins is ' +
      'the only question here. Both columns are the same signals, on the same bars, entered at ' +
      'the same trigger — the stop is the single difference.',
  );
  lines.push('');
  lines.push(
    mdTable(
      ['', 'Signals', 'Trig%', 'Stopped', 'Obj%', 'Avg R', 'R/signal', 'Total R'],
      [b, r].map((s) => [
        s.label,
        String(s.n),
        p1(s.triggerRate),
        s.trades > 0 ? p1(s.losses / s.trades) : '—',
        s.trades > 0 ? p1(s.winRate) : '—',
        s.trades > 0 ? r2s(s.avgR) : '—',
        r2(s.avgRPerSignal),
        r2s(s.totalR),
      ]),
    ),
  );
  lines.push('');
  lines.push(`Difference: **${r2(delta)}R per signal** — ${verdict}.`);
  lines.push('');

  /* What refinement actually did */
  lines.push('## What refinement did');
  lines.push('');
  lines.push(
    `- **${c.tightened}** signals had their stop genuinely tightened, by a mean factor of ` +
      `**${c.meanTightening.toFixed(2)}×**.`,
  );
  lines.push(
    `- That moved the promised first objective from **${c.meanRr1Before.toFixed(2)}R** to ` +
      `**${c.meanRr1After.toFixed(2)}R** on those signals.`,
  );
  lines.push(
    `- **${c.declined}** triggered but were declined, so the higher-timeframe stop stood.`,
  );
  lines.push(
    `- **${c.neverTriggered}** never triggered at all — identical under both by construction, ` +
      'and kept in the sample so the two columns describe the same population.',
  );
  lines.push('');
  if (c.declineReasons.length > 0) {
    lines.push('Why refinement declined:');
    lines.push('');
    for (const { reason, count } of c.declineReasons) lines.push(`- ${count}× — ${reason}`);
    lines.push('');
  }

  /* Slices */
  const slice = (title: string, groups: RefinementComparison['byTimeframe'], note: string) => {
    lines.push(`## ${title}`);
    lines.push('');
    lines.push(note);
    lines.push('');
    lines.push(
      mdTable(
        ['', 'n', 'Base R/signal', 'Refined R/signal', 'Δ', 'Base Obj%', 'Refined Obj%'],
        groups.map((g) => [
          g.label,
          String(g.baseline.n),
          r2(g.baseline.avgRPerSignal),
          r2(g.refined.avgRPerSignal),
          r2(g.refined.avgRPerSignal - g.baseline.avgRPerSignal),
          g.baseline.trades > 0 ? p1(g.baseline.winRate) : '—',
          g.refined.trades > 0 ? p1(g.refined.winRate) : '—',
        ]),
      ),
    );
    lines.push('');
  };

  slice(
    'By timeframe',
    c.byTimeframe,
    'Refinement should help most where the higher-timeframe bar is widest — a monthly stop is a ' +
      'long way from a 60-minute one.',
  );
  slice('By pattern', c.byPattern, 'Compression setups already have tight risk and have the least to gain.');

  lines.push('---');
  lines.push('');
  lines.push(
    '_60m never selects: the setup, direction, trigger and both targets come from the higher ' +
      "timeframe untouched, and refinement only moves the stop. It only ever tightens — intraday " +
      'structure wider than the higher-timeframe invalidation is declined — and refuses stops ' +
      'inside the noise. Both variants are resolved on hourly bars, because a stop this tight is ' +
      'hit intraday and daily bars would systematically under-report the whipsaw that is the ' +
      "whole cost being measured._",
  );

  return lines.join('\n');
}
