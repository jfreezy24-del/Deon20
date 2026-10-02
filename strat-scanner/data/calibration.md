# Confidence Calibration — historical replay

_Generated 2026-10-02_ · **175765** settled signals from 2016-11-08 to 2026-10-02 · 62 open, 85 pending (excluded)

Replay of the live engine over 10 years of daily bars for 34 symbols, publishing on D/W/M structure at **every** confidence level — the losers are kept deliberately, since "is a 70 better than a 50" cannot be answered from a sample that only kept the 50s.

Higher-timeframe candles are rebuilt from the daily bars, so a partially formed week contains only the days that had actually traded at that instant; nothing here sees a bar before it printed. Two honest gaps from live running: **4H is not modelled** (daily history cannot reconstruct it), so continuity scores over D/W/M and the `ftfc-full` term faces a slightly easier test than live; and the `in-force` term never fires, because a replay evaluates at a bar close, before the "?" has printed.

1 symbol(s) skipped: PUMP-USD: PUMP-USD: HTTP 404 from data provider.

## Headline

- **46%** of published signals actually triggered (79987 of 175765) — the rest expired unfilled.
- Of those trades, **67%** reached target 1, 28% stopped out, 5% timed out.
- **Expectancy -0.10R per trade taken**, -0.05R per signal published.
- Promised **0.59R** to target 1 on average; delivered **-0.10R**.
- Trades ran **0.83R** in favour at best and **0.77R** against at worst; **11%** went on to extended magnitude.

## Does confidence mean anything?

The score is ordinal, not a probability — the only claim it makes is that a higher number is a better signal. So the test is whether the columns below go **up** as you read down.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| < 45 (Low) | 135678 | 40% | 53995 | 69% | -0.14 | -0.06 | -7526.90 |
| 45–54 | 23474 | 63% | 14851 | 74% | -0.08 | -0.05 | -1238.22 |
| 55–64 | 14907 | 67% | 10006 | 44% | -0.02 | -0.01 | -215.29 |
| 65–74 (High) | 1653 | 68% | 1118 | 73% | +0.84 | +0.57 | +940.01 |
| 75+ (High) | 53 | 32% | 17 | 53% | +1.11 | +0.36 | +18.85 |

Spearman rank correlation between confidence and realised R: **0.027** — **no relationship** — confidence is currently decoration; the score is not ranking anything.

## Which confidence terms are earning their weight?

Mean R per signal when a term fired versus when it did not. A term should lift results roughly in proportion to the points it awards. Flat or negative lift means the points are noise, and every score containing that term is wrong by that many points.

| Factor | Fired (n) | R/signal | Did not (n) | R/signal | Lift | Win% w/ vs w/o |
| --- | --- | --- | --- | --- | --- | --- |
| `rr-strong` | 1347 | +0.99 | 174418 | -0.05 | +1.05 | 31% vs 67% |
| `ftfc-full` | 39855 | -0.01 | 135910 | -0.06 | +0.05 | 64% vs 68% |
| `close-location` | 61756 | -0.02 | 114009 | -0.06 | +0.04 | 70% vs 63% |
| `reversal-backed` | 23898 | -0.02 | 151867 | -0.05 | +0.03 | 77% vs 65% |
| `rr-ok` | 30777 | -0.02 | 144988 | -0.05 | +0.03 | 32% vs 74% |
| `volume` | 39019 | -0.03 | 136746 | -0.05 | +0.02 | 62% vs 68% |
| `ftfc-aligned` | 88557 | -0.06 | 87208 | -0.04 | -0.02 | 70% vs 63% |
| `ftfc-opposed` | 134260 | -0.06 | 41505 | -0.01 | -0.04 | 68% vs 64% |
| `base` | 175765 | -0.05 | 0 | +0.00 | -0.05 | 67% vs 0% |
| `compression` | 24870 | -0.09 | 150895 | -0.04 | -0.05 | 69% vs 66% |
| `rr-poor` | 143641 | -0.06 | 32124 | +0.02 | -0.08 | 75% vs 32% |

## By pattern

Which setups to keep taking, and which to stop.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2-2 Reversal | 58185 | 40% | 23102 | 69% | -0.10 | -0.04 | -2338.12 |
| 2-2 Continuation | 58162 | 53% | 30735 | 62% | -0.07 | -0.04 | -2220.92 |
| 3-2 Continuation | 18383 | 39% | 7201 | 70% | -0.05 | -0.02 | -394.34 |
| Rev Strat (1-2-2) Reversal | 9382 | 39% | 3655 | 71% | -0.14 | -0.05 | -515.29 |
| 2-1-2 Continuation | 9362 | 50% | 4684 | 70% | -0.20 | -0.10 | -948.02 |
| 2-1-2 Reversal | 9358 | 54% | 5020 | 69% | -0.18 | -0.10 | -893.29 |
| 3-2-2 Reversal | 6783 | 40% | 2687 | 72% | -0.12 | -0.05 | -333.64 |
| 3-1-2 Reversal | 4018 | 49% | 1974 | 71% | -0.18 | -0.09 | -354.92 |
| 1-1-2 Continuation | 2132 | 44% | 929 | 64% | -0.02 | -0.01 | -23.03 |

## By timeframe

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D | 144105 | 45% | 65012 | 65% | -0.13 | -0.06 | -8152.17 |
| W | 26740 | 47% | 12624 | 75% | +0.01 | +0.00 | +66.90 |
| M | 4920 | 48% | 2351 | 75% | +0.03 | +0.01 | +63.72 |

## By timeframe continuity

FTFC is the single heaviest term in the model (24 points). This is where it is settled.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Full continuity | 39855 | 65% | 25860 | 64% | -0.02 | -0.01 | -420.20 |
| Aligned, not full | 1397 | 24% | 330 | 57% | -0.14 | -0.03 | -46.92 |
| Mixed | 87160 | 46% | 40339 | 70% | -0.12 | -0.06 | -4833.60 |
| Counter-continuity | 47100 | 29% | 13436 | 62% | -0.20 | -0.06 | -2686.85 |
| Flat / unknown | 253 | 9% | 22 | 64% | -1.54 | -0.13 | -33.98 |

## Reversal vs continuation

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Continuation | 88039 | 49% | 43549 | 64% | -0.08 | -0.04 | -3586.30 |
| Reversal | 87726 | 42% | 36438 | 70% | -0.12 | -0.05 | -4435.25 |

## Compression vs directional trigger

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Directional trigger bar | 150895 | 45% | 67380 | 66% | -0.09 | -0.04 | -5802.30 |
| Inside-bar compression (X-1-?) | 24870 | 51% | 12607 | 69% | -0.18 | -0.09 | -2219.25 |

## By symbol

Ordered by R per signal. Thin samples — read as a hint, not a verdict.

|  | n | Trig% | Trades | Win% | Avg R | R/signal | Total R |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JUP-USD | 6532 | 27% | 1763 | 66% | +0.71 | +0.19 | +1256.13 |
| EURUSD=X | 5805 | 6% | 326 | 52% | -0.04 | -0.00 | -13.81 |
| XLU | 5655 | 46% | 2623 | 70% | -0.07 | -0.03 | -173.65 |
| TSLA | 5631 | 47% | 2629 | 71% | -0.07 | -0.03 | -182.34 |
| XRP-USD | 1976 | 39% | 761 | 69% | -0.09 | -0.03 | -64.71 |
| NVDA | 5649 | 47% | 2627 | 68% | -0.08 | -0.04 | -211.78 |
| XLE | 5710 | 47% | 2707 | 70% | -0.08 | -0.04 | -216.30 |
| AMZN | 5674 | 48% | 2730 | 69% | -0.09 | -0.04 | -246.42 |
| XLY | 5694 | 49% | 2794 | 69% | -0.10 | -0.05 | -281.45 |
| AAPL | 5692 | 48% | 2714 | 66% | -0.10 | -0.05 | -282.80 |
| GLD | 5658 | 48% | 2705 | 71% | -0.10 | -0.05 | -282.23 |
| TLT | 5710 | 48% | 2757 | 72% | -0.10 | -0.05 | -286.14 |
| META | 5627 | 48% | 2711 | 66% | -0.11 | -0.05 | -300.73 |
| XLC | 4675 | 48% | 2261 | 66% | -0.11 | -0.05 | -253.84 |
| SMH | 5672 | 49% | 2786 | 68% | -0.11 | -0.05 | -310.34 |
| XLV | 5636 | 48% | 2696 | 67% | -0.11 | -0.05 | -308.61 |
| QQQ | 5677 | 50% | 2820 | 66% | -0.11 | -0.06 | -313.03 |
| XLI | 5653 | 49% | 2745 | 68% | -0.11 | -0.06 | -313.78 |
| AMD | 5643 | 47% | 2653 | 68% | -0.12 | -0.06 | -321.30 |
| ETH-USD | 4317 | 45% | 1929 | 64% | -0.13 | -0.06 | -247.89 |
| XLF | 5664 | 48% | 2731 | 66% | -0.12 | -0.06 | -326.94 |
| XLP | 5666 | 49% | 2756 | 66% | -0.12 | -0.06 | -332.36 |
| SOL-USD | 3403 | 45% | 1532 | 64% | -0.13 | -0.06 | -204.12 |
| XLK | 5661 | 50% | 2808 | 65% | -0.12 | -0.06 | -341.37 |
| MSFT | 5640 | 48% | 2722 | 66% | -0.13 | -0.06 | -342.98 |
| GOOGL | 5637 | 48% | 2724 | 65% | -0.13 | -0.06 | -344.62 |
| DOGE-USD | 4269 | 42% | 1791 | 65% | -0.15 | -0.06 | -276.87 |
| SPY | 5682 | 49% | 2790 | 64% | -0.14 | -0.07 | -379.38 |
| IWM | 5677 | 49% | 2810 | 66% | -0.14 | -0.07 | -389.16 |
| DIA | 5639 | 49% | 2791 | 65% | -0.14 | -0.07 | -386.87 |
| HYPE-USD | 373 | 47% | 177 | 63% | -0.15 | -0.07 | -27.24 |
| BTC-USD | 4279 | 46% | 1965 | 60% | -0.19 | -0.09 | -380.01 |
| GC=F | 5585 | 47% | 2651 | 64% | -0.20 | -0.09 | -519.82 |
| LTC-USD | 4304 | 47% | 2002 | 62% | -0.21 | -0.10 | -414.81 |

---

_Exit policy: every trade is closed at target 1, filled at the level (or at the open on a gap). A bar containing both the stop and the target is scored as a stop, since OHLC cannot order the two. Costs and slippage beyond gap fills are not modelled, so real results are somewhat worse than these._

## Are the magnitude targets real?

`computeLevels` calls its first target "magnitude" — the nearest prior pivot price should travel to. In practice it takes the nearest of **every** bar high above entry in a 20-bar window, and an ordinary bar high partway down a decline is not a place price turned. This section measures how often that happens and what it costs.

| Target came from | Signals | Share | Median R:R |
| --- | --- | --- | --- |
| Swing pivot (real structure) | 9153 | 5.2% | 0.11R |
| Ordinary bar high/low | 149194 | 84.8% | 0.18R |
| Measured 1.5R fallback | 17565 | 10.0% | 1.50R |

Published first target: **median 0.21R** (quartiles 0.07R – 0.61R). **81.8%** of signals promise a first objective closer than the stop.

> ⚠️ **Most published targets sit closer than the risk.** Two things follow, and neither is cosmetic. The `rr-poor` penalty fires on the majority of signals, so a term meant to flag bad reward/risk is mostly reporting a measurement artefact. And the outcome record closes trades **at target 1**, so a winner pays 0.21R while a loser still pays −1.00R — which caps measured expectancy no matter how good the setups are.

### What a pivot-only rule would change

Restricting targets to confirmed swing pivots (the detector already in `dca.ts`, used by the DCA ladder but not by `computeLevels`), falling back to the same 1.5R projection when no pivot lies beyond entry:

- Median R:R would move from **0.21R** to **1.50R**.
- **94.4%** of targets would move at all.
- Confidence would shift by **6.4 points** on average, moving **7.3%** of signals across the 50 alert floor and **4.8%** across the 60 algo floor.

_This is a diagnostic, not a recommendation. Pushing targets further out trades more, smaller wins for fewer, larger ones — the same trade-off the policy sweep already measures as `Exit at T1` against `Hold for T2` and `Fixed 2R`. Read that leaderboard before changing anything here: if holding for a more distant target loses there, it will likely lose here too._

| Timeframe | Signals | Median R:R | Pivot-only median | Below 1R |
| --- | --- | --- | --- | --- |
| D | 144123 | 0.21R | 1.50R | 81.7% |
| W | 26789 | 0.20R | 1.50R | 82.3% |
| M | 5000 | 0.20R | 1.50R | 81.2% |
