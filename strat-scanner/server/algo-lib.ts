/**
 * Formatting and delivery payloads for Algo Alerts: the confirmed-trigger
 * inbox alert (ticker, direction, setup, risk line, related plays) plus the
 * matching push notification. Delivery rides ntfy.sh — a push to the topic,
 * and an email copy via ntfy's e-mail forwarding when ALERT_EMAIL is set.
 */
import { Signal } from '../src/strat/types';
import { AlgoAlert } from '../src/strat/algoAlerts';
import { ftfcLine, PushMessage } from './lib';

/** Identity of a confirmed algo alert, for run-to-run dedupe. */
export const algoAlertKey = (s: Signal) =>
  `${s.symbol}-${s.timeframe}-${s.direction}-${s.setupBarTime}`;

const fmt = (v: number) => (v >= 1 ? v.toFixed(2) : v.toFixed(5));

const TF_LABEL: Record<string, string> = { '4H': '4-hour', D: 'Daily', W: 'Weekly', M: 'Monthly' };

function relatedLines(alert: AlgoAlert): string[] {
  return alert.relatedPlays.map(
    (p) =>
      `  • ${p.symbol}${p.name ? ` (${p.name})` : ''} — ${p.pattern} (${p.sequence}) ` +
      `${p.timeframe} ${p.status === 'TRIGGERED' ? 'confirmed' : 'forming'}, ${p.confidence}%`,
  );
}

export interface EmailMessage {
  subject: string;
  body: string;
}

export function formatAlgoEmail(alert: AlgoAlert): EmailMessage {
  const s = alert.signal;
  const long = s.direction === 'bullish';
  const side = long ? 'LONG' : 'SHORT';

  const lines = [
    `${s.symbol} — ${side}`,
    `Setup: ${s.pattern} (${s.sequence}) on the ${TF_LABEL[s.timeframe] ?? s.timeframe} chart — trigger CONFIRMED`,
    `Last price: ${fmt(s.lastPrice)}`,
    '',
    `Entry (break of trigger): ${fmt(s.levels.entry)}`,
    `RISK LINE (stop): ${fmt(alert.riskLine)}`,
    `Target 1: ${fmt(s.levels.target1)} (${s.levels.rr1}R)`,
    `Target 2: ${fmt(s.levels.target2)} (${s.levels.rr2}R)`,
    '',
    `Confidence: ${s.confidence}% (${s.confidenceLabel})`,
    `Timeframe continuity: ${ftfcLine(s)}`,
    '',
    'Why this setup:',
    s.explanation,
  ];

  if (alert.relatedPlays.length > 0) {
    lines.push(
      '',
      'Related plays (same structure, same direction):',
      ...relatedLines(alert),
    );
  }

  lines.push(
    '',
    '—',
    'Strat Algo Alerts · confirmed triggers only. Not financial advice — size and manage your own risk.',
  );

  return {
    subject: `${s.symbol} ${side} — ${s.pattern} confirmed (${s.timeframe})`,
    body: lines.join('\n'),
  };
}

export function formatAlgoPush(alert: AlgoAlert): PushMessage {
  const s = alert.signal;
  const long = s.direction === 'bullish';
  const related =
    alert.relatedPlays.length > 0
      ? `\nRelated: ${alert.relatedPlays.map((p) => p.symbol).join(', ')}`
      : '';
  return {
    title: `${s.symbol} ${long ? '▲ LONG' : '▼ SHORT'} — ${s.pattern} confirmed (${s.timeframe})`,
    body:
      `Entry ${fmt(s.levels.entry)} · Risk line ${fmt(alert.riskLine)} · ` +
      `T1 ${fmt(s.levels.target1)} (${s.levels.rr1}R) · T2 ${fmt(s.levels.target2)} (${s.levels.rr2}R)\n` +
      `Confidence ${s.confidence}% · FTFC ${ftfcLine(s)}` +
      related,
    priority: 'high',
    tags: long ? 'chart_with_upwards_trend' : 'chart_with_downwards_trend',
  };
}

/**
 * ntfy JSON publish payload for an algo alert. When `email` is set ntfy.sh
 * forwards a copy to that inbox (no account needed) — that is the "alert
 * hits your inbox" channel; the push to the topic rides along for free.
 */
export function buildAlgoNtfyPayload(topic: string, alert: AlgoAlert, email?: string) {
  const push = formatAlgoPush(alert);
  const mail = formatAlgoEmail(alert);
  return {
    topic,
    title: push.title,
    // The email copy carries the full plan; the push shows the same body.
    message: email ? mail.body : push.body,
    priority: 4,
    tags: [push.tags],
    ...(email ? { email } : {}),
  };
}
