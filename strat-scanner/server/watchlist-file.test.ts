import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadSymbolList } from './watchlist-file';

const FALLBACK = ['BTC-USD', 'ETH-USD'];

let dir: string;
const write = (contents: string): string => {
  const file = path.join(dir, 'watchlist.json');
  writeFileSync(file, contents);
  return file;
};

beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), 'watchlist-'));
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('loadSymbolList', () => {
  it('reads a well-formed list, upper-casing and trimming', () => {
    expect(loadSymbolList(write('[" sol-usd ", "XRP-USD"]'), FALLBACK)).toEqual([
      'SOL-USD',
      'XRP-USD',
    ]);
  });

  it('falls back instead of throwing on a trailing comma', () => {
    // The exact edit that killed a scheduled run.
    const symbols = loadSymbolList(write('[\n  "BTC-USD",\n  "SUI-USD",\n]'), FALLBACK);
    expect(symbols).toEqual(FALLBACK);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('watchlist.json'));
  });

  it('drops duplicates rather than scanning a symbol twice', () => {
    expect(loadSymbolList(write('["SUI-USD", "sui-usd", "BTC-USD"]'), FALLBACK)).toEqual([
      'SUI-USD',
      'BTC-USD',
    ]);
  });

  it('falls back on an empty list, a non-array, or a missing file', () => {
    expect(loadSymbolList(write('[]'), FALLBACK)).toEqual(FALLBACK);
    expect(loadSymbolList(write('{"symbols":["BTC-USD"]}'), FALLBACK)).toEqual(FALLBACK);
    expect(loadSymbolList(path.join(dir, 'absent.json'), FALLBACK)).toEqual(FALLBACK);
  });

  it('names the file and the reason so the log says what to fix', () => {
    loadSymbolList(write('not json at all'), FALLBACK);
    const message = vi.mocked(console.warn).mock.calls[0][0] as string;
    expect(message).toContain('watchlist.json');
    expect(message).toContain('falling back to the built-in universe of 2 symbols');
  });
});
