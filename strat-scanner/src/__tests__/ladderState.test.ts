import { describe, expect, it } from 'vitest';
import {
  applyFills,
  costBasis,
  emptyState,
  expireStaleRungs,
  isoDate,
  reconcilePlan,
  SymbolPosition,
  TrackedRung,
} from '../crypto/ladderState';
import { DcaRung } from '../strat/dca';
import { Candle } from '../strat/types';

const secondsOf = (iso: string) => Date.parse(`${iso}T12:00:00Z`) / 1000;

const dayBar = (iso: string, low: number, high = low * 1.05): Candle => ({
  time: secondsOf(iso),
  open: high,
  high,
  low,
  close: (high + low) / 2,
  volume: 100,
});

const planRung = (price: number, allocationPct: number): DcaRung => ({
  price,
  allocationPct,
  discountPct: 5,
  source: 'Prior week low',
  timeframe: 'W',
  rationale: '',
});

const tracked = (over: Partial<TrackedRung> = {}): TrackedRung => ({
  price: 100,
  allocationPct: 50,
  source: 'Prior week low',
  timeframe: 'W',
  placedOn: '2026-06-01',
  filledOn: null,
  ...over,
});

const position = (rungs: TrackedRung[]): SymbolPosition => ({
  symbol: 'SOL-USD',
  planDate: '2026-06-01',
  rungs,
});

describe('reconcilePlan', () => {
  it('keeps a level placement date when the plan republishes it', () => {
    const existing = position([tracked({ price: 100, placedOn: '2026-05-01' })]);
    // The weekly job reruns and produces the same level, a fraction different.
    const next = reconcilePlan(existing, [planRung(100.2, 50)], '2026-06-15');
    expect(next.rungs).toHaveLength(1);
    expect(next.rungs[0].placedOn).toBe('2026-05-01');
  });

  it('dates a genuinely new level from today', () => {
    const existing = position([tracked({ price: 100, placedOn: '2026-05-01' })]);
    const next = reconcilePlan(existing, [planRung(80, 50)], '2026-06-15');
    expect(next.rungs[0].placedOn).toBe('2026-06-15');
  });

  it('keeps filled rungs forever, even once the plan drops the level', () => {
    const existing = position([
      tracked({ price: 100, filledOn: '2026-05-10' }),
      tracked({ price: 90 }),
    ]);
    const next = reconcilePlan(existing, [planRung(70, 100)], '2026-06-15');
    expect(next.rungs.filter((r) => r.filledOn).map((r) => r.price)).toEqual([100]);
    // The unfilled 90 is gone, replaced by the new plan's 70.
    expect(next.rungs.filter((r) => !r.filledOn).map((r) => r.price)).toEqual([70]);
  });

  it('does not re-bid a level already bought', () => {
    const existing = position([tracked({ price: 100, filledOn: '2026-05-10' })]);
    const next = reconcilePlan(existing, [planRung(100, 50), planRung(80, 50)], '2026-06-15');
    expect(next.rungs.map((r) => r.price)).toEqual([100, 80]);
    expect(next.rungs.filter((r) => r.price === 100)).toHaveLength(1);
  });

  it('starts from nothing on the first run', () => {
    const next = reconcilePlan(undefined, [planRung(100, 100)], '2026-06-15');
    expect(next.rungs).toHaveLength(1);
    expect(next.rungs[0].filledOn).toBeNull();
  });
});

describe('applyFills', () => {
  it('fills a rung on the first bar that trades down to it', () => {
    const { position: after, fills } = applyFills(position([tracked({ price: 100 })]), [
      dayBar('2026-06-02', 105),
      dayBar('2026-06-03', 99),
      dayBar('2026-06-04', 95),
    ]);
    expect(fills).toHaveLength(1);
    expect(fills[0].filledOn).toBe('2026-06-03');
    expect(after.rungs[0].filledOn).toBe('2026-06-03');
  });

  it('treats a touch as a fill, since these are resting orders', () => {
    const { fills } = applyFills(position([tracked({ price: 100 })]), [dayBar('2026-06-02', 100)]);
    expect(fills).toHaveLength(1);
  });

  it('ignores lows from before the rung was placed', () => {
    const { fills } = applyFills(position([tracked({ price: 100, placedOn: '2026-06-10' })]), [
      dayBar('2026-06-02', 80), // deep low, but the rung did not exist yet
      dayBar('2026-06-11', 105),
    ]);
    expect(fills).toEqual([]);
  });

  it('never refills a rung that already filled', () => {
    const { fills } = applyFills(
      position([tracked({ price: 100, filledOn: '2026-06-03' })]),
      [dayBar('2026-06-09', 90)],
    );
    expect(fills).toEqual([]);
  });

  it('reports every rung a single flush takes out', () => {
    const { fills } = applyFills(
      position([tracked({ price: 100 }), tracked({ price: 90 }), tracked({ price: 70 })]),
      [dayBar('2026-06-05', 85)],
    );
    expect(fills.map((f) => f.price)).toEqual([100, 90]);
  });
});

describe('expireStaleRungs', () => {
  it('drops a resting rung once it passes its lifetime', () => {
    const { position: after, expired } = expireStaleRungs(
      position([tracked({ price: 100, placedOn: '2026-01-01' })]),
      '2026-06-15',
      90,
    );
    expect(after.rungs).toEqual([]);
    expect(expired[0].ageDays).toBeGreaterThan(90);
  });

  it('keeps a rung that is still within its lifetime', () => {
    const { expired } = expireStaleRungs(
      position([tracked({ price: 100, placedOn: '2026-06-01' })]),
      '2026-06-15',
      90,
    );
    expect(expired).toEqual([]);
  });

  it('never expires a filled rung, because that is the position', () => {
    const { position: after, expired } = expireStaleRungs(
      position([tracked({ price: 100, placedOn: '2020-01-01', filledOn: '2020-02-01' })]),
      '2026-06-15',
      90,
    );
    expect(after.rungs).toHaveLength(1);
    expect(expired).toEqual([]);
  });
});

describe('costBasis', () => {
  it('weights the average by allocation, not by rung count', () => {
    const basis = costBasis(
      position([
        tracked({ price: 100, allocationPct: 20, filledOn: '2026-06-02' }),
        tracked({ price: 50, allocationPct: 80, filledOn: '2026-06-05' }),
      ]),
    );
    expect(basis.averageFill).toBe(60); // not 75
    expect(basis.deployedPct).toBe(100);
    expect(basis.filledCount).toBe(2);
  });

  it('reports what is deployed against the whole plan', () => {
    const basis = costBasis(
      position([
        tracked({ price: 100, allocationPct: 30, filledOn: '2026-06-02' }),
        tracked({ price: 80, allocationPct: 70 }),
      ]),
    );
    expect(basis.filledCount).toBe(1);
    expect(basis.totalCount).toBe(2);
    expect(basis.deployedPct).toBe(30);
    expect(basis.averageFill).toBe(100);
    expect(basis.plannedAverage).toBe(86); // 100*0.3 + 80*0.7
  });

  it('has no average before anything fills', () => {
    const basis = costBasis(position([tracked({ price: 100 })]));
    expect(basis.averageFill).toBeNull();
    expect(basis.deployedPct).toBe(0);
  });
});

describe('state helpers', () => {
  it('starts empty and dates in ISO', () => {
    expect(emptyState().positions).toEqual({});
    expect(emptyState().lastCheckedOn).toBeNull();
    expect(isoDate(Date.UTC(2026, 7, 12, 3, 0, 0))).toBe('2026-08-12');
  });
});

describe('a drifting level cannot be filled retroactively', () => {
  const d = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 1000;
  const rung = (price: number) => ({
    price,
    discountPct: 2,
    allocationPct: 100,
    source: 'Prior week low',
    timeframe: 'W' as const,
    rationale: '',
  });
  // The lowest low after the first placement is 100.2: above a 100.0 bid,
  // below a 100.4 one.
  const bars: Candle[] = [
    { time: d('2024-01-10'), open: 103, high: 104, low: 100.9, close: 103, volume: 1 },
    { time: d('2024-01-17'), open: 103, high: 104, low: 100.2, close: 103, volume: 1 },
    { time: d('2024-01-24'), open: 104, high: 105, low: 100.8, close: 104, volume: 1 },
  ];

  it('does not fill a bid with a bar that traded before the bid moved there', () => {
    // 100.0 -> 100.4 is inside the 0.5% same-place band, so placedOn is
    // carried and the staleness clock keeps running. Fill eligibility must
    // NOT be carried with it: on 17 Jan the bid was at 100.0 and the 100.2 low
    // would not have touched it.
    let pos = { ...reconcilePlan(undefined, [rung(100.0)], '2024-01-10'), symbol: 'X' };
    pos = applyFills(pos, bars).position;
    expect(pos.rungs[0].filledOn).toBeNull();

    pos = { ...reconcilePlan(pos, [rung(100.4)], '2024-01-24'), symbol: 'X' };
    // The staleness clock is still the original placement...
    expect(pos.rungs[0].placedOn).toBe('2024-01-10');
    // ...but the price is new, so fills only count from today.
    expect(pos.rungs[0].pricedOn).toBe('2024-01-24');

    expect(applyFills(pos, bars).fills).toHaveLength(0);
  });

  it('still fills a bid the market genuinely reaches after it moved', () => {
    let pos = { ...reconcilePlan(undefined, [rung(100.0)], '2024-01-10'), symbol: 'X' };
    pos = { ...reconcilePlan(pos, [rung(100.4)], '2024-01-17'), symbol: 'X' };
    // The 17 Jan bar is on the day the bid moved to 100.4, and its low is 100.2.
    const res = applyFills(pos, bars);
    expect(res.fills).toHaveLength(1);
    expect(res.fills[0].filledOn).toBe('2024-01-17');
  });

  it('keeps fill eligibility when the level is republished unchanged', () => {
    // An identical price is the same resting order; it must not lose the days
    // it has already been sitting there.
    let pos = { ...reconcilePlan(undefined, [rung(100.5)], '2024-01-10'), symbol: 'X' };
    pos = { ...reconcilePlan(pos, [rung(100.5)], '2024-01-24'), symbol: 'X' };
    expect(pos.rungs[0].pricedOn).toBe('2024-01-10');
    expect(applyFills(pos, bars).fills[0]?.filledOn).toBe('2024-01-17');
  });

  it('falls back to placedOn for records written before pricedOn existed', () => {
    const legacy = {
      symbol: 'X',
      planDate: '2024-01-10',
      rungs: [
        {
          price: 100.4,
          allocationPct: 100,
          source: 'Prior week low',
          timeframe: 'W' as const,
          placedOn: '2024-01-10',
          filledOn: null,
        },
      ],
    };
    // No pricedOn: behaves exactly as it did before, so committed state loads.
    expect(applyFills(legacy, bars).fills[0]?.filledOn).toBe('2024-01-17');
  });
});
