// ─── URLs base (via proxy de Vite) ───────────────
const YAHOO_BASE_URL = '/api/yahoo'
const COINGECKO_BASE_URL = '/api/coingecko'

// ─── fetchStockPrice ─────────────────────────────
export async function fetchStockPrice(ticker) {
  const url = `${YAHOO_BASE_URL}/v8/finance/chart/${ticker}?interval=1d&range=1d`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error al obtener precio de ${ticker}: ${response.status}`)
  }

  const data = await response.json()
  const result = data?.chart?.result?.[0]

  if (!result) {
    throw new Error(`No se encontraron datos para ${ticker}`)
  }

  const meta = result.meta

  return {
    ticker: meta.symbol,
    name: meta.shortName || meta.symbol,
    price: meta.regularMarketPrice,
    currency: meta.currency,
    change24h: meta.regularMarketPrice - meta.chartPreviousClose,
    change24hPct: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
  }
}


// ─── fetchCryptoPrice ────────────────────────────
export async function fetchCryptoPrice(coinId) {
  const url = `${COINGECKO_BASE_URL}/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error al obtener precio de ${coinId}: ${response.status}`)
  }

  const data = await response.json()
  const coin = data[coinId]

  if (!coin) {
    throw new Error(`No se encontraron datos para ${coinId}`)
  }

  return {
    ticker: coinId.toUpperCase(),
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    price: coin.usd,
    currency: 'USD',
    change24h: coin.usd * (coin.usd_24h_change / 100),
    change24hPct: coin.usd_24h_change
  }
}



// ─── searchAsset ─────────────────────────────────
export async function searchAsset(query) {
  const url = `${YAHOO_BASE_URL}/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=8&newsCount=0`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Error en la búsqueda: ${response.status}`)
  }

  const data = await response.json()
  const quotes = data?.quotes || []

  return quotes
    .filter(q => q.symbol && q.quoteType)
    .map(q => ({
      ticker: q.symbol,
      name: q.shortname || q.longname || q.symbol,
      type: q.quoteType,
      exchange: q.exchange
    }))
}