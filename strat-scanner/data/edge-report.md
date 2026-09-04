# Edge Report — live signal record

_Generated 2026-09-04_ · **377** settled signals from 2026-08-17 to 2026-09-04 · 41 open, 68 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (292 of 377) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.04R per trade taken**, -0.03R per signal published.
- Promised **0.76R** to target 1 on average; delivered **-0.04R**.
- Trades ran **0.63R** in favour at best and **0.62R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 152 | 74% | 113 | 79% | -0.09 | -0.06 | -9.87 |
| 55–64 | 167 | 78% | 131 | 72% | -0.02 | -0.02 | -2.71 |
| 65–74 (High) | 52 | 83% | 43 | 70% | +0.02 | +0.01 | +0.68 |
| 75+ (High) | 6 | 83% | 5 | 60% | -0.22 | -0.19 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.135** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 69 | +0.13 | 308 | -0.07 | +0.20 | 61% vs 76% |
| `ftfc-full` | 301 | +0.00 | 76 | -0.18 | +0.18 | 76% vs 65% |
| `rr-poor` | 272 | -0.01 | 105 | -0.09 | +0.07 | 85% vs 35% |
| `reversal-backed` | 223 | -0.03 | 154 | -0.05 | +0.02 | 78% vs 68% |
| `in-force` | 209 | -0.03 | 168 | -0.04 | +0.01 | 78% vs 64% |
| `close-location` | 215 | -0.03 | 162 | -0.04 | +0.00 | 74% vs 74% |
| `base` | 377 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `rr-ok` | 97 | -0.06 | 280 | -0.03 | -0.04 | 36% vs 84% |
| `compression` | 123 | -0.06 | 254 | -0.02 | -0.04 | 78% vs 72% |
| `ftfc-aligned` | 75 | -0.18 | 302 | +0.00 | -0.18 | 65% vs 76% |
| `ftfc-opposed` | 75 | -0.18 | 302 | +0.00 | -0.18 | 65% vs 76% |
| `rr-strong` | 8 | -0.40 | 369 | -0.03 | -0.38 | 25% vs 75% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 104 | 82% | 85 | 76% | -0.07 | -0.05 | -5.70 |
| 2-2 Continuation | 92 | 75% | 69 | 61% | -0.03 | -0.02 | -1.75 |
| 2-1-2 Reversal | 43 | 86% | 37 | 76% | -0.06 | -0.05 | -2.34 |
| 2-1-2 Continuation | 38 | 82% | 31 | 84% | -0.13 | -0.11 | -4.05 |
| 3-1-2 Reversal | 31 | 55% | 17 | 76% | +0.03 | +0.02 | +0.57 |
| Rev Strat (1-2-2) Reversal | 30 | 73% | 22 | 86% | +0.07 | +0.05 | +1.54 |
| 3-2-2 Reversal | 16 | 75% | 12 | 83% | +0.00 | +0.00 | +0.02 |
| 3-2 Continuation | 12 | 75% | 9 | 67% | +0.02 | +0.02 | +0.22 |
| 1-1-2 Continuation | 11 | 91% | 10 | 70% | -0.15 | -0.14 | -1.51 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 246 | 74% | 182 | 72% | -0.04 | -0.03 | -6.67 |
| W | 101 | 79% | 80 | 76% | -0.10 | -0.08 | -8.17 |
| M | 30 | 100% | 30 | 80% | +0.06 | +0.06 | +1.83 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 301 | 77% | 232 | 76% | +0.00 | +0.00 | +0.43 |
| Mixed | 75 | 80% | 60 | 65% | -0.22 | -0.18 | -13.45 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 153 | 78% | 119 | 68% | -0.06 | -0.05 | -7.09 |
| Reversal | 224 | 77% | 173 | 78% | -0.03 | -0.03 | -5.92 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 254 | 78% | 197 | 72% | -0.03 | -0.02 | -5.68 |
| Inside-bar compression (X-1-?) | 123 | 77% | 95 | 78% | -0.08 | -0.06 | -7.34 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 9 | 78% | 7 | 86% | +0.47 | +0.37 | +3.30 |
| XLI | 12 | 75% | 9 | 100% | +0.41 | +0.31 | +3.70 |
| GLD | 13 | 62% | 8 | 100% | +0.44 | +0.27 | +3.51 |
| ETH-USD | 8 | 75% | 6 | 67% | +0.32 | +0.24 | +1.89 |
| JUP-USD | 13 | 23% | 3 | 100% | +0.67 | +0.15 | +2.01 |
| BTC-USD | 10 | 90% | 9 | 67% | +0.16 | +0.14 | +1.41 |
| META | 15 | 87% | 13 | 92% | +0.15 | +0.13 | +2.01 |
| DIA | 17 | 76% | 13 | 92% | +0.13 | +0.10 | +1.67 |
| AMZN | 13 | 92% | 12 | 92% | +0.10 | +0.10 | +1.26 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XRP-USD | 16 | 63% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| SPY | 10 | 80% | 8 | 88% | +0.00 | +0.00 | +0.00 |
| EURUSD=X | 11 | 9% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| IWM | 10 | 80% | 8 | 75% | -0.03 | -0.02 | -0.25 |
| XLC | 9 | 100% | 9 | 89% | -0.03 | -0.03 | -0.24 |
| TSLA | 9 | 78% | 7 | 86% | -0.04 | -0.03 | -0.26 |
| XLE | 12 | 83% | 10 | 70% | -0.04 | -0.03 | -0.41 |
| AMD | 9 | 100% | 9 | 89% | -0.05 | -0.05 | -0.42 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| QQQ | 10 | 90% | 9 | 89% | -0.07 | -0.06 | -0.59 |
| DOGE-USD | 12 | 75% | 9 | 33% | -0.10 | -0.07 | -0.87 |
| XLK | 11 | 91% | 10 | 80% | -0.10 | -0.09 | -1.02 |
| XLF | 16 | 88% | 14 | 71% | -0.14 | -0.12 | -1.99 |
| XLU | 12 | 92% | 11 | 73% | -0.15 | -0.14 | -1.68 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| GOOGL | 10 | 100% | 10 | 60% | -0.23 | -0.23 | -2.30 |
| MSFT | 9 | 89% | 8 | 63% | -0.28 | -0.25 | -2.26 |
| SOL-USD | 13 | 69% | 9 | 44% | -0.37 | -0.26 | -3.35 |
| SMH | 11 | 100% | 11 | 64% | -0.26 | -0.26 | -2.85 |
| AAPL | 10 | 80% | 8 | 63% | -0.34 | -0.28 | -2.76 |
| NVDA | 15 | 67% | 10 | 70% | -0.44 | -0.29 | -4.36 |
| GC=F | 13 | 62% | 8 | 63% | -0.50 | -0.31 | -4.02 |
| TLT | 9 | 78% | 7 | 57% | -0.44 | -0.34 | -3.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
