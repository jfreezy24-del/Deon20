# Deon20 Indicators — website

A single self-contained page documenting every indicator in this repository:

| Section | Covers |
|---|---|
| `#static-model` | `static-model.pine` |
| `#static-screener` | `static-model-screener.pine` |
| `#unicorn` | `unicorn-model.pine` |
| `#ohlc-crypto` | `ohlc-projection-levels.pine` |
| `#ohlc-stocks` | `ohlc-projection-levels-stocks.pine` |
| `#liq-sweep` | `liquidity-sweep-probability.pine` |
| `#strat-scanner` | `strat-scanner/` (app + alert server) |

Plus `#method` (how the tools fit together, vocabulary, which one to open) and
`#install`.

## Running it locally

No build step and no dependencies — `index.html` carries its own CSS and JS, and
the only external request is the Google Fonts stylesheet.

```bash
cd docs
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `docs/index.html` directly with `file://` works too.

## Publishing

**GitHub Pages, no workflow required:** repo → Settings → Pages → Source
*Deploy from a branch* → pick the branch and set the folder to `/docs`. The site
is then served from `https://<user>.github.io/Deon20/`.

## Editing

Sections are hash-routed: each indicator is a `<section class="route" id="…">`
and the left rail links to it, so `…/#unicorn` is a working deep link. To add a
tool, copy an existing `<section>`, give it an `id`, set its signal colour with
`style="--sig:var(--c-…)"`, and add a matching link in the rail.

Colours are tokens on `:root`, redefined for dark mode in two places (the
`prefers-color-scheme` block for viewers on the system default, and the
`[data-theme="dark"]` block for an explicit choice). Never declare a colour only
inside one of those blocks — define it on bare `:root` first.

Signal colours encode family rather than decoration: the two STATIC tools share
teal, the two OHLC Projection editions share amber, because they are the same
engine in two configurations.
