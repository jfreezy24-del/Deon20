# Edge Report — live signal record

_Generated 2026-11-22_ · **2046** settled signals from 2026-08-17 to 2026-11-22 · 37 open, 43 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **69%** of published signals actually triggered (1406 of 2046) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.16R per trade taken**, +1.49R per signal published.
- Promised **0.70R** to target 1 on average; delivered **+2.16R**.
- Trades ran **2.87R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 972 | 64% | 626 | 81% | +2.04 | +1.31 | +1274.69 |
| 55–64 | 852 | 72% | 611 | 69% | +2.84 | +2.04 | +1736.66 |
| 65–74 (High) | 199 | 75% | 150 | 67% | +0.13 | +0.10 | +20.09 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.025** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 622 | +3.09 | 1424 | +0.78 | +2.31 | 77% vs 73% |
| `ftfc-aligned` | 429 | +3.05 | 1617 | +1.07 | +1.98 | 71% vs 75% |
| `ftfc-opposed` | 429 | +3.05 | 1617 | +1.07 | +1.98 | 71% vs 75% |
| `base` | 2046 | +1.49 | 0 | +0.00 | +1.49 | 74% vs 0% |
| `rr-poor` | 1416 | +1.71 | 630 | +0.97 | +0.74 | 84% vs 43% |
| `close-location` | 1058 | +1.66 | 988 | +1.30 | +0.36 | 76% vs 70% |
| `reversal-backed` | 1141 | +1.60 | 905 | +1.34 | +0.26 | 78% vs 69% |
| `rr-ok` | 583 | +1.03 | 1463 | +1.67 | -0.64 | 43% vs 83% |
| `rr-strong` | 47 | +0.25 | 1999 | +1.51 | -1.27 | 42% vs 75% |
| `volume` | 449 | +0.05 | 1597 | +1.89 | -1.84 | 68% vs 75% |
| `ftfc-full` | 1615 | +1.07 | 431 | +3.04 | -1.96 | 75% vs 71% |
| `in-force` | 954 | -0.01 | 1092 | +2.79 | -2.80 | 75% vs 71% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 550 | 73% | 404 | 77% | -0.07 | -0.05 | -27.24 |
| 2-2 Continuation | 536 | 67% | 357 | 64% | +1.67 | +1.11 | +596.88 |
| 2-1-2 Reversal | 241 | 66% | 160 | 74% | +0.03 | +0.02 | +4.30 |
| 2-1-2 Continuation | 230 | 73% | 169 | 79% | +3.60 | +2.65 | +608.70 |
| Rev Strat (1-2-2) Reversal | 151 | 58% | 88 | 83% | +0.02 | +0.01 | +1.70 |
| 3-1-2 Reversal | 101 | 62% | 63 | 83% | +20.75 | +12.95 | +1307.52 |
| 3-2-2 Reversal | 100 | 61% | 61 | 80% | +8.85 | +5.40 | +540.02 |
| 3-2 Continuation | 87 | 82% | 71 | 73% | +0.06 | +0.05 | +4.42 |
| 1-1-2 Continuation | 50 | 66% | 33 | 67% | +0.08 | +0.05 | +2.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1267 | 65% | 824 | 73% | -0.01 | -0.01 | -7.41 |
| W | 572 | 72% | 411 | 78% | +1.40 | +1.00 | +574.03 |
| M | 207 | 83% | 171 | 69% | +14.46 | +11.94 | +2472.27 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1615 | 66% | 1071 | 75% | +1.62 | +1.07 | +1730.75 |
| Mixed | 429 | 78% | 335 | 71% | +3.90 | +3.05 | +1308.14 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 903 | 70% | 630 | 69% | +1.92 | +1.34 | +1212.60 |
| Reversal | 1143 | 68% | 776 | 78% | +2.35 | +1.60 | +1826.29 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1424 | 69% | 981 | 73% | +1.14 | +0.78 | +1115.78 |
| Inside-bar compression (X-1-?) | 622 | 68% | 425 | 77% | +4.52 | +3.09 | +1923.11 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 86 | 19% | 16 | 100% | +189.76 | +35.30 | +3036.15 |
| AMD | 64 | 78% | 50 | 84% | +0.37 | +0.29 | +18.47 |
| LTC-USD | 41 | 80% | 33 | 91% | +0.29 | +0.23 | +9.48 |
| TLT | 59 | 69% | 41 | 78% | +0.28 | +0.19 | +11.32 |
| BTC-USD | 47 | 85% | 40 | 78% | +0.20 | +0.17 | +8.01 |
| SOL-USD | 53 | 75% | 40 | 75% | +0.15 | +0.11 | +5.91 |
| XRP-USD | 60 | 63% | 38 | 71% | +0.13 | +0.08 | +4.98 |
| ETH-USD | 51 | 80% | 41 | 73% | +0.10 | +0.08 | +4.00 |
| XLK | 62 | 68% | 42 | 79% | +0.10 | +0.07 | +4.11 |
| DIA | 64 | 84% | 54 | 85% | +0.07 | +0.06 | +3.81 |
| META | 65 | 60% | 39 | 77% | +0.10 | +0.06 | +3.84 |
| XLI | 63 | 70% | 44 | 89% | +0.06 | +0.04 | +2.58 |
| DOGE-USD | 54 | 72% | 39 | 64% | +0.06 | +0.04 | +2.15 |
| HYPE-USD | 41 | 80% | 33 | 64% | +0.03 | +0.03 | +1.07 |
| XLU | 70 | 70% | 49 | 65% | +0.04 | +0.02 | +1.73 |
| EURUSD=X | 62 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| NVDA | 65 | 63% | 41 | 73% | +0.03 | +0.02 | +1.18 |
| QQQ | 60 | 75% | 45 | 69% | +0.02 | +0.01 | +0.90 |
| SMH | 60 | 67% | 40 | 75% | +0.01 | +0.01 | +0.59 |
| IWM | 67 | 64% | 43 | 74% | -0.02 | -0.01 | -1.00 |
| AMZN | 60 | 78% | 47 | 81% | -0.02 | -0.02 | -1.07 |
| GC=F | 65 | 62% | 40 | 80% | -0.04 | -0.02 | -1.59 |
| XLC | 60 | 78% | 47 | 81% | -0.05 | -0.04 | -2.23 |
| XLP | 63 | 68% | 43 | 67% | -0.06 | -0.04 | -2.68 |
| MSFT | 56 | 79% | 44 | 77% | -0.06 | -0.05 | -2.54 |
| SPY | 51 | 75% | 38 | 71% | -0.07 | -0.06 | -2.82 |
| XLV | 65 | 74% | 48 | 67% | -0.10 | -0.07 | -4.75 |
| XLF | 69 | 80% | 55 | 65% | -0.11 | -0.09 | -6.15 |
| AAPL | 57 | 72% | 41 | 71% | -0.14 | -0.10 | -5.77 |
| XLY | 58 | 78% | 45 | 76% | -0.14 | -0.11 | -6.23 |
| XLE | 68 | 75% | 51 | 61% | -0.16 | -0.12 | -8.03 |
| TSLA | 54 | 74% | 40 | 73% | -0.18 | -0.13 | -7.12 |
| GLD | 70 | 69% | 48 | 71% | -0.22 | -0.15 | -10.58 |
| GOOGL | 56 | 82% | 46 | 54% | -0.44 | -0.36 | -20.24 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
