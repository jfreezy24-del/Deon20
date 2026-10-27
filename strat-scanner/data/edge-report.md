# Edge Report — live signal record

_Generated 2026-10-27_ · **1436** settled signals from 2026-08-17 to 2026-10-27 · 42 open, 41 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (975 of 1436) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.10R per trade taken**, +2.10R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+3.10R**.
- Trades ran **3.79R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 692 | 63% | 433 | 80% | +2.96 | +1.85 | +1283.39 |
| 55–64 | 598 | 72% | 429 | 68% | +4.03 | +2.89 | +1730.99 |
| 65–74 (High) | 131 | 77% | 101 | 66% | +0.03 | +0.02 | +2.98 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.024** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 415 | +4.61 | 1021 | +1.08 | +3.52 | 76% vs 72% |
| `ftfc-aligned` | 309 | +4.19 | 1127 | +1.53 | +2.66 | 70% vs 74% |
| `ftfc-opposed` | 309 | +4.19 | 1127 | +1.53 | +2.66 | 70% vs 74% |
| `base` | 1436 | +2.10 | 0 | +0.00 | +2.10 | 73% vs 0% |
| `rr-poor` | 986 | +2.49 | 450 | +1.26 | +1.23 | 85% vs 38% |
| `close-location` | 737 | +2.37 | 699 | +1.82 | +0.54 | 75% vs 70% |
| `reversal-backed` | 836 | +2.19 | 600 | +1.98 | +0.20 | 78% vs 66% |
| `rr-ok` | 416 | +1.35 | 1020 | +2.41 | -1.05 | 38% vs 84% |
| `rr-strong` | 34 | +0.10 | 1402 | +2.15 | -2.05 | 39% vs 74% |
| `volume` | 289 | +0.05 | 1147 | +2.62 | -2.57 | 65% vs 75% |
| `ftfc-full` | 1126 | +1.53 | 310 | +4.18 | -2.65 | 74% vs 70% |
| `in-force` | 676 | -0.02 | 760 | +3.99 | -4.01 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 421 | 73% | 309 | 78% | -0.03 | -0.02 | -8.18 |
| 2-2 Continuation | 362 | 64% | 231 | 58% | +2.45 | +1.56 | +565.56 |
| 2-1-2 Reversal | 168 | 67% | 112 | 74% | -0.05 | -0.03 | -5.88 |
| 2-1-2 Continuation | 144 | 72% | 103 | 80% | +5.98 | +4.28 | +616.04 |
| Rev Strat (1-2-2) Reversal | 108 | 58% | 63 | 84% | +0.04 | +0.02 | +2.56 |
| 3-2-2 Reversal | 74 | 62% | 46 | 85% | +11.76 | +7.31 | +540.98 |
| 3-1-2 Reversal | 66 | 61% | 40 | 80% | +32.47 | +19.68 | +1298.65 |
| 3-2 Continuation | 56 | 77% | 43 | 72% | +0.12 | +0.09 | +5.00 |
| 1-1-2 Continuation | 37 | 76% | 28 | 68% | +0.11 | +0.09 | +3.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 902 | 64% | 577 | 72% | -0.02 | -0.01 | -12.14 |
| W | 395 | 71% | 281 | 78% | +2.04 | +1.45 | +573.37 |
| M | 139 | 84% | 117 | 66% | +21.00 | +17.67 | +2456.65 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1126 | 65% | 732 | 74% | +2.35 | +1.53 | +1722.58 |
| Mixed | 309 | 79% | 243 | 70% | +5.33 | +4.19 | +1295.30 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 599 | 68% | 405 | 66% | +2.94 | +1.99 | +1189.75 |
| Reversal | 837 | 68% | 570 | 78% | +3.21 | +2.18 | +1828.13 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1021 | 68% | 692 | 72% | +1.60 | +1.08 | +1105.92 |
| Inside-bar compression (X-1-?) | 415 | 68% | 283 | 76% | +6.76 | +4.61 | +1911.97 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 60 | 20% | 12 | 100% | +252.89 | +50.58 | +3034.65 |
| TLT | 43 | 70% | 30 | 80% | +0.36 | +0.25 | +10.65 |
| LTC-USD | 26 | 81% | 21 | 86% | +0.29 | +0.23 | +6.11 |
| AMD | 47 | 74% | 35 | 80% | +0.19 | +0.14 | +6.52 |
| XLI | 45 | 64% | 29 | 90% | +0.12 | +0.08 | +3.42 |
| AMZN | 42 | 79% | 33 | 85% | +0.10 | +0.07 | +3.14 |
| DIA | 47 | 83% | 39 | 85% | +0.09 | +0.07 | +3.41 |
| XLK | 47 | 66% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLU | 51 | 75% | 38 | 66% | +0.08 | +0.06 | +2.91 |
| META | 49 | 51% | 25 | 76% | +0.09 | +0.05 | +2.30 |
| XLC | 44 | 80% | 35 | 86% | +0.03 | +0.03 | +1.12 |
| EURUSD=X | 47 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| SMH | 47 | 64% | 30 | 73% | +0.01 | +0.01 | +0.40 |
| BTC-USD | 31 | 87% | 27 | 74% | +0.01 | +0.01 | +0.20 |
| ETH-USD | 32 | 78% | 25 | 72% | +0.00 | +0.00 | +0.10 |
| IWM | 49 | 61% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| MSFT | 38 | 82% | 31 | 77% | -0.01 | -0.01 | -0.20 |
| SOL-USD | 34 | 74% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 49 | 80% | 39 | 72% | -0.01 | -0.01 | -0.55 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| HYPE-USD | 31 | 81% | 25 | 56% | -0.06 | -0.05 | -1.58 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| AAPL | 39 | 74% | 29 | 72% | -0.09 | -0.07 | -2.63 |
| SPY | 38 | 71% | 27 | 63% | -0.12 | -0.08 | -3.14 |
| XLP | 44 | 64% | 28 | 64% | -0.16 | -0.10 | -4.47 |
| DOGE-USD | 37 | 70% | 26 | 50% | -0.15 | -0.10 | -3.78 |
| QQQ | 41 | 73% | 30 | 67% | -0.15 | -0.11 | -4.59 |
| XLV | 41 | 73% | 30 | 67% | -0.16 | -0.12 | -4.79 |
| GC=F | 43 | 63% | 27 | 74% | -0.20 | -0.12 | -5.35 |
| TSLA | 42 | 76% | 32 | 75% | -0.17 | -0.13 | -5.30 |
| XLE | 47 | 74% | 35 | 60% | -0.21 | -0.15 | -7.26 |
| NVDA | 43 | 63% | 27 | 67% | -0.26 | -0.16 | -6.93 |
| GOOGL | 38 | 84% | 32 | 63% | -0.20 | -0.17 | -6.36 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
