import { LadderProfile } from '../strat/dca';
import { CryptoTier } from './universe';
import { LadderFill, LadderRun, StanceObservation, StrategyResult } from './ladderBacktest';

/**
 * The ladder validation report.
 *
 * Two numbers have to be read together or not at all: **cost efficiency** (what
 * you paid against the average price on offer) and **deployment** (how much of
 * the budget you actually spent). Either alone is a way to lie to yourself. A
 * ladder resting at −40% will show a beautiful cost efficiency on the 8% of
 * capital that ever filled, and a ladder that fills instantly will deploy 100%
 * at no discount at all. Every table here carries both.
 *
 * The headline comparison is against a **fixed-percentage ladder with identical
 * sizing**. Beating buy-and-hold or weekly DCA on cost basis proves nothing —
 * any bid below spot does that in a market that dips. The only question that
 * matters is whether prior week lows and weekly/monthly pivots do it better
 * than round numbers.
 */

export interface SymbolBundle {
  symbol: string;
  tier: CryptoTier;
  /** The profile the live system assigns this symbol. */
  profile: LadderProfile;
  provider: string;
  bars: number;
  meanPrice: number;
  finalPrice: number;
  firstPlanDate?: string;
  lastDate?: string;
  /** Structural, control, spot and DCA — same budget, same window. */
  strategies: StrategyResult[];
  /** The structural run, for fill, stance and expiry analytics. */
  structural: LadderRun;
  ttlVariants: { ttlDays: number; run: LadderRun }[];
  profileVariants: { profile: LadderProfile; run: LadderRun }[];
}

export interface StrategyAggregate {
  label: string;
  symbols: number;
  budget: number;
  deployed: number;
  terminalValue: number;
  deploymentRate: number;
  /**
   * Mean across symbols of (average cost paid ÷ mean price available).
   * Below 1 means the strategy bought cheaper than the period's average.
   * Symbols that never filled anything are excluded — a strategy is not
   * credited with a good price for declining to trade.
   */
  costEfficiency: number;
  /** Symbols where anything at all was bought. */
  symbolsFilled: number;
  /** Terminal value ÷ budget. */
  multiple: number;
}

const mean = (xs: number[]) => (xs.length > 0 ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const median = (xs: number[]): number => {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function aggregateStrategy(
  label: string,
  entries: { result: StrategyResult; meanPrice: number }[],
): StrategyAggregate {
  const budget = entries.reduce((s, e) => s + e.result.budget, 0);
  const deployed = entries.reduce((s, e) => s + e.result.deployed, 0);
  const terminalValue = entries.reduce((s, e) => s + e.result.terminalValue, 0);
  const filled = entries.filter((e) => e.result.averageCost !== null && e.meanPrice > 0);

  return {
    label,
    symbols: entries.length,
    budget,
    deployed,
    terminalValue,
    deploymentRate: budget > 0 ? deployed / budget : 0,
    costEfficiency: mean(filled.map((e) => (e.result.averageCost as number) / e.meanPrice)),
    symbolsFilled: filled.length,
    multiple: budget > 0 ? terminalValue / budget : 0,
  };
}

export interface SourceStats {
  source: string;
  placed: number;
  filled: number;
  fillRate: number;
  medianDaysToFill: number;
  meanDiscountPct: number;
  /** Share of all deployed capital this source bought. */
  shareOfSpend: number;
}

export function sourceStats(runs: LadderRun[]): SourceStats[] {
  const placed = new Map<string, number>();
  const fills = new Map<string, LadderFill[]>();
  let totalSpend = 0;

  for (const run of runs) {
    for (const [source, count] of Object.entries(run.placementsBySource)) {
      placed.set(source, (placed.get(source) ?? 0) + count);
    }
    for (const f of run.fills) {
      const list = fills.get(f.source);
      if (list) list.push(f);
      else fills.set(f.source, [f]);
      totalSpend += f.spend;
    }
  }

  return [...new Set([...placed.keys(), ...fills.keys()])]
    .map((source) => {
      const got = fills.get(source) ?? [];
      const n = placed.get(source) ?? 0;
      return {
        source,
        placed: n,
        filled: got.length,
        fillRate: n > 0 ? got.length / n : 0,
        medianDaysToFill: median(got.map((f) => f.ageDays)),
        meanDiscountPct: mean(got.map((f) => f.discountPct)),
        shareOfSpend: totalSpend > 0 ? got.reduce((s, f) => s + f.spend, 0) / totalSpend : 0,
      };
    })
    .sort((a, b) => b.shareOfSpend - a.shareOfSpend);
}

export interface StanceStats {
  stance: string;
  n: number;
  meanForward30: number;
  meanForward90: number;
  /** Share of observations where price was lower 90 days later. */
  fellRate: number;
}

/**
 * What actually happened after each stance.
 *
 * `DEFENSIVE` claims the monthly sequence is broken and price is likely to
 * reach the deeper rungs. That is a forecast, and forward returns are the only
 * way to check it. If defensive weeks were followed by the same returns as
 * accumulate weeks, the stance is decoration on the report.
 */
export function stanceStats(observations: StanceObservation[]): StanceStats[] {
  const map = new Map<string, StanceObservation[]>();
  for (const o of observations) {
    const list = map.get(o.stance);
    if (list) list.push(o);
    else map.set(o.stance, [o]);
  }
  return ['accumulate', 'neutral', 'defensive']
    .filter((s) => map.has(s))
    .map((stance) => {
      const obs = map.get(stance) as StanceObservation[];
      const f30 = obs.map((o) => o.forward30).filter((v): v is number => v !== null);
      const f90 = obs.map((o) => o.forward90).filter((v): v is number => v !== null);
      return {
        stance,
        n: obs.length,
        meanForward30: mean(f30),
        meanForward90: mean(f90),
        fellRate: f90.length > 0 ? f90.filter((v) => v < 0).length / f90.length : 0,
      };
    });
}

export interface LadderReport {
  strategies: StrategyAggregate[];
  bySymbol: SymbolBundle[];
  sources: SourceStats[];
  stances: StanceStats[];
  ttl: { ttlDays: number; aggregate: StrategyAggregate; expired: number }[];
  profiles: { profile: LadderProfile; aggregate: StrategyAggregate }[];
  /** Profile comparison restricted to each tier, to test the skew directly. */
  profilesByTier: { tier: CryptoTier; rows: { profile: LadderProfile; aggregate: StrategyAggregate }[] }[];
  totalUnfunded: number;
  totalExpired: number;
  plansPublished: number;
  firstDate?: string;
  lastDate?: string;
}

export function buildLadderReport(bundles: SymbolBundle[]): LadderReport {
  const strategyCount = bundles[0]?.strategies.length ?? 0;
  const strategies: StrategyAggregate[] = [];
  for (let i = 0; i < strategyCount; i++) {
    strategies.push(
      aggregateStrategy(
        bundles[0].strategies[i].label,
        bundles.map((b) => ({ result: b.strategies[i], meanPrice: b.meanPrice })),
      ),
    );
  }

  const ttlDaysSeen = [...new Set(bundles.flatMap((b) => b.ttlVariants.map((v) => v.ttlDays)))].sort(
    (a, b) => a - b,
  );
  const ttl = ttlDaysSeen.map((ttlDays) => {
    const runs = bundles
      .map((b) => b.ttlVariants.find((v) => v.ttlDays === ttlDays))
      .filter((v): v is { ttlDays: number; run: LadderRun } => v !== undefined);
    return {
      ttlDays,
      aggregate: aggregateStrategy(
        `TTL ${ttlDays}d`,
        runs.map((v) => ({ result: v.run, meanPrice: v.run.meanPrice })),
      ),
      expired: runs.reduce((s, v) => s + v.run.expiredCount, 0),
    };
  });

  const profilesSeen = [
    ...new Set(bundles.flatMap((b) => b.profileVariants.map((v) => v.profile))),
  ];
  const profileAgg = (subset: SymbolBundle[], profile: LadderProfile) => {
    const runs = subset
      .map((b) => b.profileVariants.find((v) => v.profile === profile))
      .filter((v): v is { profile: LadderProfile; run: LadderRun } => v !== undefined);
    return aggregateStrategy(
      profile,
      runs.map((v) => ({ result: v.run, meanPrice: v.run.meanPrice })),
    );
  };

  const tiers = [...new Set(bundles.map((b) => b.tier))];
  const dates = bundles.map((b) => b.firstPlanDate).filter((d): d is string => !!d).sort();
  const ends = bundles.map((b) => b.lastDate).filter((d): d is string => !!d).sort();

  return {
    strategies,
    bySymbol: [...bundles].sort((a, b) => a.symbol.localeCompare(b.symbol)),
    sources: sourceStats(bundles.map((b) => b.structural)),
    stances: stanceStats(bundles.flatMap((b) => b.structural.stances)),
    ttl,
    profiles: profilesSeen.map((profile) => ({ profile, aggregate: profileAgg(bundles, profile) })),
    profilesByTier: tiers.map((tier) => ({
      tier,
      rows: profilesSeen.map((profile) => ({
        profile,
        aggregate: profileAgg(
          bundles.filter((b) => b.tier === tier),
          profile,
        ),
      })),
    })),
    totalUnfunded: bundles.reduce((s, b) => s + b.structural.unfundedSpend, 0),
    totalExpired: bundles.reduce((s, b) => s + b.structural.expiredCount, 0),
    plansPublished: bundles.reduce((s, b) => s + b.structural.plansPublished, 0),
    firstDate: dates[0],
    lastDate: ends[ends.length - 1],
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const p0 = (v: number) => `${(v * 100).toFixed(0)}%`;
const p1 = (v: number) => `${(v * 100).toFixed(1)}%`;
const x2 = (v: number) => `${v.toFixed(2)}×`;
const money = (v: number) =>
  `$${Math.round(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

function table(headers: string[], rows: string[][]): string {
  return [headers, headers.map(() => '---'), ...rows]
    .map((r) => `| ${r.join(' | ')} |`)
    .join('\n');
}

/** The live profile assignment, so the skew table can mark it. */
const LIVE_PROFILE: Record<CryptoTier, LadderProfile> = {
  major: 'tight',
  large: 'balanced',
  'high-beta': 'wide',
};

export interface LadderReportMeta {
  provenance: string;
  generatedAt: Date;
  budget: number;
}

export function renderLadderReport(report: LadderReport, meta: LadderReportMeta): string {
  const lines: string[] = [];
  lines.push('# DCA Ladder — does the structure earn its place?');
  lines.push('');
  lines.push(
    `_Generated ${meta.generatedAt.toISOString().slice(0, 10)}_ · ` +
      `**${report.bySymbol.length}** assets · **${report.plansPublished}** weekly plans replayed` +
      (report.firstDate ? ` · ${report.firstDate} to ${report.lastDate}` : '') +
      ` · ${money(meta.budget)} budget per asset`,
  );
  lines.push('');
  lines.push(meta.provenance);
  lines.push('');

  if (report.bySymbol.length === 0 || report.plansPublished === 0) {
    lines.push('No plans replayed — nothing to measure.');
    return lines.join('\n');
  }

  lines.push(
    '**Read cost efficiency and deployment together or not at all.** A ladder resting far below ' +
      'spot will show a beautiful average price on the sliver of capital that ever filled, and a ' +
      'ladder that fills instantly deploys everything at no discount. Either number alone is a ' +
      'way to lie to yourself, so every table below carries both.',
  );
  lines.push('');

  /* Headline */
  const structural = report.strategies.find((s) => s.label.includes('Structural'));
  const control = report.strategies.find((s) => s.label.includes('Fixed-percentage'));

  lines.push('## Does the structure beat round numbers?');
  lines.push('');
  lines.push(
    'The comparison that matters. Beating buy-and-hold on cost basis proves nothing — any bid ' +
      'below spot does that in a market that dips. The control ladder uses **identical sizing and ' +
      'identical tier weights**, placed at fixed percentages instead of at structure. The gap ' +
      'between the two rows is the entire value of reading TheStrat levels.',
  );
  lines.push('');
  lines.push(
    table(
      ['Strategy', 'Deployed', 'Cost efficiency', 'Assets filled', 'Terminal value', 'Multiple'],
      report.strategies.map((s) => [
        s.label,
        `${p0(s.deploymentRate)} (${money(s.deployed)})`,
        s.symbolsFilled > 0 ? x2(s.costEfficiency) : '—',
        `${s.symbolsFilled}/${s.symbols}`,
        money(s.terminalValue),
        x2(s.multiple),
      ]),
    ),
  );
  lines.push('');
  lines.push(
    '_Cost efficiency is average price paid ÷ mean price available over the window. Below 1.00 ' +
      'means the strategy bought cheaper than the period\'s average; 1.00 means it paid the ' +
      'going rate._',
  );
  lines.push('');

  if (structural && control) {
    const effGap = control.costEfficiency - structural.costEfficiency;
    const depGap = structural.deploymentRate - control.deploymentRate;
    const verdict =
      structural.symbolsFilled === 0
        ? '**the structural ladder never filled anything** — whatever its levels claim, they were not reachable'
        : Math.abs(effGap) < 0.005 && Math.abs(depGap) < 0.05
          ? '**the structure is not doing any work** — round percentages bought at the same price, ' +
            'in the same size. The rung sources are elaborate packaging on an ordinary ladder'
          : effGap > 0 && depGap >= -0.05
            ? '**the structure is earning its place** — better prices without giving up deployment'
            : effGap > 0
              ? '**the structure buys cheaper but deploys less** — whether that is a win depends on ' +
                'whether you would rather own the asset or the cash'
              : '**the control ladder is better** — round percentages beat the structural levels here';
    lines.push(
      `Structural against control: **${effGap >= 0 ? '' : '+'}${(-effGap * 100).toFixed(2)}%** ` +
        `on cost efficiency and **${depGap >= 0 ? '+' : ''}${(depGap * 100).toFixed(0)}pp** on ` +
        `deployment — ${verdict}.`,
    );
    lines.push('');
  }

  /* Rung sources */
  lines.push('## Which rung source earns its place?');
  lines.push('');
  lines.push(
    'Fill rate is per **distinct rung placed** — a level the next plan still wants keeps its ' +
      'original placement and is not counted twice, exactly as the live reconciliation treats it. ' +
      'A source that is offered constantly and rarely fills is not the same as one offered rarely ' +
      'and always filled, and a raw fill count cannot tell them apart.',
  );
  lines.push('');
  lines.push(
    table(
      ['Source', 'Placed', 'Filled', 'Fill rate', 'Median days to fill', 'Mean discount', 'Share of spend'],
      report.sources.map((s) => [
        s.source,
        String(s.placed),
        String(s.filled),
        p0(s.fillRate),
        s.filled > 0 ? String(Math.round(s.medianDaysToFill)) : '—',
        s.filled > 0 ? `${s.meanDiscountPct.toFixed(1)}%` : '—',
        p0(s.shareOfSpend),
      ]),
    ),
  );
  lines.push('');
  lines.push(
    '_A source with a high fill rate and a small discount is a shallow rung doing ordinary work. ' +
      'One with a low fill rate and a large discount only matters in a flush — worth keeping if ' +
      'it carries real size when it does, worth cutting if it never fills._',
  );
  lines.push('');

  /* TTL */
  lines.push('## Is 90 days the right expiry?');
  lines.push('');
  lines.push(
    'A rung that rests unfilled past the TTL is cancelled, on the argument that a level is only ' +
      'meaningful while the structure that produced it stands. If a longer TTL deploys more ' +
      'capital at a similar price, the expiry is cancelling bids that were about to fill.',
  );
  lines.push('');
  lines.push(
    table(
      ['TTL', 'Deployed', 'Cost efficiency', 'Rungs expired', 'Terminal value'],
      report.ttl.map((t) => [
        t.ttlDays >= 100_000 ? 'Never expire' : `${t.ttlDays} days`,
        p0(t.aggregate.deploymentRate),
        t.aggregate.symbolsFilled > 0 ? x2(t.aggregate.costEfficiency) : '—',
        String(t.expired),
        money(t.aggregate.terminalValue),
      ]),
    ),
  );
  lines.push('');
  if (report.ttl.every((t) => t.aggregate.deploymentRate >= 0.999)) {
    lines.push(
      '> Every TTL deployed the full budget, so this table cannot separate them. The ladder ' +
        'runs out of cash before expiry ever becomes the binding constraint — raise the budget ' +
        'per asset to make the comparison informative.',
    );
    lines.push('');
  }

  /* Profile skew */
  lines.push('## Does the tier skew pay?');
  lines.push('');
  lines.push(
    'Majors are front-loaded (`tight`), large caps balanced, high-beta back-loaded (`wide`), on ' +
      'the argument that high-beta names routinely trade through the first pivot. Each tier is ' +
      'replayed under all three profiles below; **⬅︎ marks the profile the live system assigns**. ' +
      'If another row wins its tier consistently, the skew is backwards.',
  );
  lines.push('');
  for (const { tier, rows } of report.profilesByTier) {
    lines.push(`**${tier}**`);
    lines.push('');
    lines.push(
      table(
        ['Profile', 'Deployed', 'Cost efficiency', 'Terminal value', 'Multiple'],
        rows.map((r) => [
          LIVE_PROFILE[tier] === r.profile ? `**${r.profile}** ⬅︎` : r.profile,
          p0(r.aggregate.deploymentRate),
          r.aggregate.symbolsFilled > 0 ? x2(r.aggregate.costEfficiency) : '—',
          money(r.aggregate.terminalValue),
          x2(r.aggregate.multiple),
        ]),
      ),
    );
    lines.push('');
  }

  /* Stance */
  lines.push('## Was DEFENSIVE ever the right call?');
  lines.push('');
  lines.push(
    '`DEFENSIVE` is a forecast: the monthly sequence is broken, so hold size back because the ' +
      'flush is more likely to reach the deep rungs. Forward returns are the only way to check ' +
      'it. If defensive weeks were followed by the same returns as accumulate weeks, the stance ' +
      'is decoration.',
  );
  lines.push('');
  lines.push(
    table(
      ['Stance', 'Weeks', 'Mean +30d', 'Mean +90d', 'Lower after 90d'],
      report.stances.map((s) => [
        s.stance,
        String(s.n),
        `${s.meanForward30 >= 0 ? '+' : ''}${s.meanForward30.toFixed(1)}%`,
        `${s.meanForward90 >= 0 ? '+' : ''}${s.meanForward90.toFixed(1)}%`,
        p0(s.fellRate),
      ]),
    ),
  );
  lines.push('');

  /* Mechanics worth knowing */
  lines.push('## Mechanics');
  lines.push('');
  lines.push(`- **${report.totalExpired}** rungs expired unfilled across the replay.`);
  lines.push(
    `- **${money(report.totalUnfunded)}** of requested spend arrived after the lump sum ran out. ` +
      'This is a limit of the replay, not a fault in the ladder. Each weekly plan allocates 100% ' +
      'of **that week\'s contribution**, and the resting rungs are replaced rather than stacked, ' +
      'so the live ladder never commits more than one contribution at a time. The replay hands ' +
      'over a single lump sum for the whole window instead, so once it is spent every later plan ' +
      'reads as unfunded. Treat this as the cost of the lump-sum model — until the replay takes ' +
      'weekly contributions, everything after the first drawdown is measured with no money left.',
  );
  lines.push('');

  /* Per symbol */
  lines.push('## By asset');
  lines.push('');
  lines.push(
    table(
      ['Asset', 'Tier', 'Bars', 'Structural deployed', 'Structural eff.', 'Control eff.', 'Structural value', 'Control value'],
      report.bySymbol.map((b) => {
        const s = b.strategies[0];
        const c = b.strategies[1];
        const eff = (r: StrategyResult) =>
          r.averageCost !== null && b.meanPrice > 0 ? x2(r.averageCost / b.meanPrice) : '—';
        return [
          b.symbol,
          b.tier,
          String(b.bars),
          p0(s.budget > 0 ? s.deployed / s.budget : 0),
          eff(s),
          eff(c),
          money(s.terminalValue),
          money(c.terminalValue),
        ];
      }),
    ),
  );
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(
    '_The replay runs the production functions — `buildDcaPlan`, `reconcilePlan`, `applyFills`, ' +
      '`expireStaleRungs` — not a reimplementation, so what is measured is the system that ships. ' +
      'Weekly and monthly candles are rebuilt from daily bars with the same partial-aware ' +
      'aggregation the signal backtest uses, so a plan sees only the days that had traded when it ' +
      'was published. A touch counts as a fill, matching the live job. Fees, spread and the fact ' +
      'that a resting bid in a thin token may not fill in size are not modelled._',
  );

  return lines.join('\n');
}
