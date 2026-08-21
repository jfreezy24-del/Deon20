import { continuityStrip } from '../src/strat/continuity';
import { DcaPlan } from '../src/strat/dca';
import { firstRungDistance, WeeklyAsset, WeeklyReport } from '../src/crypto/weeklyReport';
import { money, Writeup } from '../src/crypto/writeup';
import { CostBasis, ExpiredRung, FillEvent } from '../src/crypto/ladderState';
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

/**
 * Webhook URLs from a single environment variable. Several channels means
 * several webhooks, so the value is read as a list separated by commas,
 * newlines or spaces. Kept in one secret rather than DISCORD_WEBHOOK_URL_2,
 * _3, _4 so adding a channel never needs a code change.
 *
 * Anything that is not a Discord webhook is dropped with a warning instead of
 * failing the run: one bad paste should not cost the whole report.
 */
export function parseWebhooks(raw: string | undefined): string[] {
  const candidates = (raw ?? '')
    .split(/[\s,]+/)
    .map((u) => u.trim())
    .filter(Boolean);

  const valid: string[] = [];
  for (const url of candidates) {
    if (/^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\//.test(url)) {
      if (!valid.includes(url)) valid.push(url);
    } else {
      // Never log the value itself: a mistyped webhook is still a credential.
      console.warn('Ignoring an entry in DISCORD_WEBHOOK_URL that is not a Discord webhook URL.');
    }
  }
  return valid;
}

/**
 * Discord role IDs to ping, read the same way as the webhooks.
 *
 * Give one ID to ping the same role everywhere, or one per webhook in the
 * same order when the channels live in different servers: a role ID only
 * resolves inside its own server, and elsewhere it renders as dead text.
 */
export function parseRoleIds(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(/[\s,]+/)
    .map((id) => id.trim().replace(/^<@&|>$/g, ''))
    .filter((id) => {
      if (id === '') return false;
      if (/^\d{5,25}$/.test(id)) return true;
      console.warn('Ignoring an entry in DISCORD_ROLE_ID that is not a numeric role ID.');
      return false;
    });
}

/** The role to ping on webhook `index`: one ID covers every channel. */
export const roleForWebhook = (roleIds: string[], index: number): string | undefined =>
  roleIds.length === 1 ? roleIds[0] : roleIds[index];

/**
 * Attach a role ping to a message.
 *
 * The mention goes on the content line because Discord does not notify for
 * mentions inside embeds, and allowed_mentions names the role explicitly:
 * without it the payload is parsed permissively, so any stray "@everyone" in
 * a symbol name or error string could ping the whole server.
 */
export function withRoleMention(message: DiscordMessage, roleId?: string): DiscordMessage {
  if (!roleId) return { ...message, allowed_mentions: { parse: [] } };

  // Appended to the *first* line, so it trails the title rather than the
  // subtext that can follow it. Content is markdown, so the pill renders
  // inside the heading.
  const [title, ...rest] = (message.content ?? '').split('\n');
  const mentioned = title ? `${title} <@&${roleId}>` : `<@&${roleId}>`;

  return {
    ...message,
    content: [mentioned, ...rest].join('\n'),
    allowed_mentions: { parse: [], roles: [roleId] },
  };
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

export interface DiscordField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordEmbed {
  title: string;
  color: number;
  description?: string;
  fields?: DiscordField[];
  footer?: { text: string };
}

export interface DiscordMessage {
  content?: string;
  embeds: DiscordEmbed[];
  /** Which mentions may actually notify; omitted means Discord parses all */
  allowed_mentions?: { parse: string[]; roles?: string[] };
}

/** Groups are read best-first: where to add, then wait, then defend. */
const STANCE_ORDER: DcaPlan['stance'][] = ['accumulate', 'neutral', 'defensive'];

const STANCE_TITLE: Record<DcaPlan['stance'], string> = {
  accumulate: 'Accumulate',
  neutral: 'Neutral',
  defensive: 'Defensive',
};

/**
 * The ladder as fixed-width columns. Discord renders proportional text, so
 * numbers only line up inside a code block — and a ladder is a table of
 * numbers, which is unreadable ragged.
 *
 * The average fill is a row in the same table rather than a line below it, so
 * it lands under the prices it averages.
 */
export function ladderTable(dca: DcaPlan): string {
  if (dca.rungs.length === 0) {
    return 'no structure below price to bid';
  }
  const rows = dca.rungs.map((r) => ({
    alloc: `${r.allocationPct}%`,
    price: fmtPrice(r.price),
    discount: `−${r.discountPct.toFixed(1)}%`,
    source: SHORT_SOURCE[r.source] ?? r.source,
  }));
  if (dca.averageFill !== null) {
    rows.push({ alloc: 'avg', price: fmtPrice(dca.averageFill), discount: '', source: '' });
  }
  const width = (key: 'alloc' | 'price' | 'discount') =>
    Math.max(...rows.map((r) => r[key].length));

  return rows
    .map((r) =>
      [
        r.alloc.padStart(width('alloc')),
        r.price.padStart(width('price')),
        r.discount.padStart(width('discount')),
        r.source,
      ]
        .join('  ')
        .trimEnd(),
    )
    .join('\n');
}

/** One asset inside its stance group: heading line plus the ladder table. */
export function assetField(a: WeeklyAsset, basis?: CostBasis): DiscordField {
  const move =
    a.weekChangePct === null
      ? ''
      : ` · ${a.weekChangePct >= 0 ? '▲' : '▼'} ${Math.abs(a.weekChangePct).toFixed(1)}%`;

  const position = basis ? positionLine(basis) : null;

  return {
    name: `${a.symbol}${a.name ? ` · ${a.name}` : ''} · $${fmtPrice(a.lastPrice)}${move}`,
    value: `\`\`\`\n${ladderTable(a.dca)}\n\`\`\`${position ? `\n-# ${position}` : ''}`,
  };
}

/** Discord caps fields at 25 per embed. */
const MAX_FIELDS_PER_EMBED = 25;

/** One card per stance, coloured to match, holding every asset in that group. */
export function stanceEmbeds(
  assets: WeeklyAsset[],
  basisFor: (symbol: string) => CostBasis | undefined = () => undefined,
): DiscordEmbed[] {
  const embeds: DiscordEmbed[] = [];

  for (const stance of STANCE_ORDER) {
    const group = assets.filter((a) => a.dca.stance === stance);
    if (group.length === 0) continue;

    // A group larger than the field cap continues into another card of the
    // same colour rather than losing assets off the end.
    for (let i = 0; i < group.length; i += MAX_FIELDS_PER_EMBED) {
      const slice = group.slice(i, i + MAX_FIELDS_PER_EMBED);
      embeds.push({
        title: `${STANCE_DOT[stance]} ${STANCE_TITLE[stance]}`,
        color: STANCE_COLOR[stance],
        fields: slice.map((a) => assetField(a, basisFor(a.symbol))),
      });
    }
  }
  return embeds;
}

const embedSize = (e: DiscordEmbed): number =>
  e.title.length +
  (e.description?.length ?? 0) +
  (e.footer?.text.length ?? 0) +
  (e.fields ?? []).reduce((n, f) => n + f.name.length + f.value.length, 0);

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
export function formatWeeklyDiscord(
  report: WeeklyReport,
  basisFor: (symbol: string) => CostBasis | undefined = () => undefined,
): DiscordMessage[] {
  const groups = chunkEmbeds(stanceEmbeds(report.assets, basisFor));
  const header = `## 🪙 Crypto Weekly — week of ${report.weekOf}`;
  const messages: DiscordMessage[] = groups.map((embeds, i) => ({
    ...(i === 0 ? { content: header } : {}),
    embeds,
  }));

  if (messages.length === 0) messages.push({ content: header, embeds: [] });

  if (report.errors.length > 0) {
    const last = messages[messages.length - 1];
    const note = `-# ${report.errors.length} symbol(s) failed to scan: ${report.errors.map((e) => e.symbol).join(', ')}`;
    last.content = last.content ? `${last.content}\n${note}` : note;
  }
  return messages;
}

/** "3 of 4 filled, average $171 against $166 planned, 72% deployed" */
export function positionLine(basis: CostBasis): string | null {
  if (basis.filledCount === 0) return null;
  const planned =
    basis.plannedAverage !== null ? ` against ${money(basis.plannedAverage)} planned` : '';
  return (
    `${basis.filledCount} of ${basis.totalCount} filled, average ` +
    `${money(basis.averageFill ?? 0)}${planned}, ${basis.deployedPct}% deployed`
  );
}

/**
 * A fill is the one thing here worth interrupting someone for: a resting bid
 * became a position while they were not looking.
 */
export function formatFillsDiscord(fills: FillEvent[], expired: ExpiredRung[]): DiscordMessage {
  const bySymbol = new Map<string, FillEvent[]>();
  for (const fill of fills) {
    bySymbol.set(fill.symbol, [...(bySymbol.get(fill.symbol) ?? []), fill]);
  }

  const fields: DiscordField[] = [...bySymbol.entries()].map(([symbol, events]) => ({
    name: `${symbol} · ${events.length} rung${events.length > 1 ? 's' : ''} filled`,
    value: events
      .map((f) => `${f.allocationPct}% at ${money(f.price)} on ${f.filledOn} (${f.source})`)
      .join('\n'),
  }));

  if (expired.length > 0) {
    fields.push({
      name: 'Expired, never filled',
      value: expired
        .map((r) => `${r.allocationPct}% at ${money(r.price)}, resting ${r.ageDays} days`)
        .join('\n'),
    });
  }

  return {
    content: `## 🎯 Ladder fills`,
    embeds: [
      {
        title: fills.length > 0 ? `${fills.length} rung(s) filled` : 'Stale rungs cleared',
        color: fills.length > 0 ? 0x57f287 : 0xfee75c,
        fields,
      },
    ],
  };
}

/**
 * The written analysis as its own message: one embed, coloured by stance,
 * each section a field. It rides alongside the ladder report rather than
 * replacing it — the ladder is the plan for ten coins, this is the reasoning
 * for one.
 */
export function formatWriteupDiscord(w: Writeup, dca: DcaPlan): DiscordMessage {
  const move =
    w.weekChangePct === null
      ? ''
      : ` · ${w.weekChangePct >= 0 ? '▲' : '▼'} ${Math.abs(w.weekChangePct).toFixed(1)}% this week`;

  return {
    content: `## 📝 ${w.name ?? w.symbol}, the week ahead`,
    embeds: [
      {
        title: `${STANCE_DOT[dca.stance]} ${w.name ?? w.symbol} · ${money(w.lastPrice)}${move}`,
        color: STANCE_COLOR[dca.stance],
        fields: [
          { name: 'Where it stands', value: w.standing },
          { name: 'What sends it higher', value: w.higher },
          { name: 'What sends it lower', value: w.lower },
          { name: 'What the broader picture says', value: w.picture },
          {
            name: 'What we are doing about it',
            value: `\`\`\`\n${ladderTable(dca)}\n\`\`\`\n${w.approach}`,
          },
          { name: 'The one thing to watch', value: w.watch },
        ].map((f) => ({ ...f, value: f.value.slice(0, 1024) })),
      },
    ],
  };
}

/**
 * The coins Discord reports on: one written analysis each on Sunday, and the
 * only symbols whose fills interrupt the channel during the week.
 *
 * The ladder still tracks and fills every coin in the watchlist — those go to
 * ntfy, where the full plan lives. This list is the narrower set worth
 * speaking up about in a room full of people.
 */
export const DEFAULT_WRITEUP_SYMBOLS = ['SOL-USD', 'BTC-USD', 'ETH-USD', 'HYPE-USD'];

/** Symbols for the written analyses, read as a list like the webhooks are. */
export function parseSymbols(raw: string | undefined, fallback: string[]): string[] {
  const symbols = (raw ?? '')
    .split(/[\s,]+/)
    .map((sym) => sym.trim().toUpperCase())
    .filter(Boolean);
  return symbols.length > 0 ? [...new Set(symbols)] : fallback;
}

/**
 * Keep only the entries belonging to the coins Discord reports on.
 *
 * Applied to what gets *sent*, never to what gets recorded: a fill on a coin
 * outside this list is still tracked, still costed, and still pushed to ntfy.
 * It just does not ping a channel.
 */
export function onlySymbols<T extends { symbol: string }>(items: T[], symbols: string[]): T[] {
  const allowed = new Set(symbols.map((s) => s.trim().toUpperCase()));
  return items.filter((item) => allowed.has(item.symbol.trim().toUpperCase()));
}

/**
 * The full set of Discord messages for a weekly run, in send order.
 *
 * One message per written analysis, in the order the coins were configured,
 * so the first one leads and carries the role ping.
 *
 * The ladders are not here. They go to ntfy, where they sit alongside the
 * fill alerts that act on them.
 */
export function composeWeeklyMessages(
  writeups: { writeup: Writeup; dca: DcaPlan }[] = [],
): DiscordMessage[] {
  // Discord carries the written analyses only. The ladders are a table of
  // numbers to act on, which belongs on the phone with the fill alerts, not
  // in a channel people read.
  return writeups.map((w) => formatWriteupDiscord(w.writeup, w.dca));
}

/**
 * Plain-text rendering of an embed message, for the dry-run log. Embeds are
 * a JSON structure, so without this the log shows nothing useful — and a
 * dry run exists precisely to be read before a real send.
 */
export function describeDiscord(message: DiscordMessage): string {
  const lines: string[] = [];
  if (message.content) lines.push(message.content);

  for (const embed of message.embeds) {
    lines.push('', `┌ ${embed.title}`);
    if (embed.description) {
      lines.push(...embed.description.split('\n').map((l) => `│ ${l}`));
    }
    for (const field of embed.fields ?? []) {
      lines.push(`│ ${field.name}`);
      lines.push(...field.value.split('\n').map((l) => `│   ${l}`));
    }
    if (embed.footer) lines.push(`└ ${embed.footer.text}`);
    else lines.push('└');
  }
  return lines.join('\n');
}

/**
 * ntfy messages: one digest, then one push per asset whose ladder is closest
 * to filling, so the bids that could actually get hit this week are readable
 * on a lock screen without opening anything.
 */
export function formatWeeklyNtfy(
  report: WeeklyReport,
  maxAssets?: number,
  basisFor: (symbol: string) => CostBasis | undefined = () => undefined,
): PushMessage[] {
  const b = report.breadth;
  // ntfy is the only channel carrying ladders now, so every scanned asset gets
  // one unless a cap is set deliberately.
  const featured = report.assets.slice(0, maxAssets ?? report.assets.length);

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
    const basis = basisFor(a.symbol);
    const position = basis ? positionLine(basis) : null;
    messages.push({
      title: `${a.symbol} ladder — ${STANCE_LABEL[a.dca.stance]} · $${fmtPrice(a.lastPrice)}`,
      body: [
        `FTFC ${continuityStrip(a.continuity)}`,
        ...dcaLines(a.dca),
        ...(position ? [position] : []),
      ].join('\n'),
      // A rung within touching distance is the one worth surfacing loudly.
      priority: firstRungDistance(a) <= 5 ? 'high' : 'default',
      tags: 'coin',
    });
  }
  return messages;
}
