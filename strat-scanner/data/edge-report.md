# Edge Report — live signal record

_Generated 2026-09-14_ · **565** settled signals from 2026-08-17 to 2026-09-13 · 31 open, 56 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **71%** of published signals actually triggered (402 of 565) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.07R per trade taken**, -0.05R per signal published.
- Promised **0.81R** to target 1 on average; delivered **-0.07R**.
- Trades ran **0.60R** in favour at best and **0.63R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 244 | 67% | 163 | 78% | -0.10 | -0.06 | -15.79 |
| 55–64 | 243 | 72% | 174 | 70% | -0.06 | -0.04 | -9.97 |
| 65–74 (High) | 69 | 84% | 58 | 67% | -0.03 | -0.03 | -1.92 |
| 75+ (High) | 9 | 78% | 7 | 71% | +0.06 | +0.05 | +0.45 |

Spearman rank correlation between confidence and realised R: **0.089** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 109 | +0.07 | 456 | -0.08 | +0.14 | 64% vs 75% |
| `rr-poor` | 396 | -0.02 | 169 | -0.12 | +0.10 | 84% vs 35% |
| `ftfc-full` | 451 | -0.03 | 114 | -0.11 | +0.08 | 74% vs 67% |
| `close-location` | 306 | -0.03 | 259 | -0.07 | +0.05 | 74% vs 72% |
| `reversal-backed` | 338 | -0.03 | 227 | -0.07 | +0.04 | 77% vs 66% |
| `compression` | 182 | -0.03 | 383 | -0.06 | +0.02 | 79% vs 70% |
| `in-force` | 276 | -0.06 | 289 | -0.04 | -0.02 | 76% vs 66% |
| `base` | 565 | -0.05 | 0 | +0.00 | -0.05 | 73% vs 0% |
| `rr-ok` | 155 | -0.10 | 410 | -0.03 | -0.07 | 35% vs 83% |
| `ftfc-aligned` | 113 | -0.12 | 452 | -0.03 | -0.08 | 67% vs 74% |
| `ftfc-opposed` | 113 | -0.12 | 452 | -0.03 | -0.08 | 67% vs 74% |
| `rr-strong` | 14 | -0.37 | 551 | -0.04 | -0.33 | 33% vs 74% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 165 | 72% | 119 | 76% | -0.08 | -0.06 | -9.25 |
| 2-2 Continuation | 134 | 69% | 93 | 58% | -0.12 | -0.08 | -11.27 |
| 2-1-2 Reversal | 65 | 77% | 50 | 80% | -0.00 | -0.00 | -0.16 |
| 2-1-2 Continuation | 59 | 78% | 46 | 83% | -0.07 | -0.06 | -3.45 |
| Rev Strat (1-2-2) Reversal | 42 | 69% | 29 | 79% | -0.05 | -0.03 | -1.42 |
| 3-1-2 Reversal | 41 | 59% | 24 | 79% | +0.01 | +0.01 | +0.25 |
| 3-2-2 Reversal | 26 | 62% | 16 | 75% | +0.02 | +0.01 | +0.33 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 16 | 63% | 10 | 70% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 353 | 67% | 236 | 73% | -0.04 | -0.03 | -9.40 |
| W | 160 | 71% | 114 | 75% | -0.10 | -0.07 | -10.84 |
| M | 52 | 100% | 52 | 67% | -0.13 | -0.13 | -6.99 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 451 | 70% | 316 | 74% | -0.04 | -0.03 | -14.12 |
| Mixed | 113 | 76% | 86 | 67% | -0.15 | -0.12 | -13.10 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 226 | 73% | 164 | 66% | -0.10 | -0.08 | -16.97 |
| Reversal | 339 | 70% | 238 | 77% | -0.04 | -0.03 | -10.25 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 383 | 70% | 267 | 70% | -0.08 | -0.06 | -21.39 |
| Inside-bar compression (X-1-?) | 182 | 74% | 135 | 79% | -0.04 | -0.03 | -5.84 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| AMZN | 17 | 88% | 15 | 93% | +0.24 | +0.21 | +3.56 |
| XLI | 21 | 71% | 15 | 87% | +0.22 | +0.16 | +3.29 |
| GLD | 20 | 60% | 12 | 92% | +0.24 | +0.14 | +2.83 |
| XLP | 11 | 73% | 8 | 100% | +0.18 | +0.13 | +1.45 |
| ETH-USD | 13 | 77% | 10 | 70% | +0.15 | +0.12 | +1.51 |
| META | 22 | 64% | 14 | 93% | +0.18 | +0.12 | +2.54 |
| JUP-USD | 22 | 18% | 4 | 100% | +0.50 | +0.09 | +2.01 |
| DIA | 23 | 78% | 18 | 89% | +0.07 | +0.06 | +1.31 |
| XRP-USD | 20 | 50% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| EURUSD=X | 16 | 6% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| XLU | 15 | 87% | 13 | 69% | -0.03 | -0.03 | -0.42 |
| BTC-USD | 13 | 92% | 12 | 58% | -0.04 | -0.04 | -0.51 |
| IWM | 20 | 55% | 11 | 73% | -0.07 | -0.04 | -0.79 |
| TSLA | 15 | 67% | 10 | 80% | -0.07 | -0.05 | -0.71 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| AMD | 14 | 100% | 14 | 86% | -0.06 | -0.06 | -0.78 |
| XLK | 16 | 94% | 15 | 87% | -0.07 | -0.06 | -1.02 |
| HYPE-USD | 14 | 79% | 11 | 45% | -0.10 | -0.08 | -1.09 |
| XLV | 14 | 79% | 11 | 64% | -0.11 | -0.09 | -1.25 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| QQQ | 13 | 85% | 11 | 82% | -0.14 | -0.12 | -1.58 |
| SPY | 16 | 69% | 11 | 73% | -0.18 | -0.12 | -1.98 |
| DOGE-USD | 14 | 71% | 10 | 30% | -0.19 | -0.13 | -1.87 |
| TLT | 19 | 58% | 11 | 64% | -0.26 | -0.15 | -2.81 |
| XLC | 15 | 93% | 14 | 79% | -0.17 | -0.16 | -2.34 |
| XLF | 23 | 78% | 18 | 67% | -0.21 | -0.17 | -3.85 |
| NVDA | 20 | 60% | 12 | 75% | -0.32 | -0.19 | -3.90 |
| GOOGL | 14 | 93% | 13 | 62% | -0.21 | -0.20 | -2.74 |
| SOL-USD | 16 | 63% | 10 | 50% | -0.32 | -0.20 | -3.22 |
| AAPL | 17 | 88% | 15 | 67% | -0.27 | -0.23 | -3.98 |
| MSFT | 13 | 92% | 12 | 67% | -0.26 | -0.24 | -3.10 |
| XLE | 19 | 74% | 14 | 50% | -0.34 | -0.25 | -4.78 |
| GC=F | 19 | 58% | 11 | 64% | -0.46 | -0.26 | -5.02 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
