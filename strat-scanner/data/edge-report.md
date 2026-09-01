# Edge Report — live signal record

_Generated 2026-09-01_ · **275** settled signals from 2026-08-17 to 2026-09-01 · 27 open, 46 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (212 of 275) — the rest expired unfilled.
- Of those trades, **75%** reached target 1, 19% stopped out, 6% timed out.
- **Expectancy -0.01R per trade taken**, -0.01R per signal published.
- Promised **0.83R** to target 1 on average; delivered **-0.01R**.
- Trades ran **0.66R** in favour at best and **0.59R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 110 | 72% | 79 | 80% | -0.07 | -0.05 | -5.17 |
| 55–64 | 132 | 80% | 105 | 70% | +0.01 | +0.01 | +0.80 |
| 65–74 (High) | 29 | 86% | 25 | 72% | +0.03 | +0.02 | +0.66 |
| 75+ (High) | 4 | 75% | 3 | 100% | +0.47 | +0.35 | +1.41 |

Spearman rank correlation between confidence and realised R: **0.181** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 54 | +0.17 | 221 | -0.05 | +0.22 | 58% vs 78% |
| `ftfc-full` | 217 | +0.04 | 58 | -0.18 | +0.21 | 78% vs 63% |
| `rr-ok` | 76 | +0.01 | 199 | -0.02 | +0.03 | 35% vs 86% |
| `close-location` | 167 | +0.00 | 108 | -0.02 | +0.02 | 76% vs 71% |
| `reversal-backed` | 159 | -0.00 | 116 | -0.01 | +0.01 | 80% vs 67% |
| `in-force` | 150 | -0.01 | 125 | -0.01 | -0.00 | 79% vs 65% |
| `rr-poor` | 193 | -0.01 | 82 | -0.00 | -0.01 | 86% vs 35% |
| `base` | 275 | -0.01 | 0 | +0.00 | -0.01 | 75% vs 0% |
| `compression` | 77 | -0.06 | 198 | +0.01 | -0.07 | 78% vs 73% |
| `rr-strong` | 6 | -0.20 | 269 | -0.00 | -0.20 | 50% vs 75% |
| `ftfc-aligned` | 58 | -0.18 | 217 | +0.04 | -0.21 | 63% vs 78% |
| `ftfc-opposed` | 58 | -0.18 | 217 | +0.04 | -0.21 | 63% vs 78% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 77 | 71% | 55 | 62% | +0.05 | +0.04 | +2.99 |
| 2-2 Reversal | 77 | 84% | 65 | 77% | -0.05 | -0.05 | -3.55 |
| 2-1-2 Reversal | 34 | 85% | 29 | 83% | +0.04 | +0.03 | +1.18 |
| 2-1-2 Continuation | 23 | 74% | 17 | 88% | -0.17 | -0.12 | -2.83 |
| Rev Strat (1-2-2) Reversal | 23 | 65% | 15 | 93% | +0.14 | +0.09 | +2.14 |
| 3-1-2 Reversal | 15 | 67% | 10 | 60% | -0.09 | -0.06 | -0.93 |
| 3-2 Continuation | 11 | 73% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 10 | 90% | 9 | 89% | +0.05 | +0.05 | +0.47 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 187 | 76% | 142 | 73% | +0.01 | +0.00 | +0.78 |
| W | 72 | 75% | 54 | 78% | -0.10 | -0.08 | -5.58 |
| M | 16 | 100% | 16 | 81% | +0.16 | +0.16 | +2.50 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 217 | 76% | 166 | 78% | +0.05 | +0.04 | +7.95 |
| Mixed | 58 | 79% | 46 | 63% | -0.22 | -0.18 | -10.25 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 116 | 72% | 84 | 67% | -0.02 | -0.01 | -1.61 |
| Reversal | 159 | 81% | 128 | 80% | -0.01 | -0.00 | -0.69 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 198 | 77% | 152 | 73% | +0.01 | +0.01 | +2.15 |
| Inside-bar compression (X-1-?) | 77 | 78% | 60 | 78% | -0.07 | -0.06 | -4.45 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 7 | 71% | 5 | 80% | +0.58 | +0.42 | +2.92 |
| GLD | 10 | 60% | 6 | 100% | +0.54 | +0.32 | +3.24 |
| BTC-USD | 7 | 100% | 7 | 71% | +0.32 | +0.32 | +2.23 |
| ETH-USD | 6 | 83% | 5 | 60% | +0.35 | +0.29 | +1.76 |
| XLI | 10 | 70% | 7 | 100% | +0.32 | +0.23 | +2.26 |
| META | 10 | 80% | 8 | 100% | +0.27 | +0.22 | +2.17 |
| TSLA | 6 | 83% | 5 | 100% | +0.21 | +0.18 | +1.06 |
| DIA | 11 | 64% | 7 | 100% | +0.25 | +0.16 | +1.73 |
| SPY | 6 | 67% | 4 | 100% | +0.21 | +0.14 | +0.84 |
| XRP-USD | 12 | 67% | 8 | 50% | +0.17 | +0.11 | +1.33 |
| QQQ | 7 | 100% | 7 | 100% | +0.10 | +0.10 | +0.68 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| AMZN | 10 | 90% | 9 | 89% | +0.08 | +0.07 | +0.69 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XLF | 11 | 82% | 9 | 89% | +0.04 | +0.03 | +0.36 |
| JUP-USD | 8 | 13% | 1 | 100% | +0.14 | +0.02 | +0.14 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| SMH | 6 | 100% | 6 | 83% | -0.01 | -0.01 | -0.04 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 7 | 14% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| MSFT | 6 | 100% | 6 | 67% | -0.07 | -0.07 | -0.45 |
| XLE | 11 | 82% | 9 | 67% | -0.09 | -0.08 | -0.83 |
| GOOGL | 7 | 100% | 7 | 71% | -0.08 | -0.08 | -0.53 |
| DOGE-USD | 10 | 80% | 8 | 25% | -0.12 | -0.10 | -0.98 |
| XLU | 9 | 89% | 8 | 75% | -0.12 | -0.10 | -0.94 |
| XLC | 6 | 100% | 6 | 83% | -0.11 | -0.11 | -0.63 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| AAPL | 5 | 100% | 5 | 60% | -0.38 | -0.38 | -1.89 |
| NVDA | 11 | 73% | 8 | 63% | -0.65 | -0.47 | -5.17 |
| TLT | 7 | 86% | 6 | 50% | -0.60 | -0.52 | -3.61 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
