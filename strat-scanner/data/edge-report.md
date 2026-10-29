# Edge Report — live signal record

_Generated 2026-10-29_ · **1480** settled signals from 2026-08-17 to 2026-10-29 · 47 open, 41 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1005 of 1480) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 4% timed out.
- **Expectancy +3.00R per trade taken**, +2.04R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+3.00R**.
- Trades ran **3.69R** in favour at best and **0.63R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 713 | 63% | 449 | 80% | +2.85 | +1.79 | +1279.29 |
| 55–64 | 615 | 71% | 439 | 68% | +3.95 | +2.82 | +1735.07 |
| 65–74 (High) | 137 | 77% | 105 | 68% | +0.03 | +0.03 | +3.47 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.035** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 436 | +4.38 | 1044 | +1.06 | +3.32 | 76% vs 72% |
| `ftfc-aligned` | 317 | +4.08 | 1163 | +1.48 | +2.60 | 69% vs 75% |
| `ftfc-opposed` | 317 | +4.08 | 1163 | +1.48 | +2.60 | 69% vs 75% |
| `base` | 1480 | +2.04 | 0 | +0.00 | +2.04 | 73% vs 0% |
| `rr-poor` | 1021 | +2.40 | 459 | +1.24 | +1.16 | 85% vs 38% |
| `close-location` | 760 | +2.29 | 720 | +1.77 | +0.52 | 75% vs 70% |
| `reversal-backed` | 860 | +2.13 | 620 | +1.92 | +0.21 | 78% vs 66% |
| `rr-ok` | 425 | +1.33 | 1055 | +2.32 | -0.99 | 38% vs 83% |
| `rr-strong` | 34 | +0.10 | 1446 | +2.09 | -1.99 | 39% vs 74% |
| `volume` | 289 | +0.05 | 1191 | +2.52 | -2.47 | 65% vs 75% |
| `ftfc-full` | 1162 | +1.48 | 318 | +4.07 | -2.58 | 75% vs 69% |
| `in-force` | 698 | -0.02 | 782 | +3.88 | -3.90 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 429 | 74% | 316 | 77% | -0.03 | -0.02 | -8.53 |
| 2-2 Continuation | 371 | 65% | 240 | 60% | +2.36 | +1.53 | +566.75 |
| 2-1-2 Reversal | 179 | 66% | 119 | 76% | -0.04 | -0.02 | -4.35 |
| 2-1-2 Continuation | 152 | 70% | 106 | 78% | +5.80 | +4.04 | +614.33 |
| Rev Strat (1-2-2) Reversal | 111 | 59% | 65 | 85% | +0.06 | +0.03 | +3.64 |
| 3-2-2 Reversal | 76 | 62% | 47 | 83% | +11.49 | +7.10 | +539.82 |
| 3-1-2 Reversal | 66 | 61% | 40 | 80% | +32.47 | +19.68 | +1298.65 |
| 3-2 Continuation | 57 | 77% | 44 | 70% | +0.11 | +0.09 | +4.89 |
| 1-1-2 Continuation | 39 | 72% | 28 | 68% | +0.11 | +0.08 | +3.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 929 | 65% | 600 | 72% | -0.02 | -0.01 | -11.72 |
| W | 412 | 70% | 288 | 78% | +1.99 | +1.39 | +573.41 |
| M | 139 | 84% | 117 | 66% | +21.00 | +17.67 | +2456.65 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1162 | 65% | 755 | 75% | +2.28 | +1.48 | +1724.68 |
| Mixed | 317 | 79% | 250 | 69% | +5.17 | +4.08 | +1293.67 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 619 | 68% | 418 | 66% | +2.84 | +1.92 | +1189.12 |
| Reversal | 861 | 68% | 587 | 78% | +3.12 | +2.12 | +1829.23 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1044 | 68% | 712 | 72% | +1.55 | +1.06 | +1106.56 |
| Inside-bar compression (X-1-?) | 436 | 67% | 293 | 76% | +6.52 | +4.38 | +1911.79 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 63 | 19% | 12 | 100% | +252.89 | +48.17 | +3034.65 |
| TLT | 46 | 70% | 32 | 81% | +0.37 | +0.26 | +11.98 |
| LTC-USD | 26 | 81% | 21 | 86% | +0.29 | +0.23 | +6.11 |
| AMD | 48 | 75% | 36 | 81% | +0.18 | +0.14 | +6.52 |
| XLI | 48 | 67% | 32 | 91% | +0.14 | +0.09 | +4.33 |
| DIA | 48 | 83% | 40 | 85% | +0.09 | +0.08 | +3.73 |
| META | 50 | 52% | 26 | 77% | +0.15 | +0.08 | +3.80 |
| AMZN | 42 | 79% | 33 | 85% | +0.10 | +0.07 | +3.14 |
| XLK | 47 | 66% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLU | 53 | 74% | 39 | 64% | +0.05 | +0.04 | +1.91 |
| XLC | 45 | 78% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| BTC-USD | 32 | 88% | 28 | 75% | +0.02 | +0.02 | +0.58 |
| EURUSD=X | 48 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| MSFT | 39 | 79% | 31 | 77% | -0.01 | -0.01 | -0.20 |
| SOL-USD | 34 | 74% | 25 | 68% | -0.01 | -0.01 | -0.27 |
| XLF | 51 | 80% | 41 | 71% | -0.02 | -0.01 | -0.69 |
| GLD | 46 | 70% | 32 | 81% | -0.03 | -0.02 | -0.86 |
| ETH-USD | 33 | 79% | 26 | 69% | -0.03 | -0.03 | -0.90 |
| XRP-USD | 40 | 65% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| HYPE-USD | 31 | 81% | 25 | 56% | -0.06 | -0.05 | -1.58 |
| XLY | 39 | 82% | 32 | 78% | -0.06 | -0.05 | -2.00 |
| AAPL | 40 | 73% | 29 | 72% | -0.09 | -0.07 | -2.63 |
| SPY | 40 | 73% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| DOGE-USD | 38 | 71% | 27 | 52% | -0.13 | -0.09 | -3.38 |
| XLP | 46 | 63% | 29 | 66% | -0.15 | -0.10 | -4.47 |
| QQQ | 44 | 75% | 33 | 70% | -0.14 | -0.10 | -4.53 |
| GC=F | 46 | 61% | 28 | 71% | -0.20 | -0.12 | -5.47 |
| TSLA | 42 | 76% | 32 | 75% | -0.17 | -0.13 | -5.30 |
| NVDA | 46 | 63% | 29 | 66% | -0.24 | -0.15 | -6.88 |
| XLV | 44 | 75% | 33 | 64% | -0.20 | -0.15 | -6.64 |
| XLE | 47 | 74% | 35 | 60% | -0.21 | -0.15 | -7.26 |
| GOOGL | 38 | 84% | 32 | 63% | -0.20 | -0.17 | -6.36 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
