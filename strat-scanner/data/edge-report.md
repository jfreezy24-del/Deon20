# Edge Report — live signal record

_Generated 2026-10-23_ · **1387** settled signals from 2026-08-17 to 2026-10-23 · 31 open, 43 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (959 of 1387) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.14R per trade taken**, +2.17R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+3.14R**.
- Trades ran **3.84R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 664 | 64% | 427 | 80% | +3.01 | +1.94 | +1285.28 |
| 55–64 | 582 | 72% | 419 | 68% | +4.12 | +2.97 | +1725.85 |
| 65–74 (High) | 126 | 80% | 101 | 66% | +0.03 | +0.02 | +2.98 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.019** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 399 | +4.79 | 988 | +1.12 | +3.68 | 77% vs 72% |
| `ftfc-aligned` | 299 | +4.33 | 1088 | +1.58 | +2.75 | 70% vs 74% |
| `ftfc-opposed` | 299 | +4.33 | 1088 | +1.58 | +2.75 | 70% vs 74% |
| `base` | 1387 | +2.17 | 0 | +0.00 | +2.17 | 73% vs 0% |
| `rr-poor` | 963 | +2.54 | 424 | +1.33 | +1.21 | 85% vs 37% |
| `close-location` | 719 | +2.42 | 668 | +1.90 | +0.52 | 76% vs 70% |
| `reversal-backed` | 814 | +2.24 | 573 | +2.07 | +0.17 | 78% vs 66% |
| `rr-ok` | 391 | +1.43 | 996 | +2.46 | -1.03 | 37% vs 83% |
| `rr-strong` | 33 | +0.10 | 1354 | +2.22 | -2.12 | 39% vs 74% |
| `volume` | 280 | +0.04 | 1107 | +2.71 | -2.67 | 64% vs 75% |
| `ftfc-full` | 1087 | +1.58 | 300 | +4.32 | -2.74 | 74% vs 70% |
| `in-force` | 667 | -0.03 | 720 | +4.21 | -4.24 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 413 | 74% | 307 | 78% | -0.03 | -0.02 | -9.34 |
| 2-2 Continuation | 343 | 65% | 222 | 58% | +2.53 | +1.64 | +561.91 |
| 2-1-2 Reversal | 159 | 70% | 112 | 74% | -0.05 | -0.04 | -5.88 |
| 2-1-2 Continuation | 141 | 72% | 102 | 79% | +6.04 | +4.37 | +615.96 |
| Rev Strat (1-2-2) Reversal | 107 | 59% | 63 | 84% | +0.04 | +0.02 | +2.56 |
| 3-2-2 Reversal | 71 | 62% | 44 | 84% | +12.29 | +7.61 | +540.61 |
| 3-1-2 Reversal | 65 | 62% | 40 | 80% | +32.47 | +19.98 | +1298.65 |
| 3-2 Continuation | 54 | 78% | 42 | 74% | +0.14 | +0.11 | +6.00 |
| 1-1-2 Continuation | 34 | 79% | 27 | 70% | +0.15 | +0.12 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 865 | 66% | 568 | 72% | -0.03 | -0.02 | -14.63 |
| W | 386 | 72% | 276 | 78% | +2.08 | +1.48 | +573.13 |
| M | 136 | 85% | 115 | 66% | +21.36 | +18.06 | +2456.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1087 | 66% | 719 | 74% | +2.39 | +1.58 | +1719.28 |
| Mixed | 299 | 80% | 240 | 70% | +5.40 | +4.33 | +1295.35 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 572 | 69% | 393 | 66% | +3.02 | +2.08 | +1188.04 |
| Reversal | 815 | 69% | 566 | 78% | +3.23 | +2.24 | +1826.60 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 988 | 69% | 678 | 72% | +1.62 | +1.12 | +1101.75 |
| Inside-bar compression (X-1-?) | 399 | 70% | 281 | 77% | +6.81 | +4.79 | +1912.89 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 55 | 22% | 12 | 100% | +252.89 | +55.18 | +3034.65 |
| TLT | 40 | 75% | 30 | 80% | +0.36 | +0.27 | +10.65 |
| LTC-USD | 24 | 88% | 21 | 86% | +0.29 | +0.25 | +6.11 |
| AMD | 45 | 78% | 35 | 80% | +0.19 | +0.14 | +6.52 |
| DIA | 45 | 82% | 37 | 86% | +0.12 | +0.10 | +4.49 |
| XLI | 42 | 64% | 27 | 89% | +0.12 | +0.08 | +3.31 |
| AMZN | 41 | 78% | 32 | 84% | +0.10 | +0.07 | +3.06 |
| XLK | 46 | 67% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLU | 50 | 76% | 38 | 66% | +0.08 | +0.06 | +2.91 |
| META | 48 | 52% | 25 | 76% | +0.09 | +0.05 | +2.30 |
| EURUSD=X | 44 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| SMH | 46 | 65% | 30 | 73% | +0.01 | +0.01 | +0.40 |
| BTC-USD | 29 | 93% | 27 | 74% | +0.01 | +0.01 | +0.20 |
| ETH-USD | 31 | 81% | 25 | 72% | +0.00 | +0.00 | +0.10 |
| IWM | 47 | 64% | 30 | 70% | +0.00 | +0.00 | +0.06 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 49 | 80% | 39 | 72% | -0.01 | -0.01 | -0.55 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| MSFT | 35 | 80% | 28 | 79% | -0.02 | -0.02 | -0.67 |
| XRP-USD | 39 | 64% | 25 | 68% | -0.03 | -0.02 | -0.78 |
| HYPE-USD | 29 | 83% | 24 | 58% | -0.02 | -0.02 | -0.58 |
| XLC | 40 | 80% | 32 | 84% | -0.06 | -0.05 | -1.99 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| SPY | 37 | 70% | 26 | 65% | -0.08 | -0.06 | -2.14 |
| AAPL | 39 | 74% | 29 | 72% | -0.09 | -0.07 | -2.63 |
| XLP | 43 | 65% | 28 | 64% | -0.16 | -0.10 | -4.47 |
| DOGE-USD | 36 | 72% | 26 | 50% | -0.15 | -0.10 | -3.78 |
| QQQ | 41 | 73% | 30 | 67% | -0.15 | -0.11 | -4.59 |
| XLV | 41 | 73% | 30 | 67% | -0.16 | -0.12 | -4.79 |
| GC=F | 42 | 64% | 27 | 74% | -0.20 | -0.13 | -5.35 |
| TSLA | 41 | 76% | 31 | 74% | -0.17 | -0.13 | -5.30 |
| NVDA | 43 | 63% | 27 | 67% | -0.26 | -0.16 | -6.93 |
| XLE | 46 | 74% | 34 | 59% | -0.24 | -0.18 | -8.32 |
| GOOGL | 36 | 86% | 31 | 61% | -0.25 | -0.22 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
