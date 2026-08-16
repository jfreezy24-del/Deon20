import { Candle } from '../strat/types';
import {
  buildDcaPlan,
  DcaPlan,
  DcaRung,
  DcaStance,
  LadderProfile,
  ladderWeights,
} from '../strat/dca';
import { aggregate, monthStart, weekStart } from '../strat/backtest';
import {
  applyFills,
  expireStaleRungs,
  isoDate,
  reconcilePlan,
  SymbolPosition,
} from './ladderState';

/**
 * Historical replay of the DCA ladder.
 *
 * The signal engine now has three tools arguing about whether it works. The
 * ladder — four structural rung sources, a tier-based size skew, a depth cap
 * and a 90-day expiry — has never been tested at all. Every one of those
 * choices was reasoned about and shipped.
 *
 * This replays the ladder week by week over history and asks the questions
 * that were never asked:
 *
 *  - Do **structural** rungs beat bidding at round percentages below spot?
 *    That is the control that matters. A ladder that buys below the average
 *    price available is not evidence the levels mean anything — any ladder
 *    does that. The question is whether *these* levels do it better.
 *  - Do the rungs actually **fill**? A perfect average price on 12% of the
 *    budget is worse than a mediocre one on all of it, and the report refuses
 *    to quote one without the other.
 *  - Which of the four **rung sources** earns its place?
 *  - Is **90 days** the right expiry, or does it cancel bids that were about
 *    to fill?
 *  - Does the **tier skew** pay — would majors do better back-loaded?
 *  - Was **DEFENSIVE** ever the correct call?
 *
 * It runs the production functions — `buildDcaPlan`, `reconcilePlan`,
 * `applyFills`, `expireStaleRungs` — rather than a reimplementation, so what
 * is measured is the system that actually ships. A backtest of a parallel
 * ladder would be a test of the backtest.
 *
 * No look-ahead: weekly and monthly candles are rebuilt from daily bars with
 * the same partial-aware aggregation the signal backtest uses, so a plan built
 * at a week's close sees only the days that had traded by then.
 */

export type RungStyle =
  /** The real engine: prior week/month lows and weekly/monthly pivots. */
  | 'structural'
  /** Control: fixed percentages below spot, identical sizing. */
  | 'naive';

export interface LadderBacktestOptions {
  profile: LadderProfile;
  ttlDays: number;
  /** Cash allotted per symbol for the whole replay. */
  budget: number;
  rungs: RungStyle;
  /** Depths for the control ladder, in percent below spot. */
  naiveDepths: number[];
  /** Weekly bars required before the first plan is published. */
  minWeeks: number;
}

export const DEFAULT_LADDER_BACKTEST_OPTIONS: LadderBacktestOptions = {
  profile: 'balanced',
  ttlDays: 90,
  budget: 10_000,
  rungs: 'structural',
  // Roughly the depth band the structural ladder occupies, so the control is
  // bidding in the same neighbourhood rather than being handicapped by sitting
  // somewhere the market never went.
  naiveDepths: [8, 16, 26, 38],
  minWeeks: 30,
};

export interface LadderFill {
  date: string;
  price: number;
  allocationPct: number;
  source: string;
  timeframe: 'W' | 'M';
  /** Days the rung rested before it filled. */
  ageDays: number;
  /** How far below spot the rung sat when it was placed. */
  discountPct: number;
  spend: number;
  units: number;
}

export interface StanceObservation {
  date: string;
  stance: DcaStance;
  price: number;
  /** Percent change in price over the following 30 / 90 days, when known. */
  forward30: number | null;
  forward90: number | null;
}

export interface StrategyResult {
  label: string;
  budget: number;
  deployed: number;
  cash: number;
  units: number;
  /** Weighted average price paid, or null if nothing was bought. */
  averageCost: number | null;
  /** Units at the final price, plus whatever cash was never spent. */
  terminalValue: number;
}

export interface LadderRun extends StrategyResult {
  symbol: string;
  profile: LadderProfile;
  style: RungStyle;
  firstPlanDate?: string;
  lastDate?: string;
  finalPrice: number;
  /** Mean daily close from the first plan onward — the price on offer. */
  meanPrice: number;
  fills: LadderFill[];
  plansPublished: number;
  expiredCount: number;
  /**
   * Spend the ladder asked for and did not have.
   *
   * Allocations are re-normalised to 100% across each fresh plan while filled
   * rungs are carried forward, so a ladder that fills and then republishes can
   * commit to more than the budget. Whether that happens in practice is one of
   * the things nobody had checked.
   */
  unfundedSpend: number;
  stances: StanceObservation[];
  /**
   * Distinct rungs placed, by source. Counted at first placement only — a
   * level the next plan still wants keeps its original placement and is not
   * counted twice, exactly as `reconcilePlan` treats it. Without this a fill
   * count is unreadable: a source that is offered constantly and fills rarely
   * looks identical to one that is offered rarely and always fills.
   */
  placementsBySource: Record<string, number>;
}

const round6 = (v: number) => Number(v.toFixed(6));

/** A fixed-percentage ladder with the same sizing as the real one. */
export function naivePlan(
  symbol: string,
  lastPrice: number,
  profile: LadderProfile,
  depths: number[],
): DcaPlan {
  const weights = ladderWeights(depths.length, profile);
  const rungs: DcaRung[] = depths.map((d, i) => ({
    price: round6(lastPrice * (1 - d / 100)),
    discountPct: d,
    allocationPct: weights[i],
    source: `Fixed −${d}%`,
    timeframe: 'W',
    rationale: 'Control rung: a round percentage below spot, with no structural claim at all.',
  }));
  return {
    symbol,
    lastPrice,
    stance: 'neutral',
    stanceReason: 'Control ladder — stance is not modelled.',
    weeklyType: null,
    monthlyType: null,
    weeklyTrend: null,
    monthlyTrend: null,
    rungs,
    averageFill:
      rungs.length > 0
        ? round6(rungs.reduce((s, r) => s + r.price * r.allocationPct, 0) / 100)
        : null,
  };
}

const daysBetween = (fromIso: string, toIso: string): number =>
  Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);

/**
 * Replay one symbol's ladder over its daily history.
 *
 * The weekly job publishes on Monday, an hour after the weekly candle closes,
 * so the replay publishes at each week's final daily close: the week just
 * ended is complete, and the month is partial through that day. Fills are then
 * checked against every subsequent daily bar, exactly as the daily job does.
 */
export function replayLadder(
  symbol: string,
  daily: Candle[],
  options: Partial<LadderBacktestOptions> = {},
): LadderRun {
  const opts: LadderBacktestOptions = { ...DEFAULT_LADDER_BACKTEST_OPTIONS, ...options };
  const bars = [...daily].sort((a, b) => a.time - b.time);

  const empty: LadderRun = {
    label: `${opts.rungs} ladder`,
    symbol,
    profile: opts.profile,
    style: opts.rungs,
    budget: opts.budget,
    deployed: 0,
    cash: opts.budget,
    units: 0,
    averageCost: null,
    terminalValue: opts.budget,
    finalPrice: 0,
    meanPrice: 0,
    fills: [],
    plansPublished: 0,
    expiredCount: 0,
    unfundedSpend: 0,
    stances: [],
    placementsBySource: {},
  };
  if (bars.length < 200) return empty;

  const weeklyCompleted: Candle[] = [];
  const monthlyCompleted: Candle[] = [];
  let weekBars: Candle[] = [];
  let monthBars: Candle[] = [];
  let curWeek = weekStart(bars[0].time);
  let curMonth = monthStart(bars[0].time);
  // The first bucket of each is a fragment unless history happens to start on
  // a Monday or a first-of-month; dropping it costs one week and one month.
  let firstWeek = true;
  let firstMonth = true;

  let position: SymbolPosition | undefined;
  let cash = opts.budget;
  let units = 0;
  let deployed = 0;
  let unfundedSpend = 0;
  let expiredCount = 0;
  let plansPublished = 0;
  let firstPlanIndex = -1;
  const fills: LadderFill[] = [];
  const placementsBySource: Record<string, number> = {};
  const stances: StanceObservation[] = [];
  /** Rung price → spot and pricing date of its current placement. */
  const placedAt = new Map<string, { spot: number; since: string }>();

  const priceAfter = (i: number, days: number): number | null => {
    const target = bars[i].time + days * 86_400;
    const found = bars.find((b, j) => j > i && b.time >= target);
    return found ? found.close : null;
  };

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];

    const wk = weekStart(bar.time);
    if (wk !== curWeek) {
      if (weekBars.length > 0 && !firstWeek) weeklyCompleted.push(aggregate(weekBars, curWeek));
      firstWeek = false;
      weekBars = [];
      curWeek = wk;
    }
    const mo = monthStart(bar.time);
    if (mo !== curMonth) {
      if (monthBars.length > 0 && !firstMonth) monthlyCompleted.push(aggregate(monthBars, curMonth));
      firstMonth = false;
      monthBars = [];
      curMonth = mo;
    }
    weekBars.push(bar);
    monthBars.push(bar);

    const next = bars[i + 1];
    const weekEnds = !next || weekStart(next.time) !== curWeek;
    if (!weekEnds) continue;

    // The week that just ended is complete and joins the history.
    const closedWeek = aggregate(weekBars, curWeek);
    const weeklyHistory = [...weeklyCompleted, closedWeek];
    if (weeklyHistory.length < opts.minWeeks) continue;

    const today = isoDate(bar.time * 1000);
    const lastPrice = bar.close;

    /* Fills and expiry first — the daily job runs before the weekly one
       republishes, and a rung that filled must not be re-bid. */
    if (position) {
      const filled = applyFills(position, bars.slice(0, i + 1));
      position = filled.position;

      for (const f of filled.fills) {
        const meta = placedAt.get(f.price.toFixed(8));
        const requested = (f.allocationPct / 100) * opts.budget;
        const spend = Math.min(cash, requested);
        unfundedSpend += requested - spend;
        if (spend > 0 && f.price > 0) {
          cash -= spend;
          deployed += spend;
          units += spend / f.price;
        }
        fills.push({
          date: f.filledOn,
          price: f.price,
          allocationPct: f.allocationPct,
          source: f.source,
          timeframe: (position.rungs.find((r) => r.price === f.price)?.timeframe ?? 'W') as
            | 'W'
            | 'M',
          ageDays: meta ? daysBetween(meta.since, f.filledOn) : 0,
          discountPct: meta && meta.spot > 0 ? ((meta.spot - f.price) / meta.spot) * 100 : 0,
          spend,
          units: spend > 0 && f.price > 0 ? spend / f.price : 0,
        });
      }

      const aged = expireStaleRungs(position, today, opts.ttlDays);
      position = aged.position;
      expiredCount += aged.expired.length;
    }

    /* Publish this week's plan. */
    const monthlyForming = monthBars.length > 0 ? aggregate(monthBars, curMonth) : null;
    const plan =
      opts.rungs === 'naive'
        ? naivePlan(symbol, lastPrice, opts.profile, opts.naiveDepths)
        : buildDcaPlan({
            symbol,
            lastPrice,
            // The weekly job runs an hour after the close, when the new weekly
            // bar is minutes old and its direction is noise. Treating the
            // just-closed week as current is what the report actually means.
            weekly: { completed: weeklyHistory, forming: null },
            monthly: { completed: monthlyCompleted, forming: monthlyForming },
            profile: opts.profile,
          });

    if (firstPlanIndex < 0) firstPlanIndex = i;
    plansPublished += 1;
    stances.push({
      date: today,
      stance: plan.stance,
      price: lastPrice,
      forward30: pctChange(lastPrice, priceAfter(i, 30)),
      forward90: pctChange(lastPrice, priceAfter(i, 90)),
    });

    position = { ...reconcilePlan(position, plan.rungs, today), symbol };

    // Count a placement when the reconciliation actually priced a new bid.
    // Keying off the plan instead under-counts: two rungs at the same price in
    // different weeks look like one, and the fill count then exceeds the
    // placement count. `pricedOn === today` is exactly "a new order went in".
    for (const r of position.rungs) {
      if (r.filledOn !== null) continue;
      const since = r.pricedOn ?? r.placedOn;
      if (since !== today) continue;
      placementsBySource[r.source] = (placementsBySource[r.source] ?? 0) + 1;
      placedAt.set(r.price.toFixed(8), { spot: lastPrice, since });
    }
  }

  const finalPrice = bars[bars.length - 1].close;
  const window = firstPlanIndex >= 0 ? bars.slice(firstPlanIndex) : bars;
  const meanPrice = window.reduce((s, b) => s + b.close, 0) / window.length;

  return {
    label: opts.rungs === 'naive' ? 'Fixed-percentage ladder' : 'Structural ladder',
    symbol,
    profile: opts.profile,
    style: opts.rungs,
    budget: opts.budget,
    deployed,
    cash,
    units,
    averageCost: units > 0 ? deployed / units : null,
    terminalValue: units * finalPrice + cash,
    firstPlanDate: firstPlanIndex >= 0 ? isoDate(bars[firstPlanIndex].time * 1000) : undefined,
    lastDate: isoDate(bars[bars.length - 1].time * 1000),
    finalPrice,
    meanPrice,
    fills,
    plansPublished,
    expiredCount,
    unfundedSpend,
    stances,
    placementsBySource,
  };
}

const pctChange = (from: number, to: number | null): number | null =>
  to === null || from <= 0 ? null : ((to - from) / from) * 100;

/* ── benchmarks ────────────────────────────────────────────────────────── */

/**
 * Deploy the whole budget at the first plan's price.
 *
 * The honest floor for any accumulation scheme: if a ladder cannot beat simply
 * buying on the day you decided to buy, its complexity is not paying for
 * itself.
 */
export function spotBuy(bars: Candle[], fromIndex: number, budget: number): StrategyResult {
  const entry = bars[fromIndex]?.close ?? 0;
  const final = bars[bars.length - 1]?.close ?? 0;
  const units = entry > 0 ? budget / entry : 0;
  return {
    label: 'Buy it all at plan time',
    budget,
    deployed: entry > 0 ? budget : 0,
    cash: entry > 0 ? 0 : budget,
    units,
    averageCost: units > 0 ? budget / units : null,
    terminalValue: units * final + (entry > 0 ? 0 : budget),
  };
}

/**
 * An equal slice every week for `weeks`, ignoring price entirely.
 *
 * The benchmark most people actually run, and the one a structural ladder has
 * to beat to justify the machinery.
 */
export function weeklyDca(
  bars: Candle[],
  fromIndex: number,
  budget: number,
  weeks: number,
): StrategyResult {
  const slice = budget / weeks;
  let cash = budget;
  let units = 0;
  let deployed = 0;
  let taken = 0;

  let cur = weekStart(bars[fromIndex]?.time ?? 0);
  for (let i = fromIndex; i < bars.length && taken < weeks; i++) {
    const wk = weekStart(bars[i].time);
    if (i > fromIndex && wk === cur) continue;
    cur = wk;
    const price = bars[i].close;
    if (price <= 0) continue;
    const spend = Math.min(cash, slice);
    cash -= spend;
    deployed += spend;
    units += spend / price;
    taken += 1;
  }

  const final = bars[bars.length - 1]?.close ?? 0;
  return {
    label: `Weekly DCA (${weeks} weeks)`,
    budget,
    deployed,
    cash,
    units,
    averageCost: units > 0 ? deployed / units : null,
    terminalValue: units * final + cash,
  };
}

/** Index of the first bar at or after `date`, for aligning benchmarks. */
export function indexOfDate(bars: Candle[], date: string): number {
  const t = Date.parse(`${date}T00:00:00Z`) / 1000;
  const i = bars.findIndex((b) => b.time >= t);
  return i < 0 ? 0 : i;
}
