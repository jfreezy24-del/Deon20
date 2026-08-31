import { classifyCandle } from '../strat/classify';
import { findPivotHighs, findPivotLows } from '../strat/dca';
import { Candle, CandleType } from '../strat/types';

/**
 * The higher-timeframe facts a written analysis needs, which the ladder alone
 * does not carry: the levels that decide the next move in *both* directions,
 * and where price has previously travelled to on each side.
 *
 * The ladder only ever looks down — it is an accumulation plan. A write-up has
 * to answer "what sends it higher" too, so the upside trigger and the pivots
 * above price are gathered here.
 */

export interface TimeframeStructure {
  /** Strat type of the last completed bar */
  type: CandleType | null;
  /** Break above this and the next bar turns directional up */
  triggerUp: number | null;
  /** Break below this and the next bar turns directional down */
  triggerDown: number | null;
  /**
   * Consecutive completed bars of the same directional type ending at the
   * last one. Three straight lower lows reads very differently from one.
   */
  run: number;
}

export interface AssetStructure {
  weekly: TimeframeStructure;
  monthly: TimeframeStructure;
  /** Places price previously ran out of buyers, nearest first */
  targetsUp: number[];
  /** Places buyers previously stepped in, nearest first */
  targetsDown: number[];
}

const EMPTY: TimeframeStructure = { type: null, triggerUp: null, triggerDown: null, run: 0 };

/** How many completed bars in a row share the last bar's directional type. */
function runLength(types: (CandleType | null)[]): number {
  const last = types[types.length - 1];
  if (last !== '2u' && last !== '2d') return types.length > 0 && last ? 1 : 0;
  let run = 0;
  for (let i = types.length - 1; i >= 0 && types[i] === last; i--) run += 1;
  return run;
}

function timeframeStructure(completed: Candle[]): TimeframeStructure {
  if (completed.length < 2) return EMPTY;
  const last = completed[completed.length - 1];
  const types = completed.map((c, i) => (i === 0 ? null : classifyCandle(completed[i - 1], c)));

  return {
    type: types[types.length - 1],
    // The last completed bar is the actionable one: its high and low are what
    // the next bar has to break to mean anything.
    triggerUp: last.high,
    triggerDown: last.low,
    run: runLength(types),
  };
}

export function buildStructure(
  weeklyCompleted: Candle[],
  monthlyCompleted: Candle[],
  lastPrice: number,
): AssetStructure {
  const weekly = timeframeStructure(weeklyCompleted);
  const monthly = timeframeStructure(monthlyCompleted);

  // Targets are where price goes *after* the decision level breaks, so
  // anything between spot and the trigger is on the way there, not a
  // destination.
  //
  // Measured from the weekly trigger, because that is the level the write-up
  // names, and clamped to spot on both sides. Anchoring to the monthly bar
  // alone let a rally past a stale monthly high produce "targets" the market
  // had already traded through: with spot at $101 and last month's high at
  // $83, levels at $90 and $97 were reported as places price was headed.
  const decisionUp = weekly.triggerUp ?? monthly.triggerUp ?? lastPrice;
  const decisionDown = weekly.triggerDown ?? monthly.triggerDown ?? lastPrice;
  const ceiling = Math.max(decisionUp, lastPrice);
  const floor = Math.min(decisionDown, lastPrice);

  // Confirmed swing points first. A steadily trending market can have none —
  // a swing needs bars on both sides to confirm it — so fall back to the
  // plain highs and lows the market has already traded through. Claiming
  // there is "nothing below" while the ladder rests bids there is worse than
  // naming a rougher level.
  const above = (levels: number[]) => levels.filter((p) => p > ceiling).sort((a, b) => a - b);
  const below = (levels: number[]) => levels.filter((p) => p < floor).sort((a, b) => b - a);

  const pivotHighs = [...findPivotHighs(monthlyCompleted), ...findPivotHighs(weeklyCompleted)];
  const pivotLows = [...findPivotLows(monthlyCompleted), ...findPivotLows(weeklyCompleted)];
  const allBars = [...monthlyCompleted, ...weeklyCompleted];

  const pivotsAbove = above(pivotHighs.map((c) => c.high));
  const pivotsBelow = below(pivotLows.map((c) => c.low));
  const barsAbove = above(allBars.map((c) => c.high));
  const barsBelow = below(allBars.map((c) => c.low));

  // Levels within ~2% of one another describe the same place on the chart.
  const spread = (levels: number[]): number[] => {
    const kept: number[] = [];
    for (const level of levels) {
      if (kept.length >= 2) break;
      if (!kept.some((k) => Math.abs(k - level) / k < 0.02)) kept.push(level);
    }
    return kept;
  };

  const pick = (pivots: number[], bars: number[]) =>
    spread(pivots).length > 0 ? spread(pivots) : spread(bars);

  return {
    weekly,
    monthly,
    targetsUp: pick(pivotsAbove, barsAbove),
    targetsDown: pick(pivotsBelow, barsBelow),
  };
}
