import { BucketStats, bucketStats, GradedSignal } from './edgeReport';
import { DEFAULT_RESOLVE_OPTIONS, ExitPolicy, ResolveOptions } from './outcomes';
import { RegimeCalendar, trendAt, volAt } from './regime';

/**
 * Policy sweep and walk-forward validation.
 *
 * The calibration report answers "does the confidence score rank signals". This
 * answers the other half: **given the signals, is the way they are traded any
 * good?** The live record closes every trade at target 1 with a one-bar entry
 * window and a six-bar hold. Each of those three was a judgement call, and none
 * has ever been compared against the alternatives on the same data.
 *
 * A sweep is also the easiest way to fool yourself ever invented. Try thirty
 * policies on ten years and the best one will look excellent whether or not
 * anything real is there, because you picked the maximum of thirty noisy
 * numbers. Everything below is built around that:
 *
 *  - The grid is **two-stage**, not a full cross-product — exits are compared
 *    at the default window and hold, then the window and hold are compared at
 *    the winning exit. Twelve-ish policies rather than forty, so there is less
 *    noise to pick a maximum out of.
 *  - The winner is chosen **in-sample and reported out-of-sample**. The
 *    headline number is not "the best policy scored X"; it is "the policy that
 *    looked best on the first 70% scored Y on the last 30%, ranking Nth".
 *  - The **rank correlation between in-sample and out-of-sample ordering** is
 *    reported. If policies that led early do not lead later, the entire sweep
 *    is noise and the report says so rather than crowning a winner.
 */

export interface PolicySpec {
  id: string;
  label: string;
  /** Which stage of the two-stage grid this belongs to. */
  stage: 'exit' | 'timing';
  resolve: ResolveOptions;
}

const exitLabel = (e: ExitPolicy): string => {
  switch (e.kind) {
    case 'target1':
      return 'Exit at T1';
    case 'target2':
      return 'Hold for T2';
    case 'rMultiple':
      return `Fixed ${e.r}R target`;
    case 'trail':
      return `Trail ${e.barsBack}-bar low`;
    case 'scale':
      return `Scale ${Math.round(e.fraction * 100)}% at T1${e.breakeven ? ', BE stop' : ''}`;
  }
};

const exitId = (e: ExitPolicy): string => {
  switch (e.kind) {
    case 'target1':
      return 't1';
    case 'target2':
      return 't2';
    case 'rMultiple':
      return `r${e.r}`;
    case 'trail':
      return `trail${e.barsBack}`;
    case 'scale':
      return `scale${Math.round(e.fraction * 100)}${e.breakeven ? 'be' : ''}`;
  }
};

const spec = (stage: PolicySpec['stage'], resolve: ResolveOptions): PolicySpec => ({
  id: `${exitId(resolve.exit)}|w${resolve.entryWindowBars}|h${resolve.maxHoldBars}`,
  label: `${exitLabel(resolve.exit)} · window ${resolve.entryWindowBars} · hold ${resolve.maxHoldBars}`,
  stage,
  resolve,
});

/**
 * The exits worth arguing about.
 *
 * `rMultiple` is the control, not a candidate: if a naive fixed-R target
 * matches the pivot-based ones, the magnitude logic in `computeLevels` is not
 * earning its complexity and that is worth knowing on its own.
 */
export const CANDIDATE_EXITS: ExitPolicy[] = [
  { kind: 'target1' },
  { kind: 'target2' },
  { kind: 'rMultiple', r: 1 },
  { kind: 'rMultiple', r: 2 },
  { kind: 'trail', barsBack: 2 },
  { kind: 'trail', barsBack: 4 },
  { kind: 'scale', fraction: 0.5, breakeven: true },
  { kind: 'scale', fraction: 0.5, breakeven: false },
];

export const CANDIDATE_WINDOWS = [1, 2];
export const CANDIDATE_HOLDS = [3, 6, 12];

/** Stage one: every exit, at the current timing settings. */
export function exitStage(base: ResolveOptions = DEFAULT_RESOLVE_OPTIONS): PolicySpec[] {
  return CANDIDATE_EXITS.map((exit) => spec('exit', { ...base, exit }));
}

/** Stage two: every window/hold combination, at the winning exit. */
export function timingStage(exit: ExitPolicy): PolicySpec[] {
  const out: PolicySpec[] = [];
  for (const entryWindowBars of CANDIDATE_WINDOWS) {
    for (const maxHoldBars of CANDIDATE_HOLDS) {
      out.push(spec('timing', { entryWindowBars, maxHoldBars, exit }));
    }
  }
  return out;
}

export interface PolicyResult {
  spec: PolicySpec;
  stats: BucketStats;
}

/** Rank by expectancy per signal published — the number an alert is worth. */
export const rankPolicies = (results: PolicyResult[]): PolicyResult[] =>
  [...results].sort((a, b) => b.stats.avgRPerSignal - a.stats.avgRPerSignal);

/**
 * Split settled signals into an in-sample and an out-of-sample period by date.
 *
 * A chronological split, never a random one: shuffling rows would put the same
 * week on both sides of the fence and leak the answer, since signals in one
 * week share the same market.
 */
export function splitByDate(
  signals: GradedSignal[],
  fraction = 0.7,
): { cutoff: string; inSample: GradedSignal[]; outOfSample: GradedSignal[] } {
  const dates = [...new Set(signals.map((s) => s.date))].sort();
  if (dates.length < 2) {
    return { cutoff: dates[0] ?? '', inSample: signals, outOfSample: [] };
  }
  const cutoff = dates[Math.max(0, Math.min(dates.length - 1, Math.floor(dates.length * fraction)))];
  return {
    cutoff,
    inSample: signals.filter((s) => s.date < cutoff),
    outOfSample: signals.filter((s) => s.date >= cutoff),
  };
}

/** Spearman rank correlation between two orderings of the same policy ids. */
export function orderingAgreement(a: PolicyResult[], b: PolicyResult[]): number {
  const rankOf = (rs: PolicyResult[]) => {
    const m = new Map<string, number>();
    rankPolicies(rs).forEach((r, i) => m.set(r.spec.id, i + 1));
    return m;
  };
  const ra = rankOf(a);
  const rb = rankOf(b);
  const ids = [...ra.keys()].filter((id) => rb.has(id));
  if (ids.length < 3) return 0;

  const xs = ids.map((id) => ra.get(id) as number);
  const ys = ids.map((id) => rb.get(id) as number);
  const mean = (v: number[]) => v.reduce((p, q) => p + q, 0) / v.length;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < ids.length; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    dx += (xs[i] - mx) ** 2;
    dy += (ys[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den > 0 ? num / den : 0;
}

export interface WalkForward {
  cutoff: string;
  /** Policy that led on the in-sample period. */
  chosen: PolicySpec;
  inSampleRank: number;
  inSampleStats: BucketStats;
  /** How that same policy actually did afterwards. */
  outOfSampleStats: BucketStats;
  outOfSampleRank: number;
  policyCount: number;
  /** Best out-of-sample expectancy anyone achieved, for context. */
  bestOutOfSample: PolicyResult;
  /** Baseline (the live policy) measured out-of-sample. */
  baselineOutOfSample?: PolicyResult;
  agreement: number;
  inSampleSize: number;
  outOfSampleSize: number;
}

export interface SweepReport {
  /** Every policy over the full sample, best first. */
  ranked: PolicyResult[];
  /** The live policy — exit at T1, window 1, hold 6. */
  baseline?: PolicyResult;
  walkForward?: WalkForward;
  byYear: { policy: string; buckets: BucketStats[] }[];
  byTrendRegime: { policy: string; buckets: BucketStats[] }[];
  byVolRegime: { policy: string; buckets: BucketStats[] }[];
  settled: number;
  firstDate?: string;
  lastDate?: string;
}

export const BASELINE_ID = 't1|w1|h6';

const settledOnly = (rows: GradedSignal[]) =>
  rows.filter((s) => s.status !== 'OPEN' && s.status !== 'PENDING');

function groupStats(
  rows: GradedSignal[],
  keyOf: (s: GradedSignal) => string,
  order?: string[],
): BucketStats[] {
  const map = new Map<string, GradedSignal[]>();
  for (const r of rows) {
    const k = keyOf(r);
    const list = map.get(k);
    if (list) list.push(r);
    else map.set(k, [r]);
  }
  const keys = order ? order.filter((k) => map.has(k)) : [...map.keys()].sort();
  return keys.map((k) => bucketStats(k, map.get(k) as GradedSignal[]));
}

/**
 * Assemble the report from each policy's graded rows.
 *
 * `graded` maps policy id → the same signals resolved under that policy. The
 * caller produces it by replaying detection once and re-resolving, so every
 * policy is compared on an identical population; a policy that changed which
 * signals existed would not be comparable at all.
 */
export function buildSweepReport(
  policies: PolicySpec[],
  graded: Map<string, GradedSignal[]>,
  regimes?: RegimeCalendar,
  walkForwardFraction = 0.7,
): SweepReport {
  const results: PolicyResult[] = policies
    .filter((p) => graded.has(p.id))
    .map((p) => ({
      spec: p,
      stats: bucketStats(p.label, settledOnly(graded.get(p.id) as GradedSignal[])),
    }));

  const ranked = rankPolicies(results);
  const baseline = results.find((r) => r.spec.id === BASELINE_ID);
  const anyRows = settledOnly(graded.get(policies[0]?.id) ?? []);
  const dates = anyRows.map((s) => s.date).sort();

  /* Walk-forward: choose in-sample, report out-of-sample. */
  let walkForward: WalkForward | undefined;
  const split = splitByDate(anyRows, walkForwardFraction);
  if (split.outOfSample.length > 0 && results.length >= 2) {
    const statsFor = (rows: GradedSignal[]) =>
      results.map((r) => {
        const own = graded.get(r.spec.id) as GradedSignal[];
        const settled = settledOnly(own);
        const inWindow = new Set(rows.map((s) => s.key));
        return {
          spec: r.spec,
          stats: bucketStats(r.spec.label, settled.filter((s) => inWindow.has(s.key))),
        };
      });

    const isResults = statsFor(split.inSample);
    const oosResults = statsFor(split.outOfSample);
    const isRanked = rankPolicies(isResults);
    const oosRanked = rankPolicies(oosResults);
    const chosen = isRanked[0];
    const oosIndex = oosRanked.findIndex((r) => r.spec.id === chosen.spec.id);

    walkForward = {
      cutoff: split.cutoff,
      chosen: chosen.spec,
      inSampleRank: 1,
      inSampleStats: chosen.stats,
      outOfSampleStats: oosRanked[oosIndex].stats,
      outOfSampleRank: oosIndex + 1,
      policyCount: results.length,
      bestOutOfSample: oosRanked[0],
      baselineOutOfSample: oosResults.find((r) => r.spec.id === BASELINE_ID),
      agreement: orderingAgreement(isResults, oosResults),
      inSampleSize: split.inSample.length,
      outOfSampleSize: split.outOfSample.length,
    };
  }

  /* Stability slices, for the baseline and the overall winner. */
  const sliceFor = (
    keyOf: (s: GradedSignal) => string,
    order?: string[],
  ): { policy: string; buckets: BucketStats[] }[] => {
    const of: PolicyResult[] = [];
    if (baseline) of.push(baseline);
    if (ranked[0] && ranked[0].spec.id !== baseline?.spec.id) of.push(ranked[0]);
    return of.map((r) => ({
      policy: r.spec.label,
      buckets: groupStats(settledOnly(graded.get(r.spec.id) as GradedSignal[]), keyOf, order),
    }));
  };

  return {
    ranked,
    baseline,
    walkForward,
    byYear: sliceFor((s) => s.date.slice(0, 4)),
    byTrendRegime: regimes
      ? sliceFor((s) => trendAt(regimes, s.date), [
          'Risk-on (above 200DMA)',
          'Risk-off (below 200DMA)',
          'Unknown',
        ])
      : [],
    byVolRegime: regimes
      ? sliceFor((s) => volAt(regimes, s.date), [
          'Low vol (<12%)',
          'Normal vol (12–20%)',
          'High vol (>20%)',
          'Unknown',
        ])
      : [],
    settled: anyRows.length,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const p1 = (v: number) => `${(v * 100).toFixed(0)}%`;
const r2 = (v: number) => (v >= 0 ? `+${v.toFixed(3)}` : v.toFixed(3));
const r2s = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

function table(headers: string[], rows: string[][]): string {
  return [headers, headers.map(() => '---'), ...rows]
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');
}

/** Below this, a policy comparison is arithmetic rather than evidence. */
export const MIN_SWEEP_SAMPLE = 200;

export interface SweepMeta {
  provenance: string;
  generatedAt: Date;
}

export function renderSweepReport(report: SweepReport, meta: SweepMeta): string {
  const lines: string[] = [];
  lines.push('# Policy Sweep — how the signals are traded');
  lines.push('');
  lines.push(
    `_Generated ${meta.generatedAt.toISOString().slice(0, 10)}_ · **${report.settled}** settled ` +
      `signals` +
      (report.firstDate ? ` from ${report.firstDate} to ${report.lastDate}` : '') +
      ` · ${report.ranked.length} policies compared`,
  );
  lines.push('');
  lines.push(meta.provenance);
  lines.push('');

  if (report.ranked.length === 0 || report.settled === 0) {
    lines.push('No settled signals — nothing to compare.');
    return lines.join('\n');
  }

  if (report.settled < MIN_SWEEP_SAMPLE) {
    lines.push(
      `> ⚠️ **${report.settled} settled signals is far too small to choose a policy from.** ` +
        'Comparing dozens of policies on a sample this size finds the luckiest one, not the ' +
        'best one. Treat everything below as a check that the plumbing works.',
    );
    lines.push('');
  }

  /* The headline: walk-forward, before any leaderboard. */
  const wf = report.walkForward;
  lines.push('## Does the best policy stay best?');
  lines.push('');
  if (!wf) {
    lines.push('_Not enough history to split into an in-sample and an out-of-sample period._');
  } else {
    const verdict =
      wf.agreement < 0.1
        ? '**the ordering does not survive** — policies that led early do not lead later, so this ' +
          'sweep is measuring noise and no policy below should be adopted'
        : wf.agreement < 0.4
          ? '**the ordering is weakly stable** — there is some signal, but not enough to justify a ' +
            'large change'
          : '**the ordering holds up** — policies that led early tend to lead later';

    lines.push(
      `Policies were ranked on signals before **${wf.cutoff}** (${wf.inSampleSize} signals) and ` +
        `then checked on everything after (${wf.outOfSampleSize}). This is the only number here ` +
        'that is not curve-fitted.',
    );
    lines.push('');
    lines.push(`- **Chosen in-sample:** ${wf.chosen.label}`);
    lines.push(
      `- **Out-of-sample it ranked ${wf.outOfSampleRank} of ${wf.policyCount}**, ` +
        `at ${r2(wf.outOfSampleStats.avgRPerSignal)}R per signal ` +
        `(in-sample it showed ${r2(wf.inSampleStats.avgRPerSignal)}R).`,
    );
    lines.push(
      `- Best out-of-sample was **${wf.bestOutOfSample.spec.label}** at ` +
        `${r2(wf.bestOutOfSample.stats.avgRPerSignal)}R — a policy you could not have known to pick.`,
    );
    if (wf.baselineOutOfSample) {
      const delta =
        wf.outOfSampleStats.avgRPerSignal - wf.baselineOutOfSample.stats.avgRPerSignal;
      lines.push(
        `- The **current live policy** scored ${r2(wf.baselineOutOfSample.stats.avgRPerSignal)}R ` +
          `out-of-sample, so switching would have been worth ${r2(delta)}R per signal.`,
      );
    }
    lines.push('');
    lines.push(
      `Rank agreement between the two periods: **${wf.agreement.toFixed(3)}** — ${verdict}.`,
    );
  }
  lines.push('');

  /* Leaderboard */
  lines.push('## Policy leaderboard (full sample)');
  lines.push('');
  lines.push(
    'Ranked by R per signal published, not per trade taken — you cannot choose to only receive ' +
      'the signals that trigger. **Profit%** is the share of trades that came off green however ' +
      'they came off; **Obj%** is the share that reached the profit objective, which a trailing ' +
      'stop never does by construction.',
  );
  lines.push('');
  lines.push(
    table(
      ['#', 'Policy', 'Trades', 'Trig%', 'Profit%', 'Obj%', 'Avg R', 'R/signal', 'Total R'],
      report.ranked.map((r, i) => [
        r.spec.id === BASELINE_ID ? `${i + 1} ⬅︎` : String(i + 1),
        r.spec.id === BASELINE_ID ? `**${r.spec.label}** _(live)_` : r.spec.label,
        String(r.stats.trades),
        p1(r.stats.triggerRate),
        p1(r.stats.profitRate),
        p1(r.stats.winRate),
        r2s(r.stats.avgR),
        r2(r.stats.avgRPerSignal),
        r2s(r.stats.totalR),
      ]),
    ),
  );
  lines.push('');

  /* Stability */
  const slice = (title: string, note: string, groups: SweepReport['byYear']) => {
    if (groups.length === 0) return;
    lines.push(`## ${title}`);
    lines.push('');
    lines.push(note);
    lines.push('');
    for (const g of groups) {
      lines.push(`**${g.policy}**`);
      lines.push('');
      lines.push(
        table(
          ['', 'n', 'Trades', 'Profit%', 'Avg R', 'R/signal'],
          g.buckets.map((b) => [
            b.label,
            String(b.n),
            String(b.trades),
            b.trades > 0 ? p1(b.profitRate) : '—',
            b.trades > 0 ? r2s(b.avgR) : '—',
            r2(b.avgRPerSignal),
          ]),
        ),
      );
      lines.push('');
    }
  };

  slice(
    'Year by year',
    'A single ten-year expectancy hides whether the edge was there throughout or came from one ' +
      'good year. If one row carries the total, there is no edge — there was an episode.',
    report.byYear,
  );
  slice(
    'By market trend',
    'Benchmark above or below its 200-day average on the day the signal published.',
    report.byTrendRegime,
  );
  slice(
    'By volatility',
    'Annualised 20-day realised volatility of the benchmark, in fixed bands — no sample ' +
      'quantiles, which would label each day using volatility that had not happened yet.',
    report.byVolRegime,
  );

  lines.push('---');
  lines.push('');
  lines.push(
    '_Every policy is measured on an identical population of signals: detection and scoring run ' +
      'once and only the resolution is repeated, so a difference in the table is a difference in ' +
      'the exit, never in which setups existed. R is always measured against the plan\'s original ' +
      'stop, so trailing and breakeven policies cannot flatter themselves by shrinking the ' +
      'denominator. Costs and slippage beyond gap fills are not modelled._',
  );

  return lines.join('\n');
}
