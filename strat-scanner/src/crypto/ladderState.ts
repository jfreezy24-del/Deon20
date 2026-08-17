import { Candle } from '../strat/types';
import { DcaRung } from '../strat/dca';

/**
 * The ladder's memory.
 *
 * The weekly report plans where the bids go; nothing until now recorded what
 * happened to them. This tracks each published rung from the day it was placed
 * until it fills or goes stale, which turns the report from a suggestion into
 * a position record: what actually filled, at what average, and how much of
 * the plan is deployed.
 *
 * State is committed to the repository rather than cached. A cache is
 * evictable, and a position record you lose is worse than one you never had.
 */

export interface TrackedRung {
  price: number;
  allocationPct: number;
  source: string;
  timeframe: 'W' | 'M';
  /** ISO date this level was first published — the staleness clock. */
  placedOn: string;
  /**
   * ISO date the rung's CURRENT price was set, which is the earliest a fill
   * can happen.
   *
   * Distinct from `placedOn` on purpose. `placedOn` is carried forward when a
   * level drifts inside the same-price band, so republishing the ladder every
   * week cannot reset the expiry clock. Using that same date to bound fills
   * was wrong: a level drifting *upward* within tolerance would be filled
   * retroactively by a bar that traded before the bid was ever that high.
   *
   * Optional so records written before this existed still load; they fall
   * back to `placedOn`, which is what they were already using.
   */
  pricedOn?: string;
  /** ISO date price first traded down to it, null while it is still resting */
  filledOn: string | null;
}

export interface SymbolPosition {
  symbol: string;
  /** ISO date the plan was last rebuilt */
  planDate: string;
  rungs: TrackedRung[];
}

export interface LadderState {
  version: 1;
  /** ISO date fills were last checked, so a gap in runs is not missed */
  lastCheckedOn: string | null;
  positions: Record<string, SymbolPosition>;
}

export const emptyState = (): LadderState => ({ version: 1, lastCheckedOn: null, positions: {} });

export const isoDate = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

const daysBetween = (fromIso: string, toIso: string): number =>
  Math.floor((Date.parse(toIso) - Date.parse(fromIso)) / 86_400_000);

/** Two levels within half a percent are the same place on the chart. */
const samePrice = (a: number, b: number): boolean => Math.abs(a - b) / b < 0.005;

/**
 * Below this much budget left, no further bids are published. A rung for a
 * fraction of a percent of the position is not an order anyone would place.
 */
const MIN_REMAINING_PCT = 0.5;

const pct2 = (v: number) => Number(v.toFixed(2));

/**
 * The share of the budget still available to bid with.
 *
 * `allocationPct` is a share of one accumulation campaign, not of one week's
 * plan: the rungs of a single position sum to 100 across its whole life. Filled
 * rungs are the position and are kept forever, so this only ever shrinks. At
 * zero the campaign for that symbol is complete and the ladder stops bidding.
 *
 * Positions written before allocations were budgeted may already show more than
 * 100% filled. Those clamp to zero and publish nothing further, which is the
 * conservative reading — reset the symbol's state if the over-spend was on
 * paper only.
 */
export function remainingBudgetPct(position: SymbolPosition | undefined): number {
  const spent = (position?.rungs ?? [])
    .filter((r) => r.filledOn !== null)
    .reduce((sum, r) => sum + r.allocationPct, 0);
  return Math.max(0, pct2(100 - spent));
}

/**
 * Spread `remaining` percent of the budget across rungs in their planned
 * proportions.
 *
 * Normalising by the planned weights' own total rather than by 100 matters:
 * once levels already bought have been filtered out, the survivors sum to less
 * than 100, and they should still deploy the whole remaining budget between
 * them rather than leaving the bought rung's share stranded.
 */
function budgetedAllocations(planned: number[], remaining: number): number[] {
  const total = planned.reduce((a, b) => a + b, 0);
  if (planned.length === 0 || total <= 0) return planned.map(() => 0);
  const scaled = planned.map((p) => pct2((p / total) * remaining));
  // Rounding drift lands on the deepest rung, where a fraction matters least.
  const drift = pct2(remaining - scaled.reduce((a, b) => a + b, 0));
  scaled[scaled.length - 1] = pct2(scaled[scaled.length - 1] + drift);
  return scaled;
}

export interface FillEvent {
  symbol: string;
  price: number;
  allocationPct: number;
  source: string;
  filledOn: string;
}

/**
 * Fold a freshly built plan into what is already tracked.
 *
 * Filled rungs are history and are kept forever. Unfilled ones are replaced by
 * the new plan — but a level the new plan still wants keeps its original
 * placement date. Without that, republishing the same ladder every week would
 * reset the clock on every rung and nothing could ever go stale.
 *
 * The price it is bid at is tracked separately (`pricedOn`). A level that
 * drifts by any amount is a new order at a new price even when it is the same
 * place on the chart, and it must not inherit fill eligibility from bars that
 * traded while the bid sat somewhere else.
 *
 * Allocations are budgeted against what is left, not taken from the plan as
 * published. `buildDcaPlan` always spreads 100% across the rungs it produces,
 * because it is building one week's ladder and knows nothing about the
 * position. Appending that to a position that has already filled would commit
 * to more than the budget — republish weekly for a year and the ladder is
 * nominally several times its own size, while `costBasis` keeps reporting a
 * comfortable percentage because it divides by the inflated total.
 */
export function reconcilePlan(
  existing: SymbolPosition | undefined,
  planRungs: DcaRung[],
  today: string,
): SymbolPosition {
  const filled = (existing?.rungs ?? []).filter((r) => r.filledOn !== null);
  const resting = (existing?.rungs ?? []).filter((r) => r.filledOn === null);

  // A level already bought is not re-bid.
  const wanted = planRungs.filter((r) => !filled.some((f) => samePrice(f.price, r.price)));

  const remaining = remainingBudgetPct(existing);
  const budgeted =
    remaining < MIN_REMAINING_PCT
      ? []
      : budgetedAllocations(
          wanted.map((r) => r.allocationPct),
          remaining,
        );

  const rungs: TrackedRung[] = wanted.slice(0, budgeted.length).map((r, i) => {
    const carried = resting.find((old) => samePrice(old.price, r.price));
    const unmoved = carried !== undefined && carried.price === r.price;
    return {
      price: r.price,
      allocationPct: budgeted[i],
      source: r.source,
      timeframe: r.timeframe,
      placedOn: carried?.placedOn ?? today,
      pricedOn: unmoved ? (carried.pricedOn ?? carried.placedOn) : today,
      filledOn: null,
    };
  });

  return {
    symbol: existing?.symbol ?? '',
    planDate: today,
    rungs: [...filled, ...rungs],
  };
}

/**
 * Mark rungs that price traded down to.
 *
 * A touch is a fill: these are resting limit orders, so any bar whose low
 * reaches the level would have executed it. Only bars from the day the rung
 * was priced onward count — a low from before the bid sat at this level never
 * filled it, even if the level is "the same place on the chart".
 */
export function applyFills(
  position: SymbolPosition,
  bars: Candle[],
): { position: SymbolPosition; fills: FillEvent[] } {
  const fills: FillEvent[] = [];
  const rungs = position.rungs.map((rung) => {
    if (rung.filledOn !== null) return rung;

    const eligibleFrom = rung.pricedOn ?? rung.placedOn;
    const hit = bars
      .filter((b) => isoDate(b.time * 1000) >= eligibleFrom)
      .sort((a, b) => a.time - b.time)
      .find((b) => b.low <= rung.price);

    if (!hit) return rung;

    const filledOn = isoDate(hit.time * 1000);
    fills.push({
      symbol: position.symbol,
      price: rung.price,
      allocationPct: rung.allocationPct,
      source: rung.source,
      filledOn,
    });
    return { ...rung, filledOn };
  });

  return { position: { ...position, rungs }, fills };
}

export interface ExpiredRung extends TrackedRung {
  ageDays: number;
}

/**
 * Drop resting rungs that have sat unfilled too long.
 *
 * A level is only meaningful while the structure that produced it still
 * stands. Months later the market has moved on, and a bid priced off a range
 * that no longer exists is a stale order, not a plan. Filled rungs are never
 * expired: they are the position.
 */
export function expireStaleRungs(
  position: SymbolPosition,
  today: string,
  ttlDays: number,
): { position: SymbolPosition; expired: ExpiredRung[] } {
  const expired: ExpiredRung[] = [];
  const rungs = position.rungs.filter((rung) => {
    if (rung.filledOn !== null) return true;
    const ageDays = daysBetween(rung.placedOn, today);
    if (ageDays <= ttlDays) return true;
    expired.push({ ...rung, ageDays });
    return false;
  });
  return { position: { ...position, rungs }, expired };
}

export interface CostBasis {
  filledCount: number;
  totalCount: number;
  /** Weighted average of what actually filled */
  averageFill: number | null;
  /** Share of the symbol's whole budget bought so far */
  deployedPct: number;
  /** Weighted average if every rung of the current plan fills */
  plannedAverage: number | null;
}

export function costBasis(position: SymbolPosition): CostBasis {
  const filled = position.rungs.filter((r) => r.filledOn !== null);
  // Against the whole budget, not against whatever happens to be tracked right
  // now. Dividing by the tracked total reads 100% deployed on a position that
  // filled a third of its size and then found no structure left to bid.
  const deployed = filled.reduce((sum, r) => sum + r.allocationPct, 0);

  const weighted = (rungs: TrackedRung[]): number | null => {
    const weight = rungs.reduce((sum, r) => sum + r.allocationPct, 0);
    if (weight === 0) return null;
    return Number((rungs.reduce((sum, r) => sum + r.price * r.allocationPct, 0) / weight).toFixed(6));
  };

  return {
    filledCount: filled.length,
    totalCount: position.rungs.length,
    averageFill: weighted(filled),
    deployedPct: Math.min(100, Math.round(deployed)),
    plannedAverage: weighted(position.rungs),
  };
}
