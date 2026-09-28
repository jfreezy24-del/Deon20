# Edge Report — live signal record

_Generated 2026-09-28_ · **850** settled signals from 2026-08-17 to 2026-09-28 · 37 open, 24 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (591 of 850) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 3% timed out.
- **Expectancy +5.09R per trade taken**, +3.54R per signal published.
- Promised **0.76R** to target 1 on average; delivered **+5.09R**.
- Trades ran **5.82R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 386 | 65% | 249 | 80% | +5.15 | +3.32 | +1281.82 |
| 55–64 | 358 | 73% | 260 | 70% | +6.66 | +4.83 | +1730.75 |
| 65–74 (High) | 94 | 78% | 73 | 63% | -0.04 | -0.03 | -3.20 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.039** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 261 | +7.31 | 589 | +1.87 | +5.44 | 74% vs 73% |
| `ftfc-aligned` | 180 | +7.18 | 670 | +2.56 | +4.62 | 69% vs 74% |
| `ftfc-opposed` | 180 | +7.18 | 670 | +2.56 | +4.62 | 69% vs 74% |
| `base` | 850 | +3.54 | 0 | +0.00 | +3.54 | 73% vs 0% |
| `rr-poor` | 584 | +4.20 | 266 | +2.10 | +2.10 | 85% vs 37% |
| `reversal-backed` | 488 | +3.75 | 362 | +3.26 | +0.48 | 79% vs 66% |
| `close-location` | 463 | +3.74 | 387 | +3.30 | +0.44 | 75% vs 70% |
| `rr-ok` | 247 | +2.25 | 603 | +4.07 | -1.82 | 36% vs 83% |
| `rr-strong` | 19 | +0.13 | 831 | +3.62 | -3.49 | 43% vs 74% |
| `volume` | 176 | +0.06 | 674 | +4.45 | -4.39 | 68% vs 74% |
| `ftfc-full` | 669 | +2.57 | 181 | +7.14 | -4.57 | 74% vs 69% |
| `in-force` | 409 | -0.03 | 441 | +6.85 | -6.88 | 76% vs 66% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 239 | 73% | 174 | 79% | -0.04 | -0.03 | -7.82 |
| 2-2 Continuation | 216 | 63% | 136 | 58% | +4.13 | +2.60 | +562.19 |
| 2-1-2 Reversal | 100 | 73% | 73 | 74% | -0.05 | -0.03 | -3.31 |
| 2-1-2 Continuation | 92 | 77% | 71 | 73% | +8.61 | +6.65 | +611.59 |
| Rev Strat (1-2-2) Reversal | 66 | 67% | 44 | 84% | +0.07 | +0.05 | +3.04 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 37 | 65% | 24 | 79% | +22.48 | +14.58 | +539.58 |
| 3-2 Continuation | 31 | 71% | 22 | 86% | +0.22 | +0.16 | +4.82 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 528 | 65% | 345 | 73% | -0.03 | -0.02 | -8.82 |
| W | 230 | 75% | 173 | 77% | +3.27 | +2.46 | +565.50 |
| M | 92 | 79% | 73 | 67% | +33.62 | +26.68 | +2454.20 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 669 | 67% | 447 | 74% | +3.84 | +2.57 | +1718.48 |
| Mixed | 180 | 80% | 144 | 69% | +8.98 | +7.18 | +1292.41 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 361 | 69% | 248 | 66% | +4.77 | +3.27 | +1181.80 |
| Reversal | 489 | 70% | 343 | 79% | +5.33 | +3.74 | +1829.08 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 589 | 68% | 400 | 73% | +2.75 | +1.87 | +1101.82 |
| Inside-bar compression (X-1-?) | 261 | 73% | 191 | 74% | +10.00 | +7.31 | +1909.07 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 36 | 22% | 8 | 100% | +378.99 | +84.22 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 27 | 89% | 24 | 83% | +0.32 | +0.28 | +7.61 |
| DIA | 33 | 79% | 26 | 88% | +0.24 | +0.19 | +6.14 |
| XLU | 31 | 84% | 26 | 69% | +0.18 | +0.15 | +4.60 |
| META | 29 | 62% | 18 | 83% | +0.23 | +0.14 | +4.14 |
| ETH-USD | 19 | 84% | 16 | 81% | +0.17 | +0.14 | +2.64 |
| XLI | 27 | 59% | 16 | 88% | +0.21 | +0.12 | +3.32 |
| AMZN | 25 | 76% | 19 | 89% | +0.14 | +0.11 | +2.69 |
| IWM | 28 | 57% | 16 | 75% | +0.15 | +0.08 | +2.35 |
| GLD | 25 | 56% | 14 | 86% | +0.06 | +0.03 | +0.83 |
| EURUSD=X | 26 | 12% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| BTC-USD | 21 | 90% | 19 | 68% | +0.02 | +0.02 | +0.35 |
| XLC | 24 | 79% | 19 | 84% | -0.01 | -0.01 | -0.16 |
| XLY | 18 | 78% | 14 | 86% | -0.02 | -0.01 | -0.23 |
| XRP-USD | 31 | 61% | 19 | 63% | -0.06 | -0.03 | -1.07 |
| NVDA | 25 | 60% | 15 | 80% | -0.12 | -0.07 | -1.75 |
| SMH | 25 | 76% | 19 | 74% | -0.10 | -0.08 | -1.97 |
| XLF | 28 | 71% | 20 | 70% | -0.12 | -0.08 | -2.34 |
| XLV | 21 | 67% | 14 | 64% | -0.14 | -0.09 | -1.99 |
| XLP | 21 | 76% | 16 | 75% | -0.13 | -0.10 | -2.02 |
| MSFT | 23 | 87% | 20 | 75% | -0.11 | -0.10 | -2.23 |
| SPY | 23 | 70% | 16 | 69% | -0.14 | -0.10 | -2.27 |
| XLK | 26 | 81% | 21 | 81% | -0.13 | -0.10 | -2.70 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| TSLA | 26 | 73% | 19 | 68% | -0.20 | -0.14 | -3.72 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| GOOGL | 23 | 87% | 20 | 65% | -0.17 | -0.15 | -3.44 |
| TLT | 23 | 61% | 14 | 64% | -0.26 | -0.16 | -3.68 |
| AAPL | 23 | 74% | 17 | 71% | -0.22 | -0.16 | -3.73 |
| DOGE-USD | 24 | 67% | 16 | 38% | -0.25 | -0.17 | -4.05 |
| QQQ | 20 | 85% | 17 | 71% | -0.25 | -0.21 | -4.22 |
| GC=F | 26 | 65% | 17 | 65% | -0.37 | -0.24 | -6.31 |
| XLE | 31 | 74% | 23 | 57% | -0.34 | -0.25 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
