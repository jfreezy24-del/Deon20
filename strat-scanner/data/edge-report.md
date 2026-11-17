# Edge Report — live signal record

_Generated 2026-11-17_ · **1930** settled signals from 2026-08-17 to 2026-11-17 · 38 open, 43 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1308 of 1930) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.32R per trade taken**, +1.57R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.32R**.
- Trades ran **3.03R** in favour at best and **0.65R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 915 | 63% | 581 | 80% | +2.20 | +1.40 | +1279.05 |
| 55–64 | 802 | 70% | 565 | 68% | +3.07 | +2.16 | +1733.87 |
| 65–74 (High) | 190 | 75% | 143 | 68% | +0.11 | +0.08 | +15.19 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.012** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 585 | +3.30 | 1345 | +0.82 | +2.47 | 77% vs 72% |
| `ftfc-aligned` | 417 | +3.14 | 1513 | +1.14 | +1.99 | 71% vs 74% |
| `ftfc-opposed` | 417 | +3.14 | 1513 | +1.14 | +1.99 | 71% vs 74% |
| `base` | 1930 | +1.57 | 0 | +0.00 | +1.57 | 73% vs 0% |
| `rr-poor` | 1326 | +1.84 | 604 | +1.00 | +0.84 | 84% vs 41% |
| `close-location` | 991 | +1.76 | 939 | +1.38 | +0.38 | 76% vs 71% |
| `reversal-backed` | 1099 | +1.66 | 831 | +1.45 | +0.21 | 78% vs 68% |
| `rr-ok` | 557 | +1.06 | 1373 | +1.78 | -0.72 | 41% vs 83% |
| `rr-strong` | 47 | +0.25 | 1883 | +1.61 | -1.36 | 42% vs 74% |
| `volume` | 422 | +0.04 | 1508 | +2.00 | -1.97 | 66% vs 75% |
| `ftfc-full` | 1511 | +1.14 | 419 | +3.12 | -1.98 | 74% vs 71% |
| `in-force` | 886 | -0.01 | 1044 | +2.92 | -2.93 | 75% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 529 | 73% | 385 | 77% | -0.06 | -0.04 | -23.54 |
| 2-2 Continuation | 496 | 65% | 321 | 62% | +1.82 | +1.18 | +585.27 |
| 2-1-2 Reversal | 234 | 66% | 154 | 74% | +0.03 | +0.02 | +3.92 |
| 2-1-2 Continuation | 209 | 71% | 148 | 80% | +4.14 | +2.93 | +612.75 |
| Rev Strat (1-2-2) Reversal | 145 | 59% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-2-2 Reversal | 98 | 62% | 61 | 80% | +8.85 | +5.51 | +540.02 |
| 3-1-2 Reversal | 95 | 64% | 61 | 82% | +21.43 | +13.76 | +1307.36 |
| 3-2 Continuation | 77 | 79% | 61 | 69% | +0.07 | +0.06 | +4.32 |
| 1-1-2 Continuation | 47 | 66% | 31 | 71% | +0.15 | +0.10 | +4.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1194 | 64% | 760 | 73% | -0.01 | -0.00 | -4.82 |
| W | 533 | 71% | 380 | 77% | +1.50 | +1.07 | +568.25 |
| M | 203 | 83% | 168 | 68% | +14.72 | +12.18 | +2472.13 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1511 | 65% | 982 | 74% | +1.76 | +1.14 | +1728.08 |
| Mixed | 417 | 78% | 326 | 71% | +4.01 | +3.14 | +1307.48 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 829 | 68% | 561 | 68% | +2.15 | +1.46 | +1206.93 |
| Reversal | 1101 | 68% | 747 | 78% | +2.45 | +1.66 | +1828.63 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1345 | 68% | 914 | 72% | +1.21 | +0.82 | +1106.93 |
| Inside-bar compression (X-1-?) | 585 | 67% | 394 | 77% | +4.90 | +3.30 | +1928.63 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 82 | 18% | 15 | 100% | +202.41 | +37.03 | +3036.15 |
| AMD | 61 | 79% | 48 | 85% | +0.41 | +0.32 | +19.79 |
| LTC-USD | 39 | 79% | 31 | 90% | +0.30 | +0.24 | +9.23 |
| TLT | 56 | 70% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| SOL-USD | 50 | 76% | 38 | 76% | +0.14 | +0.11 | +5.49 |
| BTC-USD | 41 | 83% | 34 | 76% | +0.11 | +0.09 | +3.73 |
| XLK | 59 | 66% | 39 | 79% | +0.14 | +0.09 | +5.37 |
| ETH-USD | 48 | 81% | 39 | 72% | +0.10 | +0.08 | +3.95 |
| XRP-USD | 56 | 63% | 35 | 74% | +0.12 | +0.07 | +4.09 |
| META | 63 | 59% | 37 | 76% | +0.10 | +0.06 | +3.80 |
| XLI | 60 | 68% | 41 | 90% | +0.08 | +0.06 | +3.44 |
| DOGE-USD | 52 | 71% | 37 | 65% | +0.07 | +0.05 | +2.54 |
| QQQ | 59 | 75% | 44 | 70% | +0.06 | +0.05 | +2.74 |
| XLU | 67 | 69% | 46 | 65% | +0.06 | +0.04 | +2.68 |
| DIA | 61 | 84% | 51 | 84% | +0.04 | +0.04 | +2.24 |
| SMH | 57 | 65% | 37 | 76% | +0.04 | +0.03 | +1.48 |
| EURUSD=X | 60 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| AMZN | 58 | 78% | 45 | 82% | +0.01 | +0.01 | +0.42 |
| MSFT | 52 | 79% | 41 | 78% | -0.01 | -0.01 | -0.57 |
| IWM | 63 | 63% | 40 | 73% | -0.03 | -0.02 | -1.19 |
| GC=F | 62 | 63% | 39 | 79% | -0.04 | -0.03 | -1.66 |
| NVDA | 59 | 61% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| HYPE-USD | 38 | 79% | 30 | 60% | -0.04 | -0.03 | -1.31 |
| SPY | 48 | 73% | 35 | 71% | -0.05 | -0.04 | -1.91 |
| XLC | 56 | 77% | 43 | 81% | -0.05 | -0.04 | -2.35 |
| XLP | 60 | 67% | 40 | 65% | -0.08 | -0.06 | -3.32 |
| XLV | 58 | 72% | 42 | 67% | -0.10 | -0.07 | -4.22 |
| XLF | 64 | 78% | 50 | 64% | -0.12 | -0.09 | -5.84 |
| TSLA | 49 | 71% | 35 | 74% | -0.15 | -0.11 | -5.16 |
| XLY | 55 | 76% | 42 | 74% | -0.16 | -0.12 | -6.77 |
| AAPL | 52 | 73% | 38 | 68% | -0.17 | -0.12 | -6.45 |
| XLE | 63 | 73% | 46 | 57% | -0.21 | -0.16 | -9.77 |
| GLD | 68 | 68% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 54 | 81% | 44 | 55% | -0.41 | -0.33 | -17.93 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
