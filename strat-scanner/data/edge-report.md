# Edge Report — live signal record

_Generated 2026-09-23_ · **762** settled signals from 2026-08-17 to 2026-09-23 · 30 open, 33 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (533 of 762) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.04R per trade taken**, -0.03R per signal published.
- Promised **0.77R** to target 1 on average; delivered **-0.04R**.
- Trades ran **0.64R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 340 | 65% | 222 | 80% | -0.07 | -0.04 | -14.61 |
| 55–64 | 320 | 72% | 231 | 70% | -0.02 | -0.01 | -4.20 |
| 65–74 (High) | 90 | 79% | 71 | 62% | -0.05 | -0.04 | -3.26 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.033** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 156 | +0.07 | 606 | -0.05 | +0.13 | 69% vs 74% |
| `rr-strong` | 17 | +0.05 | 745 | -0.03 | +0.08 | 42% vs 74% |
| `close-location` | 418 | +0.00 | 344 | -0.06 | +0.07 | 75% vs 70% |
| `rr-poor` | 528 | -0.01 | 234 | -0.06 | +0.05 | 85% vs 36% |
| `reversal-backed` | 444 | -0.02 | 318 | -0.04 | +0.02 | 78% vs 65% |
| `ftfc-full` | 608 | -0.02 | 154 | -0.05 | +0.02 | 74% vs 70% |
| `in-force` | 366 | -0.03 | 396 | -0.02 | -0.00 | 77% vs 66% |
| `ftfc-aligned` | 153 | -0.05 | 609 | -0.02 | -0.02 | 70% vs 74% |
| `ftfc-opposed` | 153 | -0.05 | 609 | -0.02 | -0.02 | 70% vs 74% |
| `base` | 762 | -0.03 | 0 | +0.00 | -0.03 | 73% vs 0% |
| `compression` | 238 | -0.05 | 524 | -0.02 | -0.04 | 74% vs 73% |
| `rr-ok` | 217 | -0.07 | 545 | -0.01 | -0.07 | 35% vs 83% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 214 | 74% | 158 | 79% | -0.05 | -0.04 | -8.11 |
| 2-2 Continuation | 192 | 64% | 122 | 59% | -0.05 | -0.03 | -5.81 |
| 2-1-2 Reversal | 94 | 74% | 70 | 74% | -0.04 | -0.03 | -2.63 |
| 2-1-2 Continuation | 77 | 75% | 58 | 72% | -0.21 | -0.16 | -12.28 |
| Rev Strat (1-2-2) Reversal | 60 | 67% | 40 | 83% | +0.07 | +0.05 | +2.86 |
| 3-1-2 Reversal | 45 | 60% | 27 | 78% | -0.03 | -0.02 | -0.84 |
| 3-2-2 Reversal | 32 | 66% | 21 | 81% | +0.06 | +0.04 | +1.28 |
| 3-2 Continuation | 26 | 69% | 18 | 83% | +0.10 | +0.07 | +1.78 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 465 | 66% | 309 | 73% | -0.03 | -0.02 | -8.46 |
| W | 211 | 74% | 156 | 78% | -0.05 | -0.04 | -7.71 |
| M | 86 | 79% | 68 | 65% | -0.06 | -0.05 | -4.40 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 608 | 68% | 411 | 74% | -0.03 | -0.02 | -13.54 |
| Mixed | 153 | 80% | 122 | 70% | -0.06 | -0.05 | -7.01 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 317 | 68% | 217 | 65% | -0.06 | -0.04 | -13.11 |
| Reversal | 445 | 71% | 316 | 78% | -0.02 | -0.02 | -7.45 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 524 | 69% | 359 | 73% | -0.02 | -0.02 | -8.01 |
| Inside-bar compression (X-1-?) | 238 | 73% | 174 | 74% | -0.07 | -0.05 | -12.55 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AMD | 23 | 96% | 22 | 86% | +0.41 | +0.39 | +9.08 |
| LTC-USD | 15 | 87% | 13 | 92% | +0.36 | +0.31 | +4.63 |
| DIA | 29 | 76% | 22 | 91% | +0.22 | +0.17 | +4.83 |
| META | 27 | 67% | 18 | 83% | +0.23 | +0.15 | +4.14 |
| ETH-USD | 17 | 82% | 14 | 79% | +0.17 | +0.14 | +2.37 |
| XLI | 26 | 62% | 16 | 88% | +0.21 | +0.13 | +3.32 |
| AMZN | 23 | 78% | 18 | 89% | +0.15 | +0.12 | +2.69 |
| JUP-USD | 28 | 14% | 4 | 100% | +0.50 | +0.07 | +2.01 |
| XLU | 25 | 88% | 22 | 64% | +0.04 | +0.04 | +0.90 |
| BTC-USD | 19 | 89% | 17 | 71% | +0.04 | +0.03 | +0.66 |
| GLD | 25 | 56% | 14 | 86% | +0.06 | +0.03 | +0.83 |
| EURUSD=X | 24 | 13% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLP | 18 | 78% | 14 | 86% | -0.00 | -0.00 | -0.02 |
| XRP-USD | 27 | 59% | 16 | 63% | -0.02 | -0.01 | -0.25 |
| XLY | 17 | 82% | 14 | 86% | -0.02 | -0.01 | -0.23 |
| IWM | 25 | 56% | 14 | 71% | -0.03 | -0.01 | -0.37 |
| XLC | 21 | 86% | 18 | 83% | -0.03 | -0.02 | -0.49 |
| MSFT | 19 | 89% | 17 | 76% | -0.07 | -0.07 | -1.26 |
| NVDA | 25 | 60% | 15 | 80% | -0.12 | -0.07 | -1.75 |
| XLF | 27 | 70% | 19 | 68% | -0.12 | -0.09 | -2.34 |
| SMH | 23 | 78% | 18 | 72% | -0.11 | -0.09 | -2.01 |
| TSLA | 23 | 70% | 16 | 75% | -0.13 | -0.09 | -2.03 |
| XLV | 20 | 70% | 14 | 64% | -0.14 | -0.10 | -1.99 |
| HYPE-USD | 18 | 78% | 14 | 50% | -0.14 | -0.11 | -1.89 |
| TLT | 22 | 59% | 13 | 69% | -0.21 | -0.12 | -2.68 |
| SOL-USD | 22 | 73% | 16 | 63% | -0.18 | -0.13 | -2.81 |
| XLK | 23 | 87% | 20 | 80% | -0.15 | -0.13 | -3.04 |
| GOOGL | 17 | 94% | 16 | 63% | -0.18 | -0.17 | -2.87 |
| DOGE-USD | 21 | 71% | 15 | 40% | -0.25 | -0.18 | -3.70 |
| SPY | 21 | 67% | 14 | 64% | -0.27 | -0.18 | -3.77 |
| AAPL | 21 | 76% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| QQQ | 18 | 83% | 15 | 67% | -0.28 | -0.24 | -4.27 |
| XLE | 30 | 73% | 22 | 55% | -0.36 | -0.26 | -7.89 |
| GC=F | 23 | 61% | 14 | 57% | -0.50 | -0.30 | -6.96 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
