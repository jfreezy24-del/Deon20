# Edge Report — live signal record

_Generated 2026-10-01_ · **918** settled signals from 2026-08-17 to 2026-10-01 · 27 open, 42 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (646 of 918) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +4.67R per trade taken**, +3.29R per signal published.
- Promised **0.76R** to target 1 on average; delivered **+4.67R**.
- Trades ran **5.38R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 423 | 65% | 276 | 80% | +4.65 | +3.03 | +1282.41 |
| 55–64 | 386 | 74% | 285 | 68% | +6.09 | +4.50 | +1735.60 |
| 65–74 (High) | 97 | 78% | 76 | 62% | -0.04 | -0.03 | -2.72 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.034** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 272 | +7.02 | 646 | +1.72 | +5.30 | 74% vs 72% |
| `ftfc-aligned` | 193 | +6.71 | 725 | +2.37 | +4.33 | 68% vs 74% |
| `ftfc-opposed` | 193 | +6.71 | 725 | +2.37 | +4.33 | 68% vs 74% |
| `base` | 918 | +3.29 | 0 | +0.00 | +3.29 | 73% vs 0% |
| `rr-poor` | 626 | +3.91 | 292 | +1.94 | +1.97 | 84% vs 38% |
| `close-location` | 491 | +3.55 | 427 | +2.98 | +0.56 | 75% vs 70% |
| `reversal-backed` | 525 | +3.48 | 393 | +3.03 | +0.45 | 78% vs 65% |
| `rr-ok` | 272 | +2.08 | 646 | +3.80 | -1.72 | 37% vs 83% |
| `rr-strong` | 20 | +0.13 | 898 | +3.36 | -3.22 | 40% vs 73% |
| `volume` | 197 | +0.06 | 721 | +4.17 | -4.11 | 63% vs 75% |
| `ftfc-full` | 724 | +2.38 | 194 | +6.68 | -4.30 | 74% vs 68% |
| `in-force` | 447 | -0.03 | 471 | +6.43 | -6.46 | 75% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 264 | 74% | 196 | 78% | -0.05 | -0.04 | -9.47 |
| 2-2 Continuation | 240 | 65% | 157 | 57% | +3.62 | +2.37 | +568.41 |
| 2-1-2 Reversal | 106 | 73% | 77 | 73% | -0.05 | -0.04 | -3.95 |
| 2-1-2 Continuation | 96 | 78% | 75 | 75% | +8.16 | +6.37 | +611.85 |
| Rev Strat (1-2-2) Reversal | 71 | 65% | 46 | 85% | +0.07 | +0.04 | +3.17 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 38 | 63% | 24 | 79% | +22.48 | +14.20 | +539.58 |
| 3-2 Continuation | 33 | 73% | 24 | 88% | +0.27 | +0.19 | +6.42 |
| 1-1-2 Continuation | 23 | 83% | 19 | 68% | +0.17 | +0.14 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 571 | 67% | 382 | 71% | -0.03 | -0.02 | -11.33 |
| W | 249 | 74% | 185 | 78% | +3.08 | +2.29 | +570.17 |
| M | 98 | 81% | 79 | 68% | +31.11 | +25.08 | +2457.95 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 724 | 68% | 493 | 74% | +3.49 | +2.38 | +1721.83 |
| Mixed | 193 | 79% | 153 | 68% | +8.46 | +6.71 | +1294.97 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 392 | 70% | 275 | 65% | +4.33 | +3.04 | +1189.88 |
| Reversal | 526 | 71% | 371 | 78% | +4.92 | +3.47 | +1826.92 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 646 | 69% | 447 | 72% | +2.48 | +1.72 | +1108.11 |
| Inside-bar compression (X-1-?) | 272 | 73% | 199 | 74% | +9.59 | +7.02 | +1908.69 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 38 | 21% | 8 | 100% | +378.99 | +79.79 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 29 | 86% | 25 | 80% | +0.32 | +0.28 | +8.01 |
| DIA | 34 | 79% | 27 | 89% | +0.23 | +0.19 | +6.33 |
| TLT | 29 | 69% | 20 | 75% | +0.24 | +0.17 | +4.83 |
| ETH-USD | 19 | 84% | 16 | 81% | +0.17 | +0.14 | +2.64 |
| IWM | 31 | 61% | 19 | 79% | +0.21 | +0.13 | +3.95 |
| XLI | 32 | 63% | 20 | 90% | +0.19 | +0.12 | +3.73 |
| META | 32 | 59% | 19 | 79% | +0.17 | +0.10 | +3.14 |
| XLU | 34 | 85% | 29 | 62% | +0.09 | +0.08 | +2.59 |
| AMZN | 27 | 78% | 21 | 86% | +0.09 | +0.07 | +1.93 |
| BTC-USD | 21 | 90% | 19 | 68% | +0.02 | +0.02 | +0.35 |
| EURUSD=X | 30 | 10% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLC | 26 | 77% | 20 | 85% | -0.01 | -0.00 | -0.10 |
| SMH | 27 | 78% | 21 | 71% | -0.02 | -0.02 | -0.45 |
| XLF | 33 | 76% | 25 | 68% | -0.03 | -0.02 | -0.65 |
| XRP-USD | 32 | 63% | 20 | 65% | -0.05 | -0.03 | -0.95 |
| XLY | 21 | 81% | 17 | 82% | -0.07 | -0.06 | -1.20 |
| SPY | 25 | 72% | 18 | 67% | -0.11 | -0.08 | -1.94 |
| MSFT | 25 | 88% | 22 | 77% | -0.09 | -0.08 | -2.02 |
| GLD | 30 | 60% | 18 | 83% | -0.14 | -0.08 | -2.47 |
| XLK | 27 | 81% | 22 | 82% | -0.11 | -0.09 | -2.40 |
| XLV | 21 | 67% | 14 | 64% | -0.14 | -0.09 | -1.99 |
| NVDA | 26 | 62% | 16 | 75% | -0.17 | -0.11 | -2.75 |
| TSLA | 28 | 75% | 21 | 71% | -0.14 | -0.11 | -3.01 |
| SOL-USD | 25 | 76% | 19 | 63% | -0.19 | -0.14 | -3.55 |
| HYPE-USD | 21 | 81% | 17 | 47% | -0.18 | -0.14 | -3.01 |
| QQQ | 23 | 87% | 20 | 65% | -0.17 | -0.14 | -3.32 |
| GOOGL | 23 | 87% | 20 | 65% | -0.17 | -0.15 | -3.44 |
| XLP | 23 | 74% | 17 | 71% | -0.20 | -0.15 | -3.48 |
| AAPL | 26 | 77% | 20 | 65% | -0.22 | -0.17 | -4.43 |
| DOGE-USD | 25 | 68% | 17 | 35% | -0.27 | -0.18 | -4.53 |
| GC=F | 27 | 67% | 18 | 67% | -0.31 | -0.21 | -5.66 |
| XLE | 32 | 75% | 24 | 58% | -0.33 | -0.25 | -7.86 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
