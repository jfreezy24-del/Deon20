# Edge Report — live signal record

_Generated 2026-09-10_ · **489** settled signals from 2026-08-17 to 2026-09-10 · 38 open, 56 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **74%** of published signals actually triggered (362 of 489) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.05R per trade taken**, -0.03R per signal published.
- Promised **0.82R** to target 1 on average; delivered **-0.05R**.
- Trades ran **0.61R** in favour at best and **0.62R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 204 | 70% | 143 | 78% | -0.09 | -0.06 | -13.00 |
| 55–64 | 213 | 75% | 160 | 72% | -0.03 | -0.02 | -4.44 |
| 65–74 (High) | 64 | 83% | 53 | 70% | +0.03 | +0.02 | +1.50 |
| 75+ (High) | 8 | 75% | 6 | 67% | -0.19 | -0.14 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.114** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 90 | +0.11 | 399 | -0.07 | +0.17 | 63% vs 76% |
| `ftfc-full` | 390 | -0.01 | 99 | -0.13 | +0.12 | 76% vs 66% |
| `rr-poor` | 346 | -0.01 | 143 | -0.10 | +0.09 | 85% vs 37% |
| `reversal-backed` | 285 | -0.01 | 204 | -0.06 | +0.05 | 79% vs 68% |
| `close-location` | 264 | -0.02 | 225 | -0.05 | +0.03 | 75% vs 73% |
| `in-force` | 251 | -0.03 | 238 | -0.04 | +0.00 | 77% vs 67% |
| `compression` | 166 | -0.05 | 323 | -0.03 | -0.02 | 79% vs 72% |
| `base` | 489 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `rr-ok` | 132 | -0.07 | 357 | -0.02 | -0.05 | 38% vs 84% |
| `ftfc-aligned` | 98 | -0.13 | 391 | -0.01 | -0.12 | 66% vs 76% |
| `ftfc-opposed` | 98 | -0.13 | 391 | -0.01 | -0.12 | 66% vs 76% |
| `rr-strong` | 11 | -0.40 | 478 | -0.03 | -0.37 | 33% vs 75% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 133 | 77% | 103 | 78% | -0.04 | -0.03 | -4.55 |
| 2-2 Continuation | 118 | 71% | 84 | 60% | -0.08 | -0.06 | -6.84 |
| 2-1-2 Reversal | 59 | 80% | 47 | 79% | -0.04 | -0.03 | -1.76 |
| 2-1-2 Continuation | 55 | 78% | 43 | 84% | -0.09 | -0.07 | -3.91 |
| Rev Strat (1-2-2) Reversal | 37 | 68% | 25 | 84% | +0.03 | +0.02 | +0.76 |
| 3-1-2 Reversal | 35 | 60% | 21 | 76% | -0.00 | -0.00 | -0.03 |
| 3-2-2 Reversal | 22 | 64% | 14 | 79% | +0.11 | +0.07 | +1.53 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 13 | 77% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 309 | 70% | 217 | 73% | -0.02 | -0.02 | -5.31 |
| W | 136 | 74% | 101 | 77% | -0.09 | -0.06 | -8.82 |
| M | 44 | 100% | 44 | 73% | -0.07 | -0.07 | -2.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 390 | 73% | 286 | 76% | -0.01 | -0.01 | -4.03 |
| Mixed | 98 | 78% | 76 | 66% | -0.17 | -0.13 | -13.02 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 203 | 75% | 152 | 68% | -0.09 | -0.06 | -13.01 |
| Reversal | 286 | 73% | 210 | 79% | -0.02 | -0.01 | -4.04 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 323 | 73% | 236 | 72% | -0.04 | -0.03 | -8.87 |
| Inside-bar compression (X-1-?) | 166 | 76% | 126 | 79% | -0.06 | -0.05 | -8.17 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| XLI | 18 | 78% | 14 | 93% | +0.32 | +0.25 | +4.50 |
| ETH-USD | 11 | 73% | 8 | 75% | +0.31 | +0.23 | +2.51 |
| AMZN | 16 | 88% | 14 | 93% | +0.24 | +0.21 | +3.43 |
| GLD | 15 | 60% | 9 | 89% | +0.27 | +0.16 | +2.47 |
| XLP | 10 | 80% | 8 | 100% | +0.18 | +0.14 | +1.45 |
| META | 19 | 74% | 14 | 93% | +0.18 | +0.13 | +2.54 |
| DIA | 20 | 80% | 16 | 94% | +0.14 | +0.11 | +2.25 |
| JUP-USD | 19 | 21% | 4 | 100% | +0.50 | +0.11 | +2.01 |
| BTC-USD | 11 | 91% | 10 | 60% | +0.04 | +0.04 | +0.41 |
| SPY | 12 | 75% | 9 | 89% | +0.04 | +0.03 | +0.36 |
| XRP-USD | 19 | 53% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| AMD | 12 | 100% | 12 | 92% | +0.01 | +0.01 | +0.14 |
| IWM | 15 | 60% | 9 | 78% | +0.02 | +0.01 | +0.15 |
| EURUSD=X | 15 | 7% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| XLU | 14 | 86% | 12 | 67% | -0.04 | -0.03 | -0.49 |
| HYPE-USD | 11 | 73% | 8 | 38% | -0.07 | -0.05 | -0.55 |
| TSLA | 14 | 71% | 10 | 80% | -0.07 | -0.05 | -0.71 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| XLK | 13 | 92% | 12 | 83% | -0.08 | -0.08 | -1.02 |
| QQQ | 12 | 92% | 11 | 82% | -0.14 | -0.13 | -1.58 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| GOOGL | 12 | 100% | 12 | 67% | -0.15 | -0.15 | -1.74 |
| XLV | 9 | 78% | 7 | 71% | -0.19 | -0.15 | -1.32 |
| SMH | 15 | 93% | 14 | 71% | -0.16 | -0.15 | -2.22 |
| XLC | 13 | 92% | 12 | 75% | -0.19 | -0.18 | -2.34 |
| XLF | 21 | 86% | 18 | 67% | -0.21 | -0.18 | -3.85 |
| SOL-USD | 15 | 67% | 10 | 50% | -0.32 | -0.21 | -3.22 |
| TLT | 14 | 57% | 8 | 63% | -0.38 | -0.22 | -3.03 |
| XLE | 16 | 81% | 13 | 54% | -0.27 | -0.22 | -3.56 |
| AAPL | 14 | 86% | 12 | 67% | -0.26 | -0.23 | -3.18 |
| NVDA | 17 | 65% | 11 | 73% | -0.35 | -0.23 | -3.90 |
| MSFT | 13 | 92% | 12 | 67% | -0.26 | -0.24 | -3.10 |
| GC=F | 17 | 65% | 11 | 64% | -0.46 | -0.30 | -5.02 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
