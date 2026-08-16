/**
 * Confidence calibration — does the score mean anything?
 *
 * `scoreConfidence` is a hand-tuned additive model. Full timeframe continuity
 * is worth 24 points, inside-bar compression 6, volume expansion 5, and a
 * strong reward/risk 10. Those weights were reasoned about, never measured.
 * Every alert that has ever gone out carried a number derived from them.
 *
 * This job replays the identical engine over years of daily bars, resolves
 * every signal it would have published with the identical resolver the live
 * tracker uses, and writes `data/calibration.md`: a reliability table showing
 * whether higher confidence really does perform better, and a per-term table
 * showing which weights are earned and which are noise.
 *
 * It sends nothing, ever. This is a slow, occasional, read-it-carefully job —
 * not a notification. Run it by hand after changing the model, or let the
 * quarterly cron refresh it.
 *
 * Usage:  npx tsx server/calibrate.ts
 *
 * Environment:
 *   CALIBRATION_YEARS      years of daily history to replay         (default 10)
 *   CALIBRATION_SYMBOLS    comma list overriding the universe
 *   CALIBRATION_TIMEFRAMES comma list of timeframes             (default D,W,M)
 *   ENTRY_WINDOW_BARS      bars the trigger stays actionable         (default 1)
 *   MAX_HOLD_BARS          bars to hold before a timeout             (default 6)
 *   DRY_RUN                'true' to print the report and write nothing
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fetchDailyHistory } from '../src/data/history';
import { backtestSymbol, DEFAULT_BACKTEST_OPTIONS } from '../src/strat/backtest';
import { buildEdgeReport, GradedSignal, renderEdgeReport } from '../src/strat/edgeReport';
import { DEFAULT_RESOLVE_OPTIONS } from '../src/strat/outcomes';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { Timeframe, TIMEFRAMES } from '../src/strat/types';
import { loadSymbolList } from './watchlist-file';

const WATCHLIST_FILE = path.join(__dirname, 'watchlist.json');
const CALIBRATION_FILE = path.join(__dirname, '..', 'data', 'calibration.md');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

function symbols(): string[] {
  const override = process.env.CALIBRATION_SYMBOLS?.trim();
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
  const years = Number(process.env.CALIBRATION_YEARS ?? 10);
  const timeframes = parseTimeframes(process.env.CALIBRATION_TIMEFRAMES);
  const resolve = {
    // Same exit policy as the live record, so calibration and the forward
    // record stay directly comparable.
    ...DEFAULT_RESOLVE_OPTIONS,
    entryWindowBars: Number(
      process.env.ENTRY_WINDOW_BARS ?? DEFAULT_RESOLVE_OPTIONS.entryWindowBars,
    ),
    maxHoldBars: Number(process.env.MAX_HOLD_BARS ?? DEFAULT_RESOLVE_OPTIONS.maxHoldBars),
  };

  const universe = symbols();
  console.log(
    `Replaying ${universe.length} symbols over ${years}y of daily bars ` +
      `(${timeframes.join('/')}, entry window ${resolve.entryWindowBars}, hold ${resolve.maxHoldBars}).`,
  );

  const graded: GradedSignal[] = [];
  const failures: string[] = [];

  // Sequential rather than pooled: this is a rare, long job, and hammering a
  // free data source with parallel decade-long requests is how it starts
  // returning 429s to the scheduled alerters that actually matter.
  for (const symbol of universe) {
    try {
      const history = await fetchDailyHistory(symbol, years);
      if (history.candles.length < 200) {
        failures.push(`${symbol}: only ${history.candles.length} daily bars`);
        continue;
      }
      const signals = backtestSymbol(symbol, history.candles, {
        timeframes,
        resolve,
        minConfidence: 0,
      });
      graded.push(...signals);
      const first = new Date(history.candles[0].time * 1000).toISOString().slice(0, 10);
      console.log(
        `  ${symbol}: ${history.candles.length} bars via ${history.provider} from ${first}` +
          (history.fallbackReason ? ` [fallback: ${history.fallbackReason}]` : '') +
          ` → ${signals.length} signals`,
      );
    } catch (e) {
      failures.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
      console.warn(`  WARN ${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  }

  for (const f of failures) console.warn(`  skipped — ${f}`);
  if (graded.length === 0) {
    throw new Error('No signals replayed — every symbol failed to fetch history.');
  }

  const report = buildEdgeReport(graded);
  const markdown = renderEdgeReport(report, {
    title: 'Confidence Calibration — historical replay',
    provenance:
      `Replay of the live engine over ${years} years of daily bars for ` +
      `${universe.length - failures.length} symbols, publishing on ${timeframes.join('/')} ` +
      `structure at **every** confidence level — the losers are kept deliberately, since ` +
      `"is a 70 better than a 50" cannot be answered from a sample that only kept the 50s.\n\n` +
      `Higher-timeframe candles are rebuilt from the daily bars, so a partially formed week ` +
      `contains only the days that had actually traded at that instant; nothing here sees a ` +
      `bar before it printed. Two honest gaps from live running: **4H is not modelled** ` +
      `(daily history cannot reconstruct it), so continuity scores over D/W/M and the ` +
      `\`ftfc-full\` term faces a slightly easier test than live; and the \`in-force\` term ` +
      `never fires, because a replay evaluates at a bar close, before the "?" has printed.` +
      (failures.length > 0 ? `\n\n${failures.length} symbol(s) skipped: ${failures.join('; ')}.` : ''),
    generatedAt: new Date(),
  });

  console.log('');
  console.log(markdown);

  if (dryRun) {
    console.log('\nDRY_RUN — nothing written.');
    return;
  }
  mkdirSync(path.dirname(CALIBRATION_FILE), { recursive: true });
  writeFileSync(CALIBRATION_FILE, `${markdown}\n`);
  console.log(`\nWritten to ${path.relative(process.cwd(), CALIBRATION_FILE)}.`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
