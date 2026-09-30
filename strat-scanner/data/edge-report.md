# Edge Report — live signal record

_Generated 2026-09-30_ · **898** settled signals from 2026-08-17 to 2026-09-30 · 29 open, 38 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **71%** of published signals actually triggered (635 of 898) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.75R per trade taken**, +3.36R per signal published.
- Promised **0.76R** to target 1 on average; delivered **+4.75R**.
- Trades ran **5.46R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 413 | 66% | 274 | 80% | +4.68 | +3.10 | +1282.27 |
| 55–64 | 377 | 73% | 277 | 69% | +6.27 | +4.60 | +1735.83 |
| 65–74 (High) | 96 | 78% | 75 | 63% | -0.04 | -0.03 | -2.70 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.042** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 268 | +7.12 | 630 | +1.76 | +5.36 | 74% vs 72% |
| `ftfc-aligned` | 188 | +6.88 | 710 | +2.43 | +4.45 | 69% vs 74% |
| `ftfc-opposed` | 188 | +6.88 | 710 | +2.43 | +4.45 | 69% vs 74% |
| `base` | 898 | +3.36 | 0 | +0.00 | +3.36 | 73% vs 0% |
| `rr-poor` | 614 | +3.99 | 284 | +2.00 | +1.99 | 84% vs 38% |
| `close-location` | 483 | +3.60 | 415 | +3.08 | +0.53 | 75% vs 70% |
| `reversal-backed` | 516 | +3.54 | 382 | +3.11 | +0.43 | 78% vs 66% |
| `rr-ok` | 264 | +2.14 | 634 | +3.87 | -1.72 | 38% vs 83% |
| `rr-strong` | 20 | +0.13 | 878 | +3.43 | -3.30 | 40% vs 74% |
| `volume` | 187 | +0.07 | 711 | +4.23 | -4.16 | 65% vs 75% |
| `ftfc-full` | 709 | +2.43 | 189 | +6.84 | -4.41 | 74% vs 69% |
| `in-force` | 439 | -0.03 | 459 | +6.60 | -6.63 | 76% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 261 | 75% | 195 | 78% | -0.05 | -0.04 | -9.60 |
| 2-2 Continuation | 231 | 65% | 151 | 58% | +3.76 | +2.46 | +568.39 |
| 2-1-2 Reversal | 104 | 73% | 76 | 74% | -0.05 | -0.03 | -3.47 |
| 2-1-2 Continuation | 94 | 78% | 73 | 74% | +8.38 | +6.51 | +611.64 |
| Rev Strat (1-2-2) Reversal | 68 | 66% | 45 | 84% | +0.07 | +0.05 | +3.17 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 37 | 65% | 24 | 79% | +22.48 | +14.58 | +539.58 |
| 3-2 Continuation | 33 | 73% | 24 | 88% | +0.27 | +0.19 | +6.42 |
| 1-1-2 Continuation | 23 | 83% | 19 | 68% | +0.17 | +0.14 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 558 | 67% | 374 | 72% | -0.03 | -0.02 | -10.82 |
| W | 242 | 75% | 182 | 77% | +3.13 | +2.35 | +569.77 |
| M | 98 | 81% | 79 | 68% | +31.11 | +25.08 | +2457.95 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 709 | 68% | 485 | 74% | +3.55 | +2.43 | +1723.57 |
| Mixed | 188 | 80% | 150 | 69% | +8.62 | +6.88 | +1293.34 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 381 | 70% | 267 | 66% | +4.46 | +3.12 | +1189.65 |
| Reversal | 517 | 71% | 368 | 78% | +4.97 | +3.53 | +1827.26 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 630 | 70% | 439 | 72% | +2.52 | +1.76 | +1107.96 |
| Inside-bar compression (X-1-?) | 268 | 73% | 196 | 74% | +9.74 | +7.12 | +1908.95 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 38 | 21% | 8 | 100% | +378.99 | +79.79 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 28 | 89% | 25 | 80% | +0.32 | +0.29 | +8.01 |
| DIA | 34 | 79% | 27 | 89% | +0.23 | +0.19 | +6.33 |
| ETH-USD | 19 | 84% | 16 | 81% | +0.17 | +0.14 | +2.64 |
| IWM | 31 | 61% | 19 | 79% | +0.21 | +0.13 | +3.95 |
| TLT | 28 | 68% | 19 | 74% | +0.18 | +0.12 | +3.41 |
| XLI | 30 | 63% | 19 | 89% | +0.19 | +0.12 | +3.59 |
| META | 30 | 63% | 19 | 79% | +0.17 | +0.10 | +3.14 |
| XLU | 33 | 85% | 28 | 64% | +0.09 | +0.08 | +2.60 |
| AMZN | 27 | 78% | 21 | 86% | +0.09 | +0.07 | +1.93 |
| EURUSD=X | 27 | 11% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| BTC-USD | 21 | 90% | 19 | 68% | +0.02 | +0.02 | +0.35 |
| XLC | 25 | 80% | 20 | 85% | -0.01 | -0.00 | -0.10 |
| XLY | 20 | 80% | 16 | 88% | -0.01 | -0.01 | -0.20 |
| SMH | 27 | 78% | 21 | 71% | -0.02 | -0.02 | -0.45 |
| XRP-USD | 32 | 63% | 20 | 65% | -0.05 | -0.03 | -0.95 |
| XLF | 31 | 74% | 23 | 70% | -0.08 | -0.06 | -1.73 |
| SPY | 25 | 72% | 18 | 67% | -0.11 | -0.08 | -1.94 |
| GLD | 29 | 59% | 17 | 82% | -0.15 | -0.09 | -2.47 |
| XLK | 27 | 81% | 22 | 82% | -0.11 | -0.09 | -2.40 |
| XLV | 21 | 67% | 14 | 64% | -0.14 | -0.09 | -1.99 |
| XLP | 21 | 76% | 16 | 75% | -0.13 | -0.10 | -2.02 |
| MSFT | 23 | 87% | 20 | 75% | -0.11 | -0.10 | -2.23 |
| NVDA | 26 | 62% | 16 | 75% | -0.17 | -0.11 | -2.75 |
| TSLA | 28 | 75% | 21 | 71% | -0.14 | -0.11 | -3.01 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| QQQ | 23 | 87% | 20 | 65% | -0.17 | -0.14 | -3.32 |
| GOOGL | 23 | 87% | 20 | 65% | -0.17 | -0.15 | -3.44 |
| DOGE-USD | 24 | 67% | 16 | 38% | -0.25 | -0.17 | -4.05 |
| AAPL | 26 | 77% | 20 | 65% | -0.22 | -0.17 | -4.43 |
| GC=F | 27 | 67% | 18 | 67% | -0.31 | -0.21 | -5.66 |
| XLE | 32 | 75% | 24 | 58% | -0.33 | -0.25 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
