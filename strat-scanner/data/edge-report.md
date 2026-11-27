# Edge Report — live signal record

_Generated 2026-11-27_ · **2142** settled signals from 2026-08-17 to 2026-11-27 · 39 open, 42 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1472 of 2142) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.05R per trade taken**, +1.41R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.05R**.
- Trades ran **2.77R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 1001 | 64% | 642 | 80% | +1.98 | +1.27 | +1272.33 |
| 55–64 | 896 | 72% | 642 | 69% | +2.70 | +1.93 | +1731.34 |
| 65–74 (High) | 221 | 76% | 168 | 62% | +0.07 | +0.05 | +11.40 |
| 75+ (High) | 24 | 83% | 20 | 65% | +0.32 | +0.27 | +6.45 |

Spearman rank correlation between confidence and realised R: **0.012** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 652 | +2.94 | 1490 | +0.74 | +2.20 | 76% vs 72% |
| `ftfc-aligned` | 459 | +2.85 | 1683 | +1.02 | +1.83 | 71% vs 74% |
| `ftfc-opposed` | 459 | +2.85 | 1683 | +1.02 | +1.83 | 71% vs 74% |
| `base` | 2142 | +1.41 | 0 | +0.00 | +1.41 | 73% vs 0% |
| `rr-poor` | 1470 | +1.64 | 672 | +0.90 | +0.75 | 84% vs 41% |
| `close-location` | 1124 | +1.55 | 1018 | +1.26 | +0.29 | 75% vs 70% |
| `reversal-backed` | 1189 | +1.53 | 953 | +1.26 | +0.28 | 77% vs 67% |
| `rr-ok` | 622 | +0.95 | 1520 | +1.60 | -0.66 | 41% vs 82% |
| `rr-strong` | 50 | +0.32 | 2092 | +1.44 | -1.12 | 45% vs 74% |
| `volume` | 494 | +0.03 | 1648 | +1.82 | -1.79 | 66% vs 75% |
| `ftfc-full` | 1681 | +1.02 | 461 | +2.83 | -1.81 | 74% vs 71% |
| `in-force` | 1000 | -0.02 | 1142 | +2.66 | -2.68 | 74% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 568 | 66% | 374 | 62% | +1.57 | +1.03 | +585.80 |
| 2-2 Reversal | 568 | 73% | 416 | 77% | -0.06 | -0.04 | -23.68 |
| 2-1-2 Reversal | 258 | 68% | 176 | 71% | -0.02 | -0.01 | -3.49 |
| 2-1-2 Continuation | 237 | 73% | 173 | 79% | +3.51 | +2.56 | +607.28 |
| Rev Strat (1-2-2) Reversal | 156 | 59% | 92 | 83% | +0.01 | +0.01 | +1.02 |
| 3-1-2 Reversal | 106 | 63% | 67 | 84% | +19.54 | +12.35 | +1308.85 |
| 3-2-2 Reversal | 103 | 61% | 63 | 81% | +8.57 | +5.24 | +540.05 |
| 3-2 Continuation | 95 | 82% | 78 | 69% | +0.04 | +0.03 | +3.09 |
| 1-1-2 Continuation | 51 | 65% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1340 | 65% | 870 | 72% | -0.02 | -0.01 | -17.46 |
| W | 591 | 72% | 427 | 77% | +1.32 | +0.96 | +564.51 |
| M | 211 | 83% | 175 | 70% | +14.14 | +11.73 | +2474.47 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1681 | 66% | 1110 | 74% | +1.55 | +1.02 | +1715.00 |
| Mixed | 459 | 79% | 362 | 71% | +3.61 | +2.85 | +1306.52 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 951 | 69% | 658 | 67% | +1.82 | +1.26 | +1198.76 |
| Reversal | 1191 | 68% | 814 | 77% | +2.24 | +1.53 | +1822.76 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1490 | 69% | 1023 | 72% | +1.08 | +0.74 | +1106.29 |
| Inside-bar compression (X-1-?) | 652 | 69% | 449 | 76% | +4.27 | +2.94 | +1915.24 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 90 | 18% | 16 | 100% | +189.76 | +33.74 | +3036.15 |
| AMD | 66 | 79% | 52 | 85% | +0.36 | +0.28 | +18.71 |
| TLT | 62 | 68% | 42 | 79% | +0.32 | +0.22 | +13.42 |
| LTC-USD | 46 | 83% | 38 | 84% | +0.19 | +0.15 | +7.11 |
| BTC-USD | 50 | 84% | 42 | 76% | +0.18 | +0.15 | +7.39 |
| SOL-USD | 56 | 75% | 42 | 74% | +0.12 | +0.09 | +4.94 |
| XRP-USD | 64 | 64% | 41 | 71% | +0.12 | +0.07 | +4.72 |
| XLK | 63 | 68% | 43 | 79% | +0.10 | +0.07 | +4.11 |
| ETH-USD | 54 | 78% | 42 | 71% | +0.07 | +0.06 | +3.00 |
| HYPE-USD | 44 | 80% | 35 | 66% | +0.06 | +0.05 | +2.27 |
| DOGE-USD | 58 | 72% | 42 | 64% | +0.04 | +0.03 | +1.53 |
| XLU | 72 | 71% | 51 | 67% | +0.03 | +0.02 | +1.74 |
| EURUSD=X | 64 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| QQQ | 61 | 75% | 46 | 67% | +0.02 | +0.02 | +1.03 |
| META | 67 | 61% | 41 | 73% | +0.03 | +0.02 | +1.09 |
| DIA | 69 | 84% | 58 | 81% | +0.02 | +0.02 | +1.07 |
| SMH | 62 | 68% | 42 | 76% | +0.02 | +0.01 | +0.68 |
| NVDA | 68 | 63% | 43 | 72% | +0.00 | +0.00 | +0.12 |
| GC=F | 69 | 62% | 43 | 79% | -0.01 | -0.01 | -0.56 |
| XLI | 66 | 71% | 47 | 83% | -0.02 | -0.01 | -0.83 |
| AMZN | 61 | 79% | 48 | 81% | -0.02 | -0.02 | -1.07 |
| MSFT | 57 | 79% | 45 | 78% | -0.05 | -0.04 | -2.47 |
| XLC | 62 | 79% | 49 | 80% | -0.07 | -0.05 | -3.19 |
| SPY | 53 | 74% | 39 | 69% | -0.08 | -0.06 | -2.94 |
| XLP | 66 | 68% | 45 | 67% | -0.08 | -0.06 | -3.67 |
| IWM | 71 | 65% | 46 | 70% | -0.09 | -0.06 | -4.17 |
| XLV | 69 | 72% | 50 | 66% | -0.11 | -0.08 | -5.56 |
| XLF | 73 | 79% | 58 | 66% | -0.12 | -0.10 | -7.00 |
| AAPL | 60 | 72% | 43 | 70% | -0.15 | -0.11 | -6.60 |
| XLE | 70 | 74% | 52 | 62% | -0.15 | -0.11 | -7.78 |
| GLD | 73 | 68% | 50 | 72% | -0.17 | -0.12 | -8.54 |
| XLY | 60 | 77% | 46 | 74% | -0.16 | -0.12 | -7.23 |
| TSLA | 56 | 73% | 41 | 73% | -0.17 | -0.13 | -7.12 |
| GOOGL | 60 | 82% | 49 | 55% | -0.41 | -0.34 | -20.23 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
