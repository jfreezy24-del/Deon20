# Edge Report — live signal record

_Generated 2026-09-24_ · **795** settled signals from 2026-08-17 to 2026-09-24 · 33 open, 23 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (559 of 795) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy +5.38R per trade taken**, +3.78R per signal published.
- Promised **0.77R** to target 1 on average; delivered **+5.38R**.
- Trades ran **6.10R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 355 | 66% | 233 | 80% | +5.51 | +3.62 | +1284.21 |
| 55–64 | 335 | 73% | 244 | 70% | +7.07 | +5.15 | +1725.95 |
| 65–74 (High) | 93 | 78% | 73 | 63% | -0.04 | -0.03 | -3.20 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.027** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 248 | +7.68 | 547 | +2.02 | +5.67 | 74% vs 73% |
| `ftfc-aligned` | 161 | +8.02 | 634 | +2.71 | +5.31 | 70% vs 74% |
| `ftfc-opposed` | 161 | +8.02 | 634 | +2.71 | +5.31 | 70% vs 74% |
| `base` | 795 | +3.78 | 0 | +0.00 | +3.78 | 73% vs 0% |
| `rr-poor` | 549 | +4.47 | 246 | +2.26 | +2.20 | 85% vs 37% |
| `reversal-backed` | 458 | +4.00 | 337 | +3.50 | +0.50 | 79% vs 66% |
| `close-location` | 438 | +3.96 | 357 | +3.57 | +0.38 | 75% vs 71% |
| `rr-ok` | 229 | +2.43 | 566 | +4.33 | -1.91 | 37% vs 83% |
| `rr-strong` | 17 | +0.05 | 778 | +3.87 | -3.81 | 42% vs 74% |
| `volume` | 162 | +0.07 | 633 | +4.74 | -4.67 | 69% vs 74% |
| `ftfc-full` | 633 | +2.71 | 162 | +7.97 | -5.26 | 74% vs 70% |
| `in-force` | 384 | -0.03 | 411 | +7.35 | -7.38 | 77% vs 66% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 220 | 75% | 164 | 79% | -0.05 | -0.04 | -8.44 |
| 2-2 Continuation | 203 | 64% | 129 | 60% | +4.38 | +2.78 | +564.72 |
| 2-1-2 Reversal | 97 | 74% | 72 | 75% | -0.03 | -0.02 | -2.31 |
| 2-1-2 Continuation | 82 | 77% | 63 | 71% | +9.64 | +7.41 | +607.23 |
| Rev Strat (1-2-2) Reversal | 62 | 66% | 41 | 83% | +0.07 | +0.05 | +2.91 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 33 | 67% | 22 | 82% | +24.56 | +16.37 | +540.25 |
| 3-2 Continuation | 29 | 72% | 21 | 86% | +0.16 | +0.11 | +3.32 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 481 | 67% | 320 | 73% | -0.03 | -0.02 | -10.26 |
| W | 223 | 74% | 166 | 78% | +3.40 | +2.53 | +564.52 |
| M | 91 | 80% | 73 | 67% | +33.62 | +26.97 | +2454.20 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 633 | 68% | 430 | 74% | +3.99 | +2.71 | +1717.33 |
| Mixed | 161 | 80% | 129 | 70% | +10.01 | +8.02 | +1291.14 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 336 | 69% | 232 | 66% | +5.08 | +3.51 | +1178.47 |
| Reversal | 459 | 71% | 327 | 79% | +5.60 | +3.99 | +1829.99 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 547 | 69% | 377 | 73% | +2.93 | +2.02 | +1102.75 |
| Inside-bar compression (X-1-?) | 248 | 73% | 182 | 74% | +10.47 | +7.68 | +1905.71 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 33 | 24% | 8 | 100% | +378.99 | +91.88 | +3031.89 |
| AMD | 24 | 96% | 23 | 87% | +0.39 | +0.38 | +9.08 |
| LTC-USD | 15 | 87% | 13 | 92% | +0.36 | +0.31 | +4.63 |
| DIA | 30 | 77% | 23 | 91% | +0.21 | +0.16 | +4.83 |
| META | 27 | 67% | 18 | 83% | +0.23 | +0.15 | +4.14 |
| ETH-USD | 17 | 82% | 14 | 79% | +0.17 | +0.14 | +2.37 |
| XLI | 27 | 59% | 16 | 88% | +0.21 | +0.12 | +3.32 |
| AMZN | 24 | 79% | 19 | 89% | +0.14 | +0.11 | +2.69 |
| XLU | 29 | 86% | 25 | 68% | +0.12 | +0.11 | +3.11 |
| GLD | 25 | 56% | 14 | 86% | +0.06 | +0.03 | +0.83 |
| EURUSD=X | 25 | 12% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLP | 18 | 78% | 14 | 86% | -0.00 | -0.00 | -0.02 |
| IWM | 26 | 58% | 15 | 73% | -0.01 | -0.00 | -0.11 |
| XLY | 17 | 82% | 14 | 86% | -0.02 | -0.01 | -0.23 |
| BTC-USD | 20 | 90% | 18 | 67% | -0.02 | -0.02 | -0.34 |
| XLC | 21 | 86% | 18 | 83% | -0.03 | -0.02 | -0.49 |
| XRP-USD | 29 | 62% | 18 | 61% | -0.07 | -0.04 | -1.21 |
| TSLA | 24 | 71% | 17 | 76% | -0.09 | -0.06 | -1.55 |
| MSFT | 19 | 89% | 17 | 76% | -0.07 | -0.07 | -1.26 |
| NVDA | 25 | 60% | 15 | 80% | -0.12 | -0.07 | -1.75 |
| XLF | 28 | 71% | 20 | 70% | -0.12 | -0.08 | -2.34 |
| SMH | 23 | 78% | 18 | 72% | -0.11 | -0.09 | -2.01 |
| XLV | 20 | 70% | 14 | 64% | -0.14 | -0.10 | -1.99 |
| SPY | 22 | 68% | 15 | 67% | -0.16 | -0.11 | -2.40 |
| XLK | 24 | 83% | 20 | 80% | -0.15 | -0.13 | -3.04 |
| HYPE-USD | 19 | 79% | 15 | 47% | -0.19 | -0.15 | -2.89 |
| TLT | 23 | 61% | 14 | 64% | -0.26 | -0.16 | -3.68 |
| SOL-USD | 23 | 74% | 17 | 59% | -0.22 | -0.17 | -3.81 |
| GOOGL | 21 | 90% | 19 | 63% | -0.18 | -0.17 | -3.50 |
| DOGE-USD | 21 | 71% | 15 | 40% | -0.25 | -0.18 | -3.70 |
| AAPL | 22 | 73% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| QQQ | 19 | 84% | 16 | 69% | -0.27 | -0.22 | -4.27 |
| XLE | 31 | 74% | 23 | 57% | -0.34 | -0.25 | -7.86 |
| GC=F | 24 | 63% | 15 | 60% | -0.44 | -0.27 | -6.58 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
