# Edge Report — live signal record

_Generated 2026-10-24_ · **1398** settled signals from 2026-08-17 to 2026-10-24 · 34 open, 48 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (969 of 1398) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.11R per trade taken**, +2.16R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+3.11R**.
- Trades ran **3.81R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 668 | 64% | 430 | 80% | +2.99 | +1.92 | +1285.39 |
| 55–64 | 589 | 72% | 426 | 68% | +4.06 | +2.93 | +1728.48 |
| 65–74 (High) | 126 | 80% | 101 | 66% | +0.03 | +0.02 | +2.98 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.018** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 401 | +4.77 | 997 | +1.11 | +3.66 | 77% vs 72% |
| `ftfc-aligned` | 300 | +4.32 | 1098 | +1.57 | +2.75 | 70% vs 74% |
| `ftfc-opposed` | 300 | +4.32 | 1098 | +1.57 | +2.75 | 70% vs 74% |
| `base` | 1398 | +2.16 | 0 | +0.00 | +2.16 | 73% vs 0% |
| `rr-poor` | 968 | +2.53 | 430 | +1.32 | +1.21 | 85% vs 38% |
| `close-location` | 725 | +2.41 | 673 | +1.89 | +0.51 | 75% vs 70% |
| `reversal-backed` | 816 | +2.24 | 582 | +2.04 | +0.20 | 78% vs 66% |
| `rr-ok` | 397 | +1.42 | 1001 | +2.45 | -1.03 | 38% vs 84% |
| `rr-strong` | 33 | +0.10 | 1365 | +2.21 | -2.11 | 39% vs 74% |
| `volume` | 283 | +0.05 | 1115 | +2.69 | -2.65 | 65% vs 75% |
| `ftfc-full` | 1097 | +1.57 | 301 | +4.31 | -2.74 | 74% vs 70% |
| `in-force` | 672 | -0.03 | 726 | +4.18 | -4.21 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 415 | 74% | 309 | 78% | -0.03 | -0.02 | -8.18 |
| 2-2 Continuation | 350 | 65% | 229 | 58% | +2.46 | +1.61 | +563.42 |
| 2-1-2 Reversal | 159 | 70% | 112 | 74% | -0.05 | -0.04 | -5.88 |
| 2-1-2 Continuation | 143 | 72% | 103 | 80% | +5.98 | +4.31 | +616.04 |
| Rev Strat (1-2-2) Reversal | 107 | 59% | 63 | 84% | +0.04 | +0.02 | +2.56 |
| 3-2-2 Reversal | 71 | 62% | 44 | 84% | +12.29 | +7.61 | +540.61 |
| 3-1-2 Reversal | 65 | 62% | 40 | 80% | +32.47 | +19.98 | +1298.65 |
| 3-2 Continuation | 54 | 78% | 42 | 74% | +0.14 | +0.11 | +6.00 |
| 1-1-2 Continuation | 34 | 79% | 27 | 70% | +0.15 | +0.12 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 871 | 66% | 573 | 72% | -0.03 | -0.02 | -14.65 |
| W | 390 | 72% | 280 | 78% | +2.05 | +1.47 | +574.37 |
| M | 137 | 85% | 116 | 66% | +21.19 | +17.94 | +2457.65 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1097 | 66% | 728 | 74% | +2.36 | +1.57 | +1721.08 |
| Mixed | 300 | 80% | 241 | 70% | +5.38 | +4.32 | +1296.30 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 581 | 69% | 401 | 66% | +2.97 | +2.05 | +1189.62 |
| Reversal | 817 | 70% | 568 | 78% | +3.22 | +2.24 | +1827.76 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 997 | 69% | 687 | 72% | +1.61 | +1.11 | +1104.41 |
| Inside-bar compression (X-1-?) | 401 | 70% | 282 | 77% | +6.78 | +4.77 | +1912.97 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 55 | 22% | 12 | 100% | +252.89 | +55.18 | +3034.65 |
| TLT | 40 | 75% | 30 | 80% | +0.36 | +0.27 | +10.65 |
| LTC-USD | 24 | 88% | 21 | 86% | +0.29 | +0.25 | +6.11 |
| AMD | 45 | 78% | 35 | 80% | +0.19 | +0.14 | +6.52 |
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
| IWM | 47 | 64% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 49 | 80% | 39 | 72% | -0.01 | -0.01 | -0.55 |
| MSFT | 37 | 81% | 30 | 77% | -0.02 | -0.02 | -0.57 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| HYPE-USD | 29 | 83% | 24 | 58% | -0.02 | -0.02 | -0.58 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
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
