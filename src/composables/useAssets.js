import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { fetchStockPrice, fetchCryptoPrices } from '@/services/priceService'

export const assets = ref([])
export const loadingAssets = ref(false)

const fetchTransacciones = async (portfolioId) => {
    const { data, error } = await supabase
        .from('Transaccion')
        .select('*')
        .eq('portfolio_id', portfolioId)

    if (error) {
        console.error('Error trayendo transacciones:', error)
        return []
    }

    return data ?? []
}

const agruparPorActivo = (transacciones) => {
    const porActivo = {}

    for (const tx of transacciones) {
        if (!porActivo[tx.activo_id]) {
            porActivo[tx.activo_id] = []
        }
        porActivo[tx.activo_id].push(tx)
    }

    return porActivo
}

const fetchActivos = async (activoIds) => {
    const { data, error } = await supabase
        .from('Activo')
        .select('*')
        .in('id', activoIds)

    if (error) {
        console.error('Error trayendo activos:', error)
        return []
    }

    return data ?? []
}

const calcularPosicion = (txs) => {
    let cantidad = 0
    let totalCompradoMonto = 0
    let totalCompradoCantidad = 0

    for (const tx of txs) {
        if (tx.tipo === 'compra') {
            cantidad += tx.cantidad
            totalCompradoMonto += tx.cantidad * tx.precio
            totalCompradoCantidad += tx.cantidad
        } else if (tx.tipo === 'venta') {
            cantidad -= tx.cantidad
        } else if (tx.tipo === 'rendimiento') {
            // Suma al total de unidades pero no altera el precio promedio de compra
            cantidad += tx.cantidad
        }
    }

    const ppc = totalCompradoCantidad > 0? totalCompradoMonto / totalCompradoCantidad: 0

    return { cantidad, ppc }
}

const construirAsset = (activo, txs, variacion24h = 0) => {
    const { cantidad, ppc } = calcularPosicion(txs)

    const precioActual = activo.valor
    const montoActual = cantidad * precioActual
    const montoInvertido = cantidad * ppc
    const gananciaPerdida = montoActual - montoInvertido
    const porcentaje = montoInvertido > 0? (gananciaPerdida / montoInvertido) * 100: 0

    return {
        id: activo.id,
        ticker: activo.ticker,
        nombre: activo.nombre,
        tipo: activo.tipo,
        categoria: activo.categoria,
        precio: precioActual,
        variacion24h,
        cantidad,
        montoActual,
        ppc,
        gananciaPerdida,
        porcentaje,
    }
}

export const fetchAssets = async (portfolioId) => {
    if (!portfolioId) {
        assets.value = []
        return
    }

    loadingAssets.value = true

    const transacciones = await fetchTransacciones(portfolioId)

    if (transacciones.length === 0) {
        assets.value = []
        loadingAssets.value = false
        return
    }

    const porActivo = agruparPorActivo(transacciones)
    const activoIds = Object.keys(porActivo)
    const activos = await fetchActivos(activoIds)

    // ─── Separar cryptos de acciones ──────────────
    const cryptoActivos = activos.filter(a => a.tipo?.toLowerCase() === 'crypto')
    const stockActivos  = activos.filter(a => a.tipo?.toLowerCase() !== 'crypto')

    // ─── Una sola request para todas las cryptos ──
    const cryptoPrices = await fetchCryptoPrices(cryptoActivos.map(a => a.ticker))
      .catch(() => ({}))

    // ─── Acciones en paralelo (una request por acción, pero simultáneas) ──
    const stockPricesArr = await Promise.all(
        stockActivos.map(a =>
            fetchStockPrice(a.ticker)
                .then(d => ({ ticker: a.ticker, change24hPct: d.change24hPct ?? 0 }))
                .catch(() => ({ ticker: a.ticker, change24hPct: 0 }))
        )
    )
    const stockPrices = Object.fromEntries(stockPricesArr.map(s => [s.ticker, s.change24hPct]))

    // ─── Construir activos con precios ya cargados ─
    const resultado = activos
        .map(activo => {
            const isCrypto = activo.tipo?.toLowerCase() === 'crypto'
            const variacion24h = isCrypto
                ? (cryptoPrices[activo.ticker.toUpperCase()]?.change24hPct ?? 0)
                : (stockPrices[activo.ticker] ?? 0)
            return construirAsset(activo, porActivo[activo.id], variacion24h)
        })
        .filter(a => a.cantidad > 0)

    assets.value = resultado
    loadingAssets.value = false
}

