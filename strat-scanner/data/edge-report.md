# Edge Report — live signal record

_Generated 2026-08-29_ · **242** settled signals from 2026-08-17 to 2026-08-28 · 31 open, 39 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (187 of 242) — the rest expired unfilled.
- Of those trades, **77%** reached target 1, 17% stopped out, 6% timed out.
- **Expectancy +0.02R per trade taken**, +0.01R per signal published.
- Promised **0.86R** to target 1 on average; delivered **+0.02R**.
- Trades ran **0.66R** in favour at best and **0.57R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 95 | 75% | 71 | 80% | -0.06 | -0.05 | -4.60 |
| 55–64 | 117 | 78% | 91 | 74% | +0.04 | +0.03 | +3.91 |
| 65–74 (High) | 27 | 85% | 23 | 78% | +0.10 | +0.09 | +2.35 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.202** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 46 | +0.21 | 196 | -0.04 | +0.25 | 58% vs 81% |
| `ftfc-full` | 195 | +0.05 | 47 | -0.15 | +0.20 | 79% vs 68% |
| `close-location` | 146 | +0.03 | 96 | -0.02 | +0.05 | 79% vs 73% |
| `rr-ok` | 67 | +0.05 | 175 | -0.00 | +0.05 | 38% vs 88% |
| `reversal-backed` | 136 | +0.02 | 106 | +0.00 | +0.02 | 84% vs 68% |
| `base` | 242 | +0.01 | 0 | +0.00 | +0.01 | 77% vs 0% |
| `rr-poor` | 169 | +0.01 | 73 | +0.02 | -0.02 | 89% vs 39% |
| `in-force` | 140 | +0.00 | 102 | +0.03 | -0.02 | 79% vs 70% |
| `compression` | 66 | -0.02 | 176 | +0.02 | -0.04 | 86% vs 74% |
| `ftfc-aligned` | 47 | -0.15 | 195 | +0.05 | -0.20 | 68% vs 79% |
| `ftfc-opposed` | 47 | -0.15 | 195 | +0.05 | -0.20 | 68% vs 79% |
| `rr-strong` | 6 | -0.20 | 236 | +0.02 | -0.22 | 50% vs 77% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 70 | 76% | 53 | 64% | +0.09 | +0.07 | +4.78 |
| 2-2 Reversal | 68 | 84% | 57 | 77% | -0.06 | -0.05 | -3.42 |
| 2-1-2 Reversal | 30 | 83% | 25 | 88% | +0.12 | +0.10 | +3.03 |
| 2-1-2 Continuation | 21 | 71% | 15 | 87% | -0.20 | -0.14 | -2.99 |
| Rev Strat (1-2-2) Reversal | 21 | 67% | 14 | 93% | +0.11 | +0.08 | +1.59 |
| 3-1-2 Reversal | 10 | 50% | 5 | 100% | +0.12 | +0.06 | +0.60 |
| 3-2 Continuation | 10 | 80% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 7 | 86% | 6 | 100% | +0.19 | +0.16 | +1.11 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 169 | 75% | 127 | 75% | +0.03 | +0.02 | +3.73 |
| W | 58 | 78% | 45 | 82% | -0.06 | -0.05 | -2.78 |
| M | 15 | 100% | 15 | 80% | +0.13 | +0.13 | +1.99 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 195 | 76% | 149 | 79% | +0.07 | +0.05 | +9.77 |
| Mixed | 47 | 81% | 38 | 68% | -0.18 | -0.15 | -6.83 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 106 | 75% | 80 | 68% | +0.00 | +0.00 | +0.03 |
| Reversal | 136 | 79% | 107 | 84% | +0.03 | +0.02 | +2.91 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 176 | 78% | 138 | 74% | +0.03 | +0.02 | +4.16 |
| Inside-bar compression (X-1-?) | 66 | 74% | 49 | 86% | -0.02 | -0.02 | -1.22 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BTC-USD | 5 | 100% | 5 | 100% | +0.78 | +0.78 | +3.92 |
| LTC-USD | 6 | 83% | 5 | 80% | +0.58 | +0.49 | +2.92 |
| ETH-USD | 5 | 100% | 5 | 60% | +0.35 | +0.35 | +1.76 |
| GLD | 9 | 56% | 5 | 100% | +0.51 | +0.29 | +2.57 |
| XRP-USD | 9 | 78% | 7 | 57% | +0.33 | +0.26 | +2.33 |
| XLI | 8 | 75% | 6 | 100% | +0.29 | +0.22 | +1.75 |
| META | 10 | 80% | 8 | 100% | +0.27 | +0.22 | +2.17 |
| DIA | 9 | 56% | 5 | 100% | +0.34 | +0.19 | +1.72 |
| SPY | 5 | 60% | 3 | 100% | +0.28 | +0.17 | +0.84 |
| MSFT | 5 | 100% | 5 | 80% | +0.11 | +0.11 | +0.55 |
| XLC | 5 | 100% | 5 | 100% | +0.09 | +0.09 | +0.47 |
| TSLA | 4 | 75% | 3 | 100% | +0.12 | +0.09 | +0.36 |
| AMZN | 9 | 89% | 8 | 88% | +0.09 | +0.08 | +0.69 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| QQQ | 6 | 100% | 6 | 100% | +0.05 | +0.05 | +0.32 |
| XLF | 9 | 89% | 8 | 88% | +0.04 | +0.04 | +0.36 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| HYPE-USD | 5 | 100% | 5 | 20% | +0.01 | +0.01 | +0.04 |
| XLU | 8 | 88% | 7 | 86% | +0.01 | +0.01 | +0.06 |
| JUP-USD | 6 | 0% | 0 | — | — | +0.00 | +0.00 |
| SMH | 6 | 100% | 6 | 83% | -0.01 | -0.01 | -0.04 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 7 | 14% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| IWM | 7 | 71% | 5 | 80% | -0.04 | -0.03 | -0.20 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| DOGE-USD | 8 | 75% | 6 | 33% | -0.09 | -0.07 | -0.55 |
| XLE | 9 | 78% | 7 | 71% | -0.10 | -0.08 | -0.73 |
| GOOGL | 6 | 100% | 6 | 67% | -0.20 | -0.20 | -1.22 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| AAPL | 4 | 100% | 4 | 50% | -0.47 | -0.47 | -1.89 |
| TLT | 7 | 86% | 6 | 50% | -0.60 | -0.52 | -3.61 |
| NVDA | 10 | 80% | 8 | 63% | -0.65 | -0.52 | -5.17 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
