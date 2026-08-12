import { continuityStrip } from '../src/strat/continuity';
import { DcaPlan } from '../src/strat/dca';
import { firstRungDistance, WeeklyAsset, WeeklyReport } from '../src/crypto/weeklyReport';
import { money, Writeup } from '../src/crypto/writeup';
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
export function assetField(a: WeeklyAsset): DiscordField {
  const move =
    a.weekChangePct === null
      ? ''
      : ` · ${a.weekChangePct >= 0 ? '▲' : '▼'} ${Math.abs(a.weekChangePct).toFixed(1)}%`;

  return {
    name: `${a.symbol}${a.name ? ` · ${a.name}` : ''} · $${fmtPrice(a.lastPrice)}${move}`,
    value: `\`\`\`\n${ladderTable(a.dca)}\n\`\`\``,
  };
}

/** Discord caps fields at 25 per embed. */
const MAX_FIELDS_PER_EMBED = 25;

/** One card per stance, coloured to match, holding every asset in that group. */
export function stanceEmbeds(assets: WeeklyAsset[]): DiscordEmbed[] {
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
        fields: slice.map(assetField),
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
export function formatWeeklyDiscord(report: WeeklyReport): DiscordMessage[] {
  const groups = chunkEmbeds(stanceEmbeds(report.assets));
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
