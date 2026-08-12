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

/**
 * Per-asset block: price, then the ladder. No FTFC or last-closed line — the
 * report is dense by design, and the header carries the continuity breadth.
 */
export function assetBlock(a: WeeklyAsset): string {
  const head =
    `**${a.symbol}**${a.name ? ` — ${a.name}` : ''} · $${fmtPrice(a.lastPrice)}` +
    (a.weekChangePct !== null ? ` (week ${fmtPct(a.weekChangePct)})` : '');

  return [head, ...dcaLines(a.dca)].join('\n');
}

function headerBlock(r: WeeklyReport): string {
  const b = r.breadth;
  return [
    `**🪙 Crypto Weekly — week of ${r.weekOf}**`,
    `${b.scanned} ladders · ${b.nearFill} with a rung within 5% of spot · FTFC up ${b.fullContinuityUp} / down ${b.fullContinuityDown}`,
    `Stance: accumulate ${b.accumulate} · defensive ${b.defensive}`,
    'Rungs are resting bids into weekly and monthly Strat structure, ordered closest-to-filling first. Not financial advice.',
  ].join('\n');
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
  for (const a of report.assets) blocks.push(assetBlock(a));
  if (report.errors.length > 0) {
    blocks.push(
      `_${report.errors.length} symbol(s) failed to scan: ${report.errors.map((e) => e.symbol).join(', ')}_`,
    );
  }
  return chunkBlocks(blocks, limit);
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
