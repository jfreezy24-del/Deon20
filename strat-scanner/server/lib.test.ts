import { describe, expect, it } from 'vitest';
import {
  buildNtfyPayload,
  DEFAULT_OPTIONS,
  formatMessage,
  selectNotifications,
  signalKey,
} from './lib';
import { Signal } from '../src/strat/types';

const sig = (over: Partial<Signal>): Signal => ({
  symbol: 'TEST',
  lastPrice: 100,
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  status: 'POTENTIAL',
  scenario: 'reversal',
  compression: true,
  isReversal: true,
  confidence: 70,
  confidenceLabel: 'High',
  factors: [],
  explanation: 'x',
  levels: { entry: 101, stop: 99, target1: 104, target2: 106, rr1: 1.5, rr2: 2.5 },
  continuity: { '4H': 'up', D: 'up', W: 'up', M: 'down' },
  setupBarTime: 1_700_000_000,
  triggerBarEnd: 1_700_086_400,
  ...over,
});

describe('selectNotifications', () => {
  it('returns nothing on first run (no previous state)', () => {
    expect(selectNotifications([sig({ status: 'TRIGGERED' })], null)).toEqual([]);
  });

  it('skips signals already present in the previous sweep', () => {
    const s = sig({ status: 'TRIGGERED' });
    expect(selectNotifications([s], new Set([signalKey(s)]))).toEqual([]);
  });

  it('flags POTENTIAL -> TRIGGERED transitions as new', () => {
    const setup = sig({ status: 'POTENTIAL' });
    const fired = sig({ status: 'TRIGGERED' });
    const out = selectNotifications([fired], new Set([signalKey(setup)]));
    expect(out).toHaveLength(1);
    expect(out[0].status).toBe('TRIGGERED');
  });

  it('applies confidence thresholds per status', () => {
    const weakTrig = sig({ status: 'TRIGGERED', confidence: 40, setupBarTime: 1 });
    const okTrig = sig({ status: 'TRIGGERED', confidence: 55, setupBarTime: 2 });
    const weakSetup = sig({ status: 'POTENTIAL', confidence: 55, setupBarTime: 3 });
    const strongSetup = sig({ status: 'POTENTIAL', confidence: 70, setupBarTime: 4 });
    const out = selectNotifications([weakTrig, okTrig, weakSetup, strongSetup], new Set());
    expect(out.map((s) => s.setupBarTime).sort()).toEqual([2, 4]);
  });

  it('respects notifySetups=false and the per-run cap, sorted by confidence', () => {
    const many = Array.from({ length: 15 }, (_, i) =>
      sig({ status: 'TRIGGERED', confidence: 50 + i, setupBarTime: i }),
    );
    const out = selectNotifications(
      [...many, sig({ status: 'POTENTIAL', confidence: 90, setupBarTime: 99 })],
      new Set(),
      { ...DEFAULT_OPTIONS, notifySetups: false },
    );
    expect(out).toHaveLength(DEFAULT_OPTIONS.maxPerRun);
    expect(out.every((s) => s.status === 'TRIGGERED')).toBe(true);
    expect(out[0].confidence).toBe(64); // highest first
  });
});

describe('formatMessage', () => {
  it('renders title, levels, FTFC and priority', () => {
    const msg = formatMessage(sig({ status: 'TRIGGERED' }));
    expect(msg.title).toBe('TEST ▲ 2-1-2 Reversal (2d-1-?) — TRIGGERED (D)');
    expect(msg.body).toContain('Entry 101.00');
    expect(msg.body).toContain('Stop 99.00');
    expect(msg.body).toContain('T1 104.00 (1.5R)');
    expect(msg.body).toContain('4H▲ D▲ W▲ M▼');
    expect(msg.priority).toBe('high');
    expect(formatMessage(sig({ status: 'POTENTIAL' })).priority).toBe('default');
  });
});

describe('buildNtfyPayload', () => {
  it('keeps non-Latin-1 characters in the title (JSON publish, not headers)', () => {
    // Regression: ▲/▼/✅ in titles crashed header-based publishing because
    // HTTP header values are Latin-1 only.
    const payload = buildNtfyPayload('my-topic', {
      title: 'Strat alerts armed ✅',
      body: 'NVDA ▲ details',
      priority: 'high',
      tags: 'white_check_mark',
    });
    expect(payload.topic).toBe('my-topic');
    expect(payload.title).toBe('Strat alerts armed ✅');
    expect(payload.message).toContain('▲');
    expect(payload.priority).toBe(4);
    expect(payload.tags).toEqual(['white_check_mark']);
    expect(
      buildNtfyPayload('t', { title: 'x', body: 'y', priority: 'default', tags: 'z' }).priority,
    ).toBe(3);
    // The whole payload must serialize cleanly.
    expect(() => JSON.stringify(payload)).not.toThrow();
  });
});
