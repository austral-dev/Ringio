import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'
import {fetchStockPrice, fetchCryptoPrice} from '@/services/priceService'

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
        }
    }

    const ppc = totalCompradoCantidad > 0? totalCompradoMonto / totalCompradoCantidad: 0

    return { cantidad, ppc }
}

const construirAsset = async (activo, txs) => {
    const { cantidad, ppc } = calcularPosicion(txs)

    const precioActual = activo.valor
    const montoActual = cantidad * precioActual
    const montoInvertido = cantidad * ppc
    const gananciaPerdida = montoActual - montoInvertido
    const porcentaje = montoInvertido > 0? (gananciaPerdida / montoInvertido) * 100: 0

    let variacion24h = 0

    try {
        const isCrypto = activo.tipo?.toLowerCase() === 'crypto'

        const priceData = isCrypto? await fetchCryptoPrice(activo.ticker.toLowerCase()): await fetchStockPrice(activo.ticker)
        variacion24h = priceData.change24hPct ?? 0
    } catch (err) {
        console.error(`Error obteniendo variación ${activo.ticker}:`, err)
    }

    return {
        id: activo.id,
        ticker: activo.ticker,
        nombre: activo.nombre,
        tipo: activo.tipo,
        categoria: activo.categoria,
        precio: precioActual,
        variacion24h: variacion24h,
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

    const resultado = (await Promise.all(
        activos.map((activo) => construirAsset(activo, porActivo[activo.id])))).filter((a) => a.cantidad > 0)

    assets.value = resultado
    loadingAssets.value = false
}

