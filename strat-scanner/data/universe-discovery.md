# Universe Discovery — is this the right watchlist?

_Generated 2026-10-06_ · 280 of 318 candidates screened · 39 currently watched

Screened the committed candidate pools in `server/candidates/` plus every currently watched symbol, over 3 years of daily bars. Cheap gates — liquidity, volatility, history — are applied first; the Strat engine is replayed only over what survives, since structure quality is expensive to compute and irrelevant for a symbol already rejected on liquidity.

12 candidate(s) unavailable: SQ: SQ: HTTP 404 from data provider; BK: BK: HTTP 404 from data provider; MMC: MMC: HTTP 404 from data provider; MATIC-USD: MATIC-USD: HTTP 404 from data provider; APT-USD: APT-USD: HTTP 404 from data provider; SUI-USD: SUI-USD: HTTP 404 from data provider; IMX-USD: IMX-USD: HTTP 404 from data provider; FTM-USD: FTM-USD: HTTP 404 from data provider; COMP-USD: COMP-USD: HTTP 404 from data provider; TAO-USD: TAO-USD: HTTP 404 from data provider; PUMP-USD: PUMP-USD: HTTP 404 from data provider; STX-USD: STX-USD: HTTP 404 from data provider.

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
| XLV | 77 | 15% volatility — too quiet to pay for risk |
| XLP | 79 | 14% volatility — too quiet to pay for risk |
| ADA-USD | 79 | only 236 daily bars |
| JUP-USD | 80 | 945% volatility — a lottery ticket |
| XLU | 82 | 17% volatility — too quiet to pay for risk |
| HYPE-USD | 82 | only 232 daily bars |
| TLT | 86 | 16% volatility — too quiet to pay for risk |
| EURUSD=X | 88 | 8% volatility — too quiet to pay for risk |

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
| TRX-USD | 91 | $149M | 48% | 204.7 | 90% | 0.32 (ADA-USD) | 0.32 correlated to ADA-USD |
| MKR-USD | 91 | $0M | 71% | 190.8 | 91% | 0.09 (ADA-USD) | 0.09 correlated to ADA-USD |
| 1INCH-USD | 91 | $1M | 72% | 204.8 | 91% | 0.06 (AAPL) | 0.06 correlated to AAPL |
| DLTR | 90 | $292M | 40% | 219.5 | 88% | 0.35 (XLP) | 0.35 correlated to XLP |
| UNG | 90 | $118M | 64% | 223.7 | 91% | 0.21 (XLE) | 0.21 correlated to XLE |
| GC=F | 90 | $666M | 19% | 218.1 | 87% | 0.11 (ADA-USD) | watched |
| DG | 89 | $274M | 38% | 218.0 | 90% | 0.39 (XLP) | 0.39 correlated to XLP |
| EL | 89 | $235M | 45% | 218.3 | 90% | 0.49 (SPY) | 0.49 correlated to SPY |
| PANW | 88 | $2.0B | 44% | 218.6 | 90% | 0.51 (QQQ) | 0.51 correlated to QQQ |
| UBER | 88 | $1.2B | 45% | 218.4 | 93% | 0.53 (XLY) | 0.53 correlated to XLY |
| WBD | 88 | $616M | 52% | 217.3 | 94% | 0.50 (XLC) | 0.50 correlated to XLC |
| NOC | 88 | $411M | 26% | 218.0 | 89% | 0.29 (XLI) | 0.29 correlated to XLI |
| FXI | 88 | $594M | 31% | 224.9 | 94% | 0.41 (IWM) | 0.41 correlated to IWM |
| GLD | 88 | $3.3B | 19% | 220.7 | 88% | 0.21 (TLT) | watched |
| EURUSD=X | 88 | $0M | 8% | 217.0 | 98% | 0.15 (HYPE-USD) | **watched, failing** |
| IBM | 87 | $1.4B | 31% | 219.1 | 87% | 0.42 (DIA) | 0.42 correlated to DIA |
| PYPL | 87 | $605M | 44% | 218.9 | 91% | 0.55 (XLY) | 0.55 correlated to XLY |
| WDAY | 87 | $572M | 41% | 219.9 | 89% | 0.52 (MSFT) | 0.52 correlated to MSFT |
| HPQ | 87 | $429M | 37% | 219.5 | 95% | 0.51 (SPY) | 0.51 correlated to SPY |
| NFLX | 87 | $2.5B | 45% | 219.2 | 92% | 0.58 (XLC) | 0.58 correlated to XLC |
| CVS | 87 | $702M | 31% | 217.5 | 89% | 0.39 (XLV) | 0.39 correlated to XLV |
| TGT | 87 | $563M | 37% | 218.4 | 89% | 0.47 (XLY) | 0.47 correlated to XLY |
| LULU | 87 | $382M | 44% | 219.1 | 89% | 0.56 (XLY) | 0.56 correlated to XLY |
| DPZ | 87 | $248M | 30% | 216.6 | 90% | 0.38 (XLY) | 0.38 correlated to XLY |
| LMT | 87 | $586M | 24% | 218.8 | 88% | 0.31 (XLI) | 0.31 correlated to XLI |
| FCX | 87 | $833M | 45% | 219.5 | 93% | 0.58 (IWM) | 0.58 correlated to IWM |
| T | 87 | $963M | 25% | 219.2 | 94% | 0.38 (XLP) | 0.38 correlated to XLP |
| ADBE | 86 | $1.2B | 38% | 219.5 | 88% | 0.55 (XLC) | 0.55 correlated to XLC |
| CRM | 86 | $2.4B | 39% | 219.5 | 89% | 0.54 (MSFT) | 0.54 correlated to MSFT |
| ORCL | 86 | $4.1B | 43% | 219.5 | 87% | 0.56 (XLK) | 0.56 correlated to XLK |
| SNPS | 86 | $670M | 44% | 218.3 | 89% | 0.61 (QQQ) | 0.61 correlated to QQQ |
| NOW | 86 | $2.0B | 45% | 219.1 | 90% | 0.61 (MSFT) | 0.61 correlated to MSFT |
| INTU | 86 | $1.1B | 39% | 218.4 | 89% | 0.56 (SPY) | 0.56 correlated to SPY |
| OKTA | 86 | $454M | 60% | 219.6 | 90% | 0.48 (QQQ) | 0.48 correlated to QQQ |
| DELL | 86 | $3.1B | 53% | 219.1 | 90% | 0.56 (XLK) | 0.56 correlated to XLK |
| SPOT | 86 | $771M | 48% | 219.0 | 89% | 0.58 (XLC) | 0.58 correlated to XLC |
| UNH | 86 | $1.8B | 33% | 218.3 | 89% | 0.46 (XLV) | 0.46 correlated to XLV |
| CI | 86 | $430M | 29% | 217.7 | 89% | 0.44 (XLV) | 0.44 correlated to XLV |
| HCA | 86 | $530M | 30% | 218.0 | 88% | 0.45 (XLV) | 0.45 correlated to XLV |
| CMG | 86 | $513M | 35% | 220.1 | 94% | 0.52 (XLY) | 0.52 correlated to XLY |
| DOW | 86 | $261M | 34% | 219.8 | 95% | 0.51 (XLE) | 0.51 correlated to XLE |
| VZ | 86 | $966M | 23% | 219.9 | 94% | 0.40 (XLP) | 0.40 correlated to XLP |
| XLE | 86 | $1.8B | 26% | 222.3 | 96% | 0.44 (XLF) | watched |
| EWZ | 86 | $799M | 29% | 221.0 | 94% | 0.44 (IWM) | 0.44 correlated to IWM |
| TLT | 86 | $2.6B | 16% | 223.0 | 88% | 0.26 (XLU) | **watched, failing** |
| CRWD | 85 | $1.7B | 52% | 218.6 | 92% | 0.58 (QQQ) | 0.58 correlated to QQQ |
| ABNB | 85 | $691M | 44% | 217.8 | 90% | 0.64 (XLY) | 0.64 correlated to XLY |
| PGR | 85 | $524M | 26% | 217.7 | 87% | 0.41 (XLF) | 0.41 correlated to XLF |
| REGN | 85 | $503M | 31% | 217.6 | 88% | 0.51 (XLV) | 0.51 correlated to XLV |
| ELV | 85 | $447M | 30% | 219.4 | 89% | 0.51 (XLV) | 0.51 correlated to XLV |
| BSX | 85 | $870M | 27% | 217.0 | 88% | 0.46 (XLV) | 0.46 correlated to XLV |
| BIIB | 85 | $184M | 33% | 218.7 | 89% | 0.52 (XLV) | 0.52 correlated to XLV |
| SBUX | 85 | $656M | 32% | 218.7 | 88% | 0.52 (SPY) | 0.52 correlated to SPY |
| NKE | 85 | $1.0B | 36% | 217.9 | 89% | 0.56 (XLY) | 0.56 correlated to XLY |
| KR | 85 | $388M | 27% | 218.0 | 92% | 0.46 (XLP) | 0.46 correlated to XLP |
| BA | 85 | $1.2B | 37% | 219.5 | 88% | 0.57 (XLI) | 0.57 correlated to XLI |
| FDX | 85 | $474M | 33% | 218.8 | 90% | 0.55 (XLI) | 0.55 correlated to XLI |
| NUE | 85 | $309M | 37% | 220.3 | 88% | 0.57 (XLI) | 0.57 correlated to XLI |
| TMUS | 85 | $757M | 25% | 217.6 | 89% | 0.43 (XLP) | 0.43 correlated to XLP |
| CMCSA | 85 | $667M | 28% | 217.3 | 97% | 0.52 (XLC) | 0.52 correlated to XLC |
| TAN | 85 | $32M | 40% | 220.9 | 91% | 0.60 (IWM) | 0.60 correlated to IWM |
| INTC | 84 | $10.3B | 55% | 218.4 | 93% | 0.61 (SMH) | 0.61 correlated to SMH |
| DDOG | 84 | $916M | 59% | 218.3 | 90% | 0.55 (QQQ) | 0.55 correlated to QQQ |
| SNOW | 84 | $1.3B | 61% | 219.3 | 90% | 0.54 (QQQ) | 0.54 correlated to QQQ |
| ZS | 84 | $411M | 59% | 219.2 | 87% | 0.54 (QQQ) | 0.54 correlated to QQQ |
| TEAM | 84 | $555M | 63% | 218.5 | 89% | 0.51 (XLY) | 0.51 correlated to XLY |
| ALL | 84 | $400M | 26% | 219.6 | 89% | 0.53 (XLF) | 0.53 correlated to XLF |
| AON | 84 | $486M | 24% | 218.6 | 89% | 0.50 (XLF) | 0.50 correlated to XLF |
| PFE | 84 | $947M | 25% | 216.7 | 94% | 0.54 (XLV) | 0.54 correlated to XLV |
| VRTX | 84 | $552M | 29% | 218.2 | 89% | 0.52 (XLV) | 0.52 correlated to XLV |
| ZTS | 84 | $372M | 30% | 219.3 | 89% | 0.53 (XLV) | 0.53 correlated to XLV |
| ROST | 84 | $500M | 30% | 220.1 | 88% | 0.53 (XLY) | 0.53 correlated to XLY |
| STZ | 84 | $239M | 26% | 218.5 | 88% | 0.50 (XLP) | 0.50 correlated to XLP |
| UPS | 84 | $449M | 29% | 219.5 | 89% | 0.54 (XLI) | 0.54 correlated to XLI |
| APD | 84 | $297M | 27% | 219.1 | 89% | 0.48 (XLI) | 0.48 correlated to XLI |
| AMT | 84 | $424M | 27% | 219.8 | 89% | 0.51 (XLU) | 0.51 correlated to XLU |
| CCI | 84 | $231M | 27% | 220.0 | 88% | 0.53 (XLU) | 0.53 correlated to XLU |
| EQIX | 84 | $551M | 28% | 217.1 | 89% | 0.53 (SPY) | 0.53 correlated to SPY |
| USO | 84 | $776M | 38% | 220.7 | 91% | 0.64 (XLE) | 0.64 correlated to XLE |
| BNB-USD | 84 | $1119.7B | 47% | 204.3 | 92% | 0.72 (ADA-USD) | 0.72 correlated to ADA-USD |
| AVGO | 83 | $7.8B | 44% | 219.7 | 91% | 0.77 (SMH) | 0.77 correlated to SMH |
| CSCO | 83 | $2.0B | 26% | 218.4 | 90% | 0.55 (SPY) | 0.55 correlated to SPY |
| QCOM | 83 | $1.9B | 43% | 218.3 | 89% | 0.74 (SMH) | 0.74 correlated to SMH |
| RBLX | 83 | $417M | 71% | 218.3 | 92% | 0.47 (XLC) | 0.47 correlated to XLC |
| DIS | 83 | $867M | 30% | 217.6 | 90% | 0.61 (XLC) | 0.61 correlated to XLC |
| LLY | 83 | $2.8B | 33% | 217.6 | 88% | 0.61 (XLV) | 0.61 correlated to XLV |
| BMY | 83 | $622M | 25% | 218.6 | 90% | 0.53 (XLV) | 0.53 correlated to XLV |
| GILD | 83 | $792M | 25% | 217.9 | 89% | 0.52 (XLV) | 0.52 correlated to XLV |
| MRNA | 83 | $1.2B | 81% | 218.1 | 91% | 0.35 (XLV) | 0.35 correlated to XLV |
| ISRG | 83 | $933M | 35% | 218.8 | 88% | 0.62 (SPY) | 0.62 correlated to SPY |
| MO | 83 | $557M | 22% | 218.4 | 91% | 0.52 (XLP) | 0.52 correlated to XLP |
| KHC | 83 | $359M | 23% | 219.6 | 96% | 0.59 (XLP) | 0.59 correlated to XLP |
| YUM | 83 | $351M | 21% | 218.4 | 89% | 0.50 (XLP) | 0.50 correlated to XLP |
| DE | 83 | $702M | 30% | 219.3 | 90% | 0.59 (XLI) | 0.59 correlated to XLI |
| MMM | 83 | $488M | 28% | 217.5 | 92% | 0.59 (DIA) | 0.59 correlated to DIA |
| NEM | 83 | $768M | 39% | 220.7 | 90% | 0.69 (GLD) | 0.69 correlated to GLD |
| SHW | 83 | $574M | 27% | 218.1 | 89% | 0.58 (DIA) | 0.58 correlated to DIA |
| PSA | 83 | $262M | 24% | 219.4 | 89% | 0.52 (XLP) | 0.52 correlated to XLP |
| ARKK | 83 | $359M | 47% | 220.3 | 93% | 0.80 (IWM) | 0.80 correlated to IWM |
| META | 82 | $10.5B | 46% | 219.5 | 88% | 0.80 (XLC) | watched |
| TXN | 82 | $1.5B | 34% | 219.1 | 88% | 0.70 (SMH) | 0.70 correlated to SMH |
| NXPI | 82 | $761M | 42% | 220.4 | 89% | 0.77 (SMH) | 0.77 correlated to SMH |
| CDNS | 82 | $708M | 37% | 219.3 | 89% | 0.72 (XLK) | 0.72 correlated to XLK |
| MDB | 82 | $611M | 71% | 219.5 | 90% | 0.54 (QQQ) | 0.54 correlated to QQQ |
| PLTR | 82 | $4.5B | 66% | 219.9 | 92% | 0.58 (QQQ) | 0.58 correlated to QQQ |
| HOOD | 82 | $2.0B | 68% | 217.9 | 93% | 0.59 (IWM) | 0.59 correlated to IWM |
| SCHW | 82 | $772M | 32% | 218.0 | 89% | 0.65 (XLF) | 0.65 correlated to XLF |
| SPGI | 82 | $708M | 25% | 218.7 | 88% | 0.60 (XLF) | 0.60 correlated to XLF |
| CB | 82 | $568M | 20% | 217.9 | 89% | 0.55 (XLF) | 0.55 correlated to XLF |
| TRV | 82 | $578M | 22% | 219.0 | 88% | 0.55 (XLF) | 0.55 correlated to XLF |
| ABBV | 82 | $1.2B | 24% | 217.9 | 88% | 0.59 (XLV) | 0.59 correlated to XLV |
| MRK | 82 | $1.2B | 25% | 218.0 | 88% | 0.58 (XLV) | 0.58 correlated to XLV |
| DHR | 82 | $770M | 29% | 219.9 | 89% | 0.65 (XLV) | 0.65 correlated to XLV |
| AMGN | 82 | $1.0B | 25% | 218.7 | 89% | 0.60 (XLV) | 0.60 correlated to XLV |
| SYK | 82 | $740M | 26% | 219.3 | 90% | 0.62 (XLV) | 0.62 correlated to XLV |
| MDT | 82 | $699M | 23% | 218.3 | 88% | 0.57 (XLV) | 0.57 correlated to XLV |
| WMT | 82 | $2.4B | 23% | 219.7 | 91% | 0.59 (XLP) | 0.59 correlated to XLP |
| LOW | 82 | $632M | 26% | 217.6 | 88% | 0.61 (DIA) | 0.61 correlated to DIA |
| TJX | 82 | $957M | 22% | 220.3 | 88% | 0.53 (DIA) | 0.53 correlated to DIA |
| PM | 82 | $822M | 23% | 219.3 | 88% | 0.54 (XLP) | 0.54 correlated to XLP |
| RTX | 82 | $807M | 24% | 217.8 | 87% | 0.54 (XLI) | 0.54 correlated to XLI |
| SLB | 82 | $587M | 38% | 220.7 | 92% | 0.78 (XLE) | 0.78 correlated to XLE |
| PLD | 82 | $468M | 27% | 217.9 | 88% | 0.60 (IWM) | 0.60 correlated to IWM |
| XLU | 82 | $868M | 17% | 219.5 | 98% | 0.57 (XLP) | **watched, failing** |
| JETS | 82 | $89M | 32% | 220.4 | 95% | 0.74 (IWM) | 0.74 correlated to IWM |
| EWY | 82 | $2.6B | 34% | 223.0 | 88% | 0.66 (SMH) | 0.66 correlated to SMH |
| SLV | 82 | $834M | 38% | 222.5 | 94% | 0.79 (GLD) | 0.79 correlated to GLD |
| GDXJ | 82 | $501M | 43% | 221.9 | 90% | 0.81 (GLD) | 0.81 correlated to GLD |
| LTC-USD | 82 | $0M | 58% | 197.3 | 96% | 0.74 (ADA-USD) | watched |
| HYPE-USD | 82 | $0M | 70% | 165.5 | 93% | 0.57 (SOL-USD) | **watched, failing** |
| KLAC | 81 | $1.8B | 47% | 219.4 | 93% | 0.87 (SMH) | 0.87 correlated to SMH |
| SHOP | 81 | $1.0B | 66% | 219.4 | 91% | 0.63 (XLY) | 0.63 correlated to XLY |
| NET | 81 | $935M | 69% | 220.5 | 90% | 0.59 (QQQ) | 0.59 correlated to QQQ |
| TFC | 81 | $332M | 32% | 217.2 | 94% | 0.76 (XLF) | 0.76 correlated to XLF |
| TMO | 81 | $1.1B | 28% | 218.6 | 89% | 0.65 (XLV) | 0.65 correlated to XLV |
| ABT | 81 | $860M | 23% | 218.1 | 89% | 0.61 (XLV) | 0.61 correlated to XLV |
| COST | 81 | $1.9B | 23% | 217.4 | 88% | 0.62 (XLP) | 0.62 correlated to XLP |
| HD | 81 | $1.3B | 25% | 218.4 | 88% | 0.64 (DIA) | 0.64 correlated to DIA |
| GIS | 81 | $345M | 23% | 218.7 | 90% | 0.61 (XLP) | 0.61 correlated to XLP |
| GD | 81 | $385M | 21% | 215.9 | 89% | 0.58 (XLI) | 0.58 correlated to XLI |
| GE | 81 | $1.3B | 31% | 218.7 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| UNP | 81 | $710M | 23% | 218.3 | 89% | 0.63 (XLI) | 0.63 correlated to XLI |
| CSX | 81 | $507M | 23% | 217.6 | 93% | 0.65 (XLI) | 0.65 correlated to XLI |
| NSC | 81 | $348M | 25% | 217.9 | 88% | 0.65 (XLI) | 0.65 correlated to XLI |
| VLO | 81 | $986M | 37% | 218.3 | 87% | 0.76 (XLE) | 0.76 correlated to XLE |
| OXY | 81 | $474M | 38% | 219.7 | 91% | 0.82 (XLE) | 0.82 correlated to XLE |
| HAL | 81 | $342M | 40% | 219.4 | 94% | 0.84 (XLE) | 0.84 correlated to XLE |
| LIN | 81 | $924M | 21% | 219.4 | 88% | 0.58 (DIA) | 0.58 correlated to DIA |
| SPG | 81 | $266M | 26% | 219.1 | 88% | 0.65 (IWM) | 0.65 correlated to IWM |
| O | 81 | $348M | 19% | 218.8 | 89% | 0.57 (XLU) | 0.57 correlated to XLU |
| XBI | 81 | $1.3B | 32% | 218.7 | 89% | 0.73 (IWM) | 0.73 correlated to IWM |
| XME | 81 | $189M | 33% | 220.9 | 88% | 0.72 (IWM) | 0.72 correlated to IWM |
| ITB | 81 | $166M | 30% | 219.5 | 89% | 0.71 (IWM) | 0.71 correlated to IWM |
| GDX | 81 | $1.7B | 38% | 222.2 | 91% | 0.82 (GLD) | 0.82 correlated to GLD |
| BTC-USD | 81 | $0M | 39% | 197.5 | 91% | 0.82 (ETH-USD) | watched |
| BCH-USD | 81 | $0M | 67% | 197.4 | 93% | 0.63 (BTC-USD) | 0.63 correlated to BTC-USD |
| AAPL | 80 | $12.9B | 28% | 221.9 | 87% | 0.71 (SPY) | watched |
| MSFT | 80 | $11.3B | 28% | 219.6 | 87% | 0.72 (QQQ) | watched |
| NVDA | 80 | $25.1B | 52% | 219.8 | 92% | 0.84 (SMH) | watched |
| AMZN | 80 | $8.6B | 36% | 221.2 | 88% | 0.79 (XLY) | watched |
| GOOGL | 80 | $8.5B | 32% | 219.9 | 88% | 0.76 (XLC) | watched |
| TSLA | 80 | $12.0B | 60% | 220.3 | 89% | 0.76 (XLY) | watched |
| MU | 80 | $29.4B | 57% | 221.0 | 88% | 0.77 (SMH) | 0.77 correlated to SMH |
| AMAT | 80 | $3.2B | 47% | 219.9 | 87% | 0.87 (SMH) | 0.87 correlated to SMH |
| LRCX | 80 | $2.7B | 50% | 219.2 | 91% | 0.88 (SMH) | 0.88 correlated to SMH |
| ADI | 80 | $1.2B | 34% | 218.6 | 89% | 0.78 (SMH) | 0.78 correlated to SMH |
| PARA | 80 | $0M | 122% | 212.0 | 84% | 0.15 (HYPE-USD) | 0.15 correlated to HYPE-USD |
| V | 80 | $2.3B | 23% | 217.9 | 89% | 0.68 (XLF) | 0.68 correlated to XLF |
| MA | 80 | $1.6B | 24% | 218.7 | 88% | 0.69 (XLF) | 0.69 correlated to XLF |
| COF | 80 | $727M | 35% | 218.7 | 88% | 0.78 (XLF) | 0.78 correlated to XLF |
| USB | 80 | $424M | 30% | 218.4 | 92% | 0.76 (XLF) | 0.76 correlated to XLF |
| AIG | 80 | $268M | 26% | 218.5 | 90% | 0.70 (XLF) | 0.70 correlated to XLF |
| KMB | 80 | $355M | 21% | 217.9 | 88% | 0.63 (XLP) | 0.63 correlated to XLP |
| CAT | 80 | $2.0B | 32% | 218.2 | 88% | 0.74 (XLI) | 0.74 correlated to XLI |
| ETN | 80 | $774M | 32% | 219.7 | 87% | 0.73 (XLI) | 0.73 correlated to XLI |
| MPC | 80 | $792M | 33% | 219.6 | 86% | 0.77 (XLE) | 0.77 correlated to XLE |
| DVN | 80 | $468M | 40% | 221.0 | 92% | 0.87 (XLE) | 0.87 correlated to XLE |
| XLRE | 80 | $220M | 19% | 218.1 | 96% | 0.66 (XLU) | 0.66 correlated to XLU |
| DBC | 80 | $24M | 20% | 221.7 | 94% | 0.65 (XLE) | 0.65 correlated to XLE |
| ETH-USD | 80 | $0M | 55% | 199.1 | 92% | 0.82 (BTC-USD) | watched |
| JUP-USD | 80 | $0M | 945% | 201.3 | 74% | 0.07 (XLK) | **watched, failing** |
| AMD | 79 | $11.6B | 57% | 220.3 | 88% | 0.80 (SMH) | watched |
| MRVL | 79 | $4.6B | 64% | 219.3 | 91% | 0.78 (SMH) | 0.78 correlated to SMH |
| SMCI | 79 | $1.3B | 89% | 219.1 | 95% | 0.51 (SMH) | 0.51 correlated to SMH |
| WFC | 79 | $1.2B | 30% | 219.1 | 89% | 0.80 (XLF) | 0.80 correlated to XLF |
| GS | 79 | $1.9B | 29% | 219.6 | 87% | 0.77 (XLF) | 0.77 correlated to XLF |
| MS | 79 | $958M | 29% | 219.1 | 88% | 0.79 (XLF) | 0.79 correlated to XLF |
| C | 79 | $1.3B | 29% | 218.4 | 89% | 0.78 (XLF) | 0.78 correlated to XLF |
| BLK | 79 | $650M | 27% | 221.5 | 88% | 0.76 (XLF) | 0.76 correlated to XLF |
| AXP | 79 | $862M | 29% | 221.6 | 88% | 0.79 (XLF) | 0.79 correlated to XLF |
| HON | 79 | $588M | 23% | 218.4 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| EMR | 79 | $348M | 28% | 219.1 | 88% | 0.77 (XLI) | 0.77 correlated to XLI |
| PSX | 79 | $632M | 33% | 220.7 | 87% | 0.80 (XLE) | 0.80 correlated to XLE |
| NEE | 79 | $917M | 27% | 217.9 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| SRE | 79 | $282M | 23% | 218.4 | 91% | 0.72 (XLU) | 0.72 correlated to XLU |
| XLP | 79 | $856M | 14% | 220.9 | 88% | 0.62 (XLV) | **watched, failing** |
| XHB | 79 | $186M | 28% | 220.3 | 89% | 0.78 (IWM) | 0.78 correlated to IWM |
| KRE | 79 | $961M | 29% | 218.9 | 91% | 0.79 (XLF) | 0.79 correlated to XLF |
| EEM | 79 | $1.3B | 20% | 223.0 | 92% | 0.71 (SMH) | 0.71 correlated to SMH |
| SOL-USD | 79 | $0M | 63% | 193.1 | 92% | 0.81 (ETH-USD) | watched |
| XRP-USD | 79 | $0M | 65% | 196.8 | 97% | 0.82 (ADA-USD) | watched |
| ADA-USD | 79 | $0M | 59% | 167.4 | 92% | 0.82 (XRP-USD) | **watched, failing** |
| DOT-USD | 79 | $0M | 68% | 198.4 | 98% | 0.75 (AVAX-USD) | watched |
| EGLD-USD | 79 | $28M | 73% | 203.7 | 97% | 0.72 (DOT-USD) | 0.72 correlated to DOT-USD |
| ARM | 78 | $1.2B | 75% | 211.5 | 90% | 0.67 (SMH) | 0.67 correlated to SMH |
| COIN | 78 | $1.3B | 86% | 220.1 | 90% | 0.57 (XLY) | 0.57 correlated to XLY |
| BAC | 78 | $1.9B | 27% | 220.1 | 92% | 0.84 (XLF) | 0.84 correlated to XLF |
| PNC | 78 | $394M | 27% | 217.9 | 88% | 0.80 (XLF) | 0.80 correlated to XLF |
| MET | 78 | $291M | 25% | 219.0 | 89% | 0.80 (XLF) | 0.80 correlated to XLF |
| MDLZ | 78 | $471M | 20% | 218.1 | 88% | 0.74 (XLP) | 0.74 correlated to XLP |
| CL | 78 | $403M | 19% | 218.3 | 88% | 0.73 (XLP) | 0.73 correlated to XLP |
| PH | 78 | $562M | 29% | 218.4 | 87% | 0.82 (XLI) | 0.82 correlated to XLI |
| ITW | 78 | $315M | 21% | 219.9 | 89% | 0.76 (XLI) | 0.76 correlated to XLI |
| EOG | 78 | $408M | 33% | 219.7 | 89% | 0.89 (XLE) | 0.89 correlated to XLE |
| D | 78 | $249M | 23% | 217.7 | 90% | 0.76 (XLU) | 0.76 correlated to XLU |
| EXC | 78 | $306M | 21% | 218.5 | 94% | 0.76 (XLU) | 0.76 correlated to XLU |
| SMH | 78 | $3.8B | 37% | 221.0 | 87% | 0.92 (XLK) | watched |
| IBB | 78 | $301M | 22% | 219.2 | 89% | 0.74 (XLV) | 0.74 correlated to XLV |
| XRT | 78 | $310M | 27% | 221.2 | 89% | 0.83 (IWM) | 0.83 correlated to IWM |
| EWJ | 78 | $341M | 19% | 222.2 | 89% | 0.70 (SPY) | 0.70 correlated to SPY |
| VIXY | 78 | $40M | 67% | 219.0 | 88% | 0.77 (SPY) | 0.77 correlated to SPY |
| AVAX-USD | 78 | $0M | 75% | 197.4 | 98% | 0.75 (LINK-USD) | watched |
| LINK-USD | 78 | $0M | 70% | 199.0 | 98% | 0.77 (ADA-USD) | watched |
| ATOM-USD | 78 | $55M | 72% | 204.2 | 98% | 0.79 (DOT-USD) | 0.79 correlated to DOT-USD |
| XLM-USD | 78 | $30M | 69% | 205.5 | 92% | 0.75 (XRP-USD) | 0.75 correlated to XRP-USD |
| ETC-USD | 78 | $317M | 68% | 204.7 | 98% | 0.82 (ETH-USD) | 0.82 correlated to ETH-USD |
| ICP-USD | 78 | $151M | 82% | 205.0 | 98% | 0.64 (DOT-USD) | 0.64 correlated to DOT-USD |
| HBAR-USD | 78 | $5M | 79% | 204.1 | 91% | 0.65 (LINK-USD) | 0.65 correlated to LINK-USD |
| PRU | 77 | $182M | 26% | 219.0 | 89% | 0.82 (XLF) | 0.82 correlated to XLF |
| PG | 77 | $1.1B | 18% | 218.8 | 89% | 0.78 (XLP) | 0.78 correlated to XLP |
| PEP | 77 | $1.0B | 19% | 218.8 | 88% | 0.75 (XLP) | 0.75 correlated to XLP |
| COP | 77 | $780M | 33% | 221.0 | 88% | 0.91 (XLE) | 0.91 correlated to XLE |
| XEL | 77 | $395M | 21% | 217.7 | 89% | 0.78 (XLU) | 0.78 correlated to XLU |
| ED | 77 | $222M | 19% | 219.4 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| XLV | 77 | $1.3B | 15% | 219.8 | 89% | 0.70 (DIA) | **watched, failing** |
| XLY | 77 | $699M | 24% | 221.5 | 93% | 0.87 (SPY) | watched |
| XLC | 77 | $568M | 21% | 219.6 | 90% | 0.82 (SPY) | watched |
| XLB | 77 | $548M | 19% | 220.7 | 96% | 0.82 (XLI) | 0.82 correlated to XLI |
| SOXX | 77 | $4.0B | 39% | 221.1 | 88% | 0.99 (SMH) | 0.99 correlated to SMH |
| XOP | 77 | $553M | 33% | 221.6 | 89% | 0.93 (XLE) | 0.93 correlated to XLE |
| VGK | 77 | $161M | 18% | 223.7 | 87% | 0.75 (SPY) | 0.75 correlated to SPY |
| UNI-USD | 77 | $0M | 84% | 197.9 | 98% | 0.68 (ETH-USD) | 0.68 correlated to ETH-USD |
| AAVE-USD | 77 | $0M | 77% | 198.3 | 93% | 0.74 (ETH-USD) | 0.74 correlated to ETH-USD |
| ALGO-USD | 77 | $3M | 75% | 205.1 | 91% | 0.74 (DOT-USD) | 0.74 correlated to DOT-USD |
| VET-USD | 77 | $0M | 72% | 204.6 | 88% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| AXS-USD | 77 | $16M | 84% | 204.5 | 98% | 0.69 (DOT-USD) | 0.69 correlated to DOT-USD |
| JPM | 76 | $2.3B | 24% | 219.5 | 86% | 0.84 (XLF) | 0.84 correlated to XLF |
| XOM | 76 | $2.1B | 27% | 221.1 | 89% | 0.92 (XLE) | 0.92 correlated to XLE |
| CVX | 76 | $1.5B | 25% | 221.1 | 89% | 0.90 (XLE) | 0.90 correlated to XLE |
| SO | 76 | $463M | 19% | 219.1 | 88% | 0.81 (XLU) | 0.81 correlated to XLU |
| AEP | 76 | $460M | 20% | 218.6 | 88% | 0.82 (XLU) | 0.82 correlated to XLU |
| IWM | 76 | $6.0B | 22% | 221.2 | 88% | 0.85 (SPY) | watched |
| DOGE-USD | 76 | $0M | 74% | 198.5 | 93% | 0.82 (ADA-USD) | watched |
| RUNE-USD | 76 | $3M | 94% | 205.4 | 96% | 0.62 (ETH-USD) | 0.62 correlated to ETH-USD |
| GRT-USD | 76 | $0M | 79% | 198.8 | 90% | 0.75 (DOT-USD) | 0.75 correlated to DOT-USD |
| THETA-USD | 76 | $1M | 81% | 204.1 | 95% | 0.75 (DOT-USD) | 0.75 correlated to DOT-USD |
| CRV-USD | 76 | $0M | 85% | 197.1 | 92% | 0.69 (LINK-USD) | 0.69 correlated to LINK-USD |
| GOOG | 75 | $5.6B | 32% | 219.4 | 89% | 1.00 (GOOGL) | 1.00 correlated to GOOGL |
| XLK | 75 | $1.3B | 26% | 221.1 | 90% | 0.97 (QQQ) | watched |
| XLF | 75 | $1.8B | 18% | 220.7 | 90% | 0.87 (DIA) | watched |
| MTUM | 75 | $344M | 22% | 220.7 | 85% | 0.86 (XLK) | 0.86 correlated to XLK |
| VLUE | 75 | $103M | 18% | 219.4 | 87% | 0.85 (IWM) | 0.85 correlated to IWM |
| NEAR-USD | 75 | $921M | 90% | 205.0 | 98% | 0.74 (DOT-USD) | 0.74 correlated to DOT-USD |
| DYDX-USD | 75 | $1M | 93% | 203.9 | 95% | 0.68 (DOT-USD) | 0.68 correlated to DOT-USD |
| XLI | 74 | $1.2B | 18% | 219.5 | 86% | 0.88 (DIA) | **watched, failing** |
| INJ-USD | 74 | $475M | 93% | 205.2 | 98% | 0.74 (AVAX-USD) | 0.74 correlated to AVAX-USD |
| SEI-USD | 74 | $2M | 90% | 200.8 | 89% | 0.69 (ADA-USD) | 0.69 correlated to ADA-USD |
| SAND-USD | 74 | $1M | 89% | 204.2 | 92% | 0.73 (DOT-USD) | 0.73 correlated to DOT-USD |
| SNX-USD | 74 | $2M | 93% | 204.3 | 95% | 0.69 (ETH-USD) | 0.69 correlated to ETH-USD |
| QQQ | 73 | $23.8B | 23% | 220.9 | 85% | 0.97 (XLK) | watched |
| DIA | 73 | $1.7B | 15% | 219.5 | 86% | 0.91 (SPY) | **watched, failing** |
| MDY | 73 | $387M | 20% | 221.9 | 88% | 0.96 (IWM) | 0.96 correlated to IWM |
| IWF | 73 | $439M | 22% | 222.3 | 89% | 0.98 (QQQ) | 0.98 correlated to QQQ |
| MANA-USD | 73 | $1M | 88% | 204.7 | 91% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| ENS-USD | 73 | $116M | 93% | 204.2 | 98% | 0.77 (ADA-USD) | 0.77 correlated to ADA-USD |
| SPY | 72 | $33.1B | 17% | 221.9 | 84% | 0.95 (QQQ) | **watched, failing** |
| KAS-USD | 71 | $0M | 111% | 203.8 | 89% | 0.62 (SOL-USD) | 0.62 correlated to SOL-USD |
| UVXY | 70 | $139M | 99% | 220.5 | 85% | 0.77 (SPY) | 0.77 correlated to SPY |
| SHIB-USD | 63 | $0M | 72% | 195.0 | 7% | 0.81 (DOGE-USD) | 0.81 correlated to DOGE-USD |
| PEPE-USD | 59 | $0M | 87% | 186.0 | 3% | 0.86 (DOGE-USD) | 0.86 correlated to DOGE-USD |

---

_The candidate pool is a committed snapshot in `server/candidates/`, edit it freely. Being a snapshot of today's liquid names, it is itself survivorship-biased — it contains what survived to be listed — so treat it as a starting universe rather than an unbiased one. Nothing here places a trade or edits a watchlist; adding a symbol is still your call._
