import { ref } from 'vue'

export const selectedPortfolioId = ref(null)

export const selectPortfolio = (id) => {
    selectedPortfolioId.value = id
}