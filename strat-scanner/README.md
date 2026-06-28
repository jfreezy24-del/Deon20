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

## Project layout

```
App.tsx                     — main screen (scan, filters, watchlist editor)
src/strat/classify.ts       — 1 / 2u / 2d / 3 candle typing
src/strat/patterns.ts       — potential X-1-? fork detection
src/strat/continuity.ts     — FTFC map + scoring
src/strat/levels.ts         — entry / stop / targets / R:R
src/strat/confidence.ts     — transparent confidence model
src/strat/explain.ts        — plain-English setup explanations
src/data/yahoo.ts           — Yahoo Finance chart API client
src/data/aggregate.ts       — 1H → 4H aggregation
src/scanner.ts              — orchestration across symbols & timeframes
src/components/             — signal cards + FTFC strip
src/__tests__/strat.test.ts — engine unit tests (npm test)
```

## Real-time alerts with the app closed (alert server)

The same engine runs headless on a schedule via GitHub Actions
(`.github/workflows/market-scan-alerts.yml`) and pushes notifications to your phone
through [ntfy.sh](https://ntfy.sh) — free, no account needed. You get pinged
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

## Development

```bash
npm test            # vitest unit tests for the Strat engine
npm run typecheck   # strict TypeScript check
```

## Disclaimer

This tool is for educational and informational purposes only and is **not
financial advice**. Signals are pattern detections, not predictions; always do
your own analysis and manage risk.
