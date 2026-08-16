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
 */
export function reconcilePlan(
  existing: SymbolPosition | undefined,
  planRungs: DcaRung[],
  today: string,
): SymbolPosition {
  const filled = (existing?.rungs ?? []).filter((r) => r.filledOn !== null);
  const resting = (existing?.rungs ?? []).filter((r) => r.filledOn === null);

  const rungs: TrackedRung[] = planRungs
    // A level already bought is not re-bid.
    .filter((r) => !filled.some((f) => samePrice(f.price, r.price)))
    .map((r) => {
      const carried = resting.find((old) => samePrice(old.price, r.price));
      const unmoved = carried !== undefined && carried.price === r.price;
      return {
        price: r.price,
        allocationPct: r.allocationPct,
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
  /** Share of the plan bought so far */
  deployedPct: number;
  /** Weighted average if every rung of the current plan fills */
  plannedAverage: number | null;
}

export function costBasis(position: SymbolPosition): CostBasis {
  const filled = position.rungs.filter((r) => r.filledOn !== null);
  const deployed = filled.reduce((sum, r) => sum + r.allocationPct, 0);
  const allWeight = position.rungs.reduce((sum, r) => sum + r.allocationPct, 0);

  const weighted = (rungs: TrackedRung[]): number | null => {
    const weight = rungs.reduce((sum, r) => sum + r.allocationPct, 0);
    if (weight === 0) return null;
    return Number((rungs.reduce((sum, r) => sum + r.price * r.allocationPct, 0) / weight).toFixed(6));
  };

  return {
    filledCount: filled.length,
    totalCount: position.rungs.length,
    averageFill: weighted(filled),
    deployedPct: allWeight === 0 ? 0 : Math.round((deployed / allWeight) * 100),
    plannedAverage: weighted(position.rungs),
  };
}
