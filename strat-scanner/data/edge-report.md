# Edge Report — live signal record

_Generated 2026-09-06_ · **421** settled signals from 2026-08-17 to 2026-09-06 · 40 open, 71 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (323 of 421) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.04R per trade taken**, -0.03R per signal published.
- Promised **0.80R** to target 1 on average; delivered **-0.04R**.
- Trades ran **0.62R** in favour at best and **0.62R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 171 | 73% | 124 | 80% | -0.08 | -0.05 | -9.36 |
| 55–64 | 188 | 79% | 148 | 72% | -0.02 | -0.01 | -2.73 |
| 65–74 (High) | 55 | 84% | 46 | 70% | +0.01 | +0.01 | +0.46 |
| 75+ (High) | 7 | 71% | 5 | 60% | -0.22 | -0.16 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.122** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `ftfc-full` | 334 | +0.01 | 87 | -0.18 | +0.18 | 77% vs 64% |
| `volume` | 80 | +0.10 | 341 | -0.06 | +0.17 | 62% vs 77% |
| `rr-poor` | 300 | -0.00 | 121 | -0.09 | +0.09 | 86% vs 36% |
| `reversal-backed` | 245 | -0.02 | 176 | -0.05 | +0.03 | 79% vs 68% |
| `in-force` | 233 | -0.02 | 188 | -0.04 | +0.02 | 78% vs 64% |
| `close-location` | 237 | -0.04 | 184 | -0.02 | -0.03 | 73% vs 76% |
| `base` | 421 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `compression` | 138 | -0.05 | 283 | -0.02 | -0.03 | 78% vs 72% |
| `rr-ok` | 112 | -0.07 | 309 | -0.01 | -0.06 | 37% vs 85% |
| `ftfc-aligned` | 86 | -0.18 | 335 | +0.01 | -0.18 | 64% vs 77% |
| `ftfc-opposed` | 86 | -0.18 | 335 | +0.01 | -0.18 | 64% vs 77% |
| `rr-strong` | 9 | -0.36 | 412 | -0.02 | -0.34 | 25% vs 75% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 117 | 81% | 95 | 78% | -0.04 | -0.03 | -3.63 |
| 2-2 Continuation | 105 | 73% | 77 | 60% | -0.05 | -0.04 | -4.13 |
| 2-1-2 Reversal | 49 | 82% | 40 | 75% | -0.08 | -0.06 | -3.02 |
| 2-1-2 Continuation | 43 | 81% | 35 | 86% | -0.07 | -0.06 | -2.45 |
| 3-1-2 Reversal | 32 | 56% | 18 | 78% | +0.03 | +0.02 | +0.57 |
| Rev Strat (1-2-2) Reversal | 31 | 71% | 22 | 86% | +0.07 | +0.05 | +1.54 |
| 3-2-2 Reversal | 17 | 76% | 13 | 85% | +0.03 | +0.02 | +0.34 |
| 1-1-2 Continuation | 14 | 93% | 13 | 69% | -0.17 | -0.16 | -2.19 |
| 3-2 Continuation | 13 | 77% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 278 | 73% | 202 | 73% | -0.02 | -0.01 | -3.86 |
| W | 109 | 80% | 87 | 76% | -0.11 | -0.08 | -9.19 |
| M | 34 | 100% | 34 | 76% | +0.01 | +0.01 | +0.29 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 334 | 77% | 257 | 77% | +0.01 | +0.01 | +2.48 |
| Mixed | 86 | 77% | 66 | 64% | -0.23 | -0.18 | -15.24 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 175 | 77% | 135 | 68% | -0.06 | -0.05 | -8.54 |
| Reversal | 246 | 76% | 188 | 79% | -0.02 | -0.02 | -4.21 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 283 | 77% | 217 | 72% | -0.03 | -0.02 | -5.66 |
| Inside-bar compression (X-1-?) | 138 | 77% | 106 | 78% | -0.07 | -0.05 | -7.09 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| ETH-USD | 9 | 78% | 7 | 71% | +0.34 | +0.26 | +2.38 |
| XLI | 15 | 80% | 12 | 92% | +0.32 | +0.25 | +3.82 |
| AMZN | 15 | 93% | 14 | 93% | +0.24 | +0.23 | +3.43 |
| GLD | 14 | 64% | 9 | 89% | +0.27 | +0.18 | +2.47 |
| BTC-USD | 10 | 90% | 9 | 67% | +0.16 | +0.14 | +1.41 |
| JUP-USD | 15 | 27% | 4 | 100% | +0.50 | +0.13 | +2.01 |
| META | 16 | 81% | 13 | 92% | +0.15 | +0.13 | +2.01 |
| DIA | 17 | 76% | 13 | 92% | +0.13 | +0.10 | +1.67 |
| XLP | 8 | 75% | 6 | 100% | +0.09 | +0.06 | +0.52 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XRP-USD | 17 | 59% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| SPY | 10 | 80% | 8 | 88% | +0.00 | +0.00 | +0.00 |
| XLC | 11 | 91% | 10 | 90% | -0.01 | -0.01 | -0.11 |
| EURUSD=X | 11 | 9% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| IWM | 12 | 67% | 8 | 75% | -0.03 | -0.02 | -0.25 |
| AMD | 10 | 100% | 10 | 90% | -0.04 | -0.04 | -0.42 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| QQQ | 10 | 90% | 9 | 89% | -0.07 | -0.06 | -0.59 |
| TSLA | 12 | 75% | 9 | 78% | -0.09 | -0.07 | -0.84 |
| XLK | 13 | 92% | 12 | 83% | -0.08 | -0.08 | -1.02 |
| HYPE-USD | 9 | 78% | 7 | 29% | -0.11 | -0.09 | -0.77 |
| XLF | 17 | 82% | 14 | 71% | -0.14 | -0.12 | -1.99 |
| XLU | 12 | 92% | 11 | 73% | -0.15 | -0.14 | -1.68 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| SMH | 14 | 100% | 14 | 71% | -0.16 | -0.16 | -2.22 |
| XLE | 14 | 86% | 12 | 58% | -0.20 | -0.17 | -2.41 |
| GOOGL | 11 | 100% | 11 | 64% | -0.18 | -0.18 | -1.98 |
| MSFT | 10 | 90% | 9 | 67% | -0.24 | -0.22 | -2.18 |
| SOL-USD | 14 | 71% | 10 | 50% | -0.32 | -0.23 | -3.22 |
| NVDA | 16 | 69% | 11 | 73% | -0.35 | -0.24 | -3.90 |
| TLT | 11 | 64% | 7 | 57% | -0.44 | -0.28 | -3.09 |
| GC=F | 14 | 57% | 8 | 63% | -0.50 | -0.29 | -4.02 |
| AAPL | 12 | 83% | 10 | 60% | -0.37 | -0.31 | -3.67 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
