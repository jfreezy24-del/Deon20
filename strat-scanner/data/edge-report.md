# Edge Report — live signal record

_Generated 2026-08-31_ · **266** settled signals from 2026-08-17 to 2026-08-30 · 24 open, 40 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **76%** of published signals actually triggered (203 of 266) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 19% stopped out, 6% timed out.
- **Expectancy -0.01R per trade taken**, -0.01R per signal published.
- Promised **0.85R** to target 1 on average; delivered **-0.01R**.
- Trades ran **0.67R** in favour at best and **0.59R** against at worst; **0%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 105 | 70% | 74 | 80% | -0.06 | -0.04 | -4.24 |
| 55–64 | 128 | 79% | 101 | 70% | +0.00 | +0.00 | +0.39 |
| 65–74 (High) | 29 | 86% | 25 | 72% | +0.03 | +0.02 | +0.66 |
| 75+ (High) | 4 | 75% | 3 | 100% | +0.47 | +0.35 | +1.41 |

Spearman rank correlation between confidence and realised R: **0.166** — **holding up** — the score genuinely ranks signals.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `volume` | 54 | +0.17 | 212 | -0.05 | +0.22 | 58% vs 78% |
| `ftfc-full` | 210 | +0.04 | 56 | -0.18 | +0.22 | 78% vs 61% |
| `rr-ok` | 75 | +0.03 | 191 | -0.02 | +0.04 | 36% vs 85% |
| `close-location` | 163 | +0.00 | 103 | -0.03 | +0.03 | 76% vs 70% |
| `in-force` | 144 | -0.00 | 122 | -0.01 | +0.00 | 78% vs 64% |
| `reversal-backed` | 152 | -0.01 | 114 | -0.01 | -0.00 | 79% vs 67% |
| `base` | 266 | -0.01 | 0 | +0.00 | -0.01 | 74% vs 0% |
| `rr-poor` | 185 | -0.01 | 81 | +0.01 | -0.02 | 86% vs 36% |
| `compression` | 75 | -0.07 | 191 | +0.02 | -0.09 | 78% vs 73% |
| `rr-strong` | 6 | -0.20 | 260 | -0.00 | -0.20 | 50% vs 75% |
| `ftfc-aligned` | 56 | -0.18 | 210 | +0.04 | -0.22 | 61% vs 78% |
| `ftfc-opposed` | 56 | -0.18 | 210 | +0.04 | -0.22 | 61% vs 78% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 76 | 71% | 54 | 63% | +0.08 | +0.05 | +4.08 |
| 2-2 Reversal | 72 | 83% | 60 | 77% | -0.05 | -0.04 | -3.06 |
| 2-1-2 Reversal | 34 | 85% | 29 | 83% | +0.04 | +0.03 | +1.18 |
| Rev Strat (1-2-2) Reversal | 23 | 65% | 15 | 93% | +0.14 | +0.09 | +2.14 |
| 2-1-2 Continuation | 22 | 73% | 16 | 88% | -0.19 | -0.14 | -2.99 |
| 3-1-2 Reversal | 14 | 64% | 9 | 56% | -0.20 | -0.13 | -1.83 |
| 3-2 Continuation | 11 | 73% | 8 | 63% | +0.01 | +0.01 | +0.10 |
| 3-2-2 Reversal | 9 | 89% | 8 | 88% | +0.06 | +0.05 | +0.47 |
| 1-1-2 Continuation | 5 | 80% | 4 | 50% | -0.47 | -0.37 | -1.87 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 181 | 75% | 136 | 72% | +0.01 | +0.01 | +0.97 |
| W | 70 | 74% | 52 | 79% | -0.09 | -0.07 | -4.74 |
| M | 15 | 100% | 15 | 80% | +0.13 | +0.13 | +1.99 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 210 | 76% | 159 | 78% | +0.05 | +0.04 | +8.48 |
| Mixed | 56 | 79% | 44 | 61% | -0.23 | -0.18 | -10.25 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 114 | 72% | 82 | 67% | -0.01 | -0.01 | -0.67 |
| Reversal | 152 | 80% | 121 | 79% | -0.01 | -0.01 | -1.11 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 191 | 76% | 145 | 73% | +0.03 | +0.02 | +3.73 |
| Inside-bar compression (X-1-?) | 75 | 77% | 58 | 78% | -0.10 | -0.07 | -5.51 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LTC-USD | 7 | 71% | 5 | 80% | +0.58 | +0.42 | +2.92 |
| GLD | 10 | 60% | 6 | 100% | +0.54 | +0.32 | +3.24 |
| BTC-USD | 7 | 100% | 7 | 71% | +0.32 | +0.32 | +2.23 |
| ETH-USD | 6 | 83% | 5 | 60% | +0.35 | +0.29 | +1.76 |
| META | 10 | 80% | 8 | 100% | +0.27 | +0.22 | +2.17 |
| XLI | 9 | 67% | 6 | 100% | +0.29 | +0.19 | +1.75 |
| TSLA | 5 | 80% | 4 | 100% | +0.23 | +0.18 | +0.90 |
| DIA | 10 | 60% | 6 | 100% | +0.29 | +0.17 | +1.73 |
| SPY | 5 | 60% | 3 | 100% | +0.28 | +0.17 | +0.84 |
| XRP-USD | 12 | 67% | 8 | 50% | +0.17 | +0.11 | +1.33 |
| QQQ | 7 | 100% | 7 | 100% | +0.10 | +0.10 | +0.68 |
| XLC | 5 | 100% | 5 | 100% | +0.09 | +0.09 | +0.47 |
| AMZN | 9 | 89% | 8 | 88% | +0.09 | +0.08 | +0.69 |
| AMD | 6 | 100% | 6 | 100% | +0.07 | +0.07 | +0.44 |
| XLV | 5 | 80% | 4 | 75% | +0.08 | +0.06 | +0.32 |
| XLF | 10 | 80% | 8 | 88% | +0.04 | +0.04 | +0.36 |
| JUP-USD | 8 | 13% | 1 | 100% | +0.14 | +0.02 | +0.14 |
| XLP | 6 | 67% | 4 | 100% | +0.02 | +0.02 | +0.10 |
| SMH | 6 | 100% | 6 | 83% | -0.01 | -0.01 | -0.04 |
| XLY | 9 | 89% | 8 | 88% | -0.02 | -0.02 | -0.16 |
| EURUSD=X | 7 | 14% | 1 | 0% | -0.16 | -0.02 | -0.16 |
| XLK | 8 | 88% | 7 | 86% | -0.07 | -0.06 | -0.52 |
| MSFT | 6 | 100% | 6 | 67% | -0.07 | -0.07 | -0.45 |
| GOOGL | 7 | 100% | 7 | 71% | -0.08 | -0.08 | -0.53 |
| XLE | 9 | 78% | 7 | 71% | -0.10 | -0.08 | -0.73 |
| DOGE-USD | 10 | 80% | 8 | 25% | -0.12 | -0.10 | -0.98 |
| XLU | 9 | 89% | 8 | 75% | -0.12 | -0.10 | -0.94 |
| IWM | 8 | 75% | 6 | 67% | -0.20 | -0.15 | -1.20 |
| HYPE-USD | 6 | 100% | 6 | 17% | -0.16 | -0.16 | -0.96 |
| SOL-USD | 10 | 70% | 7 | 43% | -0.35 | -0.24 | -2.44 |
| GC=F | 11 | 55% | 6 | 50% | -0.67 | -0.37 | -4.04 |
| AAPL | 5 | 100% | 5 | 60% | -0.38 | -0.38 | -1.89 |
| NVDA | 11 | 73% | 8 | 63% | -0.65 | -0.47 | -5.17 |
| TLT | 7 | 86% | 6 | 50% | -0.60 | -0.52 | -3.61 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
