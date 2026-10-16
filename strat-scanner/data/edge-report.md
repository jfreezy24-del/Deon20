# Edge Report — live signal record

_Generated 2026-10-16_ · **1242** settled signals from 2026-08-17 to 2026-10-16 · 34 open, 48 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (868 of 1242) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.48R per trade taken**, +2.43R per signal published.
- Promised **0.73R** to target 1 on average; delivered **+3.48R**.
- Trades ran **4.17R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 584 | 65% | 378 | 80% | +3.39 | +2.20 | +1282.80 |
| 55–64 | 525 | 73% | 384 | 68% | +4.51 | +3.30 | +1732.80 |
| 65–74 (High) | 118 | 80% | 94 | 65% | +0.01 | +0.01 | +0.75 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.025** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 364 | +5.26 | 878 | +1.26 | +4.00 | 76% vs 72% |
| `ftfc-aligned` | 266 | +4.87 | 976 | +1.76 | +3.10 | 69% vs 74% |
| `ftfc-opposed` | 266 | +4.87 | 976 | +1.76 | +3.10 | 69% vs 74% |
| `base` | 1242 | +2.43 | 0 | +0.00 | +2.43 | 73% vs 0% |
| `rr-poor` | 856 | +2.86 | 386 | +1.46 | +1.40 | 85% vs 38% |
| `close-location` | 658 | +2.65 | 584 | +2.18 | +0.46 | 75% vs 69% |
| `reversal-backed` | 722 | +2.53 | 520 | +2.29 | +0.23 | 78% vs 66% |
| `rr-ok` | 356 | +1.59 | 886 | +2.77 | -1.18 | 38% vs 83% |
| `rr-strong` | 30 | +0.00 | 1212 | +2.49 | -2.49 | 33% vs 74% |
| `volume` | 245 | +0.06 | 997 | +3.01 | -2.95 | 64% vs 75% |
| `ftfc-full` | 975 | +1.77 | 267 | +4.85 | -3.08 | 74% vs 69% |
| `in-force` | 604 | -0.02 | 638 | +4.75 | -4.78 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 362 | 76% | 275 | 77% | -0.05 | -0.04 | -13.27 |
| 2-2 Continuation | 311 | 66% | 204 | 57% | +2.78 | +1.82 | +566.78 |
| 2-1-2 Reversal | 145 | 71% | 103 | 75% | -0.03 | -0.02 | -3.25 |
| 2-1-2 Continuation | 126 | 72% | 91 | 78% | +6.76 | +4.88 | +615.32 |
| Rev Strat (1-2-2) Reversal | 98 | 59% | 58 | 83% | +0.02 | +0.01 | +1.17 |
| 3-1-2 Reversal | 60 | 60% | 36 | 81% | +36.07 | +21.64 | +1298.49 |
| 3-2-2 Reversal | 58 | 62% | 36 | 83% | +15.03 | +9.33 | +541.15 |
| 3-2 Continuation | 49 | 78% | 38 | 79% | +0.17 | +0.13 | +6.33 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 762 | 66% | 504 | 72% | -0.02 | -0.01 | -10.13 |
| W | 351 | 73% | 256 | 79% | +2.25 | +1.64 | +575.82 |
| M | 129 | 84% | 108 | 65% | +22.70 | +19.00 | +2451.17 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 975 | 67% | 656 | 74% | +2.63 | +1.77 | +1722.36 |
| Mixed | 266 | 80% | 212 | 69% | +6.11 | +4.87 | +1294.51 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 519 | 69% | 360 | 66% | +3.31 | +2.30 | +1192.58 |
| Reversal | 723 | 70% | 508 | 78% | +3.59 | +2.52 | +1824.28 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 878 | 70% | 611 | 72% | +1.80 | +1.26 | +1102.15 |
| Inside-bar compression (X-1-?) | 364 | 71% | 257 | 76% | +7.45 | +5.26 | +1914.71 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 52 | 21% | 11 | 100% | +275.81 | +58.34 | +3033.94 |
| LTC-USD | 20 | 85% | 17 | 88% | +0.36 | +0.31 | +6.16 |
| TLT | 37 | 73% | 27 | 78% | +0.34 | +0.25 | +9.26 |
| AMD | 39 | 82% | 32 | 78% | +0.19 | +0.15 | +5.96 |
| XLI | 38 | 68% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| AMZN | 38 | 79% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| DIA | 43 | 81% | 35 | 86% | +0.08 | +0.06 | +2.72 |
| XLU | 42 | 81% | 34 | 62% | +0.06 | +0.05 | +1.95 |
| BTC-USD | 26 | 92% | 24 | 75% | +0.05 | +0.04 | +1.10 |
| ETH-USD | 27 | 78% | 21 | 76% | +0.05 | +0.04 | +1.04 |
| IWM | 41 | 66% | 27 | 74% | +0.05 | +0.03 | +1.23 |
| XLK | 39 | 69% | 27 | 81% | +0.04 | +0.03 | +1.13 |
| SMH | 40 | 65% | 26 | 73% | +0.04 | +0.03 | +1.00 |
| XLC | 37 | 78% | 29 | 90% | +0.02 | +0.02 | +0.70 |
| EURUSD=X | 41 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLF | 46 | 78% | 36 | 72% | +0.01 | +0.00 | +0.19 |
| GLD | 40 | 68% | 27 | 81% | -0.00 | -0.00 | -0.08 |
| SOL-USD | 31 | 77% | 24 | 67% | -0.02 | -0.01 | -0.38 |
| XRP-USD | 38 | 63% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| MSFT | 31 | 84% | 26 | 77% | -0.04 | -0.03 | -1.06 |
| SPY | 31 | 74% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| HYPE-USD | 25 | 80% | 20 | 55% | -0.06 | -0.05 | -1.18 |
| AAPL | 35 | 77% | 27 | 70% | -0.11 | -0.08 | -2.88 |
| XLY | 34 | 88% | 30 | 77% | -0.11 | -0.10 | -3.41 |
| DOGE-USD | 33 | 70% | 23 | 48% | -0.15 | -0.10 | -3.34 |
| TSLA | 36 | 75% | 27 | 74% | -0.14 | -0.10 | -3.68 |
| XLP | 38 | 71% | 27 | 63% | -0.17 | -0.12 | -4.47 |
| GC=F | 38 | 66% | 25 | 72% | -0.22 | -0.14 | -5.39 |
| QQQ | 34 | 76% | 26 | 62% | -0.19 | -0.14 | -4.84 |
| XLV | 35 | 80% | 28 | 64% | -0.19 | -0.15 | -5.22 |
| NVDA | 38 | 66% | 25 | 64% | -0.30 | -0.20 | -7.41 |
| XLE | 41 | 73% | 30 | 60% | -0.27 | -0.20 | -8.03 |
| GOOGL | 33 | 85% | 28 | 61% | -0.26 | -0.22 | -7.23 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
