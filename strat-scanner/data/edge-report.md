# Edge Report — live signal record

_Generated 2026-10-28_ · **1450** settled signals from 2026-08-17 to 2026-10-28 · 44 open, 51 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (983 of 1450) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.07R per trade taken**, +2.08R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+3.07R**.
- Trades ran **3.76R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 698 | 63% | 437 | 80% | +2.94 | +1.84 | +1282.80 |
| 55–64 | 603 | 72% | 432 | 68% | +4.01 | +2.87 | +1733.53 |
| 65–74 (High) | 134 | 76% | 102 | 67% | +0.03 | +0.02 | +3.34 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.029** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 423 | +4.52 | 1027 | +1.08 | +3.44 | 77% vs 72% |
| `ftfc-aligned` | 313 | +4.14 | 1137 | +1.52 | +2.62 | 70% vs 74% |
| `ftfc-opposed` | 313 | +4.14 | 1137 | +1.52 | +2.62 | 70% vs 74% |
| `base` | 1450 | +2.08 | 0 | +0.00 | +2.08 | 73% vs 0% |
| `rr-poor` | 996 | +2.46 | 454 | +1.25 | +1.21 | 85% vs 38% |
| `close-location` | 745 | +2.34 | 705 | +1.81 | +0.53 | 75% vs 70% |
| `reversal-backed` | 844 | +2.17 | 606 | +1.96 | +0.20 | 78% vs 66% |
| `rr-ok` | 420 | +1.34 | 1030 | +2.38 | -1.04 | 38% vs 84% |
| `rr-strong` | 34 | +0.10 | 1416 | +2.13 | -2.03 | 39% vs 74% |
| `volume` | 289 | +0.05 | 1161 | +2.59 | -2.54 | 65% vs 75% |
| `ftfc-full` | 1136 | +1.52 | 314 | +4.13 | -2.61 | 74% vs 70% |
| `in-force` | 682 | -0.02 | 768 | +3.95 | -3.97 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 424 | 74% | 312 | 78% | -0.02 | -0.02 | -7.03 |
| 2-2 Continuation | 364 | 64% | 233 | 59% | +2.43 | +1.55 | +565.58 |
| 2-1-2 Reversal | 172 | 66% | 114 | 75% | -0.04 | -0.03 | -5.12 |
| 2-1-2 Continuation | 148 | 70% | 104 | 80% | +5.93 | +4.16 | +616.42 |
| Rev Strat (1-2-2) Reversal | 108 | 58% | 63 | 84% | +0.04 | +0.02 | +2.56 |
| 3-2-2 Reversal | 75 | 61% | 46 | 85% | +11.76 | +7.21 | +540.98 |
| 3-1-2 Reversal | 66 | 61% | 40 | 80% | +32.47 | +19.68 | +1298.65 |
| 3-2 Continuation | 56 | 77% | 43 | 72% | +0.12 | +0.09 | +5.00 |
| 1-1-2 Continuation | 37 | 76% | 28 | 68% | +0.11 | +0.09 | +3.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 911 | 64% | 584 | 73% | -0.02 | -0.01 | -10.19 |
| W | 400 | 71% | 282 | 78% | +2.03 | +1.43 | +573.73 |
| M | 139 | 84% | 117 | 66% | +21.00 | +17.67 | +2456.65 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1136 | 65% | 737 | 74% | +2.34 | +1.52 | +1724.26 |
| Mixed | 313 | 79% | 246 | 70% | +5.27 | +4.14 | +1295.94 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 605 | 67% | 408 | 66% | +2.92 | +1.97 | +1190.16 |
| Reversal | 845 | 68% | 575 | 78% | +3.18 | +2.17 | +1830.04 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1027 | 68% | 697 | 72% | +1.59 | +1.08 | +1107.10 |
| Inside-bar compression (X-1-?) | 423 | 68% | 286 | 77% | +6.69 | +4.52 | +1913.11 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 61 | 20% | 12 | 100% | +252.89 | +49.75 | +3034.65 |
| TLT | 43 | 70% | 30 | 80% | +0.36 | +0.25 | +10.65 |
| LTC-USD | 26 | 81% | 21 | 86% | +0.29 | +0.23 | +6.11 |
| AMD | 47 | 74% | 35 | 80% | +0.19 | +0.14 | +6.52 |
| XLI | 47 | 66% | 31 | 90% | +0.14 | +0.09 | +4.33 |
| AMZN | 42 | 79% | 33 | 85% | +0.10 | +0.07 | +3.14 |
| DIA | 47 | 83% | 39 | 85% | +0.09 | +0.07 | +3.41 |
| XLK | 47 | 66% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLU | 51 | 75% | 38 | 66% | +0.08 | +0.06 | +2.91 |
| META | 49 | 51% | 25 | 76% | +0.09 | +0.05 | +2.30 |
| XLC | 45 | 78% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| EURUSD=X | 48 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| SMH | 47 | 64% | 30 | 73% | +0.01 | +0.01 | +0.40 |
| IWM | 50 | 62% | 31 | 71% | +0.01 | +0.01 | +0.42 |
| BTC-USD | 31 | 87% | 27 | 74% | +0.01 | +0.01 | +0.20 |
| ETH-USD | 32 | 78% | 25 | 72% | +0.00 | +0.00 | +0.10 |
| XLF | 50 | 80% | 40 | 73% | -0.00 | -0.00 | -0.16 |
| MSFT | 38 | 82% | 31 | 77% | -0.01 | -0.01 | -0.20 |
| SOL-USD | 34 | 74% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| XRP-USD | 40 | 65% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| HYPE-USD | 31 | 81% | 25 | 56% | -0.06 | -0.05 | -1.58 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| AAPL | 40 | 73% | 29 | 72% | -0.09 | -0.07 | -2.63 |
| SPY | 38 | 71% | 27 | 63% | -0.12 | -0.08 | -3.14 |
| DOGE-USD | 38 | 71% | 27 | 52% | -0.13 | -0.09 | -3.38 |
| XLP | 45 | 62% | 28 | 64% | -0.16 | -0.10 | -4.47 |
| QQQ | 42 | 74% | 31 | 68% | -0.15 | -0.11 | -4.57 |
| XLV | 41 | 73% | 30 | 67% | -0.16 | -0.12 | -4.79 |
| GC=F | 44 | 61% | 27 | 74% | -0.20 | -0.12 | -5.35 |
| TSLA | 42 | 76% | 32 | 75% | -0.17 | -0.13 | -5.30 |
| NVDA | 44 | 64% | 28 | 68% | -0.20 | -0.13 | -5.68 |
| XLE | 47 | 74% | 35 | 60% | -0.21 | -0.15 | -7.26 |
| GOOGL | 38 | 84% | 32 | 63% | -0.20 | -0.17 | -6.36 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
