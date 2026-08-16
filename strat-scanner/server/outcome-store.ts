import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { TrackedSignal } from '../src/strat/signalRecord';
import { GradedSignal } from '../src/strat/edgeReport';

/**
 * Storage for the forward outcome record.
 *
 * Committed to the repository for the same reason the ladder's position record
 * is: a performance record you lose is worse than one you never kept, because
 * the gap is invisible afterwards. An Actions cache is evictable; git is not.
 *
 * Two files, split by whether a record can still change:
 *
 *  - `signal-outcomes.json` — unsettled signals. Rewritten every run, small
 *    and bounded (a few hundred at most).
 *  - `signal-history.jsonl` — settled signals, appended once and never edited.
 *    Newline-delimited so a day's work is a handful of added lines in the diff
 *    rather than a rewrite of the entire history, which would make the git log
 *    useless exactly when you want to read it.
 */

const DATA_DIR = path.join(__dirname, '..', 'data');

export const PENDING_FILE = path.join(DATA_DIR, 'signal-outcomes.json');
export const HISTORY_FILE = path.join(DATA_DIR, 'signal-history.jsonl');
export const EDGE_REPORT_FILE = path.join(DATA_DIR, 'edge-report.md');

export interface PendingStore {
  version: 1;
  lastCheckedOn: string | null;
  signals: TrackedSignal[];
}

export const emptyPending = (): PendingStore => ({
  version: 1,
  lastCheckedOn: null,
  signals: [],
});

function unreadable(file: string, e: unknown): Error {
  return new Error(
    `${path.basename(file)} could not be read (${e instanceof Error ? e.message : e}). ` +
      'Fix or delete the file deliberately — starting fresh silently loses the record.',
  );
}

export function loadPending(file: string = PENDING_FILE): PendingStore {
  if (!existsSync(file)) return emptyPending();
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as PendingStore;
    if (parsed?.version !== 1 || !Array.isArray(parsed.signals)) {
      throw new Error('unrecognised shape');
    }
    return { ...emptyPending(), ...parsed };
  } catch (e) {
    throw unreadable(file, e);
  }
}

export function savePending(store: PendingStore, file: string = PENDING_FILE): void {
  mkdirSync(path.dirname(file), { recursive: true });
  // Stable ordering keeps the diff to the records that actually moved, rather
  // than to however the scan happened to be ordered that morning.
  const signals = [...store.signals].sort((a, b) => a.key.localeCompare(b.key));
  writeFileSync(file, `${JSON.stringify({ ...store, signals }, null, 2)}\n`);
}

export function loadHistory(file: string = HISTORY_FILE): GradedSignal[] {
  if (!existsSync(file)) return [];
  const out: GradedSignal[] = [];
  const lines = readFileSync(file, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;
    try {
      out.push(JSON.parse(line) as GradedSignal);
    } catch (e) {
      // One bad line must not be skipped silently: a report quietly computed
      // over a subset of the history is indistinguishable from a real result.
      throw unreadable(`${path.basename(file)} line ${i + 1}`, e);
    }
  }
  return out;
}

export function appendHistory(rows: GradedSignal[], file: string = HISTORY_FILE): void {
  if (rows.length === 0) return;
  mkdirSync(path.dirname(file), { recursive: true });
  appendFileSync(file, `${rows.map((r) => JSON.stringify(r)).join('\n')}\n`);
}

export function writeEdgeReport(markdown: string, file: string = EDGE_REPORT_FILE): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${markdown}\n`);
}
