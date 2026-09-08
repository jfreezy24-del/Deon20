# Edge Report — live signal record

_Generated 2026-09-08_ · **438** settled signals from 2026-08-17 to 2026-09-07 · 40 open, 60 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **74%** of published signals actually triggered (326 of 438) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.04R per trade taken**, -0.03R per signal published.
- Promised **0.84R** to target 1 on average; delivered **-0.04R**.
- Trades ran **0.62R** in favour at best and **0.62R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 180 | 69% | 125 | 79% | -0.08 | -0.06 | -10.36 |
| 55–64 | 193 | 77% | 149 | 72% | -0.02 | -0.01 | -2.73 |
| 65–74 (High) | 58 | 81% | 47 | 68% | +0.04 | +0.03 | +1.66 |
| 75+ (High) | 7 | 71% | 5 | 60% | -0.22 | -0.16 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.130** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 84 | +0.11 | 354 | -0.06 | +0.18 | 61% vs 76% |
| `ftfc-full` | 347 | +0.00 | 91 | -0.15 | +0.16 | 77% vs 63% |
| `rr-poor` | 310 | -0.01 | 128 | -0.08 | +0.07 | 85% vs 37% |
| `reversal-backed` | 253 | -0.01 | 185 | -0.05 | +0.04 | 78% vs 68% |
| `in-force` | 235 | -0.02 | 203 | -0.04 | +0.02 | 78% vs 64% |
| `close-location` | 245 | -0.04 | 193 | -0.02 | -0.02 | 73% vs 76% |
| `base` | 438 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `compression` | 146 | -0.06 | 292 | -0.02 | -0.04 | 78% vs 72% |
| `rr-ok` | 118 | -0.06 | 320 | -0.02 | -0.04 | 37% vs 84% |
| `ftfc-aligned` | 90 | -0.16 | 348 | +0.00 | -0.16 | 63% vs 77% |
| `ftfc-opposed` | 90 | -0.16 | 348 | +0.00 | -0.16 | 63% vs 77% |
| `rr-strong` | 10 | -0.32 | 428 | -0.02 | -0.30 | 40% vs 74% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 121 | 79% | 95 | 78% | -0.04 | -0.03 | -3.63 |
| 2-2 Continuation | 107 | 72% | 77 | 60% | -0.05 | -0.04 | -4.13 |
| 2-1-2 Reversal | 50 | 80% | 40 | 75% | -0.08 | -0.06 | -3.02 |
| 2-1-2 Continuation | 48 | 75% | 36 | 86% | -0.07 | -0.05 | -2.45 |
| 3-1-2 Reversal | 32 | 56% | 18 | 78% | +0.03 | +0.02 | +0.57 |
| Rev Strat (1-2-2) Reversal | 31 | 71% | 22 | 86% | +0.07 | +0.05 | +1.54 |
| 3-2-2 Reversal | 20 | 70% | 14 | 79% | +0.11 | +0.08 | +1.53 |
| 1-1-2 Continuation | 16 | 88% | 14 | 64% | -0.23 | -0.20 | -3.19 |
| 3-2 Continuation | 13 | 77% | 10 | 70% | +0.02 | +0.02 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 289 | 71% | 205 | 73% | -0.02 | -0.01 | -3.66 |
| W | 115 | 76% | 87 | 76% | -0.11 | -0.08 | -9.19 |
| M | 34 | 100% | 34 | 76% | +0.01 | +0.01 | +0.29 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 347 | 74% | 258 | 77% | +0.01 | +0.00 | +1.48 |
| Mixed | 90 | 76% | 68 | 63% | -0.21 | -0.16 | -14.04 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 184 | 74% | 137 | 68% | -0.07 | -0.05 | -9.54 |
| Reversal | 254 | 74% | 189 | 78% | -0.02 | -0.01 | -3.01 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 292 | 75% | 218 | 72% | -0.02 | -0.02 | -4.47 |
| Inside-bar compression (X-1-?) | 146 | 74% | 108 | 78% | -0.07 | -0.06 | -8.09 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 11 | 82% | 9 | 89% | +0.44 | +0.36 | +3.96 |
| XLI | 15 | 80% | 12 | 92% | +0.32 | +0.25 | +3.82 |
| ETH-USD | 10 | 70% | 7 | 71% | +0.34 | +0.24 | +2.38 |
| AMZN | 15 | 93% | 14 | 93% | +0.24 | +0.23 | +3.43 |
| GLD | 15 | 60% | 9 | 89% | +0.27 | +0.16 | +2.47 |
| JUP-USD | 17 | 24% | 4 | 100% | +0.50 | +0.12 | +2.01 |
| META | 17 | 76% | 13 | 92% | +0.15 | +0.12 | +2.01 |
| DIA | 17 | 76% | 13 | 92% | +0.13 | +0.10 | +1.67 |
| XLP | 8 | 75% | 6 | 100% | +0.09 | +0.06 | +0.52 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| BTC-USD | 11 | 91% | 10 | 60% | +0.04 | +0.04 | +0.41 |
| XRP-USD | 19 | 53% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| SPY | 11 | 73% | 8 | 88% | +0.00 | +0.00 | +0.00 |
| XLC | 11 | 91% | 10 | 90% | -0.01 | -0.01 | -0.11 |
| EURUSD=X | 12 | 8% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| IWM | 13 | 62% | 8 | 75% | -0.03 | -0.02 | -0.25 |
| XLU | 13 | 92% | 12 | 67% | -0.04 | -0.04 | -0.49 |
| AMD | 10 | 100% | 10 | 90% | -0.04 | -0.04 | -0.42 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| QQQ | 10 | 90% | 9 | 89% | -0.07 | -0.06 | -0.59 |
| TSLA | 12 | 75% | 9 | 78% | -0.09 | -0.07 | -0.84 |
| HYPE-USD | 10 | 70% | 7 | 29% | -0.11 | -0.08 | -0.77 |
| XLK | 13 | 92% | 12 | 83% | -0.08 | -0.08 | -1.02 |
| XLF | 17 | 82% | 14 | 71% | -0.14 | -0.12 | -1.99 |
| DOGE-USD | 13 | 77% | 10 | 30% | -0.19 | -0.14 | -1.87 |
| SMH | 14 | 100% | 14 | 71% | -0.16 | -0.16 | -2.22 |
| XLE | 14 | 86% | 12 | 58% | -0.20 | -0.17 | -2.41 |
| GOOGL | 11 | 100% | 11 | 64% | -0.18 | -0.18 | -1.98 |
| SOL-USD | 15 | 67% | 10 | 50% | -0.32 | -0.21 | -3.22 |
| MSFT | 10 | 90% | 9 | 67% | -0.24 | -0.22 | -2.18 |
| NVDA | 17 | 65% | 11 | 73% | -0.35 | -0.23 | -3.90 |
| TLT | 12 | 58% | 7 | 57% | -0.44 | -0.26 | -3.09 |
| GC=F | 15 | 60% | 9 | 67% | -0.45 | -0.27 | -4.02 |
| AAPL | 12 | 83% | 10 | 60% | -0.37 | -0.31 | -3.67 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
