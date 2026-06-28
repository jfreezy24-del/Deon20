import { PatternMatch } from './patterns';
import { ContinuityScore } from './continuity';
import { Levels, Timeframe } from './types';

const TF_NAME: Record<Timeframe, string> = {
  '4H': '4-hour',
  D: 'daily',
  W: 'weekly',
  M: 'monthly',
};

export function buildExplanation(
  symbol: string,
  timeframe: Timeframe,
  pattern: PatternMatch,
  continuity: ContinuityScore,
  levels: Levels,
  triggered: boolean,
): string {
  const parts: string[] = [];

  const breakSide = pattern.direction === 'bullish' ? 'high' : 'low';
  parts.push(
    `${symbol} is showing a potential ${pattern.name} (${pattern.sequence}) on the ${TF_NAME[timeframe]} chart — a ${pattern.scenario} that would play out to the ${pattern.direction === 'bullish' ? 'upside' : 'downside'} if the next bar (the "?") breaks the actionable bar's ${breakSide}.`,
  );
  parts.push(pattern.rationale);

  if (continuity.full) {
    parts.push(
      'Full timeframe continuity is in place: the current 4-hour, daily, weekly and monthly candles are all trading in the direction of this setup, so every active timeframe participant is pointed the same way.',
    );
  } else if (continuity.aligned.length > 0 && continuity.opposed.length > 0) {
    parts.push(
      `Timeframe continuity is mixed: the ${continuity.aligned.map((t) => TF_NAME[t]).join(' and ')} candle(s) support the trade, while the ${continuity.opposed.map((t) => TF_NAME[t]).join(' and ')} candle(s) are still against it — a cleaner entry comes when the opposing timeframe(s) flip.`,
    );
  } else if (continuity.aligned.length > 0) {
    parts.push(
      `The ${continuity.aligned.map((t) => TF_NAME[t]).join(' and ')} candle(s) are already trading with the setup.`,
    );
  } else if (continuity.opposed.length > 0) {
    parts.push(
      `Caution: current higher-timeframe candles (${continuity.opposed.map((t) => TF_NAME[t]).join(', ')}) are trading against this setup, so this is a counter-continuity trade.`,
    );
  }

  parts.push(
    triggered
      ? `The trigger at ${levels.entry} has already been taken out, so the "?" has resolved this way and the setup is in force. It is wrong if price trades back through ${levels.stop}.`
      : `This is still only potential: it becomes actionable on a break of ${levels.entry}, and until that prints nothing is in force — the "?" bar could just as easily break the other side. The setup is invalidated at ${levels.stop} (the other side of the actionable bar).`,
  );

  parts.push(
    `Magnitude: the first objective is the prior pivot at ${levels.target1} (${levels.rr1}R), with extended magnitude toward ${levels.target2} (${levels.rr2}R).`,
  );

  return parts.join(' ');
}
