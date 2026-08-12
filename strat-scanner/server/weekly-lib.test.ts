import { describe, expect, it } from 'vitest';
import {
  assetBlock,
  chunkBlocks,
  fmtPrice,
  formatWeeklyDiscord,
  formatWeeklyNtfy,
} from './weekly-lib';
import { buildWeeklyReport, WeeklyAsset, weekOf } from '../src/crypto/weeklyReport';
import { DcaPlan } from '../src/strat/dca';
import { Signal } from '../src/strat/types';

const signal = (over: Partial<Signal> = {}): Signal => ({
  symbol: 'BTC-USD',
  lastPrice: 118_432,
  timeframe: 'W',
  direction: 'bullish',
  pattern: '2-1-2 Continuation',
  sequence: '2u-1-?',
  status: 'POTENTIAL',
  scenario: 'continuation',
  compression: true,
  isReversal: false,
  confidence: 72,
  confidenceLabel: 'High',
  factors: [],
  explanation: 'x',
  levels: { entry: 119_100, stop: 112_400, target1: 128_500, target2: 141_000, rr1: 1.4, rr2: 3.3 },
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' },
  setupBarTime: 1_700_000_000,
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
    {
      price: 112_400,
      discountPct: 5.1,
      allocationPct: 28,
      source: 'Prior week low',
      timeframe: 'W',
      rationale: 'weekly turns 2d here',
    },
    {
      price: 104_900,
      discountPct: 11.4,
      allocationPct: 72,
      source: 'Weekly pivot low',
      timeframe: 'W',
      rationale: 'broadening formation point',
    },
  ],
  invalidation: 92_300,
  magnitude: 141_000,
  averageFill: 107_000,
  ...over,
});

const asset = (over: Partial<WeeklyAsset> = {}): WeeklyAsset => ({
  symbol: 'BTC-USD',
  name: 'Bitcoin',
  lastPrice: 118_432,
  weekChangePct: 3.2,
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' },
  entries: [signal()],
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
  it('carries the trade plan and the ladder', () => {
    const text = assetBlock(asset());
    expect(text).toContain('BTC-USD');
    expect(text).toContain('Entry 119,100');
    expect(text).toContain('Stop 112,400');
    expect(text).toContain('DCA ladder — ACCUMULATE');
    expect(text).toContain('28% @ 112,400');
    expect(text).toContain('Invalidation 92,300');
    expect(text).toContain('FTFC 4H▲ D▲ W▲ M▲');
  });

  it('still shows the ladder when nothing triggers an entry', () => {
    const text = assetBlock(asset({ entries: [] }));
    expect(text).toContain('the ladder is the plan');
    expect(text).toContain('DCA ladder');
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

describe('formatWeeklyDiscord', () => {
  const report = buildWeeklyReport(
    [asset(), asset({ symbol: 'SOL-USD', name: 'Solana', entries: [] })],
    [{ symbol: 'FAKE-USD', message: 'no data returned' }],
  );

  it('opens with the header and stays under the Discord limit', () => {
    const messages = formatWeeklyDiscord(report);
    expect(messages[0]).toContain('Crypto Weekly');
    for (const m of messages) expect(m.length).toBeLessThanOrEqual(2000);
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

  it('leads with a digest and then one push per featured asset', () => {
    const messages = formatWeeklyNtfy(report, 2);
    expect(messages).toHaveLength(3);
    expect(messages[0].title).toContain('Crypto Weekly');
    expect(messages[0].body).toContain('3 assets scanned');
    expect(messages[1].body).toContain('DCA ladder');
  });

  it('raises priority only for high-confidence setups', () => {
    const low = buildWeeklyReport([asset({ entries: [signal({ confidence: 52 })] })], []);
    expect(formatWeeklyNtfy(low)[1].priority).toBe('default');
    expect(formatWeeklyNtfy(report)[1].priority).toBe('high');
  });
});

describe('weekOf', () => {
  it('names the Monday of the week being planned', () => {
    expect(weekOf(Date.UTC(2026, 7, 9))).toBe('2026-08-10'); // Sunday -> the week about to start
    expect(weekOf(Date.UTC(2026, 7, 10, 1))).toBe('2026-08-10'); // scheduled Monday run
    expect(weekOf(Date.UTC(2026, 7, 13))).toBe('2026-08-10'); // manual mid-week run
  });
});
