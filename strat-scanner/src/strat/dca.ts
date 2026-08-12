import { Candle, CandleType, TFTrend } from './types';
import { classifyCandle } from './classify';
import { candleTrend } from './continuity';

/**
 * Dollar-cost-average ladders built from TheStrat's higher-timeframe
 * structure.
 *
 * TheStrat is a trigger methodology, not an accumulation methodology — but the
 * levels it defines are exactly the ones a ladder wants. Two ideas carry over:
 *
 *  1. **Actionable levels.** The prior bar's low is where the current bar turns
 *     2-down. Those breaks are where forced selling shows up, and where the
 *     failed-breakdown reversals (2d that flips back to 2u) form. Resting a bid
 *     there buys the flush instead of chasing it.
 *  2. **Magnitude / pivots.** Price travels pivot to pivot. Prior weekly and
 *     monthly pivot lows are the broadening-formation points below the market,
 *     which is where the next leg is measured from — the natural deep rungs.
 *
 * The ladder is therefore just those levels below price, deepest rung last,
 * with size skewed by how far the asset habitually travels (see LadderProfile).
 */

/** How wide the ladder spreads and how size is skewed across the rungs. */
export type LadderProfile = 'tight' | 'balanced' | 'wide';

export type DcaStance = 'accumulate' | 'neutral' | 'defensive';

export interface DcaRung {
  /** Limit price for this rung */
  price: number;
  /** How far below the current price the rung sits, in percent */
  discountPct: number;
  /** Share of the planned position, integer percent; rungs sum to 100 */
  allocationPct: number;
  /** Short label for the structure the level came from */
  source: string;
  /** Timeframe the level was read from */
  timeframe: 'W' | 'M';
  /** Why this level matters in Strat terms */
  rationale: string;
}

export interface DcaPlan {
  symbol: string;
  lastPrice: number;
  stance: DcaStance;
  stanceReason: string;
  /** Strat type of the last completed weekly / monthly bar, for context */
  weeklyType: CandleType | null;
  monthlyType: CandleType | null;
  weeklyTrend: TFTrend | null;
  monthlyTrend: TFTrend | null;
  /** Ladder rungs, closest to price first */
  rungs: DcaRung[];
  /** Weighted average cost if every rung fills */
  averageFill: number | null;
}

export interface DcaSeries {
  completed: Candle[];
  forming: Candle | null;
}

export interface DcaInput {
  symbol: string;
  lastPrice: number;
  weekly: DcaSeries;
  monthly: DcaSeries;
  profile?: LadderProfile;
}

/** Rung weights, shallowest first. Majors front-load; high beta back-loads. */
const WEIGHTS: Record<LadderProfile, number[]> = {
  tight: [28, 26, 24, 22],
  balanced: [20, 24, 27, 29],
  wide: [12, 20, 30, 38],
};

/** Minimum spacing between rungs so a ladder never stacks on one level. */
const MIN_GAP_PCT: Record<LadderProfile, number> = { tight: 2, balanced: 3, wide: 4 };

/**
 * How far below price a rung may sit. Old pivots stay on the chart forever, and
 * a bid 80% below spot is not a plan — it is a wish. Structure deeper than this
 * is dropped rather than laddered into.
 */
const MAX_DEPTH_PCT: Record<LadderProfile, number> = { tight: 35, balanced: 50, wide: 65 };

const MAX_RUNGS = 4;

const round = (v: number) => Number(v.toFixed(v >= 100 ? 2 : v >= 1 ? 4 : 6));
const pct = (v: number) => Number(v.toFixed(2));

/**
 * Swing lows: bars whose low is not exceeded by the `width` bars on either
 * side. These are the pivots Strat measures magnitude between.
 */
export function findPivotLows(candles: Candle[], width = 2): Candle[] {
  const out: Candle[] = [];
  for (let i = width; i < candles.length - width; i++) {
    let isPivot = true;
    for (let j = i - width; j <= i + width && isPivot; j++) {
      if (j !== i && candles[j].low < candles[i].low) isPivot = false;
    }
    if (isPivot) out.push(candles[i]);
  }
  return out;
}

/** Average bar range over the last `n` bars, as a fraction of the last close. */
function averageRangePct(candles: Candle[], n = 12): number {
  const window = candles.slice(-n).filter((c) => c.close > 0);
  if (window.length === 0) return 0.1;
  const total = window.reduce((sum, c) => sum + (c.high - c.low) / c.close, 0);
  return total / window.length;
}

interface Candidate {
  price: number;
  source: string;
  timeframe: 'W' | 'M';
  rationale: string;
}

function candidateLevels(input: DcaInput): Candidate[] {
  const { weekly, monthly, lastPrice } = input;
  const out: Candidate[] = [];

  const priorWeek = weekly.completed[weekly.completed.length - 1];
  if (priorWeek) {
    out.push({
      price: priorWeek.low,
      source: 'Prior week low',
      timeframe: 'W',
      rationale:
        'Taking this out turns the week into a 2-down. It is the first level where weekly stops sit, and where a failed breakdown flips back into a 2d-2u reversal.',
    });
  }

  const priorMonth = monthly.completed[monthly.completed.length - 1];
  if (priorMonth) {
    out.push({
      price: priorMonth.low,
      source: 'Prior month low',
      timeframe: 'M',
      rationale:
        'The monthly actionable level: below it the month is 2-down and the higher-timeframe sequence is on the back foot, which is exactly where longer-horizon size gets a discount.',
    });
  }

  // Pivots below price, most recent first — the broadening-formation points
  // price measures to on the way down.
  const weeklyPivots = findPivotLows(weekly.completed)
    .filter((c) => c.low < lastPrice)
    .reverse();
  for (const p of weeklyPivots.slice(0, 2)) {
    out.push({
      price: p.low,
      source: 'Weekly pivot low',
      timeframe: 'W',
      rationale:
        'A weekly broadening-formation point: the last place weekly buyers actually turned price. Magnitude from above measures down to it, so it is a natural resting bid rather than a guess.',
    });
  }

  const monthlyPivots = findPivotLows(monthly.completed)
    .filter((c) => c.low < lastPrice)
    .reverse();
  for (const p of monthlyPivots.slice(0, 2)) {
    out.push({
      price: p.low,
      source: 'Monthly pivot low',
      timeframe: 'M',
      rationale:
        'A monthly pivot — the deepest structure in the plan. Price trading here without losing it keeps the monthly sequence intact, so this rung carries the position, not a scalp.',
    });
  }

  return out;
}

/** Rungs are strictly below price and spaced apart, deepest kept last. */
function selectRungs(candidates: Candidate[], lastPrice: number, profile: LadderProfile): Candidate[] {
  const gap = MIN_GAP_PCT[profile] / 100;
  const floor = lastPrice * (1 - MAX_DEPTH_PCT[profile] / 100);
  const kept: Candidate[] = [];
  const sorted = candidates
    .filter((c) => c.price > 0 && c.price < lastPrice * 0.995 && c.price >= floor)
    .sort((a, b) => b.price - a.price);

  for (const c of sorted) {
    if (kept.length >= MAX_RUNGS) break;
    const tooClose = kept.some((k) => Math.abs(k.price - c.price) / k.price < gap);
    if (!tooClose) kept.push(c);
  }
  return kept;
}

/** Measured fallback rungs when price has traded below every prior pivot. */
function measuredRungs(lastPrice: number, weeklyRangePct: number, needed: number): Candidate[] {
  const step = Math.max(weeklyRangePct, 0.03);
  return Array.from({ length: needed }, (_, i) => ({
    price: lastPrice * (1 - step * (i + 1)),
    source: 'Measured move',
    timeframe: 'W' as const,
    rationale:
      'Price is below every prior higher-timeframe pivot, so there is no structure left to bid. This rung is a measured step of one average weekly range — a placeholder until a new pivot low actually prints.',
  }));
}

function allocations(count: number, profile: LadderProfile): number[] {
  if (count === 0) return [];
  const base = WEIGHTS[profile].slice(0, count);
  const total = base.reduce((a, b) => a + b, 0);
  const scaled = base.map((w) => Math.round((w / total) * 100));
  // Rounding drift lands on the deepest rung, which is where a point either
  // way matters least.
  const drift = 100 - scaled.reduce((a, b) => a + b, 0);
  scaled[scaled.length - 1] += drift;
  return scaled;
}

function readStance(
  input: DcaInput,
  monthlyPivotLow: number | null,
): { stance: DcaStance; reason: string; weeklyTrend: TFTrend | null; monthlyTrend: TFTrend | null } {
  const { weekly, monthly, lastPrice } = input;
  const weeklyCurrent = weekly.forming ?? weekly.completed[weekly.completed.length - 1];
  const monthlyCurrent = monthly.forming ?? monthly.completed[monthly.completed.length - 1];
  const weeklyTrend = weeklyCurrent ? candleTrend(weeklyCurrent) : null;
  const monthlyTrend = monthlyCurrent ? candleTrend(monthlyCurrent) : null;

  if (monthlyPivotLow !== null && lastPrice < monthlyPivotLow) {
    return {
      stance: 'defensive',
      reason:
        'Price is trading below the last monthly pivot low, so the monthly sequence is broken and magnitude points lower. Ladder in reduced size and only from the deeper rungs until a monthly bar reclaims that pivot.',
      weeklyTrend,
      monthlyTrend,
    };
  }
  if (monthlyTrend === 'down' && weeklyTrend === 'down') {
    return {
      stance: 'defensive',
      reason:
        'The current weekly and monthly candles are both trading below their opens — higher-timeframe continuity is down. Bids still belong at the rungs, but the flush is more likely to reach the deep ones, so hold size back.',
      weeklyTrend,
      monthlyTrend,
    };
  }
  if (monthlyTrend === 'up' && weeklyTrend === 'up') {
    return {
      stance: 'accumulate',
      reason:
        'Weekly and monthly candles are both trading above their opens with the monthly pivot intact — higher-timeframe continuity is up, so pullbacks into the ladder are buying a trend, not catching a knife.',
      weeklyTrend,
      monthlyTrend,
    };
  }
  return {
    stance: 'neutral',
    reason:
      'Weekly and monthly candles disagree, so the higher timeframes have not committed. Take the shallow rungs slowly and keep the deep ones funded — the resolution of this conflict is what decides which rungs fill.',
    weeklyTrend,
    monthlyTrend,
  };
}

/** Build the accumulation ladder for one symbol from its W and M structure. */
export function buildDcaPlan(input: DcaInput): DcaPlan {
  const { symbol, lastPrice, weekly, monthly } = input;
  const profile = input.profile ?? 'balanced';

  const weeklyCompleted = weekly.completed;
  const monthlyCompleted = monthly.completed;

  const lastWeekly = weeklyCompleted[weeklyCompleted.length - 1];
  const prevWeekly = weeklyCompleted[weeklyCompleted.length - 2];
  const lastMonthly = monthlyCompleted[monthlyCompleted.length - 1];
  const prevMonthly = monthlyCompleted[monthlyCompleted.length - 2];

  const weeklyType = lastWeekly && prevWeekly ? classifyCandle(prevWeekly, lastWeekly) : null;
  const monthlyType = lastMonthly && prevMonthly ? classifyCandle(prevMonthly, lastMonthly) : null;

  const monthlyPivotLows = findPivotLows(monthlyCompleted).map((c) => c.low);
  const lastMonthlyPivotLow =
    monthlyPivotLows.length > 0 ? monthlyPivotLows[monthlyPivotLows.length - 1] : null;

  const candidates = candidateLevels(input);
  let selected = selectRungs(candidates, lastPrice, profile);
  if (selected.length < 2 && lastPrice > 0) {
    const fill = measuredRungs(lastPrice, averageRangePct(weeklyCompleted), 3);
    selected = selectRungs([...candidates, ...fill], lastPrice, profile);
  }

  const weights = allocations(selected.length, profile);
  const rungs: DcaRung[] = selected.map((c, i) => ({
    price: round(c.price),
    discountPct: pct(((lastPrice - c.price) / lastPrice) * 100),
    allocationPct: weights[i],
    source: c.source,
    timeframe: c.timeframe,
    rationale: c.rationale,
  }));

  const averageFill =
    rungs.length > 0
      ? round(rungs.reduce((sum, r) => sum + r.price * r.allocationPct, 0) / 100)
      : null;

  const { stance, reason, weeklyTrend, monthlyTrend } = readStance(input, lastMonthlyPivotLow);

  return {
    symbol,
    lastPrice,
    stance,
    stanceReason: reason,
    weeklyType,
    monthlyType,
    weeklyTrend,
    monthlyTrend,
    rungs,
    averageFill,
  };
}
