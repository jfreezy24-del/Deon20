# Edge Report — live signal record

_Generated 2026-09-01_ · **294** settled signals from 2026-08-17 to 2026-09-01 · 23 open, 77 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **78%** of published signals actually triggered (229 of 294) — the rest expired unfilled.
- Of those trades, **75%** reached target 1, 20% stopped out, 6% timed out.
- **Expectancy -0.01R per trade taken**, -0.01R per signal published.
- Promised **0.81R** to target 1 on average; delivered **-0.01R**.
- Trades ran **0.66R** in favour at best and **0.60R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 123 | 74% | 91 | 80% | -0.05 | -0.03 | -4.19 |
| 55–64 | 135 | 79% | 107 | 70% | -0.01 | -0.01 | -1.38 |
| 65–74 (High) | 31 | 87% | 27 | 74% | +0.07 | +0.06 | +1.97 |
| 75+ (High) | 5 | 80% | 4 | 75% | +0.10 | +0.08 | +0.40 |

Spearman rank correlation between confidence and realised R: **0.155** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 57 | +0.18 | 237 | -0.06 | +0.24 | 60% vs 77% |
| `ftfc-full` | 234 | +0.03 | 60 | -0.18 | +0.21 | 78% vs 63% |
| `rr-poor` | 208 | -0.00 | 86 | -0.03 | +0.03 | 86% vs 35% |
| `close-location` | 174 | -0.00 | 120 | -0.02 | +0.02 | 76% vs 72% |
| `reversal-backed` | 171 | -0.01 | 123 | -0.01 | -0.01 | 79% vs 68% |
| `rr-ok` | 80 | -0.02 | 214 | -0.01 | -0.01 | 35% vs 86% |
| `base` | 294 | -0.01 | 0 | +0.00 | -0.01 | 75% vs 0% |
| `in-force` | 162 | -0.02 | 132 | -0.00 | -0.02 | 78% vs 66% |
| `compression` | 81 | -0.06 | 213 | +0.01 | -0.06 | 78% vs 73% |
| `rr-strong` | 6 | -0.20 | 288 | -0.01 | -0.20 | 50% vs 75% |
| `ftfc-aligned` | 60 | -0.18 | 234 | +0.03 | -0.21 | 63% vs 78% |
| `ftfc-opposed` | 60 | -0.18 | 234 | +0.03 | -0.21 | 63% vs 78% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 83 | 83% | 69 | 77% | -0.07 | -0.06 | -4.98 |
| 2-2 Continuation | 82 | 73% | 60 | 63% | +0.05 | +0.04 | +3.00 |
| 2-1-2 Reversal | 35 | 86% | 30 | 80% | +0.01 | +0.00 | +0.17 |
| Rev Strat (1-2-2) Reversal | 26 | 69% | 18 | 89% | +0.12 | +0.08 | +2.18 |
| 2-1-2 Continuation | 25 | 76% | 19 | 89% | -0.11 | -0.09 | -2.16 |
| 3-1-2 Reversal | 16 | 69% | 11 | 64% | -0.06 | -0.04 | -0.63 |
| 3-2 Continuation | 11 | 73% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 11 | 91% | 10 | 90% | +0.10 | +0.09 | +0.99 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 199 | 76% | 152 | 72% | -0.01 | -0.01 | -1.24 |
| W | 78 | 77% | 60 | 78% | -0.07 | -0.06 | -4.47 |
| M | 17 | 100% | 17 | 82% | +0.15 | +0.15 | +2.50 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 234 | 77% | 181 | 78% | +0.04 | +0.03 | +7.32 |
| Mixed | 60 | 80% | 48 | 63% | -0.22 | -0.18 | -10.53 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 123 | 74% | 91 | 68% | -0.01 | -0.01 | -0.93 |
| Reversal | 171 | 81% | 138 | 79% | -0.02 | -0.01 | -2.28 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 213 | 77% | 165 | 73% | +0.01 | +0.01 | +1.29 |
| Inside-bar compression (X-1-?) | 81 | 79% | 64 | 78% | -0.07 | -0.06 | -4.50 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 8 | 75% | 6 | 83% | +0.54 | +0.40 | +3.22 |
| GLD | 10 | 60% | 6 | 100% | +0.54 | +0.32 | +3.24 |
| BTC-USD | 7 | 100% | 7 | 71% | +0.32 | +0.32 | +2.23 |
| XLI | 11 | 73% | 8 | 100% | +0.41 | +0.30 | +3.27 |
| ETH-USD | 6 | 83% | 5 | 60% | +0.35 | +0.29 | +1.76 |
| DIA | 13 | 69% | 9 | 100% | +0.27 | +0.18 | +2.40 |
| TSLA | 6 | 83% | 5 | 100% | +0.21 | +0.18 | +1.06 |
| XRP-USD | 12 | 67% | 8 | 50% | +0.17 | +0.11 | +1.33 |
| QQQ | 7 | 100% | 7 | 100% | +0.10 | +0.10 | +0.68 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| AMZN | 11 | 91% | 10 | 90% | +0.07 | +0.06 | +0.69 |
| META | 12 | 83% | 10 | 90% | +0.07 | +0.06 | +0.71 |
| JUP-USD | 8 | 13% | 1 | 100% | +0.14 | +0.02 | +0.14 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| SMH | 7 | 100% | 7 | 86% | -0.01 | -0.01 | -0.04 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 8 | 13% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| SPY | 7 | 71% | 5 | 80% | -0.03 | -0.02 | -0.17 |
| XLE | 12 | 83% | 10 | 70% | -0.04 | -0.03 | -0.41 |
| XLF | 13 | 85% | 11 | 82% | -0.04 | -0.03 | -0.45 |
| XLC | 7 | 100% | 7 | 86% | -0.05 | -0.05 | -0.32 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| MSFT | 6 | 100% | 6 | 67% | -0.07 | -0.07 | -0.45 |
| GOOGL | 7 | 100% | 7 | 71% | -0.08 | -0.08 | -0.53 |
| XLU | 10 | 90% | 9 | 78% | -0.10 | -0.09 | -0.94 |
| DOGE-USD | 10 | 80% | 8 | 25% | -0.12 | -0.10 | -0.98 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| TLT | 8 | 88% | 7 | 57% | -0.44 | -0.39 | -3.09 |
| AAPL | 7 | 100% | 7 | 57% | -0.39 | -0.39 | -2.76 |
| NVDA | 12 | 67% | 8 | 63% | -0.65 | -0.43 | -5.17 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
