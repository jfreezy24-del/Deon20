# DCA Ladder — does the structure earn its place?

_Generated 2026-10-05_ · **9** assets · **2049** weekly plans replayed · 2021-08-01 to 2026-10-05 · $10,000 budget per asset

Weekly ladder replay over 10 years of daily bars for 9 assets, each given 10,000 of cash for the whole window. Plans are published at each weekly close, fills checked against every subsequent daily bar, and stale rungs expired — all through the production functions rather than a reimplementation. The control ladder uses identical tier weights at fixed depths of 8% / 16% / 26% / 38% below spot.

2 asset(s) skipped: ADA-USD: only 235 daily bars; HYPE-USD: only 231 daily bars.

**Read cost efficiency and deployment together or not at all.** A ladder resting far below spot will show a beautiful average price on the sliver of capital that ever filled, and a ladder that fills instantly deploys everything at no discount. Either number alone is a way to lie to yourself, so every table below carries both.

## Does the structure beat round numbers?

The comparison that matters. Beating buy-and-hold on cost basis proves nothing — any bid below spot does that in a market that dips. The control ladder uses **identical sizing and identical tier weights**, placed at fixed percentages instead of at structure. The gap between the two rows is the entire value of reading TheStrat levels.

| Strategy | Deployed | Cost efficiency | Assets filled | Terminal value | Multiple |
| --- | --- | --- | --- | --- | --- |
| Structural ladder | 100% ($90,000) | 1.35× | 9/9 | $86,830 | 0.96× |
| Fixed-percentage ladder | 100% ($90,000) | 1.34× | 9/9 | $95,459 | 1.06× |
| Buy it all at plan time | 100% ($90,000) | 1.15× | 9/9 | $120,649 | 1.34× |
| Weekly DCA (26 weeks) | 100% ($90,000) | 1.28× | 9/9 | $78,220 | 0.87× |

_Cost efficiency is average price paid ÷ mean price available over the window. Below 1.00 means the strategy bought cheaper than the period's average; 1.00 means it paid the going rate._

Structural against control: **+1.09%** on cost efficiency and **+0pp** on deployment — **the control ladder is better** — round percentages beat the structural levels here.

## Which rung source earns its place?

Fill rate is per **distinct rung placed** — a level the next plan still wants keeps its original placement and is not counted twice, exactly as the live reconciliation treats it. A source that is offered constantly and rarely fills is not the same as one offered rarely and always filled, and a raw fill count cannot tell them apart.

| Source | Placed | Filled | Fill rate | Median days to fill | Mean discount | Share of spend |
| --- | --- | --- | --- | --- | --- | --- |
| Prior week low | 1223 | 555 | 45% | 1 | 5.7% | 76% |
| Measured move | 312 | 25 | 8% | 4 | 22.5% | 11% |
| Weekly pivot low | 249 | 83 | 33% | 12 | 17.2% | 8% |
| Prior month low | 162 | 94 | 58% | 10 | 13.1% | 5% |
| Monthly pivot low | 75 | 20 | 27% | 26 | 20.0% | 0% |

_A source with a high fill rate and a small discount is a shallow rung doing ordinary work. One with a low fill rate and a large discount only matters in a flush — worth keeping if it carries real size when it does, worth cutting if it never fills._

## Is 90 days the right expiry?

A rung that rests unfilled past the TTL is cancelled, on the argument that a level is only meaningful while the structure that produced it stands. If a longer TTL deploys more capital at a similar price, the expiry is cancelling bids that were about to fill.

| TTL | Deployed | Cost efficiency | Rungs expired | Terminal value |
| --- | --- | --- | --- | --- |
| 30 days | 100% | 1.35× | 191 | $86,830 |
| 60 days | 100% | 1.35× | 63 | $86,830 |
| 90 days | 100% | 1.35× | 21 | $86,830 |
| 180 days | 100% | 1.35× | 2 | $86,830 |
| Never expire | 100% | 1.35× | 0 | $86,830 |

> Every TTL deployed the full budget, so this table cannot separate them. The ladder runs out of cash before expiry ever becomes the binding constraint — raise the budget per asset to make the comparison informative.

## Does the tier skew pay?

Majors are front-loaded (`tight`), large caps balanced, high-beta back-loaded (`wide`), on the argument that high-beta names routinely trade through the first pivot. Each tier is replayed under all three profiles below; **⬅︎ marks the profile the live system assigns**. If another row wins its tier consistently, the skew is backwards.

**major**

| Profile | Deployed | Cost efficiency | Terminal value | Multiple |
| --- | --- | --- | --- | --- |
| **tight** ⬅︎ | 100% | 1.01× | $27,657 | 1.38× |
| balanced | 100% | 1.04× | $26,254 | 1.31× |
| wide | 100% | 1.05× | $28,219 | 1.41× |

**large**

| Profile | Deployed | Cost efficiency | Terminal value | Multiple |
| --- | --- | --- | --- | --- |
| tight | 100% | 1.46× | $59,783 | 0.85× |
| **balanced** ⬅︎ | 100% | 1.45× | $59,173 | 0.85× |
| wide | 100% | 1.43× | $57,712 | 0.82× |

## Was DEFENSIVE ever the right call?

`DEFENSIVE` is a forecast: the monthly sequence is broken, so hold size back because the flush is more likely to reach the deep rungs. Forward returns are the only way to check it. If defensive weeks were followed by the same returns as accumulate weeks, the stance is decoration.

| Stance | Weeks | Mean +30d | Mean +90d | Lower after 90d |
| --- | --- | --- | --- | --- |
| accumulate | 631 | +4.6% | +8.2% | 59% |
| neutral | 498 | -0.1% | +4.7% | 62% |
| defensive | 920 | +4.9% | +12.6% | 57% |

## Mechanics

- **21** rungs expired unfilled across the replay.
- **$2,558,200** of requested spend had no cash behind it. Allocations are re-normalised to 100% across each fresh plan while filled rungs are carried forward, so a ladder that fills and then republishes can commit to more than the budget. A large number here means the live ladder is over-committing and the allocation percentages do not mean what the report says they mean.

## By asset

| Asset | Tier | Bars | Structural deployed | Structural eff. | Control eff. | Structural value | Control value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AVAX-USD | large | 1783 | 100% | 0.82× | 0.83× | $6,420 | $6,342 |
| BTC-USD | major | 2104 | 100% | 0.77× | 0.78× | $19,116 | $18,869 |
| DOGE-USD | large | 2104 | 100% | 1.71× | 2.01× | $4,076 | $3,463 |
| DOT-USD | large | 1145 | 100% | 2.26× | 2.15× | $1,391 | $1,466 |
| ETH-USD | major | 2104 | 100% | 1.25× | 1.29× | $8,542 | $8,287 |
| LINK-USD | large | 2104 | 100% | 1.82× | 2.01× | $5,782 | $5,229 |
| LTC-USD | large | 2104 | 100% | 1.81× | 2.07× | $4,407 | $3,848 |
| SOL-USD | large | 1686 | 100% | 1.42× | 0.63× | $7,867 | $17,761 |
| XRP-USD | large | 1009 | 100% | 0.28× | 0.28× | $29,231 | $30,193 |

---

_The replay runs the production functions — `buildDcaPlan`, `reconcilePlan`, `applyFills`, `expireStaleRungs` — not a reimplementation, so what is measured is the system that ships. Weekly and monthly candles are rebuilt from daily bars with the same partial-aware aggregation the signal backtest uses, so a plan sees only the days that had traded when it was published. A touch counts as a fill, matching the live job. Fees, spread and the fact that a resting bid in a thin token may not fill in size are not modelled._
