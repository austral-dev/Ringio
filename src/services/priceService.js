// ─── URLs base (via proxy de Vite) ───────────────
const YAHOO_BASE_URL = '/api/yahoo'
const COINGECKO_BASE_URL = '/api/coingecko'

// ─── Caché en memoria (TTL: 60 segundos) ─────────
const CACHE_TTL_MS = 60_000
const _cache = new Map()

function getCached(key) {
  const entry = _cache.get(key)
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) {
    _cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key, data) {
  _cache.set(key, { data, ts: Date.now() })
}

// ─── Mapa ticker → coin ID de CoinGecko ──────────
const TICKER_A_COINGECKO = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  MATIC: 'matic-network',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  LINK: 'chainlink',
  UNI: 'uniswap',
  LTC: 'litecoin',
  USDT: 'tether',
  USDC: 'usd-coin',
}

// Convierte cualquier forma de ticker a un coin ID válido de CoinGecko
function resolverCoinId(tickerOrId) {
  const normalizado = tickerOrId.replace(/-USD$/i, '').toUpperCase()
  return TICKER_A_COINGECKO[normalizado] ?? normalizado.toLowerCase()
}

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

  const change24hPct = meta.regularMarketChangePercent
    ?? (meta.chartPreviousClose
      ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100
      : 0)

  return {
    ticker: meta.symbol,
    name: meta.shortName || meta.symbol,
    price: meta.regularMarketPrice,
    currency: meta.currency,
    change24h: meta.regularMarketChange ?? (meta.regularMarketPrice - (meta.chartPreviousClose ?? meta.regularMarketPrice)),
    change24hPct
  }
}

// ─── fetchCryptoPrices (batch) ────────────────────
// Recibe un array de tickers y hace UNA sola request a CoinGecko.
// Los precios ya cacheados no se re-fetchan.
export async function fetchCryptoPrices(tickers) {
  if (tickers.length === 0) return {}

  const coinIds = tickers.map(resolverCoinId)

  // Separar los que ya están en caché de los que hay que pedir
  const resultado = {}
  const porFetchear = []
  const coinIdsPorFetchear = []

  tickers.forEach((ticker, i) => {
    const coinId = coinIds[i]
    const cached = getCached(coinId)
    if (cached) {
      resultado[ticker.toUpperCase()] = cached
    } else {
      porFetchear.push(ticker)
      coinIdsPorFetchear.push(coinId)
    }
  })

  if (coinIdsPorFetchear.length > 0) {
    const uniqueIds = [...new Set(coinIdsPorFetchear)]
    const url = `${COINGECKO_BASE_URL}/api/v3/simple/price?ids=${uniqueIds.join(',')}&vs_currencies=usd&include_24hr_change=true`

    const response = await fetch(url)
    if (!response.ok) throw new Error(`Error al obtener precios de CoinGecko: ${response.status}`)

    const data = await response.json()

    porFetchear.forEach((ticker, i) => {
      const coinId = coinIdsPorFetchear[i]
      const coin = data[coinId]
      if (coin) {
        const priceData = {
          price: coin.usd,
          change24hPct: coin.usd_24h_change ?? 0,
          change24h: coin.usd * ((coin.usd_24h_change ?? 0) / 100),
        }
        setCache(coinId, priceData)
        resultado[ticker.toUpperCase()] = priceData
      }
    })
  }

  return resultado
}

// ─── fetchCryptoPrice (individual) ───────────────
// Para uso en el modal de selección de activo.
// Consulta el caché antes de hacer la request.
export async function fetchCryptoPrice(tickerOrId) {
  const coinId = resolverCoinId(tickerOrId)

  const cached = getCached(coinId)
  if (cached) {
    return {
      ticker: tickerOrId.toUpperCase(),
      name: tickerOrId.charAt(0).toUpperCase() + tickerOrId.slice(1),
      currency: 'USD',
      ...cached,
    }
  }

  const url = `${COINGECKO_BASE_URL}/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Error al obtener precio de ${coinId}: ${response.status}`)

  const data = await response.json()
  const coin = data[coinId]

  if (!coin) throw new Error(`No se encontraron datos para ${coinId}`)

  const priceData = {
    price: coin.usd,
    currency: 'USD',
    change24h: coin.usd * ((coin.usd_24h_change ?? 0) / 100),
    change24hPct: coin.usd_24h_change ?? 0,
  }

  setCache(coinId, priceData)

  return {
    ticker: tickerOrId.toUpperCase(),
    name: tickerOrId.charAt(0).toUpperCase() + tickerOrId.slice(1),
    ...priceData,
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