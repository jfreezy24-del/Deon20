# Edge Report — live signal record

_Generated 2026-09-27_ · **833** settled signals from 2026-08-17 to 2026-09-27 · 38 open, 32 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **70%** of published signals actually triggered (583 of 833) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 24% stopped out, 3% timed out.
- **Expectancy +5.16R per trade taken**, +3.61R per signal published.
- Promised **0.77R** to target 1 on average; delivered **+5.16R**.
- Trades ran **5.89R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 376 | 65% | 244 | 79% | +5.25 | +3.41 | +1281.21 |
| 55–64 | 351 | 73% | 257 | 70% | +6.73 | +4.93 | +1730.40 |
| 65–74 (High) | 94 | 78% | 73 | 63% | -0.04 | -0.03 | -3.20 |
| 75+ (High) | 12 | 75% | 9 | 78% | +0.17 | +0.13 | +1.51 |

Spearman rank correlation between confidence and realised R: **0.039** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 255 | +7.48 | 578 | +1.91 | +5.58 | 73% vs 73% |
| `ftfc-aligned` | 172 | +7.51 | 661 | +2.60 | +4.92 | 69% vs 74% |
| `ftfc-opposed` | 172 | +7.51 | 661 | +2.60 | +4.92 | 69% vs 74% |
| `base` | 833 | +3.61 | 0 | +0.00 | +3.61 | 73% vs 0% |
| `rr-poor` | 571 | +4.29 | 262 | +2.13 | +2.16 | 84% vs 37% |
| `reversal-backed` | 478 | +3.83 | 355 | +3.33 | +0.50 | 78% vs 66% |
| `close-location` | 453 | +3.82 | 380 | +3.36 | +0.46 | 75% vs 70% |
| `rr-ok` | 243 | +2.29 | 590 | +4.16 | -1.87 | 37% vs 83% |
| `rr-strong` | 19 | +0.13 | 814 | +3.69 | -3.57 | 43% vs 74% |
| `volume` | 173 | +0.07 | 660 | +4.54 | -4.48 | 68% vs 74% |
| `ftfc-full` | 660 | +2.60 | 173 | +7.47 | -4.87 | 74% vs 69% |
| `in-force` | 402 | -0.03 | 431 | +7.01 | -7.04 | 76% vs 66% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 235 | 73% | 172 | 79% | -0.05 | -0.03 | -8.04 |
| 2-2 Continuation | 213 | 63% | 135 | 59% | +4.17 | +2.64 | +562.55 |
| 2-1-2 Reversal | 98 | 74% | 73 | 74% | -0.05 | -0.03 | -3.31 |
| 2-1-2 Continuation | 88 | 77% | 68 | 72% | +8.98 | +6.94 | +610.58 |
| Rev Strat (1-2-2) Reversal | 64 | 66% | 42 | 83% | +0.07 | +0.05 | +2.95 |
| 3-1-2 Reversal | 47 | 60% | 28 | 79% | +46.34 | +27.61 | +1297.58 |
| 3-2-2 Reversal | 35 | 69% | 24 | 79% | +22.48 | +15.42 | +539.58 |
| 3-2 Continuation | 31 | 71% | 22 | 86% | +0.22 | +0.16 | +4.82 |
| 1-1-2 Continuation | 22 | 86% | 19 | 68% | +0.17 | +0.15 | +3.20 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 511 | 66% | 337 | 72% | -0.03 | -0.02 | -9.78 |
| W | 230 | 75% | 173 | 77% | +3.27 | +2.46 | +565.50 |
| M | 92 | 79% | 73 | 67% | +33.62 | +26.68 | +2454.20 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 660 | 67% | 444 | 74% | +3.87 | +2.60 | +1717.43 |
| Mixed | 172 | 81% | 139 | 69% | +9.30 | +7.51 | +1292.48 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 354 | 69% | 244 | 66% | +4.84 | +3.34 | +1181.14 |
| Reversal | 479 | 71% | 339 | 78% | +5.39 | +3.82 | +1828.77 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 578 | 68% | 395 | 73% | +2.79 | +1.91 | +1101.86 |
| Inside-bar compression (X-1-?) | 255 | 74% | 188 | 73% | +10.15 | +7.48 | +1908.05 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 35 | 23% | 8 | 100% | +378.99 | +86.63 | +3031.89 |
| LTC-USD | 16 | 88% | 14 | 93% | +0.44 | +0.38 | +6.13 |
| AMD | 26 | 92% | 24 | 83% | +0.32 | +0.29 | +7.61 |
| DIA | 33 | 79% | 26 | 88% | +0.24 | +0.19 | +6.14 |
| XLU | 30 | 87% | 26 | 69% | +0.18 | +0.15 | +4.60 |
| META | 28 | 64% | 18 | 83% | +0.23 | +0.15 | +4.14 |
| ETH-USD | 18 | 83% | 15 | 80% | +0.17 | +0.14 | +2.60 |
| XLI | 27 | 59% | 16 | 88% | +0.21 | +0.12 | +3.32 |
| AMZN | 25 | 76% | 19 | 89% | +0.14 | +0.11 | +2.69 |
| IWM | 28 | 57% | 16 | 75% | +0.15 | +0.08 | +2.35 |
| GLD | 25 | 56% | 14 | 86% | +0.06 | +0.03 | +0.83 |
| EURUSD=X | 26 | 12% | 3 | 67% | +0.16 | +0.02 | +0.48 |
| XLC | 23 | 83% | 19 | 84% | -0.01 | -0.01 | -0.16 |
| XLY | 18 | 78% | 14 | 86% | -0.02 | -0.01 | -0.23 |
| BTC-USD | 20 | 90% | 18 | 67% | -0.02 | -0.02 | -0.34 |
| XRP-USD | 30 | 60% | 18 | 61% | -0.07 | -0.04 | -1.21 |
| NVDA | 25 | 60% | 15 | 80% | -0.12 | -0.07 | -1.75 |
| SMH | 25 | 76% | 19 | 74% | -0.10 | -0.08 | -1.97 |
| XLF | 28 | 71% | 20 | 70% | -0.12 | -0.08 | -2.34 |
| SPY | 23 | 70% | 16 | 69% | -0.14 | -0.10 | -2.27 |
| XLV | 20 | 70% | 14 | 64% | -0.14 | -0.10 | -1.99 |
| XLP | 20 | 80% | 16 | 75% | -0.13 | -0.10 | -2.02 |
| MSFT | 22 | 91% | 20 | 75% | -0.11 | -0.10 | -2.23 |
| XLK | 26 | 81% | 21 | 81% | -0.13 | -0.10 | -2.70 |
| TSLA | 26 | 73% | 19 | 68% | -0.20 | -0.14 | -3.72 |
| GOOGL | 23 | 87% | 20 | 65% | -0.17 | -0.15 | -3.44 |
| HYPE-USD | 20 | 80% | 16 | 44% | -0.19 | -0.15 | -3.02 |
| TLT | 23 | 61% | 14 | 64% | -0.26 | -0.16 | -3.68 |
| AAPL | 23 | 74% | 17 | 71% | -0.22 | -0.16 | -3.73 |
| SOL-USD | 23 | 74% | 17 | 59% | -0.22 | -0.17 | -3.81 |
| DOGE-USD | 22 | 68% | 15 | 40% | -0.25 | -0.17 | -3.70 |
| QQQ | 20 | 85% | 17 | 71% | -0.25 | -0.21 | -4.22 |
| XLE | 31 | 74% | 23 | 57% | -0.34 | -0.25 | -7.86 |
| GC=F | 25 | 64% | 16 | 63% | -0.41 | -0.26 | -6.48 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
