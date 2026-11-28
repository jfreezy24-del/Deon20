# Edge Report — live signal record

_Generated 2026-11-28_ · **2167** settled signals from 2026-08-17 to 2026-11-28 · 36 open, 39 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1486 of 2167) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.04R per trade taken**, +1.40R per signal published.
- Promised **0.70R** to target 1 on average; delivered **+2.04R**.
- Trades ran **2.75R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 1015 | 64% | 651 | 81% | +1.96 | +1.25 | +1273.44 |
| 55–64 | 906 | 71% | 646 | 69% | +2.68 | +1.91 | +1731.75 |
| 65–74 (High) | 222 | 76% | 169 | 62% | +0.07 | +0.06 | +12.51 |
| 75+ (High) | 24 | 83% | 20 | 65% | +0.32 | +0.27 | +6.45 |

Spearman rank correlation between confidence and realised R: **0.013** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 652 | +2.94 | 1515 | +0.73 | +2.21 | 76% vs 72% |
| `ftfc-aligned` | 463 | +2.83 | 1704 | +1.01 | +1.82 | 72% vs 74% |
| `ftfc-opposed` | 463 | +2.83 | 1704 | +1.01 | +1.82 | 72% vs 74% |
| `base` | 2167 | +1.40 | 0 | +0.00 | +1.40 | 73% vs 0% |
| `rr-poor` | 1493 | +1.62 | 674 | +0.90 | +0.72 | 84% vs 41% |
| `reversal-backed` | 1205 | +1.51 | 962 | +1.25 | +0.27 | 78% vs 68% |
| `close-location` | 1144 | +1.52 | 1023 | +1.26 | +0.26 | 75% vs 70% |
| `rr-ok` | 624 | +0.94 | 1543 | +1.58 | -0.63 | 41% vs 83% |
| `rr-strong` | 50 | +0.32 | 2117 | +1.42 | -1.10 | 45% vs 74% |
| `volume` | 503 | +0.03 | 1664 | +1.81 | -1.77 | 67% vs 75% |
| `ftfc-full` | 1702 | +1.01 | 465 | +2.82 | -1.81 | 74% vs 72% |
| `in-force` | 1014 | -0.02 | 1153 | +2.64 | -2.66 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 580 | 72% | 419 | 78% | -0.05 | -0.04 | -22.59 |
| 2-2 Continuation | 570 | 66% | 376 | 62% | +1.56 | +1.03 | +585.81 |
| 2-1-2 Reversal | 258 | 68% | 176 | 71% | -0.02 | -0.01 | -3.49 |
| 2-1-2 Continuation | 237 | 73% | 173 | 79% | +3.51 | +2.56 | +607.28 |
| Rev Strat (1-2-2) Reversal | 158 | 58% | 92 | 83% | +0.01 | +0.01 | +1.02 |
| 3-1-2 Reversal | 106 | 63% | 67 | 84% | +19.54 | +12.35 | +1308.85 |
| 3-2-2 Reversal | 105 | 62% | 65 | 82% | +8.33 | +5.16 | +541.58 |
| 3-2 Continuation | 102 | 83% | 85 | 72% | +0.04 | +0.03 | +3.09 |
| 1-1-2 Continuation | 51 | 65% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1365 | 65% | 884 | 72% | -0.02 | -0.01 | -14.83 |
| W | 591 | 72% | 427 | 77% | +1.32 | +0.96 | +564.51 |
| M | 211 | 83% | 175 | 70% | +14.14 | +11.73 | +2474.47 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1702 | 66% | 1120 | 74% | +1.53 | +1.01 | +1715.01 |
| Mixed | 463 | 79% | 366 | 72% | +3.58 | +2.83 | +1309.15 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 960 | 69% | 667 | 68% | +1.80 | +1.25 | +1198.78 |
| Reversal | 1207 | 68% | 819 | 78% | +2.23 | +1.51 | +1825.38 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1515 | 68% | 1037 | 72% | +1.07 | +0.73 | +1108.92 |
| Inside-bar compression (X-1-?) | 652 | 69% | 449 | 76% | +4.27 | +2.94 | +1915.24 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 90 | 18% | 16 | 100% | +189.76 | +33.74 | +3036.15 |
| AMD | 67 | 78% | 52 | 85% | +0.36 | +0.28 | +18.71 |
| TLT | 63 | 67% | 42 | 79% | +0.32 | +0.21 | +13.42 |
| LTC-USD | 46 | 83% | 38 | 84% | +0.19 | +0.15 | +7.11 |
| BTC-USD | 50 | 84% | 42 | 76% | +0.18 | +0.15 | +7.39 |
| SOL-USD | 56 | 75% | 42 | 74% | +0.12 | +0.09 | +4.94 |
| XRP-USD | 64 | 64% | 41 | 71% | +0.12 | +0.07 | +4.72 |
| XLK | 64 | 67% | 43 | 79% | +0.10 | +0.06 | +4.11 |
| ETH-USD | 54 | 78% | 42 | 71% | +0.07 | +0.06 | +3.00 |
| HYPE-USD | 44 | 80% | 35 | 66% | +0.06 | +0.05 | +2.27 |
| META | 69 | 62% | 43 | 74% | +0.05 | +0.03 | +2.20 |
| DOGE-USD | 58 | 72% | 42 | 64% | +0.04 | +0.03 | +1.53 |
| DIA | 71 | 85% | 60 | 82% | +0.03 | +0.03 | +1.79 |
| XLU | 72 | 71% | 51 | 67% | +0.03 | +0.02 | +1.74 |
| EURUSD=X | 65 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| QQQ | 62 | 74% | 46 | 67% | +0.02 | +0.02 | +1.03 |
| SMH | 63 | 67% | 42 | 76% | +0.02 | +0.01 | +0.68 |
| NVDA | 69 | 62% | 43 | 72% | +0.00 | +0.00 | +0.12 |
| XLI | 68 | 72% | 49 | 84% | -0.01 | -0.01 | -0.41 |
| GC=F | 69 | 62% | 43 | 79% | -0.01 | -0.01 | -0.56 |
| AMZN | 62 | 79% | 49 | 82% | -0.02 | -0.02 | -1.07 |
| MSFT | 57 | 79% | 45 | 78% | -0.05 | -0.04 | -2.47 |
| XLC | 63 | 79% | 50 | 80% | -0.06 | -0.05 | -3.19 |
| SPY | 54 | 72% | 39 | 69% | -0.08 | -0.05 | -2.94 |
| XLP | 66 | 68% | 45 | 67% | -0.08 | -0.06 | -3.67 |
| IWM | 72 | 65% | 47 | 70% | -0.09 | -0.06 | -4.17 |
| XLV | 69 | 72% | 50 | 66% | -0.11 | -0.08 | -5.56 |
| XLF | 74 | 80% | 59 | 66% | -0.12 | -0.09 | -6.98 |
| AAPL | 61 | 72% | 44 | 70% | -0.15 | -0.11 | -6.60 |
| XLE | 71 | 75% | 53 | 62% | -0.15 | -0.11 | -7.78 |
| XLY | 62 | 77% | 48 | 75% | -0.14 | -0.11 | -6.85 |
| GLD | 74 | 68% | 50 | 72% | -0.17 | -0.12 | -8.54 |
| TSLA | 57 | 72% | 41 | 73% | -0.17 | -0.12 | -7.12 |
| GOOGL | 61 | 80% | 49 | 55% | -0.41 | -0.33 | -20.23 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
