# Edge Report — live signal record

_Generated 2026-10-02_ · **951** settled signals from 2026-08-17 to 2026-10-02 · 28 open, 42 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (670 of 951) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.50R per trade taken**, +3.17R per signal published.
- Promised **0.75R** to target 1 on average; delivered **+4.50R**.
- Trades ran **5.21R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 443 | 65% | 289 | 80% | +4.45 | +2.90 | +1284.94 |
| 55–64 | 398 | 74% | 295 | 68% | +5.88 | +4.36 | +1734.40 |
| 65–74 (High) | 98 | 79% | 77 | 62% | -0.03 | -0.03 | -2.62 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.022** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 283 | +6.73 | 668 | +1.67 | +5.07 | 74% vs 72% |
| `ftfc-aligned` | 203 | +6.39 | 748 | +2.30 | +4.09 | 69% vs 74% |
| `ftfc-opposed` | 203 | +6.39 | 748 | +2.30 | +4.09 | 69% vs 74% |
| `base` | 951 | +3.17 | 0 | +0.00 | +3.17 | 73% vs 0% |
| `rr-poor` | 652 | +3.75 | 299 | +1.92 | +1.83 | 84% vs 39% |
| `close-location` | 506 | +3.45 | 445 | +2.86 | +0.58 | 75% vs 70% |
| `reversal-backed` | 541 | +3.37 | 410 | +2.91 | +0.46 | 78% vs 66% |
| `rr-ok` | 279 | +2.05 | 672 | +3.64 | -1.60 | 38% vs 83% |
| `rr-strong` | 20 | +0.13 | 931 | +3.24 | -3.11 | 40% vs 73% |
| `volume` | 204 | +0.07 | 747 | +4.02 | -3.95 | 63% vs 75% |
| `ftfc-full` | 747 | +2.30 | 204 | +6.36 | -4.05 | 74% vs 69% |
| `in-force` | 465 | -0.02 | 486 | +6.23 | -6.26 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 271 | 75% | 203 | 78% | -0.05 | -0.04 | -10.38 |
| 2-2 Continuation | 248 | 66% | 163 | 58% | +3.51 | +2.31 | +572.85 |
| 2-1-2 Reversal | 108 | 72% | 78 | 72% | -0.07 | -0.05 | -5.13 |
| 2-1-2 Continuation | 101 | 76% | 77 | 75% | +7.95 | +6.06 | +612.08 |
| Rev Strat (1-2-2) Reversal | 76 | 66% | 50 | 86% | +0.08 | +0.05 | +3.77 |
| 3-1-2 Reversal | 49 | 59% | 29 | 76% | +44.67 | +26.43 | +1295.30 |
| 3-2-2 Reversal | 38 | 63% | 24 | 79% | +22.48 | +14.20 | +539.58 |
| 3-2 Continuation | 35 | 71% | 25 | 88% | +0.27 | +0.19 | +6.78 |
| 1-1-2 Continuation | 25 | 84% | 21 | 71% | +0.16 | +0.14 | +3.39 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 596 | 67% | 398 | 71% | -0.02 | -0.01 | -8.27 |
| W | 255 | 75% | 191 | 77% | +2.98 | +2.23 | +568.28 |
| M | 100 | 81% | 81 | 69% | +30.35 | +24.58 | +2458.22 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 747 | 68% | 508 | 74% | +3.39 | +2.30 | +1721.02 |
| Mixed | 203 | 80% | 162 | 69% | +8.01 | +6.39 | +1297.21 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 409 | 70% | 286 | 66% | +4.18 | +2.92 | +1195.10 |
| Reversal | 542 | 71% | 384 | 78% | +4.75 | +3.36 | +1823.13 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 668 | 70% | 465 | 72% | +2.39 | +1.67 | +1112.60 |
| Inside-bar compression (X-1-?) | 283 | 72% | 205 | 74% | +9.30 | +6.73 | +1905.63 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 39 | 21% | 8 | 100% | +378.99 | +77.74 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| TLT | 31 | 71% | 22 | 77% | +0.38 | +0.27 | +8.45 |
| AMD | 31 | 84% | 26 | 81% | +0.31 | +0.26 | +8.11 |
| DIA | 34 | 79% | 27 | 89% | +0.23 | +0.19 | +6.33 |
| ETH-USD | 21 | 81% | 17 | 82% | +0.16 | +0.13 | +2.67 |
| XLI | 32 | 63% | 20 | 90% | +0.19 | +0.12 | +3.73 |
| META | 33 | 58% | 19 | 79% | +0.17 | +0.10 | +3.14 |
| IWM | 33 | 61% | 20 | 75% | +0.14 | +0.08 | +2.77 |
| XLU | 35 | 83% | 29 | 62% | +0.09 | +0.07 | +2.59 |
| AMZN | 27 | 78% | 21 | 86% | +0.09 | +0.07 | +1.93 |
| XLF | 34 | 76% | 26 | 69% | +0.03 | +0.03 | +0.85 |
| BTC-USD | 22 | 91% | 20 | 70% | +0.02 | +0.02 | +0.36 |
| EURUSD=X | 30 | 10% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLC | 29 | 79% | 23 | 87% | +0.01 | +0.01 | +0.20 |
| SMH | 28 | 79% | 22 | 73% | -0.01 | -0.01 | -0.23 |
| XRP-USD | 34 | 62% | 21 | 67% | -0.04 | -0.02 | -0.78 |
| XLY | 22 | 82% | 18 | 83% | -0.05 | -0.04 | -0.84 |
| SPY | 26 | 73% | 19 | 63% | -0.09 | -0.06 | -1.63 |
| MSFT | 25 | 88% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| GLD | 30 | 60% | 18 | 83% | -0.14 | -0.08 | -2.47 |
| XLK | 27 | 81% | 22 | 82% | -0.11 | -0.09 | -2.40 |
| TSLA | 29 | 76% | 22 | 73% | -0.13 | -0.10 | -2.84 |
| NVDA | 26 | 62% | 16 | 75% | -0.17 | -0.11 | -2.75 |
| XLV | 24 | 71% | 17 | 65% | -0.16 | -0.11 | -2.65 |
| QQQ | 25 | 84% | 21 | 67% | -0.15 | -0.12 | -3.10 |
| AAPL | 28 | 79% | 22 | 68% | -0.18 | -0.14 | -3.90 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| XLP | 23 | 74% | 17 | 71% | -0.20 | -0.15 | -3.48 |
| DOGE-USD | 25 | 68% | 17 | 35% | -0.27 | -0.18 | -4.53 |
| GC=F | 28 | 68% | 19 | 63% | -0.35 | -0.24 | -6.66 |
| XLE | 33 | 73% | 24 | 58% | -0.33 | -0.24 | -7.86 |
| GOOGL | 25 | 88% | 22 | 59% | -0.31 | -0.27 | -6.72 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
