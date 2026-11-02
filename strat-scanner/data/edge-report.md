# Edge Report — live signal record

_Generated 2026-11-02_ · **1574** settled signals from 2026-08-17 to 2026-11-02 · 32 open, 31 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1067 of 1574) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 23% stopped out, 4% timed out.
- **Expectancy +2.83R per trade taken**, +1.92R per signal published.
- Promised **0.72R** to target 1 on average; delivered **+2.83R**.
- Trades ran **3.53R** in favour at best and **0.65R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 761 | 63% | 481 | 79% | +2.64 | +1.67 | +1268.84 |
| 55–64 | 653 | 71% | 463 | 68% | +3.75 | +2.66 | +1735.95 |
| 65–74 (High) | 144 | 76% | 110 | 66% | +0.05 | +0.04 | +5.97 |
| 75+ (High) | 16 | 81% | 13 | 69% | +0.40 | +0.32 | +5.16 |

Spearman rank correlation between confidence and realised R: **0.032** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 464 | +4.13 | 1110 | +0.99 | +3.15 | 76% vs 71% |
| `ftfc-aligned` | 333 | +3.89 | 1241 | +1.39 | +2.50 | 70% vs 74% |
| `ftfc-opposed` | 333 | +3.89 | 1241 | +1.39 | +2.50 | 70% vs 74% |
| `base` | 1574 | +1.92 | 0 | +0.00 | +1.92 | 73% vs 0% |
| `rr-poor` | 1081 | +2.26 | 493 | +1.16 | +1.10 | 84% vs 39% |
| `close-location` | 805 | +2.15 | 769 | +1.67 | +0.49 | 75% vs 70% |
| `reversal-backed` | 907 | +2.02 | 667 | +1.77 | +0.26 | 78% vs 65% |
| `rr-ok` | 456 | +1.24 | 1118 | +2.19 | -0.95 | 38% vs 83% |
| `rr-strong` | 37 | +0.20 | 1537 | +1.96 | -1.75 | 42% vs 74% |
| `volume` | 313 | +0.03 | 1261 | +2.38 | -2.35 | 64% vs 75% |
| `ftfc-full` | 1239 | +1.39 | 335 | +3.87 | -2.48 | 74% vs 70% |
| `in-force` | 732 | -0.03 | 842 | +3.61 | -3.63 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 457 | 74% | 336 | 77% | -0.03 | -0.02 | -9.38 |
| 2-2 Continuation | 398 | 64% | 256 | 59% | +2.19 | +1.41 | +560.56 |
| 2-1-2 Reversal | 189 | 67% | 127 | 76% | +0.03 | +0.02 | +3.97 |
| 2-1-2 Continuation | 165 | 71% | 117 | 79% | +5.24 | +3.71 | +612.88 |
| Rev Strat (1-2-2) Reversal | 114 | 58% | 66 | 85% | +0.06 | +0.03 | +3.85 |
| 3-2-2 Reversal | 80 | 60% | 48 | 83% | +11.25 | +6.75 | +539.90 |
| 3-1-2 Reversal | 69 | 59% | 41 | 78% | +31.65 | +18.81 | +1297.61 |
| 3-2 Continuation | 61 | 77% | 47 | 66% | +0.06 | +0.05 | +2.75 |
| 1-1-2 Continuation | 41 | 71% | 29 | 69% | +0.13 | +0.09 | +3.78 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 983 | 64% | 630 | 72% | -0.03 | -0.02 | -18.11 |
| W | 440 | 71% | 311 | 77% | +1.81 | +1.28 | +561.98 |
| M | 151 | 83% | 126 | 68% | +19.62 | +16.37 | +2472.05 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1239 | 65% | 804 | 74% | +2.14 | +1.39 | +1720.57 |
| Mixed | 333 | 79% | 263 | 70% | +4.93 | +3.89 | +1295.35 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 665 | 68% | 449 | 65% | +2.63 | +1.77 | +1179.97 |
| Reversal | 909 | 68% | 618 | 78% | +2.97 | +2.02 | +1835.95 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1110 | 68% | 753 | 71% | +1.46 | +0.99 | +1097.67 |
| Inside-bar compression (X-1-?) | 464 | 68% | 314 | 76% | +6.11 | +4.13 | +1918.25 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 67 | 19% | 13 | 100% | +233.48 | +45.30 | +3035.27 |
| TLT | 49 | 69% | 34 | 79% | +0.32 | +0.22 | +10.99 |
| LTC-USD | 28 | 82% | 23 | 87% | +0.27 | +0.22 | +6.26 |
| AMD | 49 | 76% | 37 | 81% | +0.18 | +0.13 | +6.52 |
| DIA | 51 | 82% | 42 | 86% | +0.10 | +0.08 | +4.11 |
| BTC-USD | 36 | 83% | 30 | 77% | +0.09 | +0.08 | +2.73 |
| XLK | 49 | 67% | 33 | 79% | +0.10 | +0.07 | +3.46 |
| XLI | 52 | 65% | 34 | 88% | +0.10 | +0.06 | +3.35 |
| META | 52 | 54% | 28 | 75% | +0.11 | +0.06 | +3.07 |
| XLU | 55 | 71% | 39 | 64% | +0.05 | +0.03 | +1.91 |
| QQQ | 46 | 76% | 35 | 71% | +0.04 | +0.03 | +1.56 |
| XLC | 46 | 76% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| AMZN | 49 | 78% | 38 | 82% | +0.03 | +0.02 | +1.04 |
| EURUSD=X | 50 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| NVDA | 49 | 65% | 32 | 69% | +0.01 | +0.00 | +0.22 |
| XLF | 52 | 81% | 42 | 71% | -0.02 | -0.01 | -0.69 |
| ETH-USD | 34 | 79% | 27 | 70% | -0.02 | -0.02 | -0.65 |
| SOL-USD | 39 | 74% | 29 | 69% | -0.03 | -0.03 | -1.00 |
| XRP-USD | 44 | 59% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| MSFT | 40 | 80% | 32 | 75% | -0.05 | -0.04 | -1.62 |
| XLY | 42 | 81% | 34 | 79% | -0.05 | -0.04 | -1.76 |
| SPY | 40 | 73% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| HYPE-USD | 34 | 79% | 27 | 56% | -0.09 | -0.07 | -2.47 |
| XLV | 48 | 73% | 35 | 66% | -0.10 | -0.08 | -3.63 |
| DOGE-USD | 40 | 70% | 28 | 54% | -0.12 | -0.08 | -3.37 |
| XLP | 50 | 62% | 31 | 68% | -0.14 | -0.09 | -4.47 |
| GC=F | 50 | 62% | 31 | 74% | -0.15 | -0.09 | -4.63 |
| AAPL | 45 | 76% | 34 | 71% | -0.13 | -0.09 | -4.25 |
| TSLA | 44 | 73% | 32 | 75% | -0.17 | -0.12 | -5.30 |
| GLD | 52 | 71% | 37 | 70% | -0.22 | -0.15 | -8.02 |
| XLE | 50 | 76% | 38 | 55% | -0.25 | -0.19 | -9.40 |
| GOOGL | 42 | 86% | 36 | 61% | -0.31 | -0.26 | -11.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
