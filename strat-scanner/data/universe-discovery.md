# Universe Discovery — is this the right watchlist?

_Generated 2026-11-06_ · 282 of 318 candidates screened · 39 currently watched

Screened the committed candidate pools in `server/candidates/` plus every currently watched symbol, over 3 years of daily bars. Cheap gates — liquidity, volatility, history — are applied first; the Strat engine is replayed only over what survives, since structure quality is expensive to compute and irrelevant for a symbol already rejected on liquidity.

13 candidate(s) unavailable: SQ: SQ: HTTP 404 from data provider; WBD: 1 bars; BK: BK: no data returned; MMC: MMC: HTTP 404 from data provider; MATIC-USD: MATIC-USD: HTTP 404 from data provider; APT-USD: APT-USD: HTTP 404 from data provider; SUI-USD: SUI-USD: HTTP 404 from data provider; IMX-USD: IMX-USD: HTTP 404 from data provider; FTM-USD: FTM-USD: HTTP 404 from data provider; COMP-USD: COMP-USD: HTTP 404 from data provider; TAO-USD: TAO-USD: HTTP 404 from data provider; PUMP-USD: PUMP-USD: HTTP 404 from data provider …and 1 more.

**Candidates are scored on tradability, never on backtested profit.** Ranking a broad pool by historical returns and keeping the winners finds the symbols that happened to work over the sample, which is the property least likely to repeat. What is scored instead is liquidity, a volatility band, how often the symbol prints actionable structure, how often a real prior level exists to measure to, and how much it adds to what you already watch.

## Proposed additions

_Nothing cleared the gates. That is a real answer: the watchlist may already cover the tradable, uncorrelated names in the pool._

## Flagged for removal

A watchlist that only ever grows becomes a scan of everything. These are watched now and no longer qualify:

| Symbol | Score | Why it no longer qualifies |
| --- | --- | --- |
| SPY | 72 | 17% volatility — too quiet to pay for risk |
| DIA | 73 | 15% volatility — too quiet to pay for risk |
| XLI | 74 | 18% volatility — too quiet to pay for risk |
| XLV | 78 | 15% volatility — too quiet to pay for risk |
| XLP | 79 | 14% volatility — too quiet to pay for risk |
| ADA-USD | 79 | only 267 daily bars |
| JUP-USD | 79 | 995% volatility — a lottery ticket |
| XLU | 82 | 17% volatility — too quiet to pay for risk |
| HYPE-USD | 82 | only 263 daily bars |
| TLT | 86 | 16% volatility — too quiet to pay for risk |
| EURUSD=X | 90 | 8% volatility — too quiet to pay for risk |

## Gates

| Gate | Threshold |
| --- | --- |
| Median daily dollar volume | ≥ $0M |
| Annualised volatility | 18% – 250% |
| Daily bars of history | ≥ 400 |
| Correlation to an existing member | ≤ 0.00 |

## Everything screened

| Symbol | Score | Volume | Vol | Setups/100d | Real targets | Max corr | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TRX-USD | 92 | $143M | 48% | 204.7 | 90% | 0.28 (DOT-USD) | 0.28 correlated to DOT-USD |
| MKR-USD | 91 | $0M | 72% | 190.1 | 91% | 0.07 (XLU) | 0.07 correlated to XLU |
| DLTR | 90 | $260M | 41% | 219.4 | 88% | 0.37 (XLP) | 0.37 correlated to XLP |
| UNG | 90 | $218M | 63% | 223.4 | 91% | 0.20 (XLE) | 0.20 correlated to XLE |
| EURUSD=X | 90 | $0M | 8% | 216.8 | 98% | 0.06 (HYPE-USD) | **watched, failing** |
| DG | 89 | $284M | 39% | 218.0 | 90% | 0.41 (XLP) | 0.41 correlated to XLP |
| GC=F | 89 | $680M | 19% | 218.2 | 87% | 0.16 (HYPE-USD) | watched |
| PANW | 88 | $2.0B | 44% | 218.4 | 90% | 0.52 (QQQ) | 0.52 correlated to QQQ |
| UBER | 88 | $1.1B | 44% | 217.9 | 92% | 0.54 (XLY) | 0.54 correlated to XLY |
| CVS | 88 | $667M | 31% | 217.4 | 89% | 0.36 (XLV) | 0.36 correlated to XLV |
| EL | 88 | $301M | 45% | 218.5 | 89% | 0.49 (SPY) | 0.49 correlated to SPY |
| NOC | 88 | $451M | 26% | 217.6 | 89% | 0.30 (XLI) | 0.30 correlated to XLI |
| FXI | 88 | $558M | 31% | 224.6 | 94% | 0.40 (IWM) | 0.40 correlated to IWM |
| GLD | 88 | $3.4B | 19% | 220.9 | 88% | 0.20 (TLT) | watched |
| ORCL | 87 | $3.8B | 44% | 219.7 | 88% | 0.57 (XLK) | 0.57 correlated to XLK |
| PYPL | 87 | $586M | 44% | 218.8 | 91% | 0.56 (XLY) | 0.56 correlated to XLY |
| WDAY | 87 | $483M | 42% | 219.5 | 90% | 0.51 (MSFT) | 0.51 correlated to MSFT |
| HPQ | 87 | $421M | 38% | 219.9 | 95% | 0.50 (SPY) | 0.50 correlated to SPY |
| NFLX | 87 | $2.5B | 45% | 219.0 | 92% | 0.58 (XLC) | 0.58 correlated to XLC |
| TGT | 87 | $581M | 37% | 218.3 | 89% | 0.48 (XLY) | 0.48 correlated to XLY |
| LULU | 87 | $422M | 44% | 219.1 | 88% | 0.56 (XLY) | 0.56 correlated to XLY |
| CMG | 87 | $524M | 36% | 220.2 | 94% | 0.51 (XLY) | 0.51 correlated to XLY |
| DPZ | 87 | $238M | 30% | 216.5 | 89% | 0.39 (XLY) | 0.39 correlated to XLY |
| LMT | 87 | $608M | 24% | 219.0 | 88% | 0.32 (XLI) | 0.32 correlated to XLI |
| FCX | 87 | $772M | 45% | 219.3 | 93% | 0.58 (IWM) | 0.58 correlated to IWM |
| DOW | 87 | $248M | 34% | 219.4 | 95% | 0.51 (XLE) | 0.51 correlated to XLE |
| T | 87 | $932M | 26% | 218.9 | 94% | 0.39 (XLP) | 0.39 correlated to XLP |
| XLE | 87 | $1.9B | 26% | 222.3 | 95% | 0.42 (XLF) | watched |
| EWZ | 87 | $1.1B | 30% | 220.8 | 94% | 0.42 (IWM) | 0.42 correlated to IWM |
| ADBE | 86 | $1.1B | 39% | 219.5 | 88% | 0.54 (XLC) | 0.54 correlated to XLC |
| CRM | 86 | $2.3B | 40% | 219.5 | 89% | 0.53 (MSFT) | 0.53 correlated to MSFT |
| SNPS | 86 | $842M | 44% | 218.0 | 89% | 0.61 (QQQ) | 0.61 correlated to QQQ |
| NOW | 86 | $1.8B | 48% | 218.8 | 90% | 0.58 (MSFT) | 0.58 correlated to MSFT |
| INTU | 86 | $1.1B | 40% | 218.6 | 89% | 0.55 (XLC) | 0.55 correlated to XLC |
| IBM | 86 | $1.1B | 31% | 218.7 | 87% | 0.42 (DIA) | 0.42 correlated to DIA |
| SPOT | 86 | $818M | 48% | 218.9 | 89% | 0.57 (XLC) | 0.57 correlated to XLC |
| UNH | 86 | $1.8B | 33% | 218.1 | 89% | 0.47 (XLV) | 0.47 correlated to XLV |
| CI | 86 | $430M | 29% | 217.4 | 89% | 0.45 (XLV) | 0.45 correlated to XLV |
| HCA | 86 | $528M | 31% | 217.9 | 88% | 0.46 (XLV) | 0.46 correlated to XLV |
| VZ | 86 | $992M | 24% | 220.1 | 94% | 0.41 (XLP) | 0.41 correlated to XLP |
| TLT | 86 | $2.9B | 16% | 223.0 | 88% | 0.26 (XLU) | **watched, failing** |
| CRWD | 85 | $2.2B | 53% | 218.5 | 92% | 0.59 (QQQ) | 0.59 correlated to QQQ |
| ABNB | 85 | $673M | 44% | 217.5 | 90% | 0.65 (XLY) | 0.65 correlated to XLY |
| OKTA | 85 | $678M | 61% | 219.6 | 90% | 0.49 (QQQ) | 0.49 correlated to QQQ |
| DELL | 85 | $3.2B | 54% | 219.2 | 90% | 0.57 (XLK) | 0.57 correlated to XLK |
| PGR | 85 | $524M | 26% | 217.3 | 87% | 0.41 (XLF) | 0.41 correlated to XLF |
| REGN | 85 | $503M | 32% | 217.5 | 88% | 0.49 (XLV) | 0.49 correlated to XLV |
| ELV | 85 | $469M | 30% | 219.1 | 89% | 0.51 (XLV) | 0.51 correlated to XLV |
| BSX | 85 | $817M | 27% | 217.0 | 88% | 0.46 (XLV) | 0.46 correlated to XLV |
| BIIB | 85 | $223M | 33% | 218.6 | 89% | 0.53 (XLV) | 0.53 correlated to XLV |
| SBUX | 85 | $685M | 32% | 218.7 | 88% | 0.52 (XLY) | 0.52 correlated to XLY |
| NKE | 85 | $1.1B | 36% | 217.6 | 89% | 0.56 (XLY) | 0.56 correlated to XLY |
| KR | 85 | $399M | 27% | 217.8 | 92% | 0.47 (XLP) | 0.47 correlated to XLP |
| BA | 85 | $1.3B | 37% | 219.3 | 88% | 0.57 (XLI) | 0.57 correlated to XLI |
| FDX | 85 | $425M | 33% | 218.4 | 90% | 0.55 (XLI) | 0.55 correlated to XLI |
| NUE | 85 | $307M | 37% | 220.2 | 88% | 0.57 (XLI) | 0.57 correlated to XLI |
| TMUS | 85 | $814M | 27% | 217.3 | 89% | 0.43 (XLP) | 0.43 correlated to XLP |
| CMCSA | 85 | $653M | 28% | 217.5 | 97% | 0.51 (XLC) | 0.51 correlated to XLC |
| TAN | 85 | $34M | 40% | 220.7 | 91% | 0.61 (IWM) | 0.61 correlated to IWM |
| INTC | 84 | $9.7B | 58% | 218.3 | 93% | 0.62 (SMH) | 0.62 correlated to SMH |
| DDOG | 84 | $795M | 60% | 218.3 | 89% | 0.56 (QQQ) | 0.56 correlated to QQQ |
| SNOW | 84 | $1.3B | 62% | 219.4 | 89% | 0.55 (QQQ) | 0.55 correlated to QQQ |
| ZS | 84 | $542M | 59% | 219.4 | 87% | 0.54 (QQQ) | 0.54 correlated to QQQ |
| TEAM | 84 | $561M | 64% | 218.5 | 89% | 0.51 (XLY) | 0.51 correlated to XLY |
| VRTX | 84 | $573M | 30% | 217.9 | 89% | 0.53 (XLV) | 0.53 correlated to XLV |
| ISRG | 84 | $818M | 35% | 218.6 | 88% | 0.61 (SPY) | 0.61 correlated to SPY |
| ZTS | 84 | $309M | 31% | 219.4 | 89% | 0.54 (XLV) | 0.54 correlated to XLV |
| ROST | 84 | $488M | 30% | 220.1 | 88% | 0.53 (XLY) | 0.53 correlated to XLY |
| UPS | 84 | $439M | 29% | 219.0 | 89% | 0.54 (XLI) | 0.54 correlated to XLI |
| APD | 84 | $288M | 27% | 219.1 | 88% | 0.48 (DIA) | 0.48 correlated to DIA |
| AMT | 84 | $458M | 28% | 219.3 | 89% | 0.50 (XLU) | 0.50 correlated to XLU |
| CCI | 84 | $245M | 29% | 219.9 | 88% | 0.51 (XLU) | 0.51 correlated to XLU |
| EQIX | 84 | $549M | 28% | 217.1 | 89% | 0.54 (SPY) | 0.54 correlated to SPY |
| USO | 84 | $718M | 38% | 220.4 | 91% | 0.64 (XLE) | 0.64 correlated to XLE |
| BNB-USD | 84 | $1088.1B | 47% | 204.4 | 92% | 0.74 (ADA-USD) | 0.74 correlated to ADA-USD |
| AVGO | 83 | $7.9B | 45% | 219.8 | 91% | 0.78 (SMH) | 0.78 correlated to SMH |
| CSCO | 83 | $1.7B | 27% | 218.3 | 89% | 0.56 (SPY) | 0.56 correlated to SPY |
| QCOM | 83 | $1.8B | 43% | 218.2 | 89% | 0.74 (SMH) | 0.74 correlated to SMH |
| RBLX | 83 | $428M | 72% | 218.1 | 92% | 0.47 (XLC) | 0.47 correlated to XLC |
| DIS | 83 | $802M | 30% | 217.9 | 90% | 0.61 (XLC) | 0.61 correlated to XLC |
| SCHW | 83 | $744M | 32% | 217.9 | 89% | 0.64 (XLF) | 0.64 correlated to XLF |
| ALL | 83 | $395M | 26% | 219.5 | 89% | 0.53 (XLF) | 0.53 correlated to XLF |
| AON | 83 | $504M | 24% | 218.3 | 89% | 0.50 (XLF) | 0.50 correlated to XLF |
| LLY | 83 | $2.7B | 33% | 217.6 | 88% | 0.61 (XLV) | 0.61 correlated to XLV |
| PFE | 83 | $874M | 25% | 216.7 | 94% | 0.56 (XLV) | 0.56 correlated to XLV |
| BMY | 83 | $628M | 25% | 218.2 | 90% | 0.54 (XLV) | 0.54 correlated to XLV |
| GILD | 83 | $824M | 25% | 218.0 | 89% | 0.53 (XLV) | 0.53 correlated to XLV |
| MRNA | 83 | $3.1B | 82% | 217.9 | 91% | 0.35 (XLV) | 0.35 correlated to XLV |
| MO | 83 | $551M | 22% | 218.3 | 91% | 0.53 (XLP) | 0.53 correlated to XLP |
| PM | 83 | $828M | 24% | 218.9 | 88% | 0.54 (XLP) | 0.54 correlated to XLP |
| STZ | 83 | $269M | 26% | 218.4 | 88% | 0.52 (XLP) | 0.52 correlated to XLP |
| YUM | 83 | $336M | 21% | 218.4 | 89% | 0.51 (XLP) | 0.51 correlated to XLP |
| DE | 83 | $771M | 30% | 219.3 | 90% | 0.58 (XLI) | 0.58 correlated to XLI |
| MMM | 83 | $488M | 29% | 217.5 | 91% | 0.59 (DIA) | 0.59 correlated to DIA |
| NEM | 83 | $739M | 40% | 220.5 | 90% | 0.70 (GLD) | 0.70 correlated to GLD |
| SHW | 83 | $542M | 28% | 218.1 | 89% | 0.58 (DIA) | 0.58 correlated to DIA |
| PSA | 83 | $240M | 24% | 219.1 | 89% | 0.52 (XLP) | 0.52 correlated to XLP |
| META | 82 | $11.9B | 46% | 219.5 | 88% | 0.80 (XLC) | watched |
| TXN | 82 | $1.5B | 34% | 219.0 | 88% | 0.70 (SMH) | 0.70 correlated to SMH |
| NXPI | 82 | $742M | 42% | 220.4 | 89% | 0.76 (SMH) | 0.76 correlated to SMH |
| CDNS | 82 | $733M | 37% | 219.1 | 89% | 0.72 (XLK) | 0.72 correlated to XLK |
| PLTR | 82 | $4.5B | 66% | 219.8 | 92% | 0.58 (QQQ) | 0.58 correlated to QQQ |
| HOOD | 82 | $2.0B | 68% | 218.0 | 93% | 0.60 (IWM) | 0.60 correlated to IWM |
| TRV | 82 | $517M | 22% | 218.8 | 88% | 0.56 (XLF) | 0.56 correlated to XLF |
| MRK | 82 | $1.3B | 24% | 217.7 | 88% | 0.59 (XLV) | 0.59 correlated to XLV |
| DHR | 82 | $762M | 29% | 219.5 | 89% | 0.64 (XLV) | 0.64 correlated to XLV |
| AMGN | 82 | $1.1B | 25% | 218.7 | 89% | 0.61 (XLV) | 0.61 correlated to XLV |
| SYK | 82 | $750M | 26% | 219.2 | 90% | 0.61 (XLV) | 0.61 correlated to XLV |
| MDT | 82 | $909M | 23% | 218.1 | 88% | 0.57 (XLV) | 0.57 correlated to XLV |
| LOW | 82 | $637M | 27% | 217.5 | 88% | 0.61 (DIA) | 0.61 correlated to DIA |
| TJX | 82 | $1.0B | 23% | 220.3 | 88% | 0.53 (DIA) | 0.53 correlated to DIA |
| KHC | 82 | $337M | 24% | 219.4 | 96% | 0.60 (XLP) | 0.60 correlated to XLP |
| RTX | 82 | $814M | 25% | 217.6 | 87% | 0.55 (XLI) | 0.55 correlated to XLI |
| SLB | 82 | $610M | 38% | 220.4 | 92% | 0.77 (XLE) | 0.77 correlated to XLE |
| PLD | 82 | $445M | 27% | 217.6 | 88% | 0.60 (IWM) | 0.60 correlated to IWM |
| XLU | 82 | $985M | 17% | 219.4 | 97% | 0.56 (XLP) | **watched, failing** |
| JETS | 82 | $103M | 33% | 220.3 | 95% | 0.74 (IWM) | 0.74 correlated to IWM |
| EWY | 82 | $2.3B | 35% | 222.7 | 88% | 0.68 (SMH) | 0.68 correlated to SMH |
| SLV | 82 | $890M | 39% | 222.5 | 94% | 0.80 (GLD) | 0.80 correlated to GLD |
| GDXJ | 82 | $476M | 43% | 221.9 | 90% | 0.81 (GLD) | 0.81 correlated to GLD |
| ARKK | 82 | $390M | 47% | 220.3 | 93% | 0.80 (IWM) | 0.80 correlated to IWM |
| HYPE-USD | 82 | $0M | 68% | 168.8 | 93% | 0.56 (SOL-USD) | **watched, failing** |
| KLAC | 81 | $1.7B | 48% | 219.2 | 93% | 0.88 (SMH) | 0.88 correlated to SMH |
| SHOP | 81 | $1.2B | 67% | 219.1 | 91% | 0.63 (XLY) | 0.63 correlated to XLY |
| NET | 81 | $951M | 69% | 220.3 | 90% | 0.60 (QQQ) | 0.60 correlated to QQQ |
| MDB | 81 | $596M | 71% | 219.3 | 90% | 0.55 (QQQ) | 0.55 correlated to QQQ |
| PARA | 81 | $0M | 188% | 212.0 | 85% | 0.07 (ETH-USD) | 0.07 correlated to ETH-USD |
| SPGI | 81 | $756M | 26% | 218.6 | 87% | 0.61 (XLF) | 0.61 correlated to XLF |
| TFC | 81 | $339M | 32% | 217.0 | 93% | 0.76 (XLF) | 0.76 correlated to XLF |
| CB | 81 | $536M | 20% | 217.9 | 89% | 0.56 (XLF) | 0.56 correlated to XLF |
| ABBV | 81 | $1.2B | 24% | 217.7 | 88% | 0.59 (XLV) | 0.59 correlated to XLV |
| TMO | 81 | $1.3B | 28% | 218.4 | 88% | 0.65 (XLV) | 0.65 correlated to XLV |
| ABT | 81 | $849M | 23% | 218.0 | 89% | 0.61 (XLV) | 0.61 correlated to XLV |
| WMT | 81 | $2.4B | 23% | 219.7 | 90% | 0.61 (XLP) | 0.61 correlated to XLP |
| HD | 81 | $1.3B | 25% | 218.3 | 88% | 0.64 (DIA) | 0.64 correlated to DIA |
| GIS | 81 | $327M | 23% | 218.5 | 90% | 0.63 (XLP) | 0.63 correlated to XLP |
| CAT | 81 | $1.9B | 32% | 217.9 | 87% | 0.73 (XLI) | 0.73 correlated to XLI |
| GD | 81 | $416M | 21% | 215.8 | 89% | 0.58 (XLI) | 0.58 correlated to XLI |
| GE | 81 | $1.4B | 31% | 218.5 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| UNP | 81 | $663M | 23% | 218.2 | 89% | 0.63 (XLI) | 0.63 correlated to XLI |
| CSX | 81 | $471M | 24% | 217.5 | 93% | 0.64 (XLI) | 0.64 correlated to XLI |
| NSC | 81 | $293M | 25% | 217.9 | 88% | 0.65 (XLI) | 0.65 correlated to XLI |
| ETN | 81 | $795M | 33% | 219.7 | 87% | 0.72 (XLI) | 0.72 correlated to XLI |
| VLO | 81 | $1.1B | 38% | 218.2 | 87% | 0.76 (XLE) | 0.76 correlated to XLE |
| OXY | 81 | $500M | 38% | 219.7 | 91% | 0.82 (XLE) | 0.82 correlated to XLE |
| HAL | 81 | $341M | 40% | 219.4 | 94% | 0.84 (XLE) | 0.84 correlated to XLE |
| LIN | 81 | $958M | 21% | 219.1 | 87% | 0.58 (DIA) | 0.58 correlated to DIA |
| SPG | 81 | $236M | 26% | 219.1 | 88% | 0.65 (IWM) | 0.65 correlated to IWM |
| O | 81 | $410M | 19% | 218.7 | 89% | 0.58 (XLU) | 0.58 correlated to XLU |
| XBI | 81 | $1.4B | 33% | 218.5 | 89% | 0.73 (IWM) | 0.73 correlated to IWM |
| XME | 81 | $172M | 33% | 220.8 | 88% | 0.72 (IWM) | 0.72 correlated to IWM |
| ITB | 81 | $204M | 30% | 219.4 | 89% | 0.70 (IWM) | 0.70 correlated to IWM |
| GDX | 81 | $1.8B | 39% | 222.1 | 91% | 0.82 (GLD) | 0.82 correlated to GLD |
| BTC-USD | 81 | $0M | 39% | 196.9 | 91% | 0.82 (ETH-USD) | watched |
| LTC-USD | 81 | $0M | 58% | 196.6 | 96% | 0.76 (ADA-USD) | watched |
| BCH-USD | 81 | $0M | 68% | 197.2 | 93% | 0.63 (BTC-USD) | 0.63 correlated to BTC-USD |
| AAPL | 80 | $12.5B | 28% | 221.5 | 87% | 0.70 (SPY) | watched |
| MSFT | 80 | $10.5B | 28% | 219.5 | 87% | 0.72 (QQQ) | watched |
| NVDA | 80 | $22.9B | 51% | 219.9 | 92% | 0.84 (SMH) | watched |
| AMZN | 80 | $8.7B | 37% | 221.1 | 88% | 0.79 (XLY) | watched |
| GOOGL | 80 | $7.9B | 33% | 219.4 | 88% | 0.75 (XLC) | watched |
| TSLA | 80 | $12.8B | 60% | 220.3 | 89% | 0.76 (XLY) | watched |
| MU | 80 | $24.7B | 58% | 221.1 | 88% | 0.78 (SMH) | 0.78 correlated to SMH |
| AMAT | 80 | $2.9B | 48% | 219.9 | 87% | 0.87 (SMH) | 0.87 correlated to SMH |
| ADI | 80 | $1.3B | 35% | 218.4 | 89% | 0.79 (SMH) | 0.79 correlated to SMH |
| COF | 80 | $718M | 35% | 218.3 | 88% | 0.78 (XLF) | 0.78 correlated to XLF |
| USB | 80 | $417M | 30% | 218.3 | 92% | 0.76 (XLF) | 0.76 correlated to XLF |
| AIG | 80 | $309M | 26% | 218.6 | 89% | 0.69 (XLF) | 0.69 correlated to XLF |
| JNJ | 80 | $1.7B | 18% | 219.9 | 87% | 0.60 (XLV) | 0.60 correlated to XLV |
| COST | 80 | $2.0B | 23% | 217.5 | 88% | 0.63 (XLP) | 0.63 correlated to XLP |
| MCD | 80 | $1.2B | 18% | 218.0 | 87% | 0.61 (XLP) | 0.61 correlated to XLP |
| KMB | 80 | $401M | 21% | 217.6 | 88% | 0.64 (XLP) | 0.64 correlated to XLP |
| MPC | 80 | $914M | 34% | 219.2 | 86% | 0.77 (XLE) | 0.77 correlated to XLE |
| DVN | 80 | $464M | 40% | 221.0 | 92% | 0.87 (XLE) | 0.87 correlated to XLE |
| XLRE | 80 | $275M | 19% | 218.1 | 96% | 0.66 (XLU) | 0.66 correlated to XLU |
| DBC | 80 | $22M | 20% | 221.6 | 94% | 0.65 (XLE) | 0.65 correlated to XLE |
| ETH-USD | 80 | $0M | 55% | 198.8 | 92% | 0.82 (BTC-USD) | watched |
| AMD | 79 | $10.7B | 58% | 220.0 | 88% | 0.81 (SMH) | watched |
| LRCX | 79 | $2.6B | 51% | 219.2 | 90% | 0.89 (SMH) | 0.89 correlated to SMH |
| SMCI | 79 | $1.3B | 89% | 219.1 | 95% | 0.51 (SMH) | 0.51 correlated to SMH |
| WFC | 79 | $1.2B | 30% | 218.8 | 89% | 0.80 (XLF) | 0.80 correlated to XLF |
| GS | 79 | $1.8B | 29% | 219.6 | 87% | 0.77 (XLF) | 0.77 correlated to XLF |
| MS | 79 | $967M | 29% | 218.7 | 88% | 0.79 (XLF) | 0.79 correlated to XLF |
| C | 79 | $1.2B | 29% | 218.3 | 89% | 0.78 (XLF) | 0.78 correlated to XLF |
| BLK | 79 | $613M | 27% | 221.4 | 88% | 0.77 (XLF) | 0.77 correlated to XLF |
| AXP | 79 | $866M | 29% | 221.5 | 88% | 0.80 (XLF) | 0.80 correlated to XLF |
| V | 79 | $2.3B | 23% | 217.9 | 88% | 0.69 (XLF) | 0.69 correlated to XLF |
| MA | 79 | $1.7B | 24% | 218.8 | 88% | 0.70 (XLF) | 0.70 correlated to XLF |
| HON | 79 | $561M | 23% | 218.0 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| EMR | 79 | $377M | 28% | 219.0 | 88% | 0.77 (XLI) | 0.77 correlated to XLI |
| PSX | 79 | $723M | 33% | 220.5 | 87% | 0.80 (XLE) | 0.80 correlated to XLE |
| NEE | 79 | $939M | 27% | 217.9 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| SRE | 79 | $278M | 24% | 218.4 | 90% | 0.72 (XLU) | 0.72 correlated to XLU |
| XLP | 79 | $908M | 14% | 220.8 | 88% | 0.62 (XLV) | **watched, failing** |
| XHB | 79 | $173M | 28% | 220.3 | 89% | 0.78 (IWM) | 0.78 correlated to IWM |
| KRE | 79 | $1.0B | 29% | 218.7 | 91% | 0.79 (XLF) | 0.79 correlated to XLF |
| EEM | 79 | $1.3B | 20% | 223.0 | 92% | 0.72 (SMH) | 0.72 correlated to SMH |
| SOL-USD | 79 | $0M | 62% | 193.9 | 92% | 0.81 (ETH-USD) | watched |
| XRP-USD | 79 | $0M | 64% | 197.1 | 97% | 0.83 (ADA-USD) | watched |
| ADA-USD | 79 | $0M | 59% | 170.8 | 92% | 0.84 (DOGE-USD) | **watched, failing** |
| DOT-USD | 79 | $0M | 69% | 198.6 | 98% | 0.75 (AVAX-USD) | watched |
| JUP-USD | 79 | $0M | 995% | 201.1 | 73% | 0.08 (GC=F) | **watched, failing** |
| MRVL | 78 | $4.8B | 66% | 219.3 | 90% | 0.78 (SMH) | 0.78 correlated to SMH |
| ARM | 78 | $1.1B | 75% | 212.0 | 90% | 0.68 (SMH) | 0.68 correlated to SMH |
| COIN | 78 | $1.5B | 86% | 219.9 | 90% | 0.57 (QQQ) | 0.57 correlated to QQQ |
| BAC | 78 | $1.9B | 27% | 219.9 | 92% | 0.84 (XLF) | 0.84 correlated to XLF |
| PNC | 78 | $407M | 27% | 217.8 | 88% | 0.80 (XLF) | 0.80 correlated to XLF |
| MET | 78 | $286M | 26% | 218.9 | 88% | 0.80 (XLF) | 0.80 correlated to XLF |
| MDLZ | 78 | $454M | 21% | 217.9 | 88% | 0.75 (XLP) | 0.75 correlated to XLP |
| PH | 78 | $569M | 29% | 218.3 | 87% | 0.82 (XLI) | 0.82 correlated to XLI |
| ITW | 78 | $318M | 22% | 219.7 | 89% | 0.75 (XLI) | 0.75 correlated to XLI |
| EOG | 78 | $396M | 33% | 219.5 | 89% | 0.89 (XLE) | 0.89 correlated to XLE |
| D | 78 | $265M | 23% | 217.5 | 90% | 0.76 (XLU) | 0.76 correlated to XLU |
| EXC | 78 | $294M | 21% | 218.6 | 94% | 0.76 (XLU) | 0.76 correlated to XLU |
| XLV | 78 | $1.3B | 15% | 219.4 | 89% | 0.70 (DIA) | **watched, failing** |
| SMH | 78 | $3.8B | 38% | 221.1 | 87% | 0.93 (XLK) | watched |
| SOXX | 78 | $4.0B | 40% | 221.2 | 92% | 0.99 (SMH) | 0.99 correlated to SMH |
| IBB | 78 | $332M | 23% | 219.0 | 89% | 0.74 (XLV) | 0.74 correlated to XLV |
| XRT | 78 | $298M | 27% | 221.5 | 89% | 0.82 (IWM) | 0.82 correlated to IWM |
| EWJ | 78 | $331M | 19% | 222.5 | 89% | 0.71 (SPY) | 0.71 correlated to SPY |
| LINK-USD | 78 | $0M | 70% | 198.7 | 98% | 0.79 (ADA-USD) | watched |
| ATOM-USD | 78 | $68M | 71% | 204.4 | 98% | 0.79 (DOT-USD) | 0.79 correlated to DOT-USD |
| XLM-USD | 78 | $29M | 68% | 205.4 | 92% | 0.75 (XRP-USD) | 0.75 correlated to XRP-USD |
| ETC-USD | 78 | $330M | 68% | 204.5 | 98% | 0.82 (ETH-USD) | 0.82 correlated to ETH-USD |
| ICP-USD | 78 | $166M | 82% | 205.0 | 98% | 0.64 (DOT-USD) | 0.64 correlated to DOT-USD |
| HBAR-USD | 78 | $7M | 78% | 204.3 | 91% | 0.66 (LINK-USD) | 0.66 correlated to LINK-USD |
| EGLD-USD | 78 | $27M | 73% | 203.6 | 97% | 0.74 (DOT-USD) | 0.74 correlated to DOT-USD |
| PRU | 77 | $181M | 26% | 218.6 | 89% | 0.83 (XLF) | 0.83 correlated to XLF |
| PG | 77 | $1.3B | 19% | 218.7 | 89% | 0.78 (XLP) | 0.78 correlated to XLP |
| PEP | 77 | $1.1B | 19% | 218.7 | 88% | 0.75 (XLP) | 0.75 correlated to XLP |
| CL | 77 | $417M | 19% | 218.4 | 88% | 0.74 (XLP) | 0.74 correlated to XLP |
| COP | 77 | $812M | 33% | 220.6 | 88% | 0.91 (XLE) | 0.91 correlated to XLE |
| XEL | 77 | $407M | 21% | 217.6 | 89% | 0.78 (XLU) | 0.78 correlated to XLU |
| ED | 77 | $223M | 19% | 219.6 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| XLY | 77 | $714M | 24% | 221.4 | 93% | 0.87 (SPY) | watched |
| XLC | 77 | $624M | 21% | 219.6 | 90% | 0.81 (SPY) | watched |
| XLB | 77 | $546M | 19% | 220.5 | 96% | 0.81 (XLI) | 0.81 correlated to XLI |
| XOP | 77 | $536M | 33% | 221.7 | 89% | 0.94 (XLE) | 0.94 correlated to XLE |
| VGK | 77 | $174M | 18% | 224.0 | 87% | 0.75 (SPY) | 0.75 correlated to SPY |
| VIXY | 77 | $42M | 69% | 218.9 | 87% | 0.77 (SPY) | 0.77 correlated to SPY |
| MTUM | 77 | $288M | 23% | 220.7 | 95% | 0.86 (XLK) | 0.86 correlated to XLK |
| AVAX-USD | 77 | $0M | 75% | 197.7 | 98% | 0.76 (LINK-USD) | watched |
| UNI-USD | 77 | $0M | 85% | 197.4 | 98% | 0.69 (ETH-USD) | 0.69 correlated to ETH-USD |
| AAVE-USD | 77 | $0M | 77% | 198.2 | 93% | 0.75 (ETH-USD) | 0.75 correlated to ETH-USD |
| ALGO-USD | 77 | $8M | 75% | 205.3 | 91% | 0.73 (AVAX-USD) | 0.73 correlated to AVAX-USD |
| VET-USD | 77 | $0M | 72% | 204.6 | 88% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| AXS-USD | 77 | $19M | 84% | 204.7 | 98% | 0.69 (DOT-USD) | 0.69 correlated to DOT-USD |
| 1INCH-USD | 77 | $1M | 70% | 204.7 | 91% | 0.79 (ADA-USD) | 0.79 correlated to ADA-USD |
| JPM | 76 | $2.2B | 24% | 219.2 | 86% | 0.84 (XLF) | 0.84 correlated to XLF |
| XOM | 76 | $2.1B | 27% | 221.0 | 89% | 0.92 (XLE) | 0.92 correlated to XLE |
| CVX | 76 | $1.6B | 25% | 220.8 | 88% | 0.91 (XLE) | 0.91 correlated to XLE |
| DUK | 76 | $445M | 18% | 218.7 | 88% | 0.82 (XLU) | 0.82 correlated to XLU |
| SO | 76 | $488M | 19% | 218.7 | 88% | 0.81 (XLU) | 0.81 correlated to XLU |
| AEP | 76 | $412M | 20% | 218.4 | 88% | 0.82 (XLU) | 0.82 correlated to XLU |
| IWM | 76 | $6.3B | 22% | 220.9 | 88% | 0.85 (SPY) | watched |
| DOGE-USD | 76 | $0M | 74% | 198.2 | 93% | 0.84 (ADA-USD) | watched |
| RUNE-USD | 76 | $6M | 93% | 205.1 | 96% | 0.62 (ETH-USD) | 0.62 correlated to ETH-USD |
| GRT-USD | 76 | $0M | 78% | 198.2 | 90% | 0.75 (DOT-USD) | 0.75 correlated to DOT-USD |
| MANA-USD | 76 | $1M | 78% | 204.6 | 91% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| THETA-USD | 76 | $1M | 80% | 204.3 | 95% | 0.75 (DOT-USD) | 0.75 correlated to DOT-USD |
| GOOG | 75 | $5.4B | 32% | 219.0 | 88% | 1.00 (GOOGL) | 1.00 correlated to GOOGL |
| XLK | 75 | $1.4B | 26% | 221.1 | 90% | 0.97 (QQQ) | watched |
| XLF | 75 | $1.8B | 18% | 220.4 | 91% | 0.87 (DIA) | watched |
| VLUE | 75 | $94M | 19% | 219.3 | 87% | 0.85 (IWM) | 0.85 correlated to IWM |
| NEAR-USD | 75 | $4.4B | 90% | 205.1 | 98% | 0.74 (DOT-USD) | 0.74 correlated to DOT-USD |
| SAND-USD | 75 | $1M | 85% | 204.2 | 92% | 0.72 (DOT-USD) | 0.72 correlated to DOT-USD |
| CRV-USD | 75 | $0M | 86% | 196.5 | 92% | 0.70 (LINK-USD) | 0.70 correlated to LINK-USD |
| XLI | 74 | $1.3B | 18% | 219.9 | 86% | 0.87 (DIA) | **watched, failing** |
| INJ-USD | 74 | $889M | 93% | 205.0 | 98% | 0.74 (AVAX-USD) | 0.74 correlated to AVAX-USD |
| SEI-USD | 74 | $3M | 89% | 201.2 | 89% | 0.71 (ADA-USD) | 0.71 correlated to ADA-USD |
| SNX-USD | 74 | $2M | 93% | 204.4 | 95% | 0.69 (LINK-USD) | 0.69 correlated to LINK-USD |
| DYDX-USD | 74 | $0M | 93% | 203.9 | 95% | 0.69 (DOT-USD) | 0.69 correlated to DOT-USD |
| QQQ | 73 | $23.6B | 23% | 221.0 | 85% | 0.97 (XLK) | watched |
| DIA | 73 | $1.6B | 15% | 219.3 | 86% | 0.91 (SPY) | **watched, failing** |
| MDY | 73 | $394M | 20% | 221.5 | 88% | 0.96 (IWM) | 0.96 correlated to IWM |
| IWF | 73 | $459M | 22% | 222.5 | 89% | 0.98 (QQQ) | 0.98 correlated to QQQ |
| ENS-USD | 73 | $82M | 92% | 204.2 | 98% | 0.79 (ADA-USD) | 0.79 correlated to ADA-USD |
| SPY | 72 | $31.0B | 17% | 221.8 | 84% | 0.95 (QQQ) | **watched, failing** |
| KAS-USD | 71 | $1M | 110% | 204.0 | 89% | 0.63 (SOL-USD) | 0.63 correlated to SOL-USD |
| UVXY | 69 | $138M | 101% | 220.5 | 85% | 0.77 (SPY) | 0.77 correlated to SPY |
| SHIB-USD | 63 | $0M | 72% | 194.4 | 7% | 0.81 (DOGE-USD) | 0.81 correlated to DOGE-USD |
| PEPE-USD | 59 | $0M | 86% | 186.7 | 3% | 0.86 (DOGE-USD) | 0.86 correlated to DOGE-USD |

---

_The candidate pool is a committed snapshot in `server/candidates/`, edit it freely. Being a snapshot of today's liquid names, it is itself survivorship-biased — it contains what survived to be listed — so treat it as a starting universe rather than an unbiased one. Nothing here places a trade or edits a watchlist; adding a symbol is still your call._
