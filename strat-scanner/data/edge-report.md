# Edge Report — live signal record

_Generated 2026-09-16_ · **602** settled signals from 2026-08-17 to 2026-09-16 · 34 open, 50 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **72%** of published signals actually triggered (432 of 602) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.07R per trade taken**, -0.05R per signal published.
- Promised **0.80R** to target 1 on average; delivered **-0.07R**.
- Trades ran **0.61R** in favour at best and **0.64R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 259 | 67% | 174 | 78% | -0.10 | -0.07 | -16.85 |
| 55–64 | 258 | 73% | 189 | 70% | -0.06 | -0.05 | -11.65 |
| 65–74 (High) | 75 | 83% | 62 | 65% | -0.06 | -0.05 | -3.58 |
| 75+ (High) | 10 | 70% | 7 | 71% | +0.06 | +0.05 | +0.45 |

Spearman rank correlation between confidence and realised R: **0.069** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 114 | +0.06 | 488 | -0.08 | +0.14 | 64% vs 74% |
| `rr-poor` | 423 | -0.02 | 179 | -0.14 | +0.12 | 84% vs 34% |
| `close-location` | 327 | -0.02 | 275 | -0.09 | +0.07 | 74% vs 70% |
| `ftfc-full` | 477 | -0.04 | 125 | -0.11 | +0.07 | 74% vs 68% |
| `reversal-backed` | 362 | -0.03 | 240 | -0.09 | +0.06 | 77% vs 66% |
| `compression` | 199 | -0.05 | 403 | -0.05 | +0.00 | 77% vs 70% |
| `in-force` | 293 | -0.06 | 309 | -0.05 | -0.02 | 76% vs 65% |
| `base` | 602 | -0.05 | 0 | +0.00 | -0.05 | 72% vs 0% |
| `ftfc-aligned` | 124 | -0.11 | 478 | -0.04 | -0.07 | 68% vs 74% |
| `ftfc-opposed` | 124 | -0.11 | 478 | -0.04 | -0.07 | 68% vs 74% |
| `rr-ok` | 164 | -0.11 | 438 | -0.03 | -0.08 | 34% vs 82% |
| `rr-strong` | 15 | -0.43 | 587 | -0.04 | -0.38 | 30% vs 73% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 174 | 72% | 126 | 75% | -0.09 | -0.06 | -10.73 |
| 2-2 Continuation | 139 | 69% | 96 | 58% | -0.12 | -0.08 | -11.42 |
| 2-1-2 Reversal | 72 | 75% | 54 | 80% | +0.01 | +0.01 | +0.46 |
| 2-1-2 Continuation | 66 | 80% | 53 | 77% | -0.14 | -0.11 | -7.23 |
| Rev Strat (1-2-2) Reversal | 46 | 72% | 33 | 79% | -0.01 | -0.01 | -0.49 |
| 3-1-2 Reversal | 43 | 60% | 26 | 77% | -0.04 | -0.02 | -0.94 |
| 3-2-2 Reversal | 28 | 64% | 18 | 78% | +0.05 | +0.03 | +0.87 |
| 1-1-2 Continuation | 18 | 89% | 16 | 69% | -0.15 | -0.13 | -2.38 |
| 3-2 Continuation | 16 | 63% | 10 | 70% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 369 | 67% | 249 | 73% | -0.05 | -0.03 | -11.96 |
| W | 178 | 72% | 128 | 75% | -0.08 | -0.06 | -10.59 |
| M | 55 | 100% | 55 | 65% | -0.16 | -0.16 | -9.07 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 477 | 70% | 335 | 74% | -0.05 | -0.04 | -17.89 |
| Mixed | 124 | 78% | 97 | 68% | -0.14 | -0.11 | -13.73 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 239 | 73% | 175 | 66% | -0.12 | -0.09 | -20.80 |
| Reversal | 363 | 71% | 257 | 77% | -0.04 | -0.03 | -10.82 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 403 | 70% | 283 | 70% | -0.08 | -0.05 | -21.54 |
| Inside-bar compression (X-1-?) | 199 | 75% | 149 | 77% | -0.07 | -0.05 | -10.08 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 12 | 83% | 10 | 90% | +0.40 | +0.34 | +4.03 |
| AMZN | 18 | 83% | 15 | 93% | +0.24 | +0.20 | +3.56 |
| XLI | 21 | 71% | 15 | 87% | +0.22 | +0.16 | +3.29 |
| GLD | 20 | 60% | 12 | 92% | +0.24 | +0.14 | +2.83 |
| ETH-USD | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.54 |
| META | 23 | 61% | 14 | 93% | +0.18 | +0.11 | +2.54 |
| JUP-USD | 25 | 16% | 4 | 100% | +0.50 | +0.08 | +2.01 |
| DIA | 24 | 79% | 19 | 89% | +0.09 | +0.07 | +1.65 |
| XRP-USD | 23 | 57% | 13 | 62% | +0.05 | +0.03 | +0.68 |
| XLU | 20 | 90% | 18 | 72% | +0.00 | +0.00 | +0.05 |
| EURUSD=X | 17 | 6% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| AMD | 15 | 100% | 15 | 87% | -0.02 | -0.02 | -0.28 |
| BTC-USD | 13 | 92% | 12 | 58% | -0.04 | -0.04 | -0.51 |
| IWM | 20 | 55% | 11 | 73% | -0.07 | -0.04 | -0.79 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| XLK | 16 | 94% | 15 | 87% | -0.07 | -0.06 | -1.02 |
| XLP | 14 | 79% | 11 | 82% | -0.10 | -0.08 | -1.07 |
| HYPE-USD | 14 | 79% | 11 | 45% | -0.10 | -0.08 | -1.09 |
| XLV | 15 | 80% | 12 | 67% | -0.10 | -0.08 | -1.20 |
| TSLA | 17 | 71% | 12 | 75% | -0.12 | -0.09 | -1.47 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| MSFT | 14 | 93% | 13 | 69% | -0.11 | -0.10 | -1.37 |
| NVDA | 21 | 62% | 13 | 77% | -0.18 | -0.11 | -2.37 |
| GOOGL | 16 | 94% | 15 | 67% | -0.12 | -0.12 | -1.87 |
| SPY | 16 | 69% | 11 | 73% | -0.18 | -0.12 | -1.98 |
| TLT | 19 | 58% | 11 | 64% | -0.26 | -0.15 | -2.81 |
| XLC | 15 | 93% | 14 | 79% | -0.17 | -0.16 | -2.34 |
| XLF | 23 | 78% | 18 | 67% | -0.21 | -0.17 | -3.85 |
| SOL-USD | 17 | 65% | 11 | 55% | -0.28 | -0.18 | -3.12 |
| QQQ | 14 | 86% | 12 | 75% | -0.23 | -0.20 | -2.75 |
| AAPL | 18 | 83% | 15 | 67% | -0.27 | -0.22 | -3.98 |
| DOGE-USD | 17 | 76% | 13 | 31% | -0.30 | -0.23 | -3.84 |
| GC=F | 20 | 60% | 12 | 58% | -0.50 | -0.30 | -6.02 |
| XLE | 21 | 76% | 16 | 44% | -0.48 | -0.37 | -7.74 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
