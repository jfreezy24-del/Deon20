# Edge Report — live signal record

_Generated 2026-10-15_ · **1224** settled signals from 2026-08-17 to 2026-10-15 · 37 open, 41 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (851 of 1224) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.54R per trade taken**, +2.46R per signal published.
- Promised **0.73R** to target 1 on average; delivered **+3.54R**.
- Trades ran **4.24R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 578 | 64% | 372 | 80% | +3.44 | +2.22 | +1281.50 |
| 55–64 | 517 | 73% | 376 | 68% | +4.60 | +3.35 | +1730.00 |
| 65–74 (High) | 115 | 80% | 92 | 65% | +0.02 | +0.02 | +2.06 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.039** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 360 | +5.33 | 864 | +1.27 | +4.06 | 77% vs 71% |
| `ftfc-aligned` | 263 | +4.92 | 961 | +1.79 | +3.13 | 69% vs 74% |
| `ftfc-opposed` | 263 | +4.92 | 961 | +1.79 | +3.13 | 69% vs 74% |
| `base` | 1224 | +2.46 | 0 | +0.00 | +2.46 | 73% vs 0% |
| `rr-poor` | 843 | +2.91 | 381 | +1.48 | +1.42 | 85% vs 38% |
| `close-location` | 649 | +2.69 | 575 | +2.21 | +0.47 | 75% vs 70% |
| `reversal-backed` | 710 | +2.57 | 514 | +2.31 | +0.26 | 78% vs 66% |
| `rr-ok` | 352 | +1.60 | 872 | +2.81 | -1.21 | 38% vs 83% |
| `rr-strong` | 29 | +0.05 | 1195 | +2.52 | -2.47 | 35% vs 74% |
| `volume` | 241 | +0.06 | 983 | +3.05 | -2.99 | 64% vs 75% |
| `ftfc-full` | 960 | +1.79 | 264 | +4.90 | -3.11 | 74% vs 69% |
| `in-force` | 592 | -0.03 | 632 | +4.80 | -4.83 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 359 | 76% | 272 | 77% | -0.04 | -0.03 | -12.18 |
| 2-2 Continuation | 308 | 65% | 201 | 57% | +2.80 | +1.83 | +563.22 |
| 2-1-2 Reversal | 143 | 71% | 101 | 76% | -0.01 | -0.01 | -0.94 |
| 2-1-2 Continuation | 125 | 72% | 90 | 79% | +6.85 | +4.93 | +616.49 |
| Rev Strat (1-2-2) Reversal | 96 | 58% | 56 | 82% | +0.02 | +0.01 | +1.15 |
| 3-1-2 Reversal | 59 | 61% | 36 | 81% | +36.07 | +22.01 | +1298.49 |
| 3-2-2 Reversal | 54 | 59% | 32 | 81% | +16.88 | +10.00 | +540.09 |
| 3-2 Continuation | 47 | 77% | 36 | 78% | +0.13 | +0.10 | +4.59 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 752 | 66% | 494 | 72% | -0.03 | -0.02 | -13.01 |
| W | 345 | 73% | 251 | 78% | +2.29 | +1.67 | +575.61 |
| M | 127 | 83% | 106 | 65% | +23.14 | +19.31 | +2452.49 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 960 | 67% | 642 | 74% | +2.68 | +1.79 | +1720.26 |
| Mixed | 263 | 79% | 209 | 69% | +6.20 | +4.92 | +1294.82 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 513 | 69% | 354 | 66% | +3.36 | +2.32 | +1188.47 |
| Reversal | 711 | 70% | 497 | 78% | +3.68 | +2.57 | +1826.62 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 864 | 69% | 597 | 71% | +1.84 | +1.27 | +1096.88 |
| Inside-bar compression (X-1-?) | 360 | 71% | 254 | 77% | +7.55 | +5.33 | +1918.20 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 51 | 22% | 11 | 100% | +275.81 | +59.49 | +3033.94 |
| LTC-USD | 20 | 85% | 17 | 88% | +0.36 | +0.31 | +6.16 |
| TLT | 37 | 73% | 27 | 78% | +0.34 | +0.25 | +9.26 |
| AMD | 39 | 82% | 32 | 78% | +0.19 | +0.15 | +5.96 |
| XLI | 38 | 68% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| AMZN | 38 | 79% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| DIA | 42 | 81% | 34 | 85% | +0.08 | +0.06 | +2.64 |
| XLU | 42 | 81% | 34 | 62% | +0.06 | +0.05 | +1.95 |
| BTC-USD | 26 | 92% | 24 | 75% | +0.05 | +0.04 | +1.10 |
| ETH-USD | 27 | 78% | 21 | 76% | +0.05 | +0.04 | +1.04 |
| IWM | 41 | 66% | 27 | 74% | +0.05 | +0.03 | +1.23 |
| XLK | 39 | 69% | 27 | 81% | +0.04 | +0.03 | +1.13 |
| XLC | 36 | 78% | 28 | 89% | +0.02 | +0.02 | +0.69 |
| EURUSD=X | 41 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLF | 45 | 78% | 35 | 71% | +0.01 | +0.00 | +0.19 |
| GLD | 39 | 67% | 26 | 81% | -0.00 | -0.00 | -0.08 |
| SOL-USD | 31 | 77% | 24 | 67% | -0.02 | -0.01 | -0.38 |
| XRP-USD | 38 | 63% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SMH | 39 | 64% | 25 | 72% | -0.04 | -0.03 | -1.07 |
| MSFT | 31 | 84% | 26 | 77% | -0.04 | -0.03 | -1.06 |
| SPY | 31 | 74% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| AAPL | 34 | 76% | 26 | 73% | -0.07 | -0.06 | -1.88 |
| HYPE-USD | 24 | 79% | 19 | 53% | -0.07 | -0.06 | -1.41 |
| DOGE-USD | 33 | 70% | 23 | 48% | -0.15 | -0.10 | -3.34 |
| TSLA | 36 | 75% | 27 | 74% | -0.14 | -0.10 | -3.68 |
| XLY | 31 | 87% | 27 | 78% | -0.12 | -0.10 | -3.24 |
| GC=F | 38 | 66% | 25 | 72% | -0.22 | -0.14 | -5.39 |
| QQQ | 34 | 76% | 26 | 62% | -0.19 | -0.14 | -4.84 |
| XLE | 39 | 72% | 28 | 64% | -0.21 | -0.15 | -5.76 |
| XLV | 33 | 79% | 26 | 65% | -0.21 | -0.16 | -5.40 |
| XLP | 36 | 69% | 25 | 60% | -0.28 | -0.19 | -6.95 |
| NVDA | 38 | 66% | 25 | 64% | -0.30 | -0.20 | -7.41 |
| GOOGL | 32 | 84% | 27 | 59% | -0.27 | -0.23 | -7.39 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
