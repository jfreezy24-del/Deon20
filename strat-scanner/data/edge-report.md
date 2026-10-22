# Edge Report — live signal record

_Generated 2026-10-22_ · **1347** settled signals from 2026-08-17 to 2026-10-22 · 40 open, 55 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (928 of 1347) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.25R per trade taken**, +2.24R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+3.25R**.
- Trades ran **3.94R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 642 | 64% | 410 | 80% | +3.13 | +2.00 | +1282.44 |
| 55–64 | 564 | 72% | 405 | 68% | +4.27 | +3.07 | +1728.80 |
| 65–74 (High) | 126 | 80% | 101 | 66% | +0.03 | +0.02 | +2.98 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.022** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 392 | +4.88 | 955 | +1.15 | +3.73 | 76% vs 72% |
| `ftfc-aligned` | 293 | +4.42 | 1054 | +1.63 | +2.79 | 70% vs 74% |
| `ftfc-opposed` | 293 | +4.42 | 1054 | +1.63 | +2.79 | 70% vs 74% |
| `base` | 1347 | +2.24 | 0 | +0.00 | +2.24 | 73% vs 0% |
| `rr-poor` | 937 | +2.61 | 410 | +1.38 | +1.23 | 85% vs 37% |
| `close-location` | 705 | +2.47 | 642 | +1.98 | +0.50 | 76% vs 70% |
| `reversal-backed` | 793 | +2.30 | 554 | +2.15 | +0.15 | 78% vs 66% |
| `rr-ok` | 379 | +1.49 | 968 | +2.53 | -1.04 | 38% vs 83% |
| `rr-strong` | 31 | +0.00 | 1316 | +2.29 | -2.29 | 33% vs 74% |
| `volume` | 273 | +0.05 | 1074 | +2.79 | -2.74 | 65% vs 75% |
| `ftfc-full` | 1053 | +1.63 | 294 | +4.40 | -2.77 | 74% vs 70% |
| `in-force` | 650 | -0.02 | 697 | +4.35 | -4.37 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 402 | 74% | 297 | 77% | -0.04 | -0.03 | -12.06 |
| 2-2 Continuation | 330 | 64% | 212 | 58% | +2.67 | +1.71 | +565.58 |
| 2-1-2 Reversal | 157 | 70% | 110 | 75% | -0.05 | -0.03 | -5.02 |
| 2-1-2 Continuation | 136 | 72% | 98 | 79% | +6.27 | +4.52 | +614.92 |
| Rev Strat (1-2-2) Reversal | 103 | 60% | 62 | 84% | +0.04 | +0.02 | +2.38 |
| 3-2-2 Reversal | 67 | 61% | 41 | 83% | +13.18 | +8.06 | +540.28 |
| 3-1-2 Reversal | 65 | 62% | 40 | 80% | +32.47 | +19.98 | +1298.65 |
| 3-2 Continuation | 53 | 77% | 41 | 76% | +0.14 | +0.11 | +5.86 |
| 1-1-2 Continuation | 34 | 79% | 27 | 70% | +0.15 | +0.12 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 843 | 65% | 552 | 72% | -0.02 | -0.02 | -12.97 |
| W | 371 | 71% | 264 | 79% | +2.18 | +1.55 | +574.78 |
| M | 133 | 84% | 112 | 65% | +21.90 | +18.44 | +2452.94 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1053 | 66% | 694 | 74% | +2.48 | +1.63 | +1719.71 |
| Mixed | 293 | 80% | 234 | 70% | +5.53 | +4.42 | +1295.04 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 553 | 68% | 378 | 66% | +3.15 | +2.15 | +1190.52 |
| Reversal | 794 | 69% | 550 | 78% | +3.32 | +2.30 | +1824.23 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 955 | 68% | 653 | 72% | +1.69 | +1.15 | +1102.04 |
| Inside-bar compression (X-1-?) | 392 | 70% | 275 | 76% | +6.96 | +4.88 | +1912.71 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 55 | 22% | 12 | 100% | +252.89 | +55.18 | +3034.65 |
| LTC-USD | 24 | 88% | 21 | 86% | +0.29 | +0.25 | +6.11 |
| TLT | 38 | 74% | 28 | 79% | +0.34 | +0.25 | +9.58 |
| AMD | 43 | 77% | 33 | 79% | +0.18 | +0.14 | +6.03 |
| XLI | 41 | 63% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| DIA | 45 | 82% | 37 | 86% | +0.12 | +0.10 | +4.49 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| AMZN | 39 | 77% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| XLU | 45 | 78% | 35 | 63% | +0.06 | +0.05 | +2.24 |
| XLK | 43 | 65% | 28 | 82% | +0.04 | +0.03 | +1.23 |
| SMH | 43 | 63% | 27 | 74% | +0.04 | +0.02 | +1.02 |
| EURUSD=X | 44 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| BTC-USD | 29 | 93% | 27 | 74% | +0.01 | +0.01 | +0.20 |
| GLD | 45 | 69% | 31 | 84% | +0.00 | +0.00 | +0.14 |
| IWM | 45 | 67% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| ETH-USD | 30 | 80% | 24 | 71% | -0.01 | -0.01 | -0.21 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 49 | 80% | 39 | 72% | -0.01 | -0.01 | -0.55 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| HYPE-USD | 29 | 83% | 24 | 58% | -0.02 | -0.02 | -0.58 |
| MSFT | 32 | 84% | 27 | 78% | -0.03 | -0.03 | -0.82 |
| XLC | 40 | 80% | 32 | 84% | -0.06 | -0.05 | -1.99 |
| XLY | 38 | 84% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| SPY | 36 | 69% | 25 | 64% | -0.09 | -0.06 | -2.14 |
| AAPL | 38 | 74% | 28 | 71% | -0.10 | -0.07 | -2.74 |
| TSLA | 40 | 75% | 30 | 77% | -0.12 | -0.09 | -3.56 |
| DOGE-USD | 36 | 72% | 26 | 50% | -0.15 | -0.10 | -3.78 |
| XLP | 42 | 64% | 27 | 63% | -0.17 | -0.11 | -4.47 |
| QQQ | 40 | 73% | 29 | 66% | -0.16 | -0.11 | -4.59 |
| XLV | 39 | 74% | 29 | 66% | -0.17 | -0.13 | -4.97 |
| GC=F | 42 | 64% | 27 | 74% | -0.20 | -0.13 | -5.35 |
| XLE | 44 | 73% | 32 | 63% | -0.23 | -0.17 | -7.47 |
| NVDA | 42 | 62% | 26 | 65% | -0.29 | -0.18 | -7.41 |
| GOOGL | 35 | 86% | 30 | 60% | -0.27 | -0.23 | -8.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
