import { Candle } from './types';

/**
 * Universe discovery — separating "what to watch" from "watching what I picked".
 *
 * Every watchlist in this repo is hand-curated. The scanner is very good at
 * answering "is there a setup in these 35 names" and has no way at all to
 * answer "are these the right 35 names". Those are different questions and only
 * one of them has ever been asked.
 *
 * **Candidates are scored on tradability, never on backtested profit.** That is
 * the single most important decision here and it is deliberately restrictive.
 * Ranking a broad pool by historical P&L and keeping the winners is textbook
 * selection bias: it finds the symbols that happened to work over the sample,
 * which is exactly the property least likely to repeat. What is measured
 * instead are properties that plausibly persist:
 *
 *  - **Liquidity.** You cannot trade what you cannot get filled in, and no
 *    amount of clean structure fixes a thin book.
 *  - **Volatility.** A name that does not move cannot pay for its own risk. The
 *    screen wants a floor, not a maximum — a quiet symbol is a dead watchlist
 *    slot.
 *  - **Structure density.** How often the symbol actually prints actionable
 *    Strat bars. Some names chop through their own levels and produce a signal
 *    every week; others go months without one.
 *  - **Magnitude availability.** How often a real prior pivot exists to measure
 *    to, rather than the engine falling back to a projection. A symbol whose
 *    targets are always invented is a symbol the methodology cannot read.
 *  - **Marginal diversification.** A new name correlated 0.95 to something you
 *    already watch adds a row to the report and no information. This is scored
 *    against the *existing* watchlist, so it measures what the candidate adds
 *    rather than what it is.
 *
 * The output is a proposal, not an edit. It also flags current members that no
 * longer clear the gates, because a watchlist that only ever grows becomes a
 * scan of everything.
 */

export interface DiscoveryGates {
  /** Minimum median daily dollar volume. */
  minDollarVolume: number;
  /** Minimum annualised realised volatility. */
  minVolatility: number;
  /** Maximum annualised realised volatility — past this it is a lottery ticket. */
  maxVolatility: number;
  /** Minimum daily bars of history. */
  minBars: number;
  /** Reject a candidate correlated above this to anything already watched. */
  maxCorrelation: number;
}

export const DEFAULT_GATES: DiscoveryGates = {
  minDollarVolume: 25_000_000,
  minVolatility: 0.18,
  maxVolatility: 2.5,
  minBars: 400,
  maxCorrelation: 0.9,
};

export interface CandidateMetrics {
  symbol: string;
  bars: number;
  lastPrice: number;
  /** Median daily dollar volume over the recent window. */
  dollarVolume: number;
  /** Annualised realised volatility. */
  volatility: number;
  /** Actionable setups per 100 trading days. */
  setupDensity: number;
  /** Share of setups where a real prior level existed to measure to. */
  magnitudeAvailability: number;
  /** Highest absolute return correlation against the existing watchlist. */
  maxCorrelation: number;
  /** Which watched symbol it most resembles. */
  closestTo?: string;
  /** Already on a watchlist. */
  incumbent: boolean;
}

export interface ScoredCandidate extends CandidateMetrics {
  /** 0-100. Only meaningful for candidates that passed every gate. */
  score: number;
  passed: boolean;
  /** Why it was rejected, when it was. */
  failures: string[];
}

const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Median daily dollar volume over the last `window` sessions. */
export function medianDollarVolume(bars: Candle[], window = 60): number {
  const recent = bars.slice(-window).filter((b) => b.close > 0 && b.volume > 0);
  return median(recent.map((b) => b.close * b.volume));
}

/** Daily log returns, for correlation. */
export function logReturns(bars: Candle[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1].close;
    const cur = bars[i].close;
    if (prev > 0 && cur > 0) out.push(Math.log(cur / prev));
  }
  return out;
}

/**
 * Pearson correlation over the overlapping tail of two return series.
 *
 * Aligned from the end rather than by date: crypto trades at the weekend and
 * equities do not, so date alignment would silently drop most of an
 * equity-versus-crypto comparison. Tail alignment is approximate but honest for
 * a screening decision, and cross-asset pairs are the ones least at risk of a
 * spuriously high reading anyway.
 */
export function correlation(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (n < 30) return 0;
  const x = a.slice(-n);
  const y = b.slice(-n);
  const mx = x.reduce((p, q) => p + q, 0) / n;
  const my = y.reduce((p, q) => p + q, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  return den > 0 ? num / den : 0;
}

export interface StructureSummary {
  /** Signals published across the replay. */
  signals: number;
  /** Signals whose target came from a real level rather than a projection. */
  withRealTarget: number;
  /** Daily bars the replay covered. */
  bars: number;
}

/**
 * Score a candidate 0-100 from its metrics.
 *
 * Weightings are a judgement call and are stated rather than hidden: liquidity
 * and structure carry the most because they are what make a name *scannable*,
 * and diversification carries real weight because a watchlist of near-identical
 * names is one position wearing thirty hats. Volatility scores as a band rather
 * than "more is better" — the screen wants enough movement to pay for risk, not
 * the wildest thing available.
 */
export function scoreCandidate(m: CandidateMetrics, gates: DiscoveryGates): ScoredCandidate {
  const failures: string[] = [];
  if (m.bars < gates.minBars) failures.push(`only ${m.bars} daily bars`);
  if (m.dollarVolume < gates.minDollarVolume) {
    failures.push(`${(m.dollarVolume / 1e6).toFixed(1)}M median daily volume`);
  }
  if (m.volatility < gates.minVolatility) {
    failures.push(`${(m.volatility * 100).toFixed(0)}% volatility — too quiet to pay for risk`);
  }
  if (m.volatility > gates.maxVolatility) {
    failures.push(`${(m.volatility * 100).toFixed(0)}% volatility — a lottery ticket`);
  }
  if (!m.incumbent && m.maxCorrelation > gates.maxCorrelation) {
    failures.push(
      `${m.maxCorrelation.toFixed(2)} correlated to ${m.closestTo ?? 'the watchlist'}`,
    );
  }

  // Liquidity, on a log scale: the step from 25M to 250M matters far more than
  // the step from 5B to 50B.
  const liquidity = Math.min(
    1,
    Math.log10(Math.max(m.dollarVolume, 1) / gates.minDollarVolume) / 2,
  );
  // Volatility as a band, peaking around 45% annualised.
  const volFit = Math.max(0, 1 - Math.abs(m.volatility - 0.45) / 0.65);
  // Structure density, saturating at roughly one setup per fortnight.
  const density = Math.min(1, m.setupDensity / 10);
  const magnitude = m.magnitudeAvailability;
  const diversification = Math.max(0, 1 - Math.max(0, m.maxCorrelation));

  const score =
    100 *
    (0.3 * liquidity + 0.15 * volFit + 0.2 * density + 0.15 * magnitude + 0.2 * diversification);

  return { ...m, score: Math.round(score), passed: failures.length === 0, failures };
}

export interface DiscoveryReport {
  /** New names that cleared every gate, best first. */
  additions: ScoredCandidate[];
  /** Watchlist members that no longer clear the gates. */
  removals: ScoredCandidate[];
  /** Everything examined, for the appendix. */
  all: ScoredCandidate[];
  poolSize: number;
  screened: number;
  watchlistSize: number;
}

export function buildDiscoveryReport(
  scored: ScoredCandidate[],
  poolSize: number,
  watchlistSize: number,
  maxAdditions = 15,
): DiscoveryReport {
  return {
    additions: scored
      .filter((c) => c.passed && !c.incumbent)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxAdditions),
    removals: scored
      .filter((c) => c.incumbent && !c.passed)
      .sort((a, b) => a.score - b.score),
    all: [...scored].sort((a, b) => b.score - a.score),
    poolSize,
    screened: scored.length,
    watchlistSize,
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const money = (v: number) =>
  v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : `$${(v / 1e6).toFixed(0)}M`;
const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

function table(headers: string[], rows: string[][]): string {
  return [headers, headers.map(() => '---'), ...rows]
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');
}

const candidateRow = (c: ScoredCandidate): string[] => [
  c.symbol,
  String(c.score),
  money(c.dollarVolume),
  pct(c.volatility),
  c.setupDensity.toFixed(1),
  pct(c.magnitudeAvailability),
  `${c.maxCorrelation.toFixed(2)}${c.closestTo ? ` (${c.closestTo})` : ''}`,
];

const HEADERS = ['Symbol', 'Score', 'Volume', 'Vol', 'Setups/100d', 'Real targets', 'Max corr'];

export interface DiscoveryMeta {
  generatedAt: Date;
  provenance: string;
  gates: DiscoveryGates;
}

export function renderDiscoveryReport(report: DiscoveryReport, meta: DiscoveryMeta): string {
  const lines: string[] = [];
  lines.push('# Universe Discovery — is this the right watchlist?');
  lines.push('');
  lines.push(
    `_Generated ${meta.generatedAt.toISOString().slice(0, 10)}_ · ` +
      `${report.screened} of ${report.poolSize} candidates screened · ` +
      `${report.watchlistSize} currently watched`,
  );
  lines.push('');
  lines.push(meta.provenance);
  lines.push('');
  lines.push(
    '**Candidates are scored on tradability, never on backtested profit.** Ranking a broad pool ' +
      'by historical returns and keeping the winners finds the symbols that happened to work over ' +
      'the sample, which is the property least likely to repeat. What is scored instead is ' +
      'liquidity, a volatility band, how often the symbol prints actionable structure, how often a ' +
      'real prior level exists to measure to, and how much it adds to what you already watch.',
  );
  lines.push('');

  if (report.screened === 0) {
    lines.push('No candidates screened — nothing to propose.');
    return lines.join('\n');
  }

  lines.push('## Proposed additions');
  lines.push('');
  if (report.additions.length === 0) {
    lines.push(
      '_Nothing cleared the gates. That is a real answer: the watchlist may already cover the ' +
        'tradable, uncorrelated names in the pool._',
    );
  } else {
    lines.push(table(HEADERS, report.additions.map(candidateRow)));
  }
  lines.push('');

  lines.push('## Flagged for removal');
  lines.push('');
  if (report.removals.length === 0) {
    lines.push('_Every watched symbol still clears the gates._');
  } else {
    lines.push(
      'A watchlist that only ever grows becomes a scan of everything. These are watched now and ' +
        'no longer qualify:',
    );
    lines.push('');
    lines.push(
      table(
        ['Symbol', 'Score', 'Why it no longer qualifies'],
        report.removals.map((c) => [c.symbol, String(c.score), c.failures.join('; ')]),
      ),
    );
  }
  lines.push('');

  lines.push('## Gates');
  lines.push('');
  lines.push(
    table(
      ['Gate', 'Threshold'],
      [
        ['Median daily dollar volume', `≥ ${money(meta.gates.minDollarVolume)}`],
        ['Annualised volatility', `${pct(meta.gates.minVolatility)} – ${pct(meta.gates.maxVolatility)}`],
        ['Daily bars of history', `≥ ${meta.gates.minBars}`],
        ['Correlation to an existing member', `≤ ${meta.gates.maxCorrelation.toFixed(2)}`],
      ],
    ),
  );
  lines.push('');

  lines.push('## Everything screened');
  lines.push('');
  lines.push(
    table(
      [...HEADERS, 'Status'],
      report.all.map((c) => [
        ...candidateRow(c),
        c.incumbent ? (c.passed ? 'watched' : '**watched, failing**') : c.passed ? 'eligible' : c.failures[0] ?? 'rejected',
      ]),
    ),
  );
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push(
    '_The candidate pool is a committed snapshot in `server/candidates/`, edit it freely. Being a ' +
      "snapshot of today's liquid names, it is itself survivorship-biased — it contains what " +
      'survived to be listed — so treat it as a starting universe rather than an unbiased one. ' +
      'Nothing here places a trade or edits a watchlist; adding a symbol is still your call._',
  );

  return lines.join('\n');
}

/** Setups per 100 trading days, from a replay summary. */
export const setupDensityFrom = (s: StructureSummary): number =>
  s.bars > 0 ? (s.signals / s.bars) * 100 : 0;

/** Share of setups that had a real level to measure to. */
export const magnitudeAvailabilityFrom = (s: StructureSummary): number =>
  s.signals > 0 ? s.withRealTarget / s.signals : 0;
