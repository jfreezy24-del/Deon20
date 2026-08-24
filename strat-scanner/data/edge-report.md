# Edge Report — live signal record

_Generated 2026-08-24_ · **135** settled signals from 2026-08-17 to 2026-08-24 · 30 open, 53 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **80%** of published signals actually triggered (108 of 135) — the rest expired unfilled.
- Of those trades, **85%** reached target 1, 15% stopped out, 0% timed out.
- **Expectancy +0.09R per trade taken**, +0.08R per signal published.
- Promised **0.60R** to target 1 on average; delivered **+0.09R**.
- Trades ran **0.72R** in favour at best and **0.52R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 58 | 76% | 44 | 82% | -0.05 | -0.04 | -2.03 |
| 55–64 | 61 | 82% | 50 | 84% | +0.12 | +0.10 | +5.99 |
| 65–74 (High) | 13 | 92% | 12 | 100% | +0.41 | +0.38 | +4.89 |
| 75+ (High) | 3 | 67% | 2 | 100% | +0.64 | +0.42 | +1.27 |

Spearman rank correlation between confidence and realised R: **0.303** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 23 | +0.39 | 112 | +0.01 | +0.38 | 88% vs 85% |
| `ftfc-full` | 111 | +0.12 | 24 | -0.11 | +0.23 | 86% vs 81% |
| `rr-strong` | 3 | +0.29 | 132 | +0.07 | +0.22 | 100% vs 85% |
| `rr-ok` | 35 | +0.18 | 100 | +0.04 | +0.15 | 65% vs 90% |
| `reversal-backed` | 76 | +0.12 | 59 | +0.02 | +0.10 | 92% vs 75% |
| `base` | 135 | +0.08 | 0 | +0.00 | +0.08 | 85% vs 0% |
| `close-location` | 81 | +0.09 | 54 | +0.05 | +0.05 | 87% vs 82% |
| `compression` | 37 | +0.08 | 98 | +0.07 | +0.01 | 90% vs 83% |
| `rr-poor` | 97 | +0.03 | 38 | +0.19 | -0.16 | 90% vs 67% |
| `in-force` | 81 | -0.01 | 54 | +0.20 | -0.20 | 84% vs 89% |
| `ftfc-aligned` | 24 | -0.11 | 111 | +0.12 | -0.23 | 81% vs 86% |
| `ftfc-opposed` | 24 | -0.11 | 111 | +0.12 | -0.23 | 81% vs 86% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 42 | 74% | 31 | 71% | +0.07 | +0.05 | +2.21 |
| 2-2 Reversal | 41 | 85% | 35 | 91% | +0.14 | +0.12 | +4.77 |
| 2-1-2 Reversal | 17 | 94% | 16 | 94% | +0.26 | +0.25 | +4.17 |
| 2-1-2 Continuation | 11 | 82% | 9 | 89% | -0.05 | -0.04 | -0.48 |
| Rev Strat (1-2-2) Reversal | 10 | 90% | 9 | 89% | +0.01 | +0.01 | +0.06 |
| 3-1-2 Reversal | 6 | 50% | 3 | 100% | +0.06 | +0.03 | +0.18 |
| 1-1-2 Continuation | 3 | 100% | 3 | 67% | -0.29 | -0.29 | -0.87 |
| 3-2 Continuation | 3 | 33% | 1 | 100% | +0.09 | +0.03 | +0.09 |
| 3-2-2 Reversal | 2 | 50% | 1 | 100% | +0.00 | +0.00 | +0.00 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 95 | 72% | 68 | 85% | +0.08 | +0.06 | +5.53 |
| W | 28 | 100% | 28 | 86% | +0.07 | +0.07 | +1.91 |
| M | 12 | 100% | 12 | 83% | +0.22 | +0.22 | +2.69 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 111 | 78% | 87 | 86% | +0.15 | +0.12 | +12.89 |
| Mixed | 24 | 88% | 21 | 81% | -0.13 | -0.11 | -2.76 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 59 | 75% | 44 | 75% | +0.02 | +0.02 | +0.94 |
| Reversal | 76 | 84% | 64 | 92% | +0.14 | +0.12 | +9.19 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 98 | 79% | 77 | 83% | +0.09 | +0.07 | +7.13 |
| Inside-bar compression (X-1-?) | 37 | 84% | 31 | 90% | +0.10 | +0.08 | +3.00 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 4 | 100% | 4 | 100% | +0.90 | +0.90 | +3.59 |
| BTC-USD | 3 | 100% | 3 | 100% | +0.76 | +0.76 | +2.28 |
| XRP-USD | 5 | 80% | 4 | 100% | +0.80 | +0.64 | +3.22 |
| HYPE-USD | 1 | 100% | 1 | 100% | +0.46 | +0.46 | +0.46 |
| XLE | 6 | 67% | 4 | 100% | +0.55 | +0.37 | +2.22 |
| GLD | 5 | 80% | 4 | 100% | +0.45 | +0.36 | +1.82 |
| DOGE-USD | 5 | 80% | 4 | 50% | +0.36 | +0.29 | +1.45 |
| XLI | 6 | 83% | 5 | 100% | +0.30 | +0.25 | +1.48 |
| GOOGL | 3 | 100% | 3 | 100% | +0.18 | +0.18 | +0.54 |
| DIA | 5 | 60% | 3 | 100% | +0.27 | +0.16 | +0.80 |
| AMD | 2 | 100% | 2 | 100% | +0.13 | +0.13 | +0.26 |
| TSLA | 3 | 100% | 3 | 100% | +0.12 | +0.12 | +0.36 |
| XLC | 4 | 100% | 4 | 100% | +0.12 | +0.12 | +0.47 |
| ETH-USD | 2 | 100% | 2 | 100% | +0.11 | +0.11 | +0.23 |
| SPY | 4 | 50% | 2 | 100% | +0.19 | +0.10 | +0.39 |
| META | 6 | 83% | 5 | 100% | +0.06 | +0.05 | +0.29 |
| AMZN | 5 | 100% | 5 | 80% | +0.03 | +0.03 | +0.15 |
| QQQ | 3 | 100% | 3 | 100% | +0.03 | +0.03 | +0.09 |
| XLF | 5 | 80% | 4 | 75% | +0.02 | +0.02 | +0.08 |
| IWM | 4 | 75% | 3 | 100% | +0.01 | +0.01 | +0.04 |
| EURUSD=X | 5 | 0% | 0 | — | — | +0.00 | +0.00 |
| GC=F | 4 | 75% | 3 | 100% | +0.00 | +0.00 | +0.00 |
| JUP-USD | 2 | 0% | 0 | — | — | +0.00 | +0.00 |
| MSFT | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| SMH | 2 | 100% | 2 | 100% | +0.00 | +0.00 | +0.00 |
| XLP | 1 | 100% | 1 | 100% | +0.00 | +0.00 | +0.00 |
| XLU | 7 | 86% | 6 | 83% | -0.06 | -0.05 | -0.37 |
| XLY | 5 | 100% | 5 | 80% | -0.10 | -0.10 | -0.52 |
| XLK | 5 | 80% | 4 | 75% | -0.18 | -0.14 | -0.70 |
| AAPL | 3 | 100% | 3 | 67% | -0.30 | -0.30 | -0.89 |
| SOL-USD | 7 | 86% | 6 | 33% | -0.41 | -0.36 | -2.49 |
| TLT | 4 | 100% | 4 | 75% | -0.40 | -0.40 | -1.61 |
| NVDA | 6 | 67% | 4 | 50% | -0.62 | -0.41 | -2.47 |
| XLV | 2 | 50% | 1 | 0% | -1.00 | -0.50 | -1.00 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
