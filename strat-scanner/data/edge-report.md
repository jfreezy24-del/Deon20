# Edge Report — live signal record

_Generated 2026-10-05_ · **1004** settled signals from 2026-08-17 to 2026-10-04 · 25 open, 48 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (693 of 1004) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.36R per trade taken**, +3.01R per signal published.
- Promised **0.75R** to target 1 on average; delivered **+4.36R**.
- Trades ran **5.06R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 472 | 64% | 300 | 79% | +4.28 | +2.72 | +1284.71 |
| 55–64 | 419 | 73% | 304 | 69% | +5.71 | +4.14 | +1735.15 |
| 65–74 (High) | 101 | 79% | 80 | 63% | -0.03 | -0.02 | -2.20 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.028** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 303 | +6.30 | 701 | +1.58 | +4.72 | 74% vs 72% |
| `ftfc-aligned` | 220 | +5.89 | 784 | +2.20 | +3.70 | 68% vs 74% |
| `ftfc-opposed` | 220 | +5.89 | 784 | +2.20 | +3.70 | 68% vs 74% |
| `base` | 1004 | +3.01 | 0 | +0.00 | +3.01 | 73% vs 0% |
| `rr-poor` | 690 | +3.54 | 314 | +1.83 | +1.71 | 84% vs 39% |
| `close-location` | 529 | +3.29 | 475 | +2.69 | +0.60 | 75% vs 70% |
| `reversal-backed` | 574 | +3.17 | 430 | +2.78 | +0.39 | 77% vs 67% |
| `rr-ok` | 292 | +1.96 | 712 | +3.43 | -1.47 | 39% vs 82% |
| `rr-strong` | 22 | +0.08 | 982 | +3.07 | -3.00 | 38% vs 74% |
| `ftfc-full` | 783 | +2.20 | 221 | +5.87 | -3.67 | 74% vs 68% |
| `volume` | 218 | +0.07 | 786 | +3.82 | -3.75 | 64% vs 75% |
| `in-force` | 482 | -0.02 | 522 | +5.81 | -5.83 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 285 | 72% | 206 | 77% | -0.06 | -0.04 | -11.89 |
| 2-2 Continuation | 257 | 65% | 168 | 58% | +3.42 | +2.23 | +574.39 |
| 2-1-2 Reversal | 114 | 69% | 79 | 71% | -0.08 | -0.06 | -6.35 |
| 2-1-2 Continuation | 107 | 77% | 82 | 77% | +7.48 | +5.73 | +613.46 |
| Rev Strat (1-2-2) Reversal | 77 | 65% | 50 | 86% | +0.08 | +0.05 | +3.77 |
| 3-1-2 Reversal | 55 | 60% | 33 | 79% | +39.34 | +23.60 | +1298.19 |
| 3-2-2 Reversal | 44 | 59% | 26 | 77% | +20.71 | +12.24 | +538.58 |
| 3-2 Continuation | 38 | 74% | 28 | 86% | +0.20 | +0.15 | +5.63 |
| 1-1-2 Continuation | 27 | 78% | 21 | 71% | +0.16 | +0.13 | +3.39 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 631 | 65% | 413 | 71% | -0.02 | -0.01 | -7.59 |
| W | 269 | 73% | 196 | 78% | +2.90 | +2.11 | +568.36 |
| M | 104 | 81% | 84 | 69% | +29.27 | +23.64 | +2458.41 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 783 | 67% | 523 | 74% | +3.29 | +2.20 | +1722.40 |
| Mixed | 220 | 77% | 170 | 68% | +7.63 | +5.89 | +1296.77 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 429 | 70% | 299 | 67% | +4.00 | +2.79 | +1196.87 |
| Reversal | 575 | 69% | 394 | 77% | +4.63 | +3.17 | +1822.31 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 701 | 68% | 478 | 72% | +2.32 | +1.58 | +1110.49 |
| Inside-bar compression (X-1-?) | 303 | 71% | 215 | 74% | +8.88 | +6.30 | +1908.68 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 43 | 26% | 11 | 100% | +275.81 | +70.56 | +3033.94 |
| LTC-USD | 17 | 82% | 14 | 93% | +0.44 | +0.36 | +6.13 |
| TLT | 31 | 71% | 22 | 77% | +0.38 | +0.27 | +8.45 |
| AMD | 32 | 84% | 27 | 81% | +0.30 | +0.26 | +8.19 |
| DIA | 34 | 79% | 27 | 89% | +0.23 | +0.19 | +6.33 |
| ETH-USD | 23 | 78% | 18 | 83% | +0.17 | +0.13 | +2.99 |
| XLI | 32 | 63% | 20 | 90% | +0.19 | +0.12 | +3.73 |
| META | 36 | 53% | 19 | 79% | +0.17 | +0.09 | +3.14 |
| IWM | 34 | 59% | 20 | 75% | +0.14 | +0.08 | +2.77 |
| XLU | 36 | 81% | 29 | 62% | +0.09 | +0.07 | +2.59 |
| AMZN | 29 | 76% | 22 | 86% | +0.09 | +0.07 | +2.04 |
| BTC-USD | 23 | 91% | 21 | 71% | +0.03 | +0.02 | +0.56 |
| XLF | 36 | 72% | 26 | 69% | +0.03 | +0.02 | +0.85 |
| EURUSD=X | 34 | 9% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLC | 30 | 77% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| XLK | 32 | 78% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| SMH | 31 | 74% | 23 | 74% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 35 | 63% | 22 | 68% | -0.04 | -0.02 | -0.78 |
| SPY | 26 | 73% | 19 | 63% | -0.09 | -0.06 | -1.63 |
| MSFT | 26 | 85% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| TSLA | 30 | 73% | 22 | 73% | -0.13 | -0.09 | -2.84 |
| SOL-USD | 26 | 77% | 20 | 65% | -0.13 | -0.10 | -2.56 |
| XLV | 24 | 71% | 17 | 65% | -0.16 | -0.11 | -2.65 |
| DOGE-USD | 26 | 69% | 18 | 39% | -0.16 | -0.11 | -2.90 |
| GLD | 32 | 59% | 19 | 79% | -0.19 | -0.12 | -3.69 |
| QQQ | 26 | 85% | 22 | 68% | -0.14 | -0.12 | -3.10 |
| XLY | 25 | 84% | 21 | 76% | -0.14 | -0.12 | -3.00 |
| AAPL | 29 | 76% | 22 | 68% | -0.18 | -0.13 | -3.90 |
| HYPE-USD | 22 | 77% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| NVDA | 30 | 60% | 18 | 67% | -0.30 | -0.18 | -5.35 |
| XLP | 24 | 75% | 18 | 67% | -0.25 | -0.19 | -4.48 |
| XLE | 35 | 71% | 25 | 60% | -0.31 | -0.22 | -7.84 |
| GC=F | 29 | 66% | 19 | 63% | -0.35 | -0.23 | -6.66 |
| GOOGL | 26 | 85% | 22 | 59% | -0.31 | -0.26 | -6.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
