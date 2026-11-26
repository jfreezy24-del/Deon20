# Edge Report — live signal record

_Generated 2026-11-26_ · **2130** settled signals from 2026-08-17 to 2026-11-26 · 43 open, 36 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1466 of 2130) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.06R per trade taken**, +1.42R per signal published.
- Promised **0.70R** to target 1 on average; delivered **+2.06R**.
- Trades ran **2.78R** in favour at best and **0.66R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 996 | 64% | 642 | 80% | +1.98 | +1.28 | +1272.33 |
| 55–64 | 894 | 72% | 640 | 69% | +2.71 | +1.94 | +1731.28 |
| 65–74 (High) | 216 | 76% | 164 | 63% | +0.08 | +0.06 | +12.57 |
| 75+ (High) | 24 | 83% | 20 | 65% | +0.32 | +0.27 | +6.45 |

Spearman rank correlation between confidence and realised R: **0.015** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 649 | +2.95 | 1481 | +0.75 | +2.20 | 76% vs 72% |
| `ftfc-aligned` | 459 | +2.85 | 1671 | +1.03 | +1.82 | 71% vs 74% |
| `ftfc-opposed` | 459 | +2.85 | 1671 | +1.03 | +1.82 | 71% vs 74% |
| `base` | 2130 | +1.42 | 0 | +0.00 | +1.42 | 73% vs 0% |
| `rr-poor` | 1464 | +1.65 | 666 | +0.91 | +0.74 | 84% vs 42% |
| `close-location` | 1115 | +1.56 | 1015 | +1.26 | +0.30 | 76% vs 70% |
| `reversal-backed` | 1185 | +1.54 | 945 | +1.27 | +0.27 | 77% vs 68% |
| `rr-ok` | 616 | +0.96 | 1514 | +1.61 | -0.65 | 41% vs 82% |
| `rr-strong` | 50 | +0.32 | 2080 | +1.45 | -1.13 | 45% vs 74% |
| `volume` | 490 | +0.03 | 1640 | +1.83 | -1.80 | 67% vs 75% |
| `ftfc-full` | 1669 | +1.03 | 461 | +2.83 | -1.81 | 74% vs 71% |
| `in-force` | 994 | -0.02 | 1136 | +2.68 | -2.70 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 567 | 66% | 373 | 62% | +1.57 | +1.03 | +586.57 |
| 2-2 Reversal | 565 | 73% | 415 | 77% | -0.06 | -0.04 | -23.78 |
| 2-1-2 Reversal | 258 | 68% | 176 | 71% | -0.02 | -0.01 | -3.49 |
| 2-1-2 Continuation | 235 | 74% | 173 | 79% | +3.51 | +2.58 | +607.28 |
| Rev Strat (1-2-2) Reversal | 155 | 59% | 92 | 83% | +0.01 | +0.01 | +1.02 |
| 3-1-2 Reversal | 106 | 63% | 67 | 84% | +19.54 | +12.35 | +1308.85 |
| 3-2-2 Reversal | 103 | 61% | 63 | 81% | +8.57 | +5.24 | +540.05 |
| 3-2 Continuation | 91 | 81% | 74 | 73% | +0.05 | +0.04 | +3.52 |
| 1-1-2 Continuation | 50 | 66% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1328 | 65% | 864 | 72% | -0.02 | -0.01 | -16.35 |
| W | 591 | 72% | 427 | 77% | +1.32 | +0.96 | +564.51 |
| M | 211 | 83% | 175 | 70% | +14.14 | +11.73 | +2474.47 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1669 | 66% | 1104 | 74% | +1.55 | +1.03 | +1716.11 |
| Mixed | 459 | 79% | 362 | 71% | +3.61 | +2.85 | +1306.52 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 943 | 69% | 653 | 68% | +1.84 | +1.27 | +1199.97 |
| Reversal | 1187 | 68% | 813 | 77% | +2.24 | +1.54 | +1822.66 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1481 | 69% | 1017 | 72% | +1.09 | +0.75 | +1107.40 |
| Inside-bar compression (X-1-?) | 649 | 69% | 449 | 76% | +4.27 | +2.95 | +1915.24 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 89 | 18% | 16 | 100% | +189.76 | +34.11 | +3036.15 |
| AMD | 66 | 79% | 52 | 85% | +0.36 | +0.28 | +18.71 |
| TLT | 61 | 69% | 42 | 79% | +0.32 | +0.22 | +13.42 |
| LTC-USD | 46 | 83% | 38 | 84% | +0.19 | +0.15 | +7.11 |
| BTC-USD | 50 | 84% | 42 | 76% | +0.18 | +0.15 | +7.39 |
| SOL-USD | 56 | 75% | 42 | 74% | +0.12 | +0.09 | +4.94 |
| XRP-USD | 64 | 64% | 41 | 71% | +0.12 | +0.07 | +4.72 |
| XLK | 63 | 68% | 43 | 79% | +0.10 | +0.07 | +4.11 |
| ETH-USD | 54 | 78% | 42 | 71% | +0.07 | +0.06 | +3.00 |
| HYPE-USD | 44 | 80% | 35 | 66% | +0.06 | +0.05 | +2.27 |
| DIA | 68 | 84% | 57 | 82% | +0.03 | +0.03 | +1.84 |
| DOGE-USD | 58 | 72% | 42 | 64% | +0.04 | +0.03 | +1.53 |
| XLU | 72 | 71% | 51 | 67% | +0.03 | +0.02 | +1.74 |
| EURUSD=X | 64 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| META | 67 | 61% | 41 | 73% | +0.03 | +0.02 | +1.09 |
| QQQ | 60 | 75% | 45 | 69% | +0.02 | +0.01 | +0.90 |
| SMH | 62 | 68% | 42 | 76% | +0.02 | +0.01 | +0.68 |
| NVDA | 68 | 63% | 43 | 72% | +0.00 | +0.00 | +0.12 |
| XLI | 65 | 71% | 46 | 85% | -0.01 | -0.01 | -0.42 |
| GC=F | 68 | 62% | 42 | 79% | -0.02 | -0.01 | -0.66 |
| AMZN | 61 | 79% | 48 | 81% | -0.02 | -0.02 | -1.07 |
| MSFT | 57 | 79% | 45 | 78% | -0.05 | -0.04 | -2.47 |
| XLC | 62 | 79% | 49 | 80% | -0.07 | -0.05 | -3.19 |
| SPY | 51 | 75% | 38 | 71% | -0.07 | -0.06 | -2.82 |
| XLP | 66 | 68% | 45 | 67% | -0.08 | -0.06 | -3.67 |
| IWM | 71 | 65% | 46 | 70% | -0.09 | -0.06 | -4.17 |
| XLV | 68 | 74% | 50 | 66% | -0.11 | -0.08 | -5.56 |
| XLF | 73 | 79% | 58 | 66% | -0.12 | -0.10 | -7.00 |
| AAPL | 60 | 72% | 43 | 70% | -0.15 | -0.11 | -6.60 |
| XLE | 70 | 74% | 52 | 62% | -0.15 | -0.11 | -7.78 |
| GLD | 73 | 68% | 50 | 72% | -0.17 | -0.12 | -8.54 |
| XLY | 60 | 77% | 46 | 74% | -0.16 | -0.12 | -7.23 |
| TSLA | 55 | 75% | 41 | 73% | -0.17 | -0.13 | -7.12 |
| GOOGL | 58 | 83% | 48 | 56% | -0.42 | -0.35 | -20.20 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
