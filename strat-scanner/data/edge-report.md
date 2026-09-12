# Edge Report — live signal record

_Generated 2026-09-12_ · **537** settled signals from 2026-08-17 to 2026-09-12 · 32 open, 62 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **74%** of published signals actually triggered (398 of 537) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 4% timed out.
- **Expectancy -0.07R per trade taken**, -0.05R per signal published.
- Promised **0.81R** to target 1 on average; delivered **-0.07R**.
- Trades ran **0.60R** in favour at best and **0.63R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 227 | 70% | 159 | 78% | -0.10 | -0.07 | -15.14 |
| 55–64 | 232 | 75% | 174 | 70% | -0.06 | -0.04 | -9.97 |
| 65–74 (High) | 69 | 84% | 58 | 67% | -0.03 | -0.03 | -1.92 |
| 75+ (High) | 9 | 78% | 7 | 71% | +0.06 | +0.05 | +0.45 |

Spearman rank correlation between confidence and realised R: **0.089** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 102 | +0.07 | 435 | -0.08 | +0.15 | 63% vs 75% |
| `rr-poor` | 379 | -0.02 | 158 | -0.12 | +0.10 | 84% vs 35% |
| `ftfc-full` | 429 | -0.03 | 108 | -0.12 | +0.09 | 75% vs 66% |
| `close-location` | 290 | -0.03 | 247 | -0.07 | +0.05 | 74% vs 72% |
| `reversal-backed` | 319 | -0.03 | 218 | -0.07 | +0.04 | 77% vs 67% |
| `compression` | 176 | -0.03 | 361 | -0.06 | +0.02 | 79% vs 70% |
| `in-force` | 274 | -0.06 | 263 | -0.04 | -0.02 | 76% vs 66% |
| `base` | 537 | -0.05 | 0 | +0.00 | -0.05 | 73% vs 0% |
| `rr-ok` | 144 | -0.10 | 393 | -0.03 | -0.07 | 36% vs 83% |
| `ftfc-aligned` | 107 | -0.13 | 430 | -0.03 | -0.10 | 66% vs 75% |
| `ftfc-opposed` | 107 | -0.13 | 430 | -0.03 | -0.10 | 66% vs 75% |
| `rr-strong` | 14 | -0.37 | 523 | -0.04 | -0.33 | 33% vs 74% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 153 | 76% | 117 | 75% | -0.08 | -0.06 | -9.52 |
| 2-2 Continuation | 127 | 72% | 92 | 59% | -0.11 | -0.08 | -10.27 |
| 2-1-2 Reversal | 63 | 79% | 50 | 80% | -0.00 | -0.00 | -0.16 |
| 2-1-2 Continuation | 59 | 78% | 46 | 83% | -0.07 | -0.06 | -3.45 |
| Rev Strat (1-2-2) Reversal | 41 | 71% | 29 | 79% | -0.05 | -0.03 | -1.42 |
| 3-1-2 Reversal | 37 | 62% | 23 | 78% | +0.01 | +0.00 | +0.16 |
| 3-2-2 Reversal | 26 | 62% | 16 | 75% | +0.02 | +0.01 | +0.33 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 14 | 71% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 331 | 71% | 235 | 73% | -0.04 | -0.03 | -9.48 |
| W | 154 | 72% | 111 | 76% | -0.09 | -0.07 | -10.11 |
| M | 52 | 100% | 52 | 67% | -0.13 | -0.13 | -6.99 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 429 | 73% | 315 | 75% | -0.04 | -0.03 | -13.12 |
| Mixed | 107 | 78% | 83 | 66% | -0.16 | -0.13 | -13.46 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 217 | 75% | 163 | 67% | -0.10 | -0.07 | -15.97 |
| Reversal | 320 | 73% | 235 | 77% | -0.05 | -0.03 | -10.60 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 361 | 73% | 264 | 70% | -0.08 | -0.06 | -20.66 |
| Inside-bar compression (X-1-?) | 176 | 76% | 134 | 79% | -0.04 | -0.03 | -5.92 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| AMZN | 17 | 88% | 15 | 93% | +0.24 | +0.21 | +3.56 |
| XLI | 20 | 75% | 15 | 87% | +0.22 | +0.16 | +3.29 |
| GLD | 18 | 67% | 12 | 92% | +0.24 | +0.16 | +2.83 |
| XLP | 11 | 73% | 8 | 100% | +0.18 | +0.13 | +1.45 |
| META | 20 | 70% | 14 | 93% | +0.18 | +0.13 | +2.54 |
| ETH-USD | 12 | 75% | 9 | 67% | +0.17 | +0.13 | +1.51 |
| JUP-USD | 21 | 19% | 4 | 100% | +0.50 | +0.10 | +2.01 |
| DIA | 23 | 78% | 18 | 89% | +0.07 | +0.06 | +1.31 |
| XRP-USD | 19 | 53% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| EURUSD=X | 15 | 7% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| XLU | 15 | 87% | 13 | 69% | -0.03 | -0.03 | -0.42 |
| HYPE-USD | 12 | 75% | 9 | 44% | -0.04 | -0.03 | -0.36 |
| IWM | 18 | 61% | 11 | 73% | -0.07 | -0.04 | -0.79 |
| BTC-USD | 12 | 92% | 11 | 55% | -0.05 | -0.05 | -0.59 |
| TSLA | 14 | 71% | 10 | 80% | -0.07 | -0.05 | -0.71 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| AMD | 14 | 100% | 14 | 86% | -0.06 | -0.06 | -0.78 |
| XLK | 16 | 94% | 15 | 87% | -0.07 | -0.06 | -1.02 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| XLV | 13 | 85% | 11 | 64% | -0.11 | -0.10 | -1.25 |
| QQQ | 12 | 92% | 11 | 82% | -0.14 | -0.13 | -1.58 |
| SPY | 14 | 79% | 11 | 73% | -0.18 | -0.14 | -1.98 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| XLC | 15 | 93% | 14 | 79% | -0.17 | -0.16 | -2.34 |
| TLT | 17 | 65% | 11 | 64% | -0.26 | -0.17 | -2.81 |
| XLF | 22 | 82% | 18 | 67% | -0.21 | -0.17 | -3.85 |
| GOOGL | 14 | 93% | 13 | 62% | -0.21 | -0.20 | -2.74 |
| NVDA | 19 | 63% | 12 | 75% | -0.32 | -0.21 | -3.90 |
| SOL-USD | 15 | 67% | 10 | 50% | -0.32 | -0.21 | -3.22 |
| AAPL | 17 | 88% | 15 | 67% | -0.27 | -0.23 | -3.98 |
| MSFT | 13 | 92% | 12 | 67% | -0.26 | -0.24 | -3.10 |
| GC=F | 18 | 61% | 11 | 64% | -0.46 | -0.28 | -5.02 |
| XLE | 17 | 82% | 14 | 50% | -0.34 | -0.28 | -4.78 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
