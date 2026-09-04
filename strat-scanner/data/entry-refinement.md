# Entry Refinement — is a 60-minute stop worth it?

_Generated 2026-09-04_ · **602** settled signals from 2026-06-10 to 2026-09-04 · 60 days of hourly history

Every signal published on D/W/M structure at confidence ≥ 50 whose "?" bar fell inside the hourly window, resolved twice against the same hourly bars: once with the higher-timeframe stop and once with a stop taken from the low/high of the last 3 intraday bars at the trigger. The trigger and both targets are identical in both columns — the stop is the single difference.

1 symbol(s) skipped: PUMP-USD: PUMP-USD: HTTP 404 from data provider.

> ⚠️ **This is the shortest-horizon report in the repo, and it cannot be otherwise.** Both data providers cap hourly history at roughly 60 days, so this covers weeks and one market regime. It is enough to see whether tighter stops get whipsawed; it is nowhere near enough to claim an edge. Re-run it periodically and look for a consistent answer rather than acting on one run.

## The trade-off

A tighter stop buys a bigger R on the same objective and buys more stop-outs. Which wins is the only question here. Both columns are the same signals, on the same bars, entered at the same trigger — the stop is the single difference.

|  | Signals | Trig% | Stopped | Obj% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Higher-timeframe stop | 602 | 59% | 29% | 55% | -0.17 | -0.101 | -60.92 |
| 60m refined stop | 602 | 59% | 53% | 39% | -0.44 | -0.258 | -155.28 |

Difference: **-0.157R per signal** — **the refined stop loses** — the extra whipsaw costs more than the better multiple buys.

## What refinement did

- **230** signals had their stop genuinely tightened, by a mean factor of **2.49×**.
- That moved the promised first objective from **0.98R** to **2.07R** on those signals.
- **125** triggered but were declined, so the higher-timeframe stop stood.
- **247** never triggered at all — identical under both by construction, and kept in the sample so the two columns describe the same population.

Why refinement declined:

- 72× — refined risk is under 20% of the original — too tight to be structure
- 11× — intraday structure sits wider than the higher-timeframe invalidation
- 3× — refined risk 0.0400 is under 0.15% of price — inside the noise
- 2× — refined risk 0.1700 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0750 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0100 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0200 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1900 is under 0.15% of price — inside the noise
- 1× — refined risk 0.9700 is under 0.15% of price — inside the noise
- 1× — refined risk 0.3900 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4700 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0404 is under 0.15% of price — inside the noise
- 1× — refined risk 0.3000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.3100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.8500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2150 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2950 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2094 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0301 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0650 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0550 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2300 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0800 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0300 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0350 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1250 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0950 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0836 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0050 is under 0.15% of price — inside the noise

## By timeframe

Refinement should help most where the higher-timeframe bar is widest — a monthly stop is a long way from a 60-minute one.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| D | 531 | -0.107 | -0.269 | -0.162 | 53% | 37% |
| W | 71 | -0.054 | -0.175 | -0.120 | 69% | 56% |

## By pattern

Compression setups already have tight risk and have the least to gain.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 278 | -0.096 | -0.328 | -0.231 | 31% | 16% |
| 2-2 Reversal | 88 | -0.011 | -0.111 | -0.100 | 91% | 74% |
| 2-1-2 Reversal | 76 | -0.020 | -0.168 | -0.148 | 85% | 67% |
| 2-1-2 Continuation | 47 | -0.062 | -0.149 | -0.087 | 74% | 56% |
| 3-1-2 Reversal | 44 | -0.037 | -0.059 | -0.022 | 76% | 59% |
| 3-2 Continuation | 30 | -0.118 | -0.187 | -0.070 | 0% | 0% |
| Rev Strat (1-2-2) Reversal | 19 | -1.087 | -1.072 | +0.015 | 80% | 70% |
| 3-2-2 Reversal | 11 | -0.170 | -0.453 | -0.283 | 71% | 29% |
| 1-1-2 Continuation | 9 | -0.111 | -0.111 | +0.000 | 50% | 50% |

---

_60m never selects: the setup, direction, trigger and both targets come from the higher timeframe untouched, and refinement only moves the stop. It only ever tightens — intraday structure wider than the higher-timeframe invalidation is declined — and refuses stops inside the noise. Both variants are resolved on hourly bars, because a stop this tight is hit intraday and daily bars would systematically under-report the whipsaw that is the whole cost being measured._
