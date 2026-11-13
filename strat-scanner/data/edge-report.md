# Edge Report — live signal record

_Generated 2026-11-13_ · **1847** settled signals from 2026-08-17 to 2026-11-13 · 43 open, 51 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1264 of 1847) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.38R per trade taken**, +1.63R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.38R**.
- Trades ran **3.10R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 873 | 64% | 559 | 80% | +2.27 | +1.45 | +1268.21 |
| 55–64 | 770 | 72% | 551 | 68% | +3.13 | +2.24 | +1725.54 |
| 65–74 (High) | 182 | 75% | 136 | 67% | +0.09 | +0.06 | +11.81 |
| 75+ (High) | 22 | 82% | 18 | 72% | +0.47 | +0.38 | +8.45 |

Spearman rank correlation between confidence and realised R: **0.020** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 563 | +3.43 | 1284 | +0.84 | +2.58 | 78% vs 71% |
| `ftfc-aligned` | 406 | +3.21 | 1441 | +1.19 | +2.03 | 71% vs 74% |
| `ftfc-opposed` | 406 | +3.21 | 1441 | +1.19 | +2.03 | 71% vs 74% |
| `base` | 1847 | +1.63 | 0 | +0.00 | +1.63 | 73% vs 0% |
| `rr-poor` | 1275 | +1.91 | 572 | +1.02 | +0.89 | 84% vs 39% |
| `close-location` | 956 | +1.80 | 891 | +1.45 | +0.36 | 75% vs 71% |
| `reversal-backed` | 1060 | +1.73 | 787 | +1.50 | +0.22 | 78% vs 67% |
| `rr-ok` | 525 | +1.09 | 1322 | +1.85 | -0.76 | 39% vs 83% |
| `rr-strong` | 47 | +0.25 | 1800 | +1.67 | -1.42 | 42% vs 74% |
| `ftfc-full` | 1439 | +1.19 | 408 | +3.20 | -2.01 | 74% vs 71% |
| `volume` | 399 | +0.02 | 1448 | +2.07 | -2.05 | 66% vs 75% |
| `in-force` | 858 | -0.03 | 989 | +3.07 | -3.10 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 510 | 74% | 378 | 77% | -0.06 | -0.05 | -23.70 |
| 2-2 Continuation | 465 | 65% | 301 | 60% | +1.87 | +1.21 | +563.32 |
| 2-1-2 Reversal | 227 | 66% | 149 | 76% | +0.05 | +0.03 | +6.97 |
| 2-1-2 Continuation | 199 | 72% | 144 | 81% | +4.25 | +3.08 | +612.28 |
| Rev Strat (1-2-2) Reversal | 140 | 61% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-2-2 Reversal | 94 | 64% | 60 | 80% | +8.99 | +5.74 | +539.64 |
| 3-1-2 Reversal | 91 | 63% | 57 | 81% | +22.93 | +14.36 | +1306.97 |
| 3-2 Continuation | 75 | 79% | 59 | 68% | +0.06 | +0.05 | +3.45 |
| 1-1-2 Continuation | 46 | 65% | 30 | 70% | +0.14 | +0.09 | +4.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1143 | 64% | 737 | 72% | -0.03 | -0.02 | -20.19 |
| W | 507 | 71% | 361 | 77% | +1.56 | +1.11 | +562.07 |
| M | 197 | 84% | 166 | 68% | +14.89 | +12.55 | +2472.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1439 | 66% | 947 | 74% | +1.81 | +1.19 | +1709.95 |
| Mixed | 406 | 78% | 317 | 71% | +4.11 | +3.21 | +1304.07 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 785 | 68% | 534 | 67% | +2.22 | +1.51 | +1183.27 |
| Reversal | 1062 | 69% | 730 | 78% | +2.51 | +1.72 | +1830.75 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1284 | 69% | 884 | 71% | +1.23 | +0.84 | +1083.57 |
| Inside-bar compression (X-1-?) | 563 | 67% | 380 | 78% | +5.08 | +3.43 | +1930.44 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 79 | 18% | 14 | 100% | +216.84 | +38.43 | +3035.77 |
| AMD | 60 | 78% | 47 | 85% | +0.41 | +0.32 | +19.37 |
| LTC-USD | 36 | 83% | 30 | 90% | +0.26 | +0.21 | +7.73 |
| TLT | 55 | 71% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| XLK | 57 | 67% | 38 | 82% | +0.17 | +0.11 | +6.37 |
| QQQ | 56 | 75% | 42 | 71% | +0.09 | +0.07 | +3.72 |
| BTC-USD | 39 | 85% | 33 | 76% | +0.07 | +0.06 | +2.43 |
| XLI | 58 | 69% | 40 | 90% | +0.09 | +0.06 | +3.42 |
| META | 61 | 59% | 36 | 75% | +0.09 | +0.06 | +3.42 |
| SMH | 55 | 65% | 36 | 78% | +0.07 | +0.05 | +2.48 |
| XLU | 63 | 73% | 46 | 65% | +0.06 | +0.04 | +2.68 |
| SOL-USD | 44 | 75% | 33 | 73% | +0.05 | +0.04 | +1.60 |
| DIA | 58 | 84% | 49 | 84% | +0.04 | +0.03 | +1.96 |
| EURUSD=X | 58 | 9% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| XRP-USD | 51 | 61% | 31 | 71% | +0.02 | +0.01 | +0.68 |
| AMZN | 55 | 78% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 50 | 82% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 61 | 64% | 39 | 72% | -0.03 | -0.02 | -1.30 |
| ETH-USD | 42 | 83% | 35 | 69% | -0.03 | -0.03 | -1.13 |
| GC=F | 60 | 63% | 38 | 79% | -0.05 | -0.03 | -1.88 |
| XLC | 53 | 75% | 40 | 83% | -0.04 | -0.03 | -1.67 |
| NVDA | 58 | 62% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 47 | 72% | 34 | 71% | -0.06 | -0.04 | -1.92 |
| DOGE-USD | 47 | 72% | 34 | 62% | -0.06 | -0.04 | -1.95 |
| XLV | 57 | 74% | 42 | 67% | -0.10 | -0.07 | -4.22 |
| XLF | 61 | 79% | 48 | 67% | -0.11 | -0.09 | -5.20 |
| TSLA | 48 | 73% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLP | 57 | 65% | 37 | 65% | -0.19 | -0.12 | -6.94 |
| XLY | 53 | 75% | 40 | 75% | -0.17 | -0.13 | -6.77 |
| AAPL | 50 | 76% | 38 | 68% | -0.17 | -0.13 | -6.45 |
| XLE | 61 | 75% | 46 | 57% | -0.21 | -0.16 | -9.77 |
| GLD | 66 | 70% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 53 | 81% | 43 | 53% | -0.42 | -0.34 | -18.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
