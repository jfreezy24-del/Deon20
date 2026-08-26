# Edge Report — live signal record

_Generated 2026-08-26_ · **179** settled signals from 2026-08-17 to 2026-08-26 · 31 open, 52 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **77%** of published signals actually triggered (137 of 179) — the rest expired unfilled.
- Of those trades, **82%** reached target 1, 15% stopped out, 3% timed out.
- **Expectancy +0.07R per trade taken**, +0.05R per signal published.
- Promised **0.61R** to target 1 on average; delivered **+0.07R**.
- Trades ran **0.68R** in favour at best and **0.53R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 80 | 74% | 59 | 81% | -0.05 | -0.04 | -3.02 |
| 55–64 | 78 | 79% | 62 | 79% | +0.13 | +0.10 | +7.86 |
| 65–74 (High) | 18 | 78% | 14 | 93% | +0.21 | +0.16 | +2.95 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.238** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 33 | +0.33 | 146 | -0.01 | +0.34 | 76% vs 83% |
| `rr-ok` | 47 | +0.18 | 132 | +0.00 | +0.18 | 56% vs 88% |
| `ftfc-full` | 143 | +0.07 | 36 | -0.01 | +0.08 | 83% vs 79% |
| `base` | 179 | +0.05 | 0 | +0.00 | +0.05 | 82% vs 0% |
| `reversal-backed` | 102 | +0.06 | 77 | +0.04 | +0.03 | 88% vs 74% |
| `close-location` | 103 | +0.05 | 76 | +0.05 | +0.00 | 82% vs 82% |
| `compression` | 51 | +0.05 | 128 | +0.05 | +0.00 | 89% vs 79% |
| `in-force` | 102 | +0.03 | 77 | +0.08 | -0.05 | 84% vs 74% |
| `ftfc-aligned` | 36 | -0.01 | 143 | +0.07 | -0.08 | 79% vs 83% |
| `ftfc-opposed` | 36 | -0.01 | 143 | +0.07 | -0.08 | 79% vs 83% |
| `rr-poor` | 128 | +0.01 | 51 | +0.15 | -0.13 | 89% vs 55% |
| `rr-strong` | 4 | -0.31 | 175 | +0.06 | -0.37 | 50% vs 82% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 53 | 85% | 45 | 82% | +0.02 | +0.02 | +0.82 |
| 2-2 Continuation | 49 | 76% | 37 | 70% | +0.11 | +0.08 | +4.10 |
| 2-1-2 Reversal | 22 | 82% | 18 | 94% | +0.26 | +0.21 | +4.61 |
| 2-1-2 Continuation | 15 | 67% | 10 | 90% | -0.04 | -0.03 | -0.38 |
| Rev Strat (1-2-2) Reversal | 15 | 73% | 11 | 91% | +0.03 | +0.02 | +0.35 |
| 3-1-2 Reversal | 9 | 44% | 4 | 100% | +0.08 | +0.04 | +0.34 |
| 3-2 Continuation | 8 | 75% | 6 | 83% | +0.16 | +0.12 | +0.94 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |
| 3-2-2 Reversal | 3 | 67% | 2 | 100% | +0.08 | +0.05 | +0.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 122 | 72% | 88 | 81% | +0.08 | +0.06 | +7.03 |
| W | 43 | 81% | 35 | 86% | +0.01 | +0.01 | +0.25 |
| M | 14 | 100% | 14 | 79% | +0.13 | +0.13 | +1.78 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 143 | 76% | 109 | 83% | +0.09 | +0.07 | +9.44 |
| Mixed | 36 | 78% | 28 | 79% | -0.01 | -0.01 | -0.38 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 77 | 74% | 57 | 74% | +0.05 | +0.04 | +2.78 |
| Reversal | 102 | 78% | 80 | 88% | +0.08 | +0.06 | +6.28 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 128 | 79% | 101 | 79% | +0.06 | +0.05 | +6.36 |
| Inside-bar compression (X-1-?) | 51 | 71% | 36 | 89% | +0.07 | +0.05 | +2.70 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BTC-USD | 4 | 100% | 4 | 100% | +0.94 | +0.94 | +3.78 |
| LTC-USD | 5 | 80% | 4 | 100% | +0.90 | +0.72 | +3.59 |
| HYPE-USD | 2 | 100% | 2 | 50% | +0.48 | +0.48 | +0.95 |
| XLE | 6 | 67% | 4 | 100% | +0.55 | +0.37 | +2.22 |
| GLD | 8 | 63% | 5 | 100% | +0.51 | +0.32 | +2.57 |
| XRP-USD | 7 | 71% | 5 | 80% | +0.44 | +0.32 | +2.22 |
| DOGE-USD | 6 | 67% | 4 | 50% | +0.36 | +0.24 | +1.45 |
| DIA | 8 | 63% | 5 | 100% | +0.34 | +0.22 | +1.72 |
| MSFT | 2 | 100% | 2 | 50% | +0.21 | +0.21 | +0.42 |
| XLI | 7 | 71% | 5 | 100% | +0.30 | +0.21 | +1.48 |
| GOOGL | 3 | 100% | 3 | 100% | +0.18 | +0.18 | +0.54 |
| ETH-USD | 3 | 100% | 3 | 67% | +0.16 | +0.16 | +0.49 |
| XLC | 4 | 100% | 4 | 100% | +0.12 | +0.12 | +0.47 |
| SPY | 4 | 50% | 2 | 100% | +0.19 | +0.10 | +0.39 |
| META | 7 | 86% | 6 | 100% | +0.11 | +0.10 | +0.67 |
| TSLA | 4 | 75% | 3 | 100% | +0.12 | +0.09 | +0.36 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| AMZN | 6 | 100% | 6 | 83% | +0.07 | +0.07 | +0.41 |
| QQQ | 5 | 100% | 5 | 100% | +0.06 | +0.06 | +0.32 |
| XLF | 7 | 86% | 6 | 83% | +0.04 | +0.04 | +0.25 |
| XLP | 5 | 60% | 3 | 100% | +0.03 | +0.02 | +0.10 |
| IWM | 5 | 60% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| JUP-USD | 4 | 0% | 0 | — | — | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| EURUSD=X | 6 | 17% | 1 | 0% | -0.16 | -0.03 | -0.16 |
| XLY | 6 | 100% | 6 | 83% | -0.05 | -0.05 | -0.29 |
| XLU | 7 | 86% | 6 | 83% | -0.06 | -0.05 | -0.37 |
| XLK | 6 | 83% | 5 | 80% | -0.10 | -0.09 | -0.52 |
| XLV | 3 | 67% | 2 | 50% | -0.42 | -0.28 | -0.84 |
| SOL-USD | 8 | 75% | 6 | 33% | -0.41 | -0.31 | -2.49 |
| NVDA | 7 | 71% | 5 | 60% | -0.48 | -0.35 | -2.42 |
| AAPL | 4 | 100% | 4 | 50% | -0.47 | -0.47 | -1.89 |
| TLT | 5 | 100% | 5 | 60% | -0.52 | -0.52 | -2.61 |
| GC=F | 7 | 71% | 5 | 60% | -0.84 | -0.60 | -4.21 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
