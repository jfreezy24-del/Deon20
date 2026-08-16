/**
 * Signal outcome tracker — the forward record of what the engine's calls were
 * actually worth.
 *
 * Every alert the scanner sends is a complete, falsifiable plan: entry here,
 * wrong there, first objective at that price. Until now all of it was thrown
 * away the moment the push notification landed. This job keeps it: it enrols
 * new signals as they are published, replays every unsettled one against daily
 * bars, and regenerates `data/edge-report.md` — win rate and expectancy sliced
 * by pattern, timeframe, confidence band and timeframe continuity.
 *
 * It sends nothing on a normal run. A tracker that pinged you about its own
 * bookkeeping would be one more stream to ignore, and the whole point is the
 * report you read deliberately rather than a notification you dismiss. The
 * monthly cron passes DIGEST=true for a single summary push.
 *
 * Usage:  npx tsx server/track-outcomes.ts
 *
 * Environment:
 *   NTFY_TOPIC            ntfy topic for the digest (digest runs only)
 *   NTFY_SERVER           ntfy server base URL          (default https://ntfy.sh)
 *   DIGEST                'true' to push the headline summary once
 *   TRACK_MIN_CONFIDENCE  confidence floor for enrolment          (default 50)
 *   TRACK_TIMEFRAMES      comma list of tracked timeframes     (default D,W,M)
 *   ENTRY_WINDOW_BARS     bars the trigger stays actionable        (default 1)
 *   MAX_HOLD_BARS         bars to hold before a timeout            (default 6)
 *   DRY_RUN               'true' to print everything and save nothing
 *
 * State: data/signal-outcomes.json (unsettled) and data/signal-history.jsonl
 * (settled, append-only). Both are committed — see server/outcome-store.ts.
 */
import { scanMarket } from '../src/scanner';
import { fetchTimeframe } from '../src/data/market';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { Candle, Timeframe, TIMEFRAMES } from '../src/strat/types';
import {
  DEFAULT_RESOLVE_OPTIONS,
  isTerminal,
  ResolveOptions,
  resolvePlan,
} from '../src/strat/outcomes';
import {
  DEFAULT_ENROLL_OPTIONS,
  isoDate,
  planOf,
  selectForEnrollment,
  toGraded,
  toTracked,
  TrackedSignal,
} from '../src/strat/signalRecord';
import { buildEdgeReport, edgeDigest, renderEdgeReport } from '../src/strat/edgeReport';
import { publishNtfy } from './lib';
import { loadSymbolList } from './watchlist-file';
import {
  appendHistory,
  loadHistory,
  loadPending,
  PendingStore,
  savePending,
  writeEdgeReport,
} from './outcome-store';
import path from 'node:path';

const WATCHLIST_FILE = path.join(__dirname, 'watchlist.json');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

/**
 * Track the union of the alert watchlist and the algo universe — everything
 * the two alerters can possibly ping about, so nothing that reaches the phone
 * goes ungraded.
 */
function trackedUniverse(): string[] {
  const watchlist = loadSymbolList(WATCHLIST_FILE, DEFAULT_WATCHLIST);
  return [...new Set([...watchlist, ...ALGO_UNIVERSE])];
}

function parseTimeframes(raw: string | undefined): Timeframe[] {
  if (!raw?.trim()) return DEFAULT_ENROLL_OPTIONS.timeframes;
  const tfs = raw
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter((t): t is Timeframe => (TIMEFRAMES as string[]).includes(t));
  return tfs.length > 0 ? tfs : DEFAULT_ENROLL_OPTIONS.timeframes;
}

/**
 * Daily bars for resolution, forming bar included.
 *
 * The still-printing bar's high and low are prices that genuinely traded, so a
 * stop it reached was reached. Waiting for the close would report every
 * intraday stop-out a day late and, worse, would let a plan that was already
 * invalidated keep accruing favourable excursion.
 */
async function resolutionBars(symbol: string): Promise<Candle[]> {
  const s = await fetchTimeframe(symbol, 'D');
  return s.forming ? [...s.completed, s.forming] : s.completed;
}

/** Small worker pool, matching the scanner's own concurrency. */
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const queue = [...items];
  const out: R[] = [];
  const worker = async () => {
    for (;;) {
      const item = queue.shift();
      if (item === undefined) return;
      out.push(await fn(item));
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const digest = flag(process.env.DIGEST);
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';
  const today = isoDate(new Date());

  const enrollOpts = {
    minConfidence: Number(
      process.env.TRACK_MIN_CONFIDENCE ?? DEFAULT_ENROLL_OPTIONS.minConfidence,
    ),
    timeframes: parseTimeframes(process.env.TRACK_TIMEFRAMES),
  };
  const resolveOpts: ResolveOptions = {
    entryWindowBars: Number(
      process.env.ENTRY_WINDOW_BARS ?? DEFAULT_RESOLVE_OPTIONS.entryWindowBars,
    ),
    maxHoldBars: Number(process.env.MAX_HOLD_BARS ?? DEFAULT_RESOLVE_OPTIONS.maxHoldBars),
  };

  // Load first: an unreadable record must stop the run before it scans, not
  // after. Starting fresh would re-enrol every historical signal as new.
  const pending = loadPending();
  const history = loadHistory();
  const settledKeys = new Set(history.map((h) => h.key));

  // History is appended before the pending file is rewritten, so a crash
  // between those two writes can leave a record in both. Trusting history and
  // dropping the stale copy makes that harmless; carrying it forward would
  // settle it a second time and append a duplicate to the record.
  const carried = pending.signals.filter((s) => !settledKeys.has(s.key));
  if (carried.length !== pending.signals.length) {
    console.log(
      `Dropped ${pending.signals.length - carried.length} unsettled record(s) already in history.`,
    );
  }

  const known = new Set<string>([...carried.map((s) => s.key), ...settledKeys]);
  console.log(
    `Record: ${carried.length} unsettled, ${history.length} settled ` +
      `(last checked ${pending.lastCheckedOn ?? 'never'}).`,
  );

  /* ── 1. Enrol newly published signals ─────────────────────────────────── */

  const universe = trackedUniverse();
  console.log(
    `Scanning ${universe.length} symbols for signals to enrol ` +
      `(${enrollOpts.timeframes.join('/')}, confidence ≥ ${enrollOpts.minConfidence}).`,
  );
  const scan = await scanMarket(universe);
  for (const err of scan.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  if (scan.signals.length === 0 && scan.errors.length === universe.length) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }

  const fresh = selectForEnrollment(scan.signals, known, enrollOpts).map((s) =>
    toTracked(s, today),
  );
  console.log(`Enrolling ${fresh.length} new signal(s).`);
  for (const t of fresh) {
    console.log(
      `  + ${t.symbol} ${t.timeframe} ${t.direction} ${t.pattern} (${t.sequence}) ` +
        `${t.confidence}% · entry ${t.levels.entry} stop ${t.levels.stop} T1 ${t.levels.target1}`,
    );
  }

  /* ── 2. Replay every unsettled record against daily bars ──────────────── */

  const open: TrackedSignal[] = [...carried, ...fresh];
  const symbols = [...new Set(open.map((t) => t.symbol))];
  console.log(`Resolving ${open.length} unsettled record(s) across ${symbols.length} symbol(s).`);

  const barsBySymbol = new Map<string, Candle[]>();
  const barErrors: string[] = [];
  await mapPool(symbols, 3, async (symbol) => {
    try {
      barsBySymbol.set(symbol, await resolutionBars(symbol));
    } catch (e) {
      barErrors.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  });
  for (const e of barErrors) console.warn(`  WARN could not fetch daily bars — ${e}`);

  const stillOpen: TrackedSignal[] = [];
  const settled: TrackedSignal[] = [];

  for (const t of open) {
    const bars = barsBySymbol.get(t.symbol);
    if (!bars) {
      // No bars this run: leave the record exactly as it was. Resolution is a
      // full replay, so a skipped day costs nothing but a day's delay.
      stillOpen.push(t);
      continue;
    }
    const resolution = resolvePlan(planOf(t), bars, resolveOpts);
    const updated: TrackedSignal = { ...t, resolution };
    if (isTerminal(resolution.status)) {
      settled.push(updated);
      const r = resolution.r === undefined ? '' : ` (${resolution.r > 0 ? '+' : ''}${resolution.r}R)`;
      console.log(
        `  = ${t.symbol} ${t.timeframe} ${t.direction} ${t.pattern} → ${resolution.status}${r}`,
      );
    } else {
      stillOpen.push(updated);
    }
  }
  console.log(`${settled.length} record(s) settled, ${stillOpen.length} still running.`);

  /* ── 3. Regenerate the report ─────────────────────────────────────────── */

  const graded = [...history, ...settled.map(toGraded), ...stillOpen.map(toGraded)];
  const report = buildEdgeReport(graded);
  const markdown = renderEdgeReport(report, {
    title: 'Edge Report — live signal record',
    provenance:
      `Forward record of every signal published at confidence ≥ ${enrollOpts.minConfidence} on ` +
      `${enrollOpts.timeframes.join('/')} structure across ${universe.length} symbols, resolved ` +
      `against daily bars. Out-of-sample by construction: each signal was enrolled when it was ` +
      `published, before its outcome existed. The trigger stays actionable for ` +
      `${resolveOpts.entryWindowBars} bar(s) of its own timeframe and trades are held at most ` +
      `${resolveOpts.maxHoldBars}. Compare against \`calibration.md\`, which measures the same ` +
      `engine over history — a large gap between the two is a live-run problem, not a strategy one.`,
    generatedAt: new Date(),
  });

  console.log('');
  console.log(edgeDigest(report));
  console.log('');

  if (dryRun) {
    console.log('DRY_RUN — nothing written, nothing sent.');
    return;
  }

  /* ── 4. Persist ───────────────────────────────────────────────────────── */

  // History first, deliberately. A crash between the two writes then leaves a
  // settled record in both files rather than in neither, and the load path
  // above reconciles that on the next run. The reverse order would lose the
  // record outright, which nothing can reconcile.
  appendHistory(settled.map(toGraded));
  const store: PendingStore = { version: 1, lastCheckedOn: today, signals: stillOpen };
  savePending(store);
  writeEdgeReport(markdown);
  console.log('Record and report written.');

  /* ── 5. Digest (monthly only) ─────────────────────────────────────────── */

  if (!digest) return;
  if (!topic) {
    console.log('DIGEST requested but NTFY_TOPIC is not set — skipping the push.');
    return;
  }
  await publishNtfy(server, {
    topic,
    title: '📊 Strat edge report',
    message: `${edgeDigest(report)}\n\nFull breakdown: data/edge-report.md in the repo.`,
    priority: 3,
    tags: ['bar_chart'],
  });
  console.log('Digest sent.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
