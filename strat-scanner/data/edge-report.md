# Edge Report — live signal record

_Generated 2026-08-17_ · **18** settled signals from 2026-08-17 to 2026-08-17 · 9 open, 35 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

> ⚠️ **18 settled signals is not a sample.** Everything below is arithmetic, not evidence. Treat it as a smoke test that the plumbing works and wait for the record to fill up before changing how you trade.

## Headline

- **100%** of published signals actually triggered (18 of 18) — the rest expired unfilled.
- Of those trades, **83%** reached target 1, 17% stopped out, 0% timed out.
- **Expectancy -0.09R per trade taken**, -0.09R per signal published.
- Promised **0.18R** to target 1 on average; delivered **-0.09R**.
- Trades ran **0.54R** in favour at best and **0.47R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 8 | 100% | 8 | 75% | -0.16 | -0.16 | -1.28 |
| 55–64 | 7 | 100% | 7 | 86% | -0.10 | -0.10 | -0.67 |
| 65–74 (High) | 3 | 100% | 3 | 100% | +0.11 | +0.11 | +0.33 |

Spearman rank correlation between confidence and realised R: **0.062** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `ftfc-full` | 16 | -0.04 | 2 | -0.50 | +0.46 | 88% vs 50% |
| `compression` | 3 | +0.11 | 15 | -0.13 | +0.24 | 100% vs 80% |
| `close-location` | 11 | -0.01 | 7 | -0.21 | +0.20 | 91% vs 71% |
| `base` | 18 | -0.09 | 0 | +0.00 | -0.09 | 83% vs 0% |
| `rr-poor` | 18 | -0.09 | 0 | +0.00 | -0.09 | 83% vs 0% |
| `in-force` | 18 | -0.09 | 0 | +0.00 | -0.09 | 83% vs 0% |
| `reversal-backed` | 13 | -0.17 | 5 | +0.12 | -0.29 | 77% vs 100% |
| `ftfc-aligned` | 2 | -0.50 | 16 | -0.04 | -0.46 | 50% vs 88% |
| `ftfc-opposed` | 2 | -0.50 | 16 | -0.04 | -0.46 | 50% vs 88% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 7 | 100% | 7 | 71% | -0.23 | -0.23 | -1.58 |
| Rev Strat (1-2-2) Reversal | 4 | 100% | 4 | 75% | -0.20 | -0.20 | -0.79 |
| 2-2 Continuation | 3 | 100% | 3 | 100% | +0.14 | +0.14 | +0.42 |
| 1-1-2 Continuation | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| 2-1-2 Continuation | 1 | 100% | 1 | 100% | +0.18 | +0.18 | +0.18 |
| 2-1-2 Reversal | 1 | 100% | 1 | 100% | +0.14 | +0.14 | +0.14 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 15 | 100% | 15 | 80% | -0.12 | -0.12 | -1.81 |
| W | 3 | 100% | 3 | 100% | +0.07 | +0.07 | +0.20 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 16 | 100% | 16 | 88% | -0.04 | -0.04 | -0.62 |
| Mixed | 2 | 100% | 2 | 50% | -0.50 | -0.50 | -1.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 5 | 100% | 5 | 100% | +0.12 | +0.12 | +0.60 |
| Reversal | 13 | 100% | 13 | 77% | -0.17 | -0.17 | -2.22 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 15 | 100% | 15 | 80% | -0.13 | -0.13 | -1.94 |
| Inside-bar compression (X-1-?) | 3 | 100% | 3 | 100% | +0.11 | +0.11 | +0.32 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XLI | 1 | 100% | 1 | 100% | +0.28 | +0.28 | +0.28 |
| XLC | 1 | 100% | 1 | 100% | +0.23 | +0.23 | +0.23 |
| XLK | 1 | 100% | 1 | 100% | +0.18 | +0.18 | +0.18 |
| GOOGL | 1 | 100% | 1 | 100% | +0.12 | +0.12 | +0.12 |
| META | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.21 |
| XLY | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| AMZN | 2 | 100% | 2 | 100% | +0.07 | +0.07 | +0.14 |
| XLU | 1 | 100% | 1 | 100% | +0.07 | +0.07 | +0.07 |
| GC=F | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| AAPL | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| SOL-USD | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| XLV | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
