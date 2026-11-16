# Edge Report — live signal record

_Generated 2026-11-16_ · **1906** settled signals from 2026-08-17 to 2026-11-16 · 39 open, 43 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1292 of 1906) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.35R per trade taken**, +1.59R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.35R**.
- Trades ran **3.05R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 907 | 63% | 574 | 80% | +2.22 | +1.41 | +1275.32 |
| 55–64 | 789 | 71% | 559 | 68% | +3.10 | +2.20 | +1734.06 |
| 65–74 (High) | 188 | 75% | 141 | 68% | +0.11 | +0.08 | +15.19 |
| 75+ (High) | 22 | 82% | 18 | 72% | +0.47 | +0.38 | +8.45 |

Spearman rank correlation between confidence and realised R: **0.018** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 574 | +3.36 | 1332 | +0.83 | +2.53 | 78% vs 72% |
| `ftfc-aligned` | 413 | +3.16 | 1493 | +1.16 | +2.01 | 71% vs 74% |
| `ftfc-opposed` | 413 | +3.16 | 1493 | +1.16 | +2.01 | 71% vs 74% |
| `base` | 1906 | +1.59 | 0 | +0.00 | +1.59 | 74% vs 0% |
| `rr-poor` | 1314 | +1.85 | 592 | +1.01 | +0.84 | 84% vs 41% |
| `close-location` | 983 | +1.77 | 923 | +1.41 | +0.36 | 76% vs 71% |
| `reversal-backed` | 1090 | +1.68 | 816 | +1.47 | +0.21 | 78% vs 68% |
| `rr-ok` | 545 | +1.08 | 1361 | +1.80 | -0.71 | 41% vs 83% |
| `rr-strong` | 47 | +0.25 | 1859 | +1.63 | -1.38 | 42% vs 75% |
| `volume` | 416 | +0.04 | 1490 | +2.03 | -1.99 | 66% vs 75% |
| `ftfc-full` | 1491 | +1.16 | 415 | +3.15 | -1.99 | 74% vs 71% |
| `in-force` | 878 | -0.01 | 1028 | +2.96 | -2.98 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 527 | 73% | 383 | 77% | -0.06 | -0.05 | -24.12 |
| 2-2 Continuation | 486 | 65% | 318 | 62% | +1.83 | +1.20 | +582.47 |
| 2-1-2 Reversal | 229 | 65% | 149 | 76% | +0.05 | +0.03 | +6.97 |
| 2-1-2 Continuation | 206 | 71% | 146 | 80% | +4.19 | +2.97 | +611.51 |
| Rev Strat (1-2-2) Reversal | 145 | 59% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-2-2 Reversal | 98 | 62% | 61 | 80% | +8.85 | +5.51 | +540.02 |
| 3-1-2 Reversal | 93 | 63% | 59 | 81% | +22.15 | +14.06 | +1307.13 |
| 3-2 Continuation | 76 | 79% | 60 | 68% | +0.07 | +0.05 | +3.97 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1180 | 64% | 753 | 73% | -0.01 | -0.01 | -7.56 |
| W | 524 | 71% | 371 | 78% | +1.53 | +1.08 | +568.45 |
| M | 202 | 83% | 168 | 68% | +14.72 | +12.24 | +2472.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1491 | 65% | 970 | 74% | +1.78 | +1.16 | +1726.73 |
| Mixed | 413 | 78% | 322 | 71% | +4.06 | +3.16 | +1306.29 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 814 | 68% | 554 | 68% | +2.17 | +1.48 | +1202.17 |
| Reversal | 1092 | 68% | 738 | 78% | +2.48 | +1.68 | +1830.86 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1332 | 68% | 908 | 72% | +1.21 | +0.83 | +1103.21 |
| Inside-bar compression (X-1-?) | 574 | 67% | 384 | 78% | +5.03 | +3.36 | +1929.82 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 81 | 17% | 14 | 100% | +216.84 | +37.48 | +3035.77 |
| AMD | 61 | 79% | 48 | 85% | +0.41 | +0.32 | +19.79 |
| LTC-USD | 38 | 82% | 31 | 90% | +0.30 | +0.24 | +9.23 |
| TLT | 56 | 70% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| SOL-USD | 49 | 78% | 38 | 76% | +0.14 | +0.11 | +5.49 |
| XLK | 58 | 66% | 38 | 82% | +0.17 | +0.11 | +6.37 |
| BTC-USD | 40 | 85% | 34 | 76% | +0.11 | +0.09 | +3.73 |
| ETH-USD | 47 | 83% | 39 | 72% | +0.10 | +0.08 | +3.95 |
| XRP-USD | 55 | 64% | 35 | 74% | +0.12 | +0.07 | +4.09 |
| QQQ | 57 | 74% | 42 | 71% | +0.09 | +0.07 | +3.72 |
| META | 63 | 59% | 37 | 76% | +0.10 | +0.06 | +3.80 |
| XLI | 60 | 68% | 41 | 90% | +0.08 | +0.06 | +3.44 |
| DOGE-USD | 51 | 73% | 37 | 65% | +0.07 | +0.05 | +2.54 |
| SMH | 56 | 64% | 36 | 78% | +0.07 | +0.04 | +2.48 |
| XLU | 67 | 69% | 46 | 65% | +0.06 | +0.04 | +2.68 |
| DIA | 60 | 83% | 50 | 84% | +0.04 | +0.03 | +2.02 |
| EURUSD=X | 59 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| AMZN | 57 | 77% | 44 | 82% | +0.00 | +0.00 | +0.09 |
| MSFT | 52 | 79% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 62 | 65% | 40 | 73% | -0.03 | -0.02 | -1.19 |
| GC=F | 62 | 63% | 39 | 79% | -0.04 | -0.03 | -1.66 |
| NVDA | 59 | 61% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 47 | 72% | 34 | 71% | -0.06 | -0.04 | -1.92 |
| XLC | 55 | 76% | 42 | 81% | -0.06 | -0.05 | -2.60 |
| XLV | 58 | 72% | 42 | 67% | -0.10 | -0.07 | -4.22 |
| XLF | 62 | 77% | 48 | 67% | -0.11 | -0.08 | -5.20 |
| TSLA | 49 | 71% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 52 | 73% | 38 | 68% | -0.17 | -0.12 | -6.45 |
| XLY | 54 | 76% | 41 | 73% | -0.19 | -0.14 | -7.77 |
| XLE | 63 | 73% | 46 | 57% | -0.21 | -0.16 | -9.77 |
| GLD | 68 | 68% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 53 | 81% | 43 | 53% | -0.42 | -0.34 | -18.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
