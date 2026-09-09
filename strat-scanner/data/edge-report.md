# Edge Report — live signal record

_Generated 2026-09-09_ · **460** settled signals from 2026-08-17 to 2026-09-09 · 37 open, 81 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **74%** of published signals actually triggered (342 of 460) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.05R per trade taken**, -0.03R per signal published.
- Promised **0.83R** to target 1 on average; delivered **-0.05R**.
- Trades ran **0.61R** in favour at best and **0.63R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 192 | 70% | 134 | 79% | -0.08 | -0.06 | -10.87 |
| 55–64 | 201 | 77% | 154 | 71% | -0.03 | -0.02 | -4.52 |
| 65–74 (High) | 60 | 82% | 49 | 67% | +0.01 | +0.01 | +0.47 |
| 75+ (High) | 7 | 71% | 5 | 60% | -0.22 | -0.16 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.117** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 87 | +0.12 | 373 | -0.07 | +0.19 | 63% vs 76% |
| `ftfc-full` | 364 | -0.01 | 96 | -0.13 | +0.12 | 76% vs 66% |
| `rr-poor` | 324 | -0.01 | 136 | -0.09 | +0.08 | 85% vs 37% |
| `reversal-backed` | 266 | -0.01 | 194 | -0.07 | +0.05 | 78% vs 67% |
| `in-force` | 246 | -0.03 | 214 | -0.04 | +0.01 | 77% vs 65% |
| `close-location` | 251 | -0.03 | 209 | -0.04 | +0.00 | 73% vs 74% |
| `base` | 460 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `compression` | 152 | -0.06 | 308 | -0.02 | -0.04 | 77% vs 72% |
| `rr-ok` | 126 | -0.07 | 334 | -0.02 | -0.05 | 36% vs 84% |
| `ftfc-aligned` | 95 | -0.13 | 365 | -0.01 | -0.12 | 66% vs 76% |
| `ftfc-opposed` | 95 | -0.13 | 365 | -0.01 | -0.12 | 66% vs 76% |
| `rr-strong` | 10 | -0.32 | 450 | -0.03 | -0.29 | 40% vs 74% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 128 | 77% | 99 | 78% | -0.04 | -0.03 | -3.92 |
| 2-2 Continuation | 113 | 72% | 81 | 60% | -0.06 | -0.04 | -4.99 |
| 2-1-2 Reversal | 53 | 81% | 43 | 77% | -0.05 | -0.04 | -2.33 |
| 2-1-2 Continuation | 50 | 76% | 38 | 82% | -0.14 | -0.11 | -5.39 |
| Rev Strat (1-2-2) Reversal | 34 | 71% | 24 | 83% | +0.03 | +0.02 | +0.75 |
| 3-1-2 Reversal | 32 | 56% | 18 | 78% | +0.03 | +0.02 | +0.57 |
| 3-2-2 Reversal | 20 | 70% | 14 | 79% | +0.11 | +0.08 | +1.53 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 13 | 77% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 299 | 71% | 213 | 73% | -0.02 | -0.02 | -4.60 |
| W | 123 | 74% | 91 | 76% | -0.10 | -0.08 | -9.55 |
| M | 38 | 100% | 38 | 74% | -0.05 | -0.05 | -1.89 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 364 | 74% | 269 | 76% | -0.01 | -0.01 | -3.48 |
| Mixed | 95 | 77% | 73 | 66% | -0.17 | -0.13 | -12.56 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 193 | 75% | 144 | 67% | -0.09 | -0.07 | -12.64 |
| Reversal | 267 | 74% | 198 | 78% | -0.02 | -0.01 | -3.40 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 308 | 74% | 228 | 72% | -0.03 | -0.02 | -6.40 |
| Inside-bar compression (X-1-?) | 152 | 75% | 114 | 77% | -0.08 | -0.06 | -9.64 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| XLI | 15 | 80% | 12 | 92% | +0.32 | +0.25 | +3.82 |
| ETH-USD | 10 | 70% | 7 | 71% | +0.34 | +0.24 | +2.38 |
| AMZN | 15 | 93% | 14 | 93% | +0.24 | +0.23 | +3.43 |
| GLD | 15 | 60% | 9 | 89% | +0.27 | +0.16 | +2.47 |
| XLP | 9 | 78% | 7 | 100% | +0.18 | +0.14 | +1.23 |
| META | 17 | 76% | 13 | 92% | +0.15 | +0.12 | +2.01 |
| DIA | 19 | 79% | 15 | 93% | +0.15 | +0.12 | +2.25 |
| JUP-USD | 18 | 22% | 4 | 100% | +0.50 | +0.11 | +2.01 |
| BTC-USD | 11 | 91% | 10 | 60% | +0.04 | +0.04 | +0.41 |
| XRP-USD | 19 | 53% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| AMD | 12 | 100% | 12 | 92% | +0.01 | +0.01 | +0.14 |
| SPY | 11 | 73% | 8 | 88% | +0.00 | +0.00 | +0.00 |
| XLC | 11 | 91% | 10 | 90% | -0.01 | -0.01 | -0.11 |
| EURUSD=X | 13 | 8% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| IWM | 13 | 62% | 8 | 75% | -0.03 | -0.02 | -0.25 |
| XLU | 14 | 86% | 12 | 67% | -0.04 | -0.03 | -0.49 |
| HYPE-USD | 11 | 73% | 8 | 38% | -0.07 | -0.05 | -0.55 |
| TSLA | 14 | 71% | 10 | 80% | -0.07 | -0.05 | -0.71 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| XLK | 13 | 92% | 12 | 83% | -0.08 | -0.08 | -1.02 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| QQQ | 11 | 91% | 10 | 80% | -0.16 | -0.14 | -1.59 |
| SMH | 14 | 100% | 14 | 71% | -0.16 | -0.16 | -2.22 |
| XLE | 15 | 80% | 12 | 58% | -0.20 | -0.16 | -2.41 |
| XLF | 18 | 83% | 15 | 67% | -0.20 | -0.17 | -2.99 |
| GOOGL | 11 | 100% | 11 | 64% | -0.18 | -0.18 | -1.98 |
| SOL-USD | 15 | 67% | 10 | 50% | -0.32 | -0.21 | -3.22 |
| XLV | 7 | 86% | 6 | 67% | -0.26 | -0.23 | -1.58 |
| NVDA | 17 | 65% | 11 | 73% | -0.35 | -0.23 | -3.90 |
| TLT | 13 | 54% | 7 | 57% | -0.44 | -0.24 | -3.09 |
| MSFT | 13 | 92% | 12 | 67% | -0.26 | -0.24 | -3.10 |
| AAPL | 13 | 85% | 11 | 64% | -0.32 | -0.27 | -3.54 |
| GC=F | 16 | 63% | 10 | 60% | -0.50 | -0.31 | -5.02 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
