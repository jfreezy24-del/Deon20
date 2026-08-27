# Edge Report — live signal record

_Generated 2026-08-27_ · **207** settled signals from 2026-08-17 to 2026-08-27 · 33 open, 49 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **76%** of published signals actually triggered (158 of 207) — the rest expired unfilled.
- Of those trades, **80%** reached target 1, 16% stopped out, 4% timed out.
- **Expectancy +0.05R per trade taken**, +0.04R per signal published.
- Promised **0.62R** to target 1 on average; delivered **+0.05R**.
- Trades ran **0.68R** in favour at best and **0.53R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 85 | 74% | 63 | 83% | -0.05 | -0.03 | -2.90 |
| 55–64 | 95 | 77% | 73 | 75% | +0.09 | +0.07 | +6.84 |
| 65–74 (High) | 24 | 83% | 20 | 85% | +0.16 | +0.14 | +3.24 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.236** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 37 | +0.33 | 170 | -0.02 | +0.36 | 70% vs 81% |
| `ftfc-full` | 167 | +0.06 | 40 | -0.05 | +0.11 | 80% vs 78% |
| `rr-ok` | 58 | +0.12 | 149 | +0.01 | +0.10 | 46% vs 89% |
| `close-location` | 124 | +0.07 | 83 | -0.00 | +0.07 | 81% vs 77% |
| `base` | 207 | +0.04 | 0 | +0.00 | +0.04 | 80% vs 0% |
| `in-force` | 115 | +0.04 | 92 | +0.04 | +0.01 | 83% vs 70% |
| `compression` | 60 | +0.04 | 147 | +0.04 | -0.00 | 89% vs 76% |
| `reversal-backed` | 119 | +0.03 | 88 | +0.05 | -0.02 | 86% vs 71% |
| `rr-poor` | 145 | +0.02 | 62 | +0.09 | -0.07 | 90% vs 46% |
| `ftfc-aligned` | 40 | -0.05 | 167 | +0.06 | -0.11 | 78% vs 80% |
| `ftfc-opposed` | 40 | -0.05 | 167 | +0.06 | -0.11 | 78% vs 80% |
| `rr-strong` | 4 | -0.31 | 203 | +0.05 | -0.36 | 50% vs 80% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 61 | 84% | 51 | 80% | -0.02 | -0.02 | -1.26 |
| 2-2 Continuation | 57 | 75% | 43 | 67% | +0.14 | +0.10 | +5.83 |
| 2-1-2 Reversal | 29 | 83% | 24 | 92% | +0.17 | +0.14 | +4.03 |
| 2-1-2 Continuation | 17 | 71% | 12 | 92% | -0.02 | -0.01 | -0.24 |
| Rev Strat (1-2-2) Reversal | 17 | 65% | 11 | 91% | +0.03 | +0.02 | +0.35 |
| 3-1-2 Reversal | 9 | 44% | 4 | 100% | +0.08 | +0.04 | +0.34 |
| 3-2 Continuation | 9 | 78% | 7 | 71% | +0.16 | +0.12 | +1.10 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |
| 3-2-2 Reversal | 3 | 67% | 2 | 100% | +0.08 | +0.05 | +0.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 139 | 73% | 102 | 79% | +0.09 | +0.07 | +9.44 |
| W | 54 | 78% | 42 | 81% | -0.07 | -0.05 | -2.78 |
| M | 14 | 100% | 14 | 79% | +0.13 | +0.13 | +1.78 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 167 | 75% | 126 | 80% | +0.08 | +0.06 | +10.28 |
| Mixed | 40 | 80% | 32 | 78% | -0.06 | -0.05 | -1.83 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 88 | 75% | 66 | 71% | +0.07 | +0.05 | +4.83 |
| Reversal | 119 | 77% | 92 | 86% | +0.04 | +0.03 | +3.62 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 147 | 78% | 114 | 76% | +0.05 | +0.04 | +6.18 |
| Inside-bar compression (X-1-?) | 60 | 73% | 44 | 89% | +0.05 | +0.04 | +2.26 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BTC-USD | 5 | 100% | 5 | 100% | +0.78 | +0.78 | +3.92 |
| LTC-USD | 5 | 80% | 4 | 100% | +0.90 | +0.72 | +3.59 |
| HYPE-USD | 2 | 100% | 2 | 50% | +0.48 | +0.48 | +0.95 |
| ETH-USD | 5 | 100% | 5 | 60% | +0.35 | +0.35 | +1.76 |
| XRP-USD | 8 | 75% | 6 | 67% | +0.41 | +0.31 | +2.48 |
| GLD | 9 | 56% | 5 | 100% | +0.51 | +0.29 | +2.57 |
| DOGE-USD | 6 | 67% | 4 | 50% | +0.36 | +0.24 | +1.45 |
| META | 9 | 89% | 8 | 100% | +0.27 | +0.24 | +2.17 |
| DIA | 8 | 63% | 5 | 100% | +0.34 | +0.22 | +1.72 |
| XLI | 7 | 71% | 5 | 100% | +0.30 | +0.21 | +1.48 |
| MSFT | 4 | 100% | 4 | 75% | +0.12 | +0.12 | +0.47 |
| XLC | 4 | 100% | 4 | 100% | +0.12 | +0.12 | +0.47 |
| SPY | 4 | 50% | 2 | 100% | +0.19 | +0.10 | +0.39 |
| TSLA | 4 | 75% | 3 | 100% | +0.12 | +0.09 | +0.36 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| QQQ | 5 | 100% | 5 | 100% | +0.06 | +0.06 | +0.32 |
| AMZN | 8 | 88% | 7 | 86% | +0.07 | +0.06 | +0.49 |
| XLF | 8 | 88% | 7 | 86% | +0.04 | +0.03 | +0.27 |
| XLP | 5 | 60% | 3 | 100% | +0.03 | +0.02 | +0.10 |
| IWM | 5 | 60% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| XLU | 8 | 88% | 7 | 86% | +0.01 | +0.01 | +0.06 |
| JUP-USD | 5 | 0% | 0 | — | — | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 7 | 14% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| XLE | 9 | 78% | 7 | 71% | -0.10 | -0.08 | -0.73 |
| XLK | 6 | 83% | 5 | 80% | -0.10 | -0.09 | -0.52 |
| GOOGL | 6 | 100% | 6 | 67% | -0.20 | -0.20 | -1.22 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| XLV | 3 | 67% | 2 | 50% | -0.42 | -0.28 | -0.84 |
| NVDA | 7 | 71% | 5 | 60% | -0.48 | -0.35 | -2.42 |
| GC=F | 9 | 67% | 6 | 50% | -0.67 | -0.45 | -4.04 |
| AAPL | 4 | 100% | 4 | 50% | -0.47 | -0.47 | -1.89 |
| TLT | 5 | 100% | 5 | 60% | -0.52 | -0.52 | -2.61 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
