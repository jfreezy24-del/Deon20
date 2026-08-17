/**
 * Policy sweep + walk-forward validation.
 *
 * The calibration job asks whether the confidence score ranks signals. This
 * asks the other half: given those signals, is the way they are traded any
 * good? The live record closes at target 1 with a one-bar entry window and a
 * six-bar hold — three judgement calls, never compared against the
 * alternatives on the same data.
 *
 * Detection runs once per symbol; each policy only re-resolves the same
 * signals, so every policy is compared on an identical population and a
 * difference in the table is a difference in the exit rather than in which
 * setups existed.
 *
 * The grid is two-stage on purpose. Trying every combination would be forty-odd
 * policies, and the best of forty noisy numbers looks excellent whether or not
 * anything real is there. Exits are compared first at the live timing, then the
 * entry window and hold are compared at the winning exit.
 *
 * It sends nothing, ever — no ntfy, no anything. A sweep is a report to read
 * carefully and argue with, and the moment it becomes a notification it becomes
 * a thing you skim and act on.
 *
 * Usage:  npx tsx server/sweep.ts
 *
 * Environment:
 *   SWEEP_YEARS        years of daily history to replay            (default 10)
 *   SWEEP_SYMBOLS      comma list overriding the universe
 *   SWEEP_TIMEFRAMES   comma list of timeframes                (default D,W,M)
 *   SWEEP_MIN_CONFIDENCE  confidence floor for the sample          (default 50)
 *   SWEEP_IS_FRACTION  share of dates used to choose the winner   (default 0.7)
 *   REGIME_BENCHMARK   symbol the regime labels come from        (default SPY)
 *   DRY_RUN            'true' to print the report and write nothing
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fetchDailyHistory } from '../src/data/history';
import {
  DEFAULT_BACKTEST_OPTIONS,
  gradeReplay,
  Replay,
  replaySymbol,
} from '../src/strat/backtest';
import { GradedSignal } from '../src/strat/edgeReport';
import { DEFAULT_RESOLVE_OPTIONS } from '../src/strat/outcomes';
import {
  buildSweepReport,
  exitStage,
  PolicySpec,
  rankPolicies,
  renderSweepReport,
  timingStage,
} from '../src/strat/policySweep';
import { buildRegimeCalendar, RegimeCalendar } from '../src/strat/regime';
import { bucketStats } from '../src/strat/edgeReport';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { Timeframe, TIMEFRAMES } from '../src/strat/types';
import { loadSymbolList } from './watchlist-file';

const WATCHLIST_FILE = path.join(__dirname, 'watchlist.json');
const SWEEP_FILE = path.join(__dirname, '..', 'data', 'policy-sweep.md');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

function symbols(): string[] {
  const override = process.env.SWEEP_SYMBOLS?.trim();
  if (override) {
    const list: string[] = override
      .split(',')
      .map((s: string) => s.trim().toUpperCase())
      .filter((s: string) => s.length > 0);
    return [...new Set<string>(list)];
  }
  const watchlist = loadSymbolList(WATCHLIST_FILE, DEFAULT_WATCHLIST);
  return [...new Set([...watchlist, ...ALGO_UNIVERSE])];
}

function parseTimeframes(raw: string | undefined): Timeframe[] {
  if (!raw?.trim()) return DEFAULT_BACKTEST_OPTIONS.timeframes;
  const tfs = raw
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter((t): t is Timeframe => (TIMEFRAMES as string[]).includes(t) && t !== '4H');
  return tfs.length > 0 ? tfs : DEFAULT_BACKTEST_OPTIONS.timeframes;
}

/** Resolve every replay under one policy and concatenate the rows. */
const gradeAll = (replays: Replay[], spec: PolicySpec): GradedSignal[] =>
  replays.flatMap((r) => gradeReplay(r, spec.resolve));

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const years = Number(process.env.SWEEP_YEARS ?? 10);
  const timeframes = parseTimeframes(process.env.SWEEP_TIMEFRAMES);
  const isFraction = Number(process.env.SWEEP_IS_FRACTION ?? 0.7);
  const benchmark = process.env.REGIME_BENCHMARK?.trim() || 'SPY';
  const minConfidence = Number(process.env.SWEEP_MIN_CONFIDENCE ?? 50);

  const universe = symbols();
  console.log(
    `Sweep: ${universe.length} symbols over ${years}y (${timeframes.join('/')}, ` +
      `confidence ≥ ${minConfidence}).`,
  );

  /* ── 1. Replay detection once per symbol ──────────────────────────────── */

  const replays: Replay[] = [];
  const failures: string[] = [];
  let benchmarkBars: RegimeCalendar | undefined;

  // Sequential, like the calibration job: a rare long job hammering a free data
  // source with parallel decade-long requests is how it starts returning 429s
  // to the scheduled alerters that actually matter.
  for (const symbol of universe) {
    try {
      const history = await fetchDailyHistory(symbol, years);
      if (history.candles.length < 200) {
        failures.push(`${symbol}: only ${history.candles.length} daily bars`);
        continue;
      }
      if (symbol === benchmark) {
        benchmarkBars = buildRegimeCalendar(benchmark, history.candles);
      }
      const replay = replaySymbol(symbol, history.candles, {
        timeframes,
        minConfidence,
        // Resolution options do not affect detection; the sweep supplies its
        // own per policy.
        resolve: DEFAULT_RESOLVE_OPTIONS,
      });
      replays.push(replay);
      console.log(
        `  ${symbol}: ${history.candles.length} bars via ${history.provider}` +
          ` → ${replay.signals.length} signals`,
      );
    } catch (e) {
      failures.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
      console.warn(`  WARN ${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  }

  const total = replays.reduce((a, r) => a + r.signals.length, 0);
  if (total === 0) {
    throw new Error('No signals replayed — every symbol failed to fetch history.');
  }
  console.log(`${total} signals detected once; now resolving under each policy.`);

  // The benchmark is only needed for regime labels. Fetch it separately if it
  // was not already in the universe — a missing benchmark costs the regime
  // tables, not the run.
  if (!benchmarkBars) {
    try {
      const bench = await fetchDailyHistory(benchmark, years);
      benchmarkBars = buildRegimeCalendar(benchmark, bench.candles);
      console.log(`Regime labels from ${benchmark} (${bench.candles.length} bars).`);
    } catch (e) {
      console.warn(
        `  WARN regime benchmark ${benchmark} unavailable (${e instanceof Error ? e.message : e}) ` +
          '— the report will omit the regime tables.',
      );
    }
  }

  /* ── 2. Stage one: compare exits at the live timing ───────────────────── */

  const graded = new Map<string, GradedSignal[]>();
  const stageOne = exitStage(DEFAULT_RESOLVE_OPTIONS);
  for (const spec of stageOne) {
    const rows = gradeAll(replays, spec);
    graded.set(spec.id, rows);
    const stats = bucketStats(spec.label, rows.filter((s) => s.status !== 'OPEN' && s.status !== 'PENDING'));
    console.log(`  ${spec.label}: ${stats.avgRPerSignal.toFixed(3)}R per signal`);
  }

  const bestExit = rankPolicies(
    stageOne.map((spec) => ({
      spec,
      stats: bucketStats(
        spec.label,
        (graded.get(spec.id) as GradedSignal[]).filter(
          (s) => s.status !== 'OPEN' && s.status !== 'PENDING',
        ),
      ),
    })),
  )[0];
  console.log(`Best exit: ${bestExit.spec.label}.`);

  /* ── 3. Stage two: compare timing at the winning exit ─────────────────── */

  const stageTwo = timingStage(bestExit.spec.resolve.exit).filter((s) => !graded.has(s.id));
  for (const spec of stageTwo) {
    graded.set(spec.id, gradeAll(replays, spec));
    console.log(`  ${spec.label}`);
  }

  /* ── 4. Report ────────────────────────────────────────────────────────── */

  const policies = [...stageOne, ...stageTwo];
  const report = buildSweepReport(policies, graded, benchmarkBars, isFraction);
  const markdown = renderSweepReport(report, {
    provenance:
      `Replay of ${replays.length} symbols over ${years} years of daily bars on ` +
      `${timeframes.join('/')} structure at confidence ≥ ${minConfidence}, resolved under ` +
      `${policies.length} policies. Stage one compares exits at the live timing; stage two ` +
      `compares the entry window and hold at the winning exit. The two-stage grid is ` +
      `deliberate — the best of forty noisy numbers looks excellent whether or not anything ` +
      `real is there.` +
      (benchmarkBars ? ` Regime labels from ${benchmark}.` : '') +
      (failures.length > 0 ? `\n\n${failures.length} symbol(s) skipped: ${failures.join('; ')}.` : ''),
    generatedAt: new Date(),
  });

  console.log('');
  console.log(markdown);

  if (dryRun) {
    console.log('\nDRY_RUN — nothing written.');
    return;
  }
  mkdirSync(path.dirname(SWEEP_FILE), { recursive: true });
  writeFileSync(SWEEP_FILE, `${markdown}\n`);
  console.log(`\nWritten to ${path.relative(process.cwd(), SWEEP_FILE)}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
