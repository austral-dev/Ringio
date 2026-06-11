<template>
  <section class="assets-panel" aria-labelledby="assets-title">
    <div class="panel-header">
      <div>
        <span class="eyebrow">Activos</span>
        <h2 id="assets-title">Posiciones abiertas</h2>
        <p>Seguimiento diario del rendimiento por activo y asignación del portafolio.</p>
      </div>
      <div class="panel-actions" aria-label="Filtros de activos">
        <button
          v-for="filter in filters"
          :key="filter"
          class="filter-pill"
          :class="{ active: activeFilter === filter }"
          type="button"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div class="summary-grid">
      <article v-for="metric in metrics" :key="metric.label" class="summary-card">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small :class="metric.tone">{{ metric.detail }}</small>
      </article>
    </div>

    <div class="assets-table-card">
      <div class="table-toolbar">
        <div class="search-box">
          <Search :size="16" />
          <input v-model="search" type="search" placeholder="Buscar por ticker o nombre" />
        </div>
        <button class="ghost-button" type="button">
          <SlidersHorizontal :size="16" />
          Ordenar
        </button>
      </div>

      <div class="assets-list" role="table" aria-label="Listado de activos del portafolio">
        <div class="asset-row asset-row-head" role="row">
          <span>Activo</span>
          <span>Cantidad</span>
          <span>Precio</span>
          <span>Valor</span>
          <span>Hoy</span>
          <span>Peso</span>
        </div>

        <article v-for="asset in filteredAssets" :key="asset.symbol" class="asset-row" role="row">
          <div class="asset-main">
            <span class="asset-logo" :style="{ '--asset-color': asset.color }">{{ asset.symbol.slice(0, 1) }}</span>
            <div>
              <strong>{{ asset.symbol }}</strong>
              <small>{{ asset.name }}</small>
            </div>
          </div>
          <span>{{ asset.quantity }}</span>
          <span>{{ formatCurrency(asset.price) }}</span>
          <span class="asset-value">{{ formatCurrency(asset.value) }}</span>
          <span class="asset-change" :class="asset.change >= 0 ? 'positive' : 'negative'">
            <TrendingUp v-if="asset.change >= 0" :size="14" />
            <TrendingDown v-else :size="14" />
            {{ asset.change >= 0 ? '+' : '' }}{{ asset.change }}%
          </span>
          <div class="weight-cell">
            <span>{{ asset.weight }}%</span>
            <div class="weight-track"><span :style="{ width: `${asset.weight}%`, background: asset.color }" /></div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search, SlidersHorizontal, TrendingDown, TrendingUp } from 'lucide-vue-next'

const filters = ['Todos', 'Acciones', 'Cripto', 'ETFs']
const activeFilter = ref('Todos')
const search = ref('')

const assets = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Acciones', quantity: '88 u.', price: 215.89, value: 18998, change: 1.84, weight: 15, color: '#3ECF8E' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Acciones', quantity: '195 u.', price: 142.85, value: 27855, change: 3.21, weight: 22, color: '#9B7AFF' },
  { symbol: 'BTC', name: 'Bitcoin', type: 'Cripto', quantity: '0.49 BTC', price: 67029, value: 32844, change: 2.45, weight: 26, color: '#F59E0B' },
  { symbol: 'ETH', name: 'Ethereum', type: 'Cripto', quantity: '7.65 ETH', price: 3509.54, value: 26848, change: -0.92, weight: 21, color: '#60A5FA' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETFs', quantity: '18 u.', price: 519.5, value: 9351, change: 0.38, weight: 7, color: '#FF6B5B' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Acciones', quantity: '24 u.', price: 480.63, value: 11535, change: 0.76, weight: 9, color: '#3B82F6' },
]

const filteredAssets = computed(() => {
  const query = search.value.trim().toLowerCase()

  return assets.filter((asset) => {
    const matchesFilter = activeFilter.value === 'Todos' || asset.type === activeFilter.value
    const matchesSearch = !query || asset.symbol.toLowerCase().includes(query) || asset.name.toLowerCase().includes(query)
    return matchesFilter && matchesSearch
  })
})

const metrics = computed(() => {
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)
  const bestAsset = [...assets].sort((a, b) => b.change - a.change)[0]

  return [
    { label: 'Valor invertido', value: formatCurrency(totalValue), detail: '+2.28% hoy', tone: 'positive' },
    { label: 'Mejor activo', value: bestAsset.symbol, detail: `+${bestAsset.change}%`, tone: 'positive' },
    { label: 'Diversificación', value: `${assets.length} activos`, detail: '3 clases', tone: 'muted' },
  ]
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1000 ? 0 : 2,
  }).format(value)
}
</script>

<style scoped>
.assets-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
}

.eyebrow {
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.panel-header h2 {
  margin: 4px 0;
  font-size: 26px;
  font-weight: 700;
}

.panel-header p {
  color: var(--muted-foreground);
  margin: 0;
  max-width: 560px;
}

.panel-actions,
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-pill,
.ghost-button {
  border: 1px solid var(--border);
  background: var(--secondary);
  color: var(--muted-foreground);
  border-radius: 999px;
  padding: 8px 12px;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-pill.active,
.filter-pill:hover,
.ghost-button:hover {
  color: var(--foreground);
  border-color: rgba(62, 207, 142, 0.35);
  background: rgba(62, 207, 142, 0.1);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card,
.assets-table-card {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.015)), var(--card, var(--surface));
  border-radius: var(--radius-xl);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
}

.summary-card {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-card span,
.summary-card small,
.asset-main small,
.asset-row-head {
  color: var(--muted-foreground);
}

.summary-card strong {
  font-size: 24px;
}

.positive { color: var(--primary) !important; }
.negative { color: var(--destructive) !important; }
.muted { color: var(--muted-foreground) !important; }

.assets-table-card {
  overflow: hidden;
}

.table-toolbar {
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  background: var(--input, rgba(255, 255, 255, 0.05));
  border-radius: var(--radius-lg);
  padding: 0 12px;
  min-width: 280px;
}

.search-box input {
  width: 100%;
  height: 38px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--foreground);
  font-family: var(--font);
}

.ghost-button {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-lg);
}

.assets-list {
  width: 100%;
}

.asset-row {
  display: grid;
  grid-template-columns: 1.6fr 0.8fr 0.8fr 0.8fr 0.7fr 0.9fr;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}

.asset-row:last-child {
  border-bottom: 0;
}

.asset-row-head {
  padding-top: 12px;
  padding-bottom: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.asset-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-logo {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--asset-color) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--asset-color) 34%, transparent);
  color: var(--asset-color);
  display: grid;
  place-items: center;
  font-weight: 800;
}

.asset-main div,
.asset-main small {
  display: flex;
  flex-direction: column;
}

.asset-value {
  font-weight: 700;
}

.asset-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
}

.weight-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.weight-track {
  flex: 1;
  height: 6px;
  min-width: 54px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.weight-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
}

@media (max-width: 980px) {
  .panel-header,
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .panel-actions {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .search-box {
    min-width: 0;
  }

  .asset-row,
  .asset-row-head {
    grid-template-columns: 1.5fr 0.8fr 0.8fr;
  }

  .asset-row > span:nth-child(2),
  .asset-row > span:nth-child(3),
  .asset-row-head > span:nth-child(2),
  .asset-row-head > span:nth-child(3) {
    display: none;
  }
}

@media (max-width: 640px) {
  .asset-row,
  .asset-row-head {
    grid-template-columns: 1fr;
  }

  .asset-row-head {
    display: none;
  }

  .asset-row {
    gap: 8px;
  }
}
</style>
