# Edge Report — live signal record

_Generated 2026-11-25_ · **2098** settled signals from 2026-08-17 to 2026-11-25 · 45 open, 49 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1437 of 2098) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.11R per trade taken**, +1.44R per signal published.
- Promised **0.70R** to target 1 on average; delivered **+2.11R**.
- Trades ran **2.82R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 985 | 64% | 632 | 81% | +2.02 | +1.29 | +1274.27 |
| 55–64 | 882 | 71% | 628 | 69% | +2.76 | +1.97 | +1735.40 |
| 65–74 (High) | 208 | 76% | 158 | 65% | +0.09 | +0.07 | +14.28 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.017** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 632 | +3.04 | 1466 | +0.76 | +2.29 | 77% vs 72% |
| `ftfc-aligned` | 445 | +2.94 | 1653 | +1.04 | +1.90 | 72% vs 74% |
| `ftfc-opposed` | 445 | +2.94 | 1653 | +1.04 | +1.90 | 72% vs 74% |
| `base` | 2098 | +1.44 | 0 | +0.00 | +1.44 | 74% vs 0% |
| `rr-poor` | 1443 | +1.68 | 655 | +0.92 | +0.76 | 84% vs 42% |
| `close-location` | 1090 | +1.60 | 1008 | +1.27 | +0.33 | 76% vs 70% |
| `reversal-backed` | 1167 | +1.57 | 931 | +1.29 | +0.27 | 78% vs 68% |
| `rr-ok` | 607 | +0.98 | 1491 | +1.63 | -0.66 | 42% vs 83% |
| `rr-strong` | 48 | +0.24 | 2050 | +1.47 | -1.23 | 42% vs 74% |
| `volume` | 484 | +0.03 | 1614 | +1.87 | -1.84 | 67% vs 75% |
| `ftfc-full` | 1651 | +1.04 | 447 | +2.93 | -1.89 | 74% vs 72% |
| `in-force` | 979 | -0.02 | 1119 | +2.72 | -2.74 | 75% vs 71% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 560 | 73% | 411 | 77% | -0.06 | -0.05 | -26.57 |
| 2-2 Continuation | 559 | 65% | 365 | 62% | +1.62 | +1.06 | +589.81 |
| 2-1-2 Reversal | 249 | 67% | 167 | 74% | +0.02 | +0.02 | +3.89 |
| 2-1-2 Continuation | 230 | 73% | 169 | 79% | +3.60 | +2.65 | +608.70 |
| Rev Strat (1-2-2) Reversal | 154 | 59% | 91 | 82% | +0.01 | +0.01 | +0.84 |
| 3-1-2 Reversal | 103 | 63% | 65 | 83% | +20.13 | +12.70 | +1308.59 |
| 3-2-2 Reversal | 103 | 61% | 63 | 81% | +8.57 | +5.24 | +540.05 |
| 3-2 Continuation | 90 | 81% | 73 | 73% | +0.05 | +0.04 | +3.49 |
| 1-1-2 Continuation | 50 | 66% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1312 | 65% | 851 | 73% | -0.02 | -0.01 | -12.89 |
| W | 578 | 72% | 414 | 78% | +1.38 | +0.99 | +571.95 |
| M | 208 | 83% | 172 | 69% | +14.37 | +11.89 | +2472.34 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1651 | 66% | 1088 | 74% | +1.58 | +1.04 | +1722.33 |
| Mixed | 445 | 78% | 349 | 72% | +3.75 | +2.94 | +1309.07 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 929 | 69% | 640 | 68% | +1.88 | +1.30 | +1204.59 |
| Reversal | 1169 | 68% | 797 | 78% | +2.29 | +1.56 | +1826.81 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1466 | 68% | 1003 | 72% | +1.10 | +0.76 | +1107.62 |
| Inside-bar compression (X-1-?) | 632 | 69% | 434 | 77% | +4.43 | +3.04 | +1923.78 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 88 | 18% | 16 | 100% | +189.76 | +34.50 | +3036.15 |
| AMD | 66 | 79% | 52 | 85% | +0.36 | +0.28 | +18.71 |
| TLT | 59 | 69% | 41 | 78% | +0.28 | +0.19 | +11.32 |
| LTC-USD | 45 | 82% | 37 | 84% | +0.19 | +0.15 | +6.85 |
| BTC-USD | 50 | 84% | 42 | 76% | +0.18 | +0.15 | +7.39 |
| SOL-USD | 56 | 75% | 42 | 74% | +0.12 | +0.09 | +4.94 |
| XRP-USD | 64 | 64% | 41 | 71% | +0.12 | +0.07 | +4.72 |
| XLK | 63 | 68% | 43 | 79% | +0.10 | +0.07 | +4.11 |
| META | 65 | 60% | 39 | 77% | +0.10 | +0.06 | +3.84 |
| DIA | 65 | 83% | 54 | 85% | +0.07 | +0.06 | +3.81 |
| ETH-USD | 54 | 78% | 42 | 71% | +0.07 | +0.06 | +3.00 |
| HYPE-USD | 44 | 80% | 35 | 66% | +0.06 | +0.05 | +2.27 |
| XLI | 63 | 70% | 44 | 89% | +0.06 | +0.04 | +2.58 |
| XLU | 71 | 70% | 50 | 66% | +0.03 | +0.02 | +1.74 |
| EURUSD=X | 63 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| DOGE-USD | 56 | 71% | 40 | 63% | +0.03 | +0.02 | +1.15 |
| QQQ | 60 | 75% | 45 | 69% | +0.02 | +0.01 | +0.90 |
| SMH | 61 | 67% | 41 | 76% | +0.01 | +0.01 | +0.59 |
| NVDA | 68 | 63% | 43 | 72% | +0.00 | +0.00 | +0.12 |
| IWM | 68 | 63% | 43 | 74% | -0.02 | -0.01 | -1.00 |
| AMZN | 60 | 78% | 47 | 81% | -0.02 | -0.02 | -1.07 |
| GC=F | 66 | 61% | 40 | 80% | -0.04 | -0.02 | -1.59 |
| XLC | 61 | 79% | 48 | 81% | -0.05 | -0.04 | -2.19 |
| MSFT | 57 | 79% | 45 | 78% | -0.05 | -0.04 | -2.47 |
| SPY | 51 | 75% | 38 | 71% | -0.07 | -0.06 | -2.82 |
| XLP | 66 | 68% | 45 | 67% | -0.08 | -0.06 | -3.67 |
| XLV | 68 | 74% | 50 | 66% | -0.11 | -0.08 | -5.56 |
| XLF | 71 | 79% | 56 | 66% | -0.11 | -0.08 | -6.03 |
| AAPL | 59 | 71% | 42 | 71% | -0.13 | -0.09 | -5.60 |
| XLY | 59 | 76% | 45 | 76% | -0.14 | -0.11 | -6.23 |
| XLE | 69 | 74% | 51 | 61% | -0.16 | -0.12 | -8.03 |
| TSLA | 55 | 75% | 41 | 73% | -0.17 | -0.13 | -7.12 |
| GLD | 71 | 68% | 48 | 71% | -0.22 | -0.15 | -10.58 |
| GOOGL | 56 | 82% | 46 | 54% | -0.44 | -0.36 | -20.24 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
