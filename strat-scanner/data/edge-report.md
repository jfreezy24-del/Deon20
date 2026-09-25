# Edge Report — live signal record

_Generated 2026-09-25_ · **813** settled signals from 2026-08-17 to 2026-09-25 · 32 open, 22 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (570 of 813) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy +5.28R per trade taken**, +3.70R per signal published.
- Promised **0.78R** to target 1 on average; delivered **+5.28R**.
- Trades ran **6.00R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 362 | 65% | 235 | 80% | +5.46 | +3.55 | +1283.30 |
| 55–64 | 345 | 73% | 253 | 70% | +6.84 | +5.01 | +1729.66 |
| 65–74 (High) | 94 | 78% | 73 | 63% | -0.04 | -0.03 | -3.20 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.030** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 252 | +7.58 | 561 | +1.96 | +5.61 | 74% vs 73% |
| `ftfc-aligned` | 166 | +7.79 | 647 | +2.66 | +5.13 | 68% vs 74% |
| `ftfc-opposed` | 166 | +7.79 | 647 | +2.66 | +5.13 | 68% vs 74% |
| `base` | 813 | +3.70 | 0 | +0.00 | +3.70 | 73% vs 0% |
| `rr-poor` | 555 | +4.42 | 258 | +2.17 | +2.25 | 84% vs 37% |
| `reversal-backed` | 465 | +3.93 | 348 | +3.40 | +0.53 | 78% vs 66% |
| `close-location` | 444 | +3.90 | 369 | +3.46 | +0.44 | 75% vs 70% |
| `rr-ok` | 239 | +2.33 | 574 | +4.27 | -1.94 | 37% vs 83% |
| `rr-strong` | 19 | +0.13 | 794 | +3.79 | -3.66 | 43% vs 74% |
| `volume` | 170 | +0.07 | 643 | +4.67 | -4.60 | 68% vs 74% |
| `ftfc-full` | 646 | +2.66 | 167 | +7.74 | -5.08 | 74% vs 68% |
| `in-force` | 392 | -0.03 | 421 | +7.18 | -7.21 | 76% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 226 | 73% | 165 | 78% | -0.06 | -0.04 | -9.44 |
| 2-2 Continuation | 208 | 64% | 133 | 59% | +4.25 | +2.71 | +564.71 |
| 2-1-2 Reversal | 97 | 74% | 72 | 75% | -0.03 | -0.02 | -2.31 |
| 2-1-2 Continuation | 86 | 78% | 67 | 72% | +9.11 | +7.10 | +610.55 |
| Rev Strat (1-2-2) Reversal | 62 | 66% | 41 | 83% | +0.07 | +0.05 | +2.91 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 34 | 68% | 23 | 78% | +23.45 | +15.86 | +539.25 |
| 3-2 Continuation | 31 | 71% | 22 | 86% | +0.22 | +0.16 | +4.82 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 494 | 66% | 327 | 72% | -0.03 | -0.02 | -10.40 |
| W | 227 | 75% | 170 | 78% | +3.34 | +2.50 | +567.48 |
| M | 92 | 79% | 73 | 67% | +33.62 | +26.68 | +2454.20 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 646 | 68% | 437 | 74% | +3.93 | +2.66 | +1718.27 |
| Mixed | 166 | 80% | 133 | 68% | +9.72 | +7.79 | +1293.00 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 347 | 69% | 241 | 66% | +4.91 | +3.41 | +1183.28 |
| Reversal | 466 | 71% | 329 | 78% | +5.56 | +3.92 | +1827.99 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 561 | 68% | 384 | 73% | +2.87 | +1.96 | +1102.24 |
| Inside-bar compression (X-1-?) | 252 | 74% | 186 | 74% | +10.26 | +7.58 | +1909.03 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 34 | 24% | 8 | 100% | +378.99 | +89.17 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 26 | 92% | 24 | 83% | +0.32 | +0.29 | +7.61 |
| DIA | 32 | 78% | 25 | 88% | +0.21 | +0.17 | +5.36 |
| XLU | 30 | 87% | 26 | 69% | +0.18 | +0.15 | +4.60 |
| META | 28 | 64% | 18 | 83% | +0.23 | +0.15 | +4.14 |
| ETH-USD | 17 | 82% | 14 | 79% | +0.17 | +0.14 | +2.37 |
| XLI | 27 | 59% | 16 | 88% | +0.21 | +0.12 | +3.32 |
| AMZN | 24 | 79% | 19 | 89% | +0.14 | +0.11 | +2.69 |
| IWM | 27 | 59% | 16 | 75% | +0.15 | +0.09 | +2.35 |
| GLD | 25 | 56% | 14 | 86% | +0.06 | +0.03 | +0.83 |
| EURUSD=X | 26 | 12% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLC | 23 | 83% | 19 | 84% | -0.01 | -0.01 | -0.16 |
| XLY | 17 | 82% | 14 | 86% | -0.02 | -0.01 | -0.23 |
| BTC-USD | 20 | 90% | 18 | 67% | -0.02 | -0.02 | -0.34 |
| XRP-USD | 30 | 60% | 18 | 61% | -0.07 | -0.04 | -1.21 |
| TSLA | 24 | 71% | 17 | 76% | -0.09 | -0.06 | -1.55 |
| MSFT | 19 | 89% | 17 | 76% | -0.07 | -0.07 | -1.26 |
| NVDA | 25 | 60% | 15 | 80% | -0.12 | -0.07 | -1.75 |
| XLF | 28 | 71% | 20 | 70% | -0.12 | -0.08 | -2.34 |
| SMH | 23 | 78% | 18 | 72% | -0.11 | -0.09 | -2.01 |
| XLV | 20 | 70% | 14 | 64% | -0.14 | -0.10 | -1.99 |
| XLP | 20 | 80% | 16 | 75% | -0.13 | -0.10 | -2.02 |
| SPY | 22 | 68% | 15 | 67% | -0.16 | -0.11 | -2.40 |
| XLK | 24 | 83% | 20 | 80% | -0.15 | -0.13 | -3.04 |
| HYPE-USD | 20 | 80% | 16 | 44% | -0.19 | -0.15 | -3.02 |
| TLT | 23 | 61% | 14 | 64% | -0.26 | -0.16 | -3.68 |
| SOL-USD | 23 | 74% | 17 | 59% | -0.22 | -0.17 | -3.81 |
| GOOGL | 21 | 90% | 19 | 63% | -0.18 | -0.17 | -3.50 |
| DOGE-USD | 22 | 68% | 15 | 40% | -0.25 | -0.17 | -3.70 |
| AAPL | 22 | 73% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| QQQ | 19 | 84% | 16 | 69% | -0.27 | -0.22 | -4.27 |
| XLE | 31 | 74% | 23 | 57% | -0.34 | -0.25 | -7.86 |
| GC=F | 25 | 64% | 16 | 63% | -0.41 | -0.26 | -6.48 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
