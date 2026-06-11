import { Candle, Direction, Levels } from './types';

function tickFor(price: number): number {
  if (price >= 1000) return 0.1;
  if (price >= 1) return 0.01;
  return 0.0001;
}

const round = (v: number) => Number(v.toFixed(v >= 1 ? 2 : 5));

/**
 * Entry / stop / targets for a setup.
 *
 * Entry  = break of the trigger bar (stop order one tick past its high/low).
 * Stop   = opposite side of the trigger bar — in TheStrat the setup is wrong
 *          the moment the other side of the actionable bar is taken out.
 * Target = "magnitude": the nearest meaningful prior pivot in the trade
 *          direction (Strat trades are measured to the previous broadening-
 *          formation point). If no pivot exists beyond entry, a measured
 *          1.5R / 2.5R projection is used instead.
 */
export function computeLevels(
  completed: Candle[],
  direction: Direction,
  lookback = 20,
): Levels {
  const trigger = completed[completed.length - 1];
  const tick = tickFor(trigger.close);
  const bull = direction === 'bullish';

  const entry = bull ? trigger.high + tick : trigger.low - tick;
  const stop = bull ? trigger.low - tick : trigger.high + tick;
  const risk = Math.abs(entry - stop);

  // Pivots: prior highs (bull) / lows (bear) beyond entry, excluding the
  // trigger bar itself, scanning the recent window.
  const start = Math.max(0, completed.length - 1 - lookback);
  const window = completed.slice(start, completed.length - 1);
  const beyond = window
    .map((c) => (bull ? c.high : c.low))
    .filter((p) => (bull ? p > entry : p < entry))
    .sort((a, b) => (bull ? a - b : b - a));

  const t1 = beyond.length > 0 ? beyond[0] : bull ? entry + 1.5 * risk : entry - 1.5 * risk;
  const farthest = beyond.length > 0 ? beyond[beyond.length - 1] : t1;
  const measured2 = bull ? entry + 2.5 * risk : entry - 2.5 * risk;
  const t2 = bull ? Math.max(farthest, measured2) : Math.min(farthest, measured2);

  const rr = (target: number) => (risk > 0 ? Math.abs(target - entry) / risk : 0);

  return {
    entry: round(entry),
    stop: round(stop),
    target1: round(t1),
    target2: round(t2),
    rr1: Number(rr(t1).toFixed(2)),
    rr2: Number(rr(t2).toFixed(2)),
  };
}
