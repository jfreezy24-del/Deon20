# Edge Report — live signal record

_Generated 2026-11-09_ · **1754** settled signals from 2026-08-17 to 2026-11-09 · 34 open, 32 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1190 of 1754) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.53R per trade taken**, +1.71R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.53R**.
- Trades ran **3.25R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 837 | 63% | 526 | 80% | +2.41 | +1.51 | +1266.66 |
| 55–64 | 726 | 72% | 520 | 67% | +3.32 | +2.37 | +1724.02 |
| 65–74 (High) | 173 | 75% | 130 | 67% | +0.09 | +0.07 | +11.79 |
| 75+ (High) | 18 | 78% | 14 | 71% | +0.39 | +0.30 | +5.48 |

Spearman rank correlation between confidence and realised R: **0.020** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 528 | +3.64 | 1226 | +0.89 | +2.76 | 76% vs 71% |
| `ftfc-aligned` | 389 | +3.35 | 1365 | +1.25 | +2.11 | 70% vs 74% |
| `ftfc-opposed` | 389 | +3.35 | 1365 | +1.25 | +2.11 | 70% vs 74% |
| `base` | 1754 | +1.71 | 0 | +0.00 | +1.71 | 73% vs 0% |
| `rr-poor` | 1209 | +2.01 | 545 | +1.06 | +0.95 | 84% vs 39% |
| `close-location` | 901 | +1.91 | 853 | +1.51 | +0.40 | 75% vs 70% |
| `reversal-backed` | 1012 | +1.81 | 742 | +1.58 | +0.23 | 78% vs 65% |
| `rr-ok` | 502 | +1.12 | 1252 | +1.95 | -0.83 | 38% vs 83% |
| `rr-strong` | 43 | +0.33 | 1711 | +1.75 | -1.42 | 44% vs 73% |
| `ftfc-full` | 1363 | +1.25 | 391 | +3.34 | -2.09 | 74% vs 70% |
| `volume` | 379 | +0.02 | 1375 | +2.18 | -2.17 | 64% vs 75% |
| `in-force` | 811 | -0.03 | 943 | +3.22 | -3.25 | 74% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 490 | 73% | 360 | 77% | -0.05 | -0.04 | -19.73 |
| 2-2 Continuation | 441 | 64% | 283 | 59% | +1.97 | +1.27 | +558.20 |
| 2-1-2 Reversal | 216 | 66% | 143 | 76% | +0.03 | +0.02 | +3.61 |
| 2-1-2 Continuation | 182 | 70% | 128 | 78% | +4.75 | +3.34 | +608.59 |
| Rev Strat (1-2-2) Reversal | 134 | 62% | 83 | 84% | +0.03 | +0.02 | +2.82 |
| 3-2-2 Reversal | 89 | 62% | 55 | 82% | +9.84 | +6.08 | +541.16 |
| 3-1-2 Reversal | 85 | 60% | 51 | 78% | +25.61 | +15.37 | +1306.31 |
| 3-2 Continuation | 72 | 79% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 45 | 67% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1086 | 64% | 694 | 71% | -0.04 | -0.02 | -25.91 |
| W | 481 | 71% | 340 | 77% | +1.65 | +1.16 | +560.17 |
| M | 187 | 83% | 156 | 69% | +15.86 | +13.23 | +2473.69 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1363 | 65% | 887 | 74% | +1.92 | +1.25 | +1702.98 |
| Mixed | 389 | 78% | 303 | 70% | +4.31 | +3.35 | +1304.96 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 740 | 67% | 498 | 65% | +2.36 | +1.59 | +1173.79 |
| Reversal | 1014 | 68% | 692 | 78% | +2.65 | +1.81 | +1834.16 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1226 | 68% | 838 | 71% | +1.30 | +0.89 | +1085.22 |
| Inside-bar compression (X-1-?) | 528 | 67% | 352 | 76% | +5.46 | +3.64 | +1922.73 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 74 | 18% | 13 | 100% | +233.48 | +41.02 | +3035.27 |
| AMD | 55 | 76% | 42 | 83% | +0.43 | +0.33 | +18.19 |
| LTC-USD | 32 | 84% | 27 | 89% | +0.25 | +0.21 | +6.80 |
| TLT | 52 | 71% | 37 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 56 | 66% | 37 | 81% | +0.14 | +0.09 | +5.10 |
| META | 58 | 57% | 33 | 76% | +0.13 | +0.08 | +4.42 |
| XLI | 56 | 68% | 38 | 89% | +0.09 | +0.06 | +3.42 |
| BTC-USD | 38 | 84% | 32 | 75% | +0.07 | +0.06 | +2.15 |
| SMH | 54 | 65% | 35 | 77% | +0.06 | +0.04 | +2.09 |
| XLU | 60 | 72% | 43 | 63% | +0.05 | +0.04 | +2.25 |
| DIA | 55 | 84% | 46 | 83% | +0.04 | +0.03 | +1.88 |
| QQQ | 54 | 76% | 41 | 71% | +0.04 | +0.03 | +1.56 |
| NVDA | 56 | 63% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| EURUSD=X | 54 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| AMZN | 55 | 78% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 47 | 83% | 39 | 77% | -0.02 | -0.01 | -0.66 |
| XRP-USD | 48 | 60% | 29 | 69% | -0.03 | -0.02 | -0.75 |
| IWM | 58 | 62% | 36 | 69% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLC | 52 | 75% | 39 | 82% | -0.05 | -0.03 | -1.79 |
| HYPE-USD | 37 | 81% | 30 | 60% | -0.04 | -0.04 | -1.31 |
| DOGE-USD | 46 | 74% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| SPY | 45 | 71% | 32 | 69% | -0.06 | -0.04 | -1.92 |
| GC=F | 56 | 61% | 34 | 76% | -0.07 | -0.04 | -2.41 |
| XLF | 59 | 78% | 46 | 67% | -0.09 | -0.07 | -4.30 |
| ETH-USD | 39 | 82% | 32 | 66% | -0.10 | -0.08 | -3.11 |
| XLV | 55 | 73% | 40 | 65% | -0.12 | -0.09 | -4.97 |
| XLP | 54 | 63% | 34 | 68% | -0.15 | -0.09 | -5.03 |
| TSLA | 46 | 72% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| XLY | 51 | 76% | 39 | 77% | -0.15 | -0.11 | -5.77 |
| AAPL | 49 | 76% | 37 | 68% | -0.18 | -0.13 | -6.48 |
| XLE | 54 | 74% | 40 | 57% | -0.23 | -0.17 | -9.22 |
| GLD | 59 | 68% | 40 | 70% | -0.27 | -0.19 | -10.93 |
| GOOGL | 51 | 82% | 42 | 55% | -0.41 | -0.34 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
