import { CandleType, ContinuityMap, TIMEFRAMES, Timeframe } from '../strat/types';
import { DcaPlan } from '../strat/dca';
import { AssetStructure, TimeframeStructure } from './structure';
import { tierFor } from './universe';

/**
 * A written weekly analysis for a single symbol, in plain English.
 *
 * The reasoning is the same one the ladder is built on — a bar either breaks
 * above the previous one, below it, both, or neither; quiet ranges store
 * energy; failed breaks trap people; price travels between the places it
 * previously turned. None of the notation survives. A reader who has never
 * heard of an inside bar should still follow every sentence.
 */

export interface Writeup {
  symbol: string;
  name?: string;
  lastPrice: number;
  weekChangePct: number | null;
  /** What the last month and week actually did */
  standing: string;
  /** The level that puts buyers in control, and where it travels */
  higher: string;
  /** The level that puts sellers in control, and where it travels */
  lower: string;
  /** Whether the timeframes agree */
  picture: string;
  /** Why the ladder is weighted the way it is */
  approach: string;
  /** The single level that decides the week */
  watch: string;
}

const PERIOD: Record<'week' | 'month', { one: string; many: string; prior: string }> = {
  week: { one: 'week', many: 'weeks', prior: "the previous week's" },
  month: { one: 'month', many: 'months', prior: "the previous month's" },
};

/** What a completed bar did, said without notation. */
function describeBar(s: TimeframeStructure, unit: 'week' | 'month'): string {
  const p = PERIOD[unit];
  switch (s.type) {
    case '1':
      return (
        `Last ${p.one} traded entirely inside the ${p.one} before it — a full ${p.one} without ` +
        `breaking above or below. That is a market waiting rather than a market weakening: the ` +
        `tighter the range gets, the more forceful the move when it finally resolves, and the ` +
        `sooner you know if you are wrong.`
      );
    case '2u':
      return s.run >= 2
        ? `That is ${s.run} ${p.many} in a row of higher highs — a sustained move, not a one-off push.`
        : `Last ${p.one} pushed above ${p.prior} high, putting buyers in control of the recent range.`;
    case '2d':
      return s.run >= 2
        ? `That is ${s.run} ${p.many} in a row of lower lows, with no pause and no attempt to bounce. ` +
            `That is the weakest thing a chart can do — there is nothing to buy here yet, only prices worth watching.`
        : `Last ${p.one} broke below ${p.prior} low, handing control to sellers.`;
    case '3':
      return (
        `Last ${p.one} traded both above ${p.prior} high and below its low, and settled nothing. ` +
        `${unit === 'week' ? 'Weeks' : 'Months'} like that widen the range and hand the decision forward.`
      );
    default:
      return `There is not enough history yet to read the ${p.one}ly picture.`;
  }
}

/** The tension between what the month has done and what the week is doing. */
function describeDisagreement(structure: AssetStructure, weekChangePct: number | null): string {
  const { weekly, monthly } = structure;

  // A move that failed says more than which way the last bar went, so these
  // are read before the plainer month-versus-week observations.
  if (weekly.type === '2d' && (weekChangePct ?? 0) > 0) {
    return (
      `The drop did not hold: price is back up this week. Everyone who sold into that dip is now offside, ` +
      `and they buy back if it keeps rising — which is often what turns a failed drop into a rally.`
    );
  }
  if (weekly.type === '2u' && (weekChangePct ?? 0) < 0) {
    return (
      `The push higher did not hold: price has slipped back this week. Everyone who bought that breakout is ` +
      `now underwater, and they sell to get out — which is what caps the next attempt.`
    );
  }
  if (monthly.type === '1' && weekly.type === '2u') {
    return `The week moved; the month has not. That is the first crack in a stalemate rather than a confirmed direction.`;
  }
  if (monthly.type === '1' && weekly.type === '2d') {
    return `The week broke lower while the month is still undecided — a warning, not yet a verdict.`;
  }
  return '';
}

/**
 * Prices as a person writes them: no trailing .00 on a round number, but
 * real precision on sub-dollar coins.
 */
export const money = (v: number): string => {
  const decimals = v >= 1000 ? 0 : v >= 1 ? 2 : v >= 0.01 ? 4 : 6;
  const rounded = Number(v.toFixed(decimals));
  return `$${rounded.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : decimals,
    maximumFractionDigits: decimals,
  })}`;
};

const travelSentence = (targets: number[], direction: 'up' | 'down'): string => {
  const [first, second] = targets;
  if (direction === 'up') {
    if (targets.length === 0) {
      return `There is no prior high left above — it would be trading where it has never traded before, so there is no level to aim at.`;
    }
    return second === undefined
      ? `The last place it ran out of buyers was ${money(first)}.`
      : `The last two places it ran out of buyers were ${money(first)} and ${money(second)}.`;
  }
  if (targets.length === 0) {
    return `There is no prior low left below, which means nothing obvious to catch it.`;
  }
  return second === undefined
    ? `The last place buyers stepped in was ${money(first)}.`
    : `The last two places buyers stepped in were ${money(first)} and ${money(second)}.`;
};

function describeContinuity(map: ContinuityMap): string {
  const name: Record<Timeframe, string> = {
    '4H': '4-hour',
    D: 'daily',
    W: 'weekly',
    M: 'monthly',
  };
  const up = TIMEFRAMES.filter((tf) => map[tf] === 'up');
  const down = TIMEFRAMES.filter((tf) => map[tf] === 'down');

  /** "4-hour, daily and weekly" — an Oxford-free list a person would say. */
  const list = (tfs: Timeframe[]): string => {
    const names = tfs.map((t) => name[t]);
    if (names.length === 0) return '';
    if (names.length === 1) return names[0];
    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  };

  if (up.length === TIMEFRAMES.length) {
    return (
      `The 4-hour, daily, weekly and monthly charts are all trading above where they opened. When every ` +
      `timeframe points the same way, moves in that direction meet the least resistance — it is the closest ` +
      `thing to a tailwind you get.`
    );
  }
  if (down.length === TIMEFRAMES.length) {
    return (
      `All four timeframes — 4-hour, daily, weekly and monthly — are trading below where they opened. ` +
      `Buying into that means fighting every clock at once.`
    );
  }
  if (up.length === 0 && down.length === 0) return `The timeframes are flat, with nothing to read either way.`;

  const plural = (tfs: Timeframe[]) => (tfs.length === 1 ? 'chart is' : 'charts are');
  return (
    `Mixed, and worth being honest about. The ${list(up)} ${plural(up)} trading above where they opened, ` +
    `while the ${list(down)} ${plural(down)} below. When timeframes disagree, expect choppy back-and-forth ` +
    `until they line up.`
  );
}

function describeApproach(dca: DcaPlan, symbol: string): string {
  const tier = tierFor(symbol);
  const shape =
    tier === 'major'
      ? `The bigger orders sit closest to the current price, because assets this size tend to hold their levels.`
      : tier === 'large'
        ? `The orders get larger as they get cheaper, so a deeper drop buys more rather than less.`
        : `${symbol.replace('-USD', '')} moves harder than the majors in both directions, so the small orders sit near the current price and the big ones sit where a genuine washout would take it.`;

  const stance =
    dca.stance === 'accumulate'
      ? `The bigger picture supports buying dips here, so the whole ladder is live.`
      : dca.stance === 'defensive'
        ? `The bigger picture is broken, so only the first order is worth having on — being early into a fall this clean is expensive.`
        : `The bigger picture has not committed, so take the shallow orders slowly and keep the deeper ones funded.`;

  return `${stance} ${shape} The tradeoff is that you buy less at good prices and more at great ones, at the cost of never fully filling if it simply goes straight up.`;
}

export interface WriteupInput {
  symbol: string;
  name?: string;
  lastPrice: number;
  weekChangePct: number | null;
  continuity: ContinuityMap;
  structure: AssetStructure;
  dca: DcaPlan;
}

export function buildWriteup(input: WriteupInput): Writeup {
  const { structure, dca, symbol } = input;
  const disagreement = describeDisagreement(structure, input.weekChangePct);

  const standing = [
    describeBar(structure.monthly, 'month'),
    describeBar(structure.weekly, 'week'),
    disagreement,
  ]
    .filter(Boolean)
    .join(' ');

  const up = structure.monthly.triggerUp;
  const down = structure.monthly.triggerDown;

  const higher = [
    up === null ? `No clear level above yet.` : `Trading above ${money(up)} — the top of last month's range.`,
    up === null
      ? ''
      : `Clearing it puts anyone who sold below that price underwater, and they buy back to get out — which is often what turns a break into a run.`,
    travelSentence(structure.targetsUp, 'up'),
  ]
    .filter(Boolean)
    .join(' ');

  const lower = [
    down === null ? `No clear level below yet.` : `Losing ${money(down)}, the floor of the same range.`,
    down === null
      ? ''
      : `That would make the recent strength a false start — and false starts cut deep, because everyone who bought it is trapped.`,
    travelSentence(structure.targetsDown, 'down'),
  ]
    .filter(Boolean)
    .join(' ');

  const watch =
    up !== null && down !== null
      ? `${money(up)}. Everything else is noise until that breaks or the ${money(down)} floor gives way. A month-long stalemate resolving is worth more than any single week's move.`
      : `There is no decisive level yet — wait for a full week to close and set one.`;

  return {
    symbol,
    name: input.name,
    lastPrice: input.lastPrice,
    weekChangePct: input.weekChangePct,
    standing,
    higher,
    lower,
    picture: describeContinuity(input.continuity),
    approach: describeApproach(dca, symbol),
    watch,
  };
}
