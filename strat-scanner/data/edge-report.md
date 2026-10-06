# Edge Report — live signal record

_Generated 2026-10-06_ · **1021** settled signals from 2026-08-17 to 2026-10-06 · 34 open, 57 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (708 of 1021) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 5% timed out.
- **Expectancy +4.27R per trade taken**, +2.96R per signal published.
- Promised **0.75R** to target 1 on average; delivered **+4.27R**.
- Trades ran **4.97R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 478 | 64% | 305 | 80% | +4.22 | +2.69 | +1285.64 |
| 55–64 | 429 | 73% | 313 | 69% | +5.54 | +4.05 | +1735.40 |
| 65–74 (High) | 102 | 79% | 81 | 62% | -0.03 | -0.02 | -2.50 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.026** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 307 | +6.22 | 714 | +1.56 | +4.66 | 75% vs 72% |
| `ftfc-aligned` | 223 | +5.82 | 798 | +2.16 | +3.66 | 69% vs 74% |
| `ftfc-opposed` | 223 | +5.82 | 798 | +2.16 | +3.66 | 69% vs 74% |
| `base` | 1021 | +2.96 | 0 | +0.00 | +2.96 | 73% vs 0% |
| `rr-poor` | 700 | +3.50 | 321 | +1.79 | +1.71 | 84% vs 38% |
| `close-location` | 538 | +3.24 | 483 | +2.64 | +0.60 | 75% vs 70% |
| `reversal-backed` | 583 | +3.13 | 438 | +2.73 | +0.39 | 77% vs 67% |
| `rr-ok` | 298 | +1.92 | 723 | +3.39 | -1.47 | 39% vs 83% |
| `rr-strong` | 23 | +0.06 | 998 | +3.02 | -2.96 | 35% vs 74% |
| `ftfc-full` | 797 | +2.16 | 224 | +5.79 | -3.63 | 74% vs 69% |
| `volume` | 221 | +0.07 | 800 | +3.76 | -3.68 | 63% vs 75% |
| `in-force` | 494 | -0.02 | 527 | +5.75 | -5.78 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 294 | 73% | 215 | 77% | -0.05 | -0.04 | -11.56 |
| 2-2 Continuation | 259 | 65% | 169 | 59% | +3.40 | +2.22 | +574.43 |
| 2-1-2 Reversal | 114 | 69% | 79 | 71% | -0.08 | -0.06 | -6.35 |
| 2-1-2 Continuation | 110 | 76% | 84 | 77% | +7.31 | +5.58 | +613.86 |
| Rev Strat (1-2-2) Reversal | 77 | 65% | 50 | 86% | +0.08 | +0.05 | +3.77 |
| 3-1-2 Reversal | 55 | 60% | 33 | 79% | +39.34 | +23.60 | +1298.19 |
| 3-2-2 Reversal | 44 | 59% | 26 | 77% | +20.71 | +12.24 | +538.58 |
| 3-2 Continuation | 40 | 75% | 30 | 80% | +0.18 | +0.13 | +5.25 |
| 1-1-2 Continuation | 28 | 79% | 22 | 73% | +0.18 | +0.14 | +3.88 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 638 | 66% | 418 | 71% | -0.02 | -0.01 | -8.11 |
| W | 275 | 73% | 202 | 78% | +2.82 | +2.07 | +569.86 |
| M | 108 | 81% | 88 | 69% | +27.94 | +22.76 | +2458.30 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 797 | 67% | 535 | 74% | +3.22 | +2.16 | +1722.91 |
| Mixed | 223 | 78% | 173 | 69% | +7.50 | +5.82 | +1297.14 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 437 | 70% | 305 | 67% | +3.93 | +2.74 | +1197.42 |
| Reversal | 584 | 69% | 403 | 77% | +4.52 | +3.12 | +1822.63 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 714 | 69% | 490 | 72% | +2.27 | +1.56 | +1110.47 |
| Inside-bar compression (X-1-?) | 307 | 71% | 218 | 75% | +8.76 | +6.22 | +1909.58 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 44 | 25% | 11 | 100% | +275.81 | +68.95 | +3033.94 |
| LTC-USD | 17 | 82% | 14 | 93% | +0.44 | +0.36 | +6.13 |
| TLT | 32 | 72% | 23 | 78% | +0.38 | +0.27 | +8.80 |
| AMD | 32 | 84% | 27 | 81% | +0.30 | +0.26 | +8.19 |
| DIA | 35 | 80% | 28 | 89% | +0.23 | +0.18 | +6.37 |
| ETH-USD | 23 | 78% | 18 | 83% | +0.17 | +0.13 | +2.99 |
| XLI | 32 | 63% | 20 | 90% | +0.19 | +0.12 | +3.73 |
| META | 36 | 53% | 19 | 79% | +0.17 | +0.09 | +3.14 |
| IWM | 34 | 59% | 20 | 75% | +0.14 | +0.08 | +2.77 |
| XLU | 36 | 81% | 29 | 62% | +0.09 | +0.07 | +2.59 |
| AMZN | 29 | 76% | 22 | 86% | +0.09 | +0.07 | +2.04 |
| BTC-USD | 23 | 91% | 21 | 71% | +0.03 | +0.02 | +0.56 |
| XLF | 36 | 72% | 26 | 69% | +0.03 | +0.02 | +0.85 |
| EURUSD=X | 35 | 9% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLC | 30 | 77% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| XLK | 32 | 78% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| SMH | 31 | 74% | 23 | 74% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 35 | 63% | 22 | 68% | -0.04 | -0.02 | -0.78 |
| SPY | 27 | 74% | 20 | 65% | -0.08 | -0.06 | -1.53 |
| SOL-USD | 27 | 78% | 21 | 62% | -0.09 | -0.07 | -1.94 |
| MSFT | 26 | 85% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| TSLA | 32 | 75% | 24 | 75% | -0.12 | -0.09 | -2.81 |
| XLV | 25 | 72% | 18 | 67% | -0.14 | -0.10 | -2.51 |
| DOGE-USD | 26 | 69% | 18 | 39% | -0.16 | -0.11 | -2.90 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| QQQ | 26 | 85% | 22 | 68% | -0.14 | -0.12 | -3.10 |
| AAPL | 30 | 77% | 23 | 70% | -0.16 | -0.12 | -3.60 |
| XLY | 25 | 84% | 21 | 76% | -0.14 | -0.12 | -3.00 |
| GLD | 33 | 61% | 20 | 75% | -0.20 | -0.12 | -3.99 |
| NVDA | 30 | 60% | 18 | 67% | -0.30 | -0.18 | -5.35 |
| XLE | 37 | 73% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| GC=F | 30 | 67% | 20 | 65% | -0.31 | -0.21 | -6.17 |
| XLP | 26 | 77% | 20 | 60% | -0.32 | -0.25 | -6.48 |
| GOOGL | 26 | 85% | 22 | 59% | -0.31 | -0.26 | -6.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
