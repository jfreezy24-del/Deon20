# Edge Report — live signal record

_Generated 2026-11-11_ · **1787** settled signals from 2026-08-17 to 2026-11-11 · 39 open, 55 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1212 of 1787) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.48R per trade taken**, +1.68R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.48R**.
- Trades ran **3.20R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 845 | 63% | 534 | 80% | +2.37 | +1.50 | +1267.58 |
| 55–64 | 745 | 71% | 531 | 67% | +3.24 | +2.31 | +1722.44 |
| 65–74 (High) | 178 | 74% | 132 | 67% | +0.08 | +0.06 | +11.18 |
| 75+ (High) | 19 | 79% | 15 | 73% | +0.41 | +0.32 | +6.10 |

Spearman rank correlation between confidence and realised R: **0.019** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 537 | +3.58 | 1250 | +0.87 | +2.72 | 77% vs 71% |
| `ftfc-aligned` | 396 | +3.30 | 1391 | +1.22 | +2.08 | 71% vs 73% |
| `ftfc-opposed` | 396 | +3.30 | 1391 | +1.22 | +2.08 | 71% vs 73% |
| `base` | 1787 | +1.68 | 0 | +0.00 | +1.68 | 73% vs 0% |
| `rr-poor` | 1230 | +1.98 | 557 | +1.03 | +0.94 | 84% vs 39% |
| `close-location` | 918 | +1.87 | 869 | +1.48 | +0.39 | 74% vs 71% |
| `reversal-backed` | 1036 | +1.77 | 751 | +1.56 | +0.21 | 78% vs 65% |
| `rr-ok` | 511 | +1.10 | 1276 | +1.92 | -0.81 | 38% vs 82% |
| `rr-strong` | 46 | +0.28 | 1741 | +1.72 | -1.44 | 43% vs 74% |
| `ftfc-full` | 1389 | +1.22 | 398 | +3.28 | -2.06 | 73% vs 71% |
| `volume` | 387 | +0.02 | 1400 | +2.14 | -2.12 | 65% vs 74% |
| `in-force` | 827 | -0.03 | 960 | +3.16 | -3.19 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 503 | 74% | 371 | 77% | -0.05 | -0.04 | -20.07 |
| 2-2 Continuation | 447 | 64% | 286 | 59% | +1.95 | +1.25 | +558.74 |
| 2-1-2 Reversal | 222 | 66% | 146 | 76% | +0.03 | +0.02 | +4.61 |
| 2-1-2 Continuation | 184 | 70% | 129 | 78% | +4.72 | +3.31 | +608.73 |
| Rev Strat (1-2-2) Reversal | 135 | 61% | 83 | 84% | +0.03 | +0.02 | +2.82 |
| 3-2-2 Reversal | 93 | 63% | 59 | 80% | +9.14 | +5.80 | +539.16 |
| 3-1-2 Reversal | 85 | 60% | 51 | 78% | +25.61 | +15.37 | +1306.31 |
| 3-2 Continuation | 72 | 79% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1110 | 64% | 709 | 72% | -0.03 | -0.02 | -23.48 |
| W | 485 | 71% | 342 | 77% | +1.63 | +1.15 | +559.17 |
| M | 192 | 84% | 161 | 68% | +15.35 | +12.87 | +2471.59 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1389 | 65% | 903 | 73% | +1.88 | +1.22 | +1701.12 |
| Mixed | 396 | 78% | 309 | 71% | +4.23 | +3.30 | +1306.16 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 749 | 67% | 502 | 65% | +2.34 | +1.57 | +1174.47 |
| Reversal | 1038 | 68% | 710 | 78% | +2.58 | +1.77 | +1832.82 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1250 | 68% | 856 | 71% | +1.27 | +0.87 | +1083.42 |
| Inside-bar compression (X-1-?) | 537 | 66% | 356 | 77% | +5.40 | +3.58 | +1923.87 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 77 | 17% | 13 | 100% | +233.48 | +39.42 | +3035.27 |
| AMD | 59 | 78% | 46 | 85% | +0.42 | +0.33 | +19.37 |
| LTC-USD | 33 | 82% | 27 | 89% | +0.25 | +0.21 | +6.80 |
| TLT | 53 | 72% | 38 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 56 | 66% | 37 | 81% | +0.14 | +0.09 | +5.10 |
| META | 58 | 57% | 33 | 76% | +0.13 | +0.08 | +4.42 |
| XLI | 56 | 68% | 38 | 89% | +0.09 | +0.06 | +3.42 |
| BTC-USD | 38 | 84% | 32 | 75% | +0.07 | +0.06 | +2.15 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 61 | 72% | 44 | 64% | +0.05 | +0.04 | +2.25 |
| DIA | 56 | 84% | 47 | 83% | +0.04 | +0.03 | +1.88 |
| QQQ | 54 | 76% | 41 | 71% | +0.04 | +0.03 | +1.56 |
| XRP-USD | 49 | 61% | 30 | 70% | +0.02 | +0.01 | +0.68 |
| NVDA | 57 | 61% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| EURUSD=X | 56 | 5% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| AMZN | 55 | 78% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 48 | 83% | 40 | 78% | -0.02 | -0.01 | -0.66 |
| IWM | 59 | 63% | 37 | 70% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 40 | 73% | 29 | 69% | -0.03 | -0.02 | -1.00 |
| GC=F | 57 | 61% | 35 | 77% | -0.05 | -0.03 | -1.92 |
| XLC | 52 | 75% | 39 | 82% | -0.05 | -0.03 | -1.79 |
| HYPE-USD | 37 | 81% | 30 | 60% | -0.04 | -0.04 | -1.31 |
| DOGE-USD | 47 | 72% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| SPY | 45 | 71% | 32 | 69% | -0.06 | -0.04 | -1.92 |
| ETH-USD | 40 | 83% | 33 | 67% | -0.09 | -0.07 | -2.97 |
| XLF | 60 | 78% | 47 | 66% | -0.11 | -0.09 | -5.32 |
| XLV | 55 | 73% | 40 | 65% | -0.12 | -0.09 | -4.97 |
| TSLA | 46 | 72% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| XLY | 51 | 76% | 39 | 77% | -0.15 | -0.11 | -5.77 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 50 | 76% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| GLD | 61 | 67% | 41 | 71% | -0.27 | -0.18 | -10.93 |
| XLE | 58 | 74% | 43 | 56% | -0.25 | -0.18 | -10.61 |
| GOOGL | 51 | 82% | 42 | 55% | -0.41 | -0.34 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
