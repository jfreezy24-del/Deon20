# Edge Report — live signal record

_Generated 2026-10-30_ · **1514** settled signals from 2026-08-17 to 2026-10-30 · 38 open, 35 pending (excluded)

Forward record of every signal published at confidence ≥ 50 on D/W/M structure across 35 symbols, resolved against daily bars. Out-of-sample by construction: each signal was enrolled when it was published, before its outcome existed. The trigger stays actionable for 1 bar(s) of its own timeframe and trades are held at most 6. Compare against `calibration.md`, which measures the same engine over history — a large gap between the two is a live-run problem, not a strategy one.

## Headline

- **68%** of published signals actually triggered (1037 of 1514) — the rest expired unfilled.
- Of those trades, **73%** reached target 1, 22% stopped out, 5% timed out.
- **Expectancy +2.90R per trade taken**, +1.99R per signal published.
- Promised **0.71R** to target 1 on average; delivered **+2.90R**.
- Trades ran **3.59R** in favour at best and **0.64R** against at worst; **1%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45–54 | 733 | 64% | 468 | 79% | +2.72 | +1.74 | +1272.40 |
| 55–64 | 627 | 72% | 450 | 68% | +3.86 | +2.77 | +1734.99 |
| 65–74 (High) | 139 | 77% | 107 | 66% | +0.01 | +0.01 | +1.43 |
| 75+ (High) | 15 | 80% | 12 | 67% | +0.04 | +0.03 | +0.52 |

Spearman rank correlation between confidence and realised R: **0.028** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `compression` | 444 | +4.30 | 1070 | +1.03 | +3.27 | 76% vs 72% |
| `ftfc-aligned` | 323 | +3.99 | 1191 | +1.45 | +2.54 | 69% vs 74% |
| `ftfc-opposed` | 323 | +3.99 | 1191 | +1.45 | +2.54 | 69% vs 74% |
| `base` | 1514 | +1.99 | 0 | +0.00 | +1.99 | 73% vs 0% |
| `rr-poor` | 1045 | +2.34 | 469 | +1.20 | +1.15 | 85% vs 38% |
| `close-location` | 779 | +2.23 | 735 | +1.73 | +0.50 | 75% vs 70% |
| `reversal-backed` | 873 | +2.09 | 641 | +1.85 | +0.24 | 79% vs 65% |
| `rr-ok` | 434 | +1.30 | 1080 | +2.27 | -0.97 | 38% vs 83% |
| `rr-strong` | 35 | -0.05 | 1479 | +2.04 | -2.09 | 38% vs 74% |
| `volume` | 296 | +0.04 | 1218 | +2.46 | -2.42 | 64% vs 75% |
| `ftfc-full` | 1190 | +1.45 | 324 | +3.98 | -2.53 | 74% vs 69% |
| `in-force` | 719 | -0.02 | 795 | +3.81 | -3.83 | 75% vs 69% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 439 | 74% | 326 | 78% | -0.04 | -0.03 | -12.13 |
| 2-2 Continuation | 384 | 65% | 251 | 59% | +2.25 | +1.47 | +564.44 |
| 2-1-2 Reversal | 180 | 67% | 120 | 76% | -0.04 | -0.02 | -4.35 |
| 2-1-2 Continuation | 158 | 71% | 112 | 79% | +5.48 | +3.88 | +613.33 |
| Rev Strat (1-2-2) Reversal | 111 | 59% | 65 | 85% | +0.06 | +0.03 | +3.64 |
| 3-2-2 Reversal | 77 | 62% | 48 | 83% | +11.25 | +7.01 | +539.90 |
| 3-1-2 Reversal | 67 | 61% | 41 | 78% | +31.65 | +19.37 | +1297.61 |
| 3-2 Continuation | 59 | 78% | 46 | 67% | +0.08 | +0.06 | +3.75 |
| 1-1-2 Continuation | 39 | 72% | 28 | 68% | +0.11 | +0.08 | +3.16 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 946 | 65% | 616 | 72% | -0.02 | -0.02 | -15.15 |
| W | 424 | 71% | 299 | 77% | +1.89 | +1.33 | +565.13 |
| M | 144 | 85% | 122 | 67% | +20.16 | +17.08 | +2459.36 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 1190 | 66% | 781 | 74% | +2.20 | +1.45 | +1721.33 |
| Mixed | 323 | 79% | 256 | 69% | +5.03 | +3.99 | +1288.00 |
| Flat / unknown | 1 | 0% | 0 | — | — | +0.00 | +0.00 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 640 | 68% | 437 | 65% | +2.71 | +1.85 | +1184.67 |
| Reversal | 874 | 69% | 600 | 79% | +3.04 | +2.09 | +1824.66 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 1070 | 69% | 736 | 72% | +1.49 | +1.03 | +1099.59 |
| Inside-bar compression (X-1-?) | 444 | 68% | 301 | 76% | +6.34 | +4.30 | +1909.74 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 63 | 19% | 12 | 100% | +252.89 | +48.17 | +3034.65 |
| TLT | 46 | 70% | 32 | 81% | +0.37 | +0.26 | +11.98 |
| LTC-USD | 27 | 81% | 22 | 86% | +0.28 | +0.23 | +6.18 |
| AMD | 48 | 75% | 36 | 81% | +0.18 | +0.14 | +6.52 |
| DIA | 48 | 83% | 40 | 85% | +0.09 | +0.08 | +3.73 |
| XLK | 47 | 66% | 31 | 81% | +0.10 | +0.07 | +3.23 |
| XLI | 49 | 67% | 33 | 88% | +0.10 | +0.07 | +3.33 |
| META | 52 | 54% | 28 | 75% | +0.11 | +0.06 | +3.07 |
| BTC-USD | 33 | 88% | 29 | 76% | +0.04 | +0.04 | +1.24 |
| XLU | 53 | 74% | 39 | 64% | +0.05 | +0.04 | +1.91 |
| XLC | 45 | 78% | 35 | 86% | +0.03 | +0.02 | +1.12 |
| AMZN | 47 | 81% | 38 | 82% | +0.03 | +0.02 | +1.04 |
| EURUSD=X | 49 | 6% | 3 | 67% | +0.16 | +0.01 | +0.48 |
| IWM | 52 | 62% | 32 | 72% | +0.01 | +0.01 | +0.44 |
| SMH | 48 | 65% | 31 | 74% | +0.01 | +0.01 | +0.40 |
| XLF | 52 | 81% | 42 | 71% | -0.02 | -0.01 | -0.69 |
| ETH-USD | 34 | 79% | 27 | 70% | -0.02 | -0.02 | -0.65 |
| SOL-USD | 36 | 75% | 27 | 67% | -0.04 | -0.03 | -1.09 |
| MSFT | 40 | 80% | 32 | 75% | -0.05 | -0.04 | -1.62 |
| XLY | 41 | 83% | 34 | 79% | -0.05 | -0.04 | -1.76 |
| XRP-USD | 40 | 65% | 26 | 65% | -0.07 | -0.04 | -1.78 |
| HYPE-USD | 32 | 81% | 26 | 58% | -0.06 | -0.05 | -1.47 |
| GLD | 48 | 71% | 34 | 76% | -0.08 | -0.06 | -2.79 |
| AAPL | 42 | 74% | 31 | 74% | -0.08 | -0.06 | -2.46 |
| SPY | 40 | 73% | 29 | 66% | -0.10 | -0.07 | -2.88 |
| DOGE-USD | 38 | 71% | 27 | 52% | -0.13 | -0.09 | -3.38 |
| XLP | 48 | 63% | 30 | 67% | -0.15 | -0.09 | -4.47 |
| GC=F | 49 | 63% | 31 | 74% | -0.15 | -0.09 | -4.63 |
| QQQ | 44 | 75% | 33 | 70% | -0.14 | -0.10 | -4.53 |
| XLV | 45 | 76% | 34 | 65% | -0.15 | -0.11 | -5.13 |
| TSLA | 42 | 76% | 32 | 75% | -0.17 | -0.13 | -5.30 |
| NVDA | 46 | 63% | 29 | 66% | -0.24 | -0.15 | -6.88 |
| XLE | 48 | 75% | 36 | 58% | -0.21 | -0.15 | -7.40 |
| GOOGL | 42 | 86% | 36 | 61% | -0.31 | -0.26 | -11.09 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._
