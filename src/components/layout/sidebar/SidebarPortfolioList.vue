<template>
  <section class="portfolio-section" aria-labelledby="sidebar-portfolios-title">
    <span id="sidebar-portfolios-title" class="section-label">Mis portafolios</span>

    <div class="portfolio-list">
      <article
        v-for="portfolio in portfolios"
        :key="portfolio.id"
        class="portfolio-item"
        :class="{ active: selectedPortfolioId === portfolio.id }"
      >
        <button class="portfolio-select" type="button" @click="selectPortfolio(portfolio.id)">
          <span class="portfolio-dot" :style="{ backgroundColor: portfolio.color }" />
          <span class="portfolio-info">
            <span class="portfolio-name">{{ portfolio.name }}</span>
            <span class="portfolio-value">{{ formatCurrency(portfolio.value) }}</span>
          </span>
          <span class="portfolio-change" :class="portfolio.change >= 0 ? 'positive' : 'negative'">
            {{ portfolio.change >= 0 ? '+' : '' }}{{ portfolio.change.toFixed(2) }}%
          </span>
        </button>

        <button
          class="remove-portfolio-btn"
          type="button"
          :aria-label="`Quitar portafolio ${portfolio.name}`"
          @click="removePortfolio(portfolio.id)"
        >
          <X :size="13" />
        </button>
      </article>
    </div>

    <form v-if="isAdding" class="new-portfolio-form" @submit.prevent="addPortfolio">
      <label class="sr-only" for="portfolio-name">Nombre del portafolio</label>
      <input
        id="portfolio-name"
        v-model.trim="newPortfolioName"
        type="text"
        placeholder="Nombre"
        maxlength="32"
        autofocus
      />

      <label class="sr-only" for="portfolio-value">Valor del portafolio</label>
      <input
        id="portfolio-value"
        v-model.number="newPortfolioValue"
        type="number"
        min="0"
        step="1"
        placeholder="Valor"
      />

      <div class="form-actions">
        <button class="confirm-btn" type="submit" :disabled="!canAddPortfolio">
          <Check :size="14" />
          Agregar
        </button>
        <button class="cancel-btn" type="button" @click="cancelAddPortfolio">
          Cancelar
        </button>
      </div>
    </form>

    <button v-else class="new-portfolio-btn" type="button" @click="startAddPortfolio">
      <Plus :size="15" />
      Nuevo portafolio
    </button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Check, Plus, X } from 'lucide-vue-next'

const portfolioColors = ['#3ECF8E', '#9B7AFF', '#FF6B5B', '#60A5FA', '#F59E0B']

const portfolios = ref([
  { id: 1, name: 'Tech & Growth', value: 127431, change: 2.28, color: '#3ECF8E' },
  { id: 2, name: 'Mercado Cripto', value: 68908, change: 4.02, color: '#9B7AFF' },
  { id: 3, name: 'Dividendos', value: 23455, change: -0.41, color: '#FF6B5B' },
])

const selectedPortfolioId = ref(portfolios.value[0]?.id ?? null)
const isAdding = ref(false)
const newPortfolioName = ref('')
const newPortfolioValue = ref(null)

const canAddPortfolio = computed(() => newPortfolioName.value.length > 0 && Number(newPortfolioValue.value) >= 0)

function selectPortfolio(id) {
  selectedPortfolioId.value = id
}

function startAddPortfolio() {
  isAdding.value = true
}

function cancelAddPortfolio() {
  isAdding.value = false
  newPortfolioName.value = ''
  newPortfolioValue.value = null
}

function addPortfolio() {
  if (!canAddPortfolio.value) return

  const nextIndex = portfolios.value.length
  const newPortfolio = {
    id: Date.now(),
    name: newPortfolioName.value,
    value: Number(newPortfolioValue.value),
    change: 0,
    color: portfolioColors[nextIndex % portfolioColors.length],
  }

  portfolios.value.push(newPortfolio)
  selectedPortfolioId.value = newPortfolio.id
  cancelAddPortfolio()
}

function removePortfolio(id) {
  portfolios.value = portfolios.value.filter((portfolio) => portfolio.id !== id)

  if (selectedPortfolioId.value === id) {
    selectedPortfolioId.value = portfolios.value[0]?.id ?? null
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.portfolio-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.section-label {
  color: #8b84c6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  line-height: 1;
  margin: 0 0 3px 11px;
  text-transform: uppercase;
}

.portfolio-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.portfolio-item {
  position: relative;
  border-radius: 13px;
}

.portfolio-item.active {
  background: #171625;
}

.portfolio-select {
  width: 100%;
  min-height: 60px;
  display: grid;
  grid-template-columns: 14px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 13px;
  background: transparent;
  color: var(--foreground);
  cursor: pointer;
  font-family: var(--font);
  padding: 10px 10px 10px 12px;
  text-align: left;
}

.portfolio-item:not(.active) .portfolio-select:hover {
  background: rgba(255, 255, 255, 0.035);
}

.portfolio-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  box-shadow: 0 0 16px currentColor;
}

.portfolio-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.portfolio-name {
  overflow: hidden;
  color: #f4f1ff;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.portfolio-value {
  color: #8b84c6;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1;
}

.portfolio-change {
  align-self: center;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  padding-right: 1px;
}

.portfolio-change.positive {
  color: #3ef59a;
}

.portfolio-change.negative {
  color: #ff5b6b;
}

.remove-portfolio-btn {
  position: absolute;
  right: 6px;
  top: 5px;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(9, 9, 15, 0.72);
  color: var(--muted-foreground);
  cursor: pointer;
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity 0.15s ease, transform 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.portfolio-item:hover .remove-portfolio-btn,
.remove-portfolio-btn:focus-visible {
  opacity: 1;
  transform: translateY(0);
}

.remove-portfolio-btn:hover {
  background: rgba(255, 91, 91, 0.14);
  color: var(--destructive);
}

.new-portfolio-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #8b84c6;
  cursor: pointer;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 500;
  margin-top: 6px;
  padding: 10px 11px;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}

.new-portfolio-btn:hover {
  background: rgba(255, 255, 255, 0.035);
  color: #f4f1ff;
}

.new-portfolio-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #11101d;
  margin-top: 6px;
  padding: 10px;
}

.new-portfolio-form input {
  width: 100%;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--foreground);
  font-family: var(--font);
  outline: none;
  padding: 0 10px;
}

.new-portfolio-form input:focus {
  border-color: rgba(62, 207, 142, 0.5);
  box-shadow: 0 0 0 3px rgba(62, 207, 142, 0.08);
}

.form-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
}

.confirm-btn,
.cancel-btn {
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  border-radius: 9px;
  cursor: pointer;
  font-family: var(--font);
  font-size: 12px;
  font-weight: 700;
}

.confirm-btn {
  background: var(--primary);
  color: var(--primary-foreground);
}

.confirm-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.cancel-btn {
  background: var(--secondary);
  color: var(--muted-foreground);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
