import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { searchAsset, fetchStockPrice, fetchCryptoPrice } from '@/services/priceService'

export const usePortfolioStore = defineStore('portfolio', () => {

  // ─── Estado: Portfolios ───────────────────────────
  const portfolios = ref([
    { id: 1, name: 'Tech & Growth',  color: '#3ECF8E', holdings: [] },
    { id: 2, name: 'Mercado Cripto', color: '#9B7AFF', holdings: [] },
    { id: 3, name: 'Dividendos',     color: '#FF5B5B', holdings: [] }
  ])

  const activePortfolioId = ref(1)

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
    activePortfolioId,
    activePortfolio,
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