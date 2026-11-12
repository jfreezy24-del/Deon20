# Edge Report — live signal record

_Generated 2026-11-12_ · **1811** settled signals from 2026-08-17 to 2026-11-12 · 48 open, 53 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1231 of 1811) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.45R per trade taken**, +1.66R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.45R**.
- Trades ran **3.16R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 857 | 63% | 544 | 80% | +2.33 | +1.48 | +1267.66 |
| 55–64 | 752 | 71% | 535 | 67% | +3.22 | +2.29 | +1722.65 |
| 65–74 (High) | 181 | 75% | 135 | 67% | +0.08 | +0.06 | +11.31 |
| 75+ (High) | 21 | 81% | 17 | 76% | +0.56 | +0.45 | +9.52 |

Spearman rank correlation between confidence and realised R: **0.020** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 550 | +3.50 | 1261 | +0.86 | +2.65 | 77% vs 71% |
| `ftfc-aligned` | 403 | +3.24 | 1408 | +1.21 | +2.03 | 71% vs 74% |
| `ftfc-opposed` | 403 | +3.24 | 1408 | +1.21 | +2.03 | 71% vs 74% |
| `base` | 1811 | +1.66 | 0 | +0.00 | +1.66 | 73% vs 0% |
| `rr-poor` | 1245 | +1.95 | 566 | +1.02 | +0.93 | 84% vs 39% |
| `close-location` | 933 | +1.84 | 878 | +1.47 | +0.38 | 75% vs 70% |
| `reversal-backed` | 1046 | +1.75 | 765 | +1.54 | +0.22 | 78% vs 66% |
| `rr-ok` | 520 | +1.09 | 1291 | +1.89 | -0.80 | 38% vs 83% |
| `rr-strong` | 46 | +0.28 | 1765 | +1.70 | -1.42 | 43% vs 74% |
| `ftfc-full` | 1406 | +1.21 | 405 | +3.23 | -2.01 | 74% vs 71% |
| `volume` | 393 | +0.03 | 1418 | +2.11 | -2.08 | 65% vs 75% |
| `in-force` | 839 | -0.02 | 972 | +3.12 | -3.14 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 505 | 74% | 373 | 77% | -0.06 | -0.04 | -21.05 |
| 2-2 Continuation | 454 | 64% | 291 | 59% | +1.92 | +1.23 | +559.93 |
| 2-1-2 Reversal | 225 | 66% | 148 | 76% | +0.05 | +0.04 | +8.04 |
| 2-1-2 Continuation | 190 | 71% | 135 | 79% | +4.51 | +3.20 | +608.86 |
| Rev Strat (1-2-2) Reversal | 136 | 61% | 83 | 84% | +0.03 | +0.02 | +2.82 |
| 3-2-2 Reversal | 93 | 63% | 59 | 80% | +9.14 | +5.80 | +539.16 |
| 3-1-2 Reversal | 89 | 62% | 55 | 80% | +23.75 | +14.68 | +1306.39 |
| 3-2 Continuation | 73 | 78% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1123 | 64% | 719 | 72% | -0.03 | -0.02 | -20.91 |
| W | 495 | 71% | 350 | 77% | +1.60 | +1.13 | +560.19 |
| M | 193 | 84% | 162 | 68% | +15.26 | +12.81 | +2471.86 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1406 | 65% | 917 | 74% | +1.86 | +1.21 | +1704.90 |
| Mixed | 403 | 78% | 314 | 71% | +4.16 | +3.24 | +1306.25 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 763 | 67% | 513 | 66% | +2.29 | +1.54 | +1175.78 |
| Reversal | 1048 | 69% | 718 | 78% | +2.56 | +1.75 | +1835.36 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1261 | 68% | 863 | 71% | +1.26 | +0.86 | +1083.63 |
| Inside-bar compression (X-1-?) | 550 | 67% | 368 | 77% | +5.24 | +3.50 | +1927.51 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 78 | 17% | 13 | 100% | +233.48 | +38.91 | +3035.27 |
| AMD | 59 | 78% | 46 | 85% | +0.42 | +0.33 | +19.37 |
| LTC-USD | 33 | 82% | 27 | 89% | +0.25 | +0.21 | +6.80 |
| TLT | 53 | 72% | 38 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 57 | 67% | 38 | 82% | +0.17 | +0.11 | +6.37 |
| QQQ | 55 | 76% | 42 | 71% | +0.09 | +0.07 | +3.72 |
| XLI | 58 | 69% | 40 | 90% | +0.09 | +0.06 | +3.42 |
| META | 59 | 58% | 34 | 74% | +0.10 | +0.06 | +3.42 |
| BTC-USD | 38 | 84% | 32 | 75% | +0.07 | +0.06 | +2.15 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 61 | 72% | 44 | 64% | +0.05 | +0.04 | +2.25 |
| DIA | 57 | 84% | 48 | 83% | +0.04 | +0.03 | +1.88 |
| EURUSD=X | 58 | 9% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| XRP-USD | 50 | 60% | 30 | 70% | +0.02 | +0.01 | +0.68 |
| NVDA | 57 | 61% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| AMZN | 55 | 78% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 50 | 82% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 60 | 63% | 38 | 71% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 40 | 73% | 29 | 69% | -0.03 | -0.02 | -1.00 |
| XLC | 53 | 75% | 40 | 83% | -0.04 | -0.03 | -1.67 |
| GC=F | 58 | 62% | 36 | 78% | -0.05 | -0.03 | -1.92 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 47 | 72% | 34 | 71% | -0.06 | -0.04 | -1.92 |
| DOGE-USD | 47 | 72% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| ETH-USD | 40 | 83% | 33 | 67% | -0.09 | -0.07 | -2.97 |
| XLF | 61 | 79% | 48 | 67% | -0.11 | -0.09 | -5.20 |
| XLV | 55 | 73% | 40 | 65% | -0.12 | -0.09 | -4.97 |
| TSLA | 48 | 73% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLY | 51 | 76% | 39 | 77% | -0.15 | -0.11 | -5.77 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| AAPL | 50 | 76% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| XLE | 60 | 75% | 45 | 56% | -0.23 | -0.17 | -10.44 |
| GLD | 61 | 67% | 41 | 71% | -0.27 | -0.18 | -10.93 |
| GOOGL | 52 | 81% | 42 | 55% | -0.41 | -0.33 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
