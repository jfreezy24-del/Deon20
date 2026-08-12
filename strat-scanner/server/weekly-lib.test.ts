import { describe, expect, it } from 'vitest';
import {
  assetEmbed,
  chunkEmbeds,
  fmtPrice,
  formatWeeklyDiscord,
  formatWeeklyNtfy,
  ladderTable,
  MAX_EMBEDS_PER_MESSAGE,
} from './weekly-lib';
import { buildWeeklyReport, WeeklyAsset, weekOf } from '../src/crypto/weeklyReport';
import { DcaPlan, DcaRung } from '../src/strat/dca';

const rung = (over: Partial<DcaRung> = {}): DcaRung => ({
  price: 112_400,
  discountPct: 5.1,
  allocationPct: 28,
  source: 'Prior week low',
  timeframe: 'W',
  rationale: 'weekly turns 2d here',
  ...over,
});

const plan = (over: Partial<DcaPlan> = {}): DcaPlan => ({
  symbol: 'BTC-USD',
  lastPrice: 118_432,
  stance: 'accumulate',
  stanceReason: 'higher-timeframe continuity is up',
  weeklyType: '1',
  monthlyType: '2u',
  weeklyTrend: 'up',
  monthlyTrend: 'up',
  rungs: [
    rung(),
    rung({
      price: 104_900,
      discountPct: 11.4,
      allocationPct: 72,
      source: 'Weekly pivot low',
      rationale: 'broadening formation point',
    }),
  ],
  averageFill: 107_000,
  ...over,
});

const asset = (over: Partial<WeeklyAsset> = {}): WeeklyAsset => ({
  symbol: 'BTC-USD',
  name: 'Bitcoin',
  lastPrice: 118_432,
  weekChangePct: 3.2,
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' },
  dca: plan(),
  ...over,
});

describe('fmtPrice', () => {
  it('drops decimals on large prices and keeps them on sub-dollar coins', () => {
    expect(fmtPrice(118_432.37)).toBe('118,432');
    expect(fmtPrice(12.3456)).toBe('12.35');
    expect(fmtPrice(0.128_456)).toBe('0.1285');
    expect(fmtPrice(0.000_012_3)).toBe('0.000012');
  });
});

describe('ladderTable', () => {
  it('aligns the columns so the numbers read as a table', () => {
    const lines = ladderTable(
      plan({
        rungs: [
          rung({ allocationPct: 8, price: 1200, discountPct: 5.1 }),
          rung({ allocationPct: 92, price: 950.5, discountPct: 11.42, source: 'Monthly pivot low' }),
        ],
      }),
    ).split('\n');

    // Numbers are right-aligned, so every row hands off to the source column
    // at the same offset regardless of how wide its figures are.
    expect(lines[0].indexOf('W low')).toBe(lines[1].indexOf('M pivot'));
    expect(lines[0]).toMatch(/^\s+8%\s+1,200\s+−5\.1%\s+W low$/);
  });

  it('says so when there is no structure below price', () => {
    expect(ladderTable(plan({ rungs: [] }))).toMatch(/no structure below price/i);
  });
});

describe('assetEmbed', () => {
  it('colours the stripe by stance and marks it with a dot', () => {
    expect(assetEmbed(asset()).color).toBe(0x57f287);
    expect(assetEmbed(asset()).title).toContain('🟢');

    const defensive = assetEmbed(asset({ dca: plan({ stance: 'defensive' }) }));
    expect(defensive.color).toBe(0xed4245);
    expect(defensive.title).toContain('🔴');

    const neutral = assetEmbed(asset({ dca: plan({ stance: 'neutral' }) }));
    expect(neutral.color).toBe(0xfee75c);
    expect(neutral.title).toContain('🟡');
  });

  it('carries price, weekly move and the ladder in a code block', () => {
    const embed = assetEmbed(asset());
    expect(embed.title).toContain('BTC-USD · Bitcoin');
    expect(embed.description).toContain('**$118,432**');
    expect(embed.description).toContain('▲ 3.2% this week');
    expect(embed.description).toMatch(/```[\s\S]*112,400[\s\S]*```/);
    expect(embed.footer?.text).toBe('avg fill 107,000');
  });

  it('marks a weekly loss with a down arrow', () => {
    expect(assetEmbed(asset({ weekChangePct: -6.9 })).description).toContain('▼ 6.9% this week');
  });

  it('omits the footer when there is no ladder to average', () => {
    expect(assetEmbed(asset({ dca: plan({ rungs: [], averageFill: null }) })).footer).toBeUndefined();
  });
});

describe('chunkEmbeds', () => {
  it('never exceeds ten embeds per message', () => {
    const groups = chunkEmbeds(Array.from({ length: 23 }, () => assetEmbed(asset())));
    expect(groups).toHaveLength(3);
    for (const g of groups) expect(g.length).toBeLessThanOrEqual(MAX_EMBEDS_PER_MESSAGE);
    expect(groups.flat()).toHaveLength(23);
  });

  it('splits early when the embeds are character-heavy', () => {
    const fat = assetEmbed(asset());
    fat.description = 'x'.repeat(2000);
    const groups = chunkEmbeds([fat, { ...fat }, { ...fat }, { ...fat }]);
    expect(groups.length).toBeGreaterThan(1);
  });
});

describe('buildWeeklyReport', () => {
  const near = asset({ symbol: 'SOL-USD', dca: plan({ rungs: [rung({ discountPct: 1.8 })] }) });
  const far = asset({ symbol: 'ADA-USD', dca: plan({ rungs: [rung({ discountPct: 22 })] }) });
  const none = asset({ symbol: 'TAO-USD', dca: plan({ rungs: [] }) });

  it('orders ladders closest-to-filling first, empty ones last', () => {
    const report = buildWeeklyReport([far, none, near], []);
    expect(report.assets.map((a) => a.symbol)).toEqual(['SOL-USD', 'ADA-USD', 'TAO-USD']);
  });

  it('counts ladders with a rung within 5% of spot', () => {
    const report = buildWeeklyReport([near, far, none], []);
    expect(report.breadth.nearFill).toBe(1);
    expect(report.breadth.scanned).toBe(3);
  });
});

describe('formatWeeklyDiscord', () => {
  const report = buildWeeklyReport(
    [asset(), asset({ symbol: 'SOL-USD', name: 'Solana' })],
    [{ symbol: 'FAKE-USD', message: 'no data returned' }],
    Date.UTC(2026, 7, 12),
  );

  it('leads with a header and one embed per asset', () => {
    const messages = formatWeeklyDiscord(report);
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('## 🪙 Crypto Weekly — week of 2026-08-10');
    expect(messages[0].embeds.map((e) => e.title.replace(/^\S+ /, ''))).toEqual([
      'BTC-USD · Bitcoin',
      'SOL-USD · Solana',
    ]);
  });

  it('reports failed symbols as subtext on the last message', () => {
    const messages = formatWeeklyDiscord(report);
    expect(messages[messages.length - 1].content).toContain('-# 1 symbol(s) failed to scan: FAKE-USD');
  });

  it('carries no breadth counts or standing explainer', () => {
    const all = JSON.stringify(formatWeeklyDiscord(report));
    expect(all).not.toMatch(/ladders ·|within 5% of spot|Stance:|Not financial advice/);
  });

  it('puts the header only on the first message when the report spans several', () => {
    const many = buildWeeklyReport(
      Array.from({ length: 14 }, (_, i) => asset({ symbol: `SYM${i}-USD` })),
      [],
      Date.UTC(2026, 7, 12),
    );
    const messages = formatWeeklyDiscord(many);
    expect(messages).toHaveLength(2);
    expect(messages[0].content).toContain('Crypto Weekly');
    expect(messages[1].content).toBeUndefined();
  });
});

describe('formatWeeklyNtfy', () => {
  const report = buildWeeklyReport(
    [asset(), asset({ symbol: 'ETH-USD', name: 'Ethereum' }), asset({ symbol: 'SOL-USD' })],
    [],
  );

  it('leads with a digest and then one ladder push per featured asset', () => {
    const messages = formatWeeklyNtfy(report, 2);
    expect(messages).toHaveLength(3);
    expect(messages[0].title).toContain('Crypto Weekly');
    expect(messages[0].body).toContain('3 ladders');
    expect(messages[0].body).toContain('first rung 28% @ 112,400');
    expect(messages[1].title).toContain('ladder — ACCUMULATE');
    expect(messages[1].body).toContain('DCA ladder');
  });

  it('raises priority only when a rung is within reach of spot', () => {
    const far = buildWeeklyReport([asset({ dca: plan({ rungs: [rung({ discountPct: 18 })] }) })], []);
    const near = buildWeeklyReport([asset({ dca: plan({ rungs: [rung({ discountPct: 2.4 })] }) })], []);
    expect(formatWeeklyNtfy(far)[1].priority).toBe('default');
    expect(formatWeeklyNtfy(near)[1].priority).toBe('high');
  });
});

describe('weekOf', () => {
  it('names the Monday of the week being planned', () => {
    expect(weekOf(Date.UTC(2026, 7, 9))).toBe('2026-08-10'); // Sunday -> the week about to start
    expect(weekOf(Date.UTC(2026, 7, 10, 1))).toBe('2026-08-10'); // scheduled Monday run
    expect(weekOf(Date.UTC(2026, 7, 13))).toBe('2026-08-10'); // manual mid-week run
  });
});
