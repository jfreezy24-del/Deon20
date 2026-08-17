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

  it('bids a level again in a later week, with that week’s money', () => {
    // An ongoing accumulation buys $95k twice if the plan wants it twice.
    // Retiring every level the ladder ever filled starved it of the pivots it
    // most wanted to bid — those are the levels that persist week to week.
    const existing = position([tracked({ price: 100, filledOn: '2026-05-10' })]);
    const next = reconcilePlan(existing, [planRung(100, 50), planRung(80, 50)], '2026-06-15');
    expect(next.rungs.filter((r) => r.price === 100)).toHaveLength(2);
    expect(next.rungs.filter((r) => r.price === 100 && r.filledOn === null)).toHaveLength(1);
    // The new order is dated today; it cannot inherit the old one's fill.
    const rebid = next.rungs.find((r) => r.price === 100 && !r.filledOn) as TrackedRung;
    expect(rebid.pricedOn).toBe('2026-06-15');
  });

  it('starts from nothing on the first run', () => {
    const next = reconcilePlan(undefined, [planRung(100, 100)], '2026-06-15');
    expect(next.rungs).toHaveLength(1);
    expect(next.rungs[0].filledOn).toBeNull();
  });
});

describe('reconcilePlan keeps one contribution committed at a time', () => {
  const restingWeight = (p: SymbolPosition) =>
    p.rungs.filter((r) => !r.filledOn).reduce((s, r) => s + r.allocationPct, 0);

  it('passes the plan through untouched', () => {
    // Each week's 100% is 100% of that week's contribution, not of a lifetime
    // total, so a fresh plan is published exactly as built.
    const next = reconcilePlan(
      undefined,
      [planRung(100, 20), planRung(90, 24), planRung(80, 27), planRung(70, 29)],
      '2026-06-15',
    );
    expect(next.rungs.map((r) => r.allocationPct)).toEqual([20, 24, 27, 29]);
  });

  it('does not compound when a week fills and the next republishes', () => {
    // The resting rungs are replaced, not stacked, so what is bid at any moment
    // is one contribution however long the ladder has been running.
    const existing = position([tracked({ price: 120, allocationPct: 20, filledOn: '2026-06-02' })]);
    const next = reconcilePlan(
      existing,
      [planRung(100, 20), planRung(90, 24), planRung(80, 27), planRung(70, 29)],
      '2026-06-15',
    );
    expect(restingWeight(next)).toBe(100);
  });

  it('holds that across repeated weekly republishing', () => {
    let pos = reconcilePlan(undefined, [planRung(100, 30), planRung(80, 70)], '2026-06-01');
    pos = { ...pos, rungs: pos.rungs.map((r) => (r.price === 100 ? { ...r, filledOn: '2026-06-03' } : r)) };

    for (const week of ['2026-06-08', '2026-06-15', '2026-06-22', '2026-06-29']) {
      pos = reconcilePlan(pos, [planRung(95, 30), planRung(75, 70)], week);
      // Never more than one week of money bid at once, however much history
      // has accumulated behind it.
      expect(restingWeight(pos)).toBe(100);
      expect(pos.rungs.filter((r) => !r.filledOn)).toHaveLength(2);
    }
  });

  it('keeps bidding forever — an ongoing ladder never retires itself', () => {
    let pos = reconcilePlan(undefined, [planRung(100, 100)], '2026-06-01');
    // Fill every rung, every week, for a year.
    for (let week = 0; week < 52; week++) {
      pos = { ...pos, rungs: pos.rungs.map((r) => (r.filledOn ? r : { ...r, filledOn: '2026-06-03' })) };
      pos = reconcilePlan(pos, [planRung(100, 100)], `2026-06-0${(week % 9) + 1}`);
      expect(pos.rungs.filter((r) => !r.filledOn)).toHaveLength(1);
    }
  });

  it('drops last week\'s unfilled levels rather than carrying them alongside', () => {
    const existing = position([tracked({ price: 90, allocationPct: 100 })]);
    const next = reconcilePlan(existing, [planRung(70, 100)], '2026-06-15');
    expect(next.rungs.map((r) => r.price)).toEqual([70]);
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
    expect(basis.filledCount).toBe(2);
  });

  it('separates what has been bought from what is bid right now', () => {
    const basis = costBasis(
      position([
        tracked({ price: 100, allocationPct: 30, filledOn: '2026-06-02' }),
        tracked({ price: 80, allocationPct: 70 }),
      ]),
    );
    expect(basis.filledCount).toBe(1);
    expect(basis.restingCount).toBe(1);
    expect(basis.averageFill).toBe(100);
    // The planned average is this week's ladder, not a blend with history.
    expect(basis.plannedAverage).toBe(80);
  });

  it('counts contributions rather than a share of some lifetime total', () => {
    // Three weeks of buying, fully filled each week. There is no denominator
    // to be a percentage of — an ongoing ladder just keeps going.
    const basis = costBasis(
      position([
        tracked({ price: 100, allocationPct: 100, filledOn: '2026-06-02' }),
        tracked({ price: 90, allocationPct: 100, filledOn: '2026-06-09' }),
        tracked({ price: 80, allocationPct: 100, filledOn: '2026-06-16' }),
      ]),
    );
    expect(basis.contributionsDeployed).toBe(3);
  });

  it('counts a partly filled week as a fraction of a contribution', () => {
    const basis = costBasis(
      position([
        tracked({ price: 100, allocationPct: 30, filledOn: '2026-06-02' }),
        tracked({ price: 80, allocationPct: 70 }),
      ]),
    );
    expect(basis.contributionsDeployed).toBe(0.3);
  });

  it('does not let a long history read as a nearly-complete position', () => {
    // The old ratio divided lifetime fills by lifetime-plus-resting, so a year
    // of weekly buying reported "91% deployed" — a number about elapsed time
    // dressed up as one about the position.
    const rungs = [
      ...Array.from({ length: 40 }, (_, i) =>
        tracked({ price: 100 - i, allocationPct: 100, filledOn: '2026-06-02' }),
      ),
      ...Array.from({ length: 4 }, (_, i) => tracked({ price: 60 - i, allocationPct: 25 })),
    ];
    const basis = costBasis(position(rungs));
    expect(basis.filledCount).toBe(40);
    expect(basis.restingCount).toBe(4);
    expect(basis.contributionsDeployed).toBe(40);
  });

  it('has no average before anything fills', () => {
    const basis = costBasis(position([tracked({ price: 100 })]));
    expect(basis.averageFill).toBeNull();
    expect(basis.contributionsDeployed).toBe(0);
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
