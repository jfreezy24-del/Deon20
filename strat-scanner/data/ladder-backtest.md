# DCA Ladder — does the structure earn its place?

_Generated 2026-08-17_ · **9** assets · **1986** weekly plans replayed · 2021-08-01 to 2026-08-17 · $5,000,000 budget per asset

Weekly ladder replay over 10 years of daily bars for 9 assets, each given 5,000,000 of cash for the whole window. Plans are published at each weekly close, fills checked against every subsequent daily bar, and stale rungs expired — all through the production functions rather than a reimplementation. The control ladder uses identical tier weights at fixed depths of 8% / 16% / 26% / 38% below spot.

1 asset(s) skipped: ADA-USD: only 186 daily bars.

**Read cost efficiency and deployment together or not at all.** A ladder resting far below spot will show a beautiful average price on the sliver of capital that ever filled, and a ladder that fills instantly deploys everything at no discount. Either number alone is a way to lie to yourself, so every table below carries both.

## Does the structure beat round numbers?

The comparison that matters. Beating buy-and-hold on cost basis proves nothing — any bid below spot does that in a market that dips. The control ladder uses **identical sizing and identical tier weights**, placed at fixed percentages instead of at structure. The gap between the two rows is the entire value of reading TheStrat levels.

| Strategy | Deployed | Cost efficiency | Assets filled | Terminal value | Multiple |
| --- | --- | --- | --- | --- | --- |
| Structural ladder | 100% ($45,000,000) | 1.34× | 9/9 | $29,301,566 | 0.65× |
| Fixed-percentage ladder | 100% ($45,000,000) | 1.32× | 9/9 | $31,962,370 | 0.71× |
| Buy it all at plan time | 100% ($45,000,000) | 1.14× | 9/9 | $40,173,963 | 0.89× |
| Weekly DCA (26 weeks) | 100% ($45,000,000) | 1.27× | 9/9 | $26,335,770 | 0.59× |

_Cost efficiency is average price paid ÷ mean price available over the window. Below 1.00 means the strategy bought cheaper than the period's average; 1.00 means it paid the going rate._

Structural against control: **+1.10%** on cost efficiency and **+0pp** on deployment — **the control ladder is better** — round percentages beat the structural levels here.

## Which rung source earns its place?

Fill rate is per **distinct rung placed** — a level the next plan still wants keeps its original placement and is not counted twice, exactly as the live reconciliation treats it. A source that is offered constantly and rarely fills is not the same as one offered rarely and always filled, and a raw fill count cannot tell them apart.

| Source | Placed | Filled | Fill rate | Median days to fill | Mean discount | Share of spend |
| --- | --- | --- | --- | --- | --- | --- |
| Prior week low | 1201 | 546 | 45% | 1 | 5.7% | 76% |
| Measured move | 315 | 25 | 8% | 4 | 22.5% | 11% |
| Weekly pivot low | 243 | 83 | 34% | 12 | 17.2% | 8% |
| Prior month low | 158 | 94 | 59% | 10 | 13.1% | 5% |
| Monthly pivot low | 75 | 20 | 27% | 26 | 20.0% | 0% |

_A source with a high fill rate and a small discount is a shallow rung doing ordinary work. One with a low fill rate and a large discount only matters in a flush — worth keeping if it carries real size when it does, worth cutting if it never fills._

## Is 90 days the right expiry?

A rung that rests unfilled past the TTL is cancelled, on the argument that a level is only meaningful while the structure that produced it stands. If a longer TTL deploys more capital at a similar price, the expiry is cancelling bids that were about to fill.

| TTL | Deployed | Cost efficiency | Rungs expired | Terminal value |
| --- | --- | --- | --- | --- |
| 30 days | 100% | 1.34× | 185 | $29,301,566 |
| 60 days | 100% | 1.34× | 60 | $29,301,566 |
| 90 days | 100% | 1.34× | 20 | $29,301,566 |
| 180 days | 100% | 1.34× | 2 | $29,301,566 |
| Never expire | 100% | 1.34× | 0 | $29,301,566 |

> Every TTL deployed the full budget, so this table cannot separate them. The ladder runs out of cash before expiry ever becomes the binding constraint — raise the budget per asset to make the comparison informative.

## Does the tier skew pay?

Majors are front-loaded (`tight`), large caps balanced, high-beta back-loaded (`wide`), on the argument that high-beta names routinely trade through the first pivot. Each tier is replayed under all three profiles below; **⬅︎ marks the profile the live system assigns**. If another row wins its tier consistently, the skew is backwards.

**major**

| Profile | Deployed | Cost efficiency | Terminal value | Multiple |
| --- | --- | --- | --- | --- |
| **tight** ⬅︎ | 100% | 1.02× | $10,099,926 | 1.01× |
| balanced | 100% | 1.05× | $9,578,661 | 0.96× |
| wide | 100% | 1.06× | $10,326,346 | 1.03× |

**large**

| Profile | Deployed | Cost efficiency | Terminal value | Multiple |
| --- | --- | --- | --- | --- |
| tight | 100% | 1.44× | $19,401,214 | 0.55× |
| **balanced** ⬅︎ | 100% | 1.43× | $19,201,639 | 0.55× |
| wide | 100% | 1.41× | $18,739,972 | 0.54× |

## Was DEFENSIVE ever the right call?

`DEFENSIVE` is a forecast: the monthly sequence is broken, so hold size back because the flush is more likely to reach the deep rungs. Forward returns are the only way to check it. If defensive weeks were followed by the same returns as accumulate weeks, the stance is decoration.

| Stance | Weeks | Mean +30d | Mean +90d | Lower after 90d |
| --- | --- | --- | --- | --- |
| accumulate | 597 | +4.1% | +7.8% | 60% |
| neutral | 477 | -0.8% | +4.4% | 63% |
| defensive | 912 | +4.5% | +11.8% | 59% |

## Mechanics

- **20** rungs expired unfilled across the replay.
- **$1,265,250,000** of requested spend had no cash behind it. Allocations are re-normalised to 100% across each fresh plan while filled rungs are carried forward, so a ladder that fills and then republishes can commit to more than the budget. A large number here means the live ladder is over-committing and the allocation percentages do not mean what the report says they mean.

## By asset

| Asset | Tier | Bars | Structural deployed | Structural eff. | Control eff. | Structural value | Control value |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AVAX-USD | large | 1734 | 100% | 0.81× | 0.82× | $1,839,137 | $1,816,920 |
| BTC-USD | major | 2055 | 100% | 0.78× | 0.79× | $7,108,968 | $7,017,155 |
| DOGE-USD | large | 2055 | 100% | 1.69× | 1.99× | $1,485,892 | $1,262,482 |
| DOT-USD | large | 1096 | 100% | 2.17× | 2.06× | $432,274 | $455,719 |
| ETH-USD | major | 2055 | 100% | 1.25× | 1.29× | $2,990,958 | $2,901,705 |
| LINK-USD | large | 2055 | 100% | 1.82× | 2.01× | $1,938,516 | $1,753,329 |
| LTC-USD | large | 2055 | 100% | 1.80× | 2.06× | $1,390,094 | $1,214,000 |
| SOL-USD | large | 1637 | 100% | 1.42× | 0.63× | $2,471,114 | $5,578,954 |
| XRP-USD | large | 960 | 100% | 0.28× | 0.27× | $9,644,614 | $9,962,106 |

---

_The replay runs the production functions — `buildDcaPlan`, `reconcilePlan`, `applyFills`, `expireStaleRungs` — not a reimplementation, so what is measured is the system that ships. Weekly and monthly candles are rebuilt from daily bars with the same partial-aware aggregation the signal backtest uses, so a plan sees only the days that had traded when it was published. A touch counts as a fill, matching the live job. Fees, spread and the fact that a resting bid in a thin token may not fill in size are not modelled._
