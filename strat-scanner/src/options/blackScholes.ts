/**
 * Minimal Black-Scholes, for sizing an options expression of a Strat plan.
 *
 * **This does not price options.** Your broker does. Nothing here sees an
 * options chain, a bid/ask, a dividend, or a real implied volatility — the
 * numbers it produces are indicative, and their only job is to answer "roughly
 * how many contracts, and is this structure even sensible?" before you open the
 * chain and find out properly.
 *
 * The honest weakness is the volatility input. Implied volatility is what
 * options actually cost, and it is usually **above** realised volatility —
 * that gap is the premium sellers charge for uncertainty, and it widens before
 * earnings and in stress. Feeding realised vol into Black-Scholes therefore
 * *underestimates* premium, which flatters every debit structure. `ivPremium`
 * exists to lean against that, and the default leans deliberately.
 */

export type OptionKind = 'call' | 'put';

/** Standard normal CDF, Abramowitz & Stegun 7.1.26 — plenty for sizing. */
export function normalCdf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * z);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-z * z);
  return 0.5 * (1 + sign * y);
}

export interface PriceInput {
  /** Underlying price. */
  spot: number;
  strike: number;
  /** Years to expiry. */
  years: number;
  /** Annualised volatility, as a decimal. */
  volatility: number;
  /** Annual risk-free rate, as a decimal. */
  rate: number;
  kind: OptionKind;
}

export interface PriceResult {
  price: number;
  delta: number;
}

/**
 * European Black-Scholes price and delta.
 *
 * Degenerate inputs — no time left, no volatility — collapse to intrinsic
 * value rather than producing NaN, because a signal whose hold window has
 * already elapsed is a real case and should not poison a report.
 */
export function blackScholes(input: PriceInput): PriceResult {
  const { spot, strike, years, volatility, rate, kind } = input;
  const call = kind === 'call';

  if (!(spot > 0) || !(strike > 0)) return { price: 0, delta: 0 };

  if (years <= 0 || volatility <= 0) {
    const intrinsic = call ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
    const itm = call ? spot > strike : spot < strike;
    return { price: intrinsic, delta: itm ? (call ? 1 : -1) : 0 };
  }

  const sqrtT = Math.sqrt(years);
  const d1 =
    (Math.log(spot / strike) + (rate + (volatility * volatility) / 2) * years) /
    (volatility * sqrtT);
  const d2 = d1 - volatility * sqrtT;
  const discount = Math.exp(-rate * years);

  if (call) {
    return {
      price: spot * normalCdf(d1) - strike * discount * normalCdf(d2),
      delta: normalCdf(d1),
    };
  }
  return {
    price: strike * discount * normalCdf(-d2) - spot * normalCdf(-d1),
    delta: normalCdf(d1) - 1,
  };
}

/**
 * The one-standard-deviation move the market is implying over `years`.
 *
 * Useful as a reality check on a magnitude target: if the objective sits well
 * inside a single expected move it is a low bar, and if it sits far outside
 * one, the structure needs the move to be exceptional rather than ordinary.
 */
export const impliedMove = (spot: number, volatility: number, years: number): number =>
  spot > 0 && volatility > 0 && years > 0 ? spot * volatility * Math.sqrt(years) : 0;

/** Annualised standard deviation of daily log returns. */
export function realisedVolatility(closes: number[]): number {
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    const prev = closes[i - 1];
    const cur = closes[i];
    if (prev > 0 && cur > 0) returns.push(Math.log(cur / prev));
  }
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252);
}
