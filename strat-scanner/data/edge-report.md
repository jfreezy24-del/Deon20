# Edge Report — live signal record

_Generated 2026-08-25_ · **162** settled signals from 2026-08-17 to 2026-08-25 · 31 open, 46 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (125 of 162) — the rest expired unfilled.
- Of those trades, **87%** reached target 1, 13% stopped out, 0% timed out.
- **Expectancy +0.12R per trade taken**, +0.09R per signal published.
- Promised **0.59R** to target 1 on average; delivered **+0.12R**.
- Trades ran **0.71R** in favour at best and **0.49R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 73 | 75% | 55 | 85% | -0.01 | -0.01 | -0.41 |
| 55–64 | 71 | 79% | 56 | 86% | +0.16 | +0.13 | +9.10 |
| 65–74 (High) | 15 | 80% | 12 | 100% | +0.41 | +0.33 | +4.89 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.273** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 27 | +0.41 | 135 | +0.03 | +0.39 | 89% vs 87% |
| `rr-strong` | 3 | +0.29 | 159 | +0.09 | +0.20 | 100% vs 87% |
| `rr-ok` | 41 | +0.21 | 121 | +0.05 | +0.16 | 68% vs 91% |
| `ftfc-full` | 131 | +0.11 | 31 | -0.00 | +0.11 | 88% vs 84% |
| `base` | 162 | +0.09 | 0 | +0.00 | +0.09 | 87% vs 0% |
| `reversal-backed` | 90 | +0.12 | 72 | +0.06 | +0.06 | 93% vs 79% |
| `close-location` | 93 | +0.11 | 69 | +0.06 | +0.05 | 88% vs 85% |
| `compression` | 47 | +0.08 | 115 | +0.10 | -0.02 | 91% vs 86% |
| `ftfc-aligned` | 31 | -0.00 | 131 | +0.11 | -0.11 | 84% vs 88% |
| `ftfc-opposed` | 31 | -0.00 | 131 | +0.11 | -0.11 | 84% vs 88% |
| `in-force` | 96 | +0.04 | 66 | +0.16 | -0.12 | 86% vs 90% |
| `rr-poor` | 118 | +0.05 | 44 | +0.22 | -0.17 | 91% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 47 | 74% | 35 | 74% | +0.14 | +0.10 | +4.84 |
| 2-2 Reversal | 45 | 84% | 38 | 92% | +0.15 | +0.12 | +5.53 |
| 2-1-2 Reversal | 21 | 86% | 18 | 94% | +0.26 | +0.22 | +4.61 |
| 2-1-2 Continuation | 15 | 67% | 10 | 90% | -0.04 | -0.03 | -0.38 |
| Rev Strat (1-2-2) Reversal | 13 | 85% | 11 | 91% | +0.03 | +0.03 | +0.35 |
| 3-1-2 Reversal | 8 | 38% | 3 | 100% | +0.06 | +0.02 | +0.18 |
| 3-2 Continuation | 7 | 71% | 5 | 100% | +0.09 | +0.06 | +0.45 |
| 1-1-2 Continuation | 3 | 100% | 3 | 67% | -0.29 | -0.29 | -0.87 |
| 3-2-2 Reversal | 3 | 67% | 2 | 100% | +0.08 | +0.05 | +0.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 109 | 72% | 78 | 87% | +0.12 | +0.09 | +9.72 |
| W | 40 | 85% | 34 | 88% | +0.07 | +0.06 | +2.35 |
| M | 13 | 100% | 13 | 85% | +0.21 | +0.21 | +2.78 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 131 | 76% | 100 | 88% | +0.15 | +0.11 | +14.89 |
| Mixed | 31 | 81% | 25 | 84% | -0.00 | -0.00 | -0.03 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 72 | 74% | 53 | 79% | +0.08 | +0.06 | +4.03 |
| Reversal | 90 | 80% | 72 | 93% | +0.15 | +0.12 | +10.83 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 115 | 79% | 91 | 86% | +0.12 | +0.10 | +11.32 |
| Inside-bar compression (X-1-?) | 47 | 72% | 34 | 91% | +0.10 | +0.08 | +3.54 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BTC-USD | 4 | 100% | 4 | 100% | +0.94 | +0.94 | +3.78 |
| LTC-USD | 5 | 80% | 4 | 100% | +0.90 | +0.72 | +3.59 |
| XRP-USD | 6 | 67% | 4 | 100% | +0.80 | +0.54 | +3.22 |
| HYPE-USD | 1 | 100% | 1 | 100% | +0.46 | +0.46 | +0.46 |
| GLD | 6 | 83% | 5 | 100% | +0.51 | +0.43 | +2.57 |
| XLE | 6 | 67% | 4 | 100% | +0.55 | +0.37 | +2.22 |
| DOGE-USD | 5 | 80% | 4 | 50% | +0.36 | +0.29 | +1.45 |
| DIA | 8 | 63% | 5 | 100% | +0.34 | +0.22 | +1.72 |
| XLI | 7 | 71% | 5 | 100% | +0.30 | +0.21 | +1.48 |
| GOOGL | 3 | 100% | 3 | 100% | +0.18 | +0.18 | +0.54 |
| TSLA | 3 | 100% | 3 | 100% | +0.12 | +0.12 | +0.36 |
| XLC | 4 | 100% | 4 | 100% | +0.12 | +0.12 | +0.47 |
| ETH-USD | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.23 |
| SPY | 4 | 50% | 2 | 100% | +0.19 | +0.10 | +0.39 |
| META | 7 | 86% | 6 | 100% | +0.11 | +0.10 | +0.67 |
| AMD | 5 | 100% | 5 | 100% | +0.09 | +0.09 | +0.44 |
| AMZN | 6 | 100% | 6 | 83% | +0.07 | +0.07 | +0.41 |
| QQQ | 5 | 100% | 5 | 100% | +0.06 | +0.06 | +0.32 |
| XLF | 7 | 86% | 6 | 83% | +0.04 | +0.04 | +0.25 |
| XLP | 4 | 75% | 3 | 100% | +0.03 | +0.02 | +0.10 |
| IWM | 5 | 60% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| EURUSD=X | 5 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 5 | 60% | 3 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 4 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLU | 7 | 86% | 6 | 83% | -0.06 | -0.05 | -0.37 |
| XLK | 6 | 83% | 5 | 80% | -0.10 | -0.09 | -0.52 |
| XLY | 5 | 100% | 5 | 80% | -0.10 | -0.10 | -0.52 |
| AAPL | 3 | 100% | 3 | 67% | -0.30 | -0.30 | -0.89 |
| SOL-USD | 8 | 75% | 6 | 33% | -0.41 | -0.31 | -2.49 |
| NVDA | 7 | 71% | 5 | 60% | -0.48 | -0.35 | -2.42 |
| TLT | 4 | 100% | 4 | 75% | -0.40 | -0.40 | -1.61 |
| XLV | 2 | 50% | 1 | 0% | -1.00 | -0.50 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
