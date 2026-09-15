# Edge Report — live signal record

_Generated 2026-09-15_ · **588** settled signals from 2026-08-17 to 2026-09-15 · 30 open, 44 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **72%** of published signals actually triggered (423 of 588) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.07R per trade taken**, -0.05R per signal published.
- Promised **0.80R** to target 1 on average; delivered **-0.07R**.
- Trades ran **0.61R** in favour at best and **0.65R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 252 | 67% | 170 | 78% | -0.09 | -0.06 | -16.05 |
| 55–64 | 253 | 73% | 184 | 70% | -0.06 | -0.05 | -11.48 |
| 65–74 (High) | 73 | 85% | 62 | 65% | -0.06 | -0.05 | -3.58 |
| 75+ (High) | 10 | 70% | 7 | 71% | +0.06 | +0.05 | +0.45 |

Spearman rank correlation between confidence and realised R: **0.064** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 110 | +0.06 | 478 | -0.08 | +0.13 | 63% vs 74% |
| `rr-poor` | 411 | -0.01 | 177 | -0.14 | +0.12 | 84% vs 34% |
| `ftfc-full` | 469 | -0.03 | 119 | -0.12 | +0.09 | 74% vs 66% |
| `close-location` | 318 | -0.02 | 270 | -0.09 | +0.07 | 74% vs 70% |
| `reversal-backed` | 353 | -0.03 | 235 | -0.08 | +0.05 | 77% vs 66% |
| `compression` | 192 | -0.04 | 396 | -0.06 | +0.01 | 78% vs 70% |
| `in-force` | 286 | -0.07 | 302 | -0.04 | -0.03 | 75% vs 66% |
| `base` | 588 | -0.05 | 0 | +0.00 | -0.05 | 72% vs 0% |
| `rr-ok` | 162 | -0.11 | 426 | -0.03 | -0.08 | 34% vs 83% |
| `ftfc-aligned` | 118 | -0.12 | 470 | -0.03 | -0.09 | 66% vs 74% |
| `ftfc-opposed` | 118 | -0.12 | 470 | -0.03 | -0.09 | 66% vs 74% |
| `rr-strong` | 15 | -0.43 | 573 | -0.04 | -0.38 | 30% vs 73% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 170 | 73% | 124 | 75% | -0.09 | -0.06 | -11.02 |
| 2-2 Continuation | 138 | 70% | 96 | 58% | -0.12 | -0.08 | -11.42 |
| 2-1-2 Reversal | 70 | 77% | 54 | 80% | +0.01 | +0.01 | +0.46 |
| 2-1-2 Continuation | 63 | 79% | 50 | 80% | -0.11 | -0.08 | -5.29 |
| Rev Strat (1-2-2) Reversal | 46 | 72% | 33 | 79% | -0.01 | -0.01 | -0.49 |
| 3-1-2 Reversal | 42 | 60% | 25 | 76% | -0.04 | -0.02 | -0.97 |
| 3-2-2 Reversal | 26 | 62% | 16 | 75% | +0.02 | +0.01 | +0.33 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 16 | 63% | 10 | 70% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 364 | 68% | 246 | 72% | -0.05 | -0.03 | -12.71 |
| W | 169 | 72% | 122 | 75% | -0.07 | -0.05 | -8.86 |
| M | 55 | 100% | 55 | 65% | -0.16 | -0.16 | -9.07 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 469 | 71% | 332 | 74% | -0.05 | -0.03 | -16.10 |
| Mixed | 118 | 77% | 91 | 66% | -0.16 | -0.12 | -14.55 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 234 | 73% | 171 | 66% | -0.11 | -0.08 | -18.97 |
| Reversal | 354 | 71% | 252 | 77% | -0.05 | -0.03 | -11.68 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 396 | 70% | 279 | 70% | -0.08 | -0.06 | -22.37 |
| Inside-bar compression (X-1-?) | 192 | 75% | 144 | 78% | -0.06 | -0.04 | -8.28 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| AMZN | 17 | 88% | 15 | 93% | +0.24 | +0.21 | +3.56 |
| XLI | 21 | 71% | 15 | 87% | +0.22 | +0.16 | +3.29 |
| GLD | 20 | 60% | 12 | 92% | +0.24 | +0.14 | +2.83 |
| META | 22 | 64% | 14 | 93% | +0.18 | +0.12 | +2.54 |
| ETH-USD | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.54 |
| JUP-USD | 24 | 17% | 4 | 100% | +0.50 | +0.08 | +2.01 |
| DIA | 24 | 79% | 19 | 89% | +0.09 | +0.07 | +1.65 |
| XRP-USD | 22 | 55% | 12 | 58% | +0.05 | +0.03 | +0.61 |
| XLU | 20 | 90% | 18 | 72% | +0.00 | +0.00 | +0.05 |
| EURUSD=X | 16 | 6% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| TSLA | 16 | 69% | 11 | 82% | -0.04 | -0.03 | -0.47 |
| BTC-USD | 13 | 92% | 12 | 58% | -0.04 | -0.04 | -0.51 |
| IWM | 20 | 55% | 11 | 73% | -0.07 | -0.04 | -0.79 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| AMD | 14 | 100% | 14 | 86% | -0.06 | -0.06 | -0.78 |
| XLK | 16 | 94% | 15 | 87% | -0.07 | -0.06 | -1.02 |
| HYPE-USD | 14 | 79% | 11 | 45% | -0.10 | -0.08 | -1.09 |
| XLV | 14 | 79% | 11 | 64% | -0.11 | -0.09 | -1.25 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| MSFT | 14 | 93% | 13 | 69% | -0.11 | -0.10 | -1.37 |
| XLP | 13 | 77% | 10 | 80% | -0.13 | -0.10 | -1.28 |
| NVDA | 21 | 62% | 13 | 77% | -0.18 | -0.11 | -2.37 |
| GOOGL | 16 | 94% | 15 | 67% | -0.12 | -0.12 | -1.87 |
| SPY | 16 | 69% | 11 | 73% | -0.18 | -0.12 | -1.98 |
| TLT | 19 | 58% | 11 | 64% | -0.26 | -0.15 | -2.81 |
| XLC | 15 | 93% | 14 | 79% | -0.17 | -0.16 | -2.34 |
| XLF | 23 | 78% | 18 | 67% | -0.21 | -0.17 | -3.85 |
| DOGE-USD | 15 | 73% | 11 | 27% | -0.26 | -0.19 | -2.87 |
| QQQ | 14 | 86% | 12 | 75% | -0.23 | -0.20 | -2.75 |
| SOL-USD | 16 | 63% | 10 | 50% | -0.32 | -0.20 | -3.22 |
| AAPL | 17 | 88% | 15 | 67% | -0.27 | -0.23 | -3.98 |
| GC=F | 20 | 60% | 12 | 58% | -0.50 | -0.30 | -6.02 |
| XLE | 21 | 76% | 16 | 44% | -0.48 | -0.37 | -7.74 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
