/**
 * Ladder fills — a daily check on the bids the weekly report published.
 *
 * The weekly report plans; this notices what happened. It reads the tracked
 * ladder, pulls recent daily bars for every symbol still holding a resting
 * rung, and marks any level price traded down to. New fills are pushed to
 * ntfy and Discord the day they happen rather than up to a week later, and
 * rungs that have rested past their lifetime are cleared.
 *
 * Usage:  npx tsx server/ladder-fills.ts
 *
 * Environment:
 *   NTFY_TOPIC            ntfy topic to publish to (without it, ntfy is skipped)
 *   NTFY_SERVER           ntfy server base URL          (default https://ntfy.sh)
 *   DISCORD_WEBHOOK_URL   webhook(s), comma separated
 *   APCA_API_KEY_ID       Alpaca key id                           (optional)
 *   APCA_API_SECRET_KEY   Alpaca secret                           (optional)
 *   RUNG_TTL_DAYS         days a rung may rest unfilled          (default 90)
 *   DRY_RUN               'true' to print and send nothing, saving no state
 *
 * State: data/ladder-state.json, committed by the workflow.
 */
import { fetchTimeframe } from '../src/data/market';
import {
  applyFills,
  costBasis,
  expireStaleRungs,
  ExpiredRung,
  FillEvent,
  isoDate,
} from '../src/crypto/ladderState';
import { buildNtfyPayload, PushMessage } from './lib';
import { formatFillsDiscord, parseWebhooks, positionLine } from './weekly-lib';
import { money } from '../src/crypto/writeup';
import { loadState, saveState } from './state-file';

const num = (raw: string | undefined, fallback: number): number => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const isTrue = (raw: string | undefined): boolean =>
  ['1', 'true', 'yes'].includes((raw ?? '').trim().toLowerCase());

async function sendNtfy(server: string, topic: string, msg: PushMessage) {
  const res = await fetch(server.replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildNtfyPayload(topic, msg)),
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

async function sendDiscord(webhookUrl: string, message: object) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error(`Discord responded ${res.status}: ${await res.text()}`);
}

function fillPush(fills: FillEvent[]): PushMessage {
  const bySymbol = [...new Set(fills.map((f) => f.symbol))];
  return {
    title: `🎯 ${fills.length} ladder rung(s) filled`,
    body: bySymbol
      .map((symbol) => {
        const events = fills.filter((f) => f.symbol === symbol);
        return `${symbol}: ${events.map((e) => `${e.allocationPct}% at ${money(e.price)}`).join(', ')}`;
      })
      .join('\n'),
    // A bid becoming a position is worth a lock-screen interruption.
    priority: 'high',
    tags: 'dart',
  };
}

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';
  const webhooks = parseWebhooks(process.env.DISCORD_WEBHOOK_URL);
  const dryRun = isTrue(process.env.DRY_RUN);
  const ttlDays = num(process.env.RUNG_TTL_DAYS, 90);
  const today = isoDate(Date.now());

  const state = loadState();
  const symbols = Object.keys(state.positions);
  if (symbols.length === 0) {
    console.log('No ladders tracked yet — the weekly report seeds this. Nothing to check.');
    return;
  }

  const fills: FillEvent[] = [];
  const expired: ExpiredRung[] = [];

  for (const symbol of symbols) {
    const position = state.positions[symbol];
    const resting = position.rungs.filter((r) => r.filledOn === null);
    if (resting.length === 0) continue;

    let bars;
    try {
      bars = (await fetchTimeframe(symbol, 'D')).completed;
    } catch (e) {
      // One unreachable symbol must not cost the fills on every other one.
      console.warn(`  WARN ${symbol}: ${e instanceof Error ? e.message : e}`);
      continue;
    }

    const filled = applyFills(position, bars);
    const aged = expireStaleRungs(filled.position, today, ttlDays);

    state.positions[symbol] = aged.position;
    fills.push(...filled.fills);
    expired.push(...aged.expired);

    for (const f of filled.fills) {
      console.log(`  FILL ${symbol} ${f.allocationPct}% at ${money(f.price)} on ${f.filledOn}`);
    }
    for (const r of aged.expired) {
      console.log(`  EXPIRED ${symbol} ${r.allocationPct}% at ${money(r.price)} after ${r.ageDays} days`);
    }
  }

  for (const symbol of symbols) {
    const line = positionLine(costBasis(state.positions[symbol]));
    if (line) console.log(`  ${symbol}: ${line}`);
  }

  if (fills.length === 0 && expired.length === 0) {
    console.log('No rungs filled or expired today.');
  }

  if (dryRun) {
    console.log('DRY RUN — no messages sent, no state saved.');
    return;
  }

  state.lastCheckedOn = today;

  const sendErrors: string[] = [];
  if (fills.length > 0 || expired.length > 0) {
    const message = formatFillsDiscord(fills, expired);

    if (topic && fills.length > 0) {
      try {
        await sendNtfy(server, topic, fillPush(fills));
      } catch (e) {
        sendErrors.push(e instanceof Error ? e.message : String(e));
      }
    }
    for (const [i, hook] of webhooks.entries()) {
      try {
        await sendDiscord(hook, {
          content: message.content,
          embeds: message.embeds,
        });
      } catch (e) {
        sendErrors.push(`webhook ${i + 1}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  // State is saved even when a send failed: re-reporting a fill tomorrow is
  // worse than a missed notification, since the record would drift.
  saveState(state);
  console.log('State saved.');

  if (sendErrors.length > 0) {
    throw new Error(`${sendErrors.length} message(s) failed to send: ${sendErrors[0]}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
