import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePortfolioStore = defineStore('portfolio', () => {

  // ─── Estado ───────────────────────────────────────
  const portfolios = ref([
    {
      id: 1,
      name: 'Tech & Growth',
      color: '#3ECF8E',
      holdings: []
    },
    {
      id: 2,
      name: 'Mercado Cripto',
      color: '#9B7AFF',
      holdings: []
    },
    {
      id: 3,
      name: 'Dividendos',
      color: '#FF5B5B',
      holdings: []
    }
  ])

  const activePortfolioId = ref(1)

  // ─── Computed ─────────────────────────────────────
  const activePortfolio = computed(() =>
    portfolios.value.find(p => p.id === activePortfolioId.value)
  )

  // ─── Acciones ─────────────────────────────────────
  function setActivePortfolio(id) {
    activePortfolioId.value = id
  }

  return {
    portfolios,
    activePortfolioId,
    activePortfolio,
    setActivePortfolio
  }
})