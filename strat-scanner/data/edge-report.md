# Edge Report — live signal record

_Generated 2026-08-23_ · **122** settled signals from 2026-08-17 to 2026-08-22 · 31 open, 55 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **86%** of published signals actually triggered (105 of 122) — the rest expired unfilled.
- Of those trades, **87%** reached target 1, 13% stopped out, 0% timed out.
- **Expectancy +0.11R per trade taken**, +0.10R per signal published.
- Promised **0.56R** to target 1 on average; delivered **+0.11R**.
- Trades ran **0.74R** in favour at best and **0.51R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 51 | 80% | 41 | 85% | -0.01 | -0.01 | -0.49 |
| 55–64 | 55 | 91% | 50 | 84% | +0.12 | +0.11 | +5.99 |
| 65–74 (High) | 13 | 92% | 12 | 100% | +0.41 | +0.38 | +4.89 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.288** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 19 | +0.47 | 103 | +0.03 | +0.44 | 88% vs 87% |
| `rr-ok` | 27 | +0.27 | 95 | +0.05 | +0.23 | 68% vs 91% |
| `rr-strong` | 3 | +0.29 | 119 | +0.09 | +0.20 | 100% vs 87% |
| `ftfc-full` | 101 | +0.12 | 21 | -0.04 | +0.16 | 86% vs 89% |
| `base` | 122 | +0.10 | 0 | +0.00 | +0.10 | 87% vs 0% |
| `reversal-backed` | 73 | +0.13 | 49 | +0.04 | +0.09 | 94% vs 77% |
| `close-location` | 73 | +0.13 | 49 | +0.04 | +0.09 | 90% vs 82% |
| `compression` | 35 | +0.09 | 87 | +0.10 | -0.01 | 90% vs 85% |
| `ftfc-aligned` | 21 | -0.04 | 101 | +0.12 | -0.16 | 89% vs 86% |
| `ftfc-opposed` | 21 | -0.04 | 101 | +0.12 | -0.16 | 89% vs 86% |
| `in-force` | 78 | +0.01 | 44 | +0.24 | -0.23 | 86% vs 89% |
| `rr-poor` | 92 | +0.04 | 30 | +0.28 | -0.24 | 91% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 39 | 85% | 33 | 94% | +0.16 | +0.14 | +5.31 |
| 2-2 Continuation | 36 | 83% | 30 | 73% | +0.11 | +0.09 | +3.21 |
| 2-1-2 Reversal | 17 | 94% | 16 | 94% | +0.26 | +0.25 | +4.17 |
| Rev Strat (1-2-2) Reversal | 10 | 90% | 9 | 89% | +0.01 | +0.01 | +0.06 |
| 2-1-2 Continuation | 9 | 100% | 9 | 89% | -0.05 | -0.05 | -0.48 |
| 3-1-2 Reversal | 6 | 50% | 3 | 100% | +0.06 | +0.03 | +0.18 |
| 1-1-2 Continuation | 3 | 100% | 3 | 67% | -0.29 | -0.29 | -0.87 |
| 3-2 Continuation | 1 | 100% | 1 | 100% | +0.09 | +0.09 | +0.09 |
| 3-2-2 Reversal | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 85 | 80% | 68 | 85% | +0.08 | +0.07 | +5.53 |
| W | 28 | 100% | 28 | 86% | +0.07 | +0.07 | +1.91 |
| M | 9 | 100% | 9 | 100% | +0.47 | +0.47 | +4.23 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 101 | 85% | 86 | 86% | +0.14 | +0.12 | +12.43 |
| Mixed | 21 | 90% | 19 | 89% | -0.04 | -0.04 | -0.76 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 49 | 88% | 43 | 77% | +0.05 | +0.04 | +1.94 |
| Reversal | 73 | 85% | 62 | 94% | +0.16 | +0.13 | +9.73 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 87 | 85% | 74 | 85% | +0.12 | +0.10 | +8.67 |
| Inside-bar compression (X-1-?) | 35 | 89% | 31 | 90% | +0.10 | +0.09 | +3.00 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 4 | 100% | 4 | 100% | +0.90 | +0.90 | +3.59 |
| DOGE-USD | 3 | 100% | 3 | 67% | +0.82 | +0.82 | +2.45 |
| XRP-USD | 4 | 100% | 4 | 100% | +0.80 | +0.80 | +3.22 |
| BTC-USD | 3 | 100% | 3 | 100% | +0.76 | +0.76 | +2.28 |
| GLD | 4 | 100% | 4 | 100% | +0.45 | +0.45 | +1.82 |
| XLE | 6 | 67% | 4 | 100% | +0.55 | +0.37 | +2.22 |
| XLI | 5 | 100% | 5 | 100% | +0.30 | +0.30 | +1.48 |
| GOOGL | 3 | 100% | 3 | 100% | +0.18 | +0.18 | +0.54 |
| DIA | 5 | 60% | 3 | 100% | +0.27 | +0.16 | +0.80 |
| AMD | 2 | 100% | 2 | 100% | +0.13 | +0.13 | +0.26 |
| SPY | 3 | 67% | 2 | 100% | +0.19 | +0.13 | +0.39 |
| TSLA | 3 | 100% | 3 | 100% | +0.12 | +0.12 | +0.36 |
| XLC | 4 | 100% | 4 | 100% | +0.12 | +0.12 | +0.47 |
| ETH-USD | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.23 |
| META | 6 | 83% | 5 | 100% | +0.06 | +0.05 | +0.29 |
| AMZN | 5 | 100% | 5 | 80% | +0.03 | +0.03 | +0.15 |
| QQQ | 3 | 100% | 3 | 100% | +0.03 | +0.03 | +0.09 |
| XLF | 5 | 80% | 4 | 75% | +0.02 | +0.02 | +0.08 |
| IWM | 4 | 75% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| EURUSD=X | 4 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 3 | 100% | 3 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XLU | 6 | 100% | 6 | 83% | -0.06 | -0.06 | -0.37 |
| XLY | 5 | 100% | 5 | 80% | -0.10 | -0.10 | -0.52 |
| XLK | 5 | 80% | 4 | 75% | -0.18 | -0.14 | -0.70 |
| AAPL | 3 | 100% | 3 | 67% | -0.30 | -0.30 | -0.89 |
| SOL-USD | 5 | 100% | 5 | 40% | -0.30 | -0.30 | -1.49 |
| TLT | 4 | 100% | 4 | 75% | -0.40 | -0.40 | -1.61 |
| NVDA | 5 | 80% | 4 | 50% | -0.62 | -0.49 | -2.47 |
| XLV | 2 | 50% | 1 | 0% | -1.00 | -0.50 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
