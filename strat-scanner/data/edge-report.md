# Edge Report — live signal record

_Generated 2026-11-03_ · **1591** settled signals from 2026-08-17 to 2026-11-03 · 36 open, 41 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1082 of 1591) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 5% timed out.
- **Expectancy +2.79R per trade taken**, +1.89R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.79R**.
- Trades ran **3.49R** in favour at best and **0.65R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 769 | 63% | 487 | 79% | +2.61 | +1.65 | +1269.20 |
| 55–64 | 660 | 71% | 470 | 68% | +3.69 | +2.63 | +1735.00 |
| 65–74 (High) | 146 | 77% | 112 | 65% | +0.05 | +0.04 | +5.56 |
| 75+ (High) | 16 | 81% | 13 | 69% | +0.40 | +0.32 | +5.16 |

Spearman rank correlation between confidence and realised R: **0.030** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 467 | +4.11 | 1124 | +0.98 | +3.13 | 77% vs 71% |
| `ftfc-aligned` | 338 | +3.83 | 1253 | +1.37 | +2.46 | 70% vs 74% |
| `ftfc-opposed` | 338 | +3.83 | 1253 | +1.37 | +2.46 | 70% vs 74% |
| `base` | 1591 | +1.89 | 0 | +0.00 | +1.89 | 73% vs 0% |
| `rr-poor` | 1092 | +2.24 | 499 | +1.14 | +1.09 | 84% vs 38% |
| `close-location` | 816 | +2.13 | 775 | +1.65 | +0.48 | 75% vs 70% |
| `reversal-backed` | 914 | +2.01 | 677 | +1.74 | +0.27 | 78% vs 65% |
| `rr-ok` | 461 | +1.22 | 1130 | +2.17 | -0.95 | 38% vs 83% |
| `rr-strong` | 38 | +0.17 | 1553 | +1.94 | -1.77 | 41% vs 74% |
| `volume` | 319 | +0.03 | 1272 | +2.36 | -2.33 | 63% vs 75% |
| `ftfc-full` | 1251 | +1.37 | 340 | +3.81 | -2.43 | 74% vs 70% |
| `in-force` | 746 | -0.03 | 845 | +3.59 | -3.62 | 74% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 460 | 74% | 339 | 78% | -0.03 | -0.02 | -9.22 |
| 2-2 Continuation | 404 | 65% | 262 | 58% | +2.14 | +1.38 | +559.38 |
| 2-1-2 Reversal | 190 | 67% | 128 | 76% | +0.03 | +0.02 | +3.98 |
| 2-1-2 Continuation | 165 | 71% | 117 | 79% | +5.24 | +3.71 | +612.88 |
| Rev Strat (1-2-2) Reversal | 115 | 58% | 67 | 84% | +0.04 | +0.02 | +2.85 |
| 3-2-2 Reversal | 81 | 60% | 49 | 84% | +11.02 | +6.67 | +540.07 |
| 3-1-2 Reversal | 70 | 60% | 42 | 79% | +30.91 | +18.55 | +1298.34 |
| 3-2 Continuation | 64 | 77% | 49 | 67% | +0.06 | +0.04 | +2.85 |
| 1-1-2 Continuation | 42 | 69% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 995 | 64% | 641 | 72% | -0.03 | -0.02 | -19.41 |
| W | 444 | 71% | 314 | 77% | +1.79 | +1.27 | +562.11 |
| M | 152 | 84% | 127 | 69% | +19.47 | +16.26 | +2472.21 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1251 | 65% | 814 | 74% | +2.11 | +1.37 | +1719.83 |
| Mixed | 338 | 79% | 268 | 70% | +4.83 | +3.83 | +1295.08 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 675 | 68% | 457 | 65% | +2.58 | +1.75 | +1178.90 |
| Reversal | 916 | 68% | 625 | 78% | +2.94 | +2.00 | +1836.01 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1124 | 68% | 766 | 71% | +1.43 | +0.98 | +1095.93 |
| Inside-bar compression (X-1-?) | 467 | 68% | 316 | 77% | +6.07 | +4.11 | +1918.98 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 68 | 19% | 13 | 100% | +233.48 | +44.64 | +3035.27 |
| TLT | 49 | 69% | 34 | 79% | +0.32 | +0.22 | +10.99 |
| LTC-USD | 29 | 83% | 24 | 88% | +0.26 | +0.22 | +6.26 |
| AMD | 50 | 76% | 38 | 82% | +0.17 | +0.13 | +6.59 |
| DIA | 51 | 82% | 42 | 86% | +0.10 | +0.08 | +4.11 |
| BTC-USD | 36 | 83% | 30 | 77% | +0.09 | +0.08 | +2.73 |
| XLK | 50 | 68% | 34 | 79% | +0.10 | +0.07 | +3.50 |
| META | 54 | 56% | 30 | 73% | +0.12 | +0.07 | +3.72 |
| XLI | 53 | 66% | 35 | 89% | +0.10 | +0.06 | +3.35 |
| XLU | 55 | 71% | 39 | 64% | +0.05 | +0.03 | +1.91 |
| XLC | 46 | 76% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| AMZN | 49 | 78% | 38 | 82% | +0.03 | +0.02 | +1.04 |
| QQQ | 48 | 77% | 37 | 70% | +0.02 | +0.01 | +0.58 |
| EURUSD=X | 50 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| NVDA | 49 | 65% | 32 | 69% | +0.01 | +0.00 | +0.22 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLF | 53 | 81% | 43 | 70% | -0.04 | -0.03 | -1.69 |
| MSFT | 41 | 80% | 33 | 76% | -0.04 | -0.04 | -1.46 |
| XRP-USD | 45 | 58% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| XLY | 43 | 81% | 35 | 80% | -0.05 | -0.04 | -1.76 |
| ETH-USD | 35 | 80% | 28 | 68% | -0.06 | -0.05 | -1.65 |
| HYPE-USD | 35 | 80% | 28 | 57% | -0.06 | -0.05 | -1.74 |
| SPY | 40 | 73% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| XLV | 48 | 73% | 35 | 66% | -0.10 | -0.08 | -3.63 |
| DOGE-USD | 40 | 70% | 28 | 54% | -0.12 | -0.08 | -3.37 |
| XLP | 50 | 62% | 31 | 68% | -0.14 | -0.09 | -4.47 |
| GC=F | 50 | 62% | 31 | 74% | -0.15 | -0.09 | -4.63 |
| AAPL | 45 | 76% | 34 | 71% | -0.13 | -0.09 | -4.25 |
| TSLA | 45 | 73% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| GLD | 52 | 71% | 37 | 70% | -0.22 | -0.15 | -8.02 |
| XLE | 51 | 76% | 39 | 56% | -0.24 | -0.18 | -9.22 |
| GOOGL | 42 | 86% | 36 | 61% | -0.31 | -0.26 | -11.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
