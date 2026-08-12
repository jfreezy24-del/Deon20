import { continuityStrip } from '../src/strat/continuity';
import { DcaPlan } from '../src/strat/dca';
import { Signal } from '../src/strat/types';
import { WeeklyAsset, WeeklyReport } from '../src/crypto/weeklyReport';
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

const arrow = (s: Signal) => (s.direction === 'bullish' ? '▲' : '▼');

const STANCE_LABEL: Record<DcaPlan['stance'], string> = {
  accumulate: 'ACCUMULATE',
  neutral: 'NEUTRAL',
  defensive: 'DEFENSIVE',
};

/** One-line trade plan for a setup: what triggers it, where it dies, where it goes. */
export function entryLine(s: Signal): string {
  return (
    `${arrow(s)} ${s.timeframe} ${s.pattern} (${s.sequence}) · ${s.status} · ${s.confidence}% ${s.confidenceLabel}\n` +
    `   Entry ${fmtPrice(s.levels.entry)} · Stop ${fmtPrice(s.levels.stop)} · ` +
    `T1 ${fmtPrice(s.levels.target1)} (${s.levels.rr1}R) · T2 ${fmtPrice(s.levels.target2)} (${s.levels.rr2}R)`
  );
}

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
  const tail = [`Avg fill ${fmtPrice(dca.averageFill ?? 0)}`, `Invalidation ${fmtPrice(dca.invalidation)}`];
  if (dca.magnitude !== null) tail.push(`Magnitude ${fmtPrice(dca.magnitude)}`);
  lines.push(`   ${tail.join(' · ')}`);
  return lines;
}

/** Full per-asset block: price, continuity, entries, ladder. */
export function assetBlock(a: WeeklyAsset): string {
  const head = `**${a.symbol}**${a.name ? ` — ${a.name}` : ''} · $${fmtPrice(a.lastPrice)}` +
    (a.weekChangePct !== null ? ` (week ${fmtPct(a.weekChangePct)})` : '');
  const structure = [
    `FTFC ${continuityStrip(a.continuity)}`,
    `Last closed: M ${a.dca.monthlyType ?? '—'} · W ${a.dca.weeklyType ?? '—'}`,
  ].join(' · ');

  const lines = [head, structure];
  if (a.entries.length > 0) {
    lines.push('Entries');
    for (const s of a.entries) lines.push(entryLine(s));
  } else {
    lines.push('Entries: none above the confidence bar — the ladder is the plan this week.');
  }
  lines.push(...dcaLines(a.dca));
  return lines.join('\n');
}

function headerBlock(r: WeeklyReport): string {
  const b = r.breadth;
  return [
    `**🪙 Crypto Weekly — week of ${r.weekOf}**`,
    `${b.scanned} assets · ${b.entries} entry setups · FTFC up ${b.fullContinuityUp} / down ${b.fullContinuityDown}`,
    `Ladders: accumulate ${b.accumulate} · defensive ${b.defensive}`,
    'Entries are stop-entries on a break of the trigger; ladder rungs are resting bids into higher-timeframe structure. Not financial advice.',
  ].join('\n');
}

function highlightsBlock(r: WeeklyReport): string | null {
  if (r.highlights.length === 0) return null;
  const lines = ['**Top setups**'];
  r.highlights.forEach((s, i) => {
    lines.push(
      `${i + 1}. ${s.symbol} ${arrow(s)} ${s.pattern} (${s.timeframe}) ${s.confidence}% — ` +
        `entry ${fmtPrice(s.levels.entry)}, stop ${fmtPrice(s.levels.stop)}, T1 ${fmtPrice(s.levels.target1)} (${s.levels.rr1}R)`,
    );
  });
  return lines.join('\n');
}

/**
 * Pack blocks into messages under `limit` characters. Blocks are kept whole
 * where possible; an oversized block is split on its own line boundaries so a
 * long asset section degrades gracefully instead of being truncated.
 */
export function chunkBlocks(blocks: string[], limit = DISCORD_LIMIT): string[] {
  const out: string[] = [];
  let current = '';

  const push = () => {
    if (current.length > 0) out.push(current);
    current = '';
  };

  for (const block of blocks) {
    const parts = block.length <= limit ? [block] : splitLines(block, limit);
    for (const part of parts) {
      if (current.length === 0) current = part;
      else if (current.length + 2 + part.length <= limit) current += `\n\n${part}`;
      else {
        push();
        current = part;
      }
    }
  }
  push();
  return out;
}

function splitLines(block: string, limit: number): string[] {
  const out: string[] = [];
  let current = '';
  for (const line of block.split('\n')) {
    const piece = line.length <= limit ? line : line.slice(0, limit);
    if (current.length === 0) current = piece;
    else if (current.length + 1 + piece.length <= limit) current += `\n${piece}`;
    else {
      out.push(current);
      current = piece;
    }
  }
  if (current.length > 0) out.push(current);
  return out;
}

/** The whole report as Discord-ready messages, in order. */
export function formatWeeklyDiscord(report: WeeklyReport, limit = DISCORD_LIMIT): string[] {
  const blocks: string[] = [headerBlock(report)];
  const highlights = highlightsBlock(report);
  if (highlights) blocks.push(highlights);
  for (const a of report.assets) blocks.push(assetBlock(a));
  if (report.errors.length > 0) {
    blocks.push(
      `_${report.errors.length} symbol(s) failed to scan: ${report.errors.map((e) => e.symbol).join(', ')}_`,
    );
  }
  return chunkBlocks(blocks, limit);
}

/**
 * ntfy messages: one digest, then one push per highlighted asset so the trade
 * plan is readable on a lock screen without opening anything.
 */
export function formatWeeklyNtfy(report: WeeklyReport, maxAssets = 4): PushMessage[] {
  const b = report.breadth;
  const digestBody = [
    `${b.scanned} assets scanned · ${b.entries} setups · FTFC up ${b.fullContinuityUp} / down ${b.fullContinuityDown}`,
    `Ladders: accumulate ${b.accumulate} · defensive ${b.defensive}`,
    ...report.highlights.map(
      (s) =>
        `${s.symbol} ${arrow(s)} ${s.pattern} (${s.timeframe}) ${s.confidence}% — entry ${fmtPrice(s.levels.entry)}, stop ${fmtPrice(s.levels.stop)}`,
    ),
  ].join('\n');

  const messages: PushMessage[] = [
    {
      title: `🪙 Crypto Weekly — week of ${report.weekOf}`,
      body: digestBody,
      priority: 'default',
      tags: 'coin',
    },
  ];

  const featured = report.assets.filter((a) => a.entries.length > 0).slice(0, maxAssets);
  for (const a of featured) {
    const top = a.entries[0];
    messages.push({
      title: `${a.symbol} ${arrow(top)} ${top.pattern} (${top.timeframe}) — ${top.confidence}%`,
      body: [
        `Entry ${fmtPrice(top.levels.entry)} · Stop ${fmtPrice(top.levels.stop)} · T1 ${fmtPrice(top.levels.target1)} (${top.levels.rr1}R) · T2 ${fmtPrice(top.levels.target2)} (${top.levels.rr2}R)`,
        `FTFC ${continuityStrip(a.continuity)}`,
        ...dcaLines(a.dca),
      ].join('\n'),
      priority: top.confidence >= 65 ? 'high' : 'default',
      tags: top.direction === 'bullish' ? 'chart_with_upwards_trend' : 'chart_with_downwards_trend',
    });
  }
  return messages;
}
