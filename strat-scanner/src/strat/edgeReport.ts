import { ConfidenceFactorKey, Direction, Scenario, Timeframe, TIMEFRAMES } from './types';
import { isTrade, OutcomeStatus } from './outcomes';

/**
 * Edge reporting: what the record says about the engine.
 *
 * The scanner is a machine for making falsifiable claims. This turns a pile of
 * resolved claims into the handful of numbers that should decide which setups
 * are worth taking — and, in the calibration section, whether the confidence
 * model's hand-tuned weights are earned or imaginary.
 *
 * Every slice reports both **trigger rate** and **win rate**, because they
 * fail differently. A setup that triggers rarely but wins when it does is a
 * patience problem; one that always triggers and loses is a selection problem.
 * Collapsing them into a single "win rate" hides which of the two you have.
 */

/** One resolved signal, flattened to exactly what the report slices on. */
export interface GradedSignal {
  /**
   * Stable identity (see `trackKey`). The report never groups on it, but the
   * tracker does: a settled record must be recognisable when its actionable
   * bar keeps being re-detected — a monthly setup is re-emitted every day for
   * a month, and would otherwise be enrolled again the moment it resolved.
   */
  key: string;
  symbol: string;
  timeframe: Timeframe;
  direction: Direction;
  /** e.g. "2-1-2 Reversal" */
  pattern: string;
  sequence: string;
  scenario: Scenario;
  compression: boolean;
  isReversal: boolean;
  confidence: number;
  /** Which confidence terms fired for this signal. */
  factorKeys: ConfidenceFactorKey[];
  /** Aligned timeframe count at signal time. */
  aligned: number;
  /** Opposed timeframe count at signal time. */
  opposed: number;
  fullContinuity: boolean;
  /** The R the engine promised to target 1. */
  promisedR: number;
  status: OutcomeStatus;
  /** Realised R — present only once the signal became a trade and closed. */
  r?: number;
  mfeR?: number;
  maeR?: number;
  reachedTarget2?: boolean;
  /** Date the signal was published, ISO yyyy-mm-dd. */
  date: string;
}

export interface BucketStats {
  label: string;
  /** Signals in the bucket, including ones that never triggered. */
  n: number;
  trades: number;
  triggerRate: number;
  wins: number;
  losses: number;
  timeouts: number;
  /** Wins / trades. Undefined when nothing triggered. */
  winRate: number;
  /** Mean R across trades — expectancy per trade taken. */
  avgR: number;
  /**
   * Mean R across every signal published, counting never-triggered ones as
   * zero. This is the number that says what an alert is worth, since you
   * cannot choose to only receive the ones that trigger.
   */
  avgRPerSignal: number;
  totalR: number;
  avgMfeR: number;
  avgMaeR: number;
  /** Share of trades that ran on to extended magnitude. */
  t2Rate: number;
  /** Mean promised R to target 1, to compare against what was delivered. */
  avgPromisedR: number;
}

const pct = (num: number, den: number) => (den > 0 ? num / den : 0);
const mean = (xs: number[]) => (xs.length > 0 ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

export function bucketStats(label: string, signals: GradedSignal[]): BucketStats {
  const trades = signals.filter((s) => isTrade(s.status));
  const rs = trades.map((s) => s.r ?? 0);
  const wins = trades.filter((s) => s.status === 'TARGET1').length;
  const losses = trades.filter((s) => s.status === 'STOPPED').length;
  const timeouts = trades.filter((s) => s.status === 'TIMEOUT').length;
  const total = rs.reduce((a, b) => a + b, 0);

  return {
    label,
    n: signals.length,
    trades: trades.length,
    triggerRate: pct(trades.length, signals.length),
    wins,
    losses,
    timeouts,
    winRate: pct(wins, trades.length),
    avgR: mean(rs),
    avgRPerSignal: pct(total, signals.length),
    totalR: total,
    avgMfeR: mean(trades.map((s) => s.mfeR ?? 0)),
    avgMaeR: mean(trades.map((s) => s.maeR ?? 0)),
    t2Rate: pct(trades.filter((s) => s.reachedTarget2).length, trades.length),
    avgPromisedR: mean(signals.map((s) => s.promisedR)),
  };
}

/** Group into buckets, dropping empties and sorting by a caller-chosen order. */
function groupBy<K extends string | number>(
  signals: GradedSignal[],
  keyOf: (s: GradedSignal) => K,
  order?: K[],
): BucketStats[] {
  const map = new Map<K, GradedSignal[]>();
  for (const s of signals) {
    const k = keyOf(s);
    const list = map.get(k);
    if (list) list.push(s);
    else map.set(k, [s]);
  }
  const keys = order ? order.filter((k) => map.has(k)) : [...map.keys()].sort();
  return keys.map((k) => bucketStats(String(k), map.get(k) as GradedSignal[]));
}

/**
 * Confidence bands, aligned to the labels the app already shows: the model
 * calls 65+ "High" and under 45 "Low", so those are the boundaries that have
 * to hold up. The middle is split to see whether the gradient is real or
 * whether everything between the thresholds behaves identically.
 */
export const CONFIDENCE_BANDS: { label: string; min: number; max: number }[] = [
  { label: '< 45 (Low)', min: -Infinity, max: 45 },
  { label: '45–54', min: 45, max: 55 },
  { label: '55–64', min: 55, max: 65 },
  { label: '65–74 (High)', min: 65, max: 75 },
  { label: '75+ (High)', min: 75, max: Infinity },
];

const bandFor = (c: number) =>
  CONFIDENCE_BANDS.find((b) => c >= b.min && c < b.max)?.label ?? CONFIDENCE_BANDS[0].label;

/**
 * How a single confidence term performed when it fired versus when it did not.
 *
 * `lift` is the difference in mean R per signal. A term carrying real weight
 * should show a positive lift roughly in proportion to the points it awards;
 * one whose lift is flat or negative is costing the score its meaning, and the
 * points it hands out are noise dressed as conviction.
 */
export interface FactorLift {
  key: ConfidenceFactorKey;
  withN: number;
  withoutN: number;
  withAvgR: number;
  withoutAvgR: number;
  withWinRate: number;
  withoutWinRate: number;
  lift: number;
}

export function factorLifts(signals: GradedSignal[]): FactorLift[] {
  const keys = new Set<ConfidenceFactorKey>();
  for (const s of signals) for (const k of s.factorKeys) keys.add(k);

  return [...keys]
    .map((key) => {
      const withIt = signals.filter((s) => s.factorKeys.includes(key));
      const without = signals.filter((s) => !s.factorKeys.includes(key));
      const a = bucketStats(key, withIt);
      const b = bucketStats(key, without);
      return {
        key,
        withN: a.n,
        withoutN: b.n,
        withAvgR: a.avgRPerSignal,
        withoutAvgR: b.avgRPerSignal,
        withWinRate: a.winRate,
        withoutWinRate: b.winRate,
        lift: a.avgRPerSignal - b.avgRPerSignal,
      };
    })
    .sort((x, y) => y.lift - x.lift);
}

/**
 * Spearman rank correlation between confidence and realised R.
 *
 * Rank correlation rather than a hit-rate-vs-probability curve, because the
 * confidence score is not a probability and was never calibrated as one. The
 * only claim it actually makes is ordinal: a 70 should beat a 50. Rho near
 * zero means it does not, and the score is decoration.
 */
export function confidenceRankCorrelation(signals: GradedSignal[]): number {
  const trades = signals.filter((s) => isTrade(s.status));
  if (trades.length < 3) return 0;
  const xs = rank(trades.map((s) => s.confidence));
  const ys = rank(trades.map((s) => s.r ?? 0));
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den > 0 ? num / den : 0;
}

/** Ranks with ties averaged. */
function rank(values: number[]): number[] {
  const idx = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const out = new Array<number>(values.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].v === idx[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) out[idx[k].i] = avg;
    i = j + 1;
  }
  return out;
}

export interface EdgeReport {
  overall: BucketStats;
  byConfidence: BucketStats[];
  byPattern: BucketStats[];
  byTimeframe: BucketStats[];
  byContinuity: BucketStats[];
  byScenario: BucketStats[];
  byCompression: BucketStats[];
  bySymbol: BucketStats[];
  factors: FactorLift[];
  rankCorrelation: number;
  /** Signals still waiting on a resolution, excluded from every slice above. */
  openCount: number;
  pendingCount: number;
  firstDate?: string;
  lastDate?: string;
}

/** Continuity state at signal time, as a label. */
export const continuityBucket = (s: GradedSignal): string => {
  if (s.fullContinuity) return 'Full continuity';
  if (s.opposed === 0 && s.aligned > 0) return 'Aligned, not full';
  if (s.aligned > 0 && s.opposed > 0) return 'Mixed';
  if (s.opposed > 0) return 'Counter-continuity';
  return 'Flat / unknown';
};

const CONTINUITY_ORDER = [
  'Full continuity',
  'Aligned, not full',
  'Mixed',
  'Counter-continuity',
  'Flat / unknown',
];

/**
 * Build the report from every signal whose outcome is settled. OPEN and
 * PENDING signals are counted but excluded from the statistics: including
 * unresolved trades would bias every number toward whichever side happens to
 * resolve faster, and stops resolve faster than targets.
 */
export function buildEdgeReport(all: GradedSignal[]): EdgeReport {
  const settled = all.filter((s) => s.status !== 'OPEN' && s.status !== 'PENDING');
  const dates = settled.map((s) => s.date).sort();

  return {
    overall: bucketStats('All signals', settled),
    byConfidence: groupBy(
      settled,
      (s) => bandFor(s.confidence),
      CONFIDENCE_BANDS.map((b) => b.label),
    ),
    byPattern: groupBy(settled, (s) => s.pattern).sort((a, b) => b.n - a.n),
    byTimeframe: groupBy(settled, (s) => s.timeframe, [...TIMEFRAMES]),
    byContinuity: groupBy(settled, continuityBucket, CONTINUITY_ORDER),
    byScenario: groupBy(settled, (s) => (s.isReversal ? 'Reversal' : 'Continuation')),
    byCompression: groupBy(settled, (s) =>
      s.compression ? 'Inside-bar compression (X-1-?)' : 'Directional trigger bar',
    ),
    bySymbol: groupBy(settled, (s) => s.symbol).sort((a, b) => b.avgRPerSignal - a.avgRPerSignal),
    factors: factorLifts(settled),
    rankCorrelation: confidenceRankCorrelation(settled),
    openCount: all.filter((s) => s.status === 'OPEN').length,
    pendingCount: all.filter((s) => s.status === 'PENDING').length,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const p1 = (v: number) => `${(v * 100).toFixed(0)}%`;
const r2 = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));

function table(headers: string[], rows: string[][]): string {
  const sep = headers.map(() => '---');
  return [headers, sep, ...rows].map((r) => `| ${r.join(' | ')} |`).join('\n');
}

const STAT_HEADERS = ['', 'n', 'Trig%', 'Trades', 'Win%', 'Avg R', 'R/signal', 'Total R'];

const statRow = (b: BucketStats): string[] => [
  b.label,
  String(b.n),
  p1(b.triggerRate),
  String(b.trades),
  b.trades > 0 ? p1(b.winRate) : '—',
  b.trades > 0 ? r2(b.avgR) : '—',
  r2(b.avgRPerSignal),
  r2(b.totalR),
];

const statTable = (buckets: BucketStats[]) => table(STAT_HEADERS, buckets.map(statRow));

/** Enough of a sample to say anything at all. Below this, report but caveat. */
export const MIN_SAMPLE = 20;

export interface ReportMeta {
  title: string;
  /** One paragraph on where the sample came from and what it excludes. */
  provenance: string;
  generatedAt: Date;
}

export function renderEdgeReport(report: EdgeReport, meta: ReportMeta): string {
  const o = report.overall;
  const lines: string[] = [];

  lines.push(`# ${meta.title}`);
  lines.push('');
  lines.push(
    `_Generated ${meta.generatedAt.toISOString().slice(0, 10)}_ · ` +
      `**${o.n}** settled signals` +
      (report.firstDate ? ` from ${report.firstDate} to ${report.lastDate}` : '') +
      (report.openCount + report.pendingCount > 0
        ? ` · ${report.openCount} open, ${report.pendingCount} pending (excluded)`
        : ''),
  );
  lines.push('');
  lines.push(meta.provenance);
  lines.push('');

  if (o.n === 0) {
    lines.push('No settled signals yet — nothing to measure. Check back once the record fills up.');
    return lines.join('\n');
  }

  if (o.n < MIN_SAMPLE) {
    lines.push(
      `> ⚠️ **${o.n} settled signals is not a sample.** Everything below is arithmetic, ` +
        `not evidence. Treat it as a smoke test that the plumbing works and wait for the ` +
        `record to fill up before changing how you trade.`,
    );
    lines.push('');
  }

  /* Headline */
  lines.push('## Headline');
  lines.push('');
  lines.push(
    `- **${p1(o.triggerRate)}** of published signals actually triggered ` +
      `(${o.trades} of ${o.n}) — the rest expired unfilled.`,
  );
  lines.push(
    `- Of those trades, **${p1(o.winRate)}** reached target 1, ` +
      `${p1(pct(o.losses, o.trades))} stopped out, ` +
      `${p1(pct(o.timeouts, o.trades))} timed out.`,
  );
  lines.push(`- **Expectancy ${r2(o.avgR)}R per trade taken**, ${r2(o.avgRPerSignal)}R per signal published.`);
  lines.push(
    `- Promised **${o.avgPromisedR.toFixed(2)}R** to target 1 on average; delivered ` +
      `**${r2(o.avgR)}R**.`,
  );
  lines.push(
    `- Trades ran **${o.avgMfeR.toFixed(2)}R** in favour at best and **${o.avgMaeR.toFixed(2)}R** against at worst; ` +
      `**${p1(o.t2Rate)}** went on to extended magnitude.`,
  );
  lines.push('');

  /* Calibration — the section that decides whether the score means anything */
  lines.push('## Does confidence mean anything?');
  lines.push('');
  lines.push(
    'The score is ordinal, not a probability — the only claim it makes is that a higher ' +
      'number is a better signal. So the test is whether the columns below go **up** as you ' +
      'read down.',
  );
  lines.push('');
  lines.push(statTable(report.byConfidence));
  lines.push('');

  const rho = report.rankCorrelation;
  const verdict =
    Math.abs(rho) < 0.05
      ? '**no relationship** — confidence is currently decoration; the score is not ranking anything'
      : rho < 0
        ? '**inverted** — higher-confidence signals are performing *worse*, which is worse than useless'
        : rho < 0.15
          ? '**weak but positive** — the ordering is real yet slight'
          : '**holding up** — the score genuinely ranks signals';
  lines.push(
    `Spearman rank correlation between confidence and realised R: **${rho.toFixed(3)}** — ${verdict}.`,
  );
  lines.push('');

  /* Factor lift */
  lines.push('## Which confidence terms are earning their weight?');
  lines.push('');
  lines.push(
    'Mean R per signal when a term fired versus when it did not. A term should lift results ' +
      'roughly in proportion to the points it awards. Flat or negative lift means the points ' +
      'are noise, and every score containing that term is wrong by that many points.',
  );
  lines.push('');
  lines.push(
    table(
      ['Factor', 'Fired (n)', 'R/signal', 'Did not (n)', 'R/signal', 'Lift', 'Win% w/ vs w/o'],
      report.factors.map((f) => [
        `\`${f.key}\``,
        String(f.withN),
        r2(f.withAvgR),
        String(f.withoutN),
        r2(f.withoutAvgR),
        r2(f.lift),
        `${p1(f.withWinRate)} vs ${p1(f.withoutWinRate)}`,
      ]),
    ),
  );
  lines.push('');

  /* Slices */
  const section = (title: string, buckets: BucketStats[], note?: string) => {
    lines.push(`## ${title}`);
    lines.push('');
    if (note) {
      lines.push(note);
      lines.push('');
    }
    lines.push(statTable(buckets));
    lines.push('');
  };

  section('By pattern', report.byPattern, 'Which setups to keep taking, and which to stop.');
  section('By timeframe', report.byTimeframe);
  section(
    'By timeframe continuity',
    report.byContinuity,
    'FTFC is the single heaviest term in the model (24 points). This is where it is settled.',
  );
  section('Reversal vs continuation', report.byScenario);
  section('Compression vs directional trigger', report.byCompression);
  section('By symbol', report.bySymbol, 'Ordered by R per signal. Thin samples — read as a hint, not a verdict.');

  lines.push('---');
  lines.push('');
  lines.push(
    '_Exit policy: every trade is closed at target 1, filled at the level (or at the open on ' +
      'a gap). A bar containing both the stop and the target is scored as a stop, since OHLC ' +
      'cannot order the two. Costs and slippage beyond gap fills are not modelled, so real ' +
      'results are somewhat worse than these._',
  );
  return lines.join('\n');
}

/** Two lines for a push notification — the report's headline, nothing else. */
export function edgeDigest(report: EdgeReport): string {
  const o = report.overall;
  if (o.n === 0) return 'No settled signals yet — the record is still filling up.';
  return (
    `${o.n} settled signals · ${p1(o.triggerRate)} triggered · ${p1(o.winRate)} hit T1\n` +
    `Expectancy ${r2(o.avgR)}R per trade, ${r2(o.avgRPerSignal)}R per signal · ` +
    `confidence rho ${report.rankCorrelation.toFixed(2)}`
  );
}
