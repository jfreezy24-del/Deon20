# Edge Report — live signal record

_Generated 2026-10-12_ · **1150** settled signals from 2026-08-17 to 2026-10-11 · 35 open, 47 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (792 of 1150) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.81R per trade taken**, +2.62R per signal published.
- Promised **0.74R** to target 1 on average; delivered **+3.81R**.
- Trades ran **4.51R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 537 | 64% | 343 | 80% | +3.75 | +2.39 | +1285.59 |
| 55–64 | 490 | 72% | 351 | 69% | +4.94 | +3.54 | +1732.73 |
| 65–74 (High) | 109 | 80% | 87 | 63% | -0.02 | -0.02 | -1.88 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.025** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 348 | +5.50 | 802 | +1.38 | +4.12 | 76% vs 72% |
| `ftfc-aligned` | 249 | +5.20 | 901 | +1.91 | +3.29 | 68% vs 75% |
| `ftfc-opposed` | 249 | +5.20 | 901 | +1.91 | +3.29 | 68% vs 75% |
| `base` | 1150 | +2.62 | 0 | +0.00 | +2.62 | 73% vs 0% |
| `rr-poor` | 794 | +3.09 | 356 | +1.59 | +1.49 | 85% vs 37% |
| `close-location` | 609 | +2.86 | 541 | +2.36 | +0.50 | 75% vs 70% |
| `reversal-backed` | 663 | +2.75 | 487 | +2.45 | +0.30 | 78% vs 67% |
| `rr-ok` | 328 | +1.73 | 822 | +2.98 | -1.25 | 38% vs 83% |
| `rr-strong` | 28 | -0.03 | 1122 | +2.69 | -2.72 | 32% vs 74% |
| `volume` | 239 | +0.06 | 911 | +3.30 | -3.24 | 63% vs 75% |
| `ftfc-full` | 900 | +1.92 | 250 | +5.18 | -3.26 | 75% vs 68% |
| `in-force` | 553 | -0.02 | 597 | +5.08 | -5.10 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 332 | 74% | 245 | 77% | -0.04 | -0.03 | -11.01 |
| 2-2 Continuation | 288 | 65% | 186 | 59% | +3.06 | +1.98 | +569.70 |
| 2-1-2 Reversal | 139 | 70% | 97 | 75% | -0.02 | -0.02 | -2.18 |
| 2-1-2 Continuation | 120 | 72% | 86 | 78% | +7.14 | +5.12 | +614.05 |
| Rev Strat (1-2-2) Reversal | 87 | 62% | 54 | 81% | +0.02 | +0.01 | +1.02 |
| 3-1-2 Reversal | 56 | 61% | 34 | 79% | +38.18 | +23.18 | +1298.25 |
| 3-2-2 Reversal | 50 | 58% | 29 | 79% | +18.57 | +10.77 | +538.60 |
| 3-2 Continuation | 45 | 76% | 34 | 79% | +0.16 | +0.12 | +5.38 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 716 | 65% | 468 | 72% | -0.02 | -0.01 | -7.88 |
| W | 313 | 72% | 224 | 78% | +2.55 | +1.83 | +571.93 |
| M | 121 | 83% | 100 | 66% | +24.54 | +20.28 | +2453.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 900 | 66% | 597 | 75% | +2.89 | +1.92 | +1723.56 |
| Mixed | 249 | 78% | 195 | 68% | +6.64 | +5.20 | +1294.41 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 486 | 69% | 333 | 67% | +3.58 | +2.46 | +1193.29 |
| Reversal | 664 | 69% | 459 | 78% | +3.98 | +2.75 | +1824.67 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 802 | 68% | 548 | 72% | +2.01 | +1.38 | +1103.69 |
| Inside-bar compression (X-1-?) | 348 | 70% | 244 | 76% | +7.85 | +5.50 | +1914.28 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 49 | 22% | 11 | 100% | +275.81 | +61.92 | +3033.94 |
| LTC-USD | 19 | 84% | 16 | 88% | +0.34 | +0.28 | +5.37 |
| AMD | 36 | 81% | 29 | 83% | +0.29 | +0.24 | +8.49 |
| TLT | 36 | 72% | 26 | 77% | +0.30 | +0.22 | +7.85 |
| DIA | 39 | 79% | 31 | 87% | +0.17 | +0.14 | +5.37 |
| ETH-USD | 25 | 76% | 19 | 84% | +0.16 | +0.12 | +3.04 |
| XLI | 36 | 67% | 24 | 92% | +0.17 | +0.12 | +4.17 |
| META | 44 | 50% | 22 | 77% | +0.15 | +0.07 | +3.27 |
| XLU | 41 | 80% | 33 | 64% | +0.09 | +0.07 | +2.95 |
| AMZN | 35 | 80% | 28 | 82% | +0.06 | +0.05 | +1.69 |
| XLF | 42 | 76% | 32 | 72% | +0.06 | +0.04 | +1.78 |
| BTC-USD | 25 | 92% | 23 | 74% | +0.04 | +0.04 | +0.96 |
| IWM | 39 | 64% | 25 | 72% | +0.04 | +0.03 | +0.99 |
| XLC | 33 | 76% | 25 | 88% | +0.02 | +0.01 | +0.47 |
| EURUSD=X | 40 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLK | 35 | 71% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SOL-USD | 30 | 77% | 23 | 65% | -0.02 | -0.02 | -0.52 |
| GLD | 38 | 66% | 25 | 80% | -0.04 | -0.03 | -0.95 |
| SMH | 37 | 65% | 24 | 71% | -0.05 | -0.03 | -1.23 |
| SPY | 29 | 76% | 22 | 68% | -0.06 | -0.04 | -1.23 |
| MSFT | 29 | 83% | 24 | 75% | -0.08 | -0.07 | -1.96 |
| XLY | 28 | 86% | 24 | 79% | -0.09 | -0.07 | -2.10 |
| DOGE-USD | 32 | 69% | 22 | 45% | -0.15 | -0.11 | -3.36 |
| AAPL | 33 | 76% | 25 | 72% | -0.14 | -0.11 | -3.56 |
| TSLA | 35 | 74% | 26 | 73% | -0.15 | -0.11 | -3.81 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| QQQ | 29 | 79% | 23 | 65% | -0.18 | -0.14 | -4.10 |
| XLV | 29 | 76% | 22 | 64% | -0.20 | -0.15 | -4.43 |
| GC=F | 35 | 66% | 23 | 70% | -0.23 | -0.15 | -5.39 |
| NVDA | 33 | 61% | 20 | 65% | -0.29 | -0.18 | -5.87 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| XLP | 33 | 73% | 24 | 58% | -0.30 | -0.22 | -7.16 |
| GOOGL | 28 | 86% | 24 | 58% | -0.30 | -0.25 | -7.12 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
