/**
 * Strat Algo Alerts — headless confirmed-trigger alerter (GitHub Actions
 * cron, or any machine with Node 18+). Sweeps the Mag 7 + liquid-ETF
 * universe, keeps only high-conviction CONFIRMED triggers on daily structure
 * and up, and delivers the trade plan (direction, setup, entry, risk line,
 * targets, related sector plays) as a push and an email.
 *
 * Usage:  npx tsx server/algo-alerts.ts
 *
 * Environment:
 *   NTFY_TOPIC            ntfy topic to publish to (required to actually send;
 *                         without it the run is a dry run that only logs)
 *   ALERT_EMAIL           inbox for email copies via ntfy e-mail forwarding
 *   NTFY_SERVER           ntfy server base URL         (default https://ntfy.sh)
 *   ALGO_MIN_CONFIDENCE   confidence bar for alerts               (default 60)
 *   ALGO_TIMEFRAMES       comma list of eligible timeframes    (default D,W,M)
 *   REFINE_ENTRIES        'false' to skip the 60m risk line      (default true)
 *
 * State: server/.state/algo-prev-keys.json (cache it between runs to dedupe).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { scanMarket } from '../src/scanner';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import { buildAlgoAlerts, DEFAULT_ALGO_OPTIONS } from '../src/strat/algoAlerts';
import { Timeframe, TIMEFRAMES } from '../src/strat/types';
import { refineEntry } from '../src/strat/entryRefinement';
import { TradePlan } from '../src/strat/outcomes';
import { fetchHourly } from '../src/data/intraday';
import { algoAlertKey, buildAlgoNtfyPayload, formatAlgoPush } from './algo-lib';
import { loadSymbolList } from './watchlist-file';

const SERVER_DIR = __dirname;
const STATE_FILE = path.join(SERVER_DIR, '.state', 'algo-prev-keys.json');
const WATCHLIST_FILE = path.join(SERVER_DIR, 'algo-watchlist.json');

const loadUniverse = (): string[] => loadSymbolList(WATCHLIST_FILE, ALGO_UNIVERSE);

/**
 * Set REFINE_ENTRIES=false to stop attaching 60-minute risk lines — the escape
 * hatch if the intraday fetch ever starts costing more than the suggestion is
 * worth.
 */
const skipRefinement = (): boolean =>
  (process.env.REFINE_ENTRIES ?? 'true').trim().toLowerCase() === 'false';

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

function parseTimeframes(raw: string | undefined): Timeframe[] {
  if (!raw?.trim()) return DEFAULT_ALGO_OPTIONS.timeframes;
  const tfs = raw
    .split(',')
    .map((t) => t.trim().toUpperCase())
    .filter((t): t is Timeframe => (TIMEFRAMES as string[]).includes(t));
  return tfs.length > 0 ? tfs : DEFAULT_ALGO_OPTIONS.timeframes;
}

async function publish(server: string, payload: object): Promise<void> {
  const res = await fetch(server.replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

async function main() {
  const topic = process.env.NTFY_TOPIC?.trim();
  const email = process.env.ALERT_EMAIL?.trim() || undefined;
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';

  // Deterministic delivery test: TEST_PING sends one notification (and an
  // email copy when ALERT_EMAIL is set) independent of the scan, then exits.
  const testPing = (process.env.TEST_PING ?? '').trim().toLowerCase();
  if (testPing === '1' || testPing === 'true' || testPing === 'yes') {
    if (!topic) throw new Error('TEST_PING set but NTFY_TOPIC is not set.');
    const testMessage =
      'If this reached you, delivery is working.' +
      (email
        ? ` An email copy went to ${email} — check the inbox (and spam) to confirm that channel too.`
        : ' Set the ALERT_EMAIL secret to also get inbox copies.');

    if (topic) {
      await publish(server, {
        topic,
        title: 'Strat Algo Alerts test ✅',
        message: testMessage,
        priority: 4,
        tags: ['white_check_mark'],
        ...(email ? { email } : {}),
      });
      console.log('Test ping sent successfully (ntfy accepted it).');
    }
    return;
  }

  const opts = {
    minConfidence: Number(process.env.ALGO_MIN_CONFIDENCE ?? DEFAULT_ALGO_OPTIONS.minConfidence),
    timeframes: parseTimeframes(process.env.ALGO_TIMEFRAMES),
  };

  const universe = loadUniverse();
  console.log(`Algo sweep: ${universe.length} symbols (${opts.timeframes.join('/')}, conf ≥ ${opts.minConfidence}).`);

  const result = await scanMarket(universe, (done, total) =>
    console.log(`  progress ${done}/${total}`),
  );

  for (const err of result.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  if (result.signals.length === 0 && result.errors.length === universe.length) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }

  const alerts = buildAlgoAlerts(result.signals, opts);
  console.log(
    `${result.signals.length} signals in sweep → ${alerts.length} confirmed algo-grade trigger(s).`,
  );

  const prevKeys = loadPrevKeys();
  const firstRun = prevKeys === null;
  const fresh = firstRun ? [] : alerts.filter((a) => !prevKeys.has(algoAlertKey(a.signal)));

  // 60-minute entry timing, attached only to the handful of alerts actually
  // going out. Best-effort by design: an alert is complete without it, so a
  // failed intraday fetch costs a tighter stop suggestion and nothing else —
  // it must never be the reason a confirmed trigger goes unsent.
  if (!skipRefinement()) {
    for (const alert of fresh) {
      try {
        const intraday = await fetchHourly(alert.signal.symbol);
        const plan: TradePlan = {
          direction: alert.signal.direction,
          timeframe: alert.signal.timeframe,
          levels: alert.signal.levels,
          setupBarTime: alert.signal.setupBarTime,
          triggerBarEnd: alert.signal.triggerBarEnd,
        };
        const refined = refineEntry(plan, intraday.candles);
        if (refined) alert.refined = refined;
      } catch (e) {
        console.warn(
          `  WARN ${alert.signal.symbol}: 60m entry timing unavailable ` +
            `(${e instanceof Error ? e.message : e}) — alerting on the structural stop only.`,
        );
      }
    }
  }

  if (!topic) console.log('NTFY_TOPIC not set — ntfy send skipped.');

  // Sends must not prevent the state save: an unsaved baseline would re-fire
  // everything on the next run.
  const sendErrors: string[] = [];
  const trySend = async (
    payload: { title?: string; message?: string; [key: string]: unknown },
    label: string,
  ) => {
    console.log(`  -> ${label}`);
    if (topic) {
      try {
        await publish(server, payload);
      } catch (e) {
        sendErrors.push(e instanceof Error ? e.message : String(e));
      }
    }
  };

  if (firstRun) {
    console.log('No previous state — baseline established; alerts start next run.');
    await trySend(
      {
        topic,
        title: 'Strat Algo Alerts armed ✅',
        message:
          `Watching ${universe.length} names (Mag 7 + liquid ETFs) for confirmed Strat triggers ` +
          `on ${opts.timeframes.join('/')} structure, confidence ≥ ${opts.minConfidence}%. ` +
          `${alerts.length} alert-grade trigger(s) currently in force. ` +
          `Expect a few alerts per week — sometimes zero. No noise, no maybes.` +
          (email ? ` Email copies go to ${email}.` : ''),
        priority: 3,
        tags: ['white_check_mark'],
        ...(email ? { email } : {}),
      },
      'baseline notice',
    );
  } else {
    console.log(`${fresh.length} new confirmed trigger(s) to alert.`);
    for (const a of fresh) {
      await trySend(buildAlgoNtfyPayload(topic ?? '', a, email), formatAlgoPush(a).title);
    }
  }

  saveKeys(new Set(alerts.map((a) => algoAlertKey(a.signal))));
  console.log('State saved. Done.');

  if (sendErrors.length > 0) {
    throw new Error(`${sendErrors.length} alert(s) failed to send: ${sendErrors[0]}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
