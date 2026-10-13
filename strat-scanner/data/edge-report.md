# Edge Report — live signal record

_Generated 2026-10-13_ · **1171** settled signals from 2026-08-17 to 2026-10-13 · 34 open, 41 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (812 of 1171) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.72R per trade taken**, +2.58R per signal published.
- Promised **0.73R** to target 1 on average; delivered **+3.72R**.
- Trades ran **4.41R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 550 | 65% | 355 | 80% | +3.62 | +2.34 | +1286.86 |
| 55–64 | 496 | 72% | 357 | 68% | +4.85 | +3.49 | +1730.11 |
| 65–74 (High) | 111 | 80% | 89 | 64% | -0.01 | -0.00 | -0.51 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.026** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 350 | +5.47 | 821 | +1.34 | +4.13 | 76% vs 72% |
| `ftfc-aligned` | 253 | +5.12 | 918 | +1.88 | +3.25 | 68% vs 75% |
| `ftfc-opposed` | 253 | +5.12 | 918 | +1.88 | +3.25 | 68% vs 75% |
| `base` | 1171 | +2.58 | 0 | +0.00 | +2.58 | 73% vs 0% |
| `rr-poor` | 810 | +3.03 | 361 | +1.57 | +1.46 | 85% vs 37% |
| `close-location` | 623 | +2.80 | 548 | +2.33 | +0.47 | 75% vs 70% |
| `reversal-backed` | 676 | +2.70 | 495 | +2.41 | +0.30 | 78% vs 66% |
| `rr-ok` | 333 | +1.70 | 838 | +2.93 | -1.23 | 38% vs 83% |
| `rr-strong` | 28 | -0.03 | 1143 | +2.64 | -2.67 | 32% vs 74% |
| `volume` | 240 | +0.06 | 931 | +3.23 | -3.16 | 64% vs 75% |
| `ftfc-full` | 917 | +1.88 | 254 | +5.10 | -3.22 | 75% vs 68% |
| `in-force` | 565 | -0.02 | 606 | +5.00 | -5.02 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 339 | 74% | 252 | 78% | -0.04 | -0.03 | -10.31 |
| 2-2 Continuation | 295 | 65% | 193 | 58% | +2.94 | +1.92 | +567.10 |
| 2-1-2 Reversal | 140 | 70% | 98 | 76% | -0.02 | -0.01 | -2.06 |
| 2-1-2 Continuation | 120 | 72% | 86 | 78% | +7.14 | +5.12 | +614.05 |
| Rev Strat (1-2-2) Reversal | 89 | 62% | 55 | 82% | +0.02 | +0.01 | +1.10 |
| 3-1-2 Reversal | 57 | 61% | 35 | 80% | +37.10 | +22.78 | +1298.49 |
| 3-2-2 Reversal | 52 | 60% | 31 | 81% | +17.41 | +10.38 | +539.85 |
| 3-2 Continuation | 46 | 76% | 35 | 80% | +0.16 | +0.12 | +5.59 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 724 | 66% | 475 | 72% | -0.02 | -0.01 | -7.19 |
| W | 325 | 73% | 236 | 78% | +2.42 | +1.76 | +572.26 |
| M | 122 | 83% | 101 | 65% | +24.29 | +20.11 | +2452.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 917 | 67% | 613 | 75% | +2.81 | +1.88 | +1721.96 |
| Mixed | 253 | 79% | 199 | 68% | +6.51 | +5.12 | +1296.02 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 494 | 69% | 341 | 66% | +3.49 | +2.41 | +1190.90 |
| Reversal | 677 | 70% | 471 | 78% | +3.88 | +2.70 | +1827.07 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 821 | 69% | 566 | 72% | +1.95 | +1.34 | +1103.33 |
| Inside-bar compression (X-1-?) | 350 | 70% | 246 | 76% | +7.78 | +5.47 | +1914.64 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 49 | 22% | 11 | 100% | +275.81 | +61.92 | +3033.94 |
| LTC-USD | 19 | 84% | 16 | 88% | +0.34 | +0.28 | +5.37 |
| TLT | 36 | 72% | 26 | 77% | +0.30 | +0.22 | +7.85 |
| AMD | 38 | 82% | 31 | 81% | +0.24 | +0.20 | +7.56 |
| DIA | 40 | 80% | 32 | 88% | +0.17 | +0.14 | +5.49 |
| ETH-USD | 25 | 76% | 19 | 84% | +0.16 | +0.12 | +3.04 |
| XLI | 36 | 67% | 24 | 92% | +0.17 | +0.12 | +4.17 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| XLU | 41 | 80% | 33 | 64% | +0.09 | +0.07 | +2.95 |
| AMZN | 35 | 80% | 28 | 82% | +0.06 | +0.05 | +1.69 |
| XLF | 43 | 77% | 33 | 73% | +0.06 | +0.04 | +1.86 |
| BTC-USD | 25 | 92% | 23 | 74% | +0.04 | +0.04 | +0.96 |
| IWM | 39 | 64% | 25 | 72% | +0.04 | +0.03 | +0.99 |
| XLC | 34 | 76% | 26 | 88% | +0.02 | +0.02 | +0.52 |
| EURUSD=X | 40 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLK | 35 | 71% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SOL-USD | 30 | 77% | 23 | 65% | -0.02 | -0.02 | -0.52 |
| GLD | 38 | 66% | 25 | 80% | -0.04 | -0.03 | -0.95 |
| SMH | 38 | 66% | 25 | 72% | -0.04 | -0.03 | -1.07 |
| SPY | 30 | 77% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| HYPE-USD | 24 | 79% | 19 | 53% | -0.07 | -0.06 | -1.41 |
| MSFT | 29 | 83% | 24 | 75% | -0.08 | -0.07 | -1.96 |
| XLY | 29 | 86% | 25 | 80% | -0.08 | -0.07 | -1.99 |
| TSLA | 36 | 75% | 27 | 74% | -0.14 | -0.10 | -3.68 |
| DOGE-USD | 32 | 69% | 22 | 45% | -0.15 | -0.11 | -3.36 |
| AAPL | 33 | 76% | 25 | 72% | -0.14 | -0.11 | -3.56 |
| XLV | 32 | 78% | 25 | 68% | -0.17 | -0.13 | -4.17 |
| QQQ | 29 | 79% | 23 | 65% | -0.18 | -0.14 | -4.10 |
| GC=F | 36 | 64% | 23 | 70% | -0.23 | -0.15 | -5.39 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| NVDA | 38 | 66% | 25 | 64% | -0.30 | -0.20 | -7.41 |
| XLP | 34 | 74% | 25 | 60% | -0.28 | -0.20 | -6.95 |
| GOOGL | 28 | 86% | 24 | 58% | -0.30 | -0.25 | -7.12 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
