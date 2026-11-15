# Edge Report — live signal record

_Generated 2026-11-15_ · **1887** settled signals from 2026-08-17 to 2026-11-14 · 38 open, 52 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1291 of 1887) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.35R per trade taken**, +1.61R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.35R**.
- Trades ran **3.06R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 895 | 64% | 574 | 80% | +2.22 | +1.42 | +1275.32 |
| 55–64 | 783 | 71% | 559 | 68% | +3.10 | +2.21 | +1734.06 |
| 65–74 (High) | 187 | 75% | 140 | 68% | +0.11 | +0.08 | +14.97 |
| 75+ (High) | 22 | 82% | 18 | 72% | +0.47 | +0.38 | +8.45 |

Spearman rank correlation between confidence and realised R: **0.017** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 570 | +3.39 | 1317 | +0.84 | +2.55 | 78% vs 72% |
| `ftfc-aligned` | 412 | +3.17 | 1475 | +1.17 | +2.00 | 71% vs 74% |
| `ftfc-opposed` | 412 | +3.17 | 1475 | +1.17 | +2.00 | 71% vs 74% |
| `base` | 1887 | +1.61 | 0 | +0.00 | +1.61 | 74% vs 0% |
| `rr-poor` | 1297 | +1.88 | 590 | +1.02 | +0.86 | 84% vs 41% |
| `close-location` | 975 | +1.78 | 912 | +1.42 | +0.36 | 76% vs 71% |
| `reversal-backed` | 1077 | +1.70 | 810 | +1.48 | +0.22 | 78% vs 68% |
| `rr-ok` | 543 | +1.08 | 1344 | +1.82 | -0.73 | 41% vs 83% |
| `rr-strong` | 47 | +0.25 | 1840 | +1.64 | -1.39 | 42% vs 75% |
| `ftfc-full` | 1473 | +1.17 | 414 | +3.16 | -1.98 | 74% vs 71% |
| `volume` | 406 | +0.04 | 1481 | +2.04 | -2.00 | 66% vs 75% |
| `in-force` | 877 | -0.01 | 1010 | +3.02 | -3.03 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 518 | 74% | 383 | 77% | -0.06 | -0.05 | -24.12 |
| 2-2 Continuation | 484 | 66% | 318 | 62% | +1.83 | +1.20 | +582.47 |
| 2-1-2 Reversal | 229 | 65% | 149 | 76% | +0.05 | +0.03 | +6.97 |
| 2-1-2 Continuation | 202 | 72% | 145 | 80% | +4.22 | +3.03 | +611.28 |
| Rev Strat (1-2-2) Reversal | 144 | 60% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-2-2 Reversal | 95 | 64% | 61 | 80% | +8.85 | +5.68 | +540.02 |
| 3-1-2 Reversal | 93 | 63% | 59 | 81% | +22.15 | +14.06 | +1307.13 |
| 3-2 Continuation | 76 | 79% | 60 | 68% | +0.07 | +0.05 | +3.97 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1168 | 64% | 752 | 73% | -0.01 | -0.01 | -7.78 |
| W | 519 | 71% | 371 | 78% | +1.53 | +1.10 | +568.45 |
| M | 200 | 84% | 168 | 68% | +14.72 | +12.36 | +2472.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1473 | 66% | 969 | 74% | +1.78 | +1.17 | +1726.51 |
| Mixed | 412 | 78% | 322 | 71% | +4.06 | +3.17 | +1306.29 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 808 | 68% | 553 | 68% | +2.17 | +1.49 | +1201.94 |
| Reversal | 1079 | 68% | 738 | 78% | +2.48 | +1.70 | +1830.86 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1317 | 69% | 908 | 72% | +1.21 | +0.84 | +1103.21 |
| Inside-bar compression (X-1-?) | 570 | 67% | 383 | 78% | +5.04 | +3.39 | +1929.59 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 81 | 17% | 14 | 100% | +216.84 | +37.48 | +3035.77 |
| AMD | 61 | 79% | 48 | 85% | +0.41 | +0.32 | +19.79 |
| LTC-USD | 37 | 84% | 31 | 90% | +0.30 | +0.25 | +9.23 |
| TLT | 55 | 71% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| SOL-USD | 49 | 78% | 38 | 76% | +0.14 | +0.11 | +5.49 |
| XLK | 57 | 67% | 38 | 82% | +0.17 | +0.11 | +6.37 |
| BTC-USD | 40 | 85% | 34 | 76% | +0.11 | +0.09 | +3.73 |
| ETH-USD | 46 | 85% | 39 | 72% | +0.10 | +0.09 | +3.95 |
| XRP-USD | 55 | 64% | 35 | 74% | +0.12 | +0.07 | +4.09 |
| QQQ | 56 | 75% | 42 | 71% | +0.09 | +0.07 | +3.72 |
| META | 63 | 59% | 37 | 76% | +0.10 | +0.06 | +3.80 |
| XLI | 60 | 68% | 41 | 90% | +0.08 | +0.06 | +3.44 |
| DOGE-USD | 50 | 74% | 37 | 65% | +0.07 | +0.05 | +2.54 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 65 | 71% | 46 | 65% | +0.06 | +0.04 | +2.68 |
| DIA | 60 | 83% | 50 | 84% | +0.04 | +0.03 | +2.02 |
| EURUSD=X | 59 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| AMZN | 57 | 77% | 44 | 82% | +0.00 | +0.00 | +0.09 |
| MSFT | 51 | 80% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 62 | 65% | 40 | 73% | -0.03 | -0.02 | -1.19 |
| GC=F | 61 | 62% | 38 | 79% | -0.05 | -0.03 | -1.88 |
| NVDA | 58 | 62% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 47 | 72% | 34 | 71% | -0.06 | -0.04 | -1.92 |
| XLC | 55 | 76% | 42 | 81% | -0.06 | -0.05 | -2.60 |
| XLV | 57 | 74% | 42 | 67% | -0.10 | -0.07 | -4.22 |
| XLF | 61 | 79% | 48 | 67% | -0.11 | -0.09 | -5.20 |
| TSLA | 48 | 73% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 51 | 75% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| XLY | 54 | 76% | 41 | 73% | -0.19 | -0.14 | -7.77 |
| XLE | 61 | 75% | 46 | 57% | -0.21 | -0.16 | -9.77 |
| GLD | 67 | 69% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 53 | 81% | 43 | 53% | -0.42 | -0.34 | -18.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
