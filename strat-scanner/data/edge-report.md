# Edge Report — live signal record

_Generated 2026-11-20_ · **2013** settled signals from 2026-08-17 to 2026-11-20 · 33 open, 25 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1376 of 2013) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.20R per trade taken**, +1.50R per signal published.
- Promised **0.70R** to target 1 on average; delivered **+2.20R**.
- Trades ran **2.91R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 958 | 64% | 613 | 80% | +2.08 | +1.33 | +1274.07 |
| 55–64 | 839 | 71% | 599 | 68% | +2.88 | +2.06 | +1727.85 |
| 65–74 (High) | 193 | 75% | 145 | 68% | +0.12 | +0.09 | +17.09 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.017** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 614 | +3.13 | 1399 | +0.79 | +2.34 | 77% vs 72% |
| `ftfc-aligned` | 424 | +3.08 | 1589 | +1.08 | +2.00 | 71% vs 74% |
| `ftfc-opposed` | 424 | +3.08 | 1589 | +1.08 | +2.00 | 71% vs 74% |
| `base` | 2013 | +1.50 | 0 | +0.00 | +1.50 | 74% vs 0% |
| `rr-poor` | 1397 | +1.74 | 616 | +0.98 | +0.76 | 84% vs 41% |
| `close-location` | 1032 | +1.69 | 981 | +1.31 | +0.38 | 76% vs 70% |
| `reversal-backed` | 1135 | +1.61 | 878 | +1.37 | +0.24 | 78% vs 68% |
| `rr-ok` | 569 | +1.04 | 1444 | +1.69 | -0.65 | 41% vs 83% |
| `rr-strong` | 47 | +0.25 | 1966 | +1.53 | -1.29 | 42% vs 74% |
| `volume` | 438 | +0.04 | 1575 | +1.91 | -1.86 | 68% vs 75% |
| `ftfc-full` | 1587 | +1.08 | 426 | +3.07 | -1.98 | 74% vs 71% |
| `in-force` | 933 | -0.02 | 1080 | +2.82 | -2.83 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 550 | 73% | 404 | 77% | -0.07 | -0.05 | -27.24 |
| 2-2 Continuation | 521 | 66% | 343 | 63% | +1.71 | +1.13 | +588.07 |
| 2-1-2 Reversal | 237 | 66% | 157 | 74% | +0.02 | +0.01 | +3.43 |
| 2-1-2 Continuation | 227 | 73% | 166 | 79% | +3.65 | +2.67 | +606.17 |
| Rev Strat (1-2-2) Reversal | 151 | 58% | 88 | 83% | +0.02 | +0.01 | +1.70 |
| 3-1-2 Reversal | 100 | 62% | 62 | 82% | +21.09 | +13.07 | +1307.42 |
| 3-2-2 Reversal | 99 | 62% | 61 | 80% | +8.85 | +5.45 | +540.02 |
| 3-2 Continuation | 78 | 79% | 62 | 69% | +0.07 | +0.06 | +4.32 |
| 1-1-2 Continuation | 50 | 66% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1245 | 65% | 804 | 73% | -0.02 | -0.01 | -13.92 |
| W | 561 | 71% | 401 | 78% | +1.42 | +1.01 | +568.12 |
| M | 207 | 83% | 171 | 69% | +14.46 | +11.94 | +2472.27 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1587 | 66% | 1046 | 74% | +1.64 | +1.08 | +1719.48 |
| Mixed | 424 | 78% | 330 | 71% | +3.96 | +3.08 | +1306.99 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 876 | 69% | 604 | 68% | +1.99 | +1.37 | +1201.15 |
| Reversal | 1137 | 68% | 772 | 78% | +2.36 | +1.61 | +1825.32 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1399 | 68% | 958 | 72% | +1.16 | +0.79 | +1106.86 |
| Inside-bar compression (X-1-?) | 614 | 68% | 418 | 77% | +4.59 | +3.13 | +1919.61 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 85 | 19% | 16 | 100% | +189.76 | +35.72 | +3036.15 |
| AMD | 63 | 78% | 49 | 84% | +0.38 | +0.29 | +18.44 |
| LTC-USD | 41 | 80% | 33 | 91% | +0.29 | +0.23 | +9.48 |
| TLT | 57 | 68% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| BTC-USD | 45 | 84% | 38 | 79% | +0.15 | +0.13 | +5.63 |
| SOL-USD | 51 | 75% | 38 | 76% | +0.14 | +0.11 | +5.49 |
| ETH-USD | 50 | 82% | 41 | 73% | +0.10 | +0.08 | +4.00 |
| XRP-USD | 58 | 62% | 36 | 72% | +0.12 | +0.08 | +4.50 |
| XLK | 61 | 67% | 41 | 78% | +0.10 | +0.07 | +4.11 |
| META | 64 | 59% | 38 | 76% | +0.10 | +0.06 | +3.84 |
| XLI | 63 | 70% | 44 | 89% | +0.06 | +0.04 | +2.58 |
| XLU | 69 | 70% | 48 | 67% | +0.06 | +0.04 | +2.73 |
| DIA | 63 | 84% | 53 | 85% | +0.04 | +0.04 | +2.25 |
| DOGE-USD | 53 | 72% | 38 | 63% | +0.04 | +0.03 | +1.54 |
| HYPE-USD | 41 | 80% | 33 | 64% | +0.03 | +0.03 | +1.07 |
| EURUSD=X | 62 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| QQQ | 60 | 75% | 45 | 69% | +0.02 | +0.01 | +0.90 |
| SMH | 59 | 66% | 39 | 74% | +0.02 | +0.01 | +0.59 |
| IWM | 67 | 64% | 43 | 74% | -0.02 | -0.01 | -1.00 |
| AMZN | 59 | 78% | 46 | 80% | -0.02 | -0.02 | -1.07 |
| NVDA | 62 | 61% | 38 | 71% | -0.03 | -0.02 | -1.14 |
| GC=F | 64 | 63% | 40 | 80% | -0.04 | -0.02 | -1.59 |
| XLP | 63 | 68% | 43 | 67% | -0.06 | -0.04 | -2.68 |
| MSFT | 55 | 78% | 43 | 77% | -0.06 | -0.05 | -2.54 |
| SPY | 51 | 75% | 38 | 71% | -0.07 | -0.06 | -2.82 |
| XLC | 58 | 78% | 45 | 80% | -0.08 | -0.06 | -3.45 |
| XLV | 65 | 74% | 48 | 67% | -0.10 | -0.07 | -4.75 |
| XLF | 69 | 80% | 55 | 65% | -0.11 | -0.09 | -6.15 |
| XLY | 57 | 77% | 44 | 75% | -0.14 | -0.11 | -6.35 |
| AAPL | 55 | 71% | 39 | 69% | -0.16 | -0.12 | -6.42 |
| XLE | 67 | 75% | 50 | 60% | -0.17 | -0.12 | -8.25 |
| TSLA | 52 | 73% | 38 | 71% | -0.19 | -0.14 | -7.21 |
| GLD | 68 | 68% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 56 | 82% | 46 | 54% | -0.44 | -0.36 | -20.24 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
