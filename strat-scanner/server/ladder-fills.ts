/**
 * Ladder fills — a daily check on the bids the weekly report published.
 *
 * The weekly report plans; this notices what happened. It reads the tracked
 * ladder, pulls recent daily bars for every symbol still holding a resting
 * rung, and marks any level price traded down to. New fills are pushed the
 * day they happen rather than up to a week later, and rungs that have rested
 * past their lifetime are cleared.
 *
 * ntfy carries every coin, since that is where the full ladder lives: fills at
 * high priority, expiries as a quieter second push. Discord carries only the
 * coins that get a weekly write-up, so the channel hears about the positions
 * it has been reading about and nothing else.
 *
 * Usage:  npx tsx server/ladder-fills.ts
 *
 * Environment:
 *   NTFY_TOPIC            ntfy topic to publish to (without it, ntfy is skipped)
 *   NTFY_SERVER           ntfy server base URL          (default https://ntfy.sh)
 *   DISCORD_WEBHOOK_URL   webhook(s), comma separated
 *   WRITEUP_SYMBOL        coins Discord reports on, comma separated. Shared
 *                         with the weekly run so the two never drift.
 *                         (default SOL-USD,BTC-USD,ETH-USD,HYPE-USD)
 *   APCA_API_KEY_ID       Alpaca key id                           (optional)
 *   APCA_API_SECRET_KEY   Alpaca secret                           (optional)
 *   DISCORD_ROLE_ID       role to @mention on a fill, numeric id
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
  FillEvent,
  isoDate,
} from '../src/crypto/ladderState';
import { buildNtfyPayload, PushMessage } from './lib';
import {
  DEFAULT_WRITEUP_SYMBOLS,
  ExpiredRungOf,
  expiryPush,
  fillPush,
  formatFillsDiscord,
  onlySymbols,
  parseRoleIds,
  parseSymbols,
  parseWebhooks,
  positionLine,
  roleForWebhook,
  withRoleMention,
} from './weekly-lib';
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

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';
  const webhooks = parseWebhooks(process.env.DISCORD_WEBHOOK_URL);
  const roleIds = parseRoleIds(process.env.DISCORD_ROLE_ID);
  // The same list the weekly write-ups use, so adding a coin there adds its
  // fill alerts here without a second setting to remember.
  const discordSymbols = parseSymbols(process.env.WRITEUP_SYMBOL, DEFAULT_WRITEUP_SYMBOLS);
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
  // Tagged with their symbol so the filters and the push can reach it. The
  // rung record itself does not carry one; it only ever lived under its symbol.
  const expired: ExpiredRungOf[] = [];

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
    expired.push(...aged.expired.map((rung) => ({ ...rung, symbol })));

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

  // Discord gets the write-up coins only. With nothing of theirs to report,
  // no message goes out at all rather than an empty embed.
  const shownFills = onlySymbols(fills, discordSymbols);
  const shownExpired = onlySymbols(expired, discordSymbols);
  const heldBack = fills.length - shownFills.length;
  if (heldBack > 0) {
    console.log(`  ${heldBack} fill(s) outside ${discordSymbols.join(', ')} not sent to Discord.`);
  }

  if (dryRun) {
    console.log('DRY RUN — no messages sent, no state saved.');
    return;
  }

  state.lastCheckedOn = today;

  const sendErrors: string[] = [];

  // ntfy gets everything: it is the phone, and it holds the full ladder.
  // Fills and expiries go as two pushes rather than one, so the high-priority
  // fill alert is not diluted by housekeeping — and so an expiry on a coin
  // Discord never mentions still reaches you somewhere.
  if (topic && fills.length > 0) {
    try {
      await sendNtfy(server, topic, fillPush(fills));
    } catch (e) {
      sendErrors.push(e instanceof Error ? e.message : String(e));
    }
  }
  if (topic && expired.length > 0) {
    try {
      await sendNtfy(server, topic, expiryPush(expired));
    } catch (e) {
      sendErrors.push(e instanceof Error ? e.message : String(e));
    }
  }

  if (shownFills.length > 0 || shownExpired.length > 0) {
    const message = formatFillsDiscord(shownFills, shownExpired);
    for (const [i, hook] of webhooks.entries()) {
      try {
        // A fill is a position opening while nobody watched: ping it. A bare
        // expiry is housekeeping and does not deserve a notification.
        await sendDiscord(
          hook,
          withRoleMention(message, shownFills.length > 0 ? roleForWebhook(roleIds, i) : undefined),
        );
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
