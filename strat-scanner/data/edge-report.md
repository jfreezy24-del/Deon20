# Edge Report — live signal record

_Generated 2026-09-03_ · **338** settled signals from 2026-08-17 to 2026-09-03 · 34 open, 82 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **76%** of published signals actually triggered (257 of 338) — the rest expired unfilled.
- Of those trades, **76%** reached target 1, 19% stopped out, 5% timed out.
- **Expectancy +0.00R per trade taken**, +0.00R per signal published.
- Promised **0.77R** to target 1 on average; delivered **+0.00R**.
- Trades ran **0.64R** in favour at best and **0.59R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 134 | 73% | 98 | 82% | -0.03 | -0.03 | -3.42 |
| 55–64 | 153 | 77% | 118 | 72% | -0.01 | -0.01 | -1.10 |
| 65–74 (High) | 46 | 80% | 37 | 76% | +0.11 | +0.09 | +4.17 |
| 75+ (High) | 5 | 80% | 4 | 75% | +0.10 | +0.08 | +0.40 |

Spearman rank correlation between confidence and realised R: **0.167** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `ftfc-full` | 268 | +0.04 | 70 | -0.16 | +0.20 | 79% vs 65% |
| `volume` | 64 | +0.15 | 274 | -0.03 | +0.19 | 63% vs 79% |
| `rr-poor` | 243 | +0.01 | 95 | -0.02 | +0.02 | 87% vs 39% |
| `close-location` | 194 | +0.01 | 144 | -0.01 | +0.02 | 76% vs 76% |
| `base` | 338 | +0.00 | 0 | +0.00 | +0.00 | 76% vs 0% |
| `rr-ok` | 89 | -0.00 | 249 | +0.00 | -0.01 | 38% vs 87% |
| `compression` | 109 | -0.01 | 229 | +0.00 | -0.01 | 82% vs 74% |
| `reversal-backed` | 201 | -0.01 | 137 | +0.01 | -0.02 | 80% vs 71% |
| `in-force` | 185 | -0.01 | 153 | +0.01 | -0.02 | 79% vs 68% |
| `ftfc-aligned` | 70 | -0.16 | 268 | +0.04 | -0.20 | 65% vs 79% |
| `ftfc-opposed` | 70 | -0.16 | 268 | +0.04 | -0.20 | 65% vs 79% |
| `rr-strong` | 6 | -0.20 | 332 | +0.00 | -0.21 | 50% vs 76% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 91 | 82% | 75 | 77% | -0.07 | -0.05 | -4.95 |
| 2-2 Continuation | 85 | 73% | 62 | 63% | +0.04 | +0.03 | +2.43 |
| 2-1-2 Reversal | 39 | 85% | 33 | 79% | -0.00 | -0.00 | -0.01 |
| 2-1-2 Continuation | 33 | 79% | 26 | 92% | -0.03 | -0.02 | -0.71 |
| 3-1-2 Reversal | 30 | 57% | 17 | 76% | +0.03 | +0.02 | +0.57 |
| Rev Strat (1-2-2) Reversal | 26 | 69% | 18 | 89% | +0.12 | +0.08 | +2.18 |
| 3-2-2 Reversal | 15 | 73% | 11 | 91% | +0.09 | +0.07 | +1.02 |
| 3-2 Continuation | 12 | 75% | 9 | 67% | +0.02 | +0.02 | +0.22 |
| 1-1-2 Continuation | 7 | 86% | 6 | 67% | -0.12 | -0.10 | -0.70 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 227 | 73% | 166 | 73% | -0.01 | -0.00 | -0.99 |
| W | 93 | 78% | 73 | 81% | -0.03 | -0.02 | -2.09 |
| M | 18 | 100% | 18 | 83% | +0.17 | +0.17 | +3.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 268 | 75% | 202 | 79% | +0.06 | +0.04 | +11.18 |
| Mixed | 70 | 79% | 55 | 65% | -0.20 | -0.16 | -11.13 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 137 | 75% | 103 | 71% | +0.01 | +0.01 | +1.25 |
| Reversal | 201 | 77% | 154 | 80% | -0.01 | -0.01 | -1.20 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 229 | 76% | 175 | 74% | +0.01 | +0.00 | +0.90 |
| Inside-bar compression (X-1-?) | 109 | 75% | 82 | 82% | -0.01 | -0.01 | -0.85 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 9 | 78% | 7 | 86% | +0.47 | +0.37 | +3.30 |
| XLI | 12 | 75% | 9 | 100% | +0.41 | +0.31 | +3.70 |
| GLD | 12 | 58% | 7 | 100% | +0.50 | +0.29 | +3.51 |
| BTC-USD | 9 | 89% | 8 | 75% | +0.30 | +0.27 | +2.41 |
| ETH-USD | 8 | 75% | 6 | 67% | +0.32 | +0.24 | +1.89 |
| DIA | 14 | 71% | 10 | 100% | +0.24 | +0.17 | +2.43 |
| JUP-USD | 12 | 25% | 3 | 100% | +0.67 | +0.17 | +2.01 |
| TSLA | 7 | 71% | 5 | 100% | +0.21 | +0.15 | +1.06 |
| META | 14 | 86% | 12 | 92% | +0.17 | +0.14 | +2.01 |
| XRP-USD | 15 | 60% | 9 | 56% | +0.15 | +0.09 | +1.38 |
| QQQ | 8 | 88% | 7 | 100% | +0.10 | +0.08 | +0.68 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| AMD | 7 | 100% | 7 | 100% | +0.06 | +0.06 | +0.44 |
| AMZN | 12 | 92% | 11 | 91% | +0.06 | +0.06 | +0.69 |
| XLY | 11 | 91% | 10 | 90% | +0.05 | +0.04 | +0.47 |
| SMH | 8 | 100% | 8 | 88% | +0.02 | +0.02 | +0.15 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| SPY | 9 | 78% | 7 | 86% | +0.00 | +0.00 | +0.00 |
| EURUSD=X | 9 | 11% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| XLE | 12 | 83% | 10 | 70% | -0.04 | -0.03 | -0.41 |
| XLC | 8 | 100% | 8 | 88% | -0.04 | -0.04 | -0.29 |
| XLK | 9 | 89% | 8 | 88% | -0.06 | -0.06 | -0.52 |
| MSFT | 7 | 86% | 6 | 67% | -0.07 | -0.06 | -0.45 |
| DOGE-USD | 12 | 75% | 9 | 33% | -0.10 | -0.07 | -0.87 |
| XLF | 14 | 86% | 12 | 75% | -0.12 | -0.10 | -1.45 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| XLU | 11 | 91% | 10 | 70% | -0.19 | -0.18 | -1.94 |
| GOOGL | 8 | 100% | 8 | 63% | -0.19 | -0.19 | -1.53 |
| SOL-USD | 12 | 67% | 8 | 50% | -0.29 | -0.20 | -2.35 |
| AAPL | 9 | 89% | 8 | 63% | -0.34 | -0.31 | -2.76 |
| NVDA | 14 | 64% | 9 | 67% | -0.50 | -0.32 | -4.50 |
| GC=F | 12 | 58% | 7 | 57% | -0.58 | -0.34 | -4.04 |
| TLT | 9 | 78% | 7 | 57% | -0.44 | -0.34 | -3.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
