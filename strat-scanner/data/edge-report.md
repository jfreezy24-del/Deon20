# Edge Report — live signal record

_Generated 2026-08-20_ · **73** settled signals from 2026-08-17 to 2026-08-20 · 18 open, 59 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **88%** of published signals actually triggered (64 of 73) — the rest expired unfilled.
- Of those trades, **83%** reached target 1, 17% stopped out, 0% timed out.
- **Expectancy -0.08R per trade taken**, -0.07R per signal published.
- Promised **0.43R** to target 1 on average; delivered **-0.08R**.
- Trades ran **0.60R** in favour at best and **0.56R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 32 | 88% | 28 | 82% | -0.05 | -0.04 | -1.27 |
| 55–64 | 31 | 90% | 28 | 79% | -0.18 | -0.16 | -4.95 |
| 65–74 (High) | 8 | 88% | 7 | 100% | +0.11 | +0.10 | +0.77 |
| 75+ (High) | 2 | 50% | 1 | 100% | +0.47 | +0.24 | +0.47 |

Spearman rank correlation between confidence and realised R: **0.155** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `rr-poor` | 60 | -0.02 | 13 | -0.29 | +0.27 | 88% vs 50% |
| `reversal-backed` | 47 | +0.02 | 26 | -0.24 | +0.26 | 90% vs 70% |
| `close-location` | 43 | +0.01 | 30 | -0.18 | +0.18 | 90% vs 71% |
| `volume` | 4 | +0.09 | 69 | -0.08 | +0.17 | 100% vs 82% |
| `ftfc-full` | 60 | -0.06 | 13 | -0.12 | +0.06 | 83% vs 83% |
| `compression` | 21 | -0.07 | 52 | -0.07 | -0.00 | 82% vs 83% |
| `ftfc-aligned` | 13 | -0.12 | 60 | -0.06 | -0.06 | 83% vs 83% |
| `ftfc-opposed` | 13 | -0.12 | 60 | -0.06 | -0.06 | 83% vs 83% |
| `base` | 73 | -0.07 | 0 | +0.00 | -0.07 | 83% vs 0% |
| `in-force` | 54 | -0.09 | 19 | -0.01 | -0.08 | 81% vs 90% |
| `rr-ok` | 13 | -0.29 | 60 | -0.02 | -0.27 | 50% vs 88% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 23 | 96% | 22 | 91% | +0.05 | +0.05 | +1.17 |
| 2-2 Continuation | 19 | 84% | 16 | 69% | -0.28 | -0.23 | -4.46 |
| 2-1-2 Reversal | 9 | 89% | 8 | 88% | +0.02 | +0.02 | +0.16 |
| Rev Strat (1-2-2) Reversal | 9 | 89% | 8 | 88% | -0.03 | -0.03 | -0.24 |
| 3-1-2 Reversal | 5 | 40% | 2 | 100% | +0.04 | +0.01 | +0.07 |
| 2-1-2 Continuation | 4 | 100% | 4 | 75% | -0.21 | -0.21 | -0.82 |
| 1-1-2 Continuation | 3 | 100% | 3 | 67% | -0.29 | -0.29 | -0.87 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 53 | 83% | 44 | 82% | -0.10 | -0.08 | -4.33 |
| W | 17 | 100% | 17 | 82% | -0.05 | -0.05 | -0.82 |
| M | 3 | 100% | 3 | 100% | +0.06 | +0.06 | +0.17 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 60 | 87% | 52 | 83% | -0.07 | -0.06 | -3.46 |
| Mixed | 13 | 92% | 12 | 83% | -0.13 | -0.12 | -1.52 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 26 | 88% | 23 | 70% | -0.27 | -0.24 | -6.15 |
| Reversal | 47 | 87% | 41 | 90% | +0.03 | +0.02 | +1.17 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 52 | 90% | 47 | 83% | -0.07 | -0.07 | -3.52 |
| Inside-bar compression (X-1-?) | 21 | 81% | 17 | 82% | -0.09 | -0.07 | -1.46 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| XLE | 3 | 100% | 3 | 100% | +0.65 | +0.65 | +1.94 |
| XRP-USD | 2 | 100% | 2 | 100% | +0.46 | +0.46 | +0.93 |
| SPY | 1 | 100% | 1 | 100% | +0.39 | +0.39 | +0.39 |
| GOOGL | 2 | 100% | 2 | 100% | +0.23 | +0.23 | +0.46 |
| LTC-USD | 1 | 100% | 1 | 100% | +0.17 | +0.17 | +0.17 |
| GLD | 2 | 100% | 2 | 100% | +0.15 | +0.15 | +0.30 |
| AMD | 2 | 100% | 2 | 100% | +0.13 | +0.13 | +0.26 |
| XLI | 3 | 100% | 3 | 100% | +0.13 | +0.13 | +0.39 |
| XLC | 3 | 100% | 3 | 100% | +0.12 | +0.12 | +0.36 |
| TSLA | 1 | 100% | 1 | 100% | +0.12 | +0.12 | +0.12 |
| ETH-USD | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.23 |
| META | 5 | 100% | 5 | 100% | +0.06 | +0.06 | +0.29 |
| QQQ | 3 | 100% | 3 | 100% | +0.03 | +0.03 | +0.09 |
| BTC-USD | 1 | 100% | 1 | 100% | +0.01 | +0.01 | +0.01 |
| DIA | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| EURUSD=X | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| IWM | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| AMZN | 4 | 100% | 4 | 75% | -0.02 | -0.02 | -0.07 |
| XLY | 4 | 100% | 4 | 75% | -0.15 | -0.15 | -0.61 |
| XLF | 3 | 67% | 2 | 50% | -0.26 | -0.18 | -0.53 |
| XLK | 4 | 75% | 3 | 67% | -0.27 | -0.21 | -0.82 |
| XLU | 3 | 100% | 3 | 67% | -0.31 | -0.31 | -0.93 |
| TLT | 3 | 100% | 3 | 67% | -0.54 | -0.54 | -1.61 |
| NVDA | 3 | 67% | 2 | 50% | -1.17 | -0.78 | -2.34 |
| AAPL | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |
| SOL-USD | 2 | 100% | 2 | 0% | -1.00 | -1.00 | -2.00 |
| XLV | 1 | 100% | 1 | 0% | -1.00 | -1.00 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
