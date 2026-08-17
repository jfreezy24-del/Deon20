# Strat Scanner 📱

A React Native (Expo) mobile app that scans the financial markets for **potential
#TheStrat setups** — unresolved `X-1-?` forks where the *next* bar (the "?") is
still to come — rather than sequences that have already completed. For every
signal it tells you:

- **The potential signal** — the unresolved Strat fork (`2u-1-?`, `2d-1-?`,
  `3-1-?`, `1-1-?`, `2d-?`, `1-2d-?`, `3-2d-?`, `3-?` …) and which side it plays
  out: a **reversal** if it breaks one way, a **continuation** if it breaks the
  other. The classic headline case is a directional bar followed by an inside
  bar (`2u-1-?`): break the inside-bar high and the move continues, break its low
  and it reverses.
- **Confidence level** — a transparent 0–100 score (High / Medium / Low) with a
  full point-by-point breakdown of why it scored what it did.
- **Why the setup is valid and forming** — a plain-English explanation of the
  candle sequence, the trapped participants, the timeframe-continuity picture
  and the magnitude logic.
- **The timeframe** — every setup is tagged 4H, Daily, Weekly or Monthly
  (4H is the lowest timeframe scanned, per design).
- **Entry and exit points** — trigger entry (break of the actionable bar),
  stop (invalidation at the other side of the bar), and two magnitude targets
  with reward-to-risk.

## Running the app

```bash
cd strat-scanner
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app ([iOS](https://apps.apple.com/app/expo-go/id982107779) /
[Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) on your phone.
Tap **SCAN MARKETS**.

No API keys needed — market data comes from Yahoo Finance's public chart API,
which covers stocks, ETFs, indices (`^GSPC`), crypto (`BTC-USD`), forex
(`EURUSD=X`) and futures (`GC=F`). The watchlist is editable in-app and is
persisted on the device.

## How the scanner works

1. **Data** — for each symbol it pulls Monthly (10y), Weekly (5y), Daily (1y)
   and 1-hour (60d) candles. Yahoo has no native 4H interval, so 1H bars are
   aggregated into 4H buckets anchored to each session's first bar (clean
   00/04/08… bars for 24h markets, 9:30/13:30-style bars for equities).
2. **Classification** — every candle is typed against the bar before it:
   `1` inside, `2u` broke the high only, `2d` broke the low only, `3` outside.
3. **Potential-setup detection** — the *last completed candle* on each timeframe
   is the actionable bar and the next bar is the "?". Its high/low are the
   trigger levels, and the engine lays out the fork: which Strat scenario plays
   out (reversal vs continuation) on a break of each side, *before* it happens.
   Inside-bar (`X-1-?`) forks are flagged as **compression** — the cleanest
   potential setups, with the tightest risk and a genuinely undecided direction.
   If the currently forming candle has already taken a trigger out, the signal is
   marked **TRIGGERED** (the "?" resolved, in force) rather than **POTENTIAL**
   (pending).
4. **Full timeframe continuity (FTFC)** — the current 4H/D/W/M candles are
   checked against their opens; alignment with the trade adds confidence,
   conflict subtracts it. The FTFC strip is shown on every signal card.
5. **Confidence** — additive model: base pattern quality + FTFC + reward/risk
   to the first magnitude target + trigger-bar close location + volume
   expansion + in-force bonus. Every factor is listed on the card.
6. **Levels** — entry is one tick past the trigger; stop is the other side of
   the actionable bar; Target 1 is the nearest prior pivot in the trade
   direction ("magnitude"), Target 2 the farther pivot or a 2.5R projection.

## ⚡ Algo Alerts mode

The app's second mode replicates a *Strat Algo Alerts*-style service: instead
of sweeping your personal watchlist for every potential setup, it watches a
fixed universe of **Mag 7 stocks + the most liquid US ETFs** (SPY, QQQ, IWM,
DIA, SMH, the sector SPDRs, GLD, TLT — no penny stocks, no lottery tickets)
and shows **confirmed triggers only**: high-conviction Strat breaks on
**Daily / Weekly / Monthly** structure. No pending "maybes" — each card is a
complete plan:

- **Ticker + direction** (LONG / SHORT)
- **The three-bar Strat setup** that triggered (e.g. 2-1-2 Reversal)
- **Entry** (break of the trigger bar) and the **risk line** — the stop from
  the setup's Strat structure
- **Two magnitude targets** with reward-to-risk
- **Related plays** — when a sector ETF fires it lists same-direction setups
  in its heavy constituents (the ETF is often the spark for the whole
  sector); when a stock fires it shows its sector ETFs confirming the move.

Tap **⚡ Algo Alerts** at the top of the app, then **SCAN ALGO UNIVERSE**.
Expect a handful of names on a good day and zero on most — the structure is
either there or it isn't.

## Project layout

```
App.tsx                     — main screen (Scanner / Algo modes, filters)
src/strat/classify.ts       — 1 / 2u / 2d / 3 candle typing
src/strat/patterns.ts       — potential X-1-? fork detection
src/strat/continuity.ts     — FTFC map + scoring
src/strat/levels.ts         — entry / stop / targets / R:R
src/strat/confidence.ts     — transparent confidence model
src/strat/explain.ts        — plain-English setup explanations
src/strat/universe.ts       — Algo universe (Mag 7 + liquid ETFs) + sector map
src/strat/algoAlerts.ts     — confirmed-trigger selection + related plays
src/strat/dca.ts            — DCA ladders from weekly/monthly Strat structure
src/crypto/universe.ts      — crypto universe + per-tier ladder profiles
src/crypto/weeklyReport.ts  — weekly crypto report (DCA ladders)
src/data/market.ts          — provider router (crypto → Alpaca, rest → Yahoo)
src/data/alpaca.ts          — Alpaca crypto bars client (native 4H/D/W/M)
src/data/yahoo.ts           — Yahoo Finance chart API client
src/data/series.ts          — shared series shape + completed/forming split
src/data/aggregate.ts       — 1H → 4H aggregation (Yahoo only)
src/scanner.ts              — orchestration across symbols & timeframes
src/components/             — signal cards + FTFC strip
src/__tests__/              — engine unit tests (npm test)

src/strat/outcomes.ts       — forward-walk outcome resolver (shared)
src/strat/edgeReport.ts     — win rate / expectancy / calibration statistics
src/strat/signalRecord.ts   — the forward record of published signals
src/strat/backtest.ts       — historical replay of the engine, no look-ahead
src/strat/policySweep.ts    — exit-policy grid + walk-forward validation
src/strat/regime.ts         — trend / volatility regime labels from a benchmark
src/strat/targetQuality.ts  — is T1 real structure? (calibration diagnostic)
src/strat/entryRefinement.ts— 60m entry timing (stop only, never selection)
src/data/intraday.ts        — hourly bars, for entry timing only
src/crypto/ladderBacktest.ts— weekly ladder replay + control/benchmarks
src/crypto/ladderReport.ts  — ladder validation statistics + markdown
src/strat/discovery.ts      — universe screening (what to watch)
src/options/blackScholes.ts — indicative pricing, for sizing only
src/options/expression.ts   — signal → options structure
src/strat/prepSheet.ts      — daily top-down prep sheet
src/data/history.ts         — deep daily history (backtest only)
```

## Real-time alerts with the app closed (alert server)

The same engine runs headless on a schedule via GitHub Actions
(`.github/workflows/market-scan-alerts.yml`) and pushes notifications to your phone
through [ntfy.sh](https://ntfy.sh) — free, no account needed. **ntfy only**:
Discord carries the weekly crypto report and nothing else. You get pinged
when a signal **fires** (trigger breaks) or a new high-confidence setup
appears, even with the app closed.

### One-time setup (~3 minutes)

1. **Pick a secret topic name** — anything long and unguessable, e.g.
   `deon20-strat-7g3kq9x2`. Anyone who knows the topic name can read your
   alerts, so treat it like a password.
2. **Install the ntfy app** ([iOS](https://apps.apple.com/app/ntfy/id1625396347) /
   [Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy)),
   tap **+**, and subscribe to that topic.
3. **Add the topic to GitHub**: repo → Settings → Secrets and variables →
   Actions → New repository secret → name `NTFY_TOPIC`, value = your topic.
4. **Test it**: repo → Actions → *Market Scan Alerts* → Run workflow. The first run
   establishes a baseline and sends a "Strat alerts armed ✅" notification;
   subsequent runs alert only on *new* signals.

After that it runs automatically every 15 minutes during US market hours
(Mon–Fri). Edit the `cron` lines in the workflow to change the cadence or add
overnight/crypto coverage — but note that scheduled runs consume GitHub
Actions minutes on private repos (~1–2 min per run).

### Tuning (optional repo *variables*, not secrets)

| Variable | Default | Meaning |
|---|---|---|
| `MIN_CONFIDENCE` | `50` | Minimum confidence for TRIGGERED alerts |
| `NOTIFY_SETUPS` | `true` | Also alert on new pending setups |
| `SETUP_MIN_CONFIDENCE` | `65` | Minimum confidence for pending-setup alerts |

The server scans the symbols in `server/watchlist.json` — edit that file to
change the alert universe (the in-app watchlist stays separate, on your
device). You can also run it anywhere with Node 18+: `npm run alert` with
`NTFY_TOPIC=... ` set, e.g. from cron on a Raspberry Pi or VPS.

## Algo Alerts to your inbox (email + push)

A second scheduled workflow (`.github/workflows/strat-algo-alerts.yml`) runs
the **Algo Alerts** feed headless every 15 minutes during US market hours:
Mag 7 + liquid ETFs, confirmed high-conviction triggers on Daily/Weekly/
Monthly structure only. Expect **1–5 alerts per week, sometimes zero** — it
never forces a setup. Each alert is a full plan: ticker, direction, the
three-bar Strat setup, entry, **risk line**, targets with R:R, timeframe
continuity, and related sector plays.

Setup on top of the ntfy setup above (which gives you the push channel):

1. **Email copies (optional but the point):** repo → Settings → Secrets and
   variables → Actions → New repository secret → name `ALERT_EMAIL`, value =
   your email address. Alerts are forwarded to that inbox by ntfy.sh's
   e-mail bridge — no email account or SMTP setup needed. (First email may
   land in spam; mark it as not-spam once.)
2. **Test it:** repo → Actions → *Strat Algo Alerts* → Run workflow with
   *test alert* checked — you should get a push and, if `ALERT_EMAIL` is
   set, an email within a minute.
3. The first real run establishes a baseline; alerts start on the next run.

Tuning (optional repo *variables*): `ALGO_MIN_CONFIDENCE` (default `60`) and
`ALGO_TIMEFRAMES` (default `D,W,M`). To change the universe, create
`server/algo-watchlist.json` with a JSON array of symbols. Run it anywhere
with Node 18+ via `npm run algo-alert`.

## 🪙 Crypto Weekly (DCA ladders)

A third workflow (`.github/workflows/crypto-weekly.yml`) runs **once a week**,
Mondays at 01:00 UTC — an hour after the weekly crypto candle closes, so the
week that just ended is a completed bar. It scans the crypto universe and
publishes one report to **ntfy** (push, phone-readable) and **Discord** (the
full breakdown).

The report is **accumulation only** — no trade triggers. Entries already
arrive in real time from the two alerters above; what a weekly cadence is good
for is the slower question of where the resting bids go and how much size sits
on each one. Each asset gets a standing ladder built from higher-timeframe
structure rather than round numbers:

| Rung source | Why it is a level |
|---|---|
| Prior week low | Below it the week is 2-down — where weekly stops sit and where failed breakdowns (2d flipping back to 2u) form |
| Weekly pivot low | The last broadening-formation point weekly buyers actually defended; magnitude from above measures down to it |
| Prior month low | The monthly actionable level — below it the monthly sequence is on the back foot |
| Monthly pivot low | Deepest structure in the plan; holding it keeps the monthly sequence intact |

Each rung carries a share of the planned position, skewed by tier: majors
(BTC/ETH) front-load the shallow rungs, high-beta names back-load the deep
ones, since they routinely trade through the first pivot on the way to the
next. Rungs are spaced apart, never more than 35–65% below price (deeper
"structure" is a wish, not a bid), and each ladder states the **average fill**
if the whole thing fills.

Assets are ordered **closest-to-filling first**, so the ladders that could
actually take size this week lead the report and the ones needing a deep flush
trail it. Stance per asset comes from the weekly/monthly candle direction and
whether the last monthly pivot low is intact: `ACCUMULATE` (higher-timeframe
continuity up), `NEUTRAL` (timeframes disagree), or `DEFENSIVE` (monthly
sequence broken — deep rungs only).

This is the **only** thing that posts to Discord — the two intraday alerters
are ntfy-only, so the channel carries one message set a week instead of a
per-signal stream. Both channels share the same secrets as the alerters above
(`NTFY_TOPIC`, `ALERT_EMAIL`) plus `DISCORD_WEBHOOK_URL`, so there is nothing
new to configure and no second webhook needed. Verify delivery with
repo → Actions → *Crypto Weekly Report* → Run workflow → *test_ping*, or
preview the whole report in the run log with *dry_run* (sends nothing).

Tuning (optional repo *variables*):

| Variable | Default | Meaning |
|---|---|---|
| `WEEKLY_NTFY_ASSETS` | `4` | Per-asset ladder pushes after the digest |
| `WRITEUP_SYMBOL` | `SOL-USD,BTC-USD,ETH-USD` | Coins that get a written analysis, comma separated |

**Written analyses.** Each coin in `WRITEUP_SYMBOL` is posted as its own
message *ahead of* the ladder, in the order listed, so the first coin leads
the report and carries the role ping. More depth costs channel volume: every
coin added is one more Discord message a week. A symbol that failed to scan is
skipped with a warning rather than failing the run, and if none resolve the
ladder leads and still pings.

The universe lives in `server/crypto-watchlist.json` — edit that file to
change which coins are covered. Run it anywhere with Node 18+:
`DRY_RUN=true npm run weekly-crypto` to see the report locally.

## Where the market data comes from

| Symbols | Source | Why |
|---|---|---|
| Crypto (`BTC-USD`, `SOL-USD`, …) | **Alpaca** crypto bars | Documented, versioned endpoint with **native 4H, daily, weekly and monthly bars** — no aggregation, so the bars match what a chart draws |
| Stocks, ETFs, FX, futures | Yahoo Finance chart API | The only one of the two that serves them; 4H is aggregated from 1H |

Alpaca's crypto list is US-compliance limited, so tokens it does not carry
(likely `BNB`, `HYPE`, `TAO`, `JUP`) come back empty — those **fall back to
Yahoo automatically**, per symbol and per timeframe. A symbol degrading to the
older source beats a symbol dropping out of the scan. Every fallback is logged
in the run log with the reason.

No credentials are required: Alpaca crypto bars are free, and the client sends
auth headers only when `APCA_API_KEY_ID` and `APCA_API_SECRET_KEY` are set. Add
them as repo secrets if Alpaca ever starts requiring auth. To pin everything
back to Yahoo without a deploy, set the repo *variable* `CRYPTO_PROVIDER` to
`yahoo`.

Alpaca's crypto history starts around 2021, so monthly structure runs ~5 years
deep rather than Yahoo's 10. That is well past what the ladder uses — the depth
cap discards anything that old anyway.

## 🎯 Ladder fills (the position record)

The weekly report plans where the bids go. A second workflow
(`.github/workflows/ladder-fills.yml`) runs **daily at 00:20 UTC** and records
what happened to them.

**Fill alerts.** Any rung price traded down to is marked filled, on the day it
happened rather than up to a week later. A touch counts as a fill: these are
resting limit orders, so a bar whose low reaches the level would have executed
it. Fills push to ntfy at high priority and post to Discord.

**Running cost basis.** Each ladder card in the weekly report carries a line
like `3 of 4 filled, average $171 against $166 planned, 72% deployed`. The
average is weighted by allocation, not by rung count, so a big deep fill moves
it more than a small shallow one.

**Stale rung expiry.** A rung that rests unfilled past `RUNG_TTL_DAYS`
(default 90) is dropped and reported. A level only means something while the
structure that produced it still stands; months later it is a stale order, not
a plan. Filled rungs are never expired, because they are the position.

Republishing the same ladder every week does **not** reset the staleness
clock: a level the new plan still wants keeps its original placement date.
Without that, nothing could ever go stale.

The record lives in `data/ladder-state.json`, **committed to the repo** rather
than kept in the Actions cache. A cache is evictable, and a position record
you lose is worse than one you never had; committing it also means every fill
shows up in git history. Both workflows share a concurrency group so they
never write it at once, and an unreadable state file stops the run rather than
silently starting over, which would re-report every old rung as a new fill.

| Variable | Default | Meaning |
|---|---|---|
| `RUNG_TTL_DAYS` | `90` | Days a rung may rest unfilled before expiring |

Run it anywhere with Node 18+: `DRY_RUN=true npm run ladder-fills` prints what
would be recorded and saves nothing.

---

# 🎓 Training tools

Everything above is forward-looking: it finds setups, scores them, explains
them and places bids. None of it ever looked **backward** and asked whether the
calls were any good. The three tools below are that other half — the ones that
turn the scanner from a signal generator into something that can be checked,
and that train the habits a scanner cannot.

All three are **ntfy-only**. Discord still carries the weekly crypto report and
nothing else; nothing here posts to it.

| Tool | Cadence | Sends | Reads as |
|---|---|---|---|
| Signal outcomes | Daily, silent | Nothing (monthly digest push) | `data/edge-report.md` |
| Confidence calibration | Quarterly / on demand | Nothing, ever | `data/calibration.md` |
| Policy sweep | Quarterly / on demand | Nothing, ever | `data/policy-sweep.md` |
| Entry refinement | Monthly / on demand | Nothing, ever | `data/entry-refinement.md` |
| Ladder validation | Quarterly / on demand | Nothing, ever | `data/ladder-backtest.md` |
| Universe discovery | Monthly / on demand | Nothing, ever | `data/universe-discovery.md` |
| Options expression | On demand | Nothing, ever | Actions run summary |
| Prep sheet | Weekday mornings | One push | Actions run summary |

The three report tools divide the question up. Calibration asks **"does the
confidence score rank signals?"**; the sweep asks **"given those signals, is
the way we trade them any good?"**; the outcome record asks **"and did any of
it survive contact with the live alert stream?"**

## 📊 Signal outcomes (the performance record)

Every alert this repo sends is a complete, falsifiable claim — entry here,
wrong there, first objective at that price — and until now all of it was thrown
away the moment the notification landed.

`.github/workflows/signal-outcomes.yml` runs **daily at 01:10 UTC** and keeps
it. It enrols every signal published at or above the alert confidence floor on
Daily/Weekly/Monthly structure, then replays each one against daily bars until
it settles:

| Outcome | Meaning |
|---|---|
| `EXPIRED` | The "?" bar never took the trigger — never a trade |
| `TARGET1` | First magnitude objective paid |
| `STOPPED` | Invalidated at the other side of the actionable bar |
| `TIMEOUT` | Triggered, then neither side resolved inside the hold window |

Three conventions, all chosen to bias **against** the engine rather than
flatter it:

- **A bar containing both the stop and the target counts as a stop.** OHLC
  cannot order two touches inside one bar; assuming the target would inflate
  every number in the report by exactly the cases hardest to verify.
- **Gaps fill at the open, not at the level** — the worse entry and the wider
  risk a plan would really have had.
- **The trigger is live for one bar only**, because TheStrat's "?" *is* the
  next bar. A 2-1-2 that needs four more sessions to trigger is not that
  2-1-2 any more.

Trades are closed at target 1, so realised R stays directly comparable to the
`rr1` the engine promised. Whether price then ran on to extended magnitude is
recorded separately — information about whether that exit policy is leaving
money behind, never counted as profit.

The output is `data/edge-report.md`: trigger rate, win rate, expectancy and
total R sliced by **pattern, timeframe, confidence band, timeframe continuity,
reversal vs continuation, compression vs directional, and symbol**. Trigger
rate is always reported separately from win rate, because they fail
differently — a setup that rarely triggers but wins when it does is a patience
problem, one that always triggers and loses is a selection problem, and a
single blended number hides which you have.

The record lives in two committed files, split by whether a record can still
change: `data/signal-outcomes.json` (unsettled, rewritten each run) and
`data/signal-history.jsonl` (settled, append-only, so a day's work is a few
added lines in the diff instead of a rewrite of the whole history).

**It sends nothing on a normal run.** A tracker that pinged you about its own
bookkeeping would be one more stream to ignore. The monthly firing (1st, 13:00
UTC) pushes a single headline digest to ntfy.

| Variable | Default | Meaning |
|---|---|---|
| `TRACK_MIN_CONFIDENCE` | `50` | Confidence floor for enrolment |
| `TRACK_TIMEFRAMES` | `D,W,M` | Timeframes tracked |
| `ENTRY_WINDOW_BARS` | `1` | Bars the trigger stays actionable |
| `MAX_HOLD_BARS` | `6` | Bars held before a timeout |

`DRY_RUN=true npm run track-outcomes` prints everything and saves nothing.

## 🔬 Confidence calibration (does the score mean anything?)

`scoreConfidence` is hand-tuned. Full timeframe continuity is worth 24 points,
compression 6, volume expansion 5, strong reward/risk 10. **Those weights were
reasoned about, never measured** — and every alert ever sent carried a number
derived from them.

`.github/workflows/calibration.yml` replays the *identical* engine over ten
years of daily bars and resolves every signal with the *identical* resolver the
outcome tracker uses, then writes `data/calibration.md`. Two tables carry it:

- **Reliability by confidence band.** The score is ordinal, not a probability —
  the only claim it makes is that a 70 beats a 50. So the test is whether the
  columns go up as you read down, backed by the Spearman rank correlation
  between confidence and realised R. Near zero means the score is decoration;
  negative means it is actively inverted.
- **Per-term lift.** Mean R per signal when each term fired versus when it did
  not. A term should lift results roughly in proportion to the points it
  awards. Flat or negative lift means the points are noise — and every score
  containing that term is wrong by that many points.

**No look-ahead.** Weekly and monthly candles are rebuilt from the daily bars
rather than fetched, so a partially formed week contains only the days that had
actually traded at that instant. Fetching weekly bars directly would hand every
historical signal the whole week's outcome as its own continuity input, which
is the easiest way to backtest a fantasy. This is enforced by a test that
truncates the history mid-replay and requires every earlier signal to score
identically.

Two honest gaps from live running, documented in the report itself rather than
buried: **4H is not modelled** (daily history cannot reconstruct it), so
continuity scores over D/W/M and `ftfc-full` faces a slightly easier test than
live; and the `in-force` term never fires, because a replay evaluates at a bar
close, before the "?" has printed.

### Are the magnitude targets real?

The report ends with a diagnostic on `computeLevels` itself. Its comment says
"Pivots", but the code takes the nearest of **every** bar high above entry in a
20-bar window — and an ordinary bar high partway down a decline is not a place
price turned.

That is not cosmetic, because `rr1` feeds two things: the `rr-strong` /
`rr-ok` / `rr-poor` terms in the confidence model, and the outcome record's
default exit, which **closes trades at target 1**. A target sitting a fraction
of a risk unit away caps realised R at that fraction while losses still pay a
full −1.00R.

The section classifies every published target (swing pivot / ordinary bar high
/ measured fallback), reports the `rr1` distribution, and shows what
restricting targets to genuine swing pivots would change — including how many
signals would cross the 50 and 60 alert floors. It is deliberately a
**diagnostic, not a recommendation**: pushing targets further out trades more,
smaller wins for fewer, larger ones, which is the same trade-off the policy
sweep already measures as `Exit at T1` against `Hold for T2` and `Fixed 2R`.
Read that leaderboard first.

**This job sends nothing, ever** — no ntfy, no anything. It is a slow report to
read deliberately. It also publishes to the Actions run summary.

| Variable / input | Default | Meaning |
|---|---|---|
| `CALIBRATION_YEARS` | `10` | Years of daily history to replay |
| `CALIBRATION_SYMBOLS` | _(universe)_ | Comma list to replay instead |
| `CALIBRATION_TIMEFRAMES` | `D,W,M` | Timeframes to publish on |

`DRY_RUN=true CALIBRATION_SYMBOLS=SPY,QQQ npm run calibrate` prints a report
locally without writing.

Read this **against** `edge-report.md`. The calibration is the in-sample
question ("does this engine have an edge historically"); the outcome record is
the out-of-sample one ("did the signals actually sent make money"). A large gap
between them is a live-run problem — missed bars, scheduling, the alert floor —
not a strategy one.

## ⚖️ Policy sweep (is the way we trade them any good?)

Calibration checks the *scoring*. This checks the *trading*. The live record
closes every position at target 1, gives the trigger one bar to fire, and holds
for at most six. Each of those three was a judgement call, and none had ever
been compared against the alternatives on the same data.

`.github/workflows/policy-sweep.yml` replays detection **once** and then
re-resolves the identical signals under each policy, so a difference in the
table is a difference in the exit and never in which setups existed. Eight
exits are compared:

| Exit | What it tests |
|---|---|
| Exit at T1 | The live policy — the baseline everything is measured against |
| Hold for T2 | Is the first objective leaving money behind? |
| Fixed 1R / 2R target | **The control.** If a naive fixed-R target matches the pivot-based ones, the magnitude logic in `computeLevels` is not earning its complexity |
| Trail 2-bar / 4-bar low | Does letting winners run beat taking the objective? |
| Scale 50% at T1 (± breakeven stop) | The compromise most traders actually use |

Then the entry window (1 or 2 bars) and hold (3 / 6 / 12) are compared **at the
winning exit** — a two-stage grid of about thirteen policies rather than a
forty-policy cross-product. That is deliberate: the best of forty noisy numbers
looks excellent whether or not anything real is there.

### The part that stops it being curve-fitting

A sweep is the easiest way to fool yourself ever invented, so the report leads
with the walk-forward result, *before* the leaderboard:

- Policies are ranked on the first 70% of dates and then checked on the rest.
  The headline is not "the best policy scored X" but **"the policy that looked
  best early ranked Nth later, and switching to it would have been worth ±Y R
  per signal versus the live one."**
- The **rank agreement** between the two periods is reported. If policies that
  led early do not lead later, the report says the sweep is measuring noise and
  that no policy should be adopted — rather than crowning a winner anyway.
- The split is chronological, never random: shuffling rows would put the same
  week on both sides of the fence and leak the answer.

Two more slices attack the same problem from the other side — a single ten-year
expectancy hides whether the edge was there throughout or came from one good
year:

- **Year by year**, for the live policy and the winner.
- **By regime** — benchmark above/below its 200-day average, and annualised
  20-day realised volatility in **fixed bands**. Never sample quantiles, which
  would label each day using volatility that had not happened yet.

Two reporting details worth knowing. **R is always measured against the plan's
original stop**, so trailing and breakeven policies cannot flatter themselves by
shrinking the denominator they are judged on. And the leaderboard reports
**Profit%** (trades that came off green, however they came off) separately from
**Obj%** (trades that reached the objective), because a trailing stop never
reaches an objective by construction and would otherwise score 0% against
policies it beat.

**This job sends nothing, ever** — no ntfy, no anything. It publishes to
`data/policy-sweep.md` and the Actions run summary.

| Variable / input | Default | Meaning |
|---|---|---|
| `SWEEP_YEARS` | `10` | Years of daily history to replay |
| `SWEEP_SYMBOLS` | _(universe)_ | Comma list to replay instead |
| `SWEEP_MIN_CONFIDENCE` | `50` | Confidence floor for the sample |
| `SWEEP_IS_FRACTION` | `0.7` | Share of dates used to pick the winner in-sample |
| `REGIME_BENCHMARK` | `SPY` | Symbol the regime labels come from |

`DRY_RUN=true SWEEP_SYMBOLS=SPY,QQQ npm run sweep` prints a report without
writing.

**Read the walk-forward section first and the leaderboard second.** The
leaderboard is the curve-fitted part; the walk-forward number is the only one
that was not chosen with hindsight.

## ⏱️ Entry refinement (is a 60-minute stop worth it?)

The scanner takes setups from Daily/Weekly/Monthly structure and puts the stop
at the other side of that bar. A daily 2-1-2 says *"long above 450.20, wrong
below 443.10"* — and a resting stop order accepts **the whole daily bar** as
risk. Standard Strat practice is to time the entry on a lower chart: once
450.20 breaks, the stop can sit under the 60-minute bar that broke it, often a
third of the distance for exactly the same trade.

That is not free. A tighter stop buys a bigger R on the same objective and buys
more stop-outs. Which wins is an empirical question, so this ships as **an
engine plus the measurement of whether it pays**.

### The rules, in order of importance

1. **60m never selects.** The setup, direction, trigger and both targets come
   from the higher timeframe untouched. Refinement runs *after* a trigger has
   broken and only moves the stop — it cannot create, cancel or re-rank a
   signal. The design that 4H is the lowest timeframe *scanned* is unchanged,
   and 60m is deliberately kept out of the `Timeframe` union so nothing
   downstream can even represent a 60m setup.
2. **Targets never move.** Magnitude measures to the prior pivot on the chart
   that produced the setup. Only the denominator changes — the same objective
   over less risk is a bigger R.
3. **It only ever tightens.** Intraday structure wider than the
   higher-timeframe invalidation is declined and the original stop stands.
4. **It refuses to be noise.** A stop four ticks from entry is a coin flip with
   good optics. Floors in both percent of price (`0.15%`) and fraction of the
   original risk (`20%`) must be cleared, or refinement declines.

### Measuring it

`.github/workflows/entry-refinement.yml` resolves **every signal twice against
the same hourly bars** — once with the higher-timeframe stop, once with the
refined one. Same trigger, same targets, same population including signals that
never triggered; the stop is the single difference.

Both variants resolve on **hourly** bars, not daily. A stop this tight is hit
and recovered from intraday, so resolving against daily bars would
systematically under-report the whipsaw that is the entire cost being measured.

The report states which side wins in R per signal, how often refinement
tightened versus declined and why, and the mean tightening factor with promised
R before and after — sliced by timeframe (refinement should help most where the
higher-timeframe bar is widest) and by pattern (compression setups already have
tight risk and have the least to gain).

> ⚠️ **This is the shortest-horizon report in the repo and cannot be
> otherwise.** Both providers cap hourly history at ~60 days, so it covers weeks
> and one market regime. Re-run it and look for a consistent answer rather than
> acting on a single run. The report says so itself, every time.

### In the live alerts

Confirmed-trigger alerts now carry the 60m risk line alongside the structural
one — never instead of it:

```
RISK LINE (stop): 443.10
60m RISK LINE: 448.30 (2.4x tighter — T1 becomes 4.8R against 2.0R)
```

The higher-timeframe line is where the setup is genuinely wrong; the refined
one trades a smaller loss for a higher chance of taking it. The alert states
both and leaves the choice where it belongs. Refinement is **best-effort**: a
failed intraday fetch costs the suggestion and nothing else, and can never be
the reason a confirmed trigger goes unsent. Set `REFINE_ENTRIES=false` to turn
it off.

| Variable / input | Default | Meaning |
|---|---|---|
| `REFINE_DAYS` | `60` | Days of hourly history (provider cap) |
| `REFINE_SYMBOLS` | _(universe)_ | Comma list to test instead |
| `REFINE_MIN_CONFIDENCE` | `50` | Confidence floor for the sample |
| `REFINE_PIVOT_BARS` | `3` | Intraday bars behind the trigger for the stop |
| `REFINE_ENTRIES` | `true` | Attach the 60m risk line to algo alerts |

`DRY_RUN=true REFINE_SYMBOLS=SPY,QQQ npm run entry-refinement` prints the
comparison without writing.

## 🪜 Ladder validation (does the structure earn its place?)

Everything above validates the **signal** engine. The DCA ladder — four
structural rung sources, a tier-based size skew, a 35–65% depth cap and a
90-day expiry — had never been tested at all.

`.github/workflows/ladder-backtest.yml` replays the ladder week by week over
history, running the **production functions** (`buildDcaPlan`,
`reconcilePlan`, `applyFills`, `expireStaleRungs`) rather than a
reimplementation, so what is measured is the system that ships. Each asset gets
a fixed cash budget; plans publish at each weekly close, fills are checked
against every subsequent daily bar, and stale rungs expire.

### Read two numbers together, always

**Cost efficiency** (average price paid ÷ mean price available) and
**deployment** (how much of the budget was actually spent). Either alone is a
way to lie to yourself: a ladder resting at −40% shows a beautiful average
price on the 8% of capital that ever filled, and a ladder that fills instantly
deploys everything at no discount. Every table carries both.

### What it answers

- **Does structure beat round numbers?** The headline. The control is a
  fixed-percentage ladder with *identical tier weights* — beating buy-and-hold
  proves nothing, since any bid below spot does that in a market that dips. The
  gap between those two rows is the entire value of reading TheStrat levels.
- **Which rung source earns its place?** Fill rate per *distinct rung placed*,
  median days to fill, mean discount, and share of capital deployed. A source
  offered constantly that rarely fills is not the same as one offered rarely
  that always fills, and a raw fill count cannot tell them apart.
- **Is 90 days the right expiry?** Deployment and cost efficiency at 30 / 60 /
  90 / 180 days and never. If a longer TTL deploys more at a similar price, the
  expiry is cancelling bids that were about to fill.
- **Does the tier skew pay?** Each tier replayed under all three profiles, with
  the live assignment marked ⬅︎. If another row wins its tier consistently, the
  skew is backwards.
- **Was `DEFENSIVE` ever right?** It is a forecast, so forward 30/90-day
  returns are the only way to check it. If defensive weeks were followed by the
  same returns as accumulate weeks, the stance is decoration.

It also reports **over-commitment**: allocations are re-normalised to 100%
across each fresh plan while filled rungs are carried forward, so a ladder that
fills and republishes can commit to more than the budget.

**This job sends nothing, ever.** Discord still carries only the weekly crypto
report.

| Variable / input | Default | Meaning |
|---|---|---|
| `LADDER_YEARS` | `10` | Years of daily history to replay |
| `LADDER_SYMBOLS` | _(crypto universe)_ | Comma list to replay instead |
| `LADDER_BUDGET` | `10000` | Cash allotted per asset |
| `LADDER_TTLS` | `30,60,90,180,0` | Expiries to compare (`0` = never) |
| `LADDER_NAIVE_DEPTHS` | `8,16,26,38` | Control ladder depths, % below spot |

`DRY_RUN=true LADDER_SYMBOLS=BTC-USD,ETH-USD npm run ladder-backtest` prints
the report without writing.

> **A bug this found.** `reconcilePlan` carries a rung's `placedOn` forward when
> the level drifts inside the 0.5% "same place" band, which is correct — it is
> what stops republishing from resetting the staleness clock. But `applyFills`
> used that same date as the earliest a fill could occur, so a level drifting
> **upward** within tolerance was filled retroactively by a bar that traded
> before the bid was ever that high. That marked rungs filled that never
> filled, and understated the cost basis in `data/ladder-state.json`. Rungs now
> carry a separate `pricedOn` for fill eligibility while `placedOn` keeps the
> expiry clock; records written before the field existed fall back to
> `placedOn`, so committed state still loads.

## 🔭 Universe discovery (is this the right watchlist?)

Every watchlist here is hand-curated. The scanner is very good at answering
*"is there a setup in these 35 names"* and has no way at all to answer *"are
these the right 35 names."*

`.github/workflows/universe-discovery.yml` screens a broad candidate pool
(`server/candidates/equities.json`, ~258 names, and `crypto.json`, ~60) and
proposes additions — and flags watched symbols that no longer qualify, because
a watchlist that only ever grows becomes a scan of everything.

**Candidates are scored on tradability, never on backtested profit.** That
restriction is the most important thing in the tool. Ranking a broad pool by
historical returns and keeping the winners finds the symbols that *happened* to
work over the sample, which is the property least likely to repeat. What gets
scored instead:

| Criterion | Why it plausibly persists |
|---|---|
| Median daily dollar volume | You cannot trade what you cannot get filled in |
| Volatility, as a **band** | Too quiet cannot pay for its own risk; too wild is a lottery ticket |
| Structure density | How often the symbol actually prints actionable Strat bars |
| Magnitude availability | How often a real prior level exists to measure to, rather than a projection |
| Marginal diversification | A name 0.95 correlated to something you already watch adds a row and no information |

Two stages, because the pool is large and the data source is free: cheap gates
(liquidity, volatility, history) run off one daily fetch per candidate, and the
Strat engine is replayed only over what survives.

Correlation is scored against the **existing watchlist**, so it measures what a
candidate *adds* rather than what it is — and incumbents are never evicted for
being correlated, since you already own that decision.

**Sends nothing. Proposes; never edits a watchlist.**

| Variable / input | Default | Meaning |
|---|---|---|
| `DISCOVER_POOL` | `both` | `equities`, `crypto` or `both` |
| `DISCOVER_YEARS` | `3` | Years of daily history |
| `DISCOVER_MAX` | `15` | Maximum additions to propose |
| `DISCOVER_MIN_VOLUME` | `25000000` | Median daily dollar volume floor |
| `DISCOVER_MAX_CORR` | `0.9` | Correlation ceiling against the watchlist |

`DRY_RUN=true DISCOVER_POOL=crypto npm run discover` prints the proposal
without writing.

> The candidate pools are committed snapshots — edit them freely. Being
> snapshots of today's liquid names they are themselves survivorship-biased, so
> treat them as a starting universe rather than an unbiased one.

## 🎟️ Options expression

The scanner produces a complete directional thesis and hands you four numbers
in share terms. Expressing that with options means translating every one of
them, and `npm run options-plan` does the arithmetic:

| Plan | Option decision |
|---|---|
| Direction | Calls or puts |
| **Hold window** | Expiry — a plan given six daily bars needs an option alive in six daily bars, with room to spare |
| **Magnitude target** | The **short strike** — the thesis is "price travels from entry to T1", and a vertical long at entry / short at T1 expresses exactly that and nothing more |
| **The R unit** | Contract count — a defined-risk structure has a known max loss, so size is arithmetic |

Two structures per signal, because they answer different questions: the
**vertical debit spread** states the thesis and caps both sides; the **long
single** keeps the upside past T1 and pays for it in premium and theta.

It also runs the reality checks the share-based plan cannot make for itself —
whether the objective is a sane fraction of the expected move over the option's
life, and whether the objective is so close to the trigger that the debit
cannot be earned back. That last one fires on exactly the pathology the
[target-quality diagnostic](#are-the-magnitude-targets-real) found: a target
0.15R away is a small win in shares and usually negative expectancy in options.

> ⚠️ **It does not price options.** Nothing here sees a chain, a bid/ask or a
> real implied volatility. Premiums are Black-Scholes estimates from realised
> volatility marked up by `IV_PREMIUM` (default 1.25×, because implied is
> normally above realised and pricing off raw realised flatters every debit).
> Contract counts are a starting point; the **structure** is the output. Open
> the chain before trading any of it.

| Variable | Default | Meaning |
|---|---|---|
| `OPTIONS_SYMBOLS` | _(algo universe)_ | Comma list to plan |
| `OPTIONS_RISK` | `500` | Dollars to risk per trade |
| `OPTIONS_MIN_CONFIDENCE` | `60` | Confidence floor |
| `IV_PREMIUM` | `1.25` | Realised-to-implied markup |
| `EXPIRY_BUFFER` | `2` | Multiple of the hold window to buy |

`OPTIONS_SYMBOLS=NVDA,SPY npm run options-plan` prints the plan for today, or
run **Options Plan** from the Actions tab — it takes the same settings as
inputs and writes the plan to the run summary. Manual only, with no schedule:
an options plan is worth acting on today and misleading a week later, once the
underlying has moved off these levels. It commits nothing.

## 📋 Daily prep sheet

The two alerters are reactive by design: a level breaks, your phone buzzes.
That is the right shape for an entry and the wrong shape for a habit — it
trains you to click notifications rather than arrive with a view.

`.github/workflows/prep-sheet.yml` runs **weekdays at 12:45 UTC**, 45 minutes
before the US open, and lays out the board:

- **Where we are in the higher-timeframe candles.** A new weekly open resets
  the line that decides weekly continuity for the next five sessions; a new
  monthly open frames every lower timeframe for the month. The sheet says when
  those candles open and close, and which day of the week you are on.
- **Higher-timeframe structure** — weekly and monthly actionable bars, with
  inside-bar compression sorted to the top, since that is the tightest risk on
  the board.
- **In play today** — daily triggers within reach of a normal session, nearest
  first, with the distance in percent. Anything further than 4% away is
  dropped: a level today cannot reach is not in play, and listing it is the
  noise this sheet exists to remove.
- **Timeframe continuity** — which symbols are in full continuity each way, and
  where the daily is fighting the weekly.

Nothing here is a trade call; there are no entries to take at 08:00. It is the
map you read first.

Delivery is **one ntfy push** at default priority — a scheduled briefing, not a
level breaking, so it does not wake the phone the way a trigger alert does. The
full sheet goes to the Actions run summary. Nothing is committed: a prep sheet
is worth reading on the day and worthless a week later.

| Variable | Default | Meaning |
|---|---|---|
| `PREP_MIN_CONFIDENCE` | `40` | Confidence floor for rows |
| `PREP_MAX_DISTANCE` | `4` | Max % from price to trigger to count as in play |
| `PREP_ROWS` | `8` | Daily rows carried in the sheet |

`DRY_RUN=true npm run prep-sheet` prints the sheet and sends nothing.

---

## Development

```bash
npm test            # vitest unit tests for the Strat engine
npm run typecheck   # strict TypeScript check
```

## Disclaimer

This tool is for educational and informational purposes only and is **not
financial advice**. Signals are pattern detections, not predictions; always do
your own analysis and manage risk.
