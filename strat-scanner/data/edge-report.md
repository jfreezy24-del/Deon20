# Edge Report — live signal record

_Generated 2026-10-07_ · **1051** settled signals from 2026-08-17 to 2026-10-07 · 39 open, 58 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (729 of 1051) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 5% timed out.
- **Expectancy +4.14R per trade taken**, +2.87R per signal published.
- Promised **0.74R** to target 1 on average; delivered **+4.14R**.
- Trades ran **4.84R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 496 | 64% | 317 | 80% | +4.06 | +2.59 | +1286.21 |
| 55–64 | 441 | 73% | 322 | 69% | +5.39 | +3.94 | +1735.56 |
| 65–74 (High) | 102 | 79% | 81 | 62% | -0.03 | -0.02 | -2.50 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.020** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 318 | +6.00 | 733 | +1.52 | +4.49 | 75% vs 72% |
| `ftfc-aligned` | 232 | +5.59 | 819 | +2.11 | +3.48 | 69% vs 74% |
| `ftfc-opposed` | 232 | +5.59 | 819 | +2.11 | +3.48 | 69% vs 74% |
| `base` | 1051 | +2.87 | 0 | +0.00 | +2.87 | 73% vs 0% |
| `rr-poor` | 724 | +3.38 | 327 | +1.75 | +1.63 | 85% vs 38% |
| `close-location` | 555 | +3.14 | 496 | +2.57 | +0.57 | 75% vs 70% |
| `reversal-backed` | 601 | +3.04 | 450 | +2.66 | +0.38 | 78% vs 67% |
| `rr-ok` | 304 | +1.88 | 747 | +3.28 | -1.40 | 39% vs 83% |
| `rr-strong` | 23 | +0.06 | 1028 | +2.94 | -2.88 | 35% vs 74% |
| `ftfc-full` | 818 | +2.11 | 233 | +5.56 | -3.46 | 74% vs 69% |
| `volume` | 224 | +0.07 | 827 | +3.63 | -3.56 | 63% vs 75% |
| `in-force` | 509 | -0.03 | 542 | +5.60 | -5.62 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 301 | 73% | 220 | 78% | -0.04 | -0.03 | -9.88 |
| 2-2 Continuation | 265 | 65% | 172 | 58% | +3.33 | +2.16 | +573.21 |
| 2-1-2 Reversal | 122 | 69% | 84 | 73% | -0.07 | -0.05 | -6.19 |
| 2-1-2 Continuation | 111 | 76% | 84 | 77% | +7.31 | +5.53 | +613.86 |
| Rev Strat (1-2-2) Reversal | 78 | 65% | 51 | 86% | +0.08 | +0.05 | +4.02 |
| 3-1-2 Reversal | 55 | 60% | 33 | 79% | +39.34 | +23.60 | +1298.19 |
| 3-2-2 Reversal | 46 | 61% | 28 | 79% | +19.24 | +11.71 | +538.60 |
| 3-2 Continuation | 43 | 77% | 33 | 82% | +0.18 | +0.14 | +6.09 |
| 1-1-2 Continuation | 30 | 80% | 24 | 71% | +0.12 | +0.10 | +2.88 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 654 | 66% | 431 | 71% | -0.02 | -0.01 | -8.31 |
| W | 285 | 72% | 206 | 78% | +2.78 | +2.01 | +571.79 |
| M | 112 | 82% | 92 | 70% | +26.71 | +21.94 | +2457.30 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 818 | 67% | 549 | 74% | +3.14 | +2.11 | +1724.49 |
| Mixed | 232 | 78% | 180 | 69% | +7.20 | +5.59 | +1296.29 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 449 | 70% | 313 | 67% | +3.82 | +2.66 | +1196.04 |
| Reversal | 602 | 69% | 416 | 78% | +4.39 | +3.03 | +1824.74 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 733 | 69% | 504 | 72% | +2.21 | +1.52 | +1112.04 |
| Inside-bar compression (X-1-?) | 318 | 71% | 225 | 75% | +8.48 | +6.00 | +1908.74 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 44 | 25% | 11 | 100% | +275.81 | +68.95 | +3033.94 |
| LTC-USD | 17 | 82% | 14 | 93% | +0.44 | +0.36 | +6.13 |
| TLT | 32 | 72% | 23 | 78% | +0.38 | +0.27 | +8.80 |
| AMD | 35 | 80% | 28 | 82% | +0.29 | +0.23 | +8.19 |
| DIA | 37 | 81% | 30 | 87% | +0.18 | +0.14 | +5.34 |
| ETH-USD | 24 | 79% | 19 | 84% | +0.16 | +0.13 | +3.04 |
| XLI | 34 | 65% | 22 | 91% | +0.18 | +0.12 | +4.03 |
| XLU | 39 | 82% | 32 | 66% | +0.12 | +0.10 | +3.95 |
| META | 37 | 51% | 19 | 79% | +0.17 | +0.08 | +3.14 |
| IWM | 34 | 59% | 20 | 75% | +0.14 | +0.08 | +2.77 |
| AMZN | 30 | 77% | 23 | 87% | +0.10 | +0.08 | +2.31 |
| BTC-USD | 24 | 92% | 22 | 73% | +0.03 | +0.02 | +0.60 |
| XLF | 39 | 74% | 29 | 69% | +0.02 | +0.02 | +0.67 |
| EURUSD=X | 36 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLC | 30 | 77% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| XLK | 34 | 74% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| SMH | 32 | 72% | 23 | 74% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 36 | 64% | 23 | 70% | -0.03 | -0.02 | -0.78 |
| SPY | 28 | 75% | 21 | 67% | -0.07 | -0.05 | -1.53 |
| SOL-USD | 27 | 78% | 21 | 62% | -0.09 | -0.07 | -1.94 |
| MSFT | 26 | 85% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| TSLA | 32 | 75% | 24 | 75% | -0.12 | -0.09 | -2.81 |
| DOGE-USD | 27 | 70% | 19 | 42% | -0.15 | -0.10 | -2.82 |
| XLY | 26 | 85% | 22 | 77% | -0.14 | -0.11 | -2.98 |
| QQQ | 27 | 81% | 22 | 68% | -0.14 | -0.11 | -3.10 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| GLD | 34 | 62% | 21 | 76% | -0.19 | -0.12 | -3.97 |
| AAPL | 30 | 77% | 23 | 70% | -0.16 | -0.12 | -3.60 |
| XLV | 26 | 73% | 19 | 63% | -0.18 | -0.13 | -3.51 |
| NVDA | 31 | 58% | 18 | 67% | -0.30 | -0.17 | -5.35 |
| XLE | 37 | 73% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| GC=F | 30 | 67% | 20 | 65% | -0.31 | -0.21 | -6.17 |
| XLP | 27 | 78% | 21 | 62% | -0.27 | -0.21 | -5.67 |
| GOOGL | 26 | 85% | 22 | 59% | -0.31 | -0.26 | -6.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
