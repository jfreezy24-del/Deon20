import { describe, expect, it } from 'vitest';
import { Signal } from '../src/strat/types';
import { AlgoAlert } from '../src/strat/algoAlerts';
import { algoAlertKey, buildAlgoNtfyPayload, formatAlgoEmail, formatAlgoPush } from './algo-lib';

const sig = (over: Partial<Signal>): Signal => ({
  symbol: 'NVDA',
  lastPrice: 120,
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  status: 'TRIGGERED',
  scenario: 'reversal',
  compression: true,
  isReversal: true,
  confidence: 72,
  confidenceLabel: 'High',
  factors: [],
  explanation: 'The daily chart printed a 2d-1 into support.',
  levels: { entry: 121, stop: 118, target1: 127, target2: 130, rr1: 2, rr2: 3 },
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'down' },
  setupBarTime: 1_700_000_000,
  ...over,
});

const alert = (over: Partial<AlgoAlert> = {}): AlgoAlert => ({
  signal: sig({}),
  riskLine: 118,
  relatedPlays: [
    {
      symbol: 'SMH',
      name: 'Semiconductors',
      pattern: '2-2 Continuation',
      sequence: '2u-?',
      timeframe: 'D',
      status: 'TRIGGERED',
      confidence: 66,
    },
  ],
  ...over,
});

describe('algoAlertKey', () => {
  it('identifies a trigger regardless of confidence drift', () => {
    expect(algoAlertKey(sig({ confidence: 60 }))).toBe(algoAlertKey(sig({ confidence: 75 })));
    expect(algoAlertKey(sig({ timeframe: 'W' }))).not.toBe(algoAlertKey(sig({})));
  });
});

describe('formatAlgoEmail', () => {
  it('carries the full trade plan: direction, setup, entry, risk line, targets, related plays', () => {
    const mail = formatAlgoEmail(alert());
    expect(mail.subject).toBe('NVDA LONG — 2-1-2 Reversal confirmed (D)');
    expect(mail.body).toContain('NVDA — LONG');
    expect(mail.body).toContain('Daily chart — trigger CONFIRMED');
    expect(mail.body).toContain('Entry (break of trigger): 121.00');
    expect(mail.body).toContain('RISK LINE (stop): 118.00');
    expect(mail.body).toContain('Target 1: 127.00 (2R)');
    expect(mail.body).toContain('4H▲ D▲ W▲ M▼');
    expect(mail.body).toContain('SMH (Semiconductors) — 2-2 Continuation');
    expect(mail.body).toContain('Not financial advice');
  });

  it('labels shorts and omits the related section when empty', () => {
    const mail = formatAlgoEmail(alert({ signal: sig({ direction: 'bearish' }), relatedPlays: [] }));
    expect(mail.subject).toContain('SHORT');
    expect(mail.body).not.toContain('Related plays');
  });
});

describe('formatAlgoPush', () => {
  it('is always high priority with the levels and related symbols inline', () => {
    const msg = formatAlgoPush(alert());
    expect(msg.title).toBe('NVDA ▲ LONG — 2-1-2 Reversal confirmed (D)');
    expect(msg.priority).toBe('high');
    expect(msg.body).toContain('Risk line 118.00');
    expect(msg.body).toContain('Related: SMH');
  });
});

describe('buildAlgoNtfyPayload', () => {
  it('adds the email field only when an inbox is configured', () => {
    const withEmail = buildAlgoNtfyPayload('topic', alert(), 'me@example.com');
    expect(withEmail.topic).toBe('topic');
    expect(withEmail.email).toBe('me@example.com');
    // Email copies carry the full plan.
    expect(withEmail.message).toContain('RISK LINE (stop): 118.00');
    expect(() => JSON.stringify(withEmail)).not.toThrow();

    const pushOnly = buildAlgoNtfyPayload('topic', alert());
    expect('email' in pushOnly).toBe(false);
    expect(pushOnly.message).toContain('Risk line 118.00');
  });
});
