import { Candle, CandleType, Direction, Scenario } from './types';
import { classifySeries } from './classify';

export interface PatternMatch {
  /** Human name of the potential outcome, e.g. "2-1-2 Reversal" */
  name: string;
  /**
   * Unresolved sequence notation ending in "?", e.g. "2u-1-?".
   * The "?" is the next (not-yet-formed) bar that decides the setup.
   */
  sequence: string;
  /** Direction this scenario plays out if the trigger breaks that way */
  direction: Direction;
  /** Whether breaking this way is a reversal or a continuation of order flow */
  scenario: Scenario;
  /** Convenience flag, kept for the confidence model: scenario === 'reversal' */
  isReversal: boolean;
  /**
   * Whether the actionable bar is an inside bar (1) — a true compression
   * "X-1-?" fork where nothing directional has printed yet. These are the
   * cleanest *potential* setups (tight, defined risk, undecided direction).
   */
  compression: boolean;
  /** Base confidence contribution for this pattern (before context scoring) */
  baseScore: number;
  /** The bar whose high/low is the trigger (last completed bar) */
  triggerBar: Candle;
  /** Why this particular scenario matters, used to build the explanation */
  rationale: string;
}

/**
 * Detect POTENTIAL TheStrat setups off the LAST COMPLETED bar of a series.
 *
 * The philosophy here is anticipation, not confirmation: we never wait for a
 * sequence to fully print. Instead we look at the last completed bar (the
 * "actionable" bar) whose high and low are the trigger levels, and we lay out
 * the fork — what happens on a break of each side. The next bar is the "?".
 *
 * The headline case is a directional bar followed by an inside bar, e.g.
 * "2u-1-?": breaking the inside-bar high continues the move up, breaking its
 * low reverses it — a single bar that offers both a potential continuation and
 * a potential reversal. We return every live scenario and let the confidence
 * model rank them.
 */
export function detectPotentialSetups(candles: Candle[]): PatternMatch[] {
  // Need the trigger bar, the bar before it, and one more bar to classify
  // the bar before it.
  if (candles.length < 3) return [];
  const types = classifySeries(candles);
  const n = candles.length - 1;
  const c1 = candles[n]; // trigger bar = last completed bar
  const t1 = types[n] as CandleType;
  const t2 = types[n - 1] as CandleType;
  const out: PatternMatch[] = [];
  const compression = t1 === '1';

  const add = (
    name: string,
    sequence: string,
    direction: Direction,
    scenario: Scenario,
    baseScore: number,
    rationale: string,
  ) =>
    out.push({
      name,
      sequence,
      direction,
      scenario,
      isReversal: scenario === 'reversal',
      compression,
      baseScore,
      triggerBar: c1,
      rationale,
    });

  if (t1 === '1') {
    // Inside bar: the prime potential fork — actionable both ways, with the
    // bar before it setting the reversal/continuation context.
    if (t2 === '3') {
      add('3-1-2 Reversal', '3-1-?', 'bullish', 'reversal', 34,
        'An outside bar (3) expanded both sides of the prior range, then price compressed into an inside bar (1). A break of the inside-bar high (the "?") would resolve that compression upward — a 3-1-2 is one of the highest-conviction Strat forks because the breakout fires straight out of contracting volatility after a full range expansion.');
      add('3-1-2 Reversal', '3-1-?', 'bearish', 'reversal', 34,
        'An outside bar (3) expanded both sides of the prior range, then price compressed into an inside bar (1). A break of the inside-bar low (the "?") would resolve that compression downward — a 3-1-2 fires straight out of contracting volatility after a full range expansion.');
    } else if (t2 === '2d') {
      add('2-1-2 Reversal', '2d-1-?', 'bullish', 'reversal', 32,
        'Sellers broke the prior low (2d) but could not follow through — the next bar went inside (1), showing downside momentum stalled. A break above the inside-bar high (the "?") would trap late shorts and flip the bar-by-bar order flow from sell-side to buy-side: the classic 2-1-2 bullish reversal.');
      add('2-1-2 Continuation', '2d-1-?', 'bearish', 'continuation', 27,
        'Sellers broke the prior low (2d), then the market rested in an inside bar (1). A break of the inside-bar low (the "?") would resume the existing sell-side sequence — a 2-1-2 downside continuation out of consolidation.');
    } else if (t2 === '2u') {
      add('2-1-2 Continuation', '2u-1-?', 'bullish', 'continuation', 27,
        'Buyers broke the prior high (2u), then the market rested in an inside bar (1). A break of the inside-bar high (the "?") would resume the existing buy-side sequence — a 2-1-2 upside continuation out of consolidation.');
      add('2-1-2 Reversal', '2u-1-?', 'bearish', 'reversal', 32,
        'Buyers broke the prior high (2u) but could not follow through — the next bar went inside (1), showing upside momentum stalled. A break below the inside-bar low (the "?") would trap late longs and flip the order flow from buy-side to sell-side: the classic 2-1-2 bearish reversal.');
    } else {
      add('1-1-2 Continuation', '1-1-?', 'bullish', 'continuation', 26,
        'Back-to-back inside bars (1-1) mean two full sessions of compression — energy is being stored. A break of the second inside-bar high (the "?") would release that energy upward with very tight, well-defined risk.');
      add('1-1-2 Continuation', '1-1-?', 'bearish', 'continuation', 26,
        'Back-to-back inside bars (1-1) mean two full sessions of compression — energy is being stored. A break of the second inside-bar low (the "?") would release that energy downward with very tight, well-defined risk.');
    }
  } else if (t1 === '2d') {
    if (t2 === '1') {
      add('Rev Strat (1-2-2) Reversal', '1-2d-?', 'bullish', 'reversal', 31,
        'Price compressed into an inside bar (1), broke down out of it (2d), and the breakdown may be failing. Taking out the 2d bar high (the "?") would turn the failed breakdown into a 2u — a Rev Strat — where everyone who sold the inside-bar break is trapped and fuels the move up.');
    } else if (t2 === '3') {
      add('3-2-2 Reversal', '3-2d-?', 'bullish', 'reversal', 30,
        'After an outside bar (3), sellers pushed a 2d but the move is stretched at the lows of an already-broad range. A break back above the 2d bar high (the "?") would be a 3-2-2 reversal: the downside probe of the broadening formation failed and price targets the opposite side of it.');
    } else {
      add('2-2 Reversal', '2d-?', 'bullish', 'reversal', 25,
        'The last bar broke the prior low (2d). If price now takes out that bar’s high (the "?"), the bar-by-bar sequence flips from 2-down to 2-up in a single rotation — a 2-2 reversal. The failed breakdown leaves trapped sellers below, who must buy back as price moves against them.');
      add('2-2 Continuation', '2d-?', 'bearish', 'continuation', 22,
        'The last bar broke the prior low (2d) and momentum is with the sellers. A break of that bar’s low (the "?") would continue the 2-down sequence — trend continuation in full sell-side order flow.');
    }
  } else if (t1 === '2u') {
    if (t2 === '1') {
      add('Rev Strat (1-2-2) Reversal', '1-2u-?', 'bearish', 'reversal', 31,
        'Price compressed into an inside bar (1), broke up out of it (2u), and the breakout may be failing. Taking out the 2u bar low (the "?") would turn the failed breakout into a 2d — a Rev Strat — where everyone who bought the inside-bar break is trapped and fuels the move down.');
    } else if (t2 === '3') {
      add('3-2-2 Reversal', '3-2u-?', 'bearish', 'reversal', 30,
        'After an outside bar (3), buyers pushed a 2u but the move is stretched at the highs of an already-broad range. A break back below the 2u bar low (the "?") would be a 3-2-2 reversal: the upside probe of the broadening formation failed and price targets the opposite side of it.');
    } else {
      add('2-2 Reversal', '2u-?', 'bearish', 'reversal', 25,
        'The last bar broke the prior high (2u). If price now takes out that bar’s low (the "?"), the sequence flips from 2-up to 2-down in a single rotation — a 2-2 reversal. The failed breakout leaves trapped buyers above, who must sell as price moves against them.');
      add('2-2 Continuation', '2u-?', 'bullish', 'continuation', 22,
        'The last bar broke the prior high (2u) and momentum is with the buyers. A break of that bar’s high (the "?") would continue the 2-up sequence — trend continuation in full buy-side order flow.');
    }
  } else if (t1 === '3') {
    add('3-2 Continuation', '3-?', 'bullish', 'continuation', 20,
      'The last bar was an outside bar (3) — a full engulfing of the prior range. A break of its high (the "?") would turn it into directional 2-up follow-through; range is already expanded, so this is a momentum play with wider risk.');
    add('3-2 Continuation', '3-?', 'bearish', 'continuation', 20,
      'The last bar was an outside bar (3) — a full engulfing of the prior range. A break of its low (the "?") would turn it into directional 2-down follow-through; range is already expanded, so this is a momentum play with wider risk.');
  }

  return out;
}
