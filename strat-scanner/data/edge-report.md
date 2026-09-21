# Edge Report — live signal record

_Generated 2026-09-21_ · **720** settled signals from 2026-08-17 to 2026-09-21 · 40 open, 18 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (494 of 720) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy -0.05R per trade taken**, -0.03R per signal published.
- Promised **0.78R** to target 1 on average; delivered **-0.05R**.
- Trades ran **0.63R** in favour at best and **0.64R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 322 | 64% | 206 | 79% | -0.07 | -0.05 | -14.69 |
| 55–64 | 300 | 70% | 211 | 70% | -0.03 | -0.02 | -5.55 |
| 65–74 (High) | 86 | 79% | 68 | 62% | -0.09 | -0.07 | -6.30 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.016** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 144 | +0.06 | 576 | -0.06 | +0.11 | 67% vs 74% |
| `rr-strong` | 17 | +0.05 | 703 | -0.04 | +0.09 | 42% vs 74% |
| `close-location` | 391 | -0.00 | 329 | -0.07 | +0.07 | 75% vs 69% |
| `rr-poor` | 499 | -0.02 | 221 | -0.08 | +0.06 | 84% vs 37% |
| `reversal-backed` | 422 | -0.02 | 298 | -0.05 | +0.03 | 78% vs 65% |
| `ftfc-aligned` | 146 | -0.03 | 574 | -0.04 | +0.01 | 71% vs 73% |
| `ftfc-opposed` | 146 | -0.03 | 574 | -0.04 | +0.01 | 71% vs 73% |
| `ftfc-full` | 573 | -0.04 | 147 | -0.03 | -0.01 | 73% vs 71% |
| `compression` | 232 | -0.04 | 488 | -0.03 | -0.01 | 75% vs 72% |
| `in-force` | 338 | -0.05 | 382 | -0.02 | -0.03 | 76% vs 66% |
| `base` | 720 | -0.03 | 0 | +0.00 | -0.03 | 73% vs 0% |
| `rr-ok` | 204 | -0.09 | 516 | -0.01 | -0.08 | 36% vs 83% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 201 | 72% | 145 | 77% | -0.07 | -0.05 | -10.51 |
| 2-2 Continuation | 179 | 62% | 111 | 60% | -0.07 | -0.04 | -7.50 |
| 2-1-2 Reversal | 89 | 74% | 66 | 77% | -0.00 | -0.00 | -0.27 |
| 2-1-2 Continuation | 76 | 75% | 57 | 72% | -0.22 | -0.16 | -12.29 |
| Rev Strat (1-2-2) Reversal | 56 | 64% | 36 | 81% | +0.05 | +0.03 | +1.66 |
| 3-1-2 Reversal | 45 | 60% | 27 | 78% | -0.03 | -0.02 | -0.84 |
| 3-2-2 Reversal | 32 | 66% | 21 | 81% | +0.06 | +0.04 | +1.28 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |
| 3-2 Continuation | 20 | 60% | 12 | 75% | +0.02 | +0.01 | +0.23 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 443 | 65% | 290 | 73% | -0.04 | -0.03 | -11.66 |
| W | 194 | 72% | 139 | 76% | -0.07 | -0.05 | -9.26 |
| M | 83 | 78% | 65 | 65% | -0.06 | -0.05 | -4.11 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 573 | 66% | 377 | 73% | -0.06 | -0.04 | -20.85 |
| Mixed | 146 | 80% | 117 | 71% | -0.04 | -0.03 | -4.18 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 297 | 67% | 199 | 65% | -0.08 | -0.06 | -16.36 |
| Reversal | 423 | 70% | 295 | 78% | -0.03 | -0.02 | -8.68 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 488 | 67% | 325 | 72% | -0.05 | -0.03 | -14.83 |
| Inside-bar compression (X-1-?) | 232 | 73% | 169 | 75% | -0.06 | -0.04 | -10.20 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 13 | 85% | 11 | 91% | +0.42 | +0.36 | +4.62 |
| AMD | 20 | 95% | 19 | 84% | +0.37 | +0.35 | +6.94 |
| DIA | 29 | 76% | 22 | 91% | +0.22 | +0.17 | +4.83 |
| ETH-USD | 17 | 82% | 14 | 79% | +0.17 | +0.14 | +2.37 |
| XLI | 26 | 62% | 16 | 88% | +0.21 | +0.13 | +3.32 |
| AMZN | 21 | 76% | 16 | 88% | +0.16 | +0.12 | +2.56 |
| JUP-USD | 27 | 15% | 4 | 100% | +0.50 | +0.07 | +2.01 |
| META | 24 | 63% | 15 | 87% | +0.09 | +0.05 | +1.29 |
| BTC-USD | 16 | 94% | 15 | 67% | +0.04 | +0.03 | +0.54 |
| GLD | 24 | 54% | 13 | 85% | +0.06 | +0.03 | +0.81 |
| XRP-USD | 26 | 58% | 15 | 67% | +0.05 | +0.03 | +0.75 |
| EURUSD=X | 23 | 13% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLP | 17 | 76% | 13 | 85% | -0.00 | -0.00 | -0.02 |
| IWM | 25 | 56% | 14 | 71% | -0.03 | -0.01 | -0.37 |
| XLC | 20 | 85% | 17 | 82% | -0.04 | -0.03 | -0.60 |
| XLY | 16 | 81% | 13 | 85% | -0.05 | -0.04 | -0.63 |
| XLU | 23 | 87% | 20 | 70% | -0.05 | -0.04 | -0.91 |
| XLV | 19 | 68% | 13 | 69% | -0.07 | -0.05 | -0.94 |
| TSLA | 20 | 65% | 13 | 77% | -0.10 | -0.07 | -1.32 |
| MSFT | 18 | 89% | 16 | 75% | -0.08 | -0.07 | -1.30 |
| XLF | 27 | 70% | 19 | 68% | -0.12 | -0.09 | -2.34 |
| NVDA | 24 | 58% | 14 | 79% | -0.16 | -0.09 | -2.19 |
| SMH | 22 | 77% | 17 | 71% | -0.12 | -0.09 | -2.01 |
| HYPE-USD | 17 | 76% | 13 | 46% | -0.16 | -0.12 | -2.06 |
| SOL-USD | 20 | 70% | 14 | 64% | -0.17 | -0.12 | -2.44 |
| TLT | 21 | 57% | 12 | 67% | -0.22 | -0.13 | -2.68 |
| XLK | 22 | 86% | 19 | 79% | -0.16 | -0.14 | -3.04 |
| SPY | 19 | 63% | 12 | 67% | -0.25 | -0.16 | -2.98 |
| GOOGL | 17 | 94% | 16 | 63% | -0.18 | -0.17 | -2.87 |
| AAPL | 21 | 76% | 16 | 69% | -0.24 | -0.18 | -3.88 |
| DOGE-USD | 20 | 70% | 14 | 36% | -0.27 | -0.19 | -3.76 |
| QQQ | 17 | 82% | 14 | 64% | -0.34 | -0.28 | -4.75 |
| XLE | 26 | 69% | 18 | 50% | -0.42 | -0.29 | -7.52 |
| GC=F | 23 | 61% | 14 | 57% | -0.50 | -0.30 | -6.96 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
