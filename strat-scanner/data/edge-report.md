# Edge Report — live signal record

_Generated 2026-11-24_ · **2077** settled signals from 2026-08-17 to 2026-11-24 · 43 open, 33 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1419 of 2077) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.14R per trade taken**, +1.46R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.14R**.
- Trades ran **2.85R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 980 | 64% | 628 | 81% | +2.03 | +1.30 | +1273.76 |
| 55–64 | 870 | 71% | 618 | 69% | +2.81 | +1.99 | +1735.63 |
| 65–74 (High) | 204 | 75% | 154 | 65% | +0.10 | +0.08 | +16.09 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.021** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 625 | +3.08 | 1452 | +0.76 | +2.32 | 77% vs 72% |
| `ftfc-aligned` | 437 | +2.99 | 1640 | +1.05 | +1.94 | 71% vs 74% |
| `ftfc-opposed` | 437 | +2.99 | 1640 | +1.05 | +1.94 | 71% vs 74% |
| `base` | 2077 | +1.46 | 0 | +0.00 | +1.46 | 74% vs 0% |
| `rr-poor` | 1424 | +1.70 | 653 | +0.93 | +0.77 | 84% vs 42% |
| `close-location` | 1079 | +1.62 | 998 | +1.29 | +0.33 | 76% vs 70% |
| `reversal-backed` | 1149 | +1.59 | 928 | +1.30 | +0.29 | 78% vs 68% |
| `rr-ok` | 605 | +0.98 | 1472 | +1.66 | -0.67 | 42% vs 83% |
| `rr-strong` | 48 | +0.24 | 2029 | +1.49 | -1.25 | 42% vs 74% |
| `volume` | 471 | +0.03 | 1606 | +1.88 | -1.85 | 66% vs 75% |
| `ftfc-full` | 1638 | +1.05 | 439 | +2.98 | -1.93 | 74% vs 71% |
| `in-force` | 966 | -0.02 | 1111 | +2.74 | -2.76 | 75% vs 71% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Continuation | 556 | 65% | 363 | 63% | +1.63 | +1.06 | +590.69 |
| 2-2 Reversal | 552 | 73% | 404 | 77% | -0.07 | -0.05 | -27.24 |
| 2-1-2 Reversal | 243 | 67% | 162 | 74% | +0.03 | +0.02 | +5.40 |
| 2-1-2 Continuation | 230 | 73% | 169 | 79% | +3.60 | +2.65 | +608.70 |
| Rev Strat (1-2-2) Reversal | 152 | 59% | 89 | 82% | +0.01 | +0.00 | +0.70 |
| 3-1-2 Reversal | 102 | 63% | 64 | 83% | +20.45 | +12.83 | +1308.57 |
| 3-2-2 Reversal | 102 | 61% | 62 | 81% | +8.71 | +5.29 | +540.02 |
| 3-2 Continuation | 90 | 81% | 73 | 73% | +0.05 | +0.04 | +3.49 |
| 1-1-2 Continuation | 50 | 66% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1294 | 65% | 835 | 72% | -0.01 | -0.01 | -12.25 |
| W | 575 | 72% | 412 | 78% | +1.39 | +1.00 | +572.83 |
| M | 208 | 83% | 172 | 69% | +14.37 | +11.89 | +2472.34 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1638 | 66% | 1078 | 74% | +1.60 | +1.05 | +1724.62 |
| Mixed | 437 | 78% | 341 | 71% | +3.84 | +2.99 | +1308.30 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 926 | 69% | 638 | 68% | +1.89 | +1.30 | +1205.47 |
| Reversal | 1151 | 68% | 781 | 78% | +2.34 | +1.59 | +1827.45 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1452 | 68% | 991 | 72% | +1.12 | +0.76 | +1107.65 |
| Inside-bar compression (X-1-?) | 625 | 68% | 428 | 77% | +4.50 | +3.08 | +1925.27 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 86 | 19% | 16 | 100% | +189.76 | +35.30 | +3036.15 |
| AMD | 64 | 78% | 50 | 84% | +0.37 | +0.29 | +18.47 |
| TLT | 59 | 69% | 41 | 78% | +0.28 | +0.19 | +11.32 |
| LTC-USD | 45 | 82% | 37 | 84% | +0.19 | +0.15 | +6.85 |
| BTC-USD | 49 | 84% | 41 | 76% | +0.17 | +0.14 | +7.01 |
| SOL-USD | 55 | 75% | 41 | 73% | +0.12 | +0.09 | +4.91 |
| ETH-USD | 52 | 79% | 41 | 73% | +0.10 | +0.08 | +4.00 |
| XRP-USD | 63 | 63% | 40 | 70% | +0.12 | +0.07 | +4.71 |
| XLK | 62 | 68% | 42 | 79% | +0.10 | +0.07 | +4.11 |
| META | 65 | 60% | 39 | 77% | +0.10 | +0.06 | +3.84 |
| DIA | 65 | 83% | 54 | 85% | +0.07 | +0.06 | +3.81 |
| HYPE-USD | 43 | 79% | 34 | 65% | +0.06 | +0.05 | +2.13 |
| XLI | 63 | 70% | 44 | 89% | +0.06 | +0.04 | +2.58 |
| XLU | 70 | 70% | 49 | 65% | +0.04 | +0.02 | +1.73 |
| EURUSD=X | 63 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| DOGE-USD | 56 | 71% | 40 | 63% | +0.03 | +0.02 | +1.15 |
| QQQ | 60 | 75% | 45 | 69% | +0.02 | +0.01 | +0.90 |
| SMH | 60 | 67% | 40 | 75% | +0.01 | +0.01 | +0.59 |
| NVDA | 67 | 63% | 42 | 71% | -0.00 | -0.00 | -0.01 |
| IWM | 68 | 63% | 43 | 74% | -0.02 | -0.01 | -1.00 |
| AMZN | 60 | 78% | 47 | 81% | -0.02 | -0.02 | -1.07 |
| GC=F | 66 | 61% | 40 | 80% | -0.04 | -0.02 | -1.59 |
| XLC | 60 | 78% | 47 | 81% | -0.05 | -0.04 | -2.23 |
| XLP | 64 | 67% | 43 | 67% | -0.06 | -0.04 | -2.68 |
| MSFT | 57 | 79% | 45 | 78% | -0.05 | -0.04 | -2.47 |
| SPY | 51 | 75% | 38 | 71% | -0.07 | -0.06 | -2.82 |
| XLV | 66 | 73% | 48 | 67% | -0.10 | -0.07 | -4.75 |
| XLF | 70 | 79% | 55 | 65% | -0.11 | -0.09 | -6.15 |
| AAPL | 58 | 71% | 41 | 71% | -0.14 | -0.10 | -5.77 |
| XLY | 59 | 76% | 45 | 76% | -0.14 | -0.11 | -6.23 |
| XLE | 69 | 74% | 51 | 61% | -0.16 | -0.12 | -8.03 |
| TSLA | 55 | 75% | 41 | 73% | -0.17 | -0.13 | -7.12 |
| GLD | 71 | 68% | 48 | 71% | -0.22 | -0.15 | -10.58 |
| GOOGL | 56 | 82% | 46 | 54% | -0.44 | -0.36 | -20.24 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
