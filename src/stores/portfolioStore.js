import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchAsset, fetchStockPrice, fetchCryptoPrice } from '@/services/priceService'
import { supabase } from '@/lib/supabase.js'
import { currentUser } from '@/composables/useAuth.js'

export const usePortfolioStore = defineStore('portfolio', () => {

  // ─── Estado: Portfolios ───────────────────────────
  const portfolios = ref([])
  const loadingPortfolios = ref(false)
  const portfoliosError = ref(null)

  const activePortfolioId = ref(null)

  // ─── Estado: Modal / Flujo de transacción ────────
  const isTransactionModalOpen = ref(false)

  const transactionFlow = ref({
    step: 'search',       // 'search' | 'form'
    selectedAsset: null,  // { ticker, name, type, price, currency, change24hPct }
    type: null,           // 'buy' | 'sell' | 'dividend'
  })

  // ─── Estado: Búsqueda ─────────────────────────────
  const searchQuery    = ref('')
  const searchResults  = ref([])
  const isSearching    = ref(false)
  const searchError    = ref(null)

  // ─── Computed ─────────────────────────────────────
  const activePortfolio = computed(() =>
    portfolios.value.find(p => p.id === activePortfolioId.value)
  )

  // ─── Acciones: Portfolio ──────────────────────────
  async function calcularStats(portfolioId) {
    const { data: transacciones } = await supabase
      .from('Transaccion')
      .select('*')
      .eq('portfolio_id', portfolioId)

    if (!transacciones || transacciones.length === 0) {
      return { valorTotal: 0, cantidadActivos: 0, variacion24h: 0, rendimiento: 0 }
    }

    const activoIds = [...new Set(transacciones.map(tx => tx.activo_id))]
    const { data: activos } = await supabase
      .from('Activo')
      .select('*')
      .in('id', activoIds)

    if (!activos) return { valorTotal: 0, cantidadActivos: 0, variacion24h: 0, rendimiento: 0 }

    // Traer variación 24h de cada activo desde la API
    const preciosAPI = await Promise.all(
      activos.map(async (activo) => {
        try {
          if (activo.tipo === 'Crypto' && activo.codigo) {
            const data = await fetchCryptoPrice(activo.codigo)
            return { id: activo.id, change24hPct: data.change24hPct }
          } else if (activo.tipo === 'Acción' && activo.ticker) {
            const data = await fetchStockPrice(activo.ticker)
            return { id: activo.id, change24hPct: data.change24hPct }
          }
        } catch {
          // Si falla la API, usamos 0
        }
        return { id: activo.id, change24hPct: 0 }
      })
    )

    const cambiosPorId = Object.fromEntries(preciosAPI.map(p => [p.id, p.change24hPct]))

    let valorTotal = 0
    let cantidadActivos = 0
    let montoInvertido = 0
    let sumaPonderada = 0
    const activosConMonto = []

    for (const activo of activos) {
      const txs = transacciones.filter(tx => tx.activo_id === activo.id)
      let cantidad = 0
      for (const tx of txs) {
        if (tx.tipo === 'compra') {
          cantidad += tx.cantidad
          montoInvertido += tx.cantidad * tx.precio
        } else if (tx.tipo === 'venta') {
          cantidad -= tx.cantidad
        }
      }
      if (cantidad > 0) {
        const montoActivo = cantidad * activo.valor
        valorTotal += montoActivo
        cantidadActivos++
        sumaPonderada += montoActivo * (cambiosPorId[activo.id] ?? 0)
        activosConMonto.push({ id: activo.id, ticker: activo.ticker, monto: montoActivo })
      }
    }

    const rendimiento = montoInvertido > 0 ? ((valorTotal - montoInvertido) / montoInvertido) * 100 : 0
    const variacion24h = valorTotal > 0 ? sumaPonderada / valorTotal : 0
    const COLORES = ['#fe6b5b', '#9a7afe', '#3ece8d', '#60a4f9', '#f49d0b', '#8b84c6']
    const allocation = activosConMonto
        .sort((a, b) => b.monto - a.monto)
        .map((a, i) => ({
            label: a.ticker,
            value: parseFloat(((a.monto / valorTotal) * 100).toFixed(1)),
            color: COLORES[i % COLORES.length]
        }))

    return { valorTotal, montoInvertido, cantidadActivos, variacion24h, rendimiento, allocation }
  }

  async function fetchPortfolios() {
    if (!currentUser.value) return

    loadingPortfolios.value = true
    portfoliosError.value = null

    const { data, error } = await supabase
      .from('Portfolio')
      .select('*')
      .eq('user_id', currentUser.value.id)

    if (error) {
      console.error('Error trayendo portfolios:', error)
      portfoliosError.value = error.message
      loadingPortfolios.value = false
      return
    }

    // Enriquecer cada portfolio con sus stats calculadas desde Transaccion + Activo
    const conStats = await Promise.all(
      data.map(async (p) => {
        const stats = await calcularStats(p.id)
        return { ...p, ...stats }
      })
    )

    portfolios.value = conStats

    // Seleccionar el primero por defecto si no hay ninguno activo
    if (!activePortfolioId.value && conStats.length > 0) {
      activePortfolioId.value = conStats[0].id
    }

    loadingPortfolios.value = false
  }

  async function addPortfolio(nombre, descripcion = '') {
    if (!currentUser.value || !nombre.trim()) return null

    const { data, error } = await supabase
      .from('Portfolio')
      .insert({ user_id: currentUser.value.id, nombre: nombre.trim(), descripcion })
      .select()
      .single()

    if (error) {
      console.error('Error creando portfolio:', error)
      return null
    }

    const nuevoConStats = { ...data, valorTotal: 0, cantidadActivos: 0, variacion24h: 0 }
    portfolios.value.push(nuevoConStats)
    activePortfolioId.value = data.id
    return data
  }

  async function removePortfolio(id) {
    await supabase.from('Transaccion').delete().eq('portfolio_id', id)
    await supabase.from('Portfolio').delete().eq('id', id)

    portfolios.value = portfolios.value.filter(p => p.id !== id)

    if (activePortfolioId.value === id) {
      activePortfolioId.value = portfolios.value[0]?.id ?? null
    }
  }

  function setActivePortfolio(id) {
    activePortfolioId.value = id
  }

  // ─── Acciones: Modal ──────────────────────────────
  function openTransactionModal() {
    resetTransactionFlow()
    isTransactionModalOpen.value = true
  }

  function closeTransactionModal() {
    isTransactionModalOpen.value = false
    resetTransactionFlow()
  }

  function resetTransactionFlow() {
    transactionFlow.value = { step: 'search', selectedAsset: null, type: null }
    searchQuery.value   = ''
    searchResults.value = []
    searchError.value   = null
  }

  // ─── Acciones: Búsqueda ───────────────────────────
  async function search(query) {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    searchError.value = null

    try {
      searchResults.value = await searchAsset(query)
    } catch (err) {
      searchError.value = err.message
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  // ─── Acciones: Selección de activo ───────────────
  async function selectAsset(asset) {
    // Enriquecemos con precio antes de pasar al formulario
    try {
      const isCrypto = asset.type === 'CRYPTOCURRENCY'
      const priceData = isCrypto
        ? await fetchCryptoPrice(asset.ticker.toLowerCase())
        : await fetchStockPrice(asset.ticker)

      transactionFlow.value.selectedAsset = { ...asset, ...priceData }
      transactionFlow.value.step = 'form'
    } catch (err) {
      // Si falla el precio, igual dejamos pasar — el form puede mostrar "—"
      transactionFlow.value.selectedAsset = asset
      transactionFlow.value.step = 'form'
    }
  }

  return {
    // portfolios
    portfolios,
    loadingPortfolios,
    portfoliosError,
    activePortfolioId,
    activePortfolio,
    fetchPortfolios,
    addPortfolio,
    removePortfolio,
    setActivePortfolio,
    // modal
    isTransactionModalOpen,
    transactionFlow,
    openTransactionModal,
    closeTransactionModal,
    resetTransactionFlow,
    // búsqueda
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    search,
    selectAsset,
  }
})