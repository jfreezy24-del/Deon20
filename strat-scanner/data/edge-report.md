# Edge Report — live signal record

_Generated 2026-10-14_ · **1189** settled signals from 2026-08-17 to 2026-10-14 · 34 open, 59 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (828 of 1189) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.64R per trade taken**, +2.53R per signal published.
- Promised **0.73R** to target 1 on average; delivered **+3.64R**.
- Trades ran **4.34R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 558 | 65% | 362 | 80% | +3.54 | +2.30 | +1282.85 |
| 55–64 | 504 | 72% | 364 | 68% | +4.74 | +3.43 | +1726.45 |
| 65–74 (High) | 113 | 81% | 91 | 65% | +0.01 | +0.01 | +1.27 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.033** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 354 | +5.42 | 835 | +1.31 | +4.10 | 77% vs 71% |
| `ftfc-aligned` | 257 | +5.04 | 932 | +1.84 | +3.19 | 68% vs 74% |
| `ftfc-opposed` | 257 | +5.04 | 932 | +1.84 | +3.19 | 68% vs 74% |
| `base` | 1189 | +2.53 | 0 | +0.00 | +2.53 | 73% vs 0% |
| `rr-poor` | 822 | +2.98 | 367 | +1.53 | +1.45 | 85% vs 37% |
| `close-location` | 632 | +2.76 | 557 | +2.28 | +0.48 | 75% vs 70% |
| `reversal-backed` | 688 | +2.65 | 501 | +2.38 | +0.27 | 78% vs 66% |
| `rr-ok` | 339 | +1.66 | 850 | +2.88 | -1.22 | 38% vs 83% |
| `rr-strong` | 28 | -0.03 | 1161 | +2.60 | -2.62 | 32% vs 74% |
| `volume` | 240 | +0.06 | 949 | +3.16 | -3.10 | 64% vs 75% |
| `ftfc-full` | 931 | +1.85 | 258 | +5.02 | -3.17 | 74% vs 68% |
| `in-force` | 578 | -0.03 | 611 | +4.96 | -4.99 | 75% vs 68% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 346 | 75% | 259 | 77% | -0.06 | -0.05 | -16.75 |
| 2-2 Continuation | 299 | 66% | 197 | 58% | +2.87 | +1.89 | +564.91 |
| 2-1-2 Reversal | 142 | 70% | 100 | 76% | -0.02 | -0.01 | -1.73 |
| 2-1-2 Continuation | 122 | 72% | 88 | 78% | +7.00 | +5.05 | +616.22 |
| Rev Strat (1-2-2) Reversal | 90 | 61% | 55 | 82% | +0.02 | +0.01 | +1.10 |
| 3-1-2 Reversal | 57 | 61% | 35 | 80% | +37.10 | +22.78 | +1298.49 |
| 3-2-2 Reversal | 54 | 59% | 32 | 81% | +16.88 | +10.00 | +540.09 |
| 3-2 Continuation | 46 | 76% | 35 | 80% | +0.16 | +0.12 | +5.59 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 736 | 66% | 485 | 72% | -0.03 | -0.02 | -14.00 |
| W | 327 | 73% | 238 | 79% | +2.41 | +1.75 | +572.60 |
| M | 126 | 83% | 105 | 66% | +23.37 | +19.47 | +2453.49 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 931 | 67% | 625 | 74% | +2.75 | +1.85 | +1717.87 |
| Mixed | 257 | 79% | 203 | 68% | +6.38 | +5.04 | +1294.22 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 500 | 69% | 347 | 66% | +3.43 | +2.38 | +1190.88 |
| Reversal | 689 | 70% | 481 | 78% | +3.79 | +2.64 | +1821.20 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 835 | 69% | 578 | 71% | +1.89 | +1.31 | +1094.95 |
| Inside-bar compression (X-1-?) | 354 | 71% | 250 | 77% | +7.67 | +5.42 | +1917.14 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 50 | 22% | 11 | 100% | +275.81 | +60.68 | +3033.94 |
| LTC-USD | 19 | 84% | 16 | 88% | +0.34 | +0.28 | +5.37 |
| TLT | 36 | 72% | 26 | 77% | +0.30 | +0.22 | +7.85 |
| AMD | 39 | 82% | 32 | 78% | +0.19 | +0.15 | +5.96 |
| ETH-USD | 25 | 76% | 19 | 84% | +0.16 | +0.12 | +3.04 |
| XLI | 37 | 68% | 25 | 92% | +0.17 | +0.11 | +4.17 |
| META | 45 | 51% | 23 | 78% | +0.15 | +0.07 | +3.35 |
| DIA | 41 | 80% | 33 | 85% | +0.08 | +0.06 | +2.59 |
| AMZN | 36 | 78% | 28 | 82% | +0.06 | +0.05 | +1.69 |
| XLU | 42 | 81% | 34 | 62% | +0.06 | +0.05 | +1.95 |
| BTC-USD | 25 | 92% | 23 | 74% | +0.04 | +0.04 | +0.96 |
| IWM | 40 | 65% | 26 | 73% | +0.05 | +0.03 | +1.23 |
| XLC | 36 | 78% | 28 | 89% | +0.02 | +0.02 | +0.69 |
| EURUSD=X | 40 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLF | 44 | 77% | 34 | 71% | +0.01 | +0.00 | +0.19 |
| GLD | 39 | 67% | 26 | 81% | -0.00 | -0.00 | -0.08 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SOL-USD | 30 | 77% | 23 | 65% | -0.02 | -0.02 | -0.52 |
| SMH | 38 | 66% | 25 | 72% | -0.04 | -0.03 | -1.07 |
| XLK | 36 | 72% | 26 | 81% | -0.04 | -0.03 | -1.06 |
| SPY | 30 | 77% | 23 | 65% | -0.05 | -0.04 | -1.18 |
| AAPL | 34 | 76% | 26 | 73% | -0.07 | -0.06 | -1.88 |
| HYPE-USD | 24 | 79% | 19 | 53% | -0.07 | -0.06 | -1.41 |
| MSFT | 30 | 83% | 25 | 76% | -0.08 | -0.07 | -1.96 |
| XLY | 29 | 86% | 25 | 80% | -0.08 | -0.07 | -1.99 |
| TSLA | 36 | 75% | 27 | 74% | -0.14 | -0.10 | -3.68 |
| DOGE-USD | 32 | 69% | 22 | 45% | -0.15 | -0.11 | -3.36 |
| QQQ | 29 | 79% | 23 | 65% | -0.18 | -0.14 | -4.10 |
| GC=F | 37 | 65% | 24 | 71% | -0.22 | -0.15 | -5.39 |
| XLV | 33 | 79% | 26 | 65% | -0.21 | -0.16 | -5.40 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| NVDA | 38 | 66% | 25 | 64% | -0.30 | -0.20 | -7.41 |
| XLP | 34 | 74% | 25 | 60% | -0.28 | -0.20 | -6.95 |
| GOOGL | 30 | 87% | 26 | 62% | -0.25 | -0.21 | -6.39 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
