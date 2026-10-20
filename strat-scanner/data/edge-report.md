# Edge Report — live signal record

_Generated 2026-10-20_ · **1286** settled signals from 2026-08-17 to 2026-10-20 · 42 open, 54 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (887 of 1286) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.40R per trade taken**, +2.34R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+3.40R**.
- Trades ran **4.09R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 611 | 64% | 393 | 80% | +3.27 | +2.10 | +1284.70 |
| 55–64 | 541 | 72% | 387 | 68% | +4.47 | +3.20 | +1729.42 |
| 65–74 (High) | 119 | 80% | 95 | 65% | +0.01 | +0.01 | +0.82 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.021** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 371 | +5.16 | 915 | +1.21 | +3.95 | 76% vs 72% |
| `ftfc-aligned` | 275 | +4.71 | 1011 | +1.70 | +3.01 | 69% vs 74% |
| `ftfc-opposed` | 275 | +4.71 | 1011 | +1.70 | +3.01 | 69% vs 74% |
| `base` | 1286 | +2.34 | 0 | +0.00 | +2.34 | 73% vs 0% |
| `rr-poor` | 888 | +2.76 | 398 | +1.42 | +1.33 | 85% vs 38% |
| `close-location` | 680 | +2.56 | 606 | +2.10 | +0.46 | 76% vs 69% |
| `reversal-backed` | 748 | +2.44 | 538 | +2.22 | +0.22 | 78% vs 66% |
| `rr-ok` | 367 | +1.54 | 919 | +2.66 | -1.12 | 38% vs 83% |
| `rr-strong` | 31 | +0.00 | 1255 | +2.40 | -2.40 | 33% vs 74% |
| `volume` | 265 | +0.05 | 1021 | +2.94 | -2.89 | 64% vs 75% |
| `ftfc-full` | 1010 | +1.70 | 276 | +4.69 | -2.99 | 74% vs 69% |
| `in-force` | 617 | -0.03 | 669 | +4.53 | -4.56 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 382 | 74% | 284 | 77% | -0.05 | -0.03 | -12.98 |
| 2-2 Continuation | 324 | 64% | 208 | 58% | +2.73 | +1.75 | +566.92 |
| 2-1-2 Reversal | 148 | 71% | 105 | 74% | -0.04 | -0.03 | -4.19 |
| 2-1-2 Continuation | 129 | 72% | 93 | 77% | +6.60 | +4.76 | +614.22 |
| Rev Strat (1-2-2) Reversal | 98 | 59% | 58 | 83% | +0.02 | +0.01 | +1.17 |
| 3-1-2 Reversal | 61 | 59% | 36 | 81% | +36.07 | +21.29 | +1298.49 |
| 3-2-2 Reversal | 60 | 62% | 37 | 84% | +14.63 | +9.02 | +541.23 |
| 3-2 Continuation | 51 | 76% | 39 | 79% | +0.17 | +0.13 | +6.46 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 801 | 65% | 520 | 72% | -0.02 | -0.01 | -11.68 |
| W | 354 | 73% | 257 | 78% | +2.24 | +1.62 | +574.51 |
| M | 131 | 84% | 110 | 65% | +22.30 | +18.72 | +2452.64 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1010 | 66% | 668 | 74% | +2.57 | +1.70 | +1720.09 |
| Mixed | 275 | 80% | 219 | 69% | +5.91 | +4.71 | +1295.37 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 537 | 68% | 367 | 66% | +3.25 | +2.22 | +1191.76 |
| Reversal | 749 | 69% | 520 | 78% | +3.51 | +2.43 | +1823.71 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 915 | 68% | 626 | 72% | +1.76 | +1.21 | +1102.79 |
| Inside-bar compression (X-1-?) | 371 | 70% | 261 | 76% | +7.33 | +5.16 | +1912.67 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 52 | 21% | 11 | 100% | +275.81 | +58.34 | +3033.94 |
| LTC-USD | 22 | 86% | 19 | 89% | +0.34 | +0.29 | +6.47 |
| TLT | 37 | 73% | 27 | 78% | +0.34 | +0.25 | +9.26 |
| AMD | 42 | 79% | 33 | 79% | +0.18 | +0.14 | +6.03 |
| XLI | 41 | 63% | 26 | 92% | +0.17 | +0.11 | +4.31 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| AMZN | 38 | 79% | 30 | 83% | +0.09 | +0.07 | +2.59 |
| DIA | 43 | 81% | 35 | 86% | +0.08 | +0.06 | +2.72 |
| XLU | 45 | 78% | 35 | 63% | +0.06 | +0.05 | +2.24 |
| ETH-USD | 28 | 79% | 22 | 77% | +0.05 | +0.04 | +1.15 |
| XLK | 41 | 66% | 27 | 81% | +0.04 | +0.03 | +1.13 |
| SMH | 42 | 62% | 26 | 73% | +0.04 | +0.02 | +1.00 |
| EURUSD=X | 41 | 7% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| BTC-USD | 28 | 93% | 26 | 73% | +0.01 | +0.01 | +0.18 |
| XLF | 46 | 78% | 36 | 72% | +0.01 | +0.00 | +0.19 |
| GLD | 43 | 67% | 29 | 83% | +0.00 | +0.00 | +0.07 |
| SOL-USD | 32 | 78% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XRP-USD | 38 | 63% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| XLC | 38 | 79% | 30 | 87% | -0.02 | -0.02 | -0.61 |
| IWM | 44 | 66% | 29 | 69% | -0.03 | -0.02 | -0.85 |
| MSFT | 31 | 84% | 26 | 77% | -0.04 | -0.03 | -1.06 |
| SPY | 33 | 70% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| HYPE-USD | 26 | 81% | 21 | 57% | -0.05 | -0.04 | -0.96 |
| XLY | 35 | 89% | 31 | 77% | -0.06 | -0.06 | -2.00 |
| AAPL | 36 | 78% | 28 | 71% | -0.10 | -0.08 | -2.74 |
| TSLA | 37 | 76% | 28 | 75% | -0.13 | -0.10 | -3.62 |
| DOGE-USD | 33 | 70% | 23 | 48% | -0.15 | -0.10 | -3.34 |
| XLP | 41 | 66% | 27 | 63% | -0.17 | -0.11 | -4.47 |
| QQQ | 37 | 73% | 27 | 63% | -0.18 | -0.13 | -4.81 |
| GC=F | 40 | 65% | 26 | 73% | -0.21 | -0.13 | -5.36 |
| XLV | 37 | 76% | 28 | 64% | -0.19 | -0.14 | -5.22 |
| NVDA | 40 | 63% | 25 | 64% | -0.30 | -0.19 | -7.41 |
| XLE | 41 | 73% | 30 | 60% | -0.27 | -0.20 | -8.03 |
| GOOGL | 33 | 85% | 28 | 61% | -0.26 | -0.22 | -7.23 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
