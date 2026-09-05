# Edge Report — live signal record

_Generated 2026-09-05_ · **408** settled signals from 2026-08-17 to 2026-09-05 · 38 open, 69 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **78%** of published signals actually triggered (317 of 408) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy -0.04R per trade taken**, -0.03R per signal published.
- Promised **0.76R** to target 1 on average; delivered **-0.04R**.
- Trades ran **0.62R** in favour at best and **0.62R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 166 | 74% | 123 | 80% | -0.08 | -0.06 | -9.43 |
| 55–64 | 182 | 79% | 144 | 72% | -0.02 | -0.01 | -2.54 |
| 65–74 (High) | 54 | 83% | 45 | 69% | +0.01 | +0.01 | +0.46 |
| 75+ (High) | 6 | 83% | 5 | 60% | -0.22 | -0.19 | -1.12 |

Spearman rank correlation between confidence and realised R: **0.120** — **weak but positive** — the ordering is real yet slight.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `ftfc-full` | 324 | +0.00 | 84 | -0.17 | +0.17 | 77% vs 65% |
| `volume` | 78 | +0.11 | 330 | -0.06 | +0.17 | 62% vs 76% |
| `rr-poor` | 291 | -0.00 | 117 | -0.10 | +0.09 | 86% vs 36% |
| `reversal-backed` | 240 | -0.01 | 168 | -0.06 | +0.04 | 79% vs 67% |
| `in-force` | 229 | -0.03 | 179 | -0.04 | +0.01 | 78% vs 65% |
| `close-location` | 230 | -0.04 | 178 | -0.02 | -0.02 | 73% vs 76% |
| `base` | 408 | -0.03 | 0 | +0.00 | -0.03 | 74% vs 0% |
| `compression` | 129 | -0.05 | 279 | -0.02 | -0.03 | 78% vs 72% |
| `rr-ok` | 109 | -0.07 | 299 | -0.01 | -0.06 | 37% vs 85% |
| `ftfc-aligned` | 83 | -0.17 | 325 | +0.00 | -0.18 | 65% vs 77% |
| `ftfc-opposed` | 83 | -0.17 | 325 | +0.00 | -0.18 | 65% vs 77% |
| `rr-strong` | 8 | -0.40 | 400 | -0.02 | -0.38 | 25% vs 75% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 116 | 82% | 95 | 78% | -0.04 | -0.03 | -3.63 |
| 2-2 Continuation | 102 | 75% | 77 | 60% | -0.05 | -0.04 | -4.13 |
| 2-1-2 Reversal | 46 | 85% | 39 | 77% | -0.05 | -0.04 | -2.02 |
| 2-1-2 Continuation | 40 | 83% | 33 | 85% | -0.09 | -0.07 | -2.99 |
| 3-1-2 Reversal | 31 | 55% | 17 | 76% | +0.03 | +0.02 | +0.57 |
| Rev Strat (1-2-2) Reversal | 31 | 71% | 22 | 86% | +0.07 | +0.05 | +1.54 |
| 3-2-2 Reversal | 17 | 76% | 13 | 85% | +0.03 | +0.02 | +0.34 |
| 3-2 Continuation | 13 | 77% | 10 | 70% | +0.02 | +0.02 | +0.22 |
| 1-1-2 Continuation | 12 | 92% | 11 | 64% | -0.23 | -0.21 | -2.51 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 268 | 74% | 199 | 73% | -0.02 | -0.02 | -4.66 |
| W | 107 | 79% | 85 | 76% | -0.10 | -0.08 | -8.25 |
| M | 33 | 100% | 33 | 76% | +0.01 | +0.01 | +0.29 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 324 | 78% | 252 | 77% | +0.01 | +0.00 | +1.61 |
| Mixed | 83 | 78% | 65 | 65% | -0.22 | -0.17 | -14.24 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 167 | 78% | 131 | 67% | -0.07 | -0.06 | -9.41 |
| Reversal | 241 | 77% | 186 | 79% | -0.02 | -0.01 | -3.21 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 279 | 78% | 217 | 72% | -0.03 | -0.02 | -5.66 |
| Inside-bar compression (X-1-?) | 129 | 78% | 100 | 78% | -0.07 | -0.05 | -6.96 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 10 | 80% | 8 | 88% | +0.49 | +0.39 | +3.89 |
| XLI | 15 | 80% | 12 | 92% | +0.32 | +0.25 | +3.82 |
| ETH-USD | 8 | 75% | 6 | 67% | +0.32 | +0.24 | +1.89 |
| AMZN | 15 | 93% | 14 | 93% | +0.24 | +0.23 | +3.43 |
| GLD | 14 | 64% | 9 | 89% | +0.27 | +0.18 | +2.47 |
| JUP-USD | 14 | 21% | 3 | 100% | +0.67 | +0.14 | +2.01 |
| BTC-USD | 10 | 90% | 9 | 67% | +0.16 | +0.14 | +1.41 |
| META | 15 | 87% | 13 | 92% | +0.15 | +0.13 | +2.01 |
| DIA | 17 | 76% | 13 | 92% | +0.13 | +0.10 | +1.67 |
| XLP | 8 | 75% | 6 | 100% | +0.09 | +0.06 | +0.52 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XRP-USD | 16 | 63% | 10 | 50% | +0.04 | +0.02 | +0.38 |
| SPY | 10 | 80% | 8 | 88% | +0.00 | +0.00 | +0.00 |
| XLC | 11 | 91% | 10 | 90% | -0.01 | -0.01 | -0.11 |
| EURUSD=X | 11 | 9% | 1 | 0% | -0.16 | -0.01 | -0.16 |
| IWM | 11 | 73% | 8 | 75% | -0.03 | -0.02 | -0.25 |
| AMD | 10 | 100% | 10 | 90% | -0.04 | -0.04 | -0.42 |
| XLY | 13 | 92% | 12 | 83% | -0.06 | -0.06 | -0.76 |
| QQQ | 10 | 90% | 9 | 89% | -0.07 | -0.06 | -0.59 |
| TSLA | 12 | 75% | 9 | 78% | -0.09 | -0.07 | -0.84 |
| DOGE-USD | 12 | 75% | 9 | 33% | -0.10 | -0.07 | -0.87 |
| XLK | 13 | 92% | 12 | 83% | -0.08 | -0.08 | -1.02 |
| XLF | 16 | 88% | 14 | 71% | -0.14 | -0.12 | -1.99 |
| HYPE-USD | 7 | 86% | 6 | 17% | -0.16 | -0.14 | -0.96 |
| XLU | 12 | 92% | 11 | 73% | -0.15 | -0.14 | -1.68 |
| SMH | 14 | 100% | 14 | 71% | -0.16 | -0.16 | -2.22 |
| XLE | 14 | 86% | 12 | 58% | -0.20 | -0.17 | -2.41 |
| GOOGL | 11 | 100% | 11 | 64% | -0.18 | -0.18 | -1.98 |
| MSFT | 10 | 90% | 9 | 67% | -0.24 | -0.22 | -2.18 |
| NVDA | 16 | 69% | 11 | 73% | -0.35 | -0.24 | -3.90 |
| SOL-USD | 13 | 69% | 9 | 44% | -0.37 | -0.26 | -3.35 |
| AAPL | 12 | 83% | 10 | 60% | -0.37 | -0.31 | -3.67 |
| TLT | 10 | 70% | 7 | 57% | -0.44 | -0.31 | -3.09 |
| GC=F | 13 | 62% | 8 | 63% | -0.50 | -0.31 | -4.02 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
