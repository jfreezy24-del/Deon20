import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { emptyState, LadderState } from '../src/crypto/ladderState';

/**
 * Where the ladder's position record lives.
 *
 * Committed to the repository, not cached. The other alerters keep their
 * dedupe keys in the Actions cache because losing them costs one duplicate
 * alert; losing this costs the record of what you own and at what price.
 * Committed state is also diffable, so every fill shows up in history.
 */
export const STATE_FILE = path.join(__dirname, '..', 'data', 'ladder-state.json');

export function loadState(file: string = STATE_FILE): LadderState {
  if (!existsSync(file)) return emptyState();
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8')) as LadderState;
    if (parsed?.version !== 1 || typeof parsed.positions !== 'object') {
      throw new Error('unrecognised shape');
    }
    return { ...emptyState(), ...parsed };
  } catch (e) {
    // Never start from scratch silently: an unreadable record means the run
    // would re-report every old rung as a new fill.
    throw new Error(
      `${path.basename(file)} could not be read (${e instanceof Error ? e.message : e}). ` +
        'Fix or delete the file deliberately — starting fresh loses the position record.',
    );
  }
}

export function saveState(state: LadderState, file: string = STATE_FILE): void {
  mkdirSync(path.dirname(file), { recursive: true });
  // Stable key order and a trailing newline keep the commit diff to the change.
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
}
