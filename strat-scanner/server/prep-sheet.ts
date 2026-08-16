/**
 * Daily top-down prep sheet — the map you read before the session.
 *
 * The two alerters are reactive by design: a level breaks, your phone buzzes.
 * That is the right shape for an entry and the wrong shape for a habit, since
 * it trains you to click notifications rather than arrive with a view. This
 * runs before the open and lays out the board: where we are in the weekly and
 * monthly candles, which higher-timeframe bars are compressed, which daily
 * triggers a normal session can actually reach, and where the timeframes
 * disagree.
 *
 * One ntfy push per weekday morning — the headline only, sized for a lock
 * screen. The full sheet goes to the Actions run summary, where it is a page
 * you open deliberately rather than a wall of text on your phone. Nothing is
 * committed: a prep sheet is worth reading on the day and worthless a week
 * later, so writing one into git history every morning would be noise.
 *
 * ntfy only. Discord carries the weekly crypto report and nothing else.
 *
 * Usage:  npx tsx server/prep-sheet.ts
 *
 * Environment:
 *   NTFY_TOPIC          ntfy topic to publish to (without it, log only)
 *   NTFY_SERVER         ntfy server base URL          (default https://ntfy.sh)
 *   PREP_MIN_CONFIDENCE confidence floor for rows                (default 40)
 *   PREP_MAX_DISTANCE   max % from price to trigger to count as in play (default 4)
 *   PREP_ROWS           daily rows to carry                       (default 8)
 *   DRY_RUN             'true' to print the sheet and send nothing
 */
import { appendFileSync } from 'node:fs';
import path from 'node:path';
import { scanMarket } from '../src/scanner';
import { DEFAULT_WATCHLIST } from '../src/defaultWatchlist';
import { ALGO_UNIVERSE } from '../src/strat/universe';
import {
  buildPrepSheet,
  DEFAULT_PREP_OPTIONS,
  prepDigest,
  renderPrepSheet,
} from '../src/strat/prepSheet';
import { publishNtfy } from './lib';
import { loadSymbolList } from './watchlist-file';

const WATCHLIST_FILE = path.join(__dirname, 'watchlist.json');

const flag = (v: string | undefined) => ['1', 'true', 'yes'].includes((v ?? '').trim().toLowerCase());

async function main() {
  const dryRun = flag(process.env.DRY_RUN);
  const topic = process.env.NTFY_TOPIC?.trim();
  const server = process.env.NTFY_SERVER?.trim() || 'https://ntfy.sh';

  const opts = {
    minConfidence: Number(process.env.PREP_MIN_CONFIDENCE ?? DEFAULT_PREP_OPTIONS.minConfidence),
    maxDistancePct: Number(process.env.PREP_MAX_DISTANCE ?? DEFAULT_PREP_OPTIONS.maxDistancePct),
    maxInPlay: Number(process.env.PREP_ROWS ?? DEFAULT_PREP_OPTIONS.maxInPlay),
  };

  const universe = [
    ...new Set([...loadSymbolList(WATCHLIST_FILE, DEFAULT_WATCHLIST), ...ALGO_UNIVERSE]),
  ];
  console.log(`Prep sweep: ${universe.length} symbols.`);

  const result = await scanMarket(universe, (done, total) =>
    console.log(`  progress ${done}/${total}`),
  );
  for (const err of result.errors) console.warn(`  WARN ${err.symbol}: ${err.message}`);
  if (result.signals.length === 0 && result.errors.length === universe.length) {
    throw new Error('Every symbol failed to scan — data provider unreachable?');
  }

  const sheet = buildPrepSheet(
    result.signals,
    { symbolsScanned: universe.length, symbolErrors: result.errors.length },
    opts,
  );
  const markdown = renderPrepSheet(sheet);
  const digest = prepDigest(sheet);

  console.log('');
  console.log(markdown);
  console.log('');

  // The full sheet belongs in the run summary, not in the notification and not
  // in git: it is worth reading today and worthless next week.
  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile && !dryRun) {
    appendFileSync(summaryFile, `${markdown}\n`);
    console.log('Sheet written to the run summary.');
  }

  if (dryRun) {
    console.log('DRY_RUN — nothing sent.');
    return;
  }
  if (!topic) {
    console.log('NTFY_TOPIC not set — push skipped.');
    return;
  }

  await publishNtfy(server, {
    topic,
    title: `📋 Prep sheet — ${sheet.date}`,
    message: digest,
    // Default priority, deliberately. This is a scheduled briefing, not a
    // level breaking; waking the phone for it would make the high-priority
    // trigger alerts mean less.
    priority: 3,
    tags: ['clipboard'],
  });
  console.log('Prep sheet sent.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
});
