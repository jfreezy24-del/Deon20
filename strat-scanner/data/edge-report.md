# Edge Report — live signal record

_Generated 2026-08-30_ · **253** settled signals from 2026-08-17 to 2026-08-30 · 25 open, 46 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **78%** of published signals actually triggered (198 of 253) — the rest expired unfilled.
- Of those trades, **76%** reached target 1, 18% stopped out, 6% timed out.
- **Expectancy +0.01R per trade taken**, +0.01R per signal published.
- Promised **0.85R** to target 1 on average; delivered **+0.01R**.
- Trades ran **0.67R** in favour at best and **0.57R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 97 | 75% | 73 | 81% | -0.04 | -0.03 | -3.24 |
| 55–64 | 124 | 79% | 98 | 72% | +0.03 | +0.03 | +3.39 |
| 65–74 (High) | 28 | 86% | 24 | 75% | +0.06 | +0.05 | +1.35 |
| 75+ (High) | 4 | 75% | 3 | 100% | +0.47 | +0.35 | +1.41 |

Spearman rank correlation between confidence and realised R: **0.179** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 47 | +0.21 | 206 | -0.03 | +0.25 | 59% vs 80% |
| `ftfc-full` | 204 | +0.04 | 49 | -0.13 | +0.17 | 78% vs 68% |
| `close-location` | 154 | +0.03 | 99 | -0.02 | +0.05 | 79% vs 71% |
| `rr-ok` | 69 | +0.04 | 184 | +0.00 | +0.04 | 36% vs 88% |
| `reversal-backed` | 146 | +0.02 | 107 | +0.00 | +0.02 | 82% vs 68% |
| `base` | 253 | +0.01 | 0 | +0.00 | +0.01 | 76% vs 0% |
| `rr-poor` | 178 | +0.01 | 75 | +0.02 | -0.01 | 88% vs 37% |
| `in-force` | 143 | -0.00 | 110 | +0.03 | -0.03 | 79% vs 69% |
| `compression` | 71 | -0.02 | 182 | +0.02 | -0.05 | 83% vs 74% |
| `ftfc-aligned` | 49 | -0.13 | 204 | +0.04 | -0.17 | 68% vs 78% |
| `ftfc-opposed` | 49 | -0.13 | 204 | +0.04 | -0.17 | 68% vs 78% |
| `rr-strong` | 6 | -0.20 | 247 | +0.02 | -0.22 | 50% vs 77% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 71 | 85% | 60 | 77% | -0.05 | -0.04 | -3.06 |
| 2-2 Continuation | 70 | 76% | 53 | 64% | +0.09 | +0.07 | +4.78 |
| 2-1-2 Reversal | 33 | 85% | 28 | 86% | +0.08 | +0.07 | +2.18 |
| 2-1-2 Continuation | 22 | 73% | 16 | 88% | -0.19 | -0.14 | -2.99 |
| Rev Strat (1-2-2) Reversal | 22 | 68% | 15 | 93% | +0.14 | +0.10 | +2.14 |
| 3-1-2 Reversal | 11 | 55% | 6 | 83% | +0.19 | +0.11 | +1.17 |
| 3-2 Continuation | 10 | 80% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 9 | 89% | 8 | 88% | +0.06 | +0.05 | +0.47 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 173 | 76% | 131 | 75% | +0.04 | +0.03 | +5.67 |
| W | 65 | 80% | 52 | 79% | -0.09 | -0.07 | -4.74 |
| M | 15 | 100% | 15 | 80% | +0.13 | +0.13 | +1.99 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 204 | 77% | 158 | 78% | +0.06 | +0.04 | +9.17 |
| Mixed | 49 | 82% | 40 | 68% | -0.16 | -0.13 | -6.25 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 107 | 76% | 81 | 68% | +0.00 | +0.00 | +0.03 |
| Reversal | 146 | 80% | 117 | 82% | +0.02 | +0.02 | +2.89 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 182 | 79% | 144 | 74% | +0.03 | +0.02 | +4.43 |
| Inside-bar compression (X-1-?) | 71 | 76% | 54 | 83% | -0.03 | -0.02 | -1.51 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BTC-USD | 5 | 100% | 5 | 100% | +0.78 | +0.78 | +3.92 |
| LTC-USD | 6 | 83% | 5 | 80% | +0.58 | +0.49 | +2.92 |
| ETH-USD | 5 | 100% | 5 | 60% | +0.35 | +0.35 | +1.76 |
| GLD | 10 | 60% | 6 | 100% | +0.54 | +0.32 | +3.24 |
| XRP-USD | 9 | 78% | 7 | 57% | +0.33 | +0.26 | +2.33 |
| XLI | 8 | 75% | 6 | 100% | +0.29 | +0.22 | +1.75 |
| META | 10 | 80% | 8 | 100% | +0.27 | +0.22 | +2.17 |
| TSLA | 5 | 80% | 4 | 100% | +0.23 | +0.18 | +0.90 |
| DIA | 10 | 60% | 6 | 100% | +0.29 | +0.17 | +1.73 |
| SPY | 5 | 60% | 3 | 100% | +0.28 | +0.17 | +0.84 |
| QQQ | 7 | 100% | 7 | 100% | +0.10 | +0.10 | +0.68 |
| XLC | 5 | 100% | 5 | 100% | +0.09 | +0.09 | +0.47 |
| AMZN | 9 | 89% | 8 | 88% | +0.09 | +0.08 | +0.69 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XLF | 9 | 89% | 8 | 88% | +0.04 | +0.04 | +0.36 |
| JUP-USD | 7 | 14% | 1 | 100% | +0.14 | +0.02 | +0.14 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| HYPE-USD | 5 | 100% | 5 | 20% | +0.01 | +0.01 | +0.04 |
| DOGE-USD | 9 | 78% | 7 | 29% | +0.00 | +0.00 | +0.02 |
| SMH | 6 | 100% | 6 | 83% | -0.01 | -0.01 | -0.04 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 7 | 14% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| MSFT | 6 | 100% | 6 | 67% | -0.07 | -0.07 | -0.45 |
| GOOGL | 7 | 100% | 7 | 71% | -0.08 | -0.08 | -0.53 |
| XLE | 9 | 78% | 7 | 71% | -0.10 | -0.08 | -0.73 |
| XLU | 9 | 89% | 8 | 75% | -0.12 | -0.10 | -0.94 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| AAPL | 5 | 100% | 5 | 60% | -0.38 | -0.38 | -1.89 |
| TLT | 7 | 86% | 6 | 50% | -0.60 | -0.52 | -3.61 |
| NVDA | 10 | 80% | 8 | 63% | -0.65 | -0.52 | -5.17 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
