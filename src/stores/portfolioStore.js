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
    } else {
      portfolios.value = data
      // Seleccionar el primero por defecto si no hay ninguno activo
      if (!activePortfolioId.value && data.length > 0) {
        activePortfolioId.value = data[0].id
      }
    }

    loadingPortfolios.value = false
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