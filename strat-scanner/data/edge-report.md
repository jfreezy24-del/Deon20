# Edge Report — live signal record

_Generated 2026-11-14_ · **1868** settled signals from 2026-08-17 to 2026-11-14 · 47 open, 47 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1278 of 1868) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.36R per trade taken**, +1.61R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.36R**.
- Trades ran **3.07R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 887 | 64% | 568 | 80% | +2.23 | +1.43 | +1268.74 |
| 55–64 | 775 | 71% | 554 | 68% | +3.12 | +2.23 | +1726.35 |
| 65–74 (High) | 184 | 75% | 138 | 67% | +0.09 | +0.07 | +11.97 |
| 75+ (High) | 22 | 82% | 18 | 72% | +0.47 | +0.38 | +8.45 |

Spearman rank correlation between confidence and realised R: **0.018** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 567 | +3.40 | 1301 | +0.83 | +2.57 | 78% vs 71% |
| `ftfc-aligned` | 410 | +3.18 | 1458 | +1.17 | +2.01 | 71% vs 74% |
| `ftfc-opposed` | 410 | +3.18 | 1458 | +1.17 | +2.01 | 71% vs 74% |
| `base` | 1868 | +1.61 | 0 | +0.00 | +1.61 | 73% vs 0% |
| `rr-poor` | 1293 | +1.88 | 575 | +1.02 | +0.86 | 84% vs 39% |
| `close-location` | 967 | +1.79 | 901 | +1.43 | +0.36 | 75% vs 70% |
| `reversal-backed` | 1074 | +1.70 | 794 | +1.49 | +0.21 | 78% vs 67% |
| `rr-ok` | 528 | +1.08 | 1340 | +1.82 | -0.74 | 39% vs 83% |
| `rr-strong` | 47 | +0.25 | 1821 | +1.65 | -1.40 | 42% vs 74% |
| `ftfc-full` | 1456 | +1.18 | 412 | +3.17 | -1.99 | 74% vs 71% |
| `volume` | 401 | +0.03 | 1467 | +2.05 | -2.02 | 66% vs 75% |
| `in-force` | 869 | -0.03 | 999 | +3.04 | -3.07 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 517 | 74% | 383 | 77% | -0.06 | -0.05 | -24.12 |
| 2-2 Continuation | 470 | 65% | 306 | 60% | +1.85 | +1.20 | +565.70 |
| 2-1-2 Reversal | 227 | 66% | 149 | 76% | +0.05 | +0.03 | +6.97 |
| 2-1-2 Continuation | 201 | 72% | 145 | 80% | +4.22 | +3.04 | +611.28 |
| Rev Strat (1-2-2) Reversal | 144 | 60% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-2-2 Reversal | 95 | 64% | 61 | 80% | +8.85 | +5.68 | +540.02 |
| 3-1-2 Reversal | 93 | 63% | 59 | 81% | +22.15 | +14.06 | +1307.13 |
| 3-2 Continuation | 75 | 79% | 59 | 68% | +0.06 | +0.05 | +3.45 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1154 | 64% | 744 | 72% | -0.03 | -0.02 | -20.19 |
| W | 514 | 71% | 366 | 77% | +1.54 | +1.10 | +563.57 |
| M | 200 | 84% | 168 | 68% | +14.72 | +12.36 | +2472.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1456 | 66% | 957 | 74% | +1.79 | +1.18 | +1710.89 |
| Mixed | 410 | 78% | 321 | 71% | +4.06 | +3.18 | +1304.62 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 792 | 68% | 540 | 67% | +2.19 | +1.50 | +1184.65 |
| Reversal | 1076 | 69% | 738 | 78% | +2.48 | +1.70 | +1830.86 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1301 | 69% | 895 | 71% | +1.21 | +0.83 | +1085.91 |
| Inside-bar compression (X-1-?) | 567 | 68% | 383 | 78% | +5.04 | +3.40 | +1929.59 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 80 | 18% | 14 | 100% | +216.84 | +37.95 | +3035.77 |
| AMD | 61 | 79% | 48 | 85% | +0.41 | +0.32 | +19.79 |
| LTC-USD | 36 | 83% | 30 | 90% | +0.26 | +0.21 | +7.73 |
| TLT | 55 | 71% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| XLK | 57 | 67% | 38 | 82% | +0.17 | +0.11 | +6.37 |
| SOL-USD | 48 | 77% | 37 | 76% | +0.11 | +0.08 | +3.99 |
| QQQ | 56 | 75% | 42 | 71% | +0.09 | +0.07 | +3.72 |
| BTC-USD | 39 | 85% | 33 | 76% | +0.07 | +0.06 | +2.43 |
| META | 63 | 59% | 37 | 76% | +0.10 | +0.06 | +3.80 |
| XLI | 60 | 68% | 41 | 90% | +0.08 | +0.06 | +3.44 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 64 | 72% | 46 | 65% | +0.06 | +0.04 | +2.68 |
| DIA | 60 | 83% | 50 | 84% | +0.04 | +0.03 | +2.02 |
| EURUSD=X | 59 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| XRP-USD | 52 | 62% | 32 | 72% | +0.02 | +0.01 | +0.68 |
| AMZN | 57 | 77% | 44 | 82% | +0.00 | +0.00 | +0.09 |
| MSFT | 50 | 82% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 62 | 65% | 40 | 73% | -0.03 | -0.02 | -1.19 |
| ETH-USD | 42 | 83% | 35 | 69% | -0.03 | -0.03 | -1.13 |
| GC=F | 60 | 63% | 38 | 79% | -0.05 | -0.03 | -1.88 |
| NVDA | 58 | 62% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 47 | 72% | 34 | 71% | -0.06 | -0.04 | -1.92 |
| DOGE-USD | 47 | 72% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| XLC | 55 | 76% | 42 | 81% | -0.06 | -0.05 | -2.60 |
| XLV | 57 | 74% | 42 | 67% | -0.10 | -0.07 | -4.22 |
| XLF | 61 | 79% | 48 | 67% | -0.11 | -0.09 | -5.20 |
| TSLA | 48 | 73% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 50 | 76% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| XLY | 54 | 76% | 41 | 73% | -0.19 | -0.14 | -7.77 |
| XLE | 61 | 75% | 46 | 57% | -0.21 | -0.16 | -9.77 |
| GLD | 66 | 70% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 53 | 81% | 43 | 53% | -0.42 | -0.34 | -18.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
