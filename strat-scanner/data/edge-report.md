# Edge Report — live signal record

_Generated 2026-08-19_ · **46** settled signals from 2026-08-17 to 2026-08-19 · 14 open, 48 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **83%** of published signals actually triggered (38 of 46) — the rest expired unfilled.
- Of those trades, **84%** reached target 1, 16% stopped out, 0% timed out.
- **Expectancy -0.08R per trade taken**, -0.07R per signal published.
- Promised **0.42R** to target 1 on average; delivered **-0.08R**.
- Trades ran **0.52R** in favour at best and **0.48R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 19 | 84% | 16 | 75% | -0.18 | -0.15 | -2.92 |
| 55–64 | 18 | 83% | 15 | 87% | -0.09 | -0.08 | -1.39 |
| 65–74 (High) | 7 | 86% | 6 | 100% | +0.12 | +0.10 | +0.71 |
| 75+ (High) | 2 | 50% | 1 | 100% | +0.47 | +0.24 | +0.47 |

Spearman rank correlation between confidence and realised R: **0.308** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 1 | +0.30 | 45 | -0.08 | +0.38 | 100% vs 84% |
| `ftfc-full` | 39 | -0.03 | 7 | -0.29 | +0.26 | 87% vs 71% |
| `close-location` | 29 | -0.00 | 17 | -0.18 | +0.17 | 88% vs 75% |
| `compression` | 14 | +0.02 | 32 | -0.11 | +0.12 | 90% vs 82% |
| `rr-poor` | 38 | -0.07 | 8 | -0.08 | +0.01 | 86% vs 67% |
| `reversal-backed` | 31 | -0.06 | 15 | -0.08 | +0.01 | 85% vs 83% |
| `rr-ok` | 8 | -0.08 | 38 | -0.07 | -0.01 | 67% vs 86% |
| `base` | 46 | -0.07 | 0 | +0.00 | -0.07 | 84% vs 0% |
| `in-force` | 37 | -0.09 | 9 | +0.01 | -0.09 | 84% vs 100% |
| `ftfc-aligned` | 7 | -0.29 | 39 | -0.03 | -0.26 | 71% vs 87% |
| `ftfc-opposed` | 7 | -0.29 | 39 | -0.03 | -0.26 | 71% vs 87% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 14 | 93% | 13 | 85% | -0.10 | -0.09 | -1.27 |
| 2-2 Continuation | 12 | 75% | 9 | 78% | -0.15 | -0.11 | -1.32 |
| 2-1-2 Reversal | 6 | 83% | 5 | 80% | +0.00 | +0.00 | +0.00 |
| 3-1-2 Reversal | 5 | 40% | 2 | 100% | +0.04 | +0.01 | +0.07 |
| Rev Strat (1-2-2) Reversal | 5 | 100% | 5 | 80% | -0.16 | -0.16 | -0.79 |
| 2-1-2 Continuation | 2 | 100% | 2 | 100% | +0.09 | +0.09 | +0.18 |
| 1-1-2 Continuation | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 38 | 79% | 30 | 87% | -0.06 | -0.04 | -1.68 |
| W | 6 | 100% | 6 | 67% | -0.25 | -0.25 | -1.52 |
| M | 2 | 100% | 2 | 100% | +0.04 | +0.04 | +0.07 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 39 | 79% | 31 | 87% | -0.04 | -0.03 | -1.12 |
| Mixed | 7 | 100% | 7 | 71% | -0.29 | -0.29 | -2.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 15 | 80% | 12 | 83% | -0.09 | -0.08 | -1.14 |
| Reversal | 31 | 84% | 26 | 85% | -0.08 | -0.06 | -1.99 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 32 | 88% | 28 | 82% | -0.12 | -0.11 | -3.38 |
| Inside-bar compression (X-1-?) | 14 | 71% | 10 | 90% | +0.03 | +0.02 | +0.25 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XLE | 2 | 100% | 2 | 100% | +0.77 | +0.77 | +1.53 |
| XLF | 1 | 100% | 1 | 100% | +0.47 | +0.47 | +0.47 |
| SPY | 1 | 100% | 1 | 100% | +0.39 | +0.39 | +0.39 |
| GLD | 1 | 100% | 1 | 100% | +0.30 | +0.30 | +0.30 |
| XLC | 2 | 100% | 2 | 100% | +0.15 | +0.15 | +0.31 |
| XLI | 2 | 100% | 2 | 100% | +0.14 | +0.14 | +0.28 |
| GOOGL | 1 | 100% | 1 | 100% | +0.12 | +0.12 | +0.12 |
| XLY | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| META | 4 | 100% | 4 | 100% | +0.07 | +0.07 | +0.29 |
| AMZN | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| XLU | 1 | 100% | 1 | 100% | +0.07 | +0.07 | +0.07 |
| AMD | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| DIA | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| EURUSD=X | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| IWM | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| QQQ | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XRP-USD | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XLK | 4 | 75% | 3 | 67% | -0.27 | -0.21 | -0.82 |
| NVDA | 3 | 67% | 2 | 50% | -1.17 | -0.78 | -2.34 |
| AAPL | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| SOL-USD | 2 | 100% | 2 | 0% | -1.00 | -1.00 | -2.00 |
| XLV | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
