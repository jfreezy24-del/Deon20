/**
 * Entry refinement — does a 60-minute stop pay for itself?
 *
 * The scanner takes its setups from Daily/Weekly/Monthly structure and puts the
 * stop at the other side of that bar. A daily 2-1-2 says "long above 450.20,
 * wrong below 443.10", and a resting stop order accepts the whole daily bar as
 * risk. Standard Strat practice is to time the entry on a lower chart instead:
 * once 450.20 breaks, the stop can sit under the 60-minute bar that broke it,
 * often a third of the distance for exactly the same trade.
 *
 * That trade is not free. A tighter stop buys a bigger R on the same objective
 * and buys more stop-outs, and which wins is an empirical question nobody here
 * has answered. This job answers it: every signal in the window is resolved
 * twice against the same hourly bars — once with the higher-timeframe stop,
 * once with the refined one — and the difference is the whole report.
 *
 * **60m never selects.** Setup, direction, trigger and both targets come from
 * the higher timeframe untouched; refinement runs after a trigger breaks and
 * only moves the stop. The scanner's design that 4H is the lowest timeframe
 * scanned is unchanged.
 *
 * Both variants are resolved on **hourly** bars, not daily ones. A stop this
 * tight is hit intraday and recovered from intraday; resolving it against daily
 * bars would systematically under-report the whipsaw that is the entire cost
 * being measured.
 *
 * It sends nothing, ever.
 *
 * Usage:  npx tsx server/entry-refinement.ts
 *
 * Environment:
 *   REFINE_DAYS        days of hourly history (provider cap ~60)  (default 60)
 *   REFINE_SYMBOLS     comma list overriding the universe
 *   REFINE_TIMEFRAMES  comma list of setup timeframes         (default D,W,M)
 *   REFINE_MIN_CONFIDENCE  confidence floor for the sample        (default 50)
 *   REFINE_PIVOT_BARS  intraday bars behind the trigger for the stop (default 3)
 *   DRY_RUN            'true' to print the report and write nothing
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fetchDailyHistory } from '../src/data/history';
import { fetchHourly, INTRADAY_MAX_DAYS } from '../src/data/intraday';
import { DEFAULT_BACKTEST_OPTIONS, replaySymbol } from '../src/strat/backtest';
import { GradedSignal } from '../src/strat/edgeReport';
import { DEFAULT_RESOLVE_OPTIONS, resolvePlan } from '../src/strat/outcomes';
import {
  buildRefinementComparison,
  DEFAULT_REFINEMENT_OPTIONS,
  planWithRefinedStop,
  refineEntry,
  RefinementRow,
  renderRefinementReport,
} from '../src/strat/entryRefinement';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { Timeframe, TIMEFRAMES } from '../src/strat/types';
import { loadSymbolList } from './watchlist-file';

const WATCHLIST_FILE = path.join(__dirname, 'watchlist.json');
const REPORT_FILE = path.join(__dirname, '..', 'data', 'entry-refinement.md');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

function symbols(): string[] {
  const override = process.env.REFINE_SYMBOLS?.trim();
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

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const days = Math.min(Number(process.env.REFINE_DAYS ?? INTRADAY_MAX_DAYS), INTRADAY_MAX_DAYS);
  const timeframes = parseTimeframes(process.env.REFINE_TIMEFRAMES);
  const minConfidence = Number(process.env.REFINE_MIN_CONFIDENCE ?? 50);
  const refineOpts = {
    ...DEFAULT_REFINEMENT_OPTIONS,
    pivotBars: Number(process.env.REFINE_PIVOT_BARS ?? DEFAULT_REFINEMENT_OPTIONS.pivotBars),
  };

  const universe = symbols();
  console.log(
    `Entry refinement: ${universe.length} symbols, ${days}d of hourly bars ` +
      `(${timeframes.join('/')}, confidence ≥ ${minConfidence}).`,
  );

  const rows: RefinementRow[] = [];
  const failures: string[] = [];
  let covered = 0;

  for (const symbol of universe) {
    try {
      // Hourly first: no intraday coverage means nothing to refine, and there
      // is no point paying for a year of daily bars to find that out.
      const intraday = await fetchHourly(symbol, days);
      if (intraday.candles.length < 50) {
        failures.push(`${symbol}: only ${intraday.candles.length} hourly bars`);
        continue;
      }
      const windowStart = intraday.candles[0].time;

      const history = await fetchDailyHistory(symbol, 1);
      if (history.candles.length < 200) {
        failures.push(`${symbol}: only ${history.candles.length} daily bars`);
        continue;
      }

      const replay = replaySymbol(symbol, history.candles, {
        timeframes,
        minConfidence,
        resolve: DEFAULT_RESOLVE_OPTIONS,
      });

      // Only signals whose "?" bar falls inside the hourly window can be
      // resolved at this resolution at all.
      const inWindow = replay.signals.filter((s) => s.plan.triggerBarEnd >= windowStart);
      covered += inWindow.length;

      for (const s of inWindow) {
        const baseline = resolvePlan(
          s.plan,
          intraday.candles,
          DEFAULT_RESOLVE_OPTIONS,
          replay.asOf,
        );
        const entry = refineEntry(s.plan, intraday.candles, refineOpts, DEFAULT_RESOLVE_OPTIONS);
        const refinedPlan = entry ? planWithRefinedStop(s.plan, entry) : s.plan;
        const refined = resolvePlan(
          refinedPlan,
          intraday.candles,
          DEFAULT_RESOLVE_OPTIONS,
          replay.asOf,
        );

        const grade = (
          res: typeof baseline,
          promisedR: number,
        ): GradedSignal => ({
          ...s.identity,
          promisedR,
          status: res.status,
          r: res.r,
          mfeR: res.mfeR,
          maeR: res.maeR,
          reachedTarget2: res.reachedTarget2,
        });

        rows.push({
          baseline: grade(baseline, s.plan.levels.rr1),
          refined: grade(refined, refinedPlan.levels.rr1),
          entry,
        });
      }

      console.log(
        `  ${symbol}: ${intraday.candles.length} hourly bars via ${intraday.provider}` +
          (intraday.fallbackReason ? ` [fallback: ${intraday.fallbackReason}]` : '') +
          ` → ${inWindow.length} signals in window`,
      );
    } catch (e) {
      failures.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
      console.warn(`  WARN ${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  }

  if (rows.length === 0) {
    throw new Error(
      'No signals fell inside the intraday window — every symbol failed, or the window is ' +
        'shorter than the signals are old.',
    );
  }
  console.log(`${covered} signals resolved twice against hourly bars.`);

  const comparison = buildRefinementComparison(rows);
  const markdown = renderRefinementReport(comparison, {
    days,
    provenance:
      `Every signal published on ${timeframes.join('/')} structure at confidence ≥ ` +
      `${minConfidence} whose "?" bar fell inside the hourly window, resolved twice against ` +
      `the same hourly bars: once with the higher-timeframe stop and once with a stop taken ` +
      `from the low/high of the last ${refineOpts.pivotBars} intraday bars at the trigger. ` +
      `The trigger and both targets are identical in both columns — the stop is the single ` +
      `difference.` +
      (failures.length > 0
        ? `\n\n${failures.length} symbol(s) skipped: ${failures.join('; ')}.`
        : ''),
    generatedAt: new Date(),
  });

  console.log('');
  console.log(markdown);

  if (dryRun) {
    console.log('\nDRY_RUN — nothing written.');
    return;
  }
  mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  writeFileSync(REPORT_FILE, `${markdown}\n`);
  console.log(`\nWritten to ${path.relative(process.cwd(), REPORT_FILE)}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
