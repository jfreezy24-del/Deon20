# Policy Sweep — how the signals are traded

_Generated 2026-10-03_ · **27395** settled signals from 2016-11-08 to 2026-10-03 · 13 policies compared

Replay of 34 symbols over 10 years of daily bars on D/W/M structure at confidence ≥ 50, resolved under 13 policies. Stage one compares exits at the live timing; stage two compares the entry window and hold at the winning exit. The two-stage grid is deliberate — the best of forty noisy numbers looks excellent whether or not anything real is there. Regime labels from SPY.

1 symbol(s) skipped: PUMP-USD: PUMP-USD: HTTP 404 from data provider.

## Does the best policy stay best?

Policies were ranked on signals before **2024-01-23** (18988 signals) and then checked on everything after (8407). This is the only number here that is not curve-fitted.

- **Chosen in-sample:** Hold for T2 · window 1 · hold 12
- **Out-of-sample it ranked 2 of 13**, at +0.237R per signal (in-sample it showed +0.026R).
- Best out-of-sample was **Hold for T2 · window 1 · hold 6** at +0.239R — a policy you could not have known to pick.
- The **current live policy** scored +0.082R out-of-sample, so switching would have been worth +0.155R per signal.

Rank agreement between the two periods: **0.396** — **the ordering is weakly stable** — there is some signal, but not enough to justify a large change.

## Policy leaderboard (full sample)

Ranked by R per signal published, not per trade taken — you cannot choose to only receive the signals that trigger. **Profit%** is the share of trades that came off green however they came off; **Obj%** is the share that reached the profit objective, which a trailing stop never does by construction.

| # | Policy | Trades | Trig% | Profit% | Obj% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hold for T2 · window 1 · hold 12 | 17660 | 65% | 36% | 21% | +0.14 | +0.090 | +2463.57 |
| 2 | Hold for T2 · window 1 · hold 6 | 17696 | 65% | 41% | 13% | +0.13 | +0.087 | +2379.34 |
| 3 | Hold for T2 · window 2 · hold 12 | 19767 | 72% | 36% | 21% | +0.11 | +0.079 | +2143.83 |
| 4 | Hold for T2 · window 2 · hold 6 | 19806 | 72% | 41% | 13% | +0.11 | +0.077 | +2110.92 |
| 5 | Hold for T2 · window 1 · hold 3 | 17722 | 65% | 44% | 7% | +0.12 | +0.074 | +2039.67 |
| 6 | Hold for T2 · window 2 · hold 3 | 19833 | 72% | 44% | 7% | +0.09 | +0.064 | +1761.18 |
| 7 | Scale 50% at T1 · window 1 · hold 6 | 17696 | 65% | 44% | 55% | +0.04 | +0.023 | +633.24 |
| 8 ⬅︎ | **Exit at T1 · window 1 · hold 6** _(live)_ | 17729 | 65% | 52% | 55% | +0.01 | +0.006 | +175.12 |
| 9 | Scale 50% at T1, BE stop · window 1 · hold 6 | 17716 | 65% | 47% | 55% | +0.01 | +0.005 | +142.83 |
| 10 | Trail 4-bar low · window 1 · hold 6 | 17737 | 65% | 28% | 0% | -0.00 | -0.000 | -8.86 |
| 11 | Trail 2-bar low · window 1 · hold 6 | 17741 | 65% | 30% | 0% | -0.00 | -0.003 | -81.85 |
| 12 | Fixed 2R target · window 1 · hold 6 | 17704 | 65% | 42% | 16% | -0.01 | -0.006 | -159.84 |
| 13 | Fixed 1R target · window 1 · hold 6 | 17722 | 65% | 49% | 38% | -0.03 | -0.018 | -479.84 |

## Year by year

A single ten-year expectancy hides whether the edge was there throughout or came from one good year. If one row carries the total, there is no edge — there was an episode.

**Exit at T1 · window 1 · hold 6**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| 2016 | 273 | 178 | 56% | +0.11 | +0.071 |
| 2017 | 2245 | 1465 | 50% | -0.04 | -0.027 |
| 2018 | 2415 | 1568 | 50% | -0.07 | -0.044 |
| 2019 | 2360 | 1515 | 50% | +0.01 | +0.006 |
| 2020 | 2487 | 1605 | 46% | -0.06 | -0.042 |
| 2021 | 2969 | 1912 | 53% | -0.05 | -0.030 |
| 2022 | 3022 | 2007 | 53% | -0.08 | -0.052 |
| 2023 | 3063 | 1973 | 56% | -0.02 | -0.014 |
| 2024 | 3016 | 1955 | 53% | -0.05 | -0.030 |
| 2025 | 3008 | 1950 | 51% | -0.11 | -0.073 |
| 2026 | 2537 | 1601 | 52% | +0.63 | +0.399 |

**Hold for T2 · window 1 · hold 12**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| 2016 | 273 | 178 | 47% | +0.10 | +0.068 |
| 2017 | 2245 | 1465 | 37% | +0.01 | +0.004 |
| 2018 | 2415 | 1568 | 38% | +0.04 | +0.026 |
| 2019 | 2360 | 1515 | 40% | +0.12 | +0.074 |
| 2020 | 2487 | 1605 | 37% | +0.00 | +0.003 |
| 2021 | 2969 | 1912 | 36% | +0.03 | +0.019 |
| 2022 | 3022 | 2007 | 33% | -0.08 | -0.054 |
| 2023 | 3063 | 1973 | 38% | +0.15 | +0.099 |
| 2024 | 3016 | 1955 | 36% | +0.06 | +0.039 |
| 2025 | 3005 | 1947 | 33% | -0.09 | -0.059 |
| 2026 | 2471 | 1535 | 33% | +1.34 | +0.830 |

## By market trend

Benchmark above or below its 200-day average on the day the signal published.

**Exit at T1 · window 1 · hold 6**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| Risk-on (above 200DMA) | 19678 | 12993 | 52% | -0.05 | -0.030 |
| Risk-off (below 200DMA) | 4776 | 3108 | 49% | -0.10 | -0.068 |
| Unknown | 2941 | 1628 | 55% | +0.67 | +0.369 |

**Hold for T2 · window 1 · hold 12**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| Risk-on (above 200DMA) | 19612 | 12927 | 37% | +0.11 | +0.075 |
| Risk-off (below 200DMA) | 4776 | 3108 | 34% | -0.08 | -0.052 |
| Unknown | 2938 | 1625 | 37% | +0.77 | +0.426 |

## By volatility

Annualised 20-day realised volatility of the benchmark, in fixed bands — no sample quantiles, which would label each day using volatility that had not happened yet.

**Exit at T1 · window 1 · hold 6**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| Low vol (<12%) | 12396 | 8255 | 52% | -0.03 | -0.021 |
| Normal vol (12–20%) | 8881 | 5858 | 53% | -0.05 | -0.030 |
| High vol (>20%) | 4645 | 2931 | 46% | -0.12 | -0.078 |
| Unknown | 1473 | 685 | 59% | +1.56 | +0.727 |

**Hold for T2 · window 1 · hold 12**

|  | n | Trades | Profit% | Avg R | R/signal |
| --- | --- | --- | --- | --- | --- |
| Low vol (<12%) | 12346 | 8205 | 37% | +0.15 | +0.103 |
| Normal vol (12–20%) | 8865 | 5842 | 38% | +0.05 | +0.030 |
| High vol (>20%) | 4645 | 2931 | 32% | -0.08 | -0.051 |
| Unknown | 1470 | 682 | 31% | +1.71 | +0.796 |

---

_Every policy is measured on an identical population of signals: detection and scoring run once and only the resolution is repeated, so a difference in the table is a difference in the exit, never in which setups existed. R is always measured against the plan's original stop, so trailing and breakeven policies cannot flatter themselves by shrinking the denominator. Costs and slippage beyond gap fills are not modelled._
