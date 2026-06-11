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
import { DEFAULT_OPTIONS, formatMessage, selectNotifications, signalKey } from './lib';

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

async function sendNtfy(
  server: string,
  topic: string,
  msg: { title: string; body: string; priority: string; tags: string },
): Promise<void> {
  const res = await fetch(`${server.replace(/\/$/, '')}/${encodeURIComponent(topic)}`, {
    method: 'POST',
    headers: {
      Title: msg.title,
      Priority: msg.priority,
      Tags: msg.tags,
    },
    body: msg.body,
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';
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

  if (firstRun) {
    console.log('No previous state — baseline established; alerts start next run.');
    if (topic) {
      const top = result.signals[0];
      await sendNtfy(server, topic, {
        title: 'Strat alerts armed ✅',
        body:
          `Watching ${watchlist.length} symbols on 4H/D/W/M. ` +
          `${result.signals.length} signals currently active` +
          (top ? `; top: ${top.symbol} ${top.pattern} (${top.timeframe}) ${top.confidence}%.` : '.') +
          ' You will be pinged when a new one fires.',
        priority: 'default',
        tags: 'white_check_mark',
      });
    }
  } else {
    console.log(`${toNotify.length} new signal(s) to notify.`);
    for (const s of toNotify) {
      const msg = formatMessage(s);
      console.log(`  -> ${msg.title}`);
      if (topic) await sendNtfy(server, topic, msg);
    }
  }

  saveKeys(new Set(result.signals.map(signalKey)));
  console.log('State saved. Done.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
