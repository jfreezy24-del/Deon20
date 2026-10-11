# Edge Report — live signal record

_Generated 2026-10-11_ · **1138** settled signals from 2026-08-17 to 2026-10-10 · 37 open, 56 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (789 of 1138) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +3.83R per trade taken**, +2.65R per signal published.
- Promised **0.74R** to target 1 on average; delivered **+3.83R**.
- Trades ran **4.53R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 531 | 64% | 341 | 80% | +3.77 | +2.42 | +1286.59 |
| 55–64 | 484 | 72% | 350 | 69% | +4.95 | +3.58 | +1733.73 |
| 65–74 (High) | 109 | 80% | 87 | 63% | -0.02 | -0.02 | -1.88 |
| 75+ (High) | 14 | 79% | 11 | 73% | +0.14 | +0.11 | +1.52 |

Spearman rank correlation between confidence and realised R: **0.023** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 343 | +5.58 | 795 | +1.39 | +4.19 | 76% vs 72% |
| `ftfc-aligned` | 247 | +5.25 | 891 | +1.93 | +3.31 | 69% vs 74% |
| `ftfc-opposed` | 247 | +5.25 | 891 | +1.93 | +3.31 | 69% vs 74% |
| `base` | 1138 | +2.65 | 0 | +0.00 | +2.65 | 73% vs 0% |
| `rr-poor` | 784 | +3.13 | 354 | +1.60 | +1.53 | 85% vs 37% |
| `close-location` | 601 | +2.90 | 537 | +2.38 | +0.52 | 75% vs 70% |
| `reversal-backed` | 657 | +2.78 | 481 | +2.48 | +0.30 | 78% vs 67% |
| `rr-ok` | 326 | +1.74 | 812 | +3.02 | -1.28 | 38% vs 83% |
| `rr-strong` | 28 | -0.03 | 1110 | +2.72 | -2.75 | 32% vs 74% |
| `volume` | 239 | +0.06 | 899 | +3.34 | -3.28 | 63% vs 75% |
| `ftfc-full` | 890 | +1.94 | 248 | +5.23 | -3.29 | 74% vs 69% |
| `in-force` | 550 | -0.02 | 588 | +5.15 | -5.18 | 76% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 328 | 74% | 244 | 77% | -0.05 | -0.03 | -11.01 |
| 2-2 Continuation | 287 | 65% | 186 | 59% | +3.06 | +1.99 | +569.70 |
| 2-1-2 Reversal | 139 | 70% | 97 | 75% | -0.02 | -0.02 | -2.18 |
| 2-1-2 Continuation | 115 | 75% | 86 | 78% | +7.14 | +5.34 | +614.05 |
| Rev Strat (1-2-2) Reversal | 85 | 61% | 52 | 85% | +0.06 | +0.04 | +3.02 |
| 3-1-2 Reversal | 56 | 61% | 34 | 79% | +38.18 | +23.18 | +1298.25 |
| 3-2-2 Reversal | 50 | 58% | 29 | 79% | +18.57 | +10.77 | +538.60 |
| 3-2 Continuation | 45 | 76% | 34 | 79% | +0.16 | +0.12 | +5.38 |
| 1-1-2 Continuation | 33 | 82% | 27 | 70% | +0.15 | +0.13 | +4.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 708 | 66% | 466 | 72% | -0.01 | -0.01 | -5.88 |
| W | 309 | 72% | 223 | 78% | +2.56 | +1.85 | +571.93 |
| M | 121 | 83% | 100 | 66% | +24.54 | +20.28 | +2453.91 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 890 | 67% | 596 | 74% | +2.89 | +1.94 | +1723.56 |
| Mixed | 247 | 78% | 193 | 69% | +6.72 | +5.25 | +1296.41 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 480 | 69% | 333 | 67% | +3.58 | +2.49 | +1193.29 |
| Reversal | 658 | 69% | 456 | 78% | +4.01 | +2.78 | +1826.67 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 795 | 69% | 545 | 72% | +2.03 | +1.39 | +1105.69 |
| Inside-bar compression (X-1-?) | 343 | 71% | 244 | 76% | +7.85 | +5.58 | +1914.28 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 49 | 22% | 11 | 100% | +275.81 | +61.92 | +3033.94 |
| LTC-USD | 18 | 83% | 15 | 93% | +0.42 | +0.35 | +6.37 |
| AMD | 36 | 81% | 29 | 83% | +0.29 | +0.24 | +8.49 |
| TLT | 36 | 72% | 26 | 77% | +0.30 | +0.22 | +7.85 |
| DIA | 39 | 79% | 31 | 87% | +0.17 | +0.14 | +5.37 |
| ETH-USD | 24 | 79% | 19 | 84% | +0.16 | +0.13 | +3.04 |
| XLI | 36 | 67% | 24 | 92% | +0.17 | +0.12 | +4.17 |
| META | 43 | 51% | 22 | 77% | +0.15 | +0.08 | +3.27 |
| XLU | 41 | 80% | 33 | 64% | +0.09 | +0.07 | +2.95 |
| AMZN | 35 | 80% | 28 | 82% | +0.06 | +0.05 | +1.69 |
| XLF | 42 | 76% | 32 | 72% | +0.06 | +0.04 | +1.78 |
| BTC-USD | 25 | 92% | 23 | 74% | +0.04 | +0.04 | +0.96 |
| IWM | 39 | 64% | 25 | 72% | +0.04 | +0.03 | +0.99 |
| XLC | 33 | 76% | 25 | 88% | +0.02 | +0.01 | +0.47 |
| EURUSD=X | 39 | 8% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| XLK | 35 | 71% | 25 | 84% | +0.01 | +0.00 | +0.13 |
| XRP-USD | 37 | 65% | 24 | 71% | -0.02 | -0.01 | -0.47 |
| SOL-USD | 29 | 79% | 23 | 65% | -0.02 | -0.02 | -0.52 |
| GLD | 38 | 66% | 25 | 80% | -0.04 | -0.03 | -0.95 |
| SMH | 36 | 67% | 24 | 71% | -0.05 | -0.03 | -1.23 |
| SPY | 29 | 76% | 22 | 68% | -0.06 | -0.04 | -1.23 |
| MSFT | 29 | 83% | 24 | 75% | -0.08 | -0.07 | -1.96 |
| XLY | 28 | 86% | 24 | 79% | -0.09 | -0.07 | -2.10 |
| DOGE-USD | 30 | 70% | 21 | 48% | -0.11 | -0.08 | -2.36 |
| AAPL | 32 | 78% | 25 | 72% | -0.14 | -0.11 | -3.56 |
| TSLA | 34 | 76% | 26 | 73% | -0.15 | -0.11 | -3.81 |
| HYPE-USD | 23 | 78% | 18 | 50% | -0.15 | -0.12 | -2.66 |
| QQQ | 29 | 79% | 23 | 65% | -0.18 | -0.14 | -4.10 |
| XLV | 29 | 76% | 22 | 64% | -0.20 | -0.15 | -4.43 |
| GC=F | 34 | 65% | 22 | 68% | -0.25 | -0.16 | -5.39 |
| NVDA | 33 | 61% | 20 | 65% | -0.29 | -0.18 | -5.87 |
| XLE | 38 | 71% | 27 | 63% | -0.26 | -0.19 | -7.07 |
| XLP | 32 | 75% | 24 | 58% | -0.30 | -0.22 | -7.16 |
| GOOGL | 28 | 86% | 24 | 58% | -0.30 | -0.25 | -7.12 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
