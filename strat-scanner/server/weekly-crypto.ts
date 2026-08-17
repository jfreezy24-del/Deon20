/**
 * Crypto Weekly — a once-a-week market report for the crypto universe,
 * delivered to ntfy (phone push) and Discord.
 *
 * Unlike the intraday alerters in this folder, this run is stateless and
 * unconditional: it always publishes. Each asset gets the standing DCA ladder
 * underneath price, built from weekly and monthly Strat structure. Trade
 * triggers are the intraday alerters' job — this report is accumulation only.
 *
 * Usage:  npx tsx server/weekly-crypto.ts
 *
 * Environment:
 *   NTFY_TOPIC            ntfy topic to publish to (without it, ntfy is skipped)
 *   NTFY_SERVER           ntfy server base URL          (default https://ntfy.sh)
 *   DISCORD_WEBHOOK_URL   Discord webhook(s) for the report. Several channels:
 *                         separate the URLs with commas, spaces or newlines.
 *   ALERT_EMAIL           inbox copy of the digest via ntfy e-mail forwarding
 *   APCA_API_KEY_ID       Alpaca key id     (optional; crypto bars are free)
 *   APCA_API_SECRET_KEY   Alpaca secret     (optional, paired with the above)
 *   CRYPTO_PROVIDER       'yahoo' to pin crypto back to the old source
 *   WEEKLY_NTFY_ASSETS    per-asset pushes after the digest           (default 4)
 *   WRITEUP_SYMBOL        symbols for the written analyses, comma separated.
 *                         Each gets its own message ahead of the ladder, in
 *                         the order given.  (default SOL-USD,BTC-USD,ETH-USD)
 *   DISCORD_ROLE_ID       role to @mention, numeric id. One id pings every
 *                         channel; give one per webhook, in the same order,
 *                         when the channels are in different servers.
 *   DRY_RUN               'true' to print the report and send nothing
 *   TEST_PING             'true' to send one delivery test and exit
 */
import path from 'node:path';
import { CRYPTO_UNIVERSE } from '../src/crypto/universe';
import { DEFAULT_WEEKLY_OPTIONS, scanCryptoWeekly } from '../src/crypto/weeklyReport';
import { buildNtfyPayload, PushMessage } from './lib';
import {
  describeDiscord,
  DiscordMessage,
  composeWeeklyMessages,
  formatWeeklyNtfy,
  parseSymbols,
  parseRoleIds,
  parseWebhooks,
  roleForWebhook,
  withRoleMention,
} from './weekly-lib';
import { buildWriteup } from '../src/crypto/writeup';
import { loadSymbolList } from './watchlist-file';
import { loadState, saveState } from './state-file';
import { costBasis, isoDate, reconcilePlan } from '../src/crypto/ladderState';

const WATCHLIST_FILE = path.join(__dirname, 'crypto-watchlist.json');

/**
 * Coins that get a written analysis. Each one is a separate Discord message,
 * so this is a deliberate trade of channel volume for depth.
 */
const DEFAULT_WRITEUP_SYMBOLS = ['SOL-USD', 'BTC-USD', 'ETH-USD'];

const loadUniverse = (): string[] => loadSymbolList(WATCHLIST_FILE, CRYPTO_UNIVERSE);

const num = (raw: string | undefined, fallback: number): number => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const isTrue = (raw: string | undefined): boolean =>
  ['1', 'true', 'yes'].includes((raw ?? '').trim().toLowerCase());

async function sendNtfy(server: string, topic: string, msg: PushMessage, email?: string) {
  const res = await fetch(server.replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...buildNtfyPayload(topic, msg), ...(email ? { email } : {}) }),
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

async function sendDiscord(webhookUrl: string, message: DiscordMessage) {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(message.content ? { content: message.content.slice(0, 2000) } : {}),
      embeds: message.embeds,
      // Must be forwarded, or the role ping is parsed permissively instead.
      ...(message.allowed_mentions ? { allowed_mentions: message.allowed_mentions } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Discord responded ${res.status}: ${await res.text()}`);
}

/** Discord rate-limits bursts; a short gap keeps a long report in order. */
const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';
  const discordWebhooks = parseWebhooks(process.env.DISCORD_WEBHOOK_URL);
  const roleIds = parseRoleIds(process.env.DISCORD_ROLE_ID);
  const email = process.env.ALERT_EMAIL?.trim() || undefined;
  const dryRun = isTrue(process.env.DRY_RUN);

  if (isTrue(process.env.TEST_PING)) {
    if (!topic && discordWebhooks.length === 0) {
      throw new Error('TEST_PING set but neither NTFY_TOPIC nor DISCORD_WEBHOOK_URL is set.');
    }
    const msg: PushMessage = {
      title: 'Crypto Weekly test ✅',
      body: 'Delivery is working — the weekly crypto report will arrive on this channel.',
      priority: 'default',
      tags: 'white_check_mark',
    };
    if (topic) {
      await sendNtfy(server, topic, msg, email);
      console.log('Test ping sent (ntfy accepted it).');
    }
    for (const [i, hook] of discordWebhooks.entries()) {
      // The test ping carries the role mention too: this is the cheap way to
      // check a role id resolves, without republishing the whole report.
      const roleId = roleForWebhook(roleIds, i);
      await sendDiscord(
        hook,
        withRoleMention({ content: `**${msg.title}**\n${msg.body}`, embeds: [] }, roleId),
      );
      console.log(
        `Test ping sent (Discord webhook ${i + 1} accepted it)` +
          `${roleId ? ` mentioning role ${roleId}.` : ', no role configured.'}`,
      );
    }
    return;
  }

  const universe = loadUniverse();
  console.log(`Scanning ${universe.length} crypto symbols: ${universe.join(', ')}`);

  const report = await scanCryptoWeekly(universe, (done, total) =>
    console.log(`  progress ${done}/${total}`),
  );

  for (const err of report.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  for (const f of report.fallbacks) {
    console.warn(`  FALLBACK ${f.symbol} ${f.timeframe}: ${f.reason} — served by Yahoo instead.`);
  }
  const byProvider = report.assets.reduce<Record<string, string[]>>((acc, a) => {
    (acc[a.provider ?? 'unknown'] ??= []).push(a.symbol);
    return acc;
  }, {});
  for (const [provider, symbols] of Object.entries(byProvider)) {
    console.log(`  ${provider}: ${symbols.length} symbol(s) — ${symbols.join(', ')}`);
  }
  if (report.assets.length === 0) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }
  console.log(
    `Report ready: ${report.assets.length} ladders, ${report.breadth.nearFill} within 5% of spot, ` +
      `${report.errors.length} errors.`,
  );

  // Fold this week's plan into the tracked position: filled rungs are kept,
  // and a level the plan still wants keeps its original placement date so the
  // staleness clock is not reset by republishing the same ladder.
  const state = loadState();
  const today = isoDate(report.generatedAt);
  for (const asset of report.assets) {
    const existing = state.positions[asset.symbol];
    state.positions[asset.symbol] = {
      ...reconcilePlan(existing, asset.dca.rungs, today),
      symbol: asset.symbol,
    };
  }
  const basisFor = (symbol: string) => {
    const position = state.positions[symbol];
    return position ? costBasis(position) : undefined;
  };

  // The ladder report covers the whole universe; the written analysis covers
  // one symbol in depth and rides along as its own message.
  const writeupSymbols = parseSymbols(process.env.WRITEUP_SYMBOL, DEFAULT_WRITEUP_SYMBOLS);
  const writeups = writeupSymbols.flatMap((symbol) => {
    const subject = report.assets.find((a) => a.symbol === symbol);
    if (!subject) {
      console.warn(`  WARN write-up symbol ${symbol} was not scanned — skipping its analysis.`);
      return [];
    }
    return [
      {
        writeup: buildWriteup({
          symbol: subject.symbol,
          name: subject.name,
          lastPrice: subject.lastPrice,
          weekChangePct: subject.weekChangePct,
          continuity: subject.continuity,
          structure: subject.structure,
          dca: subject.dca,
        }),
        dca: subject.dca,
      },
    ];
  });
  console.log(
    `Written analyses: ${writeups.map((w) => w.writeup.symbol).join(', ') || 'none'} ` +
      `(${writeups.length} message(s) ahead of the ladder).`,
  );

  const discordMessages = composeWeeklyMessages(report, basisFor, writeups);
  const ntfyMessages = formatWeeklyNtfy(
    report,
    num(process.env.WEEKLY_NTFY_ASSETS, DEFAULT_WEEKLY_OPTIONS.maxFeatured),
  );

  if (dryRun) {
    console.log('\n--- DRY RUN: Discord report ---\n');
    discordMessages.forEach((m, i) =>
      console.log(`[message ${i + 1}: ${m.embeds.length} embed(s)]\n${describeDiscord(m)}\n`),
    );
    console.log('--- DRY RUN: ntfy pushes ---\n');
    ntfyMessages.forEach((m) => console.log(`[${m.title}]\n${m.body}\n`));
    return;
  }

  if (!topic) console.log('NTFY_TOPIC not set — ntfy send skipped.');
  if (discordWebhooks.length === 0) {
    console.log('DISCORD_WEBHOOK_URL not set — Discord send skipped.');
  } else {
    console.log(`Posting to ${discordWebhooks.length} Discord webhook(s).`);
  }

  const sendErrors: string[] = [];

  if (topic) {
    for (const [i, msg] of ntfyMessages.entries()) {
      try {
        // Only the digest gets the email copy; per-asset pushes would spam the inbox.
        await sendNtfy(server, topic, msg, i === 0 ? email : undefined);
        console.log(`  ntfy -> ${msg.title}`);
      } catch (e) {
        sendErrors.push(e instanceof Error ? e.message : String(e));
      }
    }
  }

  // Messages go out in order per channel, and one dead webhook never stops
  // the others: a deleted channel should not silence every other channel.
  for (const [i, content] of discordMessages.entries()) {
    for (const [w, hook] of discordWebhooks.entries()) {
      try {
        // Only the first message pings, and the write-up leads, so the
        // notification lands on the analysis rather than the ladder cards.
        await sendDiscord(
          hook,
          withRoleMention(content, i === 0 ? roleForWebhook(roleIds, w) : undefined),
        );
        console.log(
          `  discord -> message ${i + 1}/${discordMessages.length} to webhook ${w + 1}/${discordWebhooks.length}`,
        );
      } catch (e) {
        // Identify the webhook by position; the URL itself is a credential.
        const reason = e instanceof Error ? e.message : String(e);
        sendErrors.push(`webhook ${w + 1}: ${reason}`);
      }
    }
    if (discordWebhooks.length > 0) await pause(600);
  }

  // Saved after sending so the tracked plan matches what was published.
  saveState(state);
  console.log('Ladder state saved.');

  if (sendErrors.length > 0) {
    throw new Error(`${sendErrors.length} message(s) failed to send: ${sendErrors[0]}`);
  }
  console.log('Weekly report delivered.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
