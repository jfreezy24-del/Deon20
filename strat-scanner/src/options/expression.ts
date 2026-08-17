import { Direction, Levels, Timeframe } from '../strat/types';
import { TF_SECONDS } from '../data/series';
import { blackScholes, impliedMove, OptionKind } from './blackScholes';

/**
 * Expressing a Strat plan as an options structure.
 *
 * The scanner produces a complete directional thesis — long above here, wrong
 * below there, travelling to that objective, over roughly this many bars — and
 * every one of those four numbers maps onto a decision the options market
 * makes you take. This translates them:
 *
 *  - **Direction → calls or puts.** The only trivial one.
 *  - **The hold window → expiry.** A plan given six daily bars needs an option
 *    that is still alive in six daily bars, with room to spare. Buying an
 *    expiry that dies inside the plan's own window is how a correct thesis
 *    loses money, and the engine already knows the window: `maxHoldBars` of the
 *    signal's timeframe.
 *  - **The magnitude target → the short strike.** This is the interesting one.
 *    The plan's claim is "price travels from entry to target 1"; a vertical
 *    debit spread that is long at entry and short at target 1 expresses exactly
 *    that claim and nothing more. Selling the objective is not a compromise —
 *    it is the position the thesis actually describes.
 *  - **The R unit → contracts.** A defined-risk structure has a known maximum
 *    loss, so size is arithmetic: risk budget ÷ max loss per contract.
 *
 * Two structures are offered per signal, because they answer different
 * questions. The **vertical debit spread** expresses the stated thesis and caps
 * both sides. The **long single** keeps the upside open past target 1 and pays
 * for that with more premium and far more theta.
 *
 * Nothing here sees a real options chain. Every price is a Black-Scholes
 * estimate from realised volatility, which is systematically *cheaper* than
 * what you will be quoted. Treat the contract counts as a starting point and
 * the premiums as an argument for opening the chain, not a substitute for it.
 */

export type StructureKind = 'debit-spread' | 'long-single';

export interface ExpressionOptions {
  /** Dollars to risk on the trade. Sizing is arithmetic from this. */
  riskBudget: number;
  /** Bars of the signal's timeframe the plan is held for. */
  maxHoldBars: number;
  /**
   * Extra time bought beyond the hold window, as a multiple.
   *
   * 1.0 buys an option that expires the moment the plan does, which is the
   * worst possible expiry: all the theta, none of the room. The default buys
   * roughly double the window so the position is not fighting the clock while
   * the thesis is still live.
   */
  expiryBuffer: number;
  /**
   * Multiplier applied to realised volatility to approximate implied.
   *
   * Implied is normally above realised — that gap is what sellers charge — so
   * pricing a debit off raw realised volatility makes every structure look
   * cheaper than it will be quoted. The default deliberately leans against the
   * flattering direction.
   */
  ivPremium: number;
  /** Annual risk-free rate. */
  rate: number;
  /** Strike increment to round to. */
  strikeIncrement: number;
  /**
   * Minimum spread width as a fraction of spot. A spread whose strikes are a
   * few cents apart is not a trade, it is a commission.
   */
  minSpreadWidthPct: number;
}

export const DEFAULT_EXPRESSION_OPTIONS: ExpressionOptions = {
  riskBudget: 500,
  maxHoldBars: 6,
  expiryBuffer: 2,
  ivPremium: 1.25,
  rate: 0.04,
  strikeIncrement: 1,
  minSpreadWidthPct: 0.5,
};

export interface Structure {
  kind: StructureKind;
  optionKind: OptionKind;
  /** The strike bought. */
  longStrike: number;
  /** The strike sold, for a spread. */
  shortStrike?: number;
  /** Estimated net debit per contract, before the 100× multiplier. */
  debit: number;
  /** Worst case per contract, in dollars. */
  maxLossPerContract: number;
  /** Best case per contract, in dollars. Unbounded for a long single. */
  maxGainPerContract: number | null;
  /** Underlying price at which the structure breaks even at expiry. */
  breakeven: number;
  /** Contracts that fit the risk budget. */
  contracts: number;
  /** Total debit outlay for that many contracts. */
  totalCost: number;
  /** Max gain ÷ max loss. Null when the upside is unbounded. */
  rewardToRisk: number | null;
}

export interface OptionsExpression {
  symbol: string;
  direction: Direction;
  timeframe: Timeframe;
  optionKind: OptionKind;
  spot: number;
  /** Trigger, invalidation and objective, carried through unchanged. */
  entry: number;
  stop: number;
  target: number;
  /** Volatility actually used for pricing, after the IV premium. */
  volatility: number;
  /** Calendar days of option life the plan implies. */
  minDays: number;
  /** Earliest expiry that clears the hold window with buffer, ISO date. */
  minExpiry: string;
  /** One standard deviation of movement over the option's life. */
  expectedMove: number;
  /** Distance from entry to the objective, as a multiple of the expected move. */
  targetInMoves: number;
  structures: Structure[];
  warnings: string[];
}

const roundToIncrement = (price: number, increment: number): number =>
  increment > 0 ? Math.round(price / increment) * increment : price;

/**
 * A sensible strike increment when none is supplied.
 *
 * Real chains vary by name and this is only a rounding convention, so it errs
 * toward finer increments — a strike that does not exist is obvious the moment
 * you open the chain, whereas one rounded too coarsely quietly misprices the
 * structure.
 */
export function defaultStrikeIncrement(spot: number): number {
  if (spot >= 500) return 5;
  if (spot >= 100) return 1;
  if (spot >= 25) return 0.5;
  if (spot >= 5) return 0.5;
  return 0.5;
}

export interface ExpressionInput {
  symbol: string;
  direction: Direction;
  timeframe: Timeframe;
  spot: number;
  levels: Levels;
  /** Annualised realised volatility of the underlying. */
  realisedVol: number;
}

/**
 * Translate one signal into option structures.
 *
 * Returns null only when the plan is unusable — no risk, no volatility, or a
 * target on the wrong side of entry — rather than emitting a structure built
 * on nonsense.
 */
export function expressAsOptions(
  input: ExpressionInput,
  options: Partial<ExpressionOptions> = {},
): OptionsExpression | null {
  const opts: ExpressionOptions = {
    ...DEFAULT_EXPRESSION_OPTIONS,
    strikeIncrement: defaultStrikeIncrement(input.spot),
    ...options,
  };
  const { symbol, direction, timeframe, spot, levels, realisedVol } = input;
  const bull = direction === 'bullish';
  const optionKind: OptionKind = bull ? 'call' : 'put';

  const risk = Math.abs(levels.entry - levels.stop);
  const reward = bull ? levels.target1 - levels.entry : levels.entry - levels.target1;
  if (!(spot > 0) || !(risk > 0) || !(realisedVol > 0) || reward <= 0) return null;

  const volatility = realisedVol * opts.ivPremium;

  // The plan's own clock decides the expiry, with buffer.
  const seconds = opts.maxHoldBars * TF_SECONDS[timeframe] * opts.expiryBuffer;
  const minDays = Math.max(1, Math.ceil(seconds / 86_400));
  const minExpiry = new Date(Date.now() + minDays * 86_400_000).toISOString().slice(0, 10);
  const years = minDays / 365;

  const expectedMove = impliedMove(spot, volatility, years);
  const targetInMoves = expectedMove > 0 ? reward / expectedMove : 0;

  const warnings: string[] = [];

  // The long strike sits at the trigger: the thesis begins when that level
  // breaks, so that is where the position should have its delta.
  const longStrike = roundToIncrement(levels.entry, opts.strikeIncrement);
  const shortStrikeRaw = roundToIncrement(levels.target1, opts.strikeIncrement);
  const width = Math.abs(shortStrikeRaw - longStrike);
  const minWidth = (opts.minSpreadWidthPct / 100) * spot;

  const price = (strike: number) =>
    blackScholes({ spot, strike, years, volatility, rate: opts.rate, kind: optionKind }).price;

  const structures: Structure[] = [];

  // ── Vertical debit spread: exactly the stated thesis ──────────────────
  if (width >= minWidth && width > 0) {
    const debit = Math.max(0.01, price(longStrike) - price(shortStrikeRaw));
    const maxLossPerContract = debit * 100;
    const maxGainPerContract = Math.max(0, width * 100 - maxLossPerContract);
    const contracts = Math.max(0, Math.floor(opts.riskBudget / maxLossPerContract));
    structures.push({
      kind: 'debit-spread',
      optionKind,
      longStrike,
      shortStrike: shortStrikeRaw,
      debit,
      maxLossPerContract,
      maxGainPerContract,
      breakeven: bull ? longStrike + debit : longStrike - debit,
      contracts,
      totalCost: contracts * maxLossPerContract,
      rewardToRisk: maxLossPerContract > 0 ? maxGainPerContract / maxLossPerContract : null,
    });
  } else {
    warnings.push(
      `Target 1 is only ${width.toFixed(2)} from the trigger — under ${opts.minSpreadWidthPct}% ` +
        'of spot, so a spread between them has no width to pay. The plan is too tight to express ' +
        'as a vertical; that usually means the magnitude target, not the option.',
    );
  }

  // ── Long single: keeps the upside past the objective ──────────────────
  {
    const debit = Math.max(0.01, price(longStrike));
    const maxLossPerContract = debit * 100;
    const contracts = Math.max(0, Math.floor(opts.riskBudget / maxLossPerContract));
    structures.push({
      kind: 'long-single',
      optionKind,
      longStrike,
      debit,
      maxLossPerContract,
      maxGainPerContract: null,
      breakeven: bull ? longStrike + debit : longStrike - debit,
      contracts,
      totalCost: contracts * maxLossPerContract,
      rewardToRisk: null,
    });
  }

  /* Reality checks the underlying plan cannot make for itself. */

  // The pathology this engine actually has. `computeLevels` frequently puts
  // target 1 a fraction of a risk unit away, which is survivable in shares —
  // you simply make a little — but not in options, where a debit has to be
  // overcome before anything is made at all. A spread this narrow can have a
  // negative expectancy even when the underlying plan is correct.
  const rewardRisk = reward / risk;
  if (rewardRisk < 0.5) {
    warnings.push(
      `The objective is only ${rewardRisk.toFixed(2)}R from the trigger. In shares that is a ` +
        'small win; in options the debit has to be earned back first, so a plan this tight is ' +
        'usually negative expectancy however correct the direction. Check the target-quality ' +
        'section of the calibration report before taking it.',
    );
  }

  if (targetInMoves > 1.5) {
    warnings.push(
      `The objective is ${targetInMoves.toFixed(1)}× the expected move over the option's life. ` +
        'The thesis needs an unusually large travel, not an ordinary one — either buy more time ' +
        'or accept that this is a low-probability structure.',
    );
  }
  if (targetInMoves > 0 && targetInMoves < 0.35) {
    warnings.push(
      `The objective is only ${targetInMoves.toFixed(2)}× the expected move, so the market is ` +
        'already pricing a bigger swing than the plan is aiming for. Little of the premium is ' +
        'working for you.',
    );
  }
  if (structures.every((s) => s.contracts === 0)) {
    warnings.push(
      `A single contract costs more than the ${opts.riskBudget} risk budget. Either the ` +
        'underlying is too expensive for this size or the expiry is too far out.',
    );
  }

  return {
    symbol,
    direction,
    timeframe,
    optionKind,
    spot,
    entry: levels.entry,
    stop: levels.stop,
    target: levels.target1,
    volatility,
    minDays,
    minExpiry,
    expectedMove,
    targetInMoves,
    structures,
    warnings,
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const money = (v: number) => `$${v.toFixed(2)}`;
const whole = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;

export function renderExpression(e: OptionsExpression): string {
  const lines: string[] = [];
  const side = e.direction === 'bullish' ? 'LONG' : 'SHORT';

  lines.push(`### ${e.symbol} ${side} (${e.timeframe}) — ${e.optionKind}s`);
  lines.push('');
  lines.push(
    `Trigger ${money(e.entry)} · invalidation ${money(e.stop)} · objective ${money(e.target)} · ` +
      `spot ${money(e.spot)}`,
  );
  lines.push(
    `Needs **${e.minDays} days** of life — expiry on or after **${e.minExpiry}**. ` +
      `Pricing at ${(e.volatility * 100).toFixed(0)}% vol; one expected move is ` +
      `${money(e.expectedMove)}, and the objective is ${e.targetInMoves.toFixed(2)}× that.`,
  );
  lines.push('');

  const headers = ['Structure', 'Strikes', 'Debit', 'Max loss', 'Max gain', 'R:R', 'Contracts', 'Outlay'];
  const rows = e.structures.map((s) => [
    s.kind === 'debit-spread' ? `${e.optionKind} debit spread` : `long ${e.optionKind}`,
    s.shortStrike === undefined
      ? `${s.longStrike}`
      : `${s.longStrike} / ${s.shortStrike}`,
    money(s.debit),
    money(s.maxLossPerContract),
    s.maxGainPerContract === null ? 'open' : money(s.maxGainPerContract),
    s.rewardToRisk === null ? '—' : `${s.rewardToRisk.toFixed(2)}:1`,
    String(s.contracts),
    whole(s.totalCost),
  ]);
  lines.push(
    [headers, headers.map(() => '---'), ...rows].map((r) => `| ${r.join(' | ')} |`).join('\n'),
  );

  if (e.warnings.length > 0) {
    lines.push('');
    for (const w of e.warnings) lines.push(`> ⚠️ ${w}`);
  }
  return lines.join('\n');
}
