# Edge Report — live signal record

_Generated 2026-10-17_ · **1261** settled signals from 2026-08-17 to 2026-10-17 · 36 open, 48 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (877 of 1261) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.44R per trade taken**, +2.39R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+3.44R**.
- Trades ran **4.14R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 598 | 64% | 384 | 80% | +3.35 | +2.15 | +1284.50 |
| 55–64 | 530 | 73% | 387 | 68% | +4.47 | +3.26 | +1729.42 |
| 65–74 (High) | 118 | 80% | 94 | 65% | +0.01 | +0.01 | +0.75 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.022** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 367 | +5.21 | 894 | +1.23 | +3.98 | 76% vs 72% |
| `ftfc-aligned` | 268 | +4.84 | 993 | +1.73 | +3.10 | 69% vs 74% |
| `ftfc-opposed` | 268 | +4.84 | 993 | +1.73 | +3.10 | 69% vs 74% |
| `base` | 1261 | +2.39 | 0 | +0.00 | +2.39 | 73% vs 0% |
| `rr-poor` | 873 | +2.80 | 388 | +1.46 | +1.34 | 84% vs 38% |
| `close-location` | 664 | +2.62 | 597 | +2.13 | +0.49 | 75% vs 69% |
| `reversal-backed` | 735 | +2.48 | 526 | +2.27 | +0.22 | 78% vs 66% |
| `rr-ok` | 358 | +1.58 | 903 | +2.71 | -1.13 | 38% vs 83% |
| `rr-strong` | 30 | +0.00 | 1231 | +2.45 | -2.45 | 33% vs 74% |
| `volume` | 255 | +0.05 | 1006 | +2.98 | -2.93 | 64% vs 75% |
| `ftfc-full` | 992 | +1.73 | 269 | +4.82 | -3.08 | 74% vs 69% |
| `in-force` | 610 | -0.03 | 651 | +4.66 | -4.69 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 372 | 75% | 278 | 77% | -0.05 | -0.04 | -13.94 |
| 2-2 Continuation | 315 | 66% | 207 | 58% | +2.74 | +1.80 | +566.89 |
| 2-1-2 Reversal | 146 | 71% | 104 | 75% | -0.03 | -0.02 | -3.19 |
| 2-1-2 Continuation | 127 | 72% | 92 | 77% | +6.67 | +4.83 | +614.01 |
| Rev Strat (1-2-2) Reversal | 98 | 59% | 58 | 83% | +0.02 | +0.01 | +1.17 |
| 3-1-2 Reversal | 61 | 59% | 36 | 81% | +36.07 | +21.29 | +1298.49 |
| 3-2-2 Reversal | 59 | 61% | 36 | 83% | +15.03 | +9.17 | +541.15 |
| 3-2 Continuation | 50 | 78% | 39 | 79% | +0.17 | +0.13 | +6.46 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 776 | 66% | 510 | 72% | -0.02 | -0.02 | -11.96 |
| W | 354 | 73% | 257 | 78% | +2.24 | +1.62 | +574.51 |
| M | 131 | 84% | 110 | 65% | +22.30 | +18.72 | +2452.64 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 992 | 67% | 663 | 74% | +2.59 | +1.73 | +1719.22 |
| Mixed | 268 | 80% | 214 | 69% | +6.06 | +4.84 | +1295.97 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 525 | 70% | 365 | 66% | +3.26 | +2.27 | +1191.51 |
| Reversal | 736 | 70% | 512 | 78% | +3.56 | +2.48 | +1823.67 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 894 | 69% | 618 | 72% | +1.78 | +1.23 | +1101.73 |
| Inside-bar compression (X-1-?) | 367 | 71% | 259 | 76% | +7.39 | +5.21 | +1913.46 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 52 | 21% | 11 | 100% | +275.81 | +58.34 | +3033.94 |
| LTC-USD | 20 | 85% | 17 | 88% | +0.36 | +0.31 | +6.16 |
| TLT | 37 | 73% | 27 | 78% | +0.34 | +0.25 | +9.26 |
| AMD | 41 | 80% | 33 | 79% | +0.18 | +0.15 | +6.03 |
| XLI | 39 | 67% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| AMZN | 38 | 79% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| DIA | 43 | 81% | 35 | 86% | +0.08 | +0.06 | +2.72 |
| XLU | 43 | 79% | 34 | 62% | +0.06 | +0.05 | +1.95 |
| BTC-USD | 26 | 92% | 24 | 75% | +0.05 | +0.04 | +1.10 |
| ETH-USD | 27 | 78% | 21 | 76% | +0.05 | +0.04 | +1.04 |
| XLK | 40 | 68% | 27 | 81% | +0.04 | +0.03 | +1.13 |
| SMH | 41 | 63% | 26 | 73% | +0.04 | +0.02 | +1.00 |
| EURUSD=X | 41 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLF | 46 | 78% | 36 | 72% | +0.01 | +0.00 | +0.19 |
| GLD | 42 | 67% | 28 | 82% | -0.00 | -0.00 | -0.06 |
| SOL-USD | 31 | 77% | 24 | 67% | -0.02 | -0.01 | -0.38 |
| XRP-USD | 38 | 63% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| XLC | 38 | 79% | 30 | 87% | -0.02 | -0.02 | -0.61 |
| IWM | 43 | 67% | 29 | 69% | -0.03 | -0.02 | -0.85 |
| MSFT | 31 | 84% | 26 | 77% | -0.04 | -0.03 | -1.06 |
| SPY | 33 | 70% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| HYPE-USD | 25 | 80% | 20 | 55% | -0.06 | -0.05 | -1.18 |
| XLY | 35 | 89% | 31 | 77% | -0.06 | -0.06 | -2.00 |
| AAPL | 36 | 78% | 28 | 71% | -0.10 | -0.08 | -2.74 |
| TSLA | 37 | 76% | 28 | 75% | -0.13 | -0.10 | -3.62 |
| DOGE-USD | 33 | 70% | 23 | 48% | -0.15 | -0.10 | -3.34 |
| XLP | 39 | 69% | 27 | 63% | -0.17 | -0.11 | -4.47 |
| QQQ | 36 | 75% | 27 | 63% | -0.18 | -0.13 | -4.81 |
| GC=F | 38 | 66% | 25 | 72% | -0.22 | -0.14 | -5.39 |
| XLV | 35 | 80% | 28 | 64% | -0.19 | -0.15 | -5.22 |
| NVDA | 38 | 66% | 25 | 64% | -0.30 | -0.20 | -7.41 |
| XLE | 41 | 73% | 30 | 60% | -0.27 | -0.20 | -8.03 |
| GOOGL | 33 | 85% | 28 | 61% | -0.26 | -0.22 | -7.23 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
