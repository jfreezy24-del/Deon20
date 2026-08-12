import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * Load a watchlist JSON file, tolerating a bad one.
 *
 * These files get hand-edited on GitHub, and a stray trailing comma used to
 * throw an opaque `Unexpected token ']'` out of JSON.parse and take the entire
 * scheduled run with it. A malformed watchlist should cost you the edit, not
 * the report — so anything unusable falls back to the built-in universe with
 * a warning that names the file and the problem.
 */
export function loadSymbolList(file: string, fallback: string[]): string[] {
  const name = path.basename(file);
  if (!existsSync(file)) return fallback;

  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'));
    if (!Array.isArray(parsed)) throw new Error('expected a JSON array of symbols');

    // Duplicates are a common hand-edit slip and would scan the symbol twice.
    const symbols = [...new Set(parsed.map((s) => String(s).trim().toUpperCase()).filter(Boolean))];
    if (symbols.length === 0) throw new Error('no symbols in the list');

    if (symbols.length !== parsed.length) {
      console.warn(
        `${name}: ignored ${parsed.length - symbols.length} duplicate or empty entr(ies).`,
      );
    }
    return symbols;
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    console.warn(
      `${name} could not be read (${reason}) — falling back to the built-in ` +
        `universe of ${fallback.length} symbols. Fix the file to use your own list.`,
    );
    return fallback;
  }
}
