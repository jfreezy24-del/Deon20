# Edge Report — live signal record

_Generated 2026-10-25_ · **1405** settled signals from 2026-08-17 to 2026-10-24 · 38 open, 58 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (970 of 1405) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.11R per trade taken**, +2.15R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+3.11R**.
- Trades ran **3.80R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 673 | 64% | 431 | 80% | +2.98 | +1.91 | +1284.39 |
| 55–64 | 590 | 72% | 426 | 68% | +4.06 | +2.93 | +1728.48 |
| 65–74 (High) | 127 | 80% | 101 | 66% | +0.03 | +0.02 | +2.98 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.019** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 403 | +4.75 | 1002 | +1.10 | +3.65 | 77% vs 72% |
| `ftfc-aligned` | 300 | +4.32 | 1105 | +1.56 | +2.76 | 70% vs 74% |
| `ftfc-opposed` | 300 | +4.32 | 1105 | +1.56 | +2.76 | 70% vs 74% |
| `base` | 1405 | +2.15 | 0 | +0.00 | +2.15 | 73% vs 0% |
| `rr-poor` | 972 | +2.52 | 433 | +1.31 | +1.21 | 85% vs 38% |
| `close-location` | 728 | +2.39 | 677 | +1.88 | +0.51 | 75% vs 70% |
| `reversal-backed` | 820 | +2.23 | 585 | +2.03 | +0.20 | 78% vs 66% |
| `rr-ok` | 400 | +1.41 | 1005 | +2.44 | -1.04 | 38% vs 84% |
| `rr-strong` | 33 | +0.10 | 1372 | +2.20 | -2.09 | 39% vs 74% |
| `volume` | 285 | +0.05 | 1120 | +2.68 | -2.64 | 65% vs 75% |
| `ftfc-full` | 1104 | +1.56 | 301 | +4.31 | -2.75 | 74% vs 70% |
| `in-force` | 672 | -0.03 | 733 | +4.14 | -4.17 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 418 | 74% | 309 | 78% | -0.03 | -0.02 | -8.18 |
| 2-2 Continuation | 351 | 65% | 229 | 58% | +2.46 | +1.61 | +563.42 |
| 2-1-2 Reversal | 159 | 70% | 112 | 74% | -0.05 | -0.04 | -5.88 |
| 2-1-2 Continuation | 143 | 72% | 103 | 80% | +5.98 | +4.31 | +616.04 |
| Rev Strat (1-2-2) Reversal | 107 | 59% | 63 | 84% | +0.04 | +0.02 | +2.56 |
| 3-2-2 Reversal | 71 | 62% | 44 | 84% | +12.29 | +7.61 | +540.61 |
| 3-1-2 Reversal | 66 | 61% | 40 | 80% | +32.47 | +19.68 | +1298.65 |
| 3-2 Continuation | 55 | 78% | 43 | 72% | +0.12 | +0.09 | +5.00 |
| 1-1-2 Continuation | 35 | 77% | 27 | 70% | +0.15 | +0.12 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 876 | 65% | 573 | 72% | -0.03 | -0.02 | -14.65 |
| W | 392 | 72% | 281 | 78% | +2.04 | +1.46 | +573.37 |
| M | 137 | 85% | 116 | 66% | +21.19 | +17.94 | +2457.65 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1104 | 66% | 729 | 74% | +2.36 | +1.56 | +1720.08 |
| Mixed | 300 | 80% | 241 | 70% | +5.38 | +4.32 | +1296.30 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 584 | 69% | 402 | 66% | +2.96 | +2.04 | +1188.62 |
| Reversal | 821 | 69% | 568 | 78% | +3.22 | +2.23 | +1827.76 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1002 | 69% | 688 | 72% | +1.60 | +1.10 | +1103.41 |
| Inside-bar compression (X-1-?) | 403 | 70% | 282 | 77% | +6.78 | +4.75 | +1912.97 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 57 | 21% | 12 | 100% | +252.89 | +53.24 | +3034.65 |
| TLT | 41 | 73% | 30 | 80% | +0.36 | +0.26 | +10.65 |
| LTC-USD | 25 | 84% | 21 | 86% | +0.29 | +0.24 | +6.11 |
| AMD | 46 | 76% | 35 | 80% | +0.19 | +0.14 | +6.52 |
| XLI | 44 | 66% | 29 | 90% | +0.12 | +0.08 | +3.42 |
| AMZN | 42 | 79% | 33 | 85% | +0.10 | +0.07 | +3.14 |
| DIA | 47 | 83% | 39 | 85% | +0.09 | +0.07 | +3.41 |
| XLK | 46 | 67% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLU | 50 | 76% | 38 | 66% | +0.08 | +0.06 | +2.91 |
| META | 48 | 52% | 25 | 76% | +0.09 | +0.05 | +2.30 |
| XLC | 42 | 81% | 34 | 85% | +0.01 | +0.01 | +0.48 |
| EURUSD=X | 45 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| SMH | 46 | 65% | 30 | 73% | +0.01 | +0.01 | +0.40 |
| BTC-USD | 29 | 93% | 27 | 74% | +0.01 | +0.01 | +0.20 |
| ETH-USD | 31 | 81% | 25 | 72% | +0.00 | +0.00 | +0.10 |
| IWM | 48 | 63% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 49 | 80% | 39 | 72% | -0.01 | -0.01 | -0.55 |
| MSFT | 37 | 81% | 30 | 77% | -0.02 | -0.02 | -0.57 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| HYPE-USD | 30 | 83% | 25 | 56% | -0.06 | -0.05 | -1.58 |
| SPY | 37 | 70% | 26 | 65% | -0.08 | -0.06 | -2.14 |
| AAPL | 39 | 74% | 29 | 72% | -0.09 | -0.07 | -2.63 |
| XLP | 43 | 65% | 28 | 64% | -0.16 | -0.10 | -4.47 |
| DOGE-USD | 36 | 72% | 26 | 50% | -0.15 | -0.10 | -3.78 |
| QQQ | 41 | 73% | 30 | 67% | -0.15 | -0.11 | -4.59 |
| XLV | 41 | 73% | 30 | 67% | -0.16 | -0.12 | -4.79 |
| GC=F | 42 | 64% | 27 | 74% | -0.20 | -0.13 | -5.35 |
| TSLA | 41 | 76% | 31 | 74% | -0.17 | -0.13 | -5.30 |
| XLE | 47 | 74% | 35 | 60% | -0.21 | -0.15 | -7.26 |
| NVDA | 43 | 63% | 27 | 67% | -0.26 | -0.16 | -6.93 |
| GOOGL | 36 | 86% | 31 | 61% | -0.25 | -0.22 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
