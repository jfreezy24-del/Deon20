# Edge Report — live signal record

_Generated 2026-09-20_ · **701** settled signals from 2026-08-17 to 2026-09-19 · 37 open, 28 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (489 of 701) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 25% stopped out, 3% timed out.
- **Expectancy -0.05R per trade taken**, -0.04R per signal published.
- Promised **0.79R** to target 1 on average; delivered **-0.05R**.
- Trades ran **0.63R** in favour at best and **0.65R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 312 | 65% | 202 | 79% | -0.08 | -0.05 | -15.32 |
| 55–64 | 291 | 72% | 210 | 70% | -0.03 | -0.02 | -5.55 |
| 65–74 (High) | 86 | 79% | 68 | 62% | -0.09 | -0.07 | -6.30 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.022** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 138 | +0.06 | 563 | -0.06 | +0.12 | 67% vs 74% |
| `rr-strong` | 17 | +0.05 | 684 | -0.04 | +0.09 | 42% vs 73% |
| `close-location` | 375 | -0.01 | 326 | -0.07 | +0.07 | 75% vs 69% |
| `rr-poor` | 485 | -0.02 | 216 | -0.08 | +0.06 | 84% vs 37% |
| `reversal-backed` | 413 | -0.02 | 288 | -0.06 | +0.03 | 78% vs 65% |
| `ftfc-aligned` | 143 | -0.03 | 558 | -0.04 | +0.00 | 70% vs 73% |
| `ftfc-opposed` | 143 | -0.03 | 558 | -0.04 | +0.00 | 70% vs 73% |
| `ftfc-full` | 557 | -0.04 | 144 | -0.03 | -0.00 | 73% vs 70% |
| `compression` | 230 | -0.04 | 471 | -0.03 | -0.01 | 75% vs 72% |
| `in-force` | 333 | -0.05 | 368 | -0.02 | -0.03 | 76% vs 66% |
| `base` | 701 | -0.04 | 0 | +0.00 | -0.04 | 73% vs 0% |
| `rr-ok` | 199 | -0.09 | 502 | -0.01 | -0.08 | 36% vs 82% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 194 | 73% | 141 | 77% | -0.08 | -0.06 | -11.12 |
| 2-2 Continuation | 171 | 65% | 111 | 60% | -0.07 | -0.04 | -7.50 |
| 2-1-2 Reversal | 89 | 74% | 66 | 77% | -0.00 | -0.00 | -0.27 |
| 2-1-2 Continuation | 75 | 76% | 57 | 72% | -0.22 | -0.16 | -12.29 |
| Rev Strat (1-2-2) Reversal | 55 | 65% | 36 | 81% | +0.05 | +0.03 | +1.66 |
| 3-1-2 Reversal | 44 | 61% | 27 | 78% | -0.03 | -0.02 | -0.84 |
| 3-2-2 Reversal | 32 | 66% | 21 | 81% | +0.06 | +0.04 | +1.28 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |
| 3-2 Continuation | 19 | 58% | 11 | 73% | +0.02 | +0.01 | +0.22 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 427 | 67% | 286 | 73% | -0.04 | -0.03 | -12.27 |
| W | 193 | 72% | 139 | 76% | -0.07 | -0.05 | -9.26 |
| M | 81 | 79% | 64 | 64% | -0.06 | -0.05 | -4.12 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 557 | 67% | 375 | 73% | -0.06 | -0.04 | -20.86 |
| Mixed | 143 | 80% | 114 | 70% | -0.04 | -0.03 | -4.79 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 287 | 69% | 198 | 65% | -0.08 | -0.06 | -16.37 |
| Reversal | 414 | 70% | 291 | 78% | -0.03 | -0.02 | -9.29 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 471 | 68% | 320 | 72% | -0.05 | -0.03 | -15.45 |
| Inside-bar compression (X-1-?) | 230 | 73% | 169 | 75% | -0.06 | -0.04 | -10.20 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AMD | 19 | 100% | 19 | 84% | +0.37 | +0.37 | +6.94 |
| LTC-USD | 13 | 85% | 11 | 91% | +0.42 | +0.36 | +4.62 |
| DIA | 29 | 76% | 22 | 91% | +0.22 | +0.17 | +4.83 |
| ETH-USD | 16 | 81% | 13 | 77% | +0.17 | +0.14 | +2.17 |
| XLI | 25 | 64% | 16 | 88% | +0.21 | +0.13 | +3.32 |
| AMZN | 21 | 76% | 16 | 88% | +0.16 | +0.12 | +2.56 |
| JUP-USD | 27 | 15% | 4 | 100% | +0.50 | +0.07 | +2.01 |
| META | 24 | 63% | 15 | 87% | +0.09 | +0.05 | +1.29 |
| GLD | 24 | 54% | 13 | 85% | +0.06 | +0.03 | +0.81 |
| XRP-USD | 25 | 56% | 14 | 64% | +0.05 | +0.03 | +0.75 |
| EURUSD=X | 23 | 13% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| BTC-USD | 15 | 93% | 14 | 64% | +0.01 | +0.01 | +0.21 |
| XLP | 16 | 81% | 13 | 85% | -0.00 | -0.00 | -0.02 |
| IWM | 25 | 56% | 14 | 71% | -0.03 | -0.01 | -0.37 |
| XLC | 19 | 89% | 17 | 82% | -0.04 | -0.03 | -0.60 |
| XLY | 16 | 81% | 13 | 85% | -0.05 | -0.04 | -0.63 |
| XLU | 22 | 91% | 20 | 70% | -0.05 | -0.04 | -0.91 |
| XLV | 18 | 72% | 13 | 69% | -0.07 | -0.05 | -0.94 |
| TSLA | 20 | 65% | 13 | 77% | -0.10 | -0.07 | -1.32 |
| MSFT | 17 | 94% | 16 | 75% | -0.08 | -0.08 | -1.30 |
| XLF | 26 | 73% | 19 | 68% | -0.12 | -0.09 | -2.34 |
| NVDA | 23 | 61% | 14 | 79% | -0.16 | -0.10 | -2.19 |
| SMH | 21 | 81% | 17 | 71% | -0.12 | -0.10 | -2.01 |
| HYPE-USD | 17 | 76% | 13 | 46% | -0.16 | -0.12 | -2.06 |
| TLT | 21 | 57% | 12 | 67% | -0.22 | -0.13 | -2.68 |
| SOL-USD | 19 | 68% | 13 | 62% | -0.19 | -0.13 | -2.45 |
| XLK | 21 | 90% | 19 | 79% | -0.16 | -0.14 | -3.04 |
| SPY | 18 | 67% | 12 | 67% | -0.25 | -0.17 | -2.98 |
| GOOGL | 17 | 94% | 16 | 63% | -0.18 | -0.17 | -2.87 |
| AAPL | 21 | 76% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| DOGE-USD | 18 | 72% | 13 | 31% | -0.30 | -0.21 | -3.84 |
| XLE | 26 | 69% | 18 | 50% | -0.42 | -0.29 | -7.52 |
| QQQ | 16 | 88% | 14 | 64% | -0.34 | -0.30 | -4.75 |
| GC=F | 23 | 61% | 14 | 57% | -0.50 | -0.30 | -6.96 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
