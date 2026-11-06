# Edge Report — live signal record

_Generated 2026-11-06_ · **1702** settled signals from 2026-08-17 to 2026-11-06 · 25 open, 49 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1174 of 1702) — the rest expired unfilled.
- Of those trades, **72%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.56R per trade taken**, +1.77R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.56R**.
- Trades ran **3.29R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 807 | 64% | 516 | 79% | +2.45 | +1.57 | +1264.33 |
| 55–64 | 710 | 72% | 514 | 67% | +3.36 | +2.43 | +1725.55 |
| 65–74 (High) | 167 | 78% | 130 | 67% | +0.09 | +0.07 | +11.79 |
| 75+ (High) | 18 | 78% | 14 | 71% | +0.39 | +0.30 | +5.48 |

Spearman rank correlation between confidence and realised R: **0.023** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 508 | +3.78 | 1194 | +0.91 | +2.87 | 76% vs 71% |
| `ftfc-aligned` | 371 | +3.52 | 1331 | +1.28 | +2.24 | 70% vs 73% |
| `ftfc-opposed` | 371 | +3.52 | 1331 | +1.28 | +2.24 | 70% vs 73% |
| `base` | 1702 | +1.77 | 0 | +0.00 | +1.77 | 72% vs 0% |
| `rr-poor` | 1173 | +2.07 | 529 | +1.09 | +0.98 | 84% vs 39% |
| `close-location` | 870 | +1.98 | 832 | +1.54 | +0.44 | 74% vs 70% |
| `reversal-backed` | 986 | +1.86 | 716 | +1.64 | +0.22 | 78% vs 65% |
| `rr-ok` | 486 | +1.16 | 1216 | +2.01 | -0.85 | 38% vs 82% |
| `rr-strong` | 43 | +0.33 | 1659 | +1.80 | -1.48 | 44% vs 73% |
| `ftfc-full` | 1329 | +1.28 | 373 | +3.50 | -2.22 | 73% vs 70% |
| `volume` | 359 | +0.02 | 1343 | +2.23 | -2.22 | 64% vs 74% |
| `in-force` | 805 | -0.04 | 897 | +3.38 | -3.42 | 74% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 485 | 74% | 359 | 77% | -0.06 | -0.04 | -20.07 |
| 2-2 Continuation | 422 | 65% | 275 | 58% | +2.03 | +1.32 | +559.08 |
| 2-1-2 Reversal | 208 | 68% | 142 | 75% | +0.02 | +0.02 | +3.54 |
| 2-1-2 Continuation | 177 | 72% | 127 | 78% | +4.79 | +3.44 | +608.43 |
| Rev Strat (1-2-2) Reversal | 129 | 63% | 81 | 84% | +0.03 | +0.02 | +2.75 |
| 3-2-2 Reversal | 86 | 63% | 54 | 81% | +10.02 | +6.29 | +540.84 |
| 3-1-2 Reversal | 80 | 63% | 50 | 78% | +26.12 | +16.33 | +1306.03 |
| 3-2 Continuation | 72 | 79% | 57 | 67% | +0.05 | +0.04 | +2.77 |
| 1-1-2 Continuation | 43 | 67% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1057 | 65% | 689 | 71% | -0.04 | -0.03 | -26.93 |
| W | 468 | 71% | 334 | 77% | +1.68 | +1.20 | +561.24 |
| M | 177 | 85% | 151 | 68% | +16.38 | +13.97 | +2472.84 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1329 | 66% | 875 | 73% | +1.95 | +1.28 | +1702.89 |
| Mixed | 371 | 81% | 299 | 70% | +4.36 | +3.52 | +1304.26 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 714 | 68% | 488 | 65% | +2.41 | +1.64 | +1174.06 |
| Reversal | 988 | 69% | 686 | 78% | +2.67 | +1.86 | +1833.09 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1194 | 69% | 826 | 71% | +1.31 | +0.91 | +1085.38 |
| Inside-bar compression (X-1-?) | 508 | 69% | 348 | 76% | +5.52 | +3.78 | +1921.77 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 70 | 19% | 13 | 100% | +233.48 | +43.36 | +3035.27 |
| AMD | 54 | 78% | 42 | 83% | +0.43 | +0.34 | +18.19 |
| LTC-USD | 30 | 83% | 25 | 88% | +0.25 | +0.21 | +6.27 |
| TLT | 52 | 71% | 37 | 76% | +0.24 | +0.17 | +8.99 |
| XLK | 54 | 69% | 37 | 81% | +0.14 | +0.09 | +5.10 |
| META | 57 | 58% | 33 | 76% | +0.13 | +0.08 | +4.42 |
| XLI | 56 | 68% | 38 | 89% | +0.09 | +0.06 | +3.42 |
| BTC-USD | 37 | 84% | 31 | 74% | +0.07 | +0.06 | +2.08 |
| SMH | 53 | 66% | 35 | 77% | +0.06 | +0.04 | +2.09 |
| XLU | 60 | 72% | 43 | 63% | +0.05 | +0.04 | +2.25 |
| DIA | 55 | 84% | 46 | 83% | +0.04 | +0.03 | +1.88 |
| QQQ | 52 | 79% | 41 | 71% | +0.04 | +0.03 | +1.56 |
| NVDA | 54 | 65% | 35 | 71% | +0.02 | +0.01 | +0.72 |
| EURUSD=X | 52 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| AMZN | 54 | 80% | 43 | 81% | +0.00 | +0.00 | +0.04 |
| MSFT | 47 | 83% | 39 | 77% | -0.02 | -0.01 | -0.66 |
| IWM | 58 | 62% | 36 | 69% | -0.04 | -0.02 | -1.35 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XLC | 50 | 78% | 39 | 82% | -0.05 | -0.04 | -1.79 |
| HYPE-USD | 36 | 81% | 29 | 59% | -0.05 | -0.04 | -1.33 |
| XRP-USD | 45 | 58% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| SPY | 44 | 73% | 32 | 69% | -0.06 | -0.04 | -1.92 |
| GC=F | 53 | 62% | 33 | 76% | -0.08 | -0.05 | -2.75 |
| XLF | 57 | 79% | 45 | 69% | -0.07 | -0.06 | -3.26 |
| DOGE-USD | 43 | 72% | 31 | 58% | -0.08 | -0.06 | -2.53 |
| XLV | 52 | 75% | 39 | 67% | -0.10 | -0.07 | -3.71 |
| XLP | 53 | 64% | 34 | 68% | -0.15 | -0.09 | -5.03 |
| ETH-USD | 37 | 81% | 30 | 63% | -0.12 | -0.10 | -3.65 |
| TSLA | 45 | 73% | 33 | 73% | -0.16 | -0.11 | -5.16 |
| XLY | 49 | 80% | 39 | 77% | -0.15 | -0.12 | -5.77 |
| AAPL | 49 | 76% | 37 | 68% | -0.18 | -0.13 | -6.48 |
| XLE | 51 | 76% | 39 | 56% | -0.24 | -0.18 | -9.22 |
| GLD | 55 | 73% | 40 | 70% | -0.27 | -0.20 | -10.93 |
| GOOGL | 49 | 86% | 42 | 55% | -0.41 | -0.35 | -17.27 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
