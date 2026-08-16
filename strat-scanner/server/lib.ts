import { Signal } from '../src/strat/types';
import { continuityStrip } from '../src/strat/continuity';

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
  return continuityStrip(s.continuity);
}

export interface PushMessage {
  title: string;
  body: string;
  priority: 'high' | 'default';
  tags: string;
}

/**
 * ntfy JSON publish payload (POST to the server root). The JSON API is used
 * instead of header-based publishing because HTTP headers are Latin-1 only —
 * the ▲/▼/✅ characters in our titles are not representable there.
 */
export function buildNtfyPayload(topic: string, msg: PushMessage) {
  return {
    topic,
    title: msg.title,
    message: msg.body,
    priority: msg.priority === 'high' ? 4 : 3,
    tags: [msg.tags],
  };
}

/**
 * POST a payload to ntfy's JSON publish endpoint.
 *
 * ntfy is the only channel the scheduled tools use. Discord carries the weekly
 * crypto report and nothing else — every other alerter, and every tool added
 * since, stays off it so the channel keeps carrying one message set a week
 * rather than a per-signal stream.
 */
export async function publishNtfy(server: string, payload: object): Promise<void> {
  const res = await fetch(server.replace(/\/$/, ''), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`ntfy responded ${res.status}: ${await res.text()}`);
}

export function formatMessage(s: Signal): PushMessage {
  const bull = s.direction === 'bullish';
  return {
    title: `${s.symbol} ${bull ? '▲' : '▼'} ${s.pattern} (${s.sequence}) — ${s.status} (${s.timeframe})`,
    body:
      `Confidence ${s.confidence}% (${s.confidenceLabel}) · ` +
      `Entry ${fmt(s.levels.entry)} · Stop ${fmt(s.levels.stop)} · ` +
      `T1 ${fmt(s.levels.target1)} (${s.levels.rr1}R) · T2 ${fmt(s.levels.target2)} (${s.levels.rr2}R)\n` +
      `FTFC: ${ftfcLine(s)} · seq ${s.sequence}`,
    priority: s.status === 'TRIGGERED' ? 'high' : 'default',
    tags: bull ? 'chart_with_upwards_trend' : 'chart_with_downwards_trend',
  };
}
