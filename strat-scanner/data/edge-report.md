# Edge Report — live signal record

_Generated 2026-11-10_ · **1776** settled signals from 2026-08-17 to 2026-11-10 · 33 open, 40 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1206 of 1776) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.49R per trade taken**, +1.69R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.49R**.
- Trades ran **3.21R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 844 | 63% | 533 | 80% | +2.38 | +1.50 | +1267.27 |
| 55–64 | 737 | 71% | 526 | 67% | +3.27 | +2.34 | +1721.76 |
| 65–74 (High) | 176 | 75% | 132 | 67% | +0.08 | +0.06 | +11.18 |
| 75+ (High) | 19 | 79% | 15 | 73% | +0.41 | +0.32 | +6.10 |

Spearman rank correlation between confidence and realised R: **0.019** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 531 | +3.62 | 1245 | +0.87 | +2.75 | 77% vs 71% |
| `ftfc-aligned` | 394 | +3.32 | 1382 | +1.23 | +2.08 | 70% vs 73% |
| `ftfc-opposed` | 394 | +3.32 | 1382 | +1.23 | +2.08 | 70% vs 73% |
| `base` | 1776 | +1.69 | 0 | +0.00 | +1.69 | 73% vs 0% |
| `rr-poor` | 1222 | +1.99 | 554 | +1.04 | +0.95 | 84% vs 38% |
| `close-location` | 912 | +1.89 | 864 | +1.49 | +0.40 | 74% vs 70% |
| `reversal-backed` | 1029 | +1.78 | 747 | +1.57 | +0.21 | 78% vs 65% |
| `rr-ok` | 508 | +1.11 | 1268 | +1.93 | -0.82 | 38% vs 82% |
| `rr-strong` | 46 | +0.28 | 1730 | +1.73 | -1.45 | 43% vs 74% |
| `ftfc-full` | 1380 | +1.23 | 396 | +3.30 | -2.07 | 73% vs 70% |
| `volume` | 384 | +0.02 | 1392 | +2.15 | -2.13 | 65% vs 74% |
| `in-force` | 822 | -0.03 | 954 | +3.18 | -3.21 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 500 | 74% | 369 | 77% | -0.05 | -0.04 | -19.38 |
| 2-2 Continuation | 445 | 64% | 284 | 58% | +1.96 | +1.25 | +557.20 |
| 2-1-2 Reversal | 218 | 67% | 145 | 76% | +0.03 | +0.02 | +4.61 |
| 2-1-2 Continuation | 182 | 70% | 128 | 78% | +4.75 | +3.34 | +608.59 |
| Rev Strat (1-2-2) Reversal | 135 | 61% | 83 | 84% | +0.03 | +0.02 | +2.82 |
| 3-2-2 Reversal | 93 | 63% | 59 | 80% | +9.14 | +5.80 | +539.16 |
| 3-1-2 Reversal | 85 | 60% | 51 | 78% | +25.61 | +15.37 | +1306.31 |
| 3-2 Continuation | 72 | 79% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1101 | 64% | 704 | 72% | -0.03 | -0.02 | -24.15 |
| W | 484 | 71% | 342 | 77% | +1.63 | +1.16 | +559.17 |
| M | 191 | 84% | 160 | 68% | +15.45 | +12.94 | +2471.28 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1380 | 65% | 898 | 73% | +1.89 | +1.23 | +1700.14 |
| Mixed | 394 | 78% | 308 | 70% | +4.24 | +3.32 | +1306.16 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 745 | 67% | 499 | 65% | +2.35 | +1.57 | +1172.79 |
| Reversal | 1031 | 69% | 707 | 78% | +2.59 | +1.78 | +1833.51 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1245 | 68% | 852 | 71% | +1.27 | +0.87 | +1082.57 |
| Inside-bar compression (X-1-?) | 531 | 67% | 354 | 77% | +5.43 | +3.62 | +1923.73 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 76 | 17% | 13 | 100% | +233.48 | +39.94 | +3035.27 |
| AMD | 57 | 77% | 44 | 84% | +0.43 | +0.33 | +18.95 |
| LTC-USD | 33 | 82% | 27 | 89% | +0.25 | +0.21 | +6.80 |
| TLT | 52 | 71% | 37 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 56 | 66% | 37 | 81% | +0.14 | +0.09 | +5.10 |
| META | 58 | 57% | 33 | 76% | +0.13 | +0.08 | +4.42 |
| XLI | 56 | 68% | 38 | 89% | +0.09 | +0.06 | +3.42 |
| BTC-USD | 38 | 84% | 32 | 75% | +0.07 | +0.06 | +2.15 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 61 | 72% | 44 | 64% | +0.05 | +0.04 | +2.25 |
| DIA | 56 | 84% | 47 | 83% | +0.04 | +0.03 | +1.88 |
| QQQ | 54 | 76% | 41 | 71% | +0.04 | +0.03 | +1.56 |
| NVDA | 56 | 63% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| EURUSD=X | 55 | 5% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| AMZN | 55 | 78% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 48 | 83% | 40 | 78% | -0.02 | -0.01 | -0.66 |
| XRP-USD | 48 | 60% | 29 | 69% | -0.03 | -0.02 | -0.75 |
| IWM | 59 | 63% | 37 | 70% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 40 | 73% | 29 | 69% | -0.03 | -0.02 | -1.00 |
| GC=F | 57 | 61% | 35 | 77% | -0.05 | -0.03 | -1.92 |
| XLC | 52 | 75% | 39 | 82% | -0.05 | -0.03 | -1.79 |
| HYPE-USD | 37 | 81% | 30 | 60% | -0.04 | -0.04 | -1.31 |
| DOGE-USD | 47 | 72% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| SPY | 45 | 71% | 32 | 69% | -0.06 | -0.04 | -1.92 |
| ETH-USD | 39 | 82% | 32 | 66% | -0.10 | -0.08 | -3.11 |
| XLF | 60 | 78% | 47 | 66% | -0.11 | -0.09 | -5.32 |
| XLV | 55 | 73% | 40 | 65% | -0.12 | -0.09 | -4.97 |
| TSLA | 46 | 72% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| XLY | 51 | 76% | 39 | 77% | -0.15 | -0.11 | -5.77 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 50 | 76% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| XLE | 56 | 75% | 42 | 57% | -0.23 | -0.17 | -9.61 |
| GLD | 60 | 68% | 41 | 71% | -0.27 | -0.18 | -10.93 |
| GOOGL | 51 | 82% | 42 | 55% | -0.41 | -0.34 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
