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

/**
 * Deterministic variant choice.
 *
 * Four coins in the same state used to produce four identical paragraphs, so
 * every phrase now has alternates. The pick is hashed from the coin and the
 * week rather than randomised: the same coin reads the same all week no matter
 * how often the report runs, two coins in the same state read differently, and
 * the same coin reads differently next week.
 */
function pick<T>(seed: string, slot: string, options: T[]): T {
  const [key, offset] = seed.split('#');
  let hash = 2166136261;
  const source = `${key}|${slot}`;
  for (let i = 0; i < source.length; i++) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  // The offset is the coin's position in the report. Hashing alone lets four
  // coins collide on the same phrasing by chance, which is exactly the thing
  // this exists to prevent; stepping by position makes consecutive coins take
  // different variants by construction.
  const step = Number(offset ?? 0);
  return options[(Math.abs(hash) + (Number.isFinite(step) ? step : 0)) % options.length];
}

const PERIOD: Record<'week' | 'month', { one: string; many: string; prior: string }> = {
  week: { one: 'week', many: 'weeks', prior: "the previous week's" },
  month: { one: 'month', many: 'months', prior: "the previous month's" },
};

/** What a completed bar did, said without notation. */
function describeBar(s: TimeframeStructure, unit: 'week' | 'month', seed: string): string {
  const p = PERIOD[unit];
  const slot = `bar:${unit}`;

  switch (s.type) {
    case '1':
      return pick(seed, slot, [
        `Last ${p.one} traded entirely inside the ${p.one} before it, a full ${p.one} without ` +
          `breaking above or below. That is a market waiting rather than a market weakening: the ` +
          `tighter the range gets, the more forceful the move when it finally resolves, and the ` +
          `sooner you know if you are wrong.`,
        `Nothing was decided last ${p.one}. Price stayed within the prior ${p.one}'s range from ` +
          `start to finish, which is what a market does while it makes up its mind. Ranges like ` +
          `this coil: the longer the quiet lasts, the sharper the exit tends to be.`,
        `The last ${p.one} never left the previous one's range, so the argument is unresolved. ` +
          `That is worth more than it sounds. A tight range means the level that settles it is ` +
          `close by, so you find out quickly and cheaply which way this goes.`,
        `Neither side could take the ${p.one} anywhere. Price stayed boxed inside the prior range ` +
          `for the whole of it, which is a pause rather than a problem: quiet stretches like this ` +
          `end in a move, and the boundary that ends it is not far away.`,
      ]);
    case '2u':
      return s.run >= 2
        ? pick(seed, slot, [
            `That is ${s.run} ${p.many} in a row of higher highs, a sustained move rather than a one-off push.`,
            `Buyers have now taken out the prior high ${s.run} ${p.many} running. Streaks like that ` +
              `are trend, not noise.`,
            `${s.run} consecutive ${p.many} of higher highs. Nothing has interrupted the buyers yet.`,
            `${s.run} ${p.many} running without a single lower high. That is what a trend looks ` +
              `like before anyone calls it one.`,
          ])
        : pick(seed, slot, [
            `Last ${p.one} pushed above ${p.prior} high, putting buyers in control of the recent range.`,
            `Buyers took out ${p.prior} high last ${p.one}, which hands them the recent range.`,
            `The last ${p.one} cleared the high before it. That is the buyers' first real claim on this range.`,
            `Price took out the prior ${p.one}'s high, which is the first thing buyers have proved in a while.`,
          ]);
    case '2d':
      return s.run >= 2
        ? pick(seed, slot, [
            `That is ${s.run} ${p.many} in a row of lower lows, with no pause and no attempt to bounce. ` +
              `That is the weakest thing a chart can do, and there is nothing to buy here yet, only ` +
              `prices worth watching.`,
            `${s.run} straight ${p.many} of lower lows, unbroken by so much as a pause. There is no ` +
              `sign of buyers anywhere in that, so this is a list of levels to watch rather than a ` +
              `case for buying.`,
            `Sellers have set a lower low ${s.run} ${p.many} running, with nothing interrupting them. ` +
              `A chart cannot look much weaker, and nothing here argues for stepping in yet.`,
            `${s.run} ${p.many} of lower lows and not one attempt to reclaim anything. Until that ` +
              `changes these are prices to watch, not prices to buy.`,
          ])
        : pick(seed, slot, [
            `Last ${p.one} broke below ${p.prior} low, handing control to sellers.`,
            `Sellers took out ${p.prior} low last ${p.one}, so the recent range belongs to them.`,
            `The last ${p.one} lost the low before it, which puts sellers in charge of this range.`,
            `Price gave up the prior ${p.one}'s low, and that hands the range to the sellers.`,
          ]);
    case '3':
      return pick(seed, slot, [
        `Last ${p.one} traded both above ${p.prior} high and below its low, and settled nothing. ` +
          `${unit === 'week' ? 'Weeks' : 'Months'} like that widen the range and hand the decision forward.`,
        `A wild ${p.one}: price ran through both ends of the prior range and closed with the ` +
          `question still open. All it achieved was a wider range for the next ${p.one} to break.`,
        `Both sides of ${p.prior} range gave way last ${p.one} and neither stuck. That is churn, not ` +
          `direction, and it leaves a bigger range for whatever comes next.`,
        `The ${p.one} broke both ways and held neither, which tells you the argument is still live ` +
          `and the range that frames it just got wider.`,
      ]);
    default:
      return `There is not enough history yet to read the ${p.one}ly picture.`;
  }
}

/** The tension between what the month has done and what the week is doing. */
function describeDisagreement(
  structure: AssetStructure,
  weekChangePct: number | null,
  seed: string,
): string {
  const { weekly, monthly } = structure;

  // A move that failed says more than which way the last bar went, so these
  // are read before the plainer month-versus-week observations.
  if (weekly.type === '2d' && (weekChangePct ?? 0) > 0) {
    return pick(seed, 'fail:down', [
      `The drop did not hold: price is back up this week. Everyone who sold into that dip is now ` +
        `offside, and they buy back if it keeps rising, which is often what turns a failed drop into a rally.`,
      `That break lower has already been reclaimed. Sellers who chased it are now trapped, and ` +
        `their buying to get out is the fuel a recovery runs on.`,
      `Price fell through and came straight back. Failed breaks matter more than clean ones, ` +
        `because the people caught on the wrong side have to trade against themselves to escape.`,
      `The low broke and did not stick. That failure is the useful part: sellers were caught, and ` +
        `getting out means buying it back.`,
    ]);
  }
  if (weekly.type === '2u' && (weekChangePct ?? 0) < 0) {
    return pick(seed, 'fail:up', [
      `The push higher did not hold: price has slipped back this week. Everyone who bought that ` +
        `breakout is now underwater, and they sell to get out, which is what caps the next attempt.`,
      `That move above the range has already failed. Buyers who paid up are stuck, and their ` +
        `selling is what the next rally has to chew through.`,
      `The breakout gave itself back inside a week. Anyone who chased it is offside, and that ` +
        `overhead supply is why the next attempt tends to stall.`,
      `The move above failed within the week. Buyers who paid the high are underwater, and they are ` +
        `the sellers waiting at the next try.`,
    ]);
  }
  if (monthly.type === '1' && weekly.type === '2u') {
    return pick(seed, 'crack:up', [
      `The week moved; the month has not. That is the first crack in a stalemate rather than a confirmed direction.`,
      `One clock has turned and the other has not. Treat this as the opening move in the standoff, not the result.`,
      `The week is leading the month here, which is a hint rather than a decision.`,
      `A green week inside an undecided month is a start, not a signal.`,
    ]);
  }
  if (monthly.type === '1' && weekly.type === '2d') {
    return pick(seed, 'crack:down', [
      `The week broke lower while the month is still undecided, a warning rather than a verdict.`,
      `The week has cracked lower with the month still stuck. Worth noting, not yet worth acting on.`,
      `Sellers took the week while the month sits unresolved, which is a caution flag and no more.`,
      `The week went to the sellers with the month yet to commit. Note it, do not act on it.`,
    ]);
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

const travelSentence = (targets: number[], direction: 'up' | 'down', seed: string): string => {
  const [first, second] = targets;

  if (direction === 'up') {
    if (targets.length === 0) {
      return pick(seed, 'travel:none-up', [
        `There is no prior high left above, which means it would be trading where it has never traded before, with no level to aim at.`,
        `Nothing above has ever been tested, so there is no obvious place for a move to stop.`,
        `There is no history above this price, so nothing marks where a rally would run out.`,
        `Above here is unmapped, with no prior level to slow anything down.`,
      ]);
    }
    return second === undefined
      ? pick(seed, 'travel:up1', [
          `The last place it ran out of buyers was ${money(first)}.`,
          `${money(first)} is where the last rally died, so that is the first thing in the way.`,
          `Sellers last appeared at ${money(first)}, which is the first thing above.`,
          `${money(first)} stopped it before, so that is the level to measure to.`,
        ])
      : pick(seed, 'travel:up2', [
          `The last two places it ran out of buyers were ${money(first)} and ${money(second)}.`,
          `Above there, sellers previously showed up at ${money(first)}, then again at ${money(second)}.`,
          `Two prices have stopped it before: ${money(first)} first, then ${money(second)}.`,
          `${money(first)} turned it away once, and ${money(second)} above that.`,
        ]);
  }

  if (targets.length === 0) {
    return pick(seed, 'travel:none-down', [
      `There is no prior low left below, which means nothing obvious to catch it.`,
      `Below here the chart is empty, so there is no level with a history of holding.`,
      `Nothing below has held before, so there is no floor with a track record.`,
      `There is no prior low underneath to lean on.`,
    ]);
  }
  return second === undefined
    ? pick(seed, 'travel:down1', [
        `The last place buyers stepped in was ${money(first)}.`,
        `${money(first)} is the one price below that buyers have defended before.`,
        `Buyers have turned it at ${money(first)} before, and that is the only level below with a record.`,
        `${money(first)} held once, which makes it the level worth bidding into.`,
      ])
    : pick(seed, 'travel:down2', [
        `The last two places buyers stepped in were ${money(first)} and ${money(second)}.`,
        `Buyers previously turned it at ${money(first)}, and below that at ${money(second)}.`,
        `Two levels below have held before: ${money(first)}, then ${money(second)}.`,
        `${money(first)} caught it once, and ${money(second)} beneath that.`,
      ]);
};

function describeContinuity(map: ContinuityMap, seed: string): string {
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
    return pick(seed, 'ftfc:up', [
      `The 4-hour, daily, weekly and monthly charts are all trading above where they opened. When ` +
        `every timeframe points the same way, moves in that direction meet the least resistance, ` +
        `the closest thing to a tailwind you get.`,
      `Every timeframe agrees here, from the 4-hour up to the monthly, and all of them are green ` +
        `against their opens. That alignment is rare and it is the easiest condition to buy into.`,
      `All four clocks are pointing up at once. Nothing is fighting a move higher right now, which ` +
        `is as clean as this setup gets.`,
      `Short and long timeframes are green together. That agreement does not last long, and while ` +
        `it holds, upside is the path of least resistance.`,
    ]);
  }
  if (down.length === TIMEFRAMES.length) {
    return pick(seed, 'ftfc:down', [
      `The 4-hour, daily, weekly and monthly charts are all trading below where they opened. ` +
        `Buying into that means fighting every clock at once.`,
      `Every timeframe is red against its open, short and long alike. There is nothing supportive ` +
        `in that picture at all.`,
      `All four clocks point down together, so anything bought here is bought against the whole ` +
        `board rather than with part of it.`,
      `Not one timeframe is offering support. Buying into that means every clock is against you at once.`,
    ]);
  }
  if (up.length === 0 && down.length === 0) return `The timeframes are flat, with nothing to read either way.`;

  const plural = (tfs: Timeframe[]) => (tfs.length === 1 ? 'chart is' : 'charts are');
  return pick(seed, 'ftfc:mixed', [
    `Mixed, and worth being honest about. The ${list(up)} ${plural(up)} trading above where they ` +
      `opened, while the ${list(down)} ${plural(down)} below. When timeframes disagree, expect ` +
      `choppy back-and-forth until they line up.`,
    `The clocks disagree. The ${list(up)} ${plural(up)} above the open while the ${list(down)} ` +
      `${plural(down)} below, and that split is usually what produces a week of moves that go nowhere.`,
    `Half the picture is constructive and half is not: ${list(up)} above the open, ${list(down)} ` +
      `below it. Until that resolves, expect the chop rather than the trend.`,
    `The timeframes are split: ${list(up)} above the open, ${list(down)} below. Disagreement like ` +
      `that usually shows up as a week that ends roughly where it started.`,
  ]);
}

function describeApproach(dca: DcaPlan, symbol: string, seed: string): string {
  const tier = tierFor(symbol);
  const coin = symbol.replace('-USD', '');

  const shape =
    tier === 'major'
      ? pick(seed, 'shape:major', [
          `The bigger orders sit closest to the current price, because assets this size tend to hold their levels.`,
          `Size is weighted toward the shallow end here: ${coin} rarely travels as far as the smaller coins do.`,
          `Most of the money sits near spot, because ${coin} tends to hold its levels rather than ` +
            `slice through them.`,
          `The near rungs carry the weight. An asset this size does not usually hand you the deep prices.`,
        ])
      : tier === 'large'
        ? pick(seed, 'shape:large', [
            `The orders get larger as they get cheaper, so a deeper drop buys more rather than less.`,
            `Each rung down carries more size than the one above it, which turns a bigger fall into a better average.`,
            `Size increases with every step down, so the worse it gets the better the average becomes.`,
            `The deeper the rung, the larger the order, which is what makes a fall useful rather than painful.`,
          ])
        : pick(seed, 'shape:beta', [
            `${coin} moves harder than the majors in both directions, so the small orders sit near the ` +
              `current price and the big ones sit where a genuine washout would take it.`,
            `Because ${coin} swings further than the majors, the shallow rungs stay small and the real ` +
              `size waits at prices only a proper flush reaches.`,
            `${coin} overshoots in both directions, so the top of the ladder is deliberately light and ` +
              `the weight sits where panic takes it.`,
            `Expect ${coin} to travel. The near orders are token; the ones that matter are far below.`,
          ]);

  const stance =
    dca.stance === 'accumulate'
      ? pick(seed, 'stance:acc', [
          `The bigger picture supports buying dips here, so the whole ladder is live.`,
          `With the higher timeframes onside, every rung is worth funding.`,
          `The bigger picture is supportive, so there is no reason to hold any of the ladder back.`,
          `Conditions favour buying weakness here, and the full plan is worth committing.`,
        ])
      : dca.stance === 'defensive'
        ? pick(seed, 'stance:def', [
            `The bigger picture is broken, so only the first order is worth having on, because being ` +
              `early into a fall this clean is expensive.`,
            `Structure is broken here. Keep the first order small and the rest in reserve: buying a ` +
              `decline this orderly usually just means buying it twice.`,
            `The higher timeframes have failed, so this is a small first order and patience. Falls ` +
              `this tidy rarely stop where you first want them to.`,
            `With structure gone, size belongs in reserve rather than in the market. There is usually ` +
              `a better price behind this one.`,
          ])
        : pick(seed, 'stance:neu', [
            `The bigger picture has not committed, so take the shallow orders slowly and keep the deeper ones funded.`,
            `Nothing is settled up top, so work the near rungs patiently and hold the deep money back.`,
            `The higher timeframes have not chosen, so buy slowly near here and keep the deep orders funded.`,
            `Undecided above means unhurried here: take the shallow fills, save the rest.`,
          ]);

  const caveat = pick(seed, 'caveat', [
    `The tradeoff is that you buy less at good prices and more at great ones, at the cost of never ` +
      `fully filling if it simply goes straight up.`,
    `The cost of this shape is obvious: if price never comes back, most of the plan never gets used.`,
    `The catch is the same as always: a straight run higher leaves most of this plan unspent.`,
    `It buys least where you want most, and most where nobody wants to. That is the deal.`,
  ]);

  return `${stance} ${shape} ${caveat}`;
}

export interface WriteupInput {
  symbol: string;
  name?: string;
  lastPrice: number;
  weekChangePct: number | null;
  continuity: ContinuityMap;
  structure: AssetStructure;
  dca: DcaPlan;
  /**
   * Varies the wording. Pass `<week>#<position>`: the week fixes the phrasing
   * for the whole week and rotates it next week, and the position guarantees
   * that coins in one report take different variants. The hashed part must not
   * include the symbol, or the guarantee is lost and two coins can collide.
   * Defaults to the symbol alone, which is fine for a single write-up.
   */
  seed?: string;
}

export function buildWriteup(input: WriteupInput): Writeup {
  const { structure, dca, symbol } = input;
  const seed = input.seed ?? symbol;
  const disagreement = describeDisagreement(structure, input.weekChangePct, seed);

  const standing = [
    describeBar(structure.monthly, 'month', seed),
    describeBar(structure.weekly, 'week', seed),
    disagreement,
  ]
    .filter(Boolean)
    .join(' ');

  const up = structure.monthly.triggerUp;
  const down = structure.monthly.triggerDown;

  const higher = [
    up === null
      ? `No clear level above yet.`
      : pick(seed, 'higher:level', [
          `Trading above ${money(up)}, the top of last month's range.`,
          `It takes a move through ${money(up)}, the ceiling of last month's range.`,
          `${money(up)} is the number. That is the top of last month's range.`,
          `Above ${money(up)} and it changes. That price is the roof of last month's range.`,
        ]),
    up === null
      ? ''
      : pick(seed, 'higher:why', [
          `Clearing it puts anyone who sold below that price underwater, and they buy back to get ` +
            `out, which is often what turns a break into a run.`,
          `Above there, everyone short from lower is offside, and covering is what makes these ` +
            `breaks accelerate.`,
          `Getting through traps the sellers underneath it, and their buying is usually what carries ` +
            `the move further than it looks like it should.`,
          `Everyone who sold beneath that price is wrong the moment it clears, and their exit is ` +
            `what fuels the next leg.`,
        ]),
    travelSentence(structure.targetsUp, 'up', seed),
  ]
    .filter(Boolean)
    .join(' ');

  const lower = [
    down === null
      ? `No clear level below yet.`
      : pick(seed, 'lower:level', [
          `Losing ${money(down)}, the floor of the same range.`,
          `It breaks down through ${money(down)}, the bottom of that same range.`,
          `${money(down)} is the level that matters underneath, the floor of the range.`,
          `Under ${money(down)} the picture changes. That is the floor of the same range.`,
        ]),
    down === null
      ? ''
      : pick(seed, 'lower:why', [
          `That would make the recent strength a false start, and false starts cut deep, because ` +
            `everyone who bought it is trapped.`,
          `Below there the recent bounce was a trap, and the people who bought it become the sellers ` +
            `on the way down.`,
          `Losing it turns the recent strength into a failed move, which tends to fall faster than ` +
            `it rose because buyers are cutting rather than choosing.`,
          `Below it the bounce was bait. Forced selling moves quicker than willing selling, which is ` +
            `why these give back more than they built.`,
        ]),
    travelSentence(structure.targetsDown, 'down', seed),
  ]
    .filter(Boolean)
    .join(' ');

  const watch =
    up !== null && down !== null
      ? pick(seed, 'watch', [
          `${money(up)}. Everything else is noise until that breaks or the ${money(down)} floor ` +
            `gives way. A month-long stalemate resolving is worth more than any single week's move.`,
          `${money(up)} above, ${money(down)} below. Nothing in between tells you anything, so ` +
            `wait for one of them rather than reading the wiggles.`,
          `Watch ${money(up)}. Until it goes, or ${money(down)} fails, this is the same chart it ` +
            `was last week no matter what price does day to day.`,
          `${money(up)} is the one to watch. Short of that, or of ${money(down)} breaking, nothing ` +
            `this week actually changes the picture.`,
        ])
      : `There is no decisive level yet, so wait for a full week to close and set one.`;

  return {
    symbol,
    name: input.name,
    lastPrice: input.lastPrice,
    weekChangePct: input.weekChangePct,
    standing,
    higher,
    lower,
    picture: describeContinuity(input.continuity, seed),
    approach: describeApproach(dca, symbol, seed),
    watch,
  };
}
