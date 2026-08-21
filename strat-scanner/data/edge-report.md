# Edge Report — live signal record

_Generated 2026-08-21_ · **97** settled signals from 2026-08-17 to 2026-08-21 · 29 open, 51 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **86%** of published signals actually triggered (83 of 97) — the rest expired unfilled.
- Of those trades, **86%** reached target 1, 14% stopped out, 0% timed out.
- **Expectancy -0.01R per trade taken**, -0.01R per signal published.
- Promised **0.49R** to target 1 on average; delivered **-0.01R**.
- Trades ran **0.62R** in favour at best and **0.52R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 42 | 83% | 35 | 83% | -0.04 | -0.03 | -1.32 |
| 55–64 | 42 | 88% | 37 | 84% | -0.07 | -0.06 | -2.41 |
| 65–74 (High) | 10 | 90% | 9 | 100% | +0.19 | +0.17 | +1.68 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.262** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `rr-strong` | 3 | +0.29 | 94 | -0.02 | +0.31 | 100% vs 85% |
| `reversal-backed` | 63 | +0.10 | 34 | -0.21 | +0.31 | 93% vs 72% |
| `rr-poor` | 78 | +0.02 | 19 | -0.11 | +0.13 | 89% vs 60% |
| `ftfc-full` | 81 | +0.01 | 16 | -0.09 | +0.10 | 86% vs 86% |
| `compression` | 28 | +0.07 | 69 | -0.04 | +0.10 | 88% vs 85% |
| `volume` | 8 | +0.06 | 89 | -0.01 | +0.07 | 100% vs 84% |
| `close-location` | 55 | +0.02 | 42 | -0.05 | +0.07 | 90% vs 79% |
| `base` | 97 | -0.01 | 0 | +0.00 | -0.01 | 86% vs 0% |
| `ftfc-aligned` | 16 | -0.09 | 81 | +0.01 | -0.10 | 86% vs 86% |
| `ftfc-opposed` | 16 | -0.09 | 81 | +0.01 | -0.10 | 86% vs 86% |
| `in-force` | 69 | -0.04 | 28 | +0.08 | -0.13 | 84% vs 93% |
| `rr-ok` | 16 | -0.19 | 81 | +0.03 | -0.22 | 56% vs 89% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 34 | 88% | 30 | 93% | +0.10 | +0.09 | +2.99 |
| 2-2 Continuation | 24 | 79% | 19 | 68% | -0.29 | -0.23 | -5.46 |
| 2-1-2 Reversal | 14 | 93% | 13 | 92% | +0.27 | +0.25 | +3.45 |
| Rev Strat (1-2-2) Reversal | 9 | 89% | 8 | 88% | -0.03 | -0.03 | -0.24 |
| 2-1-2 Continuation | 6 | 100% | 6 | 83% | -0.13 | -0.13 | -0.81 |
| 3-1-2 Reversal | 5 | 40% | 2 | 100% | +0.04 | +0.01 | +0.07 |
| 1-1-2 Continuation | 3 | 100% | 3 | 67% | -0.29 | -0.29 | -0.87 |
| 3-2 Continuation | 1 | 100% | 1 | 100% | +0.09 | +0.09 | +0.09 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 66 | 79% | 52 | 85% | -0.08 | -0.06 | -4.07 |
| W | 25 | 100% | 25 | 84% | +0.06 | +0.06 | +1.52 |
| M | 6 | 100% | 6 | 100% | +0.29 | +0.29 | +1.77 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 81 | 85% | 69 | 86% | +0.01 | +0.01 | +0.74 |
| Mixed | 16 | 88% | 14 | 86% | -0.11 | -0.09 | -1.52 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 34 | 85% | 29 | 72% | -0.24 | -0.21 | -7.05 |
| Reversal | 63 | 86% | 54 | 93% | +0.12 | +0.10 | +6.27 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 69 | 86% | 59 | 85% | -0.04 | -0.04 | -2.62 |
| Inside-bar compression (X-1-?) | 28 | 86% | 24 | 88% | +0.08 | +0.07 | +1.84 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XRP-USD | 3 | 100% | 3 | 100% | +0.59 | +0.59 | +1.76 |
| XLE | 4 | 75% | 3 | 100% | +0.65 | +0.49 | +1.94 |
| BTC-USD | 2 | 100% | 2 | 100% | +0.39 | +0.39 | +0.78 |
| XLI | 5 | 100% | 5 | 100% | +0.30 | +0.30 | +1.48 |
| GOOGL | 3 | 100% | 3 | 100% | +0.18 | +0.18 | +0.54 |
| LTC-USD | 1 | 100% | 1 | 100% | +0.17 | +0.17 | +0.17 |
| DIA | 5 | 60% | 3 | 100% | +0.27 | +0.16 | +0.80 |
| GLD | 2 | 100% | 2 | 100% | +0.15 | +0.15 | +0.30 |
| AMD | 2 | 100% | 2 | 100% | +0.13 | +0.13 | +0.26 |
| SPY | 3 | 67% | 2 | 100% | +0.19 | +0.13 | +0.39 |
| XLC | 3 | 100% | 3 | 100% | +0.12 | +0.12 | +0.36 |
| TSLA | 1 | 100% | 1 | 100% | +0.12 | +0.12 | +0.12 |
| ETH-USD | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.23 |
| META | 6 | 83% | 5 | 100% | +0.06 | +0.05 | +0.29 |
| QQQ | 3 | 100% | 3 | 100% | +0.03 | +0.03 | +0.09 |
| XLF | 5 | 80% | 4 | 75% | +0.02 | +0.02 | +0.08 |
| IWM | 4 | 75% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| EURUSD=X | 3 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 3 | 100% | 3 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| AMZN | 4 | 100% | 4 | 75% | -0.02 | -0.02 | -0.07 |
| XLY | 5 | 100% | 5 | 80% | -0.10 | -0.10 | -0.52 |
| XLK | 4 | 75% | 3 | 67% | -0.27 | -0.21 | -0.82 |
| XLU | 3 | 100% | 3 | 67% | -0.31 | -0.31 | -0.93 |
| TLT | 4 | 100% | 4 | 75% | -0.40 | -0.40 | -1.61 |
| NVDA | 5 | 80% | 4 | 50% | -0.62 | -0.49 | -2.47 |
| AAPL | 2 | 100% | 2 | 50% | -0.50 | -0.50 | -1.00 |
| SOL-USD | 3 | 100% | 3 | 33% | -0.66 | -0.66 | -1.99 |
| XLV | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
