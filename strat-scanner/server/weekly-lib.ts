import { continuityStrip } from '../src/strat/continuity';
import { DcaPlan } from '../src/strat/dca';
import { firstRungDistance, WeeklyAsset, WeeklyReport } from '../src/crypto/weeklyReport';
import { PushMessage } from './lib';

/** Discord rejects messages over 2000 characters; leave room for the fences. */
export const DISCORD_LIMIT = 1900;

export function fmtPrice(v: number): string {
  if (!Number.isFinite(v)) return '—';
  const abs = Math.abs(v);
  const decimals = abs >= 1000 ? 0 : abs >= 100 ? 1 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : 6;
  return v.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const fmtPct = (v: number): string => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;

const STANCE_LABEL: Record<DcaPlan['stance'], string> = {
  accumulate: 'ACCUMULATE',
  neutral: 'NEUTRAL',
  defensive: 'DEFENSIVE',
};

export function dcaLines(dca: DcaPlan): string[] {
  const lines = [`DCA ladder — ${STANCE_LABEL[dca.stance]}`];
  if (dca.rungs.length === 0) {
    lines.push('   No structure below price to bid — wait for a new higher-timeframe pivot low.');
    return lines;
  }
  for (const r of dca.rungs) {
    lines.push(
      `   ${r.allocationPct}% @ ${fmtPrice(r.price)} (−${r.discountPct.toFixed(1)}%) · ${r.source} [${r.timeframe}]`,
    );
  }
  lines.push(`   Avg fill ${fmtPrice(dca.averageFill ?? 0)}`);
  return lines;
}

/** Discord embed limits: 10 embeds per message, 6000 characters across them. */
export const MAX_EMBEDS_PER_MESSAGE = 10;
const MAX_EMBED_CHARS = 5500;

/** Stripe colours: green accumulate, amber neutral, red defensive. */
const STANCE_COLOR: Record<DcaPlan['stance'], number> = {
  accumulate: 0x57f287,
  neutral: 0xfee75c,
  defensive: 0xed4245,
};

const STANCE_DOT: Record<DcaPlan['stance'], string> = {
  accumulate: '🟢',
  neutral: '🟡',
  defensive: '🔴',
};

/** Long rung labels wrap on a phone; the table has a column for the timeframe. */
const SHORT_SOURCE: Record<string, string> = {
  'Prior week low': 'W low',
  'Weekly pivot low': 'W pivot',
  'Prior month low': 'M low',
  'Monthly pivot low': 'M pivot',
  'Measured move': 'measured',
};

export interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  footer?: { text: string };
}

export interface DiscordMessage {
  content?: string;
  embeds: DiscordEmbed[];
}

/**
 * The ladder as fixed-width columns. Discord renders proportional text, so
 * numbers only line up inside a code block — and a ladder is a table of
 * numbers, which is unreadable ragged.
 */
export function ladderTable(dca: DcaPlan): string {
  if (dca.rungs.length === 0) {
    return 'no structure below price to bid\nwait for a new higher-timeframe pivot low';
  }
  const rows = dca.rungs.map((r) => ({
    alloc: `${r.allocationPct}%`,
    price: fmtPrice(r.price),
    discount: `−${r.discountPct.toFixed(1)}%`,
    source: SHORT_SOURCE[r.source] ?? r.source,
  }));
  const width = (key: 'alloc' | 'price' | 'discount') =>
    Math.max(...rows.map((r) => r[key].length));

  return rows
    .map((r) =>
      [
        r.alloc.padStart(width('alloc')),
        r.price.padStart(width('price')),
        r.discount.padStart(width('discount')),
        r.source,
      ].join('  '),
    )
    .join('\n');
}

/** One asset, one card: stance colour down the edge, ladder in monospace. */
export function assetEmbed(a: WeeklyAsset): DiscordEmbed {
  const move =
    a.weekChangePct === null
      ? ''
      : `  ${a.weekChangePct >= 0 ? '▲' : '▼'} ${Math.abs(a.weekChangePct).toFixed(1)}% this week`;

  return {
    title: `${STANCE_DOT[a.dca.stance]} ${a.symbol}${a.name ? ` · ${a.name}` : ''}`,
    description: `**$${fmtPrice(a.lastPrice)}**${move}\n\`\`\`\n${ladderTable(a.dca)}\n\`\`\``,
    color: STANCE_COLOR[a.dca.stance],
    ...(a.dca.averageFill !== null
      ? { footer: { text: `avg fill ${fmtPrice(a.dca.averageFill)}` } }
      : {}),
  };
}

const embedSize = (e: DiscordEmbed): number =>
  e.title.length + e.description.length + (e.footer?.text.length ?? 0);

/** Split embeds across messages, respecting both Discord caps. */
export function chunkEmbeds(embeds: DiscordEmbed[]): DiscordEmbed[][] {
  const out: DiscordEmbed[][] = [];
  let current: DiscordEmbed[] = [];
  let chars = 0;

  for (const embed of embeds) {
    const size = embedSize(embed);
    if (current.length > 0 && (current.length >= MAX_EMBEDS_PER_MESSAGE || chars + size > MAX_EMBED_CHARS)) {
      out.push(current);
      current = [];
      chars = 0;
    }
    current.push(embed);
    chars += size;
  }
  if (current.length > 0) out.push(current);
  return out;
}

/** The whole report as Discord-ready messages, in order. */
export function formatWeeklyDiscord(report: WeeklyReport): DiscordMessage[] {
  const groups = chunkEmbeds(report.assets.map(assetEmbed));
  const messages: DiscordMessage[] = groups.map((embeds, i) => ({
    ...(i === 0 ? { content: `## 🪙 Crypto Weekly — week of ${report.weekOf}` } : {}),
    embeds,
  }));

  if (messages.length === 0) messages.push({ content: `## 🪙 Crypto Weekly — week of ${report.weekOf}`, embeds: [] });

  if (report.errors.length > 0) {
    const last = messages[messages.length - 1];
    const note = `-# ${report.errors.length} symbol(s) failed to scan: ${report.errors.map((e) => e.symbol).join(', ')}`;
    last.content = last.content ? `${last.content}\n${note}` : note;
  }
  return messages;
}

/**
 * ntfy messages: one digest, then one push per asset whose ladder is closest
 * to filling, so the bids that could actually get hit this week are readable
 * on a lock screen without opening anything.
 */
export function formatWeeklyNtfy(report: WeeklyReport, maxAssets = 4): PushMessage[] {
  const b = report.breadth;
  const featured = report.assets.slice(0, maxAssets);

  const digestBody = [
    `${b.scanned} ladders · accumulate ${b.accumulate} · defensive ${b.defensive}`,
    `FTFC up ${b.fullContinuityUp} / down ${b.fullContinuityDown}`,
    ...featured.map((a) => {
      const top = a.dca.rungs[0];
      return top
        ? `${a.symbol} — first rung ${top.allocationPct}% @ ${fmtPrice(top.price)} (−${top.discountPct.toFixed(1)}%)`
        : `${a.symbol} — no structure below price`;
    }),
  ].join('\n');

  const messages: PushMessage[] = [
    {
      title: `🪙 Crypto Weekly — week of ${report.weekOf}`,
      body: digestBody,
      priority: 'default',
      tags: 'coin',
    },
  ];

  for (const a of featured) {
    messages.push({
      title: `${a.symbol} ladder — ${STANCE_LABEL[a.dca.stance]} · $${fmtPrice(a.lastPrice)}`,
      body: [`FTFC ${continuityStrip(a.continuity)}`, ...dcaLines(a.dca)].join('\n'),
      // A rung within touching distance is the one worth surfacing loudly.
      priority: firstRungDistance(a) <= 5 ? 'high' : 'default',
      tags: 'coin',
    });
  }
  return messages;
}
