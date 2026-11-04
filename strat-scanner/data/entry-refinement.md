# Entry Refinement — is a 60-minute stop worth it?

_Generated 2026-11-04_ · **645** settled signals from 2026-08-11 to 2026-11-03 · 60 days of hourly history

Every signal published on D/W/M structure at confidence ≥ 50 whose "?" bar fell inside the hourly window, resolved twice against the same hourly bars: once with the higher-timeframe stop and once with a stop taken from the low/high of the last 3 intraday bars at the trigger. The trigger and both targets are identical in both columns — the stop is the single difference.

1 symbol(s) skipped: PUMP-USD: PUMP-USD: HTTP 404 from data provider.

> ⚠️ **This is the shortest-horizon report in the repo, and it cannot be otherwise.** Both data providers cap hourly history at roughly 60 days, so this covers weeks and one market regime. It is enough to see whether tighter stops get whipsawed; it is nowhere near enough to claim an edge. Re-run it periodically and look for a consistent answer rather than acting on one run.

## The trade-off

A tighter stop buys a bigger R on the same objective and buys more stop-outs. Which wins is the only question here. Both columns are the same signals, on the same bars, entered at the same trigger — the stop is the single difference.

|  | Signals | Trig% | Stopped | Obj% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Higher-timeframe stop | 645 | 59% | 25% | 63% | +2.79 | +1.659 | +1069.98 |
| 60m refined stop | 645 | 59% | 49% | 44% | -0.27 | -0.158 | -101.92 |

Difference: **-1.817R per signal** — **the refined stop loses** — the extra whipsaw costs more than the better multiple buys.

## What refinement did

- **233** signals had their stop genuinely tightened, by a mean factor of **2.63×**.
- That moved the promised first objective from **5.47R** to **14.10R** on those signals.
- **150** triggered but were declined, so the higher-timeframe stop stood.
- **262** never triggered at all — identical under both by construction, and kept in the sample so the two columns describe the same population.

Why refinement declined:

- 83× — refined risk is under 20% of the original — too tight to be structure
- 18× — intraday structure sits wider than the higher-timeframe invalidation
- 3× — refined risk 0.2200 is under 0.15% of price — inside the noise
- 3× — refined risk 0.0500 is under 0.15% of price — inside the noise
- 3× — refined risk 0.0300 is under 0.15% of price — inside the noise
- 3× — refined risk 0.1000 is under 0.15% of price — inside the noise
- 2× — refined risk 0.1900 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0650 is under 0.15% of price — inside the noise
- 2× — refined risk 0.0496 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1162 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0404 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0800 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.3900 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2400 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0400 is under 0.15% of price — inside the noise
- 1× — refined risk 0.8500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4670 is under 0.15% of price — inside the noise
- 1× — refined risk 3.5550 is under 0.15% of price — inside the noise
- 1× — refined risk 3.1200 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5500 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2150 is under 0.15% of price — inside the noise
- 1× — refined risk 0.2950 is under 0.15% of price — inside the noise
- 1× — refined risk 0.5400 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.6200 is under 0.15% of price — inside the noise
- 1× — refined risk 0.4000 is under 0.15% of price — inside the noise
- 1× — refined risk 0.3850 is under 0.15% of price — inside the noise
- 1× — refined risk 0.1600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0100 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0550 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0200 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0600 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0450 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0350 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0050 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0595 is under 0.15% of price — inside the noise
- 1× — refined risk 0.0900 is under 0.15% of price — inside the noise

## By timeframe

Refinement should help most where the higher-timeframe bar is widest — a monthly stop is a long way from a 60-minute one.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| D | 563 | +1.906 | -0.175 | -2.081 | 62% | 41% |
| W | 82 | -0.037 | -0.044 | -0.007 | 75% | 69% |

## By pattern

Compression setups already have tight risk and have the least to gain.

|  | n | Base R/signal | Refined R/signal | Δ | Base Obj% | Refined Obj% |
| --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 326 | -0.063 | -0.160 | -0.097 | 45% | 28% |
| 2-2 Reversal | 96 | +11.392 | -0.201 | -11.593 | 86% | 64% |
| 2-1-2 Continuation | 66 | -0.072 | -0.254 | -0.182 | 81% | 51% |
| 2-1-2 Reversal | 55 | +0.025 | -0.125 | -0.150 | 86% | 67% |
| 3-2 Continuation | 29 | -0.247 | -0.318 | -0.072 | 6% | 6% |
| 3-1-2 Reversal | 24 | -0.001 | -0.080 | -0.079 | 92% | 75% |
| 3-2-2 Reversal | 21 | +0.342 | +0.339 | -0.003 | 86% | 71% |
| Rev Strat (1-2-2) Reversal | 15 | +0.052 | -0.090 | -0.142 | 88% | 63% |
| 1-1-2 Continuation | 13 | -0.042 | -0.104 | -0.062 | 83% | 67% |

---

_60m never selects: the setup, direction, trigger and both targets come from the higher timeframe untouched, and refinement only moves the stop. It only ever tightens — intraday structure wider than the higher-timeframe invalidation is declined — and refuses stops inside the noise. Both variants are resolved on hourly bars, because a stop this tight is hit intraday and daily bars would systematically under-report the whipsaw that is the whole cost being measured._
