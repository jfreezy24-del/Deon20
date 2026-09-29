# Edge Report — live signal record

_Generated 2026-09-29_ · **878** settled signals from 2026-08-17 to 2026-09-29 · 33 open, 28 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (617 of 878) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.88R per trade taken**, +3.43R per signal published.
- Promised **0.76R** to target 1 on average; delivered **+4.88R**.
- Trades ran **5.59R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 403 | 66% | 265 | 79% | +4.83 | +3.17 | +1278.76 |
| 55–64 | 367 | 73% | 268 | 69% | +6.46 | +4.72 | +1732.46 |
| 65–74 (High) | 96 | 78% | 75 | 63% | -0.04 | -0.03 | -2.70 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.045** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 266 | +7.18 | 612 | +1.80 | +5.38 | 74% vs 73% |
| `ftfc-aligned` | 182 | +7.10 | 696 | +2.47 | +4.63 | 69% vs 74% |
| `ftfc-opposed` | 182 | +7.10 | 696 | +2.47 | +4.63 | 69% vs 74% |
| `base` | 878 | +3.43 | 0 | +0.00 | +3.43 | 73% vs 0% |
| `rr-poor` | 602 | +4.07 | 276 | +2.04 | +2.03 | 84% vs 37% |
| `close-location` | 472 | +3.67 | 406 | +3.14 | +0.53 | 75% vs 71% |
| `reversal-backed` | 505 | +3.62 | 373 | +3.17 | +0.44 | 79% vs 65% |
| `rr-ok` | 257 | +2.18 | 621 | +3.95 | -1.77 | 36% vs 83% |
| `rr-strong` | 19 | +0.13 | 859 | +3.50 | -3.38 | 43% vs 74% |
| `volume` | 181 | +0.07 | 697 | +4.30 | -4.23 | 65% vs 75% |
| `ftfc-full` | 695 | +2.47 | 183 | +7.06 | -4.58 | 74% vs 69% |
| `in-force` | 428 | -0.03 | 450 | +6.72 | -6.75 | 76% vs 66% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 254 | 74% | 188 | 79% | -0.06 | -0.04 | -10.45 |
| 2-2 Continuation | 223 | 64% | 143 | 57% | +3.95 | +2.53 | +564.18 |
| 2-1-2 Reversal | 102 | 74% | 75 | 73% | -0.05 | -0.04 | -3.66 |
| 2-1-2 Continuation | 94 | 78% | 73 | 74% | +8.38 | +6.51 | +611.64 |
| Rev Strat (1-2-2) Reversal | 66 | 67% | 44 | 84% | +0.07 | +0.05 | +3.04 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 37 | 65% | 24 | 79% | +22.48 | +14.58 | +539.58 |
| 3-2 Continuation | 32 | 72% | 23 | 87% | +0.21 | +0.15 | +4.90 |
| 1-1-2 Continuation | 23 | 83% | 19 | 68% | +0.17 | +0.14 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 549 | 66% | 365 | 72% | -0.03 | -0.02 | -11.04 |
| W | 235 | 75% | 177 | 77% | +3.20 | +2.41 | +567.21 |
| M | 94 | 80% | 75 | 67% | +32.72 | +26.10 | +2453.85 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 695 | 68% | 472 | 74% | +3.64 | +2.47 | +1718.62 |
| Mixed | 182 | 80% | 145 | 69% | +8.91 | +7.10 | +1291.41 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 372 | 69% | 258 | 65% | +4.59 | +3.18 | +1183.92 |
| Reversal | 506 | 71% | 359 | 79% | +5.09 | +3.61 | +1826.10 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 612 | 69% | 422 | 73% | +2.61 | +1.80 | +1101.26 |
| Inside-bar compression (X-1-?) | 266 | 73% | 195 | 74% | +9.79 | +7.18 | +1908.76 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 37 | 22% | 8 | 100% | +378.99 | +81.94 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 28 | 89% | 25 | 80% | +0.32 | +0.29 | +8.01 |
| DIA | 33 | 79% | 26 | 88% | +0.24 | +0.19 | +6.14 |
| XLU | 31 | 84% | 26 | 69% | +0.18 | +0.15 | +4.60 |
| ETH-USD | 19 | 84% | 16 | 81% | +0.17 | +0.14 | +2.64 |
| XLI | 29 | 62% | 18 | 89% | +0.20 | +0.12 | +3.54 |
| META | 30 | 63% | 19 | 79% | +0.17 | +0.10 | +3.14 |
| IWM | 29 | 59% | 17 | 76% | +0.16 | +0.09 | +2.75 |
| AMZN | 27 | 78% | 21 | 86% | +0.09 | +0.07 | +1.93 |
| EURUSD=X | 27 | 11% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| BTC-USD | 21 | 90% | 19 | 68% | +0.02 | +0.02 | +0.35 |
| XLC | 25 | 80% | 20 | 85% | -0.01 | -0.00 | -0.10 |
| XLY | 19 | 79% | 15 | 87% | -0.02 | -0.01 | -0.23 |
| SMH | 27 | 78% | 21 | 71% | -0.02 | -0.02 | -0.45 |
| TLT | 25 | 64% | 16 | 69% | -0.04 | -0.02 | -0.57 |
| XRP-USD | 31 | 61% | 19 | 63% | -0.06 | -0.03 | -1.07 |
| GLD | 28 | 61% | 17 | 82% | -0.15 | -0.09 | -2.47 |
| XLK | 27 | 81% | 22 | 82% | -0.11 | -0.09 | -2.40 |
| SPY | 24 | 71% | 17 | 71% | -0.13 | -0.09 | -2.23 |
| XLV | 21 | 67% | 14 | 64% | -0.14 | -0.09 | -1.99 |
| XLP | 21 | 76% | 16 | 75% | -0.13 | -0.10 | -2.02 |
| MSFT | 23 | 87% | 20 | 75% | -0.11 | -0.10 | -2.23 |
| NVDA | 26 | 62% | 16 | 75% | -0.17 | -0.11 | -2.75 |
| XLF | 30 | 73% | 22 | 68% | -0.15 | -0.11 | -3.25 |
| TSLA | 27 | 74% | 20 | 70% | -0.18 | -0.13 | -3.64 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| GOOGL | 23 | 87% | 20 | 65% | -0.17 | -0.15 | -3.44 |
| DOGE-USD | 24 | 67% | 16 | 38% | -0.25 | -0.17 | -4.05 |
| QQQ | 22 | 86% | 19 | 68% | -0.21 | -0.18 | -3.91 |
| AAPL | 24 | 75% | 18 | 67% | -0.26 | -0.20 | -4.73 |
| GC=F | 27 | 67% | 18 | 67% | -0.31 | -0.21 | -5.66 |
| XLE | 31 | 74% | 23 | 57% | -0.34 | -0.25 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
