import { ContinuityMap, Direction, Signal, Timeframe } from './types';
import { continuityStrip } from './continuity';

/**
 * The daily top-down prep sheet.
 *
 * Every other tool in this repo is reactive: something fires, your phone
 * buzzes, you look. That trains one habit, and it is the wrong one — reacting
 * to a notification instead of arriving with a view. This is the other half.
 * It goes out before the session, and it answers the questions a top-down
 * Strat read starts with:
 *
 *  - Where are we in the higher-timeframe candles? A new weekly open resets
 *    the line that decides weekly continuity for the next five sessions, and
 *    knowing that on the day is worth more than any single setup.
 *  - What is actually in play — which actionable bars sit closest to their
 *    trigger, so a normal session reaches them.
 *  - What does the higher-timeframe structure say, and where does it disagree
 *    with the daily?
 *
 * Nothing here is a trade call. There are no entries to take at 08:00; the
 * alerters do that when a level breaks. This is the map you read first.
 */

export interface PrepRow {
  symbol: string;
  symbolName?: string;
  timeframe: Timeframe;
  lastPrice: number;
  direction: Direction;
  pattern: string;
  sequence: string;
  compression: boolean;
  confidence: number;
  entry: number;
  stop: number;
  target1: number;
  rr1: number;
  /**
   * Percent price must still move to take the trigger. Negative means price
   * is already through it — the setup is in force, not waiting.
   */
  distancePct: number;
  status: Signal['status'];
  continuity: ContinuityMap;
}

export interface PrepSheet {
  date: string;
  calendar: string[];
  /** Daily actionable bars, nearest their trigger first. */
  inPlay: PrepRow[];
  /** Weekly and monthly structure — the setups that matter most. */
  higherTimeframe: PrepRow[];
  /** Symbols whose 4H/D/W/M candles all point the same way. */
  fullContinuityUp: string[];
  fullContinuityDown: string[];
  /** Symbols where the daily and the weekly disagree right now. */
  conflicts: { symbol: string; note: string }[];
  symbolsScanned: number;
  symbolErrors: number;
}

export interface PrepOptions {
  /** Daily rows to carry in the sheet. */
  maxInPlay: number;
  /** Weekly/monthly rows to carry. */
  maxHigherTimeframe: number;
  /**
   * Ignore daily setups further than this from their trigger. A level a normal
   * session cannot reach is not "in play" — listing it is the noise this sheet
   * exists to remove.
   */
  maxDistancePct: number;
  minConfidence: number;
}

export const DEFAULT_PREP_OPTIONS: PrepOptions = {
  maxInPlay: 8,
  maxHigherTimeframe: 8,
  maxDistancePct: 4,
  minConfidence: 40,
};

/** Percent price must still travel to take the trigger, signed. */
export function distanceToTrigger(lastPrice: number, entry: number, direction: Direction): number {
  if (lastPrice <= 0) return 0;
  const gap = direction === 'bullish' ? entry - lastPrice : lastPrice - entry;
  return (gap / lastPrice) * 100;
}

const toRow = (s: Signal): PrepRow => ({
  symbol: s.symbol,
  symbolName: s.symbolName,
  timeframe: s.timeframe,
  lastPrice: s.lastPrice,
  direction: s.direction,
  pattern: s.pattern,
  sequence: s.sequence,
  compression: s.compression,
  confidence: s.confidence,
  entry: s.levels.entry,
  stop: s.levels.stop,
  target1: s.levels.target1,
  rr1: s.levels.rr1,
  distancePct: distanceToTrigger(s.lastPrice, s.levels.entry, s.direction),
  status: s.status,
  continuity: s.continuity,
});

/* ── the timeframe calendar ────────────────────────────────────────────── */

const isWeekday = (d: Date) => d.getUTCDay() >= 1 && d.getUTCDay() <= 5;

/** Day-of-month of the first weekday in `date`'s month. */
export function firstTradingDayOfMonth(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  while (!isWeekday(d)) d.setUTCDate(d.getUTCDate() + 1);
  return d.getUTCDate();
}

/** Day-of-month of the last weekday in `date`'s month. */
export function lastTradingDayOfMonth(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  while (!isWeekday(d)) d.setUTCDate(d.getUTCDate() - 1);
  return d.getUTCDate();
}

/**
 * Where this session sits inside the higher-timeframe candles.
 *
 * Exchange holidays are not modelled — the calendar is weekday-based, so a
 * holiday shifts "first trading day" by one. It is a prompt to look at the
 * chart, not a datum anything trades off, and a holiday calendar per venue
 * would be a maintenance burden out of all proportion to that.
 */
export function calendarNotes(now: Date): string[] {
  const notes: string[] = [];
  const dow = now.getUTCDay();
  const dom = now.getUTCDate();

  if (!isWeekday(now)) {
    notes.push(
      'Weekend — equity weekly and monthly candles are closed and unchanged. ' +
        'Crypto and FX keep printing.',
    );
  }

  if (dow === 1) {
    notes.push(
      '🗓️ **New weekly candle opens today.** Today\'s open is the line that sets weekly ' +
        'continuity for the rest of the week — above it the week is green for everyone ' +
        'watching, below it red.',
    );
  } else if (isWeekday(now)) {
    notes.push(`Day ${dow} of 5 in the weekly candle.`);
  }

  if (dow === 5) {
    notes.push(
      '⏳ **Weekly candle closes at the end of this session** — whatever the weekly bar is ' +
        'now (1 / 2u / 2d / 3) is what next week\'s setups are built on.',
    );
  }

  if (dom === firstTradingDayOfMonth(now)) {
    notes.push(
      '🗓️ **New monthly candle opens today** — the slowest and heaviest level on the board. ' +
        'Where price sits against this open frames every lower timeframe all month.',
    );
  }
  if (dom === lastTradingDayOfMonth(now)) {
    notes.push(
      '⏳ **Monthly candle closes at the end of this session.** Monthly actionable bars set ' +
        'here run for the whole of next month.',
    );
  }

  return notes;
}

/* ── building the sheet ────────────────────────────────────────────────── */

/** Continuity says "up" on every timeframe it knows about, and knows ≥ 3. */
function fullyAligned(map: ContinuityMap, want: 'up' | 'down'): boolean {
  const known = Object.values(map).filter((t) => t && t !== 'flat');
  return known.length >= 3 && known.every((t) => t === want);
}

export function buildPrepSheet(
  signals: Signal[],
  meta: { symbolsScanned: number; symbolErrors: number; now?: Date },
  options: Partial<PrepOptions> = {},
): PrepSheet {
  const opts: PrepOptions = { ...DEFAULT_PREP_OPTIONS, ...options };
  const now = meta.now ?? new Date();

  const eligible = signals.filter((s) => s.confidence >= opts.minConfidence);

  const inPlay = eligible
    .filter((s) => s.timeframe === 'D')
    .map(toRow)
    .filter((r) => Math.abs(r.distancePct) <= opts.maxDistancePct)
    // Nearest the trigger first — including the ones already through it, which
    // sort to the front and are exactly what you want to see at the top.
    .sort((a, b) => Math.abs(a.distancePct) - Math.abs(b.distancePct))
    .slice(0, opts.maxInPlay);

  const higherTimeframe = eligible
    .filter((s) => s.timeframe === 'W' || s.timeframe === 'M')
    .map(toRow)
    // Compression first: an inside bar on weekly or monthly structure is the
    // tightest risk on the board and the reason to be watching at all.
    .sort((a, b) => {
      if (a.compression !== b.compression) return a.compression ? -1 : 1;
      return b.confidence - a.confidence;
    })
    .slice(0, opts.maxHigherTimeframe);

  // One continuity map per symbol — every signal for a symbol shares it.
  const bySymbol = new Map<string, ContinuityMap>();
  for (const s of signals) if (!bySymbol.has(s.symbol)) bySymbol.set(s.symbol, s.continuity);

  const fullContinuityUp: string[] = [];
  const fullContinuityDown: string[] = [];
  const conflicts: { symbol: string; note: string }[] = [];

  for (const [symbol, map] of bySymbol) {
    if (fullyAligned(map, 'up')) fullContinuityUp.push(symbol);
    else if (fullyAligned(map, 'down')) fullContinuityDown.push(symbol);

    const d = map.D;
    const w = map.W;
    if (d && w && d !== 'flat' && w !== 'flat' && d !== w) {
      conflicts.push({
        symbol,
        note: `daily ${d === 'up' ? '▲' : '▼'} against weekly ${w === 'up' ? '▲' : '▼'}`,
      });
    }
  }

  return {
    date: now.toISOString().slice(0, 10),
    calendar: calendarNotes(now),
    inPlay,
    higherTimeframe,
    fullContinuityUp: fullContinuityUp.sort(),
    fullContinuityDown: fullContinuityDown.sort(),
    conflicts: conflicts.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    symbolsScanned: meta.symbolsScanned,
    symbolErrors: meta.symbolErrors,
  };
}

/* ── rendering ─────────────────────────────────────────────────────────── */

const fmt = (v: number) => (v >= 1 ? v.toFixed(2) : v.toFixed(5));
const arrow = (d: Direction) => (d === 'bullish' ? '▲' : '▼');

/** "0.8% away" / "through it" — how far the trigger still is. */
const distanceLabel = (pct: number): string =>
  pct <= 0 ? 'through it' : `${pct.toFixed(1)}% away`;

function rowTable(rows: PrepRow[]): string {
  const header = ['', 'Setup', 'Trigger', 'To go', 'Stop', 'T1', 'R:R', 'Conf', 'FTFC'];
  const body = rows.map((r) => [
    `**${r.symbol}** ${arrow(r.direction)}${r.compression ? ' 🎯' : ''}`,
    `${r.pattern} (${r.sequence})${r.timeframe === 'D' ? '' : ` ${r.timeframe}`}`,
    fmt(r.entry),
    distanceLabel(r.distancePct),
    fmt(r.stop),
    fmt(r.target1),
    `${r.rr1}R`,
    `${r.confidence}%`,
    continuityStrip(r.continuity),
  ]);
  return [header, header.map(() => '---'), ...body].map((r) => `| ${r.join(' | ')} |`).join('\n');
}

/** The full sheet, for the Actions run summary. */
export function renderPrepSheet(sheet: PrepSheet): string {
  const lines: string[] = [];
  lines.push(`# Prep sheet — ${sheet.date}`);
  lines.push('');
  lines.push(
    `_${sheet.symbolsScanned} symbols scanned` +
      (sheet.symbolErrors > 0 ? `, ${sheet.symbolErrors} failed` : '') +
      '. Not a trade list — the map to read before the session._',
  );
  lines.push('');

  if (sheet.calendar.length > 0) {
    lines.push('## Where we are');
    lines.push('');
    for (const n of sheet.calendar) lines.push(`- ${n}`);
    lines.push('');
  }

  lines.push('## Higher-timeframe structure');
  lines.push('');
  if (sheet.higherTimeframe.length === 0) {
    lines.push('_Nothing actionable on weekly or monthly structure._');
  } else {
    lines.push('🎯 marks an inside bar — compression, the tightest risk on the board.');
    lines.push('');
    lines.push(rowTable(sheet.higherTimeframe));
  }
  lines.push('');

  lines.push('## In play today (daily)');
  lines.push('');
  if (sheet.inPlay.length === 0) {
    lines.push('_No daily trigger within reach of a normal session. A quiet day is a real answer._');
  } else {
    lines.push(rowTable(sheet.inPlay));
  }
  lines.push('');

  lines.push('## Timeframe continuity');
  lines.push('');
  lines.push(
    `- **Full continuity up:** ${sheet.fullContinuityUp.length > 0 ? sheet.fullContinuityUp.join(', ') : '_none_'}`,
  );
  lines.push(
    `- **Full continuity down:** ${sheet.fullContinuityDown.length > 0 ? sheet.fullContinuityDown.join(', ') : '_none_'}`,
  );
  if (sheet.conflicts.length > 0) {
    lines.push(
      `- **Daily against weekly:** ${sheet.conflicts.map((c) => `${c.symbol} (${c.note})`).join(', ')} — ` +
        'counter-continuity trades, or a cleaner entry once the timeframe flips.',
    );
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('_Educational only, not financial advice._');

  return lines.join('\n');
}

/**
 * One push notification. Deliberately short: this arrives before the session
 * and has to be readable on a lock screen, so it carries the calendar note
 * and the few names nearest a trigger. The full sheet is in the run summary.
 */
export function prepDigest(sheet: PrepSheet, maxLines = 5): string {
  const lines: string[] = [];

  // Only the genuinely notable calendar entries — a "day 3 of 5" note is not
  // worth the space on a lock screen.
  const notable = sheet.calendar.filter((n) => n.includes('**'));
  for (const n of notable) lines.push(n.replace(/\*\*/g, '').replace(/^🗓️ |^⏳ /, '• '));

  const compressions = sheet.higherTimeframe.filter((r) => r.compression);
  if (compressions.length > 0) {
    lines.push(
      `HTF compression: ${compressions
        .slice(0, 4)
        .map((r) => `${r.symbol} ${r.timeframe}`)
        .join(', ')}`,
    );
  }

  if (sheet.inPlay.length > 0) {
    lines.push('In play:');
    for (const r of sheet.inPlay.slice(0, maxLines)) {
      lines.push(
        `  ${r.symbol} ${arrow(r.direction)} ${fmt(r.entry)} (${distanceLabel(r.distancePct)}) · ` +
          `stop ${fmt(r.stop)} · ${r.confidence}%`,
      );
    }
  } else {
    lines.push('No daily trigger within reach today.');
  }

  const ftfc: string[] = [];
  if (sheet.fullContinuityUp.length > 0) ftfc.push(`▲ ${sheet.fullContinuityUp.join(' ')}`);
  if (sheet.fullContinuityDown.length > 0) ftfc.push(`▼ ${sheet.fullContinuityDown.join(' ')}`);
  if (ftfc.length > 0) lines.push(`FTFC: ${ftfc.join('  ')}`);

  return lines.join('\n');
}
