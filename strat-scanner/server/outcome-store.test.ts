import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  appendHistory,
  emptyPending,
  loadHistory,
  loadPending,
  PendingStore,
  savePending,
  writeEdgeReport,
} from './outcome-store';
import { GradedSignal } from '../src/strat/edgeReport';
import { TrackedSignal } from '../src/strat/signalRecord';

let dir: string;
let pendingFile: string;
let historyFile: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'outcome-store-'));
  pendingFile = path.join(dir, 'signal-outcomes.json');
  historyFile = path.join(dir, 'signal-history.jsonl');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const tracked = (key: string): TrackedSignal => ({
  key,
  symbol: 'SPY',
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  scenario: 'reversal',
  compression: true,
  isReversal: true,
  confidence: 70,
  confidenceLabel: 'High',
  factorKeys: ['base', 'ftfc-full'],
  aligned: 3,
  opposed: 0,
  fullContinuity: true,
  status: 'POTENTIAL',
  levels: { entry: 101, stop: 99, target1: 104, target2: 106, rr1: 1.5, rr2: 2.5 },
  setupBarTime: 1_700_000_000,
  triggerBarEnd: 1_700_086_400,
  enrolledOn: '2026-08-16',
  resolution: { status: 'PENDING' },
});

const graded = (key: string): GradedSignal => ({
  key,
  symbol: 'SPY',
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  scenario: 'reversal',
  compression: true,
  isReversal: true,
  confidence: 70,
  factorKeys: ['base'],
  aligned: 3,
  opposed: 0,
  fullContinuity: true,
  promisedR: 1.5,
  status: 'TARGET1',
  r: 1.5,
  date: '2026-08-16',
});

describe('the unsettled record', () => {
  it('starts empty when there is no file yet', () => {
    expect(loadPending(pendingFile)).toEqual(emptyPending());
  });

  it('round-trips', () => {
    const store: PendingStore = {
      version: 1,
      lastCheckedOn: '2026-08-16',
      signals: [tracked('a')],
    };
    savePending(store, pendingFile);
    expect(loadPending(pendingFile)).toEqual(store);
  });

  it('sorts by key so the diff shows only what moved', () => {
    savePending(
      { version: 1, lastCheckedOn: '2026-08-16', signals: [tracked('z'), tracked('a')] },
      pendingFile,
    );
    const raw = readFileSync(pendingFile, 'utf8');
    expect(raw.indexOf('"a"')).toBeLessThan(raw.indexOf('"z"'));
    expect(raw.endsWith('\n')).toBe(true);
  });

  it('refuses to silently start over when the file is unreadable', () => {
    writeFileSync(pendingFile, '{ not json');
    expect(() => loadPending(pendingFile)).toThrow(/could not be read/);
  });

  it('refuses a file from an unknown version', () => {
    writeFileSync(pendingFile, JSON.stringify({ version: 99, signals: [] }));
    expect(() => loadPending(pendingFile)).toThrow(/could not be read/);
  });
});

describe('the settled history', () => {
  it('is empty when there is no file yet', () => {
    expect(loadHistory(historyFile)).toEqual([]);
  });

  it('appends rather than rewriting, so the diff stays additive', () => {
    appendHistory([graded('a')], historyFile);
    const afterFirst = readFileSync(historyFile, 'utf8');
    appendHistory([graded('b')], historyFile);
    const afterSecond = readFileSync(historyFile, 'utf8');

    expect(afterSecond.startsWith(afterFirst)).toBe(true);
    expect(loadHistory(historyFile).map((r) => r.key)).toEqual(['a', 'b']);
  });

  it('writes one self-contained line per record', () => {
    appendHistory([graded('a'), graded('b')], historyFile);
    const lines = readFileSync(historyFile, 'utf8').trim().split('\n');
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(() => JSON.parse(line)).not.toThrow();
  });

  it('does nothing when there is nothing to append', () => {
    appendHistory([], historyFile);
    expect(loadHistory(historyFile)).toEqual([]);
  });

  it('tolerates blank lines', () => {
    appendHistory([graded('a')], historyFile);
    writeFileSync(historyFile, `${readFileSync(historyFile, 'utf8')}\n\n`);
    expect(loadHistory(historyFile)).toHaveLength(1);
  });

  it('refuses to skip a corrupt line, and names it', () => {
    // Quietly computing a report over a subset of the record is worse than
    // failing: the result is indistinguishable from a real one.
    appendHistory([graded('a')], historyFile);
    writeFileSync(historyFile, `${readFileSync(historyFile, 'utf8')}{ broken\n`);
    expect(() => loadHistory(historyFile)).toThrow(/line 2/);
  });
});

describe('writeEdgeReport', () => {
  it('writes the markdown with a trailing newline', () => {
    const file = path.join(dir, 'nested', 'edge-report.md');
    writeEdgeReport('# Report', file);
    expect(readFileSync(file, 'utf8')).toBe('# Report\n');
  });
});
