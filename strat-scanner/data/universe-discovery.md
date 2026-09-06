# Universe Discovery — is this the right watchlist?

_Generated 2026-09-06_ · 284 of 318 candidates screened · 39 currently watched

Screened the committed candidate pools in `server/candidates/` plus every currently watched symbol, over 3 years of daily bars. Cheap gates — liquidity, volatility, history — are applied first; the Strat engine is replayed only over what survives, since structure quality is expensive to compute and irrelevant for a symbol already rejected on liquidity.

5 candidate(s) unavailable: SQ: SQ: HTTP 404 from data provider; BK: BK: HTTP 404 from data provider; MMC: MMC: HTTP 404 from data provider; TAO-USD: 1 bars; PUMP-USD: PUMP-USD: HTTP 404 from data provider.

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
| XLP | 78 | 14% volatility — too quiet to pay for risk |
| ADA-USD | 79 | only 206 daily bars |
| JUP-USD | 80 | 861% volatility — a lottery ticket |
| HYPE-USD | 81 | only 202 daily bars |
| XLU | 82 | 17% volatility — too quiet to pay for risk |
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
| TRX-USD | 91 | $145M | 50% | 204.8 | 90% | 0.33 (ADA-USD) | 0.33 correlated to ADA-USD |
| MKR-USD | 91 | $0M | 71% | 191.1 | 91% | 0.09 (ADA-USD) | 0.09 correlated to ADA-USD |
| DLTR | 90 | $303M | 41% | 219.5 | 87% | 0.35 (XLP) | 0.35 correlated to XLP |
| UNG | 90 | $79M | 64% | 223.6 | 91% | 0.21 (XLE) | 0.21 correlated to XLE |
| MATIC-USD | 90 | $2M | 80% | 202.5 | 94% | 0.06 (SOL-USD) | 0.06 correlated to SOL-USD |
| EURUSD=X | 90 | $0M | 8% | 216.7 | 98% | 0.07 (XLP) | **watched, failing** |
| DG | 89 | $279M | 38% | 217.9 | 90% | 0.38 (XLP) | 0.38 correlated to XLP |
| 1INCH-USD | 89 | $1M | 74% | 204.7 | 91% | 0.16 (ADA-USD) | 0.16 correlated to ADA-USD |
| PANW | 88 | $2.1B | 43% | 218.4 | 90% | 0.52 (QQQ) | 0.52 correlated to QQQ |
| UBER | 88 | $1.2B | 45% | 218.5 | 93% | 0.53 (XLY) | 0.53 correlated to XLY |
| WBD | 88 | $542M | 52% | 217.1 | 94% | 0.50 (XLC) | 0.50 correlated to XLC |
| EL | 88 | $254M | 45% | 218.2 | 89% | 0.50 (SPY) | 0.50 correlated to SPY |
| NOC | 88 | $415M | 26% | 218.2 | 89% | 0.30 (XLI) | 0.30 correlated to XLI |
| FXI | 88 | $710M | 31% | 224.6 | 94% | 0.41 (IWM) | 0.41 correlated to IWM |
| IBM | 87 | $1.8B | 31% | 218.6 | 87% | 0.42 (DIA) | 0.42 correlated to DIA |
| PYPL | 87 | $651M | 44% | 219.0 | 90% | 0.55 (XLC) | 0.55 correlated to XLC |
| WDAY | 87 | $618M | 41% | 219.8 | 89% | 0.52 (MSFT) | 0.52 correlated to MSFT |
| HPQ | 87 | $370M | 37% | 219.5 | 95% | 0.52 (SPY) | 0.52 correlated to SPY |
| NFLX | 87 | $2.7B | 45% | 219.0 | 92% | 0.58 (XLC) | 0.58 correlated to XLC |
| CVS | 87 | $737M | 31% | 217.1 | 89% | 0.39 (XLV) | 0.39 correlated to XLV |
| TGT | 87 | $608M | 37% | 218.2 | 89% | 0.48 (XLY) | 0.48 correlated to XLY |
| LULU | 87 | $338M | 44% | 219.0 | 89% | 0.55 (XLY) | 0.55 correlated to XLY |
| DPZ | 87 | $265M | 30% | 216.0 | 90% | 0.38 (XLY) | 0.38 correlated to XLY |
| LMT | 87 | $591M | 24% | 218.5 | 88% | 0.32 (XLI) | 0.32 correlated to XLI |
| FCX | 87 | $914M | 45% | 219.3 | 93% | 0.58 (IWM) | 0.58 correlated to IWM |
| T | 87 | $1.1B | 25% | 218.9 | 94% | 0.39 (XLP) | 0.39 correlated to XLP |
| ADBE | 86 | $1.3B | 38% | 219.6 | 88% | 0.55 (XLC) | 0.55 correlated to XLC |
| CRM | 86 | $2.3B | 39% | 219.4 | 89% | 0.54 (SPY) | 0.54 correlated to SPY |
| ORCL | 86 | $4.2B | 43% | 219.2 | 87% | 0.56 (XLK) | 0.56 correlated to XLK |
| SNPS | 86 | $702M | 43% | 218.2 | 89% | 0.62 (QQQ) | 0.62 correlated to QQQ |
| NOW | 86 | $2.3B | 45% | 218.9 | 90% | 0.61 (MSFT) | 0.61 correlated to MSFT |
| INTU | 86 | $1.3B | 39% | 218.2 | 89% | 0.56 (SPY) | 0.56 correlated to SPY |
| DELL | 86 | $2.7B | 52% | 218.8 | 90% | 0.55 (XLK) | 0.55 correlated to XLK |
| SPOT | 86 | $835M | 48% | 218.6 | 89% | 0.58 (XLC) | 0.58 correlated to XLC |
| UNH | 86 | $2.0B | 33% | 218.1 | 89% | 0.47 (XLV) | 0.47 correlated to XLV |
| CI | 86 | $402M | 29% | 217.4 | 89% | 0.44 (XLV) | 0.44 correlated to XLV |
| HCA | 86 | $548M | 30% | 217.8 | 88% | 0.46 (XLV) | 0.46 correlated to XLV |
| CMG | 86 | $564M | 35% | 220.0 | 94% | 0.52 (XLY) | 0.52 correlated to XLY |
| DOW | 86 | $283M | 34% | 219.6 | 95% | 0.52 (XLE) | 0.52 correlated to XLE |
| VZ | 86 | $1.1B | 23% | 219.6 | 94% | 0.41 (XLP) | 0.41 correlated to XLP |
| XLE | 86 | $1.7B | 26% | 222.1 | 96% | 0.45 (XLF) | watched |
| EWZ | 86 | $689M | 28% | 220.6 | 94% | 0.45 (IWM) | 0.45 correlated to IWM |
| TLT | 86 | $2.1B | 16% | 222.8 | 88% | 0.25 (XLU) | **watched, failing** |
| INTC | 85 | $11.4B | 54% | 218.2 | 93% | 0.61 (SMH) | 0.61 correlated to SMH |
| CRWD | 85 | $1.7B | 52% | 218.6 | 92% | 0.59 (QQQ) | 0.59 correlated to QQQ |
| ABNB | 85 | $606M | 44% | 217.7 | 90% | 0.64 (XLY) | 0.64 correlated to XLY |
| OKTA | 85 | $394M | 60% | 219.6 | 91% | 0.49 (QQQ) | 0.49 correlated to QQQ |
| PGR | 85 | $545M | 26% | 217.4 | 87% | 0.41 (XLF) | 0.41 correlated to XLF |
| REGN | 85 | $560M | 31% | 217.4 | 88% | 0.51 (XLV) | 0.51 correlated to XLV |
| ELV | 85 | $452M | 30% | 219.4 | 89% | 0.52 (XLV) | 0.52 correlated to XLV |
| BSX | 85 | $870M | 27% | 217.0 | 88% | 0.46 (XLV) | 0.46 correlated to XLV |
| BIIB | 85 | $192M | 33% | 218.6 | 89% | 0.52 (XLV) | 0.52 correlated to XLV |
| SBUX | 85 | $675M | 32% | 218.4 | 88% | 0.52 (SPY) | 0.52 correlated to SPY |
| NKE | 85 | $920M | 36% | 217.8 | 89% | 0.56 (XLY) | 0.56 correlated to XLY |
| KR | 85 | $388M | 27% | 218.1 | 92% | 0.46 (XLP) | 0.46 correlated to XLP |
| BA | 85 | $1.1B | 37% | 219.2 | 89% | 0.58 (XLI) | 0.58 correlated to XLI |
| FDX | 85 | $504M | 33% | 218.7 | 90% | 0.55 (XLI) | 0.55 correlated to XLI |
| NUE | 85 | $337M | 38% | 220.1 | 88% | 0.57 (XLI) | 0.57 correlated to XLI |
| TMUS | 85 | $855M | 25% | 217.4 | 89% | 0.43 (XLP) | 0.43 correlated to XLP |
| CMCSA | 85 | $660M | 28% | 217.3 | 97% | 0.52 (XLC) | 0.52 correlated to XLC |
| TAN | 85 | $44M | 40% | 220.8 | 91% | 0.61 (IWM) | 0.61 correlated to IWM |
| DDOG | 84 | $1.0B | 59% | 218.1 | 89% | 0.56 (QQQ) | 0.56 correlated to QQQ |
| SNOW | 84 | $1.3B | 61% | 219.5 | 89% | 0.54 (QQQ) | 0.54 correlated to QQQ |
| ZS | 84 | $395M | 58% | 219.0 | 87% | 0.55 (QQQ) | 0.55 correlated to QQQ |
| TEAM | 84 | $467M | 63% | 218.2 | 89% | 0.51 (XLY) | 0.51 correlated to XLY |
| RBLX | 84 | $433M | 71% | 218.3 | 92% | 0.46 (XLC) | 0.46 correlated to XLC |
| ALL | 84 | $377M | 26% | 219.8 | 89% | 0.52 (XLF) | 0.52 correlated to XLF |
| AON | 84 | $445M | 24% | 218.2 | 89% | 0.50 (XLF) | 0.50 correlated to XLF |
| PFE | 84 | $1.0B | 25% | 216.4 | 94% | 0.54 (XLV) | 0.54 correlated to XLV |
| VRTX | 84 | $635M | 29% | 218.2 | 89% | 0.51 (XLV) | 0.51 correlated to XLV |
| ZTS | 84 | $410M | 30% | 219.3 | 89% | 0.53 (XLV) | 0.53 correlated to XLV |
| ROST | 84 | $561M | 30% | 220.1 | 88% | 0.53 (XLY) | 0.53 correlated to XLY |
| STZ | 84 | $269M | 25% | 218.3 | 89% | 0.51 (XLP) | 0.51 correlated to XLP |
| UPS | 84 | $474M | 29% | 219.6 | 89% | 0.55 (XLI) | 0.55 correlated to XLI |
| APD | 84 | $320M | 27% | 218.9 | 89% | 0.48 (XLI) | 0.48 correlated to XLI |
| AMT | 84 | $457M | 27% | 219.5 | 89% | 0.51 (XLU) | 0.51 correlated to XLU |
| CCI | 84 | $291M | 27% | 220.1 | 88% | 0.53 (XLU) | 0.53 correlated to XLU |
| EQIX | 84 | $585M | 28% | 216.7 | 89% | 0.52 (SPY) | 0.52 correlated to SPY |
| GLD | 84 | $3.0B | 19% | 220.6 | 88% | 0.43 (GC=F) | watched |
| USO | 84 | $634M | 37% | 220.4 | 91% | 0.64 (XLE) | 0.64 correlated to XLE |
| FTM-USD | 84 | $442M | 103% | 200.1 | 92% | 0.06 (AAPL) | 0.06 correlated to AAPL |
| GC=F | 84 | $3M | 19% | 215.8 | 87% | 0.43 (GLD) | watched |
| AVGO | 83 | $8.2B | 44% | 219.6 | 90% | 0.77 (SMH) | 0.77 correlated to SMH |
| CSCO | 83 | $2.2B | 26% | 218.5 | 90% | 0.56 (SPY) | 0.56 correlated to SPY |
| QCOM | 83 | $2.1B | 42% | 218.2 | 89% | 0.74 (SMH) | 0.74 correlated to SMH |
| DIS | 83 | $992M | 30% | 217.5 | 90% | 0.61 (XLC) | 0.61 correlated to XLC |
| LLY | 83 | $3.1B | 33% | 217.6 | 88% | 0.60 (XLV) | 0.60 correlated to XLV |
| BMY | 83 | $622M | 25% | 218.1 | 90% | 0.53 (XLV) | 0.53 correlated to XLV |
| GILD | 83 | $890M | 25% | 217.6 | 89% | 0.51 (XLV) | 0.51 correlated to XLV |
| MRNA | 83 | $422M | 81% | 218.1 | 91% | 0.35 (XLV) | 0.35 correlated to XLV |
| ISRG | 83 | $974M | 35% | 218.6 | 88% | 0.62 (SPY) | 0.62 correlated to SPY |
| MO | 83 | $565M | 22% | 218.1 | 91% | 0.52 (XLP) | 0.52 correlated to XLP |
| KHC | 83 | $357M | 23% | 219.7 | 96% | 0.59 (XLP) | 0.59 correlated to XLP |
| YUM | 83 | $369M | 21% | 218.3 | 89% | 0.50 (XLP) | 0.50 correlated to XLP |
| DE | 83 | $677M | 30% | 219.1 | 90% | 0.59 (XLI) | 0.59 correlated to XLI |
| MMM | 83 | $496M | 28% | 217.3 | 91% | 0.59 (DIA) | 0.59 correlated to DIA |
| NEM | 83 | $817M | 39% | 220.6 | 90% | 0.69 (GLD) | 0.69 correlated to GLD |
| SHW | 83 | $637M | 27% | 217.7 | 88% | 0.58 (DIA) | 0.58 correlated to DIA |
| PSA | 83 | $296M | 24% | 219.1 | 89% | 0.52 (XLP) | 0.52 correlated to XLP |
| ARKK | 83 | $425M | 47% | 220.1 | 93% | 0.80 (IWM) | 0.80 correlated to IWM |
| BNB-USD | 83 | $635.5B | 49% | 204.4 | 92% | 0.74 (ADA-USD) | 0.74 correlated to ADA-USD |
| META | 82 | $9.3B | 45% | 219.4 | 88% | 0.80 (XLC) | watched |
| TXN | 82 | $2.1B | 33% | 219.0 | 88% | 0.70 (SMH) | 0.70 correlated to SMH |
| NXPI | 82 | $1.0B | 42% | 220.4 | 89% | 0.77 (SMH) | 0.77 correlated to SMH |
| CDNS | 82 | $708M | 37% | 219.0 | 89% | 0.72 (XLK) | 0.72 correlated to XLK |
| MDB | 82 | $527M | 70% | 219.5 | 90% | 0.55 (QQQ) | 0.55 correlated to QQQ |
| PLTR | 82 | $5.1B | 66% | 219.4 | 92% | 0.58 (QQQ) | 0.58 correlated to QQQ |
| HOOD | 82 | $2.1B | 68% | 218.1 | 93% | 0.59 (IWM) | 0.59 correlated to IWM |
| SCHW | 82 | $829M | 32% | 218.0 | 89% | 0.65 (XLF) | 0.65 correlated to XLF |
| SPGI | 82 | $804M | 25% | 218.2 | 88% | 0.59 (XLF) | 0.59 correlated to XLF |
| TRV | 82 | $598M | 22% | 218.8 | 88% | 0.55 (XLF) | 0.55 correlated to XLF |
| ABBV | 82 | $1.3B | 24% | 217.8 | 88% | 0.59 (XLV) | 0.59 correlated to XLV |
| MRK | 82 | $1.2B | 25% | 218.0 | 88% | 0.57 (XLV) | 0.57 correlated to XLV |
| DHR | 82 | $727M | 29% | 219.7 | 89% | 0.65 (XLV) | 0.65 correlated to XLV |
| AMGN | 82 | $934M | 24% | 218.0 | 89% | 0.60 (XLV) | 0.60 correlated to XLV |
| SYK | 82 | $740M | 25% | 218.9 | 90% | 0.62 (XLV) | 0.62 correlated to XLV |
| MDT | 82 | $675M | 23% | 218.0 | 88% | 0.57 (XLV) | 0.57 correlated to XLV |
| WMT | 82 | $2.5B | 23% | 219.6 | 91% | 0.59 (XLP) | 0.59 correlated to XLP |
| LOW | 82 | $630M | 26% | 217.5 | 88% | 0.61 (DIA) | 0.61 correlated to DIA |
| TJX | 82 | $866M | 22% | 219.9 | 88% | 0.53 (DIA) | 0.53 correlated to DIA |
| PM | 82 | $881M | 24% | 219.1 | 88% | 0.54 (XLP) | 0.54 correlated to XLP |
| RTX | 82 | $851M | 24% | 217.7 | 88% | 0.55 (XLI) | 0.55 correlated to XLI |
| PLD | 82 | $497M | 27% | 218.0 | 88% | 0.59 (IWM) | 0.59 correlated to IWM |
| XLU | 82 | $856M | 17% | 219.1 | 98% | 0.57 (XLP) | **watched, failing** |
| JETS | 82 | $80M | 32% | 220.2 | 95% | 0.74 (IWM) | 0.74 correlated to IWM |
| EWY | 82 | $3.4B | 34% | 222.9 | 88% | 0.66 (SMH) | 0.66 correlated to SMH |
| SLV | 82 | $859M | 38% | 222.3 | 94% | 0.79 (GLD) | 0.79 correlated to GLD |
| GDXJ | 82 | $535M | 43% | 221.6 | 90% | 0.80 (GLD) | 0.80 correlated to GLD |
| KLAC | 81 | $2.4B | 47% | 219.4 | 93% | 0.88 (SMH) | 0.88 correlated to SMH |
| SHOP | 81 | $951M | 66% | 219.3 | 91% | 0.63 (XLY) | 0.63 correlated to XLY |
| NET | 81 | $843M | 69% | 220.2 | 90% | 0.60 (QQQ) | 0.60 correlated to QQQ |
| PARA | 81 | $0M | 122% | 212.0 | 84% | 0.07 (XLK) | 0.07 correlated to XLK |
| TFC | 81 | $341M | 32% | 217.0 | 93% | 0.77 (XLF) | 0.77 correlated to XLF |
| CB | 81 | $575M | 20% | 217.8 | 89% | 0.56 (XLF) | 0.56 correlated to XLF |
| TMO | 81 | $1.0B | 28% | 218.3 | 89% | 0.65 (XLV) | 0.65 correlated to XLV |
| ABT | 81 | $1.0B | 23% | 217.8 | 89% | 0.61 (XLV) | 0.61 correlated to XLV |
| COST | 81 | $1.9B | 23% | 217.5 | 88% | 0.62 (XLP) | 0.62 correlated to XLP |
| HD | 81 | $1.3B | 25% | 218.2 | 88% | 0.64 (DIA) | 0.64 correlated to DIA |
| GIS | 81 | $328M | 22% | 218.5 | 90% | 0.62 (XLP) | 0.62 correlated to XLP |
| GD | 81 | $411M | 21% | 216.0 | 89% | 0.58 (XLI) | 0.58 correlated to XLI |
| GE | 81 | $1.4B | 31% | 218.6 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| CSX | 81 | $544M | 23% | 217.5 | 93% | 0.66 (XLI) | 0.66 correlated to XLI |
| NSC | 81 | $371M | 25% | 217.8 | 88% | 0.65 (XLI) | 0.65 correlated to XLI |
| SLB | 81 | $589M | 38% | 220.9 | 92% | 0.78 (XLE) | 0.78 correlated to XLE |
| VLO | 81 | $777M | 37% | 218.3 | 87% | 0.76 (XLE) | 0.76 correlated to XLE |
| OXY | 81 | $449M | 38% | 219.6 | 91% | 0.82 (XLE) | 0.82 correlated to XLE |
| HAL | 81 | $394M | 40% | 219.1 | 94% | 0.85 (XLE) | 0.85 correlated to XLE |
| LIN | 81 | $1.1B | 21% | 219.4 | 87% | 0.59 (DIA) | 0.59 correlated to DIA |
| SPG | 81 | $323M | 26% | 219.2 | 88% | 0.65 (IWM) | 0.65 correlated to IWM |
| O | 81 | $332M | 19% | 218.7 | 89% | 0.58 (XLU) | 0.58 correlated to XLU |
| XBI | 81 | $1.3B | 32% | 218.5 | 88% | 0.73 (IWM) | 0.73 correlated to IWM |
| XME | 81 | $206M | 33% | 221.0 | 88% | 0.71 (IWM) | 0.71 correlated to IWM |
| ITB | 81 | $174M | 30% | 219.0 | 89% | 0.71 (IWM) | 0.71 correlated to IWM |
| GDX | 81 | $1.8B | 38% | 222.0 | 91% | 0.82 (GLD) | 0.82 correlated to GLD |
| BTC-USD | 81 | $0M | 39% | 197.8 | 90% | 0.82 (ETH-USD) | watched |
| LTC-USD | 81 | $0M | 57% | 197.1 | 96% | 0.78 (ADA-USD) | watched |
| BCH-USD | 81 | $0M | 66% | 197.3 | 93% | 0.64 (BTC-USD) | 0.64 correlated to BTC-USD |
| HYPE-USD | 81 | $0M | 72% | 159.4 | 93% | 0.57 (ETH-USD) | **watched, failing** |
| AAPL | 80 | $13.8B | 28% | 221.7 | 87% | 0.72 (SPY) | watched |
| MSFT | 80 | $13.1B | 28% | 219.2 | 87% | 0.72 (QQQ) | watched |
| NVDA | 80 | $26.5B | 52% | 219.4 | 92% | 0.84 (SMH) | watched |
| AMZN | 80 | $9.9B | 36% | 221.2 | 88% | 0.79 (XLY) | watched |
| GOOGL | 80 | $9.2B | 32% | 219.7 | 88% | 0.76 (XLC) | watched |
| TSLA | 80 | $12.9B | 60% | 220.2 | 89% | 0.76 (XLY) | watched |
| MU | 80 | $36.1B | 56% | 221.0 | 88% | 0.77 (SMH) | 0.77 correlated to SMH |
| AMAT | 80 | $4.4B | 47% | 219.4 | 87% | 0.87 (SMH) | 0.87 correlated to SMH |
| LRCX | 80 | $3.3B | 49% | 218.8 | 91% | 0.89 (SMH) | 0.89 correlated to SMH |
| ADI | 80 | $1.4B | 34% | 218.2 | 89% | 0.78 (SMH) | 0.78 correlated to SMH |
| V | 80 | $2.5B | 23% | 217.7 | 89% | 0.68 (XLF) | 0.68 correlated to XLF |
| MA | 80 | $1.8B | 24% | 218.4 | 88% | 0.69 (XLF) | 0.69 correlated to XLF |
| COF | 80 | $820M | 35% | 218.4 | 88% | 0.78 (XLF) | 0.78 correlated to XLF |
| USB | 80 | $453M | 30% | 218.5 | 92% | 0.76 (XLF) | 0.76 correlated to XLF |
| AIG | 80 | $254M | 26% | 218.2 | 89% | 0.70 (XLF) | 0.70 correlated to XLF |
| KMB | 80 | $379M | 21% | 217.5 | 88% | 0.63 (XLP) | 0.63 correlated to XLP |
| CAT | 80 | $2.5B | 32% | 218.0 | 88% | 0.74 (XLI) | 0.74 correlated to XLI |
| UNP | 80 | $742M | 23% | 218.2 | 89% | 0.64 (XLI) | 0.64 correlated to XLI |
| ETN | 80 | $793M | 32% | 219.3 | 87% | 0.73 (XLI) | 0.73 correlated to XLI |
| PSX | 80 | $557M | 33% | 220.7 | 88% | 0.80 (XLE) | 0.80 correlated to XLE |
| MPC | 80 | $690M | 33% | 219.3 | 87% | 0.77 (XLE) | 0.77 correlated to XLE |
| DVN | 80 | $483M | 41% | 220.7 | 92% | 0.87 (XLE) | 0.87 correlated to XLE |
| XLRE | 80 | $215M | 19% | 217.9 | 96% | 0.66 (XLU) | 0.66 correlated to XLU |
| DBC | 80 | $23M | 20% | 221.4 | 94% | 0.65 (XLE) | 0.65 correlated to XLE |
| ETH-USD | 80 | $0M | 55% | 198.5 | 91% | 0.82 (BTC-USD) | watched |
| JUP-USD | 80 | $0M | 861% | 201.1 | 75% | 0.07 (ETH-USD) | **watched, failing** |
| AMD | 79 | $13.6B | 57% | 220.2 | 88% | 0.80 (SMH) | watched |
| MRVL | 79 | $5.5B | 64% | 219.3 | 90% | 0.78 (SMH) | 0.78 correlated to SMH |
| SMCI | 79 | $1.4B | 88% | 218.5 | 95% | 0.50 (SMH) | 0.50 correlated to SMH |
| WFC | 79 | $1.1B | 30% | 219.0 | 89% | 0.80 (XLF) | 0.80 correlated to XLF |
| GS | 79 | $1.9B | 29% | 219.4 | 87% | 0.78 (XLF) | 0.78 correlated to XLF |
| MS | 79 | $1.0B | 29% | 219.0 | 88% | 0.79 (XLF) | 0.79 correlated to XLF |
| C | 79 | $1.4B | 29% | 218.3 | 89% | 0.79 (XLF) | 0.79 correlated to XLF |
| BLK | 79 | $742M | 27% | 221.3 | 88% | 0.76 (XLF) | 0.76 correlated to XLF |
| AXP | 79 | $905M | 29% | 221.6 | 88% | 0.79 (XLF) | 0.79 correlated to XLF |
| HON | 79 | $745M | 23% | 218.4 | 89% | 0.69 (XLI) | 0.69 correlated to XLI |
| EMR | 79 | $378M | 28% | 219.1 | 88% | 0.78 (XLI) | 0.78 correlated to XLI |
| NEE | 79 | $923M | 27% | 217.5 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| SRE | 79 | $301M | 24% | 218.2 | 91% | 0.72 (XLU) | 0.72 correlated to XLU |
| XHB | 79 | $230M | 28% | 219.8 | 89% | 0.78 (IWM) | 0.78 correlated to IWM |
| KRE | 79 | $966M | 30% | 218.8 | 91% | 0.79 (XLF) | 0.79 correlated to XLF |
| EEM | 79 | $1.4B | 20% | 222.8 | 92% | 0.71 (SMH) | 0.71 correlated to SMH |
| ADA-USD | 79 | $0M | 59% | 161.2 | 93% | 0.82 (LINK-USD) | **watched, failing** |
| DOT-USD | 79 | $0M | 67% | 198.3 | 98% | 0.77 (AVAX-USD) | watched |
| ARM | 78 | $1.5B | 74% | 210.7 | 90% | 0.66 (SMH) | 0.66 correlated to SMH |
| COIN | 78 | $1.1B | 86% | 220.2 | 90% | 0.57 (XLY) | 0.57 correlated to XLY |
| BAC | 78 | $1.8B | 27% | 219.9 | 92% | 0.85 (XLF) | 0.85 correlated to XLF |
| PNC | 78 | $446M | 27% | 217.7 | 88% | 0.80 (XLF) | 0.80 correlated to XLF |
| MET | 78 | $313M | 26% | 218.9 | 89% | 0.80 (XLF) | 0.80 correlated to XLF |
| MDLZ | 78 | $506M | 20% | 218.2 | 88% | 0.74 (XLP) | 0.74 correlated to XLP |
| CL | 78 | $395M | 19% | 218.2 | 88% | 0.73 (XLP) | 0.73 correlated to XLP |
| PH | 78 | $569M | 29% | 218.0 | 87% | 0.82 (XLI) | 0.82 correlated to XLI |
| ITW | 78 | $322M | 21% | 219.9 | 88% | 0.76 (XLI) | 0.76 correlated to XLI |
| EOG | 78 | $428M | 33% | 219.3 | 89% | 0.89 (XLE) | 0.89 correlated to XLE |
| D | 78 | $280M | 23% | 217.4 | 90% | 0.76 (XLU) | 0.76 correlated to XLU |
| EXC | 78 | $353M | 21% | 218.2 | 94% | 0.76 (XLU) | 0.76 correlated to XLU |
| XLP | 78 | $883M | 14% | 220.6 | 88% | 0.62 (XLV) | **watched, failing** |
| SMH | 78 | $5.4B | 37% | 220.8 | 87% | 0.92 (XLK) | watched |
| IBB | 78 | $300M | 22% | 219.0 | 88% | 0.74 (XLV) | 0.74 correlated to XLV |
| XRT | 78 | $349M | 27% | 221.1 | 89% | 0.83 (IWM) | 0.83 correlated to IWM |
| EWJ | 78 | $406M | 19% | 222.1 | 89% | 0.70 (SPY) | 0.70 correlated to SPY |
| SOL-USD | 78 | $0M | 64% | 192.9 | 92% | 0.80 (ETH-USD) | watched |
| XRP-USD | 78 | $0M | 65% | 196.4 | 97% | 0.82 (ADA-USD) | watched |
| XLM-USD | 78 | $20M | 69% | 205.5 | 92% | 0.75 (XRP-USD) | 0.75 correlated to XRP-USD |
| ETC-USD | 78 | $211M | 69% | 204.4 | 98% | 0.83 (ETH-USD) | 0.83 correlated to ETH-USD |
| ICP-USD | 78 | $75M | 83% | 204.9 | 98% | 0.65 (DOT-USD) | 0.65 correlated to DOT-USD |
| EGLD-USD | 78 | $13M | 75% | 203.5 | 97% | 0.72 (DOT-USD) | 0.72 correlated to DOT-USD |
| PRU | 77 | $199M | 26% | 218.9 | 89% | 0.83 (XLF) | 0.83 correlated to XLF |
| PG | 77 | $1.2B | 18% | 218.4 | 89% | 0.78 (XLP) | 0.78 correlated to XLP |
| PEP | 77 | $1.1B | 19% | 218.5 | 88% | 0.75 (XLP) | 0.75 correlated to XLP |
| COP | 77 | $778M | 33% | 221.0 | 88% | 0.91 (XLE) | 0.91 correlated to XLE |
| XEL | 77 | $399M | 21% | 217.6 | 90% | 0.78 (XLU) | 0.78 correlated to XLU |
| ED | 77 | $237M | 19% | 219.4 | 89% | 0.76 (XLU) | 0.76 correlated to XLU |
| XLV | 77 | $1.5B | 15% | 219.6 | 89% | 0.70 (DIA) | **watched, failing** |
| XLY | 77 | $778M | 24% | 221.2 | 93% | 0.87 (SPY) | watched |
| XLC | 77 | $611M | 21% | 219.4 | 90% | 0.82 (SPY) | watched |
| XLB | 77 | $591M | 19% | 220.2 | 96% | 0.82 (XLI) | 0.82 correlated to XLI |
| SOXX | 77 | $5.1B | 38% | 220.8 | 87% | 0.99 (SMH) | 0.99 correlated to SMH |
| XOP | 77 | $513M | 33% | 221.5 | 89% | 0.93 (XLE) | 0.93 correlated to XLE |
| VGK | 77 | $173M | 18% | 223.4 | 87% | 0.75 (SPY) | 0.75 correlated to SPY |
| VIXY | 77 | $49M | 68% | 218.8 | 87% | 0.77 (SPY) | 0.77 correlated to SPY |
| AVAX-USD | 77 | $0M | 74% | 197.5 | 98% | 0.79 (ADA-USD) | watched |
| LINK-USD | 77 | $0M | 70% | 198.4 | 98% | 0.82 (ADA-USD) | watched |
| UNI-USD | 77 | $0M | 83% | 197.4 | 98% | 0.69 (ETH-USD) | 0.69 correlated to ETH-USD |
| ATOM-USD | 77 | $32M | 75% | 204.1 | 98% | 0.78 (DOT-USD) | 0.78 correlated to DOT-USD |
| AAVE-USD | 77 | $0M | 77% | 198.0 | 93% | 0.74 (ETH-USD) | 0.74 correlated to ETH-USD |
| JPM | 76 | $2.5B | 24% | 219.3 | 86% | 0.84 (XLF) | 0.84 correlated to XLF |
| XOM | 76 | $2.2B | 27% | 221.1 | 89% | 0.92 (XLE) | 0.92 correlated to XLE |
| CVX | 76 | $1.5B | 25% | 220.9 | 88% | 0.90 (XLE) | 0.90 correlated to XLE |
| DUK | 76 | $458M | 18% | 218.5 | 88% | 0.82 (XLU) | 0.82 correlated to XLU |
| SO | 76 | $503M | 19% | 218.7 | 88% | 0.81 (XLU) | 0.81 correlated to XLU |
| AEP | 76 | $508M | 20% | 218.2 | 88% | 0.82 (XLU) | 0.82 correlated to XLU |
| IWM | 76 | $6.0B | 22% | 221.1 | 88% | 0.85 (SPY) | watched |
| DOGE-USD | 76 | $0M | 73% | 198.4 | 93% | 0.82 (ADA-USD) | watched |
| GRT-USD | 76 | $0M | 77% | 198.4 | 90% | 0.76 (DOT-USD) | 0.76 correlated to DOT-USD |
| ALGO-USD | 76 | $2M | 78% | 205.3 | 91% | 0.75 (DOT-USD) | 0.75 correlated to DOT-USD |
| VET-USD | 76 | $0M | 73% | 204.4 | 88% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| HBAR-USD | 76 | $3M | 80% | 204.2 | 91% | 0.74 (ADA-USD) | 0.74 correlated to ADA-USD |
| AXS-USD | 76 | $13M | 87% | 204.3 | 98% | 0.70 (DOT-USD) | 0.70 correlated to DOT-USD |
| CRV-USD | 76 | $0M | 85% | 197.3 | 92% | 0.69 (DOT-USD) | 0.69 correlated to DOT-USD |
| GOOG | 75 | $6.1B | 32% | 219.1 | 88% | 1.00 (GOOGL) | 1.00 correlated to GOOGL |
| XLK | 75 | $1.5B | 26% | 221.0 | 90% | 0.97 (QQQ) | watched |
| XLF | 75 | $1.8B | 18% | 220.4 | 91% | 0.87 (DIA) | watched |
| MTUM | 75 | $419M | 22% | 220.3 | 85% | 0.86 (XLK) | 0.86 correlated to XLK |
| VLUE | 75 | $129M | 18% | 219.0 | 87% | 0.86 (IWM) | 0.86 correlated to IWM |
| RUNE-USD | 75 | $2M | 95% | 205.4 | 96% | 0.63 (AVAX-USD) | 0.63 correlated to AVAX-USD |
| THETA-USD | 75 | $1M | 82% | 204.0 | 95% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| XLI | 74 | $1.2B | 18% | 219.4 | 86% | 0.88 (DIA) | **watched, failing** |
| APT-USD | 74 | $0M | 156% | 199.1 | 43% | 0.10 (XRP-USD) | 0.10 correlated to XRP-USD |
| NEAR-USD | 74 | $296M | 92% | 205.1 | 98% | 0.76 (DOT-USD) | 0.76 correlated to DOT-USD |
| INJ-USD | 74 | $320M | 94% | 205.0 | 98% | 0.74 (AVAX-USD) | 0.74 correlated to AVAX-USD |
| SEI-USD | 74 | $1M | 90% | 200.4 | 89% | 0.70 (ADA-USD) | 0.70 correlated to ADA-USD |
| SNX-USD | 74 | $2M | 95% | 204.0 | 96% | 0.69 (ETH-USD) | 0.69 correlated to ETH-USD |
| DYDX-USD | 74 | $0M | 96% | 203.9 | 96% | 0.68 (DOT-USD) | 0.68 correlated to DOT-USD |
| QQQ | 73 | $25.8B | 23% | 220.8 | 85% | 0.97 (XLK) | watched |
| DIA | 73 | $1.8B | 15% | 219.3 | 86% | 0.92 (SPY) | **watched, failing** |
| MDY | 73 | $401M | 20% | 221.6 | 88% | 0.96 (IWM) | 0.96 correlated to IWM |
| IWF | 73 | $465M | 22% | 222.1 | 89% | 0.98 (QQQ) | 0.98 correlated to QQQ |
| SAND-USD | 73 | $1M | 89% | 204.1 | 92% | 0.77 (DOT-USD) | 0.77 correlated to DOT-USD |
| MANA-USD | 73 | $1M | 89% | 204.8 | 92% | 0.79 (DOT-USD) | 0.79 correlated to DOT-USD |
| ENS-USD | 73 | $49M | 93% | 204.2 | 98% | 0.77 (ADA-USD) | 0.77 correlated to ADA-USD |
| SPY | 72 | $33.7B | 17% | 221.7 | 84% | 0.95 (QQQ) | **watched, failing** |
| KAS-USD | 71 | $0M | 111% | 203.5 | 90% | 0.63 (SOL-USD) | 0.63 correlated to SOL-USD |
| UVXY | 70 | $145M | 100% | 220.2 | 85% | 0.77 (SPY) | 0.77 correlated to SPY |
| SHIB-USD | 64 | $0M | 72% | 194.7 | 8% | 0.81 (DOGE-USD) | 0.81 correlated to DOGE-USD |
| PEPE-USD | 59 | $0M | 87% | 185.0 | 4% | 0.86 (DOGE-USD) | 0.86 correlated to DOGE-USD |

---

_The candidate pool is a committed snapshot in `server/candidates/`, edit it freely. Being a snapshot of today's liquid names, it is itself survivorship-biased — it contains what survived to be listed — so treat it as a starting universe rather than an unbiased one. Nothing here places a trade or edits a watchlist; adding a symbol is still your call._
