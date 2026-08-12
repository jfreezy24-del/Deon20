import { buildContinuity } from '../strat/continuity';
import { buildDcaPlan, DcaPlan } from '../strat/dca';
import { Candle, ContinuityMap, Timeframe, TIMEFRAMES } from '../strat/types';
import { fetchTimeframeWithProvider, ProviderName } from '../data/market';
import { TimeframeSeries } from '../data/series';
import { cryptoName, ladderProfileFor } from './universe';
import { AssetStructure, buildStructure } from './structure';

/**
 * The weekly crypto report: the standing DCA ladder underneath every asset in
 * the universe, built from weekly and monthly Strat structure.
 *
 * Deliberately accumulation only. Trade triggers already arrive in real time
 * from the intraday alerters in this repo; repeating them once a week adds
 * nothing. What a weekly cadence is actually good for is the slower question —
 * where the resting bids go, and how much size sits on each one.
 */

export interface WeeklyOptions {
  /** Cap on assets given their own push after the digest */
  maxFeatured: number;
}

export const DEFAULT_WEEKLY_OPTIONS: WeeklyOptions = {
  maxFeatured: 4,
};

export interface WeeklyAsset {
  symbol: string;
  name?: string;
  /** Which data source served this asset ('mixed' when a timeframe fell back) */
  provider?: ProviderName | 'mixed';
  lastPrice: number;
  /** Move of the current (or last completed) weekly candle, open to close */
  weekChangePct: number | null;
  continuity: ContinuityMap;
  dca: DcaPlan;
  /** Two-sided higher-timeframe facts, for the written analysis */
  structure: AssetStructure;
}

export interface WeeklyError {
  symbol: string;
  message: string;
}

/** A symbol Alpaca could not serve, and why it fell through to Yahoo. */
export interface ProviderFallback {
  symbol: string;
  timeframe: Timeframe;
  reason: string;
}

export interface WeeklyReport {
  generatedAt: number;
  /** ISO date (UTC) of the Monday that starts the week being planned */
  weekOf: string;
  assets: WeeklyAsset[];
  errors: WeeklyError[];
  fallbacks: ProviderFallback[];
  breadth: {
    scanned: number;
    /** Assets whose 4H/D/W/M candles are all pointed up (or all down) */
    fullContinuityUp: number;
    fullContinuityDown: number;
    accumulate: number;
    defensive: number;
    /** Ladders whose first rung sits within 5% of spot */
    nearFill: number;
  };
}

const changePct = (c: Candle | null | undefined): number | null =>
  c && c.open > 0 ? Number((((c.close - c.open) / c.open) * 100).toFixed(2)) : null;

/** How far the shallowest rung is from spot; Infinity when there is no ladder. */
export const firstRungDistance = (a: WeeklyAsset): number =>
  a.dca.rungs[0]?.discountPct ?? Infinity;

/**
 * Monday (UTC) of the week the report plans for. The scheduled run happens
 * just after the weekly candle closes (Monday 01:00 UTC), so Monday–Saturday
 * names the current week; a Sunday run names the week about to start.
 */
export function weekOf(at: number): string {
  const d = new Date(at);
  const day = d.getUTCDay(); // 0 = Sunday
  const offset = day === 0 ? 1 : 1 - day;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offset));
  return monday.toISOString().slice(0, 10);
}

export function buildWeeklyAsset(
  symbol: string,
  series: TimeframeSeries[],
  provider?: ProviderName | 'mixed',
): WeeklyAsset {
  const byTf = new Map(series.map((s) => [s.timeframe, s]));
  const weekly = byTf.get('W');
  const monthly = byTf.get('M');

  const current: Partial<Record<Timeframe, Candle>> = {};
  for (const s of series) {
    const c = s.forming ?? s.completed[s.completed.length - 1];
    if (c) current[s.timeframe] = c;
  }

  const lastPrice =
    byTf.get('D')?.lastPrice ?? series.find((s) => s.lastPrice > 0)?.lastPrice ?? 0;

  const dca = buildDcaPlan({
    symbol,
    lastPrice,
    weekly: { completed: weekly?.completed ?? [], forming: weekly?.forming ?? null },
    monthly: { completed: monthly?.completed ?? [], forming: monthly?.forming ?? null },
    profile: ladderProfileFor(symbol),
  });

  return {
    symbol,
    provider,
    name: series.find((s) => s.name)?.name ?? cryptoName(symbol),
    lastPrice,
    weekChangePct: changePct(weekly?.forming ?? weekly?.completed[weekly.completed.length - 1]),
    continuity: buildContinuity(current),
    dca,
    structure: buildStructure(weekly?.completed ?? [], monthly?.completed ?? [], lastPrice),
  };
}

export function buildWeeklyReport(
  assets: WeeklyAsset[],
  errors: WeeklyError[],
  at: number = Date.now(),
  fallbacks: ProviderFallback[] = [],
): WeeklyReport {
  const allUp = (a: WeeklyAsset) => TIMEFRAMES.every((tf) => a.continuity[tf] === 'up');
  const allDown = (a: WeeklyAsset) => TIMEFRAMES.every((tf) => a.continuity[tf] === 'down');

  // Closest-to-filling first: the ladders that could actually take size this
  // week lead the report, the ones needing a deep flush trail it.
  const ranked = [...assets].sort((a, b) => firstRungDistance(a) - firstRungDistance(b));

  return {
    generatedAt: at,
    weekOf: weekOf(at),
    assets: ranked,
    errors,
    fallbacks,
    breadth: {
      scanned: assets.length,
      fullContinuityUp: assets.filter(allUp).length,
      fullContinuityDown: assets.filter(allDown).length,
      accumulate: assets.filter((a) => a.dca.stance === 'accumulate').length,
      defensive: assets.filter((a) => a.dca.stance === 'defensive').length,
      nearFill: assets.filter((a) => firstRungDistance(a) <= 5).length,
    },
  };
}

/** Fetch every timeframe for every symbol and assemble the weekly report. */
export async function scanCryptoWeekly(
  symbols: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<WeeklyReport> {
  const assets: WeeklyAsset[] = [];
  const errors: WeeklyError[] = [];
  const fallbacks: ProviderFallback[] = [];
  const queue = [...symbols];
  let done = 0;

  const CONCURRENCY = 3;
  async function worker() {
    for (;;) {
      const symbol = queue.shift();
      if (!symbol) return;
      try {
        const outcomes = await Promise.all(
          TIMEFRAMES.map((tf) => fetchTimeframeWithProvider(symbol, tf)),
        );
        outcomes.forEach((o, i) => {
          if (o.fallbackReason) {
            fallbacks.push({ symbol, timeframe: TIMEFRAMES[i], reason: o.fallbackReason });
          }
        });
        const used = new Set(outcomes.map((o) => o.provider));
        const provider = used.size === 1 ? [...used][0] : 'mixed';
        assets.push(buildWeeklyAsset(symbol, outcomes.map((o) => o.series), provider));
      } catch (e) {
        errors.push({ symbol, message: e instanceof Error ? e.message : String(e) });
      }
      done += 1;
      onProgress?.(done, symbols.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, symbols.length) }, worker));
  return buildWeeklyReport(assets, errors, Date.now(), fallbacks);
}
