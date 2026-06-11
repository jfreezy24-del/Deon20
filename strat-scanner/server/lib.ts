import { Signal, TIMEFRAMES } from '../src/strat/types';

/** Identity of a signal including its state, so SETUP -> TRIGGERED counts as new. */
export const signalKey = (s: Signal) =>
  `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}-${s.status}`;

export interface NotifyOptions {
  /** Minimum confidence for TRIGGERED alerts */
  minConfidence: number;
  /** Also alert on brand-new pending setups */
  notifySetups: boolean;
  /** Minimum confidence for pending-setup alerts */
  setupMinConfidence: number;
  /** Hard cap on notifications per sweep */
  maxPerRun: number;
}

export const DEFAULT_OPTIONS: NotifyOptions = {
  minConfidence: 50,
  notifySetups: true,
  setupMinConfidence: 65,
  maxPerRun: 10,
};

/**
 * Decide which signals from this sweep deserve a push notification.
 *
 * Only signals whose key was absent from the previous sweep qualify — that
 * covers brand-new actionable bars and SETUP -> TRIGGERED transitions, and
 * silences everything that is merely still true.
 *
 * `prevKeys === null` means there is no saved state (first run or cache
 * miss); we return nothing rather than blast one alert per existing signal.
 */
export function selectNotifications(
  signals: Signal[],
  prevKeys: Set<string> | null,
  opts: NotifyOptions = DEFAULT_OPTIONS,
): Signal[] {
  if (prevKeys === null) return [];
  return signals
    .filter((s) => !prevKeys.has(signalKey(s)))
    .filter((s) =>
      s.status === 'TRIGGERED'
        ? s.confidence >= opts.minConfidence
        : opts.notifySetups && s.confidence >= opts.setupMinConfidence,
    )
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, opts.maxPerRun);
}

const fmt = (v: number) => (v >= 1 ? v.toFixed(2) : v.toFixed(5));

export function ftfcLine(s: Signal): string {
  return TIMEFRAMES.map((tf) => {
    const t = s.continuity[tf];
    return `${tf}${t === 'up' ? '▲' : t === 'down' ? '▼' : '–'}`;
  }).join(' ');
}

export interface PushMessage {
  title: string;
  body: string;
  priority: 'high' | 'default';
  tags: string;
}

export function formatMessage(s: Signal): PushMessage {
  const bull = s.direction === 'bullish';
  return {
    title: `${s.symbol} ${bull ? '▲' : '▼'} ${s.pattern} — ${s.status} (${s.timeframe})`,
    body:
      `Confidence ${s.confidence}% (${s.confidenceLabel}) · ` +
      `Entry ${fmt(s.levels.entry)} · Stop ${fmt(s.levels.stop)} · ` +
      `T1 ${fmt(s.levels.target1)} (${s.levels.rr1}R) · T2 ${fmt(s.levels.target2)} (${s.levels.rr2}R)\n` +
      `FTFC: ${ftfcLine(s)} · seq ${s.sequence}`,
    priority: s.status === 'TRIGGERED' ? 'high' : 'default',
    tags: bull ? 'chart_with_upwards_trend' : 'chart_with_downwards_trend',
  };
}
