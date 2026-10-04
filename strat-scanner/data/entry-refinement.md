# Entry Refinement — is a 60-minute stop worth it?

_Generated 2026-10-04_ · **680** settled signals from 2026-07-10 to 2026-10-04 · 60 days of hourly history

Every signal published on D/W/M structure at confidence ≥ 50 whose "?" bar fell inside the hourly window, resolved twice against the same hourly bars: once with the higher-timeframe stop and once with a stop taken from the low/high of the last 3 intraday bars at the trigger. The trigger and both targets are identical in both columns — the stop is the single difference.

1 symbol(s) skipped: PUMP-USD: PUMP-USD: HTTP 404 from data provider.

> ⚠️ **This is the shortest-horizon report in the repo, and it cannot be otherwise.** Both data providers cap hourly history at roughly 60 days, so this covers weeks and one market regime. It is enough to see whether tighter stops get whipsawed; it is nowhere near enough to claim an edge. Re-run it periodically and look for a consistent answer rather than acting on one run.

## The trade-off

A tighter stop buys a bigger R on the same objective and buys more stop-outs. Which wins is the only question here. Both columns are the same signals, on the same bars, entered at the same trigger — the stop is the single difference.

|  | Signals | Trig% | Stopped | Obj% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Higher-timeframe stop | 680 | 61% | 25% | 59% | +2.59 | +1.587 | +1078.86 |
| 60m refined stop | 680 | 61% | 48% | 44% | -0.21 | -0.128 | -87.24 |

Difference: **-1.715R per signal** — **the refined stop loses** — the extra whipsaw costs more than the better multiple buys.

## What refinement did

- **262** signals had their stop genuinely tightened, by a mean factor of **2.58×**.
- That moved the promised first objective from **5.04R** to **12.90R** on those signals.
- **155** triggered but were declined, so the higher-timeframe stop stood.
- **263** never triggered at all — identical under both by construction, and kept in the sample so the two columns describe the same population.

Why refinement declined:

- 88× — refined risk is under 20% of the original — too tight to be structure
- 13× — intraday structure sits wider than the higher-timeframe invalidation
- 3× — refined risk 0.0500 is under 0.15% of price — inside the noise
- 3× — refined risk 0.0100 is under 0.15% of price — inside the noise
- 3× — refined risk 0.0300 is under 0.15% of price — inside the noise
- 3× — refined risk 0.0600 is under 0.15% of price — inside the noise
- 2× — refined risk 0.1900 is under 0.15% of price — inside the noise
- 2× — refined risk 0.3900 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0650 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0800 is under 0.15% of price — inside the noise
- 2× — refined risk 1.6001 is under 0.15% of price — inside the noise
- 2× — refined risk 0.2200 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0200 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1700 is under 0.15% of price — inside the noise
- 1× — refined risk 0.9700 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1162 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4700 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0404 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0400 is under 0.15% of price — inside the noise
- 1× — refined risk 0.8500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4670 is under 0.15% of price — inside the noise
- 1× — refined risk 3.5550 is under 0.15% of price — inside the noise
- 1× — refined risk 3.1200 is under 0.15% of price — inside the noise
- 1× — refined risk 3.5999 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2150 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2950 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5400 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0550 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2300 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0350 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0050 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0595 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0496 is under 0.15% of price — inside the noise

## By timeframe

Refinement should help most where the higher-timeframe bar is widest — a monthly stop is a long way from a 60-minute one.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| D | 591 | +1.833 | -0.134 | -1.967 | 57% | 41% |
| W | 89 | -0.048 | -0.091 | -0.042 | 71% | 65% |

## By pattern

Compression setups already have tight risk and have the least to gain.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 345 | -0.032 | -0.162 | -0.130 | 39% | 24% |
| 2-2 Reversal | 99 | +11.052 | -0.121 | -11.173 | 88% | 70% |
| 2-1-2 Reversal | 66 | -0.053 | -0.110 | -0.057 | 80% | 70% |
| 2-1-2 Continuation | 56 | -0.090 | -0.193 | -0.104 | 78% | 56% |
| 3-1-2 Reversal | 40 | +0.028 | +0.001 | -0.027 | 89% | 72% |
| 3-2 Continuation | 25 | -0.051 | -0.160 | -0.110 | 8% | 8% |
| Rev Strat (1-2-2) Reversal | 19 | +0.031 | +0.054 | +0.023 | 83% | 75% |
| 3-2-2 Reversal | 16 | +0.339 | +0.251 | -0.088 | 83% | 67% |
| 1-1-2 Continuation | 14 | -0.110 | -0.168 | -0.058 | 71% | 57% |

---

_60m never selects: the setup, direction, trigger and both targets come from the higher timeframe untouched, and refinement only moves the stop. It only ever tightens — intraday structure wider than the higher-timeframe invalidation is declined — and refuses stops inside the noise. Both variants are resolved on hourly bars, because a stop this tight is hit intraday and daily bars would systematically under-report the whipsaw that is the whole cost being measured._
