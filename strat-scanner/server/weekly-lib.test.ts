import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assetField,
  DEFAULT_WRITEUP_SYMBOLS,
  ExpiredRungOf,
  expiryPush,
  fillPush,
  formatFillsDiscord,
  onlySymbols,
  parseSymbols,
  parseRoleIds,
  parseWebhooks,
  positionLine,
  roleForWebhook,
  withRoleMention,
  chunkEmbeds,
  composeWeeklyMessages,
  describeDiscord,
  fmtPrice,
  formatWeeklyDiscord,
  formatWeeklyNtfy,
  ladderTable,
  MAX_EMBEDS_PER_MESSAGE,
  stanceEmbeds,
} from './weekly-lib';
import { buildWeeklyReport, WeeklyAsset, weekOf } from '../src/crypto/weeklyReport';
import { DcaPlan, DcaRung } from '../src/strat/dca';
import { AssetStructure } from '../src/crypto/structure';

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

const structure = (over: Partial<AssetStructure> = {}): AssetStructure => ({
  weekly: { type: '2u', triggerUp: 121_400, triggerDown: 112_400, run: 1 },
  monthly: { type: '1', triggerUp: 121_400, triggerDown: 112_400, run: 1 },
  targetsUp: [128_500, 141_000],
  targetsDown: [104_900, 92_300],
  ...over,
});

const asset = (over: Partial<WeeklyAsset> = {}): WeeklyAsset => ({
  symbol: 'BTC-USD',
  name: 'Bitcoin',
  lastPrice: 118_432,
  weekChangePct: 3.2,
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'up' },
  dca: plan(),
  structure: structure(),
  ...over,
});

describe('positionLine', () => {
  it('reports fills against the plan', () => {
    expect(
      positionLine({
        filledCount: 3,
        totalCount: 4,
        averageFill: 171,
        deployedPct: 72,
        plannedAverage: 166,
      }),
    ).toBe('3 of 4 filled, average $171 against $166 planned, 72% deployed');
  });

  it('says nothing at all before the first fill', () => {
    expect(
      positionLine({
        filledCount: 0,
        totalCount: 4,
        averageFill: null,
        deployedPct: 0,
        plannedAverage: 166,
      }),
    ).toBeNull();
  });
});

const fill = (over = {}) => ({
  symbol: 'SOL-USD',
  price: 186,
  allocationPct: 20,
  source: 'Prior week low',
  filledOn: '2026-08-13',
  ...over,
});

const stale = (over = {}): ExpiredRungOf => ({
  symbol: 'SOL-USD',
  price: 120,
  allocationPct: 29,
  source: 'Monthly pivot low',
  timeframe: 'M',
  placedOn: '2026-01-01',
  filledOn: null,
  ageDays: 120,
  ...over,
});

describe('formatFillsDiscord', () => {

  it('groups fills by symbol', () => {
    const msg = formatFillsDiscord(
      [fill(), fill({ price: 171, allocationPct: 24 }), fill({ symbol: 'BTC-USD' })],
      [],
    );
    expect(msg.embeds[0].fields).toHaveLength(2);
    expect(msg.embeds[0].fields?.[0].name).toContain('SOL-USD · 2 rungs filled');
    expect(msg.embeds[0].fields?.[0].value).toContain('20% at $186 on 2026-08-13');
  });

  it('lists expired rungs separately from fills', () => {
    const msg = formatFillsDiscord([], [stale()]);
    expect(msg.embeds[0].title).toBe('Stale rungs cleared');
    expect(msg.embeds[0].fields?.[0].name).toBe('Expired, never filled');
    expect(msg.embeds[0].fields?.[0].value).toContain('resting 120 days');
  });

  it('names the coin each expired rung belonged to', () => {
    // More than one ladder can age out on the same day, and a bare list of
    // prices does not say which one lost a rung.
    const msg = formatFillsDiscord([], [stale(), stale({ symbol: 'ADA-USD', price: 0.42 })]);
    const value = msg.embeds[0].fields?.[0].value ?? '';
    expect(value).toContain('SOL-USD: 29% at $120');
    expect(value).toContain('ADA-USD: 29% at $0.42');
  });

  it('colours a fill green and a bare expiry amber', () => {
    expect(formatFillsDiscord([fill()], []).embeds[0].color).toBe(0x57f287);
    expect(formatFillsDiscord([], []).embeds[0].color).toBe(0xfee75c);
  });
});

describe('onlySymbols', () => {
  const of = (symbol: string) => fill({ symbol });

  it('keeps the write-up coins and drops the rest', () => {
    const kept = onlySymbols(
      [of('SOL-USD'), of('DOGE-USD'), of('BTC-USD'), of('LINK-USD')],
      DEFAULT_WRITEUP_SYMBOLS,
    );
    expect(kept.map((f) => f.symbol)).toEqual(['SOL-USD', 'BTC-USD']);
  });

  it('leaves nothing to send when no write-up coin filled', () => {
    // The caller checks for an empty result and sends no message at all,
    // rather than an embed with no fields in it.
    expect(onlySymbols([of('ADA-USD'), of('DOT-USD')], DEFAULT_WRITEUP_SYMBOLS)).toEqual([]);
  });

  it('matches regardless of case or stray spacing in the setting', () => {
    expect(onlySymbols([of('sol-usd')], [' SOL-USD '])).toHaveLength(1);
  });

  it('follows the same list the weekly write-ups use', () => {
    // One setting drives both: adding a coin to the write-ups adds its fill
    // alerts, with nothing else to remember.
    const configured = parseSymbols('SOL-USD, HYPE-USD', DEFAULT_WRITEUP_SYMBOLS);
    expect(onlySymbols([of('BTC-USD'), of('HYPE-USD')], configured).map((f) => f.symbol)).toEqual([
      'HYPE-USD',
    ]);
  });

  it('defaults to the four coins Discord reports on', () => {
    expect(DEFAULT_WRITEUP_SYMBOLS).toEqual(['SOL-USD', 'BTC-USD', 'ETH-USD', 'HYPE-USD']);
  });
});

describe('ntfy pushes', () => {
  it('groups fills by coin and interrupts for them', () => {
    const push = fillPush([fill(), fill({ price: 171, allocationPct: 24 }), fill({ symbol: 'ADA-USD', price: 0.42 })]);
    expect(push.title).toBe('🎯 3 ladder rung(s) filled');
    // Sub-dollar coins keep four decimals, so a cent is not rounded away.
    expect(push.body).toBe('SOL-USD: 20% at $186, 24% at $171\nADA-USD: 20% at $0.4200');
    expect(push.priority).toBe('high');
  });

  it('sends expiries quietly, so housekeeping never dilutes a fill', () => {
    const push = expiryPush([stale(), stale({ symbol: 'DOT-USD', price: 3.1, ageDays: 96 })]);
    expect(push.title).toBe('🗑️ 2 stale rung(s) cleared');
    expect(push.body).toBe(
      'SOL-USD: 29% at $120, resting 120 days\nDOT-USD: 29% at $3.10, resting 96 days',
    );
    // A cleared bid is a record, not an event: never a lock-screen alert.
    expect(push.priority).toBe('default');
  });

  it('reaches coins Discord never mentions', () => {
    // The point of routing expiries here: ntfy carries every coin, Discord
    // only the four it writes up.
    const push = expiryPush([stale({ symbol: 'LINK-USD' })]);
    expect(push.body).toContain('LINK-USD');
    expect(DEFAULT_WRITEUP_SYMBOLS).not.toContain('LINK-USD');
  });

  it('never renders a missing field as undefined', () => {
    for (const push of [fillPush([fill()]), expiryPush([stale()])]) {
      expect(`${push.title} ${push.body}`).not.toContain('undefined');
    }
  });
});

describe('role mentions', () => {
  beforeEach(() => vi.spyOn(console, 'warn').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('reads ids, bare or already wrapped', () => {
    expect(parseRoleIds('123456789012345678')).toEqual(['123456789012345678']);
    expect(parseRoleIds('<@&123456789012345678>')).toEqual(['123456789012345678']);
    expect(parseRoleIds('111111111,222222222')).toEqual(['111111111', '222222222']);
  });

  it('ignores anything that is not a numeric id', () => {
    expect(parseRoleIds('@traders')).toEqual([]);
    expect(parseRoleIds(undefined)).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('uses one id for every channel, or one per channel in order', () => {
    expect(roleForWebhook(['111111111'], 0)).toBe('111111111');
    expect(roleForWebhook(['111111111'], 3)).toBe('111111111');
    expect(roleForWebhook(['111111111', '222222222'], 1)).toBe('222222222');
    expect(roleForWebhook([], 0)).toBeUndefined();
  });

  it('trails the title, and never sits in an embed', () => {
    const msg = withRoleMention({ content: '## Header', embeds: [] }, '111111111');
    // Discord does not notify for mentions inside embeds.
    expect(msg.content).toBe('## Header <@&111111111>');
    expect(JSON.stringify(msg.embeds)).not.toContain('111111111');
  });

  it('stays on the title line when subtext follows it', () => {
    const msg = withRoleMention(
      { content: '## Crypto Weekly\n-# 1 symbol(s) failed to scan: FAKE-USD', embeds: [] },
      '111111111',
    );
    expect(msg.content).toBe(
      '## Crypto Weekly <@&111111111>\n-# 1 symbol(s) failed to scan: FAKE-USD',
    );
  });

  it('is the whole content when there is no title', () => {
    expect(withRoleMention({ embeds: [] }, '111111111').content).toBe('<@&111111111>');
  });

  it('names the role explicitly so nothing else can ping', () => {
    const msg = withRoleMention({ content: 'hi', embeds: [] }, '111111111');
    expect(msg.allowed_mentions).toEqual({ parse: [], roles: ['111111111'] });
  });

  it('suppresses every mention when no role is configured', () => {
    // A stray "@everyone" in an error string must not ping a server.
    const msg = withRoleMention({ content: '@everyone hi', embeds: [] }, undefined);
    expect(msg.allowed_mentions).toEqual({ parse: [] });
    expect(msg.content).toBe('@everyone hi');
  });
});

describe('parseWebhooks', () => {
  const A = 'https://discord.com/api/webhooks/111/aaa';
  const B = 'https://discord.com/api/webhooks/222/bbb';

  beforeEach(() => vi.spyOn(console, 'warn').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('reads one webhook', () => {
    expect(parseWebhooks(A)).toEqual([A]);
  });

  it('reads several however they are separated', () => {
    expect(parseWebhooks(`${A},${B}`)).toEqual([A, B]);
    expect(parseWebhooks(`${A}\n${B}`)).toEqual([A, B]);
    expect(parseWebhooks(`  ${A} , ${B}  `)).toEqual([A, B]);
  });

  it('accepts the other Discord hostnames', () => {
    const ptb = 'https://ptb.discord.com/api/webhooks/333/ccc';
    const legacy = 'https://discordapp.com/api/webhooks/444/ddd';
    expect(parseWebhooks(`${ptb},${legacy}`)).toEqual([ptb, legacy]);
  });

  it('drops duplicates so a channel is not posted to twice', () => {
    expect(parseWebhooks(`${A},${A}`)).toEqual([A]);
  });

  it('ignores anything that is not a Discord webhook, keeping the rest', () => {
    expect(parseWebhooks(`${A},https://example.com/hook,not-a-url`)).toEqual([A]);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('never logs the offending value, which is still a credential', () => {
    parseWebhooks('https://evil.example.com/api/webhooks/999/secret-token');
    const logged = vi.mocked(console.warn).mock.calls.flat().join(' ');
    expect(logged).not.toContain('secret-token');
  });

  it('is empty when unset', () => {
    expect(parseWebhooks(undefined)).toEqual([]);
    expect(parseWebhooks('   ')).toEqual([]);
  });
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

describe('assetField', () => {
  it('heads with symbol, name, price and the weekly move', () => {
    expect(assetField(asset()).name).toBe('BTC-USD · Bitcoin · $118,432 · ▲ 3.2%');
    expect(assetField(asset({ weekChangePct: -6.9 })).name).toContain('▼ 6.9%');
  });

  it('carries the ladder as a code block', () => {
    const value = assetField(asset()).value;
    expect(value.startsWith('```')).toBe(true);
    expect(value).toContain('112,400');
    expect(value).toContain('avg  107,000');
  });
});

describe('stanceEmbeds', () => {
  const green = asset({ symbol: 'BTC-USD' });
  const amber = asset({ symbol: 'SOL-USD', dca: plan({ stance: 'neutral' }) });
  const red = asset({ symbol: 'TAO-USD', dca: plan({ stance: 'defensive' }) });

  it('produces one card per stance, best first', () => {
    const embeds = stanceEmbeds([red, amber, green]);
    expect(embeds.map((e) => e.title)).toEqual(['🟢 Accumulate', '🟡 Neutral', '🔴 Defensive']);
    expect(embeds.map((e) => e.color)).toEqual([0x57f287, 0xfee75c, 0xed4245]);
  });

  it('gathers every asset of a stance into that one card', () => {
    const embeds = stanceEmbeds([green, amber, asset({ symbol: 'ETH-USD' }), red]);
    expect(embeds).toHaveLength(3);
    expect(embeds[0].fields?.map((f) => f.name.split(' ·')[0])).toEqual(['BTC-USD', 'ETH-USD']);
    expect(embeds[1].fields).toHaveLength(1);
  });

  it('skips a stance nothing is in', () => {
    expect(stanceEmbeds([green, amber]).map((e) => e.title)).toEqual([
      '🟢 Accumulate',
      '🟡 Neutral',
    ]);
    expect(stanceEmbeds([green])).toHaveLength(1);
  });

  it('continues into another card of the same colour past the field cap', () => {
    const many = Array.from({ length: 27 }, (_, i) => asset({ symbol: `SYM${i}-USD` }));
    const embeds = stanceEmbeds(many);
    expect(embeds).toHaveLength(2);
    expect(embeds.every((e) => e.title === '🟢 Accumulate')).toBe(true);
    expect(embeds[0].fields).toHaveLength(25);
    expect(embeds[1].fields).toHaveLength(2);
  });
});

describe('chunkEmbeds', () => {
  const embed = (over = {}) => ({ title: '🟢 Accumulate', color: 0x57f287, fields: [], ...over });

  it('never exceeds ten embeds per message', () => {
    const groups = chunkEmbeds(Array.from({ length: 23 }, () => embed()));
    expect(groups).toHaveLength(3);
    for (const g of groups) expect(g.length).toBeLessThanOrEqual(MAX_EMBEDS_PER_MESSAGE);
    expect(groups.flat()).toHaveLength(23);
  });

  it('splits early when the embeds are character-heavy', () => {
    const fat = embed({ description: 'x'.repeat(2000) });
    const groups = chunkEmbeds([fat, { ...fat }, { ...fat }, { ...fat }]);
    expect(groups.length).toBeGreaterThan(1);
  });

  it('counts field text toward the character budget', () => {
    const heavy = embed({
      fields: Array.from({ length: 20 }, () => ({ name: 'x'.repeat(60), value: 'y'.repeat(200) })),
    });
    expect(chunkEmbeds([heavy, { ...heavy }, { ...heavy }]).length).toBeGreaterThan(1);
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

  it('leads with a header and groups every asset into stance cards', () => {
    const messages = formatWeeklyDiscord(report);
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('## 🪙 Crypto Weekly — week of 2026-08-10');
    expect(messages[0].embeds).toHaveLength(1); // both assets accumulate
    expect(messages[0].embeds[0].title).toBe('🟢 Accumulate');
    expect(messages[0].embeds[0].fields).toHaveLength(2);
  });

  it('never sends more than one card per stance for a normal universe', () => {
    const mixed = buildWeeklyReport(
      [
        asset({ symbol: 'BTC-USD' }),
        asset({ symbol: 'SOL-USD', dca: plan({ stance: 'neutral' }) }),
        asset({ symbol: 'ADA-USD', dca: plan({ stance: 'neutral' }) }),
        asset({ symbol: 'TAO-USD', dca: plan({ stance: 'defensive' }) }),
      ],
      [],
      Date.UTC(2026, 7, 12),
    );
    const messages = formatWeeklyDiscord(mixed);
    expect(messages).toHaveLength(1);
    expect(messages[0].embeds).toHaveLength(3);
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
      Array.from({ length: 60 }, (_, i) => asset({ symbol: `SYM${i}-USD` })),
      [],
      Date.UTC(2026, 7, 12),
    );
    const messages = formatWeeklyDiscord(many);
    expect(messages.length).toBeGreaterThan(1);
    expect(messages[0].content).toContain('Crypto Weekly');
    expect(messages[1].content).toBeUndefined();
  });
});

describe('composeWeeklyMessages', () => {
  const report = buildWeeklyReport([asset(), asset({ symbol: 'SOL-USD' })], [], Date.UTC(2026, 7, 12));
  const writeup = {
    writeup: {
      symbol: 'SOL-USD',
      name: 'Solana',
      lastPrice: 76.14,
      weekChangePct: -2.1,
      standing: 'stands',
      higher: 'higher',
      lower: 'lower',
      picture: 'picture',
      approach: 'approach',
      watch: 'watch',
    },
    dca: plan(),
  };

  it('sends the write-up and no ladder cards', () => {
    const messages = composeWeeklyMessages([writeup]);
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toContain('📝 Solana, the week ahead');
    // Ladders live on ntfy now.
    expect(JSON.stringify(messages)).not.toContain('Crypto Weekly');
  });

  it('gives every configured coin its own message, in order', () => {
    const second = {
      writeup: { ...writeup.writeup, symbol: 'BTC-USD', name: 'Bitcoin' },
      dca: plan(),
    };
    const messages = composeWeeklyMessages([writeup, second]);
    expect(messages.map((m) => m.content)).toHaveLength(2);
    expect(messages[0].content).toContain('Solana');
    expect(messages[1].content).toContain('Bitcoin');
  });

  it('puts the role ping on the write-up, since the first message pings', () => {
    const messages = composeWeeklyMessages([writeup]);
    const pinged = withRoleMention(messages[0], '111111111');
    expect(pinged.content).toContain('<@&111111111>');
    expect(pinged.content).toContain('Solana');
  });

  it('sends nothing to Discord when no write-up resolved', () => {
    // The ladders are on ntfy, so there is nothing left to post.
    expect(composeWeeklyMessages([])).toEqual([]);
  });
});

describe('describeDiscord', () => {
  const report = buildWeeklyReport(
    [asset(), asset({ symbol: 'TAO-USD', dca: plan({ stance: 'defensive' }) })],
    [],
    Date.UTC(2026, 7, 12),
  );

  it('renders every card and ladder the message will actually carry', () => {
    const text = formatWeeklyDiscord(report).map(describeDiscord).join('\n');
    expect(text).toContain('🟢 Accumulate');
    expect(text).toContain('🔴 Defensive');
    expect(text).toContain('BTC-USD · Bitcoin');
    expect(text).toContain('112,400');
    expect(text).toContain('avg  107,000');
  });

  it('never prints undefined for a section the embed does not use', () => {
    // Grouped embeds carry fields and no description; the dry-run log used to
    // print the missing description as "undefined" and hide the whole report.
    const text = formatWeeklyDiscord(report).map(describeDiscord).join('\n');
    expect(text).not.toContain('undefined');
  });
});

describe('formatWeeklyNtfy', () => {
  const report = buildWeeklyReport(
    [asset(), asset({ symbol: 'ETH-USD', name: 'Ethereum' }), asset({ symbol: 'SOL-USD' })],
    [],
  );

  it('carries every asset by default, since ntfy owns the ladders now', () => {
    const all = formatWeeklyNtfy(report);
    expect(all).toHaveLength(1 + report.assets.length);
  });

  it('carries the cost basis the Discord card used to show', () => {
    const withBasis = formatWeeklyNtfy(report, 1, () => ({
      filledCount: 2,
      totalCount: 4,
      averageFill: 171,
      deployedPct: 44,
      plannedAverage: 166,
    }));
    expect(withBasis[1].body).toContain('2 of 4 filled');
  });

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
