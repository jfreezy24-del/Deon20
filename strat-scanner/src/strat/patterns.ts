import { Candle, CandleType, Direction } from './types';
import { classifySeries } from './classify';

export interface PatternMatch {
  /** Human name, e.g. "2-1-2 Bullish Reversal" */
  name: string;
  /** Sequence notation ending in the anticipated trigger, e.g. "2d-1-2u" */
  sequence: string;
  direction: Direction;
  isReversal: boolean;
  /** Base confidence contribution for this pattern (before context scoring) */
  baseScore: number;
  /** The bar whose high/low is the trigger (last completed bar) */
  triggerBar: Candle;
  /** Why this particular sequence matters, used to build the explanation */
  rationale: string;
}

/**
 * Detect actionable TheStrat setups off the LAST COMPLETED bar of a series.
 *
 * In TheStrat, an "actionable signal" is defined by the last completed candle:
 * its high and low are the trigger levels, and whichever side breaks first
 * completes a known sequence (2-1-2, 3-1-2, 2-2 reversal, Rev Strat, ...).
 * A single bar can therefore offer both a bullish and a bearish scenario
 * (classically true for inside bars); we return every valid scenario and let
 * the confidence model rank them.
 */
export function detectSetups(candles: Candle[]): PatternMatch[] {
  // Need the trigger bar, the bar before it, and one more bar to classify
  // the bar before it.
  if (candles.length < 3) return [];
  const types = classifySeries(candles);
  const n = candles.length - 1;
  const c1 = candles[n]; // trigger bar = last completed bar
  const t1 = types[n] as CandleType;
  const t2 = types[n - 1] as CandleType;
  const out: PatternMatch[] = [];

  const add = (
    name: string,
    sequence: string,
    direction: Direction,
    isReversal: boolean,
    baseScore: number,
    rationale: string,
  ) => out.push({ name, sequence, direction, isReversal, baseScore, triggerBar: c1, rationale });

  if (t1 === '1') {
    // Inside bar: actionable in both directions; the bar before it sets the context.
    if (t2 === '3') {
      add('3-1-2 Bullish', '3-1-2u', 'bullish', true, 34,
        'An outside bar (3) showed a battle that expanded both sides of the prior range, then the market compressed into an inside bar (1). Breaking the inside bar high resolves that compression upward — a 3-1-2 is one of the highest-conviction Strat sequences because the breakout comes directly out of contracting volatility after a full range expansion.');
      add('3-1-2 Bearish', '3-1-2d', 'bearish', true, 34,
        'An outside bar (3) expanded both sides of the prior range, then price compressed into an inside bar (1). Breaking the inside bar low resolves that compression downward — a 3-1-2 fires straight out of contracting volatility after a full range expansion.');
    } else if (t2 === '2d') {
      add('2-1-2 Bullish Reversal', '2d-1-2u', 'bullish', true, 32,
        'Sellers broke the prior low (2d) but could not follow through — the next bar went inside (1), showing downside momentum stalled. A break above the inside bar high traps late shorts and flips the bar-by-bar order flow from sell-side to buy-side, the classic 2-1-2 bullish reversal.');
      add('2-1-2 Bearish Continuation', '2d-1-2d', 'bearish', false, 27,
        'Sellers broke the prior low (2d), then the market rested in an inside bar (1). A break of the inside bar low resumes the existing sell-side sequence — a 2-1-2 downside continuation out of consolidation.');
    } else if (t2 === '2u') {
      add('2-1-2 Bullish Continuation', '2u-1-2u', 'bullish', false, 27,
        'Buyers broke the prior high (2u), then the market rested in an inside bar (1). A break of the inside bar high resumes the existing buy-side sequence — a 2-1-2 upside continuation out of consolidation.');
      add('2-1-2 Bearish Reversal', '2u-1-2d', 'bearish', true, 32,
        'Buyers broke the prior high (2u) but could not follow through — the next bar went inside (1), showing upside momentum stalled. A break below the inside bar low traps late longs and flips the order flow from buy-side to sell-side, the classic 2-1-2 bearish reversal.');
    } else {
      add('1-1-2 Bullish', '1-1-2u', 'bullish', false, 26,
        'Back-to-back inside bars (1-1) mean two full sessions of compression — energy is being stored. A break of the second inside bar high releases that energy upward with very tight, well-defined risk.');
      add('1-1-2 Bearish', '1-1-2d', 'bearish', false, 26,
        'Back-to-back inside bars (1-1) mean two full sessions of compression — energy is being stored. A break of the second inside bar low releases that energy downward with very tight, well-defined risk.');
    }
  } else if (t1 === '2d') {
    if (t2 === '1') {
      add('Rev Strat (1-2-2) Bullish', '1-2d-2u', 'bullish', true, 31,
        'Price compressed into an inside bar (1), broke down out of it (2d), and the breakdown is failing. Taking out the 2d bar high turns the failed breakdown into a 2u — a Rev Strat — where everyone who sold the inside-bar break is now trapped and fuels the move up.');
    } else if (t2 === '3') {
      add('3-2-2 Bullish Reversal', '3-2d-2u', 'bullish', true, 30,
        'After an outside bar (3), sellers pushed a 2d but the move is stalling at the lows of an already-stretched range. A break back above the 2d bar high is a 3-2-2 reversal: the downside probe of the broadening formation failed and price targets the opposite side of it.');
    } else {
      add('2-2 Bullish Reversal', '2d-2u', 'bullish', true, 25,
        'The last bar broke the prior low (2d). If price now takes out that bar’s high, the bar-by-bar sequence flips from 2-down to 2-up in a single rotation — a 2-2 reversal. The failed breakdown leaves trapped sellers below, who must buy back as price moves against them.');
      add('2-2 Bearish Continuation', '2d-2d', 'bearish', false, 22,
        'The last bar broke the prior low (2d) and momentum is with the sellers. A break of that bar’s low continues the 2-down sequence — trend continuation in full sell-side order flow.');
    }
  } else if (t1 === '2u') {
    if (t2 === '1') {
      add('Rev Strat (1-2-2) Bearish', '1-2u-2d', 'bearish', true, 31,
        'Price compressed into an inside bar (1), broke up out of it (2u), and the breakout is failing. Taking out the 2u bar low turns the failed breakout into a 2d — a Rev Strat — where everyone who bought the inside-bar break is now trapped and fuels the move down.');
    } else if (t2 === '3') {
      add('3-2-2 Bearish Reversal', '3-2u-2d', 'bearish', true, 30,
        'After an outside bar (3), buyers pushed a 2u but the move is stalling at the highs of an already-stretched range. A break back below the 2u bar low is a 3-2-2 reversal: the upside probe of the broadening formation failed and price targets the opposite side of it.');
    } else {
      add('2-2 Bearish Reversal', '2u-2d', 'bearish', true, 25,
        'The last bar broke the prior high (2u). If price now takes out that bar’s low, the sequence flips from 2-up to 2-down in a single rotation — a 2-2 reversal. The failed breakout leaves trapped buyers above, who must sell as price moves against them.');
      add('2-2 Bullish Continuation', '2u-2u', 'bullish', false, 22,
        'The last bar broke the prior high (2u) and momentum is with the buyers. A break of that bar’s high continues the 2-up sequence — trend continuation in full buy-side order flow.');
    }
  } else if (t1 === '3') {
    add('3-2 Bullish', '3-2u', 'bullish', false, 20,
      'The last bar was an outside bar (3) — a full engulfing of the prior range. A break of its high turns it into directional 2-up follow-through; range is already expanded, so this is a momentum play with wider risk.');
    add('3-2 Bearish', '3-2d', 'bearish', false, 20,
      'The last bar was an outside bar (3) — a full engulfing of the prior range. A break of its low turns it into directional 2-down follow-through; range is already expanded, so this is a momentum play with wider risk.');
  }

  return out;
}
