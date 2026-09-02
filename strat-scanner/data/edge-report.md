# Edge Report — live signal record

_Generated 2026-09-02_ · **308** settled signals from 2026-08-17 to 2026-09-01 · 25 open, 67 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **76%** of published signals actually triggered (234 of 308) — the rest expired unfilled.
- Of those trades, **75%** reached target 1, 19% stopped out, 6% timed out.
- **Expectancy -0.01R per trade taken**, -0.01R per signal published.
- Promised **0.79R** to target 1 on average; delivered **-0.01R**.
- Trades ran **0.65R** in favour at best and **0.60R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 126 | 74% | 93 | 81% | -0.04 | -0.03 | -3.94 |
| 55–64 | 140 | 77% | 108 | 70% | -0.01 | -0.01 | -0.75 |
| 65–74 (High) | 37 | 78% | 29 | 76% | +0.08 | +0.06 | +2.24 |
| 75+ (High) | 5 | 80% | 4 | 75% | +0.10 | +0.08 | +0.40 |

Spearman rank correlation between confidence and realised R: **0.160** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 59 | +0.18 | 249 | -0.05 | +0.23 | 61% vs 78% |
| `ftfc-full` | 243 | +0.03 | 65 | -0.16 | +0.19 | 78% vs 64% |
| `rr-poor` | 221 | +0.00 | 87 | -0.03 | +0.03 | 86% vs 35% |
| `close-location` | 179 | +0.00 | 129 | -0.02 | +0.02 | 76% vs 74% |
| `reversal-backed` | 185 | -0.01 | 123 | -0.01 | +0.00 | 80% vs 68% |
| `base` | 308 | -0.01 | 0 | +0.00 | -0.01 | 75% vs 0% |
| `in-force` | 165 | -0.01 | 143 | -0.00 | -0.01 | 79% vs 67% |
| `rr-ok` | 81 | -0.02 | 227 | -0.00 | -0.01 | 35% vs 86% |
| `compression` | 94 | -0.04 | 214 | +0.01 | -0.05 | 79% vs 73% |
| `ftfc-aligned` | 65 | -0.16 | 243 | +0.03 | -0.19 | 64% vs 78% |
| `ftfc-opposed` | 65 | -0.16 | 243 | +0.03 | -0.19 | 64% vs 78% |
| `rr-strong` | 6 | -0.20 | 302 | -0.00 | -0.20 | 50% vs 75% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 84 | 83% | 70 | 77% | -0.06 | -0.05 | -4.35 |
| 2-2 Continuation | 82 | 73% | 60 | 63% | +0.05 | +0.04 | +3.00 |
| 2-1-2 Reversal | 36 | 83% | 30 | 80% | +0.01 | +0.00 | +0.17 |
| 3-1-2 Reversal | 28 | 54% | 15 | 73% | -0.01 | -0.00 | -0.11 |
| Rev Strat (1-2-2) Reversal | 26 | 69% | 18 | 89% | +0.12 | +0.08 | +2.18 |
| 2-1-2 Continuation | 25 | 76% | 19 | 89% | -0.11 | -0.09 | -2.16 |
| 3-2 Continuation | 11 | 73% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 11 | 91% | 10 | 90% | +0.10 | +0.09 | +0.99 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 210 | 74% | 156 | 73% | -0.00 | -0.00 | -0.72 |
| W | 80 | 75% | 60 | 78% | -0.07 | -0.06 | -4.47 |
| M | 18 | 100% | 18 | 83% | +0.17 | +0.17 | +3.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 243 | 76% | 184 | 78% | +0.04 | +0.03 | +8.22 |
| Mixed | 65 | 77% | 50 | 64% | -0.21 | -0.16 | -10.28 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 123 | 74% | 91 | 68% | -0.01 | -0.01 | -0.93 |
| Reversal | 185 | 77% | 143 | 80% | -0.01 | -0.01 | -1.12 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 214 | 78% | 166 | 73% | +0.01 | +0.01 | +1.92 |
| Inside-bar compression (X-1-?) | 94 | 72% | 68 | 79% | -0.06 | -0.04 | -3.97 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 8 | 75% | 6 | 83% | +0.54 | +0.40 | +3.22 |
| GLD | 10 | 60% | 6 | 100% | +0.54 | +0.32 | +3.24 |
| XLI | 11 | 73% | 8 | 100% | +0.41 | +0.30 | +3.27 |
| BTC-USD | 9 | 89% | 8 | 75% | +0.30 | +0.27 | +2.41 |
| ETH-USD | 8 | 75% | 6 | 67% | +0.32 | +0.24 | +1.89 |
| DIA | 13 | 69% | 9 | 100% | +0.27 | +0.18 | +2.40 |
| TSLA | 6 | 83% | 5 | 100% | +0.21 | +0.18 | +1.06 |
| QQQ | 7 | 100% | 7 | 100% | +0.10 | +0.10 | +0.68 |
| XRP-USD | 14 | 57% | 8 | 50% | +0.17 | +0.10 | +1.33 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| AMZN | 11 | 91% | 10 | 90% | +0.07 | +0.06 | +0.69 |
| META | 12 | 83% | 10 | 90% | +0.07 | +0.06 | +0.71 |
| XLY | 10 | 90% | 9 | 89% | +0.05 | +0.05 | +0.47 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| JUP-USD | 10 | 10% | 1 | 100% | +0.14 | +0.01 | +0.14 |
| SMH | 7 | 100% | 7 | 86% | -0.01 | -0.01 | -0.04 |
| EURUSD=X | 8 | 13% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| SPY | 7 | 71% | 5 | 80% | -0.03 | -0.02 | -0.17 |
| XLE | 12 | 83% | 10 | 70% | -0.04 | -0.03 | -0.41 |
| XLF | 13 | 85% | 11 | 82% | -0.04 | -0.03 | -0.45 |
| XLC | 7 | 100% | 7 | 86% | -0.05 | -0.05 | -0.32 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| DOGE-USD | 12 | 75% | 9 | 33% | -0.10 | -0.07 | -0.87 |
| MSFT | 6 | 100% | 6 | 67% | -0.07 | -0.07 | -0.45 |
| GOOGL | 7 | 100% | 7 | 71% | -0.08 | -0.08 | -0.53 |
| XLU | 10 | 90% | 9 | 78% | -0.10 | -0.09 | -0.94 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| SOL-USD | 12 | 67% | 8 | 50% | -0.29 | -0.20 | -2.35 |
| AAPL | 8 | 88% | 7 | 57% | -0.39 | -0.34 | -2.76 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| TLT | 8 | 88% | 7 | 57% | -0.44 | -0.39 | -3.09 |
| NVDA | 12 | 67% | 8 | 63% | -0.65 | -0.43 | -5.17 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
