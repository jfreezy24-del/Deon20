# Edge Report — live signal record

_Generated 2026-11-04_ · **1605** settled signals from 2026-08-17 to 2026-11-04 · 42 open, 62 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1089 of 1605) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.77R per trade taken**, +1.88R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.77R**.
- Trades ran **3.47R** in favour at best and **0.65R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 771 | 63% | 488 | 79% | +2.60 | +1.65 | +1269.20 |
| 55–64 | 668 | 71% | 475 | 68% | +3.65 | +2.60 | +1734.17 |
| 65–74 (High) | 149 | 76% | 113 | 65% | +0.05 | +0.04 | +5.57 |
| 75+ (High) | 17 | 76% | 13 | 69% | +0.40 | +0.30 | +5.16 |

Spearman rank correlation between confidence and realised R: **0.031** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 473 | +4.06 | 1132 | +0.97 | +3.09 | 77% vs 71% |
| `ftfc-aligned` | 341 | +3.80 | 1264 | +1.36 | +2.44 | 70% vs 74% |
| `ftfc-opposed` | 341 | +3.80 | 1264 | +1.36 | +2.44 | 70% vs 74% |
| `base` | 1605 | +1.88 | 0 | +0.00 | +1.88 | 73% vs 0% |
| `rr-poor` | 1098 | +2.23 | 507 | +1.12 | +1.11 | 85% vs 38% |
| `close-location` | 822 | +2.11 | 783 | +1.63 | +0.48 | 75% vs 70% |
| `reversal-backed` | 922 | +1.99 | 683 | +1.72 | +0.27 | 79% vs 65% |
| `rr-ok` | 469 | +1.20 | 1136 | +2.16 | -0.96 | 37% vs 83% |
| `rr-strong` | 38 | +0.17 | 1567 | +1.92 | -1.75 | 41% vs 74% |
| `volume` | 325 | +0.03 | 1280 | +2.35 | -2.32 | 63% vs 75% |
| `ftfc-full` | 1262 | +1.36 | 343 | +3.78 | -2.42 | 74% vs 70% |
| `in-force` | 750 | -0.03 | 855 | +3.55 | -3.58 | 74% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 462 | 74% | 341 | 78% | -0.03 | -0.02 | -8.78 |
| 2-2 Continuation | 410 | 64% | 264 | 58% | +2.11 | +1.36 | +557.37 |
| 2-1-2 Reversal | 193 | 67% | 130 | 76% | +0.04 | +0.02 | +4.61 |
| 2-1-2 Continuation | 165 | 71% | 117 | 79% | +5.24 | +3.71 | +612.88 |
| Rev Strat (1-2-2) Reversal | 115 | 58% | 67 | 84% | +0.04 | +0.02 | +2.85 |
| 3-2-2 Reversal | 81 | 60% | 49 | 84% | +11.02 | +6.67 | +540.07 |
| 3-1-2 Reversal | 73 | 59% | 43 | 79% | +30.20 | +17.79 | +1298.46 |
| 3-2 Continuation | 64 | 77% | 49 | 67% | +0.06 | +0.04 | +2.85 |
| 1-1-2 Continuation | 42 | 69% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1005 | 64% | 646 | 72% | -0.03 | -0.02 | -19.23 |
| W | 446 | 70% | 314 | 77% | +1.79 | +1.26 | +562.11 |
| M | 154 | 84% | 129 | 68% | +19.16 | +16.05 | +2471.21 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1262 | 65% | 818 | 74% | +2.10 | +1.36 | +1718.26 |
| Mixed | 341 | 79% | 271 | 70% | +4.78 | +3.80 | +1295.82 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 681 | 67% | 459 | 65% | +2.56 | +1.73 | +1176.89 |
| Reversal | 924 | 68% | 630 | 79% | +2.92 | +1.99 | +1837.20 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1132 | 68% | 770 | 71% | +1.42 | +0.97 | +1094.36 |
| Inside-bar compression (X-1-?) | 473 | 67% | 319 | 77% | +6.02 | +4.06 | +1919.73 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 70 | 19% | 13 | 100% | +233.48 | +43.36 | +3035.27 |
| TLT | 50 | 70% | 35 | 80% | +0.31 | +0.22 | +10.99 |
| LTC-USD | 30 | 83% | 25 | 88% | +0.25 | +0.21 | +6.27 |
| AMD | 50 | 76% | 38 | 82% | +0.17 | +0.13 | +6.59 |
| DIA | 51 | 82% | 42 | 86% | +0.10 | +0.08 | +4.11 |
| BTC-USD | 36 | 83% | 30 | 77% | +0.09 | +0.08 | +2.73 |
| XLK | 50 | 68% | 34 | 79% | +0.10 | +0.07 | +3.50 |
| META | 54 | 56% | 30 | 73% | +0.12 | +0.07 | +3.72 |
| XLI | 53 | 66% | 35 | 89% | +0.10 | +0.06 | +3.35 |
| XLU | 55 | 71% | 39 | 64% | +0.05 | +0.03 | +1.91 |
| XLC | 46 | 76% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| AMZN | 49 | 78% | 38 | 82% | +0.03 | +0.02 | +1.04 |
| QQQ | 48 | 77% | 37 | 70% | +0.02 | +0.01 | +0.58 |
| EURUSD=X | 51 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| NVDA | 50 | 64% | 32 | 69% | +0.01 | +0.00 | +0.22 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLF | 54 | 80% | 43 | 70% | -0.04 | -0.03 | -1.69 |
| MSFT | 41 | 80% | 33 | 76% | -0.04 | -0.04 | -1.46 |
| XRP-USD | 45 | 58% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| XLY | 43 | 81% | 35 | 80% | -0.05 | -0.04 | -1.76 |
| ETH-USD | 35 | 80% | 28 | 68% | -0.06 | -0.05 | -1.65 |
| HYPE-USD | 35 | 80% | 28 | 57% | -0.06 | -0.05 | -1.74 |
| SPY | 41 | 71% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| XLV | 48 | 73% | 35 | 66% | -0.10 | -0.08 | -3.63 |
| GC=F | 51 | 63% | 32 | 75% | -0.13 | -0.08 | -4.01 |
| DOGE-USD | 41 | 71% | 29 | 55% | -0.11 | -0.08 | -3.25 |
| XLP | 52 | 63% | 33 | 67% | -0.15 | -0.10 | -5.03 |
| AAPL | 46 | 76% | 35 | 69% | -0.15 | -0.11 | -5.26 |
| TSLA | 45 | 73% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| GLD | 52 | 71% | 37 | 70% | -0.22 | -0.15 | -8.02 |
| XLE | 51 | 76% | 39 | 56% | -0.24 | -0.18 | -9.22 |
| GOOGL | 43 | 84% | 36 | 61% | -0.31 | -0.26 | -11.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
