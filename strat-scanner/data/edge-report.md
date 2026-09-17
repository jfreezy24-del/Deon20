# Edge Report — live signal record

_Generated 2026-09-17_ · **631** settled signals from 2026-08-17 to 2026-09-17 · 40 open, 44 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **72%** of published signals actually triggered (455 of 631) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 25% stopped out, 3% timed out.
- **Expectancy -0.06R per trade taken**, -0.04R per signal published.
- Promised **0.80R** to target 1 on average; delivered **-0.06R**.
- Trades ran **0.63R** in favour at best and **0.65R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 267 | 67% | 178 | 78% | -0.09 | -0.06 | -15.72 |
| 55–64 | 272 | 74% | 202 | 70% | -0.02 | -0.02 | -4.31 |
| 65–74 (High) | 80 | 83% | 66 | 62% | -0.10 | -0.08 | -6.58 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.047** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 121 | +0.05 | 510 | -0.06 | +0.11 | 64% vs 74% |
| `rr-strong` | 17 | +0.05 | 614 | -0.04 | +0.10 | 42% vs 73% |
| `close-location` | 342 | -0.01 | 289 | -0.07 | +0.06 | 74% vs 70% |
| `rr-poor` | 440 | -0.02 | 191 | -0.07 | +0.05 | 83% vs 37% |
| `reversal-backed` | 377 | -0.03 | 254 | -0.06 | +0.03 | 77% vs 65% |
| `ftfc-full` | 502 | -0.04 | 129 | -0.04 | +0.01 | 73% vs 69% |
| `compression` | 211 | -0.04 | 420 | -0.04 | -0.00 | 75% vs 71% |
| `ftfc-aligned` | 128 | -0.04 | 503 | -0.04 | -0.01 | 69% vs 73% |
| `ftfc-opposed` | 128 | -0.04 | 503 | -0.04 | -0.01 | 69% vs 73% |
| `base` | 631 | -0.04 | 0 | +0.00 | -0.04 | 72% vs 0% |
| `in-force` | 309 | -0.07 | 322 | -0.02 | -0.05 | 75% vs 67% |
| `rr-ok` | 174 | -0.09 | 457 | -0.02 | -0.07 | 36% vs 82% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 180 | 73% | 131 | 76% | -0.07 | -0.05 | -9.58 |
| 2-2 Continuation | 148 | 69% | 102 | 59% | -0.08 | -0.06 | -8.33 |
| 2-1-2 Reversal | 79 | 76% | 60 | 78% | -0.01 | -0.01 | -0.64 |
| 2-1-2 Continuation | 70 | 80% | 56 | 73% | -0.20 | -0.16 | -11.25 |
| Rev Strat (1-2-2) Reversal | 47 | 72% | 34 | 79% | +0.01 | +0.01 | +0.30 |
| 3-1-2 Reversal | 43 | 60% | 26 | 77% | -0.04 | -0.02 | -0.94 |
| 3-2-2 Reversal | 29 | 66% | 19 | 79% | +0.05 | +0.03 | +0.94 |
| 1-1-2 Continuation | 19 | 89% | 17 | 71% | +0.25 | +0.22 | +4.17 |
| 3-2 Continuation | 16 | 63% | 10 | 70% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 390 | 68% | 264 | 72% | -0.06 | -0.04 | -15.18 |
| W | 181 | 72% | 131 | 76% | -0.08 | -0.05 | -9.87 |
| M | 60 | 100% | 60 | 68% | -0.00 | -0.00 | -0.05 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 502 | 71% | 355 | 73% | -0.05 | -0.04 | -19.34 |
| Mixed | 128 | 78% | 100 | 69% | -0.06 | -0.04 | -5.76 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 253 | 73% | 185 | 65% | -0.08 | -0.06 | -15.19 |
| Reversal | 378 | 71% | 270 | 77% | -0.04 | -0.03 | -9.91 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 420 | 70% | 296 | 71% | -0.06 | -0.04 | -16.44 |
| Inside-bar compression (X-1-?) | 211 | 75% | 159 | 75% | -0.05 | -0.04 | -8.66 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AMD | 17 | 100% | 17 | 88% | +0.42 | +0.42 | +7.06 |
| LTC-USD | 12 | 83% | 10 | 90% | +0.40 | +0.34 | +4.03 |
| AMZN | 18 | 83% | 15 | 93% | +0.24 | +0.20 | +3.56 |
| DIA | 27 | 81% | 22 | 91% | +0.22 | +0.18 | +4.83 |
| XLI | 23 | 70% | 16 | 88% | +0.21 | +0.14 | +3.32 |
| ETH-USD | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.54 |
| META | 23 | 61% | 14 | 93% | +0.18 | +0.11 | +2.54 |
| JUP-USD | 25 | 16% | 4 | 100% | +0.50 | +0.08 | +2.01 |
| GLD | 22 | 59% | 13 | 85% | +0.06 | +0.04 | +0.81 |
| XRP-USD | 23 | 57% | 13 | 62% | +0.05 | +0.03 | +0.68 |
| EURUSD=X | 21 | 14% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLU | 20 | 90% | 18 | 72% | +0.00 | +0.00 | +0.05 |
| IWM | 22 | 59% | 13 | 69% | -0.05 | -0.03 | -0.62 |
| BTC-USD | 13 | 92% | 12 | 58% | -0.04 | -0.04 | -0.51 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| XLV | 16 | 81% | 13 | 69% | -0.07 | -0.06 | -0.94 |
| XLP | 15 | 80% | 12 | 83% | -0.08 | -0.07 | -0.98 |
| HYPE-USD | 15 | 73% | 11 | 45% | -0.10 | -0.07 | -1.09 |
| MSFT | 16 | 94% | 15 | 73% | -0.09 | -0.09 | -1.37 |
| TSLA | 17 | 71% | 12 | 75% | -0.12 | -0.09 | -1.47 |
| SMH | 16 | 94% | 15 | 73% | -0.10 | -0.09 | -1.44 |
| XLF | 24 | 79% | 19 | 68% | -0.12 | -0.10 | -2.34 |
| NVDA | 21 | 62% | 13 | 77% | -0.18 | -0.11 | -2.37 |
| XLK | 17 | 94% | 16 | 81% | -0.13 | -0.12 | -2.02 |
| XLC | 16 | 94% | 15 | 80% | -0.14 | -0.13 | -2.07 |
| TLT | 19 | 58% | 11 | 64% | -0.26 | -0.15 | -2.81 |
| GOOGL | 17 | 94% | 16 | 63% | -0.18 | -0.17 | -2.87 |
| SPY | 17 | 71% | 12 | 67% | -0.25 | -0.18 | -2.98 |
| SOL-USD | 17 | 65% | 11 | 55% | -0.28 | -0.18 | -3.12 |
| AAPL | 19 | 79% | 15 | 67% | -0.27 | -0.21 | -3.98 |
| DOGE-USD | 17 | 76% | 13 | 31% | -0.30 | -0.23 | -3.84 |
| QQQ | 15 | 87% | 13 | 69% | -0.29 | -0.25 | -3.75 |
| GC=F | 21 | 62% | 13 | 54% | -0.54 | -0.33 | -7.02 |
| XLE | 22 | 77% | 17 | 47% | -0.45 | -0.35 | -7.67 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
