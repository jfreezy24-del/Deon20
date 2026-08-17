/**
 * DCA ladder validation.
 *
 * The signal engine has three tools arguing about whether it works. The ladder
 * had none — four structural rung sources, a tier-based size skew, a depth cap
 * and a 90-day expiry, all reasoned about and shipped without ever being
 * tested. This is that test.
 *
 * It replays the ladder week by week over history using the **production
 * functions** (`buildDcaPlan`, `reconcilePlan`, `applyFills`,
 * `expireStaleRungs`), so what is measured is the system that actually ships
 * rather than a parallel implementation of it.
 *
 * The headline comparison is against a fixed-percentage ladder with identical
 * sizing. Beating buy-and-hold on cost basis proves nothing — any bid below
 * spot does that in a market that dips. The only question worth asking is
 * whether prior week lows and weekly/monthly pivots do it better than round
 * numbers.
 *
 * It sends nothing, ever. Discord carries the weekly crypto report and nothing
 * else; this is a report to read deliberately.
 *
 * Usage:  npx tsx server/ladder-backtest.ts
 *
 * Environment:
 *   LADDER_YEARS       years of daily history to replay           (default 10)
 *   LADDER_SYMBOLS     comma list overriding the crypto universe
 *   LADDER_BUDGET      cash allotted per asset                (default 10000)
 *   LADDER_TTLS        comma list of expiries to compare  (default 30,60,90,180,0)
 *   LADDER_NAIVE_DEPTHS comma list of control depths in %  (default 8,16,26,38)
 *   DRY_RUN            'true' to print the report and write nothing
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fetchDailyHistory } from '../src/data/history';
import { LadderProfile } from '../src/strat/dca';
import {
  DEFAULT_LADDER_BACKTEST_OPTIONS,
  indexOfDate,
  replayLadder,
  spotBuy,
  StrategyResult,
  weeklyDca,
} from '../src/crypto/ladderBacktest';
import {
  buildLadderReport,
  renderLadderReport,
  SymbolBundle,
} from '../src/crypto/ladderReport';
import { CRYPTO_UNIVERSE, ladderProfileFor, tierFor } from '../src/crypto/universe';
import { loadSymbolList } from './watchlist-file';

const WATCHLIST_FILE = path.join(__dirname, 'crypto-watchlist.json');
const REPORT_FILE = path.join(__dirname, '..', 'data', 'ladder-backtest.md');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

/** A TTL of 0 means "never expire" — modelled as an unreachable age. */
const NEVER = 100_000;

function symbols(): string[] {
  const override = process.env.LADDER_SYMBOLS?.trim();
  if (override) {
    const list: string[] = override
      .split(',')
      .map((s: string) => s.trim().toUpperCase())
      .filter((s: string) => s.length > 0);
    return [...new Set<string>(list)];
  }
  return loadSymbolList(WATCHLIST_FILE, CRYPTO_UNIVERSE);
}

function numbers(raw: string | undefined, fallback: number[]): number[] {
  if (!raw?.trim()) return fallback;
  const out = raw
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v));
  return out.length > 0 ? out : fallback;
}

const PROFILES: LadderProfile[] = ['tight', 'balanced', 'wide'];

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const years = Number(process.env.LADDER_YEARS ?? 10);
  const budget = Number(process.env.LADDER_BUDGET ?? DEFAULT_LADDER_BACKTEST_OPTIONS.budget);
  const ttls = numbers(process.env.LADDER_TTLS, [30, 60, 90, 180, 0]).map((t) =>
    t <= 0 ? NEVER : t,
  );
  const naiveDepths = numbers(
    process.env.LADDER_NAIVE_DEPTHS,
    DEFAULT_LADDER_BACKTEST_OPTIONS.naiveDepths,
  );

  const universe = symbols();
  console.log(
    `Ladder replay: ${universe.length} assets over ${years}y, ${budget} per asset, ` +
      `control depths ${naiveDepths.map((d) => `-${d}%`).join('/')}.`,
  );

  const bundles: SymbolBundle[] = [];
  const failures: string[] = [];

  // Sequential: a rare, long job should not hammer a free data source in
  // parallel and start earning 429s for the scheduled alerters.
  for (const symbol of universe) {
    try {
      const history = await fetchDailyHistory(symbol, years);
      if (history.candles.length < 400) {
        failures.push(`${symbol}: only ${history.candles.length} daily bars`);
        continue;
      }
      const bars = history.candles;
      const profile = ladderProfileFor(symbol);
      const base = { budget, naiveDepths };

      const structural = replayLadder(symbol, bars, { ...base, profile, rungs: 'structural' });
      if (structural.plansPublished === 0) {
        failures.push(`${symbol}: no plans published (history too short after warm-up)`);
        continue;
      }
      const control = replayLadder(symbol, bars, { ...base, profile, rungs: 'naive' });

      // Benchmarks start where the ladder started, so all four strategies get
      // the same window and the same money.
      const from = indexOfDate(bars, structural.firstPlanDate as string);
      const strategies: StrategyResult[] = [
        structural,
        control,
        spotBuy(bars, from, budget),
        weeklyDca(bars, from, budget, 26),
      ];

      const ttlVariants = ttls.map((ttlDays) => ({
        ttlDays,
        run: replayLadder(symbol, bars, { ...base, profile, rungs: 'structural', ttlDays }),
      }));
      const profileVariants = PROFILES.map((p) => ({
        profile: p,
        run: replayLadder(symbol, bars, { ...base, profile: p, rungs: 'structural' }),
      }));

      bundles.push({
        symbol,
        tier: tierFor(symbol),
        profile,
        provider: history.provider,
        bars: bars.length,
        meanPrice: structural.meanPrice,
        finalPrice: structural.finalPrice,
        firstPlanDate: structural.firstPlanDate,
        lastDate: structural.lastDate,
        strategies,
        structural,
        ttlVariants,
        profileVariants,
      });

      const eff =
        structural.averageCost !== null && structural.meanPrice > 0
          ? (structural.averageCost / structural.meanPrice).toFixed(3)
          : 'n/a';
      console.log(
        `  ${symbol}: ${bars.length} bars via ${history.provider} → ` +
          `${structural.plansPublished} plans, ${structural.fills.length} fills, ` +
          `${Math.round((structural.deployed / budget) * 100)}% deployed, efficiency ${eff}`,
      );
    } catch (e) {
      failures.push(`${symbol}: ${e instanceof Error ? e.message : e}`);
      console.warn(`  WARN ${symbol}: ${e instanceof Error ? e.message : e}`);
    }
  }

  if (bundles.length === 0) {
    throw new Error('No assets replayed — every symbol failed to fetch enough history.');
  }

  const report = buildLadderReport(bundles);
  const markdown = renderLadderReport(report, {
    budget,
    provenance:
      `Weekly ladder replay over ${years} years of daily bars for ${bundles.length} assets, ` +
      `each given ${budget.toLocaleString('en-US')} of cash for the whole window. Plans are ` +
      `published at each weekly close, fills checked against every subsequent daily bar, and ` +
      `stale rungs expired — all through the production functions rather than a ` +
      `reimplementation. The control ladder uses identical tier weights at fixed depths of ` +
      `${naiveDepths.map((d) => `${d}%`).join(' / ')} below spot.` +
      (failures.length > 0
        ? `\n\n${failures.length} asset(s) skipped: ${failures.join('; ')}.`
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
