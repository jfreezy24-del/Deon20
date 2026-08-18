# Edge Report — live signal record

_Generated 2026-08-18_ · **23** settled signals from 2026-08-17 to 2026-08-18 · 9 open, 44 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **96%** of published signals actually triggered (22 of 23) — the rest expired unfilled.
- Of those trades, **86%** reached target 1, 14% stopped out, 0% timed out.
- **Expectancy -0.03R per trade taken**, -0.03R per signal published.
- Promised **0.27R** to target 1 on average; delivered **-0.03R**.
- Trades ran **0.55R** in favour at best and **0.47R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 9 | 100% | 9 | 78% | -0.14 | -0.14 | -1.28 |
| 55–64 | 7 | 100% | 7 | 86% | -0.10 | -0.10 | -0.67 |
| 65–74 (High) | 6 | 83% | 5 | 100% | +0.14 | +0.12 | +0.71 |
| 75+ (High) | 1 | 100% | 1 | 100% | +0.47 | +0.47 | +0.47 |

Spearman rank correlation between confidence and realised R: **0.249** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `ftfc-full` | 20 | +0.01 | 3 | -0.33 | +0.35 | 89% vs 67% |
| `rr-ok` | 2 | +0.24 | 21 | -0.06 | +0.29 | 100% vs 86% |
| `compression` | 8 | +0.15 | 15 | -0.13 | +0.28 | 100% vs 80% |
| `close-location` | 14 | +0.02 | 9 | -0.11 | +0.13 | 93% vs 75% |
| `base` | 23 | -0.03 | 0 | +0.00 | -0.03 | 86% vs 0% |
| `in-force` | 22 | -0.03 | 1 | +0.00 | -0.03 | 86% vs 0% |
| `reversal-backed` | 17 | -0.08 | 6 | +0.10 | -0.18 | 81% vs 100% |
| `rr-poor` | 21 | -0.06 | 2 | +0.24 | -0.29 | 86% vs 100% |
| `ftfc-aligned` | 3 | -0.33 | 20 | +0.01 | -0.35 | 67% vs 89% |
| `ftfc-opposed` | 3 | -0.33 | 20 | +0.01 | -0.35 | 67% vs 89% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 7 | 100% | 7 | 71% | -0.23 | -0.23 | -1.58 |
| Rev Strat (1-2-2) Reversal | 4 | 100% | 4 | 75% | -0.20 | -0.20 | -0.79 |
| 2-1-2 Reversal | 3 | 100% | 3 | 100% | +0.33 | +0.33 | +1.00 |
| 2-2 Continuation | 3 | 100% | 3 | 100% | +0.14 | +0.14 | +0.42 |
| 2-1-2 Continuation | 2 | 100% | 2 | 100% | +0.09 | +0.09 | +0.18 |
| 3-1-2 Reversal | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| 1-1-2 Continuation | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 19 | 95% | 18 | 83% | -0.05 | -0.05 | -0.96 |
| W | 3 | 100% | 3 | 100% | +0.07 | +0.07 | +0.20 |
| M | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 20 | 95% | 19 | 89% | +0.01 | +0.01 | +0.24 |
| Mixed | 3 | 100% | 3 | 67% | -0.33 | -0.33 | -1.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 6 | 100% | 6 | 100% | +0.10 | +0.10 | +0.60 |
| Reversal | 17 | 94% | 16 | 81% | -0.09 | -0.08 | -1.36 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 15 | 100% | 15 | 80% | -0.13 | -0.13 | -1.94 |
| Inside-bar compression (X-1-?) | 8 | 88% | 7 | 100% | +0.17 | +0.15 | +1.18 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XLF | 1 | 100% | 1 | 100% | +0.47 | +0.47 | +0.47 |
| SPY | 1 | 100% | 1 | 100% | +0.39 | +0.39 | +0.39 |
| XLI | 1 | 100% | 1 | 100% | +0.28 | +0.28 | +0.28 |
| XLC | 1 | 100% | 1 | 100% | +0.23 | +0.23 | +0.23 |
| XLK | 1 | 100% | 1 | 100% | +0.18 | +0.18 | +0.18 |
| GOOGL | 1 | 100% | 1 | 100% | +0.12 | +0.12 | +0.12 |
| META | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.21 |
| XLY | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| AMZN | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| XLU | 1 | 100% | 1 | 100% | +0.07 | +0.07 | +0.07 |
| DIA | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| GC=F | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 1 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XRP-USD | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| AAPL | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| SOL-USD | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| XLV | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
