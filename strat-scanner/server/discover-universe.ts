/**
 * Universe discovery — proposing what to watch.
 *
 * Every watchlist here is hand-curated. The scanner answers "is there a setup
 * in these 35 names" and cannot answer "are these the right 35 names". This
 * screens a broad candidate pool and proposes additions, and flags watched
 * symbols that no longer qualify.
 *
 * Candidates are scored on **tradability, never on backtested profit** — see
 * `src/strat/discovery.ts` for why that restriction matters.
 *
 * Two stages, because the pool is large and the data source is free. Stage one
 * fetches daily bars once per candidate and applies the cheap gates (liquidity,
 * volatility, history). Stage two replays the Strat engine only over what
 * survived, which is the expensive part and would be waste on a symbol already
 * rejected for trading $2M a day.
 *
 * It sends nothing, ever.
 *
 * Usage:  npx tsx server/discover-universe.ts
 *
 * Environment:
 *   DISCOVER_POOL        'equities' | 'crypto' | 'both'        (default both)
 *   DISCOVER_YEARS       years of daily history                   (default 3)
 *   DISCOVER_MAX         maximum additions to propose            (default 15)
 *   DISCOVER_MIN_VOLUME  median daily dollar volume floor    (default 25000000)
 *   DISCOVER_MAX_CORR    correlation ceiling against the watchlist (default 0.9)
 *   DRY_RUN              'true' to print the report and write nothing
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fetchDailyHistory } from '../src/data/history';
import { replaySymbol } from '../src/strat/backtest';
import { realisedVolatility } from '../src/options/blackScholes';
import {
  buildDiscoveryReport,
  CandidateMetrics,
  correlation,
  DEFAULT_GATES,
  DiscoveryGates,
  logReturns,
  magnitudeAvailabilityFrom,
  medianDollarVolume,
  renderDiscoveryReport,
  ScoredCandidate,
  scoreCandidate,
  setupDensityFrom,
} from '../src/strat/discovery';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { CRYPTO_UNIVERSE } from '../src/crypto/universe';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { Candle } from '../src/strat/types';
import { loadSymbolList } from './watchlist-file';

const SERVER_DIR = __dirname;
const REPORT_FILE = path.join(SERVER_DIR, '..', 'data', 'universe-discovery.md');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

function loadPool(name: 'equities' | 'crypto'): string[] {
  const file = path.join(SERVER_DIR, 'candidates', `${name}.json`);
  if (!existsSync(file)) return [];
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    if (!Array.isArray(parsed)) throw new Error('expected a JSON array');
    return [...new Set(parsed.map((s) => String(s).trim().toUpperCase()).filter(Boolean))];
  } catch (e) {
    console.warn(`candidates/${name}.json unreadable (${e instanceof Error ? e.message : e}).`);
    return [];
  }
}

/** Everything currently watched, across both systems. */
function watchlist(): string[] {
  const equities = loadSymbolList(path.join(SERVER_DIR, 'watchlist.json'), DEFAULT_WATCHLIST);
  const crypto = loadSymbolList(
    path.join(SERVER_DIR, 'crypto-watchlist.json'),
    CRYPTO_UNIVERSE,
  );
  return [...new Set([...equities, ...crypto, ...ALGO_UNIVERSE])];
}

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const which = (process.env.DISCOVER_POOL ?? 'both').trim().toLowerCase();
  const years = Number(process.env.DISCOVER_YEARS ?? 3);
  const maxAdditions = Number(process.env.DISCOVER_MAX ?? 15);
  const gates: DiscoveryGates = {
    ...DEFAULT_GATES,
    minDollarVolume: Number(process.env.DISCOVER_MIN_VOLUME ?? DEFAULT_GATES.minDollarVolume),
    maxCorrelation: Number(process.env.DISCOVER_MAX_CORR ?? DEFAULT_GATES.maxCorrelation),
  };

  const pool = [
    ...(which === 'crypto' ? [] : loadPool('equities')),
    ...(which === 'equities' ? [] : loadPool('crypto')),
  ];
  const watched = new Set(watchlist());
  // Watched symbols are screened too, so the report can flag ones that have
  // stopped qualifying. A watchlist that only grows becomes a scan of
  // everything.
  const candidates = [...new Set([...pool, ...watched])];

  console.log(
    `Discovery: ${candidates.length} candidates (${pool.length} in the pool, ` +
      `${watched.size} watched), ${years}y of daily bars.`,
  );

  /* ── Stage one: cheap gates from daily bars ───────────────────────────── */

  const bars = new Map<string, Candle[]>();
  const returns = new Map<string, number[]>();
  const failures: string[] = [];

  for (const symbol of candidates) {
    try {
      const history = await fetchDailyHistory(symbol, years);
      if (history.candles.length < 60) {
        failures.push(`${symbol}: ${history.candles.length} bars`);
        continue;
      }
      bars.set(symbol, history.candles);
      returns.set(symbol, logReturns(history.candles));
    } catch (e) {
      failures.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log(`Fetched ${bars.size} of ${candidates.length}; ${failures.length} unavailable.`);
  if (bars.size === 0) {
    throw new Error('No candidate history could be fetched — data provider unreachable?');
  }

  const cheap = new Map<string, { volume: number; volatility: number }>();
  for (const [symbol, candles] of bars) {
    cheap.set(symbol, {
      volume: medianDollarVolume(candles),
      volatility: realisedVolatility(candles.map((c) => c.close)),
    });
  }

  /* ── Correlation against the existing watchlist ───────────────────────── */

  const watchedReturns = [...watched]
    .filter((s) => returns.has(s))
    .map((s) => ({ symbol: s, series: returns.get(s) as number[] }));

  const correlations = new Map<string, { max: number; closest?: string }>();
  for (const symbol of bars.keys()) {
    let max = 0;
    let closest: string | undefined;
    for (const w of watchedReturns) {
      // A symbol is not a diversifier against itself.
      if (w.symbol === symbol) continue;
      const c = Math.abs(correlation(returns.get(symbol) as number[], w.series));
      if (c > max) {
        max = c;
        closest = w.symbol;
      }
    }
    correlations.set(symbol, { max, closest });
  }

  /* ── Stage two: replay the engine only over survivors ─────────────────── */

  const preQualified = [...bars.keys()].filter((s) => {
    const c = cheap.get(s);
    if (!c) return false;
    if (watched.has(s)) return true; // always screened, for the removal list
    return (
      c.volume >= gates.minDollarVolume &&
      c.volatility >= gates.minVolatility &&
      c.volatility <= gates.maxVolatility &&
      (bars.get(s) as Candle[]).length >= gates.minBars
    );
  });
  console.log(`${preQualified.length} cleared the cheap gates; replaying structure on those.`);

  const scored: ScoredCandidate[] = [];
  for (const symbol of preQualified) {
    const candles = bars.get(symbol) as Candle[];
    const c = cheap.get(symbol) as { volume: number; volatility: number };
    const corr = correlations.get(symbol) ?? { max: 0 };

    const replay = replaySymbol(symbol, candles, { minConfidence: 0 });
    const withRealTarget = replay.signals.filter(
      (s) => s.target !== null && s.target.source !== 'measured',
    ).length;
    const summary = {
      signals: replay.signals.length,
      withRealTarget,
      bars: candles.length,
    };

    const metrics: CandidateMetrics = {
      symbol,
      bars: candles.length,
      lastPrice: candles[candles.length - 1].close,
      dollarVolume: c.volume,
      volatility: c.volatility,
      setupDensity: setupDensityFrom(summary),
      magnitudeAvailability: magnitudeAvailabilityFrom(summary),
      maxCorrelation: corr.max,
      closestTo: corr.closest,
      incumbent: watched.has(symbol),
    };
    scored.push(scoreCandidate(metrics, gates));
  }

  const report = buildDiscoveryReport(scored, pool.length, watched.size, maxAdditions);
  const markdown = renderDiscoveryReport(report, {
    generatedAt: new Date(),
    gates,
    provenance:
      `Screened the committed candidate pools in \`server/candidates/\` plus every currently ` +
      `watched symbol, over ${years} years of daily bars. Cheap gates — liquidity, volatility, ` +
      `history — are applied first; the Strat engine is replayed only over what survives, since ` +
      `structure quality is expensive to compute and irrelevant for a symbol already rejected on ` +
      `liquidity.` +
      (failures.length > 0
        ? `\n\n${failures.length} candidate(s) unavailable: ${failures.slice(0, 12).join('; ')}` +
          (failures.length > 12 ? ` …and ${failures.length - 12} more.` : '.')
        : ''),
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
