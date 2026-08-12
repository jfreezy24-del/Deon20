import { describe, expect, it } from 'vitest';
import {
  assetBlock,
  chunkBlocks,
  fmtPrice,
  formatWeeklyDiscord,
  formatWeeklyNtfy,
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

describe('assetBlock', () => {
  it('reports the ladder and nothing else', () => {
    const text = assetBlock(asset());
    expect(text).toContain('BTC-USD');
    expect(text).toContain('DCA ladder — ACCUMULATE');
    expect(text).toContain('28% @ 112,400 (−5.1%) · Prior week low [W]');
    expect(text).toContain('Avg fill 107,000');
  });

  it('carries no entry, invalidation, magnitude or continuity lines', () => {
    const text = assetBlock(asset());
    expect(text).not.toMatch(/entry/i);
    expect(text).not.toMatch(/stop/i);
    expect(text).not.toMatch(/invalidation/i);
    expect(text).not.toMatch(/magnitude/i);
    expect(text).not.toMatch(/\bT1\b|\bT2\b/);
    expect(text).not.toMatch(/FTFC|Last closed/);
  });

  it('stays compact enough to fit many assets in one message', () => {
    // 4 rungs + header + avg fill; the whole universe has to fit in a
    // handful of Discord messages.
    expect(assetBlock(asset()).split('\n')).toHaveLength(5);
  });

  it('says so when there is no structure left below price', () => {
    const text = assetBlock(asset({ dca: plan({ rungs: [], averageFill: null }) }));
    expect(text).toContain('No structure below price');
  });
});

describe('chunkBlocks', () => {
  it('never exceeds the limit and keeps every block', () => {
    const blocks = Array.from({ length: 20 }, (_, i) => `block ${i}\n${'x'.repeat(300)}`);
    const chunks = chunkBlocks(blocks, 1000);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(1000);
    for (let i = 0; i < blocks.length; i++) expect(chunks.join('\n')).toContain(`block ${i}`);
  });

  it('splits a single oversized block on line boundaries', () => {
    const big = Array.from({ length: 50 }, (_, i) => `line ${i}`).join('\n');
    const chunks = chunkBlocks([big], 100);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(100);
    expect(chunks.join('\n')).toContain('line 49');
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

  it('opens with the title and stays under the Discord limit', () => {
    const messages = formatWeeklyDiscord(report);
    expect(messages[0].split('\n')[0]).toBe('**🪙 Crypto Weekly — week of 2026-08-10**');
    for (const m of messages) expect(m.length).toBeLessThanOrEqual(2000);
  });

  it('carries no breadth counts or standing explainer', () => {
    const all = formatWeeklyDiscord(report).join('\n');
    expect(all).not.toMatch(/ladders ·|within 5% of spot|Stance:|Not financial advice/);
  });

  it('includes every asset and reports failed symbols', () => {
    const all = formatWeeklyDiscord(report).join('\n');
    expect(all).toContain('BTC-USD');
    expect(all).toContain('SOL-USD');
    expect(all).toContain('FAKE-USD');
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
