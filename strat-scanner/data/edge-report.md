# Edge Report — live signal record

_Generated 2026-10-03_ · **978** settled signals from 2026-08-17 to 2026-10-03 · 24 open, 49 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (685 of 978) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.40R per trade taken**, +3.08R per signal published.
- Promised **0.75R** to target 1 on average; delivered **+4.40R**.
- Trades ran **5.11R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 460 | 65% | 297 | 79% | +4.32 | +2.79 | +1282.09 |
| 55–64 | 407 | 74% | 301 | 68% | +5.76 | +4.26 | +1734.00 |
| 65–74 (High) | 99 | 79% | 78 | 62% | -0.05 | -0.04 | -3.62 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.024** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 290 | +6.57 | 688 | +1.61 | +4.96 | 74% vs 72% |
| `ftfc-aligned` | 208 | +6.22 | 770 | +2.23 | +3.99 | 67% vs 74% |
| `ftfc-opposed` | 208 | +6.22 | 770 | +2.23 | +3.99 | 67% vs 74% |
| `base` | 978 | +3.08 | 0 | +0.00 | +3.08 | 72% vs 0% |
| `rr-poor` | 671 | +3.64 | 307 | +1.86 | +1.77 | 84% vs 38% |
| `close-location` | 516 | +3.37 | 462 | +2.76 | +0.61 | 74% vs 70% |
| `reversal-backed` | 554 | +3.28 | 424 | +2.82 | +0.46 | 77% vs 67% |
| `rr-ok` | 286 | +2.00 | 692 | +3.53 | -1.54 | 38% vs 82% |
| `rr-strong` | 21 | +0.08 | 957 | +3.15 | -3.07 | 38% vs 73% |
| `volume` | 213 | +0.07 | 765 | +3.92 | -3.85 | 64% vs 75% |
| `ftfc-full` | 769 | +2.24 | 209 | +6.19 | -3.95 | 74% vs 67% |
| `in-force` | 477 | -0.03 | 501 | +6.04 | -6.07 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 279 | 73% | 205 | 77% | -0.06 | -0.05 | -12.99 |
| 2-2 Continuation | 256 | 66% | 168 | 58% | +3.42 | +2.24 | +574.39 |
| 2-1-2 Reversal | 111 | 71% | 79 | 71% | -0.08 | -0.06 | -6.35 |
| 2-1-2 Continuation | 104 | 77% | 80 | 76% | +7.65 | +5.89 | +612.26 |
| Rev Strat (1-2-2) Reversal | 76 | 66% | 50 | 86% | +0.08 | +0.05 | +3.77 |
| 3-1-2 Reversal | 49 | 59% | 29 | 76% | +44.67 | +26.43 | +1295.30 |
| 3-2-2 Reversal | 40 | 65% | 26 | 77% | +20.71 | +13.46 | +538.58 |
| 3-2 Continuation | 37 | 73% | 27 | 85% | +0.21 | +0.15 | +5.63 |
| 1-1-2 Continuation | 26 | 81% | 21 | 71% | +0.16 | +0.13 | +3.39 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 612 | 67% | 407 | 71% | -0.03 | -0.02 | -11.83 |
| W | 264 | 74% | 195 | 77% | +2.91 | +2.15 | +568.36 |
| M | 102 | 81% | 83 | 69% | +29.61 | +24.09 | +2457.46 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 769 | 67% | 519 | 74% | +3.31 | +2.24 | +1720.15 |
| Mixed | 208 | 80% | 166 | 67% | +7.79 | +6.22 | +1293.83 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 423 | 70% | 296 | 67% | +4.04 | +2.83 | +1195.67 |
| Reversal | 555 | 70% | 389 | 77% | +4.67 | +3.28 | +1818.31 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 688 | 69% | 476 | 72% | +2.33 | +1.61 | +1109.39 |
| Inside-bar compression (X-1-?) | 290 | 72% | 209 | 74% | +9.11 | +6.57 | +1904.59 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 39 | 21% | 8 | 100% | +378.99 | +77.74 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| TLT | 31 | 71% | 22 | 77% | +0.38 | +0.27 | +8.45 |
| AMD | 32 | 84% | 27 | 81% | +0.30 | +0.26 | +8.19 |
| DIA | 34 | 79% | 27 | 89% | +0.23 | +0.19 | +6.33 |
| ETH-USD | 21 | 81% | 17 | 82% | +0.16 | +0.13 | +2.67 |
| XLI | 32 | 63% | 20 | 90% | +0.19 | +0.12 | +3.73 |
| META | 34 | 56% | 19 | 79% | +0.17 | +0.09 | +3.14 |
| IWM | 33 | 61% | 20 | 75% | +0.14 | +0.08 | +2.77 |
| XLU | 36 | 81% | 29 | 62% | +0.09 | +0.07 | +2.59 |
| AMZN | 29 | 76% | 22 | 86% | +0.09 | +0.07 | +2.04 |
| XLF | 36 | 72% | 26 | 69% | +0.03 | +0.02 | +0.85 |
| BTC-USD | 22 | 91% | 20 | 70% | +0.02 | +0.02 | +0.36 |
| EURUSD=X | 31 | 10% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLC | 29 | 79% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| XLK | 30 | 83% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| SMH | 29 | 79% | 23 | 74% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 34 | 62% | 21 | 67% | -0.04 | -0.02 | -0.78 |
| SPY | 26 | 73% | 19 | 63% | -0.09 | -0.06 | -1.63 |
| MSFT | 25 | 88% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| TSLA | 30 | 73% | 22 | 73% | -0.13 | -0.09 | -2.84 |
| XLV | 24 | 71% | 17 | 65% | -0.16 | -0.11 | -2.65 |
| GLD | 32 | 59% | 19 | 79% | -0.19 | -0.12 | -3.69 |
| QQQ | 26 | 85% | 22 | 68% | -0.14 | -0.12 | -3.10 |
| XLY | 25 | 84% | 21 | 76% | -0.14 | -0.12 | -3.00 |
| AAPL | 29 | 76% | 22 | 68% | -0.18 | -0.13 | -3.90 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| DOGE-USD | 25 | 68% | 17 | 35% | -0.27 | -0.18 | -4.53 |
| NVDA | 29 | 62% | 18 | 67% | -0.30 | -0.18 | -5.35 |
| XLP | 24 | 75% | 18 | 67% | -0.25 | -0.19 | -4.48 |
| XLE | 35 | 71% | 25 | 60% | -0.31 | -0.22 | -7.84 |
| GC=F | 29 | 66% | 19 | 63% | -0.35 | -0.23 | -6.66 |
| GOOGL | 25 | 88% | 22 | 59% | -0.31 | -0.27 | -6.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
