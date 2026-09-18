# Edge Report — live signal record

_Generated 2026-09-18_ · **656** settled signals from 2026-08-17 to 2026-09-18 · 39 open, 38 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **71%** of published signals actually triggered (464 of 656) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.05R per trade taken**, -0.03R per signal published.
- Promised **0.80R** to target 1 on average; delivered **-0.05R**.
- Trades ran **0.64R** in favour at best and **0.65R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 283 | 65% | 184 | 78% | -0.08 | -0.05 | -14.95 |
| 55–64 | 279 | 73% | 205 | 71% | -0.01 | -0.01 | -2.62 |
| 65–74 (High) | 82 | 80% | 66 | 62% | -0.10 | -0.08 | -6.58 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.038** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 125 | +0.06 | 531 | -0.06 | +0.12 | 66% vs 74% |
| `rr-strong` | 17 | +0.05 | 639 | -0.04 | +0.09 | 42% vs 73% |
| `close-location` | 352 | -0.00 | 304 | -0.07 | +0.06 | 75% vs 70% |
| `rr-poor` | 459 | -0.02 | 197 | -0.07 | +0.05 | 83% vs 37% |
| `reversal-backed` | 390 | -0.02 | 266 | -0.06 | +0.04 | 78% vs 65% |
| `ftfc-aligned` | 132 | -0.03 | 524 | -0.04 | +0.01 | 70% vs 73% |
| `ftfc-opposed` | 132 | -0.03 | 524 | -0.04 | +0.01 | 70% vs 73% |
| `compression` | 223 | -0.03 | 433 | -0.04 | +0.00 | 76% vs 71% |
| `ftfc-full` | 523 | -0.04 | 133 | -0.03 | -0.01 | 73% vs 70% |
| `base` | 656 | -0.03 | 0 | +0.00 | -0.03 | 73% vs 0% |
| `in-force` | 317 | -0.05 | 339 | -0.02 | -0.04 | 75% vs 67% |
| `rr-ok` | 180 | -0.08 | 476 | -0.02 | -0.07 | 36% vs 82% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 181 | 72% | 131 | 76% | -0.07 | -0.05 | -9.58 |
| 2-2 Continuation | 155 | 66% | 103 | 59% | -0.07 | -0.05 | -7.37 |
| 2-1-2 Reversal | 86 | 74% | 64 | 80% | +0.03 | +0.02 | +1.75 |
| 2-1-2 Continuation | 73 | 78% | 57 | 72% | -0.22 | -0.17 | -12.29 |
| Rev Strat (1-2-2) Reversal | 51 | 69% | 35 | 80% | +0.01 | +0.01 | +0.37 |
| 3-1-2 Reversal | 44 | 61% | 27 | 78% | -0.03 | -0.02 | -0.84 |
| 3-2-2 Reversal | 29 | 66% | 19 | 79% | +0.05 | +0.03 | +0.94 |
| 1-1-2 Continuation | 20 | 85% | 17 | 71% | +0.25 | +0.21 | +4.17 |
| 3-2 Continuation | 17 | 65% | 11 | 73% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 400 | 68% | 270 | 72% | -0.04 | -0.03 | -11.83 |
| W | 183 | 73% | 133 | 76% | -0.07 | -0.05 | -9.71 |
| M | 73 | 84% | 61 | 67% | -0.02 | -0.02 | -1.10 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 523 | 69% | 360 | 73% | -0.05 | -0.04 | -19.26 |
| Mixed | 132 | 79% | 104 | 70% | -0.03 | -0.03 | -3.37 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 265 | 71% | 188 | 65% | -0.08 | -0.06 | -15.27 |
| Reversal | 391 | 71% | 276 | 78% | -0.03 | -0.02 | -7.36 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 433 | 69% | 299 | 71% | -0.05 | -0.04 | -15.42 |
| Inside-bar compression (X-1-?) | 223 | 74% | 165 | 76% | -0.04 | -0.03 | -7.22 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 13 | 85% | 11 | 91% | +0.42 | +0.36 | +4.62 |
| AMD | 18 | 100% | 18 | 83% | +0.33 | +0.33 | +6.01 |
| AMZN | 18 | 83% | 15 | 93% | +0.24 | +0.20 | +3.56 |
| DIA | 28 | 79% | 22 | 91% | +0.22 | +0.17 | +4.83 |
| ETH-USD | 15 | 80% | 12 | 75% | +0.17 | +0.14 | +2.07 |
| XLI | 24 | 67% | 16 | 88% | +0.21 | +0.14 | +3.32 |
| META | 23 | 61% | 14 | 93% | +0.18 | +0.11 | +2.54 |
| JUP-USD | 26 | 15% | 4 | 100% | +0.50 | +0.08 | +2.01 |
| GLD | 22 | 59% | 13 | 85% | +0.06 | +0.04 | +0.81 |
| XRP-USD | 24 | 54% | 13 | 62% | +0.05 | +0.03 | +0.68 |
| EURUSD=X | 21 | 14% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| BTC-USD | 14 | 93% | 13 | 62% | +0.01 | +0.01 | +0.12 |
| XLU | 20 | 90% | 18 | 72% | +0.00 | +0.00 | +0.05 |
| XLP | 16 | 81% | 13 | 85% | -0.00 | -0.00 | -0.02 |
| IWM | 23 | 57% | 13 | 69% | -0.05 | -0.03 | -0.62 |
| XLY | 14 | 86% | 12 | 83% | -0.06 | -0.05 | -0.76 |
| XLV | 16 | 81% | 13 | 69% | -0.07 | -0.06 | -0.94 |
| HYPE-USD | 15 | 73% | 11 | 45% | -0.10 | -0.07 | -1.09 |
| SMH | 18 | 83% | 15 | 73% | -0.10 | -0.08 | -1.44 |
| TSLA | 18 | 67% | 12 | 75% | -0.12 | -0.08 | -1.47 |
| MSFT | 16 | 94% | 15 | 73% | -0.09 | -0.09 | -1.37 |
| XLF | 24 | 79% | 19 | 68% | -0.12 | -0.10 | -2.34 |
| XLK | 19 | 89% | 17 | 82% | -0.12 | -0.11 | -2.02 |
| NVDA | 22 | 59% | 13 | 77% | -0.18 | -0.11 | -2.37 |
| XLC | 17 | 88% | 15 | 80% | -0.14 | -0.12 | -2.07 |
| SOL-USD | 18 | 67% | 12 | 58% | -0.21 | -0.14 | -2.48 |
| TLT | 20 | 55% | 11 | 64% | -0.26 | -0.14 | -2.81 |
| SPY | 18 | 67% | 12 | 67% | -0.25 | -0.17 | -2.98 |
| GOOGL | 17 | 94% | 16 | 63% | -0.18 | -0.17 | -2.87 |
| AAPL | 21 | 76% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| DOGE-USD | 18 | 72% | 13 | 31% | -0.30 | -0.21 | -3.84 |
| QQQ | 15 | 87% | 13 | 69% | -0.29 | -0.25 | -3.75 |
| GC=F | 23 | 61% | 14 | 57% | -0.50 | -0.30 | -6.96 |
| XLE | 22 | 77% | 17 | 47% | -0.45 | -0.35 | -7.67 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
