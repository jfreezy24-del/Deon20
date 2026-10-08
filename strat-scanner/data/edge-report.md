# Edge Report — live signal record

_Generated 2026-10-08_ · **1078** settled signals from 2026-08-17 to 2026-10-08 · 42 open, 57 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (747 of 1078) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 5% timed out.
- **Expectancy +4.04R per trade taken**, +2.80R per signal published.
- Promised **0.74R** to target 1 on average; delivered **+4.04R**.
- Trades ran **4.74R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 504 | 64% | 324 | 80% | +3.97 | +2.55 | +1285.21 |
| 55–64 | 457 | 72% | 331 | 69% | +5.24 | +3.80 | +1736.01 |
| 65–74 (High) | 103 | 79% | 81 | 62% | -0.03 | -0.02 | -2.50 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.020** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 327 | +5.84 | 751 | +1.48 | +4.37 | 75% vs 72% |
| `ftfc-aligned` | 236 | +5.49 | 842 | +2.05 | +3.44 | 69% vs 74% |
| `ftfc-opposed` | 236 | +5.49 | 842 | +2.05 | +3.44 | 69% vs 74% |
| `base` | 1078 | +2.80 | 0 | +0.00 | +2.80 | 73% vs 0% |
| `rr-poor` | 741 | +3.30 | 337 | +1.70 | +1.60 | 85% vs 38% |
| `close-location` | 570 | +3.05 | 508 | +2.52 | +0.54 | 75% vs 71% |
| `reversal-backed` | 618 | +2.95 | 460 | +2.60 | +0.35 | 78% vs 67% |
| `rr-ok` | 312 | +1.84 | 766 | +3.20 | -1.36 | 39% vs 83% |
| `rr-strong` | 25 | +0.01 | 1053 | +2.87 | -2.86 | 33% vs 74% |
| `ftfc-full` | 841 | +2.05 | 237 | +5.47 | -3.42 | 74% vs 69% |
| `volume` | 227 | +0.07 | 851 | +3.53 | -3.46 | 63% vs 75% |
| `in-force` | 522 | -0.03 | 556 | +5.46 | -5.48 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 307 | 73% | 225 | 77% | -0.05 | -0.04 | -11.64 |
| 2-2 Continuation | 272 | 65% | 176 | 59% | +3.25 | +2.11 | +572.69 |
| 2-1-2 Reversal | 129 | 69% | 89 | 73% | -0.06 | -0.04 | -5.49 |
| 2-1-2 Continuation | 112 | 76% | 85 | 78% | +7.22 | +5.48 | +614.01 |
| Rev Strat (1-2-2) Reversal | 81 | 63% | 51 | 86% | +0.08 | +0.05 | +4.02 |
| 3-1-2 Reversal | 55 | 60% | 33 | 79% | +39.34 | +23.60 | +1298.19 |
| 3-2-2 Reversal | 47 | 62% | 29 | 79% | +18.57 | +11.46 | +538.60 |
| 3-2 Continuation | 44 | 77% | 34 | 79% | +0.16 | +0.12 | +5.38 |
| 1-1-2 Continuation | 31 | 81% | 25 | 72% | +0.18 | +0.14 | +4.48 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 668 | 66% | 440 | 71% | -0.02 | -0.02 | -10.30 |
| W | 295 | 72% | 212 | 78% | +2.70 | +1.94 | +571.62 |
| M | 115 | 83% | 95 | 69% | +25.88 | +21.38 | +2458.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 841 | 67% | 563 | 74% | +3.06 | +2.05 | +1724.12 |
| Mixed | 236 | 78% | 184 | 69% | +7.04 | +5.49 | +1296.12 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 459 | 70% | 320 | 67% | +3.74 | +2.61 | +1196.56 |
| Reversal | 619 | 69% | 427 | 78% | +4.27 | +2.95 | +1823.68 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 751 | 69% | 515 | 72% | +2.15 | +1.48 | +1109.05 |
| Inside-bar compression (X-1-?) | 327 | 71% | 232 | 75% | +8.24 | +5.84 | +1911.19 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 45 | 24% | 11 | 100% | +275.81 | +67.42 | +3033.94 |
| LTC-USD | 18 | 83% | 15 | 93% | +0.42 | +0.35 | +6.37 |
| AMD | 35 | 80% | 28 | 82% | +0.29 | +0.23 | +8.19 |
| TLT | 33 | 73% | 24 | 75% | +0.31 | +0.22 | +7.42 |
| DIA | 37 | 81% | 30 | 87% | +0.18 | +0.14 | +5.34 |
| ETH-USD | 24 | 79% | 19 | 84% | +0.16 | +0.13 | +3.04 |
| XLI | 35 | 66% | 23 | 91% | +0.18 | +0.12 | +4.03 |
| XLU | 40 | 80% | 32 | 66% | +0.12 | +0.10 | +3.95 |
| AMZN | 33 | 79% | 26 | 85% | +0.10 | +0.08 | +2.65 |
| IWM | 36 | 61% | 22 | 77% | +0.13 | +0.08 | +2.77 |
| META | 40 | 53% | 21 | 76% | +0.12 | +0.06 | +2.59 |
| BTC-USD | 24 | 92% | 22 | 73% | +0.03 | +0.02 | +0.60 |
| XLF | 39 | 74% | 29 | 69% | +0.02 | +0.02 | +0.67 |
| EURUSD=X | 37 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLC | 30 | 77% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| XLK | 35 | 71% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| SMH | 33 | 70% | 23 | 74% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SPY | 28 | 75% | 21 | 67% | -0.07 | -0.05 | -1.53 |
| GLD | 35 | 63% | 22 | 77% | -0.11 | -0.07 | -2.37 |
| SOL-USD | 27 | 78% | 21 | 62% | -0.09 | -0.07 | -1.94 |
| MSFT | 27 | 81% | 22 | 77% | -0.09 | -0.07 | -2.02 |
| DOGE-USD | 29 | 72% | 21 | 48% | -0.11 | -0.08 | -2.36 |
| TSLA | 32 | 75% | 24 | 75% | -0.12 | -0.09 | -2.81 |
| XLY | 26 | 85% | 22 | 77% | -0.14 | -0.11 | -2.98 |
| QQQ | 27 | 81% | 22 | 68% | -0.14 | -0.11 | -3.10 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| AAPL | 31 | 77% | 24 | 71% | -0.15 | -0.12 | -3.60 |
| XLV | 26 | 73% | 19 | 63% | -0.18 | -0.13 | -3.51 |
| NVDA | 31 | 58% | 18 | 67% | -0.30 | -0.17 | -5.35 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| GC=F | 32 | 66% | 21 | 67% | -0.29 | -0.19 | -6.02 |
| XLP | 28 | 79% | 22 | 59% | -0.29 | -0.23 | -6.38 |
| GOOGL | 27 | 85% | 23 | 57% | -0.34 | -0.29 | -7.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
