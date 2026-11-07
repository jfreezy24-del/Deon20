# Edge Report — live signal record

_Generated 2026-11-07_ · **1717** settled signals from 2026-08-17 to 2026-11-06 · 33 open, 38 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1179 of 1717) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.55R per trade taken**, +1.75R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.55R**.
- Trades ran **3.27R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 813 | 64% | 518 | 79% | +2.44 | +1.56 | +1264.67 |
| 55–64 | 717 | 72% | 517 | 67% | +3.33 | +2.40 | +1723.32 |
| 65–74 (High) | 169 | 77% | 130 | 67% | +0.09 | +0.07 | +11.79 |
| 75+ (High) | 18 | 78% | 14 | 71% | +0.39 | +0.30 | +5.48 |

Spearman rank correlation between confidence and realised R: **0.023** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 512 | +3.75 | 1205 | +0.90 | +2.85 | 76% vs 71% |
| `ftfc-aligned` | 373 | +3.50 | 1344 | +1.27 | +2.23 | 70% vs 73% |
| `ftfc-opposed` | 373 | +3.50 | 1344 | +1.27 | +2.23 | 70% vs 73% |
| `base` | 1717 | +1.75 | 0 | +0.00 | +1.75 | 72% vs 0% |
| `rr-poor` | 1181 | +2.06 | 536 | +1.08 | +0.98 | 84% vs 39% |
| `close-location` | 879 | +1.96 | 838 | +1.53 | +0.42 | 74% vs 70% |
| `reversal-backed` | 993 | +1.85 | 724 | +1.62 | +0.23 | 78% vs 65% |
| `rr-ok` | 493 | +1.14 | 1224 | +2.00 | -0.85 | 38% vs 82% |
| `rr-strong` | 43 | +0.33 | 1674 | +1.79 | -1.46 | 44% vs 73% |
| `volume` | 365 | +0.02 | 1352 | +2.22 | -2.20 | 64% vs 74% |
| `ftfc-full` | 1342 | +1.27 | 375 | +3.48 | -2.21 | 73% vs 70% |
| `in-force` | 806 | -0.03 | 911 | +3.33 | -3.36 | 74% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 489 | 74% | 360 | 77% | -0.05 | -0.04 | -19.73 |
| 2-2 Continuation | 429 | 65% | 278 | 58% | +2.00 | +1.30 | +556.78 |
| 2-1-2 Reversal | 211 | 68% | 143 | 76% | +0.03 | +0.02 | +3.61 |
| 2-1-2 Continuation | 177 | 72% | 127 | 78% | +4.79 | +3.44 | +608.43 |
| Rev Strat (1-2-2) Reversal | 129 | 63% | 81 | 84% | +0.03 | +0.02 | +2.75 |
| 3-2-2 Reversal | 86 | 63% | 54 | 81% | +10.02 | +6.29 | +540.84 |
| 3-1-2 Reversal | 80 | 63% | 50 | 78% | +26.12 | +16.33 | +1306.03 |
| 3-2 Continuation | 72 | 79% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 44 | 66% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1062 | 65% | 690 | 71% | -0.04 | -0.03 | -26.59 |
| W | 476 | 71% | 337 | 77% | +1.66 | +1.17 | +558.94 |
| M | 179 | 85% | 152 | 68% | +16.27 | +13.82 | +2472.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1342 | 65% | 878 | 73% | +1.94 | +1.27 | +1700.59 |
| Mixed | 373 | 81% | 301 | 70% | +4.33 | +3.50 | +1304.66 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 722 | 68% | 491 | 65% | +2.39 | +1.62 | +1171.76 |
| Reversal | 995 | 69% | 688 | 78% | +2.66 | +1.84 | +1833.49 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1205 | 69% | 830 | 71% | +1.31 | +0.90 | +1083.42 |
| Inside-bar compression (X-1-?) | 512 | 68% | 349 | 76% | +5.51 | +3.75 | +1921.84 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 71 | 18% | 13 | 100% | +233.48 | +42.75 | +3035.27 |
| AMD | 54 | 78% | 42 | 83% | +0.43 | +0.34 | +18.19 |
| LTC-USD | 30 | 83% | 25 | 88% | +0.25 | +0.21 | +6.27 |
| TLT | 52 | 71% | 37 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 54 | 69% | 37 | 81% | +0.14 | +0.09 | +5.10 |
| META | 57 | 58% | 33 | 76% | +0.13 | +0.08 | +4.42 |
| XLI | 56 | 68% | 38 | 89% | +0.09 | +0.06 | +3.42 |
| BTC-USD | 38 | 84% | 32 | 75% | +0.07 | +0.06 | +2.15 |
| SMH | 53 | 66% | 35 | 77% | +0.06 | +0.04 | +2.09 |
| XLU | 60 | 72% | 43 | 63% | +0.05 | +0.04 | +2.25 |
| DIA | 55 | 84% | 46 | 83% | +0.04 | +0.03 | +1.88 |
| QQQ | 52 | 79% | 41 | 71% | +0.04 | +0.03 | +1.56 |
| NVDA | 54 | 65% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| EURUSD=X | 53 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| AMZN | 54 | 80% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 47 | 83% | 39 | 77% | -0.02 | -0.01 | -0.66 |
| IWM | 58 | 62% | 36 | 69% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLC | 51 | 76% | 39 | 82% | -0.05 | -0.04 | -1.79 |
| HYPE-USD | 36 | 81% | 29 | 59% | -0.05 | -0.04 | -1.33 |
| XRP-USD | 45 | 58% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| SPY | 44 | 73% | 32 | 69% | -0.06 | -0.04 | -1.92 |
| GC=F | 55 | 62% | 34 | 76% | -0.07 | -0.04 | -2.41 |
| DOGE-USD | 43 | 72% | 31 | 58% | -0.08 | -0.06 | -2.53 |
| XLF | 58 | 79% | 46 | 67% | -0.09 | -0.07 | -4.30 |
| XLV | 54 | 74% | 40 | 65% | -0.12 | -0.09 | -4.97 |
| XLP | 54 | 63% | 34 | 68% | -0.15 | -0.09 | -5.03 |
| ETH-USD | 37 | 81% | 30 | 63% | -0.12 | -0.10 | -3.65 |
| TSLA | 45 | 73% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| XLY | 49 | 80% | 39 | 77% | -0.15 | -0.12 | -5.77 |
| AAPL | 49 | 76% | 37 | 68% | -0.18 | -0.13 | -6.48 |
| XLE | 53 | 75% | 40 | 57% | -0.23 | -0.17 | -9.22 |
| GLD | 58 | 69% | 40 | 70% | -0.27 | -0.19 | -10.93 |
| GOOGL | 49 | 86% | 42 | 55% | -0.41 | -0.35 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
