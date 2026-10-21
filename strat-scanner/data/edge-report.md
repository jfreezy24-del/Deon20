# Edge Report — live signal record

_Generated 2026-10-21_ · **1323** settled signals from 2026-08-17 to 2026-10-21 · 36 open, 56 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (909 of 1323) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.32R per trade taken**, +2.28R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+3.32R**.
- Trades ran **4.01R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 629 | 64% | 401 | 80% | +3.20 | +2.04 | +1284.07 |
| 55–64 | 554 | 71% | 396 | 68% | +4.37 | +3.12 | +1728.62 |
| 65–74 (High) | 125 | 80% | 100 | 66% | +0.02 | +0.01 | +1.68 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.018** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 383 | +5.00 | 940 | +1.17 | +3.82 | 76% vs 72% |
| `ftfc-aligned` | 281 | +4.61 | 1042 | +1.65 | +2.96 | 69% vs 74% |
| `ftfc-opposed` | 281 | +4.61 | 1042 | +1.65 | +2.96 | 69% vs 74% |
| `base` | 1323 | +2.28 | 0 | +0.00 | +2.28 | 73% vs 0% |
| `rr-poor` | 915 | +2.68 | 408 | +1.38 | +1.29 | 85% vs 37% |
| `close-location` | 697 | +2.50 | 626 | +2.03 | +0.47 | 75% vs 69% |
| `reversal-backed` | 771 | +2.37 | 552 | +2.16 | +0.21 | 78% vs 66% |
| `rr-ok` | 377 | +1.50 | 946 | +2.59 | -1.09 | 37% vs 83% |
| `rr-strong` | 31 | +0.00 | 1292 | +2.33 | -2.33 | 33% vs 74% |
| `volume` | 270 | +0.05 | 1053 | +2.85 | -2.80 | 64% vs 75% |
| `ftfc-full` | 1041 | +1.65 | 282 | +4.59 | -2.94 | 74% vs 69% |
| `in-force` | 637 | -0.02 | 686 | +4.42 | -4.44 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 394 | 74% | 291 | 77% | -0.04 | -0.03 | -12.65 |
| 2-2 Continuation | 330 | 64% | 212 | 58% | +2.67 | +1.71 | +565.58 |
| 2-1-2 Reversal | 150 | 71% | 106 | 75% | -0.04 | -0.03 | -4.19 |
| 2-1-2 Continuation | 134 | 72% | 96 | 78% | +6.40 | +4.59 | +614.84 |
| Rev Strat (1-2-2) Reversal | 100 | 59% | 59 | 83% | +0.02 | +0.01 | +1.42 |
| 3-1-2 Reversal | 65 | 62% | 40 | 80% | +32.47 | +19.98 | +1298.65 |
| 3-2-2 Reversal | 63 | 59% | 37 | 84% | +14.63 | +8.59 | +541.23 |
| 3-2 Continuation | 53 | 77% | 41 | 76% | +0.14 | +0.11 | +5.86 |
| 1-1-2 Continuation | 34 | 79% | 27 | 70% | +0.15 | +0.12 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 827 | 65% | 540 | 72% | -0.02 | -0.01 | -12.27 |
| W | 365 | 71% | 259 | 78% | +2.22 | +1.57 | +574.53 |
| M | 131 | 84% | 110 | 65% | +22.30 | +18.72 | +2452.64 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1041 | 66% | 684 | 74% | +2.51 | +1.65 | +1719.71 |
| Mixed | 281 | 80% | 225 | 69% | +5.76 | +4.61 | +1295.19 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 551 | 68% | 376 | 66% | +3.17 | +2.16 | +1190.44 |
| Reversal | 772 | 69% | 533 | 78% | +3.42 | +2.36 | +1824.46 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 940 | 68% | 640 | 72% | +1.72 | +1.17 | +1101.44 |
| Inside-bar compression (X-1-?) | 383 | 70% | 269 | 76% | +7.11 | +5.00 | +1913.46 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 54 | 20% | 11 | 100% | +275.81 | +56.18 | +3033.94 |
| LTC-USD | 23 | 87% | 20 | 85% | +0.30 | +0.26 | +6.08 |
| TLT | 38 | 74% | 28 | 79% | +0.34 | +0.25 | +9.58 |
| AMD | 43 | 77% | 33 | 79% | +0.18 | +0.14 | +6.03 |
| XLI | 41 | 63% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| DIA | 44 | 82% | 36 | 86% | +0.09 | +0.07 | +3.19 |
| AMZN | 38 | 79% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| XLU | 45 | 78% | 35 | 63% | +0.06 | +0.05 | +2.24 |
| XLK | 41 | 66% | 27 | 81% | +0.04 | +0.03 | +1.13 |
| SMH | 43 | 63% | 27 | 74% | +0.04 | +0.02 | +1.02 |
| EURUSD=X | 43 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLF | 47 | 79% | 37 | 73% | +0.01 | +0.01 | +0.48 |
| BTC-USD | 28 | 93% | 26 | 73% | +0.01 | +0.01 | +0.18 |
| GLD | 44 | 68% | 30 | 83% | +0.00 | +0.00 | +0.07 |
| IWM | 45 | 67% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| ETH-USD | 30 | 80% | 24 | 71% | -0.01 | -0.01 | -0.21 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLC | 38 | 79% | 30 | 87% | -0.02 | -0.02 | -0.61 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| MSFT | 32 | 84% | 27 | 78% | -0.03 | -0.03 | -0.82 |
| HYPE-USD | 28 | 82% | 23 | 57% | -0.04 | -0.03 | -0.89 |
| XLY | 37 | 86% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| SPY | 35 | 69% | 24 | 63% | -0.09 | -0.06 | -2.18 |
| AAPL | 38 | 74% | 28 | 71% | -0.10 | -0.07 | -2.74 |
| TSLA | 39 | 74% | 29 | 76% | -0.12 | -0.09 | -3.61 |
| XLP | 42 | 64% | 27 | 63% | -0.17 | -0.11 | -4.47 |
| DOGE-USD | 35 | 71% | 25 | 48% | -0.17 | -0.12 | -4.16 |
| XLV | 39 | 74% | 29 | 66% | -0.17 | -0.13 | -4.97 |
| GC=F | 42 | 64% | 27 | 74% | -0.20 | -0.13 | -5.35 |
| QQQ | 37 | 73% | 27 | 63% | -0.18 | -0.13 | -4.81 |
| XLE | 43 | 72% | 31 | 61% | -0.24 | -0.17 | -7.48 |
| NVDA | 41 | 61% | 25 | 64% | -0.30 | -0.18 | -7.41 |
| GOOGL | 34 | 85% | 29 | 62% | -0.24 | -0.21 | -7.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
