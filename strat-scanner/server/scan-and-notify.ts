/**
 * Headless Strat scanner for scheduled runs (GitHub Actions cron, or any
 * machine with Node 18+). Reuses the exact engine the mobile app uses, diffs
 * the sweep against the previous run, and pushes alerts via ntfy.sh.
 *
 * Usage:  npx tsx server/scan-and-notify.ts
 *
 * Environment:
 *   NTFY_TOPIC           ntfy topic to publish to (required to actually send;
 *                        without it the run is a dry run that only logs)
 *   NTFY_SERVER          ntfy server base URL          (default https://ntfy.sh)
 *   MIN_CONFIDENCE       min confidence for TRIGGERED alerts        (default 50)
 *   NOTIFY_SETUPS        'true'/'false' — alert on new pending setups (default true)
 *   SETUP_MIN_CONFIDENCE min confidence for pending-setup alerts    (default 65)
 *
 * State: server/.state/prev-keys.json (cache it between runs to dedupe).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { scanMarket } from '../src/scanner';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import {
  buildNtfyPayload,
  DEFAULT_OPTIONS,
  formatMessage,
  PushMessage,
  selectNotifications,
  signalKey,
} from './lib';

const SERVER_DIR = __dirname;
const STATE_FILE = path.join(SERVER_DIR, '.state', 'prev-keys.json');
const WATCHLIST_FILE = path.join(SERVER_DIR, 'watchlist.json');

function loadWatchlist(): string[] {
  if (existsSync(WATCHLIST_FILE)) {
    const list = JSON.parse(readFileSync(WATCHLIST_FILE, 'utf8'));
    if (Array.isArray(list) && list.length > 0) return list.map((s) => String(s).toUpperCase());
  }
  return DEFAULT_WATCHLIST;
}

function loadPrevKeys(): Set<string> | null {
  try {
    if (!existsSync(STATE_FILE)) return null;
    const keys = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
    return Array.isArray(keys) ? new Set(keys.map(String)) : null;
  } catch {
    return null;
  }
}

function saveKeys(keys: Set<string>): void {
  mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify([...keys]));
}

async function sendNtfy(server: string, topic: string, msg: PushMessage): Promise<void> {
  const res = await fetch(server.replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildNtfyPayload(topic, msg)),
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';

  // Deterministic delivery test: when TEST_PING is set we send a single
  // notification (independent of the scan/dedupe logic) and exit. This is the
  // reliable way to confirm the secret -> ntfy.sh -> app -> phone chain works.
  const testPing = (process.env.TEST_PING ?? '').trim().toLowerCase();
  if (testPing === '1' || testPing === 'true' || testPing === 'yes') {
    if (!topic) {
      throw new Error('TEST_PING set but NTFY_TOPIC is empty — set the NTFY_TOPIC secret first.');
    }
    // Log the topic length and last 2 chars so a trailing space / wrong value
    // is visible in the run log without exposing the secret itself.
    console.log(
      `Sending test ping to topic on ${server} (length ${topic.length}, ends "…${topic.slice(-2)}").`,
    );
    await sendNtfy(server, topic, {
      title: 'Strat alerts test ✅',
      body: 'If this reached your phone, ntfy delivery is working — your topic, app and permissions are all correct.',
      priority: 'high',
      tags: 'white_check_mark',
    });
    console.log('Test ping sent successfully (ntfy accepted it).');
    return;
  }

  const opts = {
    ...DEFAULT_OPTIONS,
    minConfidence: Number(process.env.MIN_CONFIDENCE ?? DEFAULT_OPTIONS.minConfidence),
    notifySetups: (process.env.NOTIFY_SETUPS ?? 'true').toLowerCase() !== 'false',
    setupMinConfidence: Number(
      process.env.SETUP_MIN_CONFIDENCE ?? DEFAULT_OPTIONS.setupMinConfidence,
    ),
  };

  const watchlist = loadWatchlist();
  console.log(`Scanning ${watchlist.length} symbols: ${watchlist.join(', ')}`);

  const result = await scanMarket(watchlist, (done, total) =>
    console.log(`  progress ${done}/${total}`),
  );

  for (const err of result.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  if (result.signals.length === 0 && result.errors.length === watchlist.length) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }
  console.log(`Found ${result.signals.length} active signals (${result.errors.length} symbol errors).`);

  const prevKeys = loadPrevKeys();
  const firstRun = prevKeys === null;
  const toNotify = selectNotifications(result.signals, prevKeys, opts);

  if (!topic) {
    console.log('NTFY_TOPIC not set — dry run, nothing will be pushed.');
  }

  // Sends must not prevent the state save: an unsaved baseline would re-fire
  // (or re-suppress) everything on the next run.
  const sendErrors: string[] = [];
  const trySend = async (msg: PushMessage) => {
    console.log(`  -> ${msg.title}`);
    if (!topic) return;
    try {
      await sendNtfy(server, topic, msg);
    } catch (e) {
      sendErrors.push(e instanceof Error ? e.message : String(e));
    }
  };

  if (firstRun) {
    console.log('No previous state — baseline established; alerts start next run.');
    const top = result.signals[0];
    await trySend({
      title: 'Strat alerts armed ✅',
      body:
        `Watching ${watchlist.length} symbols on 4H/D/W/M. ` +
        `${result.signals.length} signals currently active` +
        (top ? `; top: ${top.symbol} ${top.pattern} (${top.timeframe}) ${top.confidence}%.` : '.') +
        ' You will be pinged when a new one fires.',
      priority: 'default',
      tags: 'white_check_mark',
    });
  } else {
    console.log(`${toNotify.length} new signal(s) to notify.`);
    for (const s of toNotify) await trySend(formatMessage(s));
  }

  saveKeys(new Set(result.signals.map(signalKey)));
  console.log('State saved. Done.');

  if (sendErrors.length > 0) {
    throw new Error(`${sendErrors.length} notification(s) failed to send: ${sendErrors[0]}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
