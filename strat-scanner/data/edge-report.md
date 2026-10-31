# Edge Report — live signal record

_Generated 2026-10-31_ · **1543** settled signals from 2026-08-17 to 2026-10-31 · 31 open, 38 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1061 of 1543) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.84R per trade taken**, +1.95R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.84R**.
- Trades ran **3.55R** in favour at best and **0.65R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 747 | 64% | 479 | 79% | +2.65 | +1.70 | +1268.76 |
| 55–64 | 639 | 72% | 460 | 68% | +3.77 | +2.72 | +1736.28 |
| 65–74 (High) | 141 | 77% | 109 | 66% | +0.04 | +0.03 | +4.48 |
| 75+ (High) | 16 | 81% | 13 | 69% | +0.40 | +0.32 | +5.16 |

Spearman rank correlation between confidence and realised R: **0.031** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 452 | +4.24 | 1091 | +1.01 | +3.24 | 76% vs 71% |
| `ftfc-aligned` | 328 | +3.94 | 1215 | +1.42 | +2.53 | 69% vs 74% |
| `ftfc-opposed` | 328 | +3.94 | 1215 | +1.42 | +2.53 | 69% vs 74% |
| `base` | 1543 | +1.95 | 0 | +0.00 | +1.95 | 73% vs 0% |
| `rr-poor` | 1061 | +2.30 | 482 | +1.19 | +1.12 | 84% vs 38% |
| `close-location` | 790 | +2.19 | 753 | +1.70 | +0.49 | 74% vs 71% |
| `reversal-backed` | 892 | +2.06 | 651 | +1.81 | +0.24 | 78% vs 65% |
| `rr-ok` | 445 | +1.27 | 1098 | +2.23 | -0.97 | 38% vs 83% |
| `rr-strong` | 37 | +0.20 | 1506 | +2.00 | -1.79 | 42% vs 74% |
| `volume` | 299 | +0.04 | 1244 | +2.41 | -2.38 | 64% vs 75% |
| `ftfc-full` | 1214 | +1.42 | 329 | +3.93 | -2.51 | 74% vs 69% |
| `in-force` | 728 | -0.03 | 815 | +3.72 | -3.75 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 450 | 74% | 335 | 77% | -0.03 | -0.02 | -9.45 |
| 2-2 Continuation | 390 | 66% | 256 | 59% | +2.19 | +1.44 | +560.56 |
| 2-1-2 Reversal | 186 | 68% | 126 | 75% | +0.02 | +0.01 | +2.48 |
| 2-1-2 Continuation | 160 | 71% | 114 | 79% | +5.38 | +3.84 | +613.83 |
| Rev Strat (1-2-2) Reversal | 113 | 58% | 66 | 85% | +0.06 | +0.03 | +3.85 |
| 3-2-2 Reversal | 77 | 62% | 48 | 83% | +11.25 | +7.01 | +539.90 |
| 3-1-2 Reversal | 67 | 61% | 41 | 78% | +31.65 | +19.37 | +1297.61 |
| 3-2 Continuation | 61 | 77% | 47 | 66% | +0.06 | +0.05 | +2.75 |
| 1-1-2 Continuation | 39 | 72% | 28 | 68% | +0.11 | +0.08 | +3.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 955 | 65% | 624 | 72% | -0.03 | -0.02 | -19.36 |
| W | 440 | 71% | 311 | 77% | +1.81 | +1.28 | +561.98 |
| M | 148 | 85% | 126 | 68% | +19.62 | +16.70 | +2472.05 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1214 | 66% | 800 | 74% | +2.15 | +1.42 | +1720.90 |
| Mixed | 328 | 80% | 261 | 69% | +4.96 | +3.94 | +1293.78 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 650 | 68% | 445 | 65% | +2.65 | +1.82 | +1180.30 |
| Reversal | 893 | 69% | 616 | 78% | +2.98 | +2.05 | +1834.38 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1091 | 69% | 752 | 71% | +1.46 | +1.01 | +1097.60 |
| Inside-bar compression (X-1-?) | 452 | 68% | 309 | 76% | +6.20 | +4.24 | +1917.08 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 64 | 19% | 12 | 100% | +252.89 | +47.42 | +3034.65 |
| LTC-USD | 27 | 81% | 22 | 86% | +0.28 | +0.23 | +6.18 |
| TLT | 49 | 69% | 34 | 79% | +0.32 | +0.22 | +10.99 |
| AMD | 49 | 76% | 37 | 81% | +0.18 | +0.13 | +6.52 |
| DIA | 50 | 84% | 42 | 86% | +0.10 | +0.08 | +4.11 |
| XLK | 49 | 67% | 33 | 79% | +0.10 | +0.07 | +3.46 |
| XLI | 51 | 67% | 34 | 88% | +0.10 | +0.07 | +3.35 |
| META | 52 | 54% | 28 | 75% | +0.11 | +0.06 | +3.07 |
| BTC-USD | 33 | 88% | 29 | 76% | +0.04 | +0.04 | +1.24 |
| XLU | 53 | 74% | 39 | 64% | +0.05 | +0.04 | +1.91 |
| QQQ | 46 | 76% | 35 | 71% | +0.04 | +0.03 | +1.56 |
| XLC | 45 | 78% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| AMZN | 47 | 81% | 38 | 82% | +0.03 | +0.02 | +1.04 |
| EURUSD=X | 49 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| NVDA | 49 | 65% | 32 | 69% | +0.01 | +0.00 | +0.22 |
| XLF | 52 | 81% | 42 | 71% | -0.02 | -0.01 | -0.69 |
| ETH-USD | 34 | 79% | 27 | 70% | -0.02 | -0.02 | -0.65 |
| SOL-USD | 37 | 76% | 28 | 68% | -0.04 | -0.03 | -1.05 |
| MSFT | 40 | 80% | 32 | 75% | -0.05 | -0.04 | -1.62 |
| XLY | 42 | 81% | 34 | 79% | -0.05 | -0.04 | -1.76 |
| HYPE-USD | 33 | 79% | 26 | 58% | -0.06 | -0.04 | -1.47 |
| XRP-USD | 40 | 65% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| SPY | 40 | 73% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| XLV | 46 | 76% | 35 | 66% | -0.10 | -0.08 | -3.63 |
| DOGE-USD | 38 | 71% | 27 | 52% | -0.13 | -0.09 | -3.38 |
| XLP | 49 | 63% | 31 | 68% | -0.14 | -0.09 | -4.47 |
| AAPL | 45 | 76% | 34 | 71% | -0.13 | -0.09 | -4.25 |
| GC=F | 49 | 63% | 31 | 74% | -0.15 | -0.09 | -4.63 |
| TSLA | 42 | 76% | 32 | 75% | -0.17 | -0.13 | -5.30 |
| GLD | 51 | 73% | 37 | 70% | -0.22 | -0.16 | -8.02 |
| XLE | 50 | 76% | 38 | 55% | -0.25 | -0.19 | -9.40 |
| GOOGL | 42 | 86% | 36 | 61% | -0.31 | -0.26 | -11.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
