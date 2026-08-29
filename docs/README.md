# Deon20 — website

A static site for the indicators in this repository. Plain HTML, one stylesheet,
one small script. No build step, no dependencies beyond a web font.

```
docs/
├── index.html                    landing page
├── how-it-works.html             the method, vocabulary, which tool to open
├── get-started.html              installation
├── assets/
│   ├── site.css                  all styling, theme tokens
│   └── site.js                   nav toggle + indicators dropdown
└── indicators/
    ├── static-model.html                     static-model.pine
    ├── static-model-screener.html            static-model-screener.pine
    ├── unicorn-model.html                    unicorn-model.pine
    ├── ohlc-projection-levels.html           ohlc-projection-levels.pine
    ├── ohlc-projection-levels-stocks.html    ohlc-projection-levels-stocks.pine
    ├── liquidity-sweep-probability.html      liquidity-sweep-probability.pine
    └── strat-scanner.html                    strat-scanner/
```

## Running it locally

```bash
cd docs
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` over `file://` works too — every link is relative.

## Publishing

GitHub Pages needs no workflow: repo → Settings → Pages → *Deploy from a branch*,
pick the branch and set the folder to `/docs`. The site is then served from
`https://<user>.github.io/Deon20/`.

## Editing

**Chrome.** The masthead and footer are duplicated in each page. When you change
one, change all ten — there is no template layer, which is the cost of having no
build step.

**Colours.** Tokens are defined on bare `:root` in `site.css` (the light palette)
and redefined for dark mode in two places: a `prefers-color-scheme` block for
viewers on the system default, and a `[data-theme="dark"]` block for an explicit
choice. Never give a colour its only definition inside one of those blocks — it
will not apply in the un-stamped state.

**Signal colours** encode family, not decoration. Each page sets one on `<body>`
via `style="--sig:var(--c-…)"` and every accent on the page follows it. The two
STATIC tools share teal and the two OHLC Projection editions share amber, because
each pair is one engine in two configurations.

**Diagrams** are inline SVG using the same tokens (`var(--panel)`, `var(--c-blue)`
and so on), so they theme with the page. Below 720px a figure scrolls horizontally
rather than shrinking its labels into illegibility.
