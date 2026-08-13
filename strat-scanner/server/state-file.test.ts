import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadState, saveState } from './state-file';
import { emptyState, LadderState } from '../src/crypto/ladderState';

let dir: string;
let file: string;

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'ladder-state-'));
  file = path.join(dir, 'ladder-state.json');
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

const withPosition = (): LadderState => ({
  ...emptyState(),
  lastCheckedOn: '2026-08-12',
  positions: {
    'SOL-USD': {
      symbol: 'SOL-USD',
      planDate: '2026-08-10',
      rungs: [
        {
          price: 186,
          allocationPct: 100,
          source: 'Prior week low',
          timeframe: 'W',
          placedOn: '2026-08-10',
          filledOn: null,
        },
      ],
    },
  },
});

describe('ladder state file', () => {
  it('starts empty when there is no file yet', () => {
    expect(loadState(file)).toEqual(emptyState());
  });

  it('round-trips a position record', () => {
    const state = withPosition();
    saveState(state, file);
    expect(loadState(file)).toEqual(state);
  });

  it('writes readable, diff-friendly JSON', () => {
    saveState(withPosition(), file);
    const raw = readFileSync(file, 'utf8');
    expect(raw).toContain('\n  "positions"');
    expect(raw.endsWith('\n')).toBe(true);
  });

  it('refuses to silently start over when the record is unreadable', () => {
    // Starting fresh would re-report every old rung as a new fill and lose
    // the record of what is owned.
    writeFileSync(file, '{ not json');
    expect(() => loadState(file)).toThrow(/could not be read/);
  });

  it('refuses a file from an unknown version', () => {
    writeFileSync(file, JSON.stringify({ version: 99, positions: {} }));
    expect(() => loadState(file)).toThrow(/could not be read/);
  });
});
