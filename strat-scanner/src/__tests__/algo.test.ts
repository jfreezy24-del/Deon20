import { describe, expect, it } from 'vitest';
import { Signal } from '../strat/types';
import {
  buildAlgoAlerts,
  DEFAULT_ALGO_OPTIONS,
  findRelatedPlays,
  selectAlgoSignals,
} from '../strat/algoAlerts';
import {
  ALGO_UNIVERSE,
  etfMembers,
  isEtf,
  relatedSymbols,
  sectorEtfsFor,
} from '../strat/universe';

const sig = (over: Partial<Signal>): Signal => ({
  symbol: 'AAPL',
  lastPrice: 100,
  timeframe: 'D',
  direction: 'bullish',
  pattern: '2-1-2 Reversal',
  sequence: '2d-1-?',
  status: 'TRIGGERED',
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
  ...over,
});

describe('universe', () => {
  it('contains the Mag 7 and only liquid ETFs, no duplicates', () => {
    for (const m of ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'SPY', 'QQQ']) {
      expect(ALGO_UNIVERSE).toContain(m);
    }
    expect(new Set(ALGO_UNIVERSE).size).toBe(ALGO_UNIVERSE.length);
  });

  it('maps sectors both ways and only within the universe', () => {
    expect(isEtf('XLK')).toBe(true);
    expect(isEtf('NVDA')).toBe(false);
    expect(etfMembers('XLK')).toContain('NVDA');
    expect(sectorEtfsFor('NVDA')).toEqual(expect.arrayContaining(['XLK', 'SMH', 'QQQ', 'SPY']));
    expect(relatedSymbols('XLE')).toEqual([]); // no universe members mapped
    for (const etf of ALGO_UNIVERSE.filter(isEtf)) {
      for (const m of etfMembers(etf)) expect(ALGO_UNIVERSE).toContain(m);
    }
  });
});

describe('selectAlgoSignals', () => {
  it('keeps only confirmed triggers on eligible timeframes above the bar', () => {
    const pending = sig({ status: 'POTENTIAL', confidence: 95, setupBarTime: 1 });
    const intraday = sig({ timeframe: '4H', confidence: 95, setupBarTime: 2 });
    const weak = sig({ confidence: 45, setupBarTime: 3 });
    const good = sig({ confidence: 65, setupBarTime: 4 });
    const out = selectAlgoSignals([pending, intraday, weak, good]);
    expect(out).toHaveLength(1);
    expect(out[0].setupBarTime).toBe(4);
  });

  it('collapses to one alert per symbol+direction, best confidence first', () => {
    const d = sig({ timeframe: 'D', confidence: 65 });
    const w = sig({ timeframe: 'W', confidence: 80 });
    const short = sig({ direction: 'bearish', confidence: 70 });
    const other = sig({ symbol: 'SPY', confidence: 75 });
    const out = selectAlgoSignals([d, w, short, other]);
    expect(out.map((s) => `${s.symbol}-${s.direction}-${s.timeframe}`)).toEqual([
      'AAPL-bullish-W',
      'SPY-bullish-D',
      'AAPL-bearish-D',
    ]);
  });

  it('respects custom confidence and timeframe options', () => {
    const four = sig({ timeframe: '4H', confidence: 55 });
    const out = selectAlgoSignals([four], { minConfidence: 50, timeframes: ['4H', 'D'] });
    expect(out).toHaveLength(1);
  });
});

describe('findRelatedPlays', () => {
  it('surfaces same-direction member setups for an ETF alert, triggered first', () => {
    const etf = sig({ symbol: 'XLK', confidence: 75 });
    const forming = sig({ symbol: 'NVDA', status: 'POTENTIAL', confidence: 90 });
    const fired = sig({ symbol: 'MSFT', status: 'TRIGGERED', confidence: 60 });
    const wrongWay = sig({ symbol: 'AAPL', direction: 'bearish' });
    const unrelated = sig({ symbol: 'TSLA' }); // not an XLK member
    const plays = findRelatedPlays(etf, [etf, forming, fired, wrongWay, unrelated]);
    expect(plays.map((p) => p.symbol)).toEqual(['MSFT', 'NVDA']);
    expect(plays[0].status).toBe('TRIGGERED');
    expect(plays[1].name).toBeUndefined();
  });

  it('surfaces sector-ETF confirmation for a stock alert, with ETF names', () => {
    const stock = sig({ symbol: 'NVDA' });
    const sector = sig({ symbol: 'SMH', confidence: 66 });
    const plays = findRelatedPlays(stock, [stock, sector]);
    expect(plays).toHaveLength(1);
    expect(plays[0].symbol).toBe('SMH');
    expect(plays[0].name).toBe('Semiconductors');
  });

  it('keeps the best signal per related symbol and caps the list', () => {
    const etf = sig({ symbol: 'QQQ' });
    const mag7 = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL'].map((symbol, i) =>
      sig({ symbol, confidence: 60 + i }),
    );
    const dupWeaker = sig({ symbol: 'GOOGL', confidence: 10, timeframe: 'W' });
    const plays = findRelatedPlays(etf, [etf, ...mag7, dupWeaker]);
    expect(plays).toHaveLength(4);
    expect(plays.map((p) => p.symbol)).not.toContain('AAPL'); // lowest confidence, capped out
    expect(plays.find((p) => p.symbol === 'GOOGL')?.confidence).toBe(64); // best per symbol kept
  });
});

describe('buildAlgoAlerts', () => {
  it('attaches the risk line (structure stop) and related plays', () => {
    const etf = sig({ symbol: 'XLK', confidence: 75 });
    const member = sig({ symbol: 'NVDA', status: 'POTENTIAL', confidence: 80 });
    const alerts = buildAlgoAlerts([etf, member], DEFAULT_ALGO_OPTIONS);
    expect(alerts).toHaveLength(1);
    expect(alerts[0].riskLine).toBe(99);
    expect(alerts[0].relatedPlays.map((p) => p.symbol)).toEqual(['NVDA']);
  });
});
