# Edge Report — live signal record

_Generated 2026-10-09_ · **1108** settled signals from 2026-08-17 to 2026-10-09 · 37 open, 49 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (770 of 1108) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.92R per trade taken**, +2.72R per signal published.
- Promised **0.75R** to target 1 on average; delivered **+3.92R**.
- Trades ran **4.62R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 519 | 64% | 334 | 80% | +3.85 | +2.48 | +1285.50 |
| 55–64 | 469 | 73% | 341 | 69% | +5.09 | +3.70 | +1733.99 |
| 65–74 (High) | 106 | 79% | 84 | 62% | -0.03 | -0.02 | -2.27 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.019** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 335 | +5.71 | 773 | +1.43 | +4.28 | 76% vs 72% |
| `ftfc-aligned` | 245 | +5.30 | 863 | +1.99 | +3.30 | 69% vs 74% |
| `ftfc-opposed` | 245 | +5.30 | 863 | +1.99 | +3.30 | 69% vs 74% |
| `base` | 1108 | +2.72 | 0 | +0.00 | +2.72 | 73% vs 0% |
| `rr-poor` | 759 | +3.23 | 349 | +1.63 | +1.60 | 85% vs 38% |
| `close-location` | 583 | +2.99 | 525 | +2.43 | +0.56 | 75% vs 70% |
| `reversal-backed` | 638 | +2.86 | 470 | +2.54 | +0.32 | 78% vs 66% |
| `rr-ok` | 322 | +1.77 | 786 | +3.12 | -1.35 | 39% vs 83% |
| `rr-strong` | 27 | -0.03 | 1081 | +2.79 | -2.82 | 32% vs 74% |
| `ftfc-full` | 862 | +2.00 | 246 | +5.27 | -3.28 | 74% vs 69% |
| `volume` | 231 | +0.06 | 877 | +3.43 | -3.37 | 62% vs 75% |
| `in-force` | 536 | -0.03 | 572 | +5.30 | -5.33 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 317 | 74% | 235 | 77% | -0.06 | -0.04 | -13.23 |
| 2-2 Continuation | 279 | 65% | 181 | 58% | +3.15 | +2.04 | +570.12 |
| 2-1-2 Reversal | 134 | 70% | 94 | 74% | -0.03 | -0.02 | -2.57 |
| 2-1-2 Continuation | 112 | 76% | 85 | 78% | +7.22 | +5.48 | +614.01 |
| Rev Strat (1-2-2) Reversal | 82 | 62% | 51 | 86% | +0.08 | +0.05 | +4.02 |
| 3-1-2 Reversal | 56 | 61% | 34 | 79% | +38.18 | +23.18 | +1298.25 |
| 3-2-2 Reversal | 50 | 58% | 29 | 79% | +18.57 | +10.77 | +538.60 |
| 3-2 Continuation | 45 | 76% | 34 | 79% | +0.16 | +0.12 | +5.38 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 685 | 66% | 452 | 71% | -0.02 | -0.01 | -9.75 |
| W | 305 | 72% | 220 | 78% | +2.60 | +1.88 | +572.57 |
| M | 118 | 83% | 98 | 67% | +25.06 | +20.81 | +2455.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 862 | 67% | 578 | 74% | +2.98 | +2.00 | +1721.33 |
| Mixed | 245 | 78% | 192 | 69% | +6.76 | +5.30 | +1297.41 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 469 | 70% | 327 | 66% | +3.65 | +2.55 | +1193.67 |
| Reversal | 639 | 69% | 443 | 78% | +4.12 | +2.86 | +1825.07 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 773 | 69% | 530 | 72% | +2.08 | +1.43 | +1104.89 |
| Inside-bar compression (X-1-?) | 335 | 72% | 240 | 76% | +7.97 | +5.71 | +1913.85 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 47 | 23% | 11 | 100% | +275.81 | +64.55 | +3033.94 |
| LTC-USD | 18 | 83% | 15 | 93% | +0.42 | +0.35 | +6.37 |
| AMD | 36 | 81% | 29 | 83% | +0.29 | +0.24 | +8.49 |
| TLT | 35 | 71% | 25 | 76% | +0.31 | +0.22 | +7.70 |
| DIA | 37 | 81% | 30 | 87% | +0.18 | +0.14 | +5.34 |
| ETH-USD | 24 | 79% | 19 | 84% | +0.16 | +0.13 | +3.04 |
| XLI | 35 | 66% | 23 | 91% | +0.18 | +0.12 | +4.03 |
| AMZN | 33 | 79% | 26 | 85% | +0.10 | +0.08 | +2.65 |
| META | 41 | 54% | 22 | 77% | +0.15 | +0.08 | +3.27 |
| XLU | 41 | 80% | 33 | 64% | +0.09 | +0.07 | +2.95 |
| BTC-USD | 25 | 92% | 23 | 74% | +0.04 | +0.04 | +0.96 |
| XLF | 40 | 75% | 30 | 70% | +0.03 | +0.02 | +0.99 |
| IWM | 38 | 63% | 24 | 71% | +0.03 | +0.02 | +0.77 |
| EURUSD=X | 37 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLC | 31 | 77% | 24 | 88% | +0.01 | +0.01 | +0.25 |
| XLK | 35 | 71% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SOL-USD | 29 | 79% | 23 | 65% | -0.02 | -0.02 | -0.52 |
| MSFT | 28 | 82% | 23 | 78% | -0.04 | -0.03 | -0.96 |
| SMH | 35 | 69% | 24 | 71% | -0.05 | -0.04 | -1.23 |
| SPY | 28 | 75% | 21 | 67% | -0.07 | -0.05 | -1.53 |
| GLD | 35 | 63% | 22 | 77% | -0.11 | -0.07 | -2.37 |
| DOGE-USD | 29 | 72% | 21 | 48% | -0.11 | -0.08 | -2.36 |
| TSLA | 32 | 75% | 24 | 75% | -0.12 | -0.09 | -2.81 |
| AAPL | 32 | 78% | 25 | 72% | -0.14 | -0.11 | -3.56 |
| XLY | 26 | 85% | 22 | 77% | -0.14 | -0.11 | -2.98 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| QQQ | 29 | 79% | 23 | 65% | -0.18 | -0.14 | -4.10 |
| GC=F | 34 | 65% | 22 | 68% | -0.25 | -0.16 | -5.39 |
| XLV | 28 | 75% | 21 | 62% | -0.21 | -0.16 | -4.45 |
| NVDA | 33 | 61% | 20 | 65% | -0.29 | -0.18 | -5.87 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| XLP | 31 | 77% | 24 | 58% | -0.30 | -0.23 | -7.16 |
| GOOGL | 28 | 86% | 24 | 58% | -0.30 | -0.25 | -7.12 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
