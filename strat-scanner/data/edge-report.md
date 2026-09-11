# Edge Report — live signal record

_Generated 2026-09-11_ · **519** settled signals from 2026-08-17 to 2026-09-11 · 30 open, 60 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **75%** of published signals actually triggered (387 of 519) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy -0.06R per trade taken**, -0.04R per signal published.
- Promised **0.82R** to target 1 on average; delivered **-0.06R**.
- Trades ran **0.61R** in favour at best and **0.63R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 217 | 71% | 153 | 78% | -0.09 | -0.06 | -13.53 |
| 55–64 | 225 | 76% | 170 | 71% | -0.04 | -0.03 | -6.95 |
| 65–74 (High) | 68 | 84% | 57 | 67% | -0.03 | -0.03 | -1.92 |
| 75+ (High) | 9 | 78% | 7 | 71% | +0.06 | +0.05 | +0.45 |

Spearman rank correlation between confidence and realised R: **0.099** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 96 | +0.08 | 423 | -0.07 | +0.15 | 63% vs 75% |
| `rr-poor` | 367 | -0.01 | 152 | -0.11 | +0.09 | 85% vs 37% |
| `ftfc-full` | 417 | -0.03 | 102 | -0.11 | +0.09 | 75% vs 67% |
| `close-location` | 281 | -0.02 | 238 | -0.07 | +0.05 | 74% vs 72% |
| `reversal-backed` | 304 | -0.03 | 215 | -0.06 | +0.04 | 77% vs 68% |
| `compression` | 174 | -0.03 | 345 | -0.05 | +0.01 | 79% vs 70% |
| `in-force` | 266 | -0.04 | 253 | -0.04 | -0.01 | 77% vs 66% |
| `base` | 519 | -0.04 | 0 | +0.00 | -0.04 | 73% vs 0% |
| `rr-ok` | 138 | -0.08 | 381 | -0.03 | -0.05 | 37% vs 83% |
| `ftfc-aligned` | 101 | -0.11 | 418 | -0.02 | -0.09 | 67% vs 75% |
| `ftfc-opposed` | 101 | -0.11 | 418 | -0.02 | -0.09 | 67% vs 75% |
| `rr-strong` | 14 | -0.37 | 505 | -0.03 | -0.34 | 33% vs 74% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 144 | 78% | 112 | 76% | -0.07 | -0.05 | -7.91 |
| 2-2 Continuation | 124 | 73% | 90 | 60% | -0.09 | -0.07 | -8.27 |
| 2-1-2 Reversal | 62 | 81% | 50 | 80% | -0.00 | -0.00 | -0.16 |
| 2-1-2 Continuation | 59 | 78% | 46 | 83% | -0.07 | -0.06 | -3.45 |
| Rev Strat (1-2-2) Reversal | 39 | 69% | 27 | 81% | -0.02 | -0.01 | -0.41 |
| 3-1-2 Reversal | 36 | 61% | 22 | 77% | +0.01 | +0.00 | +0.16 |
| 3-2-2 Reversal | 24 | 63% | 15 | 73% | +0.02 | +0.01 | +0.33 |
| 1-1-2 Continuation | 17 | 88% | 15 | 67% | -0.17 | -0.15 | -2.48 |
| 3-2 Continuation | 14 | 71% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 320 | 71% | 228 | 73% | -0.03 | -0.02 | -6.68 |
| W | 148 | 73% | 108 | 76% | -0.09 | -0.06 | -9.30 |
| M | 51 | 100% | 51 | 69% | -0.12 | -0.12 | -5.98 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 417 | 74% | 309 | 75% | -0.03 | -0.03 | -10.43 |
| Mixed | 101 | 77% | 78 | 67% | -0.15 | -0.11 | -11.52 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 214 | 75% | 161 | 68% | -0.09 | -0.07 | -13.97 |
| Reversal | 305 | 74% | 226 | 77% | -0.04 | -0.03 | -7.98 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 345 | 74% | 254 | 70% | -0.06 | -0.05 | -16.04 |
| Inside-bar compression (X-1-?) | 174 | 76% | 133 | 79% | -0.04 | -0.03 | -5.92 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| ETH-USD | 11 | 73% | 8 | 75% | +0.31 | +0.23 | +2.51 |
| AMZN | 16 | 88% | 14 | 93% | +0.24 | +0.21 | +3.43 |
| XLI | 19 | 79% | 15 | 87% | +0.22 | +0.17 | +3.29 |
| GLD | 18 | 67% | 12 | 92% | +0.24 | +0.16 | +2.83 |
| XLP | 10 | 80% | 8 | 100% | +0.18 | +0.14 | +1.45 |
| META | 19 | 74% | 14 | 93% | +0.18 | +0.13 | +2.54 |
| DIA | 21 | 76% | 16 | 94% | +0.14 | +0.11 | +2.25 |
| JUP-USD | 20 | 20% | 4 | 100% | +0.50 | +0.10 | +2.01 |
| XRP-USD | 19 | 53% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| AMD | 13 | 100% | 13 | 92% | +0.02 | +0.02 | +0.22 |
| EURUSD=X | 15 | 7% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| XLV | 12 | 83% | 10 | 70% | -0.02 | -0.02 | -0.25 |
| XLU | 15 | 87% | 13 | 69% | -0.03 | -0.03 | -0.42 |
| HYPE-USD | 12 | 75% | 9 | 44% | -0.04 | -0.03 | -0.36 |
| IWM | 17 | 65% | 11 | 73% | -0.07 | -0.05 | -0.79 |
| BTC-USD | 12 | 92% | 11 | 55% | -0.05 | -0.05 | -0.59 |
| TSLA | 14 | 71% | 10 | 80% | -0.07 | -0.05 | -0.71 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| XLK | 15 | 93% | 14 | 86% | -0.07 | -0.07 | -1.02 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| QQQ | 12 | 92% | 11 | 82% | -0.14 | -0.13 | -1.58 |
| SPY | 14 | 79% | 11 | 73% | -0.18 | -0.14 | -1.98 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| TLT | 17 | 65% | 11 | 64% | -0.26 | -0.17 | -2.81 |
| XLF | 22 | 82% | 18 | 67% | -0.21 | -0.17 | -3.85 |
| XLC | 13 | 92% | 12 | 75% | -0.19 | -0.18 | -2.34 |
| GOOGL | 14 | 93% | 13 | 62% | -0.21 | -0.20 | -2.74 |
| AAPL | 15 | 87% | 13 | 69% | -0.24 | -0.21 | -3.16 |
| SOL-USD | 15 | 67% | 10 | 50% | -0.32 | -0.21 | -3.22 |
| NVDA | 18 | 67% | 12 | 75% | -0.32 | -0.22 | -3.90 |
| MSFT | 13 | 92% | 12 | 67% | -0.26 | -0.24 | -3.10 |
| GC=F | 18 | 61% | 11 | 64% | -0.46 | -0.28 | -5.02 |
| XLE | 17 | 82% | 14 | 50% | -0.34 | -0.28 | -4.78 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
