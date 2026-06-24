import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { currentUser } from './useAuth.js'

export const portfolios = ref([])
export const loadingPortfolios = ref(false)

export const fetchPortfolios = async () => {
    if (!currentUser.value) return

    loadingPortfolios.value = true

    const { data, error } = await supabase
        .from('Portfolio')
        .select('*')
        .eq('user_id', currentUser.value.id)

    if (error) {
        console.error('Error trayendo portfolios:', error)
        loadingPortfolios.value = false
        return
    }

    const portfoliosConStats = await Promise.all(
        data.map(async (p) => {
            const stats = await calcularStatsPortfolio(p.id)
            return { ...p, ...stats }
        })
    )

    portfolios.value = portfoliosConStats
    loadingPortfolios.value = false
}

const calcularStatsPortfolio = async (portfolioId) => {
    const { data: transacciones } = await supabase
        .from('Transaccion')
        .select('*')
        .eq('portfolio_id', portfolioId)

    if (!transacciones || transacciones.length === 0) return { valorTotal: 0, cantidadActivos: 0, variacion24h: 0 }

    const activoIds = [...new Set(transacciones.map(tx => tx.activo_id))]

    const { data: activos } = await supabase
        .from('Activo')
        .select('*')
        .in('id', activoIds)

    if (!activos) return { valorTotal: 0, cantidadActivos: 0, variacion24h: 0 }

    let valorTotal = 0
    let cantidadActivos = 0
    let sumaPonderada = 0

    for (const activo of activos) {
        const txs = transacciones.filter(tx => tx.activo_id === activo.id)
        let cantidad = 0
        for (const tx of txs) {
            if (tx.tipo === 'compra') cantidad += tx.cantidad
            else if (tx.tipo === 'venta') cantidad -= tx.cantidad
        }
        if (cantidad > 0) {
            const montoActivo = cantidad * activo.valor
            valorTotal += montoActivo
            cantidadActivos++
            sumaPonderada += montoActivo * 0 // Acá va la variacion24hs
        }
    }
    const variacion24h = valorTotal > 0 ? sumaPonderada / valorTotal : 0
    return { valorTotal, cantidadActivos, variacion24h }
}