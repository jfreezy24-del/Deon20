# Edge Report — live signal record

_Generated 2026-11-05_ · **1659** settled signals from 2026-08-17 to 2026-11-05 · 32 open, 50 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1133 of 1659) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 5% timed out.
- **Expectancy +2.66R per trade taken**, +1.81R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.66R**.
- Trades ran **3.36R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 794 | 63% | 504 | 79% | +2.52 | +1.60 | +1268.69 |
| 55–64 | 692 | 72% | 496 | 68% | +3.49 | +2.50 | +1728.65 |
| 65–74 (High) | 155 | 77% | 119 | 66% | +0.06 | +0.04 | +6.93 |
| 75+ (High) | 18 | 78% | 14 | 71% | +0.39 | +0.30 | +5.48 |

Spearman rank correlation between confidence and realised R: **0.029** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 497 | +3.87 | 1162 | +0.94 | +2.93 | 77% vs 71% |
| `ftfc-aligned` | 362 | +3.58 | 1297 | +1.32 | +2.26 | 70% vs 74% |
| `ftfc-opposed` | 362 | +3.58 | 1297 | +1.32 | +2.26 | 70% vs 74% |
| `base` | 1659 | +1.81 | 0 | +0.00 | +1.81 | 73% vs 0% |
| `rr-poor` | 1136 | +2.15 | 523 | +1.08 | +1.07 | 84% vs 38% |
| `close-location` | 848 | +2.04 | 811 | +1.57 | +0.47 | 75% vs 70% |
| `reversal-backed` | 957 | +1.92 | 702 | +1.67 | +0.25 | 79% vs 65% |
| `rr-ok` | 483 | +1.17 | 1176 | +2.08 | -0.91 | 38% vs 83% |
| `rr-strong` | 40 | +0.10 | 1619 | +1.86 | -1.75 | 41% vs 74% |
| `ftfc-full` | 1295 | +1.32 | 364 | +3.57 | -2.24 | 74% vs 70% |
| `volume` | 340 | +0.02 | 1319 | +2.28 | -2.26 | 63% vs 75% |
| `in-force` | 778 | -0.03 | 881 | +3.45 | -3.48 | 74% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 476 | 74% | 350 | 77% | -0.04 | -0.03 | -12.27 |
| 2-2 Continuation | 416 | 65% | 269 | 57% | +2.06 | +1.33 | +554.96 |
| 2-1-2 Reversal | 203 | 68% | 138 | 77% | +0.05 | +0.03 | +6.67 |
| 2-1-2 Continuation | 172 | 72% | 123 | 80% | +4.98 | +3.56 | +612.97 |
| Rev Strat (1-2-2) Reversal | 118 | 59% | 70 | 84% | +0.05 | +0.03 | +3.16 |
| 3-2-2 Reversal | 83 | 61% | 51 | 84% | +10.59 | +6.51 | +540.07 |
| 3-1-2 Reversal | 79 | 62% | 49 | 78% | +26.50 | +16.43 | +1298.34 |
| 3-2 Continuation | 69 | 78% | 54 | 65% | +0.04 | +0.03 | +2.08 |
| 1-1-2 Continuation | 43 | 67% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1037 | 65% | 671 | 71% | -0.04 | -0.03 | -26.03 |
| W | 460 | 71% | 326 | 77% | +1.73 | +1.23 | +565.34 |
| M | 162 | 84% | 136 | 69% | +18.17 | +15.25 | +2470.45 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1295 | 65% | 843 | 74% | +2.03 | +1.32 | +1712.06 |
| Mixed | 362 | 80% | 290 | 70% | +4.47 | +3.58 | +1297.69 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 700 | 68% | 475 | 65% | +2.47 | +1.68 | +1173.78 |
| Reversal | 959 | 69% | 658 | 79% | +2.79 | +1.91 | +1835.97 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1162 | 68% | 794 | 71% | +1.37 | +0.94 | +1088.00 |
| Inside-bar compression (X-1-?) | 497 | 68% | 339 | 77% | +5.67 | +3.87 | +1921.76 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 70 | 19% | 13 | 100% | +233.48 | +43.36 | +3035.27 |
| LTC-USD | 30 | 83% | 25 | 88% | +0.25 | +0.21 | +6.27 |
| TLT | 51 | 71% | 36 | 78% | +0.28 | +0.20 | +9.99 |
| AMD | 51 | 76% | 39 | 82% | +0.19 | +0.14 | +7.23 |
| DIA | 53 | 83% | 44 | 86% | +0.09 | +0.08 | +4.11 |
| XLK | 50 | 68% | 34 | 79% | +0.10 | +0.07 | +3.50 |
| META | 55 | 56% | 31 | 74% | +0.12 | +0.07 | +3.76 |
| XLI | 54 | 67% | 36 | 89% | +0.09 | +0.06 | +3.39 |
| BTC-USD | 37 | 84% | 31 | 74% | +0.07 | +0.06 | +2.08 |
| QQQ | 49 | 78% | 38 | 71% | +0.06 | +0.05 | +2.38 |
| XLU | 60 | 72% | 43 | 63% | +0.05 | +0.04 | +2.25 |
| AMZN | 53 | 79% | 42 | 83% | +0.02 | +0.02 | +1.04 |
| NVDA | 54 | 65% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| SMH | 52 | 65% | 34 | 76% | +0.02 | +0.01 | +0.59 |
| EURUSD=X | 52 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 53 | 60% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| XLC | 49 | 78% | 38 | 84% | -0.01 | -0.01 | -0.30 |
| MSFT | 45 | 82% | 37 | 76% | -0.03 | -0.02 | -1.05 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLF | 56 | 79% | 44 | 70% | -0.04 | -0.03 | -1.69 |
| XLY | 46 | 78% | 36 | 81% | -0.05 | -0.04 | -1.76 |
| XRP-USD | 45 | 58% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| XLV | 50 | 74% | 37 | 68% | -0.07 | -0.05 | -2.46 |
| HYPE-USD | 35 | 80% | 28 | 57% | -0.06 | -0.05 | -1.74 |
| GC=F | 53 | 62% | 33 | 76% | -0.08 | -0.05 | -2.75 |
| SPY | 42 | 71% | 30 | 67% | -0.08 | -0.06 | -2.40 |
| DOGE-USD | 41 | 71% | 29 | 55% | -0.11 | -0.08 | -3.25 |
| XLP | 53 | 64% | 34 | 68% | -0.15 | -0.09 | -5.03 |
| ETH-USD | 37 | 81% | 30 | 63% | -0.12 | -0.10 | -3.65 |
| TSLA | 45 | 73% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| AAPL | 49 | 76% | 37 | 68% | -0.18 | -0.13 | -6.48 |
| XLE | 51 | 76% | 39 | 56% | -0.24 | -0.18 | -9.22 |
| GLD | 54 | 72% | 39 | 69% | -0.28 | -0.20 | -10.93 |
| GOOGL | 45 | 84% | 38 | 58% | -0.34 | -0.29 | -13.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
