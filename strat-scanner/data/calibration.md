# Confidence Calibration — historical replay

_Generated 2026-08-17_ · **174582** settled signals from 2016-09-21 to 2026-08-17 · 87 open, 89 pending (excluded)

Replay of the live engine over 10 years of daily bars for 33 symbols, publishing on D/W/M structure at **every** confidence level — the losers are kept deliberately, since "is a 70 better than a 50" cannot be answered from a sample that only kept the 50s.

Higher-timeframe candles are rebuilt from the daily bars, so a partially formed week contains only the days that had actually traded at that instant; nothing here sees a bar before it printed. Two honest gaps from live running: **4H is not modelled** (daily history cannot reconstruct it), so continuity scores over D/W/M and the `ftfc-full` term faces a slightly easier test than live; and the `in-force` term never fires, because a replay evaluates at a bar close, before the "?" has printed.

2 symbol(s) skipped: HYPE-USD: only 182 daily bars; PUMP-USD: PUMP-USD: HTTP 404 from data provider.

## Headline

- **46%** of published signals actually triggered (79450 of 174582) — the rest expired unfilled.
- Of those trades, **67%** reached target 1, 28% stopped out, 5% timed out.
- **Expectancy -0.13R per trade taken**, -0.06R per signal published.
- Promised **0.62R** to target 1 on average; delivered **-0.13R**.
- Trades ran **0.83R** in favour at best and **0.82R** against at worst; **11%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| < 45 (Low) | 134661 | 40% | 53569 | 69% | -0.16 | -0.06 | -8498.03 |
| 45–54 | 23416 | 63% | 14820 | 74% | -0.10 | -0.07 | -1541.53 |
| 55–64 | 14805 | 67% | 9933 | 44% | -0.03 | -0.02 | -283.02 |
| 65–74 (High) | 1646 | 67% | 1109 | 72% | -0.15 | -0.10 | -171.03 |
| 75+ (High) | 54 | 35% | 19 | 53% | +1.05 | +0.37 | +19.96 |

Spearman rank correlation between confidence and realised R: **0.024** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `rr-ok` | 30672 | -0.02 | 143910 | -0.07 | +0.05 | 32% vs 74% |
| `close-location` | 61488 | -0.04 | 113094 | -0.07 | +0.03 | 70% vs 63% |
| `ftfc-full` | 39611 | -0.04 | 134971 | -0.07 | +0.03 | 64% vs 68% |
| `volume` | 38413 | -0.06 | 136169 | -0.06 | -0.00 | 62% vs 68% |
| `ftfc-aligned` | 87799 | -0.06 | 86783 | -0.06 | -0.00 | 70% vs 63% |
| `rr-poor` | 142340 | -0.06 | 32242 | -0.05 | -0.01 | 75% vs 32% |
| `reversal-backed` | 23694 | -0.07 | 150888 | -0.06 | -0.01 | 77% vs 65% |
| `ftfc-opposed` | 133248 | -0.06 | 41334 | -0.05 | -0.02 | 68% vs 63% |
| `compression` | 24730 | -0.09 | 149852 | -0.05 | -0.04 | 69% vs 66% |
| `base` | 174582 | -0.06 | 0 | +0.00 | -0.06 | 67% vs 0% |
| `rr-strong` | 1570 | -0.71 | 173012 | -0.05 | -0.65 | 31% vs 67% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 57715 | 40% | 22925 | 69% | -0.16 | -0.06 | -3602.01 |
| 2-2 Continuation | 57680 | 53% | 30452 | 62% | -0.09 | -0.05 | -2643.15 |
| 3-2 Continuation | 18342 | 39% | 7206 | 70% | -0.05 | -0.02 | -382.39 |
| Rev Strat (1-2-2) Reversal | 9333 | 39% | 3641 | 71% | -0.33 | -0.13 | -1198.48 |
| 2-1-2 Continuation | 9313 | 50% | 4663 | 70% | -0.21 | -0.11 | -988.21 |
| 2-1-2 Reversal | 9312 | 54% | 4984 | 69% | -0.19 | -0.10 | -925.43 |
| 3-2-2 Reversal | 6782 | 40% | 2699 | 72% | -0.13 | -0.05 | -343.16 |
| 3-1-2 Reversal | 3975 | 49% | 1951 | 71% | -0.18 | -0.09 | -349.81 |
| 1-1-2 Continuation | 2130 | 44% | 929 | 64% | -0.04 | -0.02 | -41.01 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 143020 | 45% | 64541 | 65% | -0.16 | -0.07 | -10608.35 |
| W | 26667 | 47% | 12567 | 75% | +0.01 | +0.00 | +64.22 |
| M | 4895 | 48% | 2342 | 75% | +0.03 | +0.01 | +70.49 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 39611 | 65% | 25690 | 64% | -0.06 | -0.04 | -1548.76 |
| Aligned, not full | 1467 | 25% | 374 | 55% | -0.96 | -0.24 | -357.83 |
| Mixed | 86332 | 46% | 39955 | 70% | -0.13 | -0.06 | -5108.42 |
| Counter-continuity | 46916 | 29% | 13409 | 62% | -0.26 | -0.07 | -3424.64 |
| Flat / unknown | 256 | 9% | 22 | 64% | -1.54 | -0.13 | -33.98 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 87465 | 49% | 43250 | 64% | -0.09 | -0.05 | -4054.76 |
| Reversal | 87117 | 42% | 36200 | 70% | -0.18 | -0.07 | -6418.89 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 149852 | 45% | 66923 | 66% | -0.12 | -0.05 | -8169.19 |
| Inside-bar compression (X-1-?) | 24730 | 51% | 12527 | 69% | -0.18 | -0.09 | -2304.46 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 6435 | 27% | 1748 | 66% | +0.08 | +0.02 | +147.36 |
| EURUSD=X | 5801 | 6% | 326 | 51% | -0.04 | -0.00 | -13.48 |
| XRP-USD | 1877 | 38% | 719 | 70% | -0.08 | -0.03 | -58.34 |
| XLU | 5657 | 46% | 2615 | 70% | -0.07 | -0.03 | -181.75 |
| TSLA | 5634 | 47% | 2630 | 71% | -0.07 | -0.03 | -189.25 |
| NVDA | 5648 | 46% | 2613 | 68% | -0.08 | -0.04 | -203.70 |
| XLE | 5708 | 47% | 2708 | 71% | -0.08 | -0.04 | -213.23 |
| AMZN | 5676 | 48% | 2735 | 69% | -0.09 | -0.04 | -248.48 |
| AAPL | 5691 | 48% | 2704 | 66% | -0.10 | -0.05 | -273.95 |
| GLD | 5656 | 48% | 2706 | 71% | -0.10 | -0.05 | -283.92 |
| TLT | 5712 | 48% | 2757 | 72% | -0.11 | -0.05 | -289.77 |
| XLY | 5690 | 49% | 2793 | 68% | -0.10 | -0.05 | -289.15 |
| META | 5632 | 48% | 2717 | 66% | -0.11 | -0.05 | -300.29 |
| QQQ | 5676 | 50% | 2821 | 66% | -0.11 | -0.05 | -305.25 |
| XLV | 5637 | 48% | 2695 | 67% | -0.11 | -0.05 | -303.85 |
| SMH | 5673 | 49% | 2781 | 68% | -0.11 | -0.05 | -309.24 |
| XLC | 4599 | 48% | 2225 | 65% | -0.11 | -0.05 | -250.77 |
| AMD | 5638 | 47% | 2640 | 68% | -0.12 | -0.06 | -317.91 |
| XLI | 5650 | 49% | 2743 | 67% | -0.12 | -0.06 | -324.83 |
| ETH-USD | 4219 | 45% | 1888 | 64% | -0.13 | -0.06 | -245.13 |
| SOL-USD | 3308 | 45% | 1488 | 64% | -0.13 | -0.06 | -193.56 |
| XLF | 5663 | 48% | 2722 | 66% | -0.12 | -0.06 | -332.98 |
| XLP | 5666 | 49% | 2755 | 66% | -0.12 | -0.06 | -334.91 |
| GOOGL | 5638 | 48% | 2723 | 65% | -0.13 | -0.06 | -344.24 |
| MSFT | 5641 | 48% | 2727 | 66% | -0.13 | -0.06 | -347.24 |
| XLK | 5667 | 50% | 2815 | 65% | -0.12 | -0.06 | -351.46 |
| DOGE-USD | 4171 | 42% | 1749 | 66% | -0.15 | -0.06 | -268.67 |
| SPY | 5681 | 49% | 2790 | 64% | -0.14 | -0.07 | -381.47 |
| IWM | 5669 | 50% | 2808 | 66% | -0.14 | -0.07 | -392.70 |
| DIA | 5637 | 50% | 2795 | 65% | -0.14 | -0.07 | -399.79 |
| BTC-USD | 4180 | 46% | 1918 | 61% | -0.19 | -0.09 | -367.40 |
| LTC-USD | 4209 | 47% | 1958 | 62% | -0.21 | -0.10 | -413.38 |
| GC=F | 5543 | 48% | 2638 | 63% | -0.72 | -0.34 | -1890.92 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._

## Are the magnitude targets real?

`computeLevels` calls its first target "magnitude" — the nearest prior pivot price should travel to. In practice it takes the nearest of **every** bar high above entry in a 20-bar window, and an ordinary bar high partway down a decline is not a place price turned. This section measures how often that happens and what it costs.

| Target came from | Signals | Share | Median R:R |
| --- | --- | --- | --- |
| Swing pivot (real structure) | 9043 | 5.2% | 0.11R |
| Ordinary bar high/low | 148339 | 84.9% | 0.18R |
| Measured 1.5R fallback | 17376 | 9.9% | 1.50R |

Published first target: **median 0.21R** (quartiles 0.07R – 0.62R). **81.6%** of signals promise a first objective closer than the stop.

> ⚠️ **Most published targets sit closer than the risk.** Two things follow, and neither is cosmetic. The `rr-poor` penalty fires on the majority of signals, so a term meant to flag bad reward/risk is mostly reporting a measurement artefact. And the outcome record closes trades **at target 1**, so a winner pays 0.21R while a loser still pays −1.00R — which caps measured expectancy no matter how good the setups are.

### What a pivot-only rule would change

Restricting targets to confirmed swing pivots (the detector already in `dca.ts`, used by the DCA ladder but not by `computeLevels`), falling back to the same 1.5R projection when no pivot lies beyond entry:

- Median R:R would move from **0.21R** to **1.50R**.
- **94.4%** of targets would move at all.
- Confidence would shift by **6.4 points** on average, moving **7.3%** of signals across the 50 alert floor and **4.8%** across the 60 algo floor.

_This is a diagnostic, not a recommendation. Pushing targets further out trades more, smaller wins for fewer, larger ones — the same trade-off the policy sweep already measures as `Exit at T1` against `Hold for T2` and `Fixed 2R`. Read that leaderboard before changing anything here: if holding for a more distant target loses there, it will likely lose here too._

| Timeframe | Signals | Median R:R | Pivot-only median | Below 1R |
| --- | --- | --- | --- | --- |
| D | 143034 | 0.22R | 1.50R | 81.5% |
| W | 26747 | 0.20R | 1.50R | 82.0% |
| M | 4977 | 0.20R | 1.50R | 81.1% |
