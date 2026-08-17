/**
 * Options expression — turning today's signals into contracts.
 *
 * The scanner produces a complete directional thesis and then hands you four
 * numbers in share terms. If you express those views with options, every one of
 * them has to be translated: direction into calls or puts, the hold window into
 * an expiry, the magnitude objective into a short strike, the R unit into a
 * contract count. Doing that by hand for each alert is exactly the kind of
 * arithmetic that gets skipped at the wrong moment.
 *
 * Run it on demand — it is a desk tool, not a schedule. It sends nothing.
 *
 * **It does not price options.** Nothing here sees a chain, a bid/ask or a real
 * implied volatility; premiums are Black-Scholes estimates from realised
 * volatility marked up by `IV_PREMIUM`, and they will be cheaper than what you
 * are quoted. The contract counts are a starting point and the structure is the
 * actual output.
 *
 * Usage:  npx tsx server/options-plan.ts
 *
 * Environment:
 *   OPTIONS_SYMBOLS      comma list to plan (default: the algo universe)
 *   OPTIONS_RISK         dollars to risk per trade               (default 500)
 *   OPTIONS_MIN_CONFIDENCE  confidence floor for signals          (default 60)
 *   OPTIONS_TIMEFRAMES   comma list of timeframes           (default D,W,M)
 *   IV_PREMIUM           realised-to-implied markup             (default 1.25)
 *   EXPIRY_BUFFER        multiple of the hold window to buy        (default 2)
 *   MAX_HOLD_BARS        bars the plan is held for                 (default 6)
 */
import { scanMarket } from '../src/scanner';
import { fetchTimeframe } from '../src/data/market';
import { realisedVolatility } from '../src/options/blackScholes';
import {
  DEFAULT_EXPRESSION_OPTIONS,
  expressAsOptions,
  renderExpression,
} from '../src/options/expression';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { DEFAULT_RESOLVE_OPTIONS } from '../src/strat/outcomes';
import { Timeframe, TIMEFRAMES } from '../src/strat/types';

function symbols(): string[] {
  const override = process.env.OPTIONS_SYMBOLS?.trim();
  if (!override) return ALGO_UNIVERSE;
  const list: string[] = override
    .split(',')
    .map((s: string) => s.trim().toUpperCase())
    .filter((s: string) => s.length > 0);
  return list.length > 0 ? list : ALGO_UNIVERSE;
}

function parseTimeframes(raw: string | undefined): Timeframe[] {
  if (!raw?.trim()) return ['D', 'W', 'M'];
  const tfs = raw
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter((t): t is Timeframe => (TIMEFRAMES as string[]).includes(t));
  return tfs.length > 0 ? tfs : ['D', 'W', 'M'];
}

async function main() {
  const universe = symbols();
  const riskBudget = Number(process.env.OPTIONS_RISK ?? DEFAULT_EXPRESSION_OPTIONS.riskBudget);
  const minConfidence = Number(process.env.OPTIONS_MIN_CONFIDENCE ?? 60);
  const timeframes = parseTimeframes(process.env.OPTIONS_TIMEFRAMES);
  const ivPremium = Number(process.env.IV_PREMIUM ?? DEFAULT_EXPRESSION_OPTIONS.ivPremium);
  const expiryBuffer = Number(process.env.EXPIRY_BUFFER ?? DEFAULT_EXPRESSION_OPTIONS.expiryBuffer);
  const maxHoldBars = Number(process.env.MAX_HOLD_BARS ?? DEFAULT_RESOLVE_OPTIONS.maxHoldBars);

  console.log(
    `Options plan: ${universe.length} symbols (${timeframes.join('/')}, confidence ≥ ` +
      `${minConfidence}), risking $${riskBudget} per trade.`,
  );

  const scan = await scanMarket(universe);
  for (const err of scan.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  if (scan.signals.length === 0 && scan.errors.length === universe.length) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }

  const eligible = scan.signals
    .filter((s) => timeframes.includes(s.timeframe) && s.confidence >= minConfidence)
    .sort((a, b) => b.confidence - a.confidence);

  console.log(`${scan.signals.length} signals in sweep → ${eligible.length} worth expressing.`);
  if (eligible.length === 0) {
    console.log('\nNothing above the confidence floor. A quiet day is a real answer.');
    return;
  }

  // Realised volatility per symbol, fetched once and shared across that
  // symbol's signals.
  const vols = new Map<string, number>();
  for (const symbol of new Set(eligible.map((s) => s.symbol))) {
    try {
      const daily = await fetchTimeframe(symbol, 'D');
      vols.set(symbol, realisedVolatility(daily.completed.map((c) => c.close)));
    } catch (e) {
      console.warn(`  WARN ${symbol}: no volatility (${e instanceof Error ? e.message : e}).`);
    }
  }

  const sections: string[] = [];
  for (const s of eligible) {
    const vol = vols.get(s.symbol);
    if (!vol) continue;
    const expression = expressAsOptions(
      {
        symbol: s.symbol,
        direction: s.direction,
        timeframe: s.timeframe,
        spot: s.lastPrice,
        levels: s.levels,
        realisedVol: vol,
      },
      { riskBudget, ivPremium, expiryBuffer, maxHoldBars },
    );
    if (expression) sections.push(renderExpression(expression));
  }

  console.log('');
  console.log('# Options expression');
  console.log('');
  console.log(
    `_Estimated at ${ivPremium}× realised volatility, ${expiryBuffer}× the plan's hold window, ` +
      `$${riskBudget} of risk per trade. **These are not quotes** — no chain was consulted, and ` +
      `real premiums will be higher._`,
  );
  console.log('');
  console.log(sections.join('\n\n'));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
