# Edge Report — live signal record

_Generated 2026-11-18_ · **1966** settled signals from 2026-08-17 to 2026-11-18 · 31 open, 47 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1337 of 1966) — the rest expired unfilled.
- Of those trades, **74%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +2.27R per trade taken**, +1.55R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.27R**.
- Trades ran **2.97R** in favour at best and **0.64R** against at worst; **2%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 935 | 64% | 597 | 81% | +2.15 | +1.37 | +1281.64 |
| 55–64 | 817 | 71% | 578 | 68% | +3.00 | +2.12 | +1734.27 |
| 65–74 (High) | 191 | 75% | 143 | 68% | +0.11 | +0.08 | +15.19 |
| 75+ (High) | 23 | 83% | 19 | 68% | +0.39 | +0.32 | +7.45 |

Spearman rank correlation between confidence and realised R: **0.012** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 598 | +3.22 | 1368 | +0.81 | +2.41 | 77% vs 72% |
| `ftfc-aligned` | 419 | +3.12 | 1547 | +1.12 | +2.00 | 71% vs 75% |
| `ftfc-opposed` | 419 | +3.12 | 1547 | +1.12 | +2.00 | 71% vs 75% |
| `base` | 1966 | +1.55 | 0 | +0.00 | +1.55 | 74% vs 0% |
| `rr-poor` | 1357 | +1.80 | 609 | +0.99 | +0.81 | 84% vs 41% |
| `close-location` | 1011 | +1.72 | 955 | +1.36 | +0.37 | 76% vs 71% |
| `reversal-backed` | 1113 | +1.64 | 853 | +1.42 | +0.23 | 78% vs 69% |
| `rr-ok` | 562 | +1.05 | 1404 | +1.74 | -0.69 | 41% vs 83% |
| `rr-strong` | 47 | +0.25 | 1919 | +1.58 | -1.33 | 42% vs 75% |
| `volume` | 426 | +0.04 | 1540 | +1.96 | -1.92 | 67% vs 75% |
| `ftfc-full` | 1545 | +1.12 | 421 | +3.11 | -1.99 | 75% vs 71% |
| `in-force` | 908 | -0.01 | 1058 | +2.88 | -2.88 | 76% vs 70% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 537 | 73% | 392 | 77% | -0.06 | -0.04 | -22.35 |
| 2-2 Continuation | 509 | 65% | 333 | 63% | +1.77 | +1.16 | +587.97 |
| 2-1-2 Reversal | 235 | 66% | 155 | 74% | +0.03 | +0.02 | +3.99 |
| 2-1-2 Continuation | 215 | 72% | 154 | 81% | +3.98 | +2.85 | +612.72 |
| Rev Strat (1-2-2) Reversal | 146 | 59% | 86 | 83% | +0.01 | +0.01 | +0.87 |
| 3-1-2 Reversal | 99 | 63% | 62 | 82% | +21.09 | +13.21 | +1307.42 |
| 3-2-2 Reversal | 98 | 62% | 61 | 80% | +8.85 | +5.51 | +540.02 |
| 3-2 Continuation | 78 | 79% | 62 | 69% | +0.07 | +0.06 | +4.32 |
| 1-1-2 Continuation | 49 | 65% | 32 | 69% | +0.11 | +0.07 | +3.60 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 1218 | 64% | 780 | 73% | -0.00 | -0.00 | -2.32 |
| W | 543 | 71% | 387 | 78% | +1.47 | +1.05 | +568.67 |
| M | 205 | 83% | 170 | 69% | +14.54 | +12.06 | +2472.19 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1545 | 65% | 1010 | 75% | +1.71 | +1.12 | +1731.07 |
| Mixed | 419 | 78% | 327 | 71% | +4.00 | +3.12 | +1307.48 |
| Flat / unknown | 2 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 851 | 68% | 581 | 69% | +2.08 | +1.42 | +1208.60 |
| Reversal | 1115 | 68% | 756 | 78% | +2.42 | +1.64 | +1829.94 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1368 | 68% | 934 | 72% | +1.19 | +0.81 | +1110.82 |
| Inside-bar compression (X-1-?) | 598 | 67% | 403 | 77% | +4.78 | +3.22 | +1927.73 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 84 | 19% | 16 | 100% | +189.76 | +36.14 | +3036.15 |
| AMD | 61 | 79% | 48 | 85% | +0.41 | +0.32 | +19.79 |
| LTC-USD | 39 | 79% | 31 | 90% | +0.30 | +0.24 | +9.23 |
| TLT | 57 | 68% | 39 | 77% | +0.26 | +0.18 | +10.03 |
| SOL-USD | 50 | 76% | 38 | 76% | +0.14 | +0.11 | +5.49 |
| BTC-USD | 42 | 83% | 35 | 77% | +0.12 | +0.10 | +4.03 |
| XLK | 60 | 67% | 40 | 80% | +0.14 | +0.09 | +5.65 |
| ETH-USD | 48 | 81% | 39 | 72% | +0.10 | +0.08 | +3.95 |
| XRP-USD | 57 | 61% | 35 | 74% | +0.12 | +0.07 | +4.09 |
| META | 64 | 59% | 38 | 76% | +0.10 | +0.06 | +3.84 |
| XLI | 62 | 69% | 43 | 91% | +0.08 | +0.06 | +3.58 |
| QQQ | 59 | 75% | 44 | 70% | +0.06 | +0.05 | +2.74 |
| XLU | 68 | 69% | 47 | 66% | +0.06 | +0.04 | +2.68 |
| DIA | 63 | 84% | 53 | 85% | +0.04 | +0.04 | +2.25 |
| SMH | 58 | 66% | 38 | 76% | +0.05 | +0.03 | +1.80 |
| DOGE-USD | 53 | 72% | 38 | 63% | +0.04 | +0.03 | +1.54 |
| EURUSD=X | 61 | 8% | 5 | 60% | +0.28 | +0.02 | +1.40 |
| HYPE-USD | 40 | 80% | 32 | 63% | +0.03 | +0.02 | +0.88 |
| AMZN | 58 | 78% | 45 | 82% | +0.01 | +0.01 | +0.42 |
| MSFT | 53 | 79% | 42 | 79% | -0.01 | -0.01 | -0.57 |
| IWM | 66 | 64% | 42 | 74% | -0.02 | -0.02 | -1.00 |
| GC=F | 64 | 63% | 40 | 80% | -0.04 | -0.02 | -1.59 |
| SPY | 49 | 73% | 36 | 72% | -0.04 | -0.03 | -1.62 |
| NVDA | 59 | 61% | 36 | 69% | -0.05 | -0.03 | -1.97 |
| XLC | 57 | 77% | 44 | 82% | -0.05 | -0.04 | -2.31 |
| XLP | 61 | 67% | 41 | 66% | -0.07 | -0.05 | -3.06 |
| XLV | 60 | 73% | 44 | 66% | -0.12 | -0.09 | -5.22 |
| XLF | 67 | 79% | 53 | 64% | -0.12 | -0.09 | -6.22 |
| TSLA | 50 | 72% | 36 | 75% | -0.14 | -0.10 | -5.15 |
| XLY | 56 | 77% | 43 | 74% | -0.15 | -0.12 | -6.49 |
| AAPL | 53 | 72% | 38 | 68% | -0.17 | -0.12 | -6.45 |
| XLE | 65 | 74% | 48 | 58% | -0.18 | -0.14 | -8.83 |
| GLD | 68 | 68% | 46 | 70% | -0.27 | -0.19 | -12.60 |
| GOOGL | 54 | 81% | 44 | 55% | -0.41 | -0.33 | -17.93 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
