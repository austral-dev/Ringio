<template>
  <section class="portfolios-panel" aria-labelledby="portfolios-title">
    <div class="panel-hero">
      <div class="hero-copy">
        <span class="eyebrow">Mis portafolios</span>
        <h2 id="portfolios-title">Gestioná todos tus portafolios en un solo lugar</h2>
        <p>
          Visualizá el valor total, rendimiento diario y distribución de cada estrategia de inversión.
        </p>
      </div>
    </div>

    <div class="portfolio-summary">
      <article v-for="metric in metrics" :key="metric.label" class="summary-card">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <small :class="metric.tone">{{ metric.detail }}</small>
      </article>
    </div>

    <div class="portfolio-grid">
      <article
        v-for="portfolio in portfoliosMapeados.slice(0, 3)"
        :key="portfolio.id"
        class="portfolio-card"
        :class="{ featured: portfolio.featured }"
      >
        <div class="portfolio-card-header">
          <span class="portfolio-icon" :style="{ '--portfolio-color': portfolio.color }">
            <component :is="portfolio.icon" :size="20" />
          </span>
        </div>

        <div class="portfolio-card-body">
          <div>
            <h3>{{ portfolio.name }}</h3>
            <p>{{ portfolio.description }}</p>
          </div>
          <strong>{{ formatCurrency(portfolio.value) }}</strong>
        </div>

        <div class="portfolio-card-footer">
          <span class="change-pill" :class="portfolio.change >= 0 ? 'positive' : 'negative'">
            <TrendingUp v-if="portfolio.change >= 0" :size="14" />
            <TrendingDown v-else :size="14" />
            {{ portfolio.change >= 0 ? '+' : '' }}{{ (portfolio.change).toFixed(2) }}% hoy
          </span>
          <span class="holdings">{{ portfolio.holdings }} activos</span>
        </div>

        <div class="allocation-row" aria-label="Distribución del portafolio">
          <span
            v-for="allocation in portfolio.allocation"
            :key="allocation.label"
            :style="{ width: `${allocation.value}%`, background: allocation.color }"
            :title="`${allocation.label}: ${allocation.value}%`"
          />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import {
  BarChart3,
  Coins,
  MoreHorizontal,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolioStore.js'

const store = usePortfolioStore()
const { portfolios, loadingPortfolios } = storeToRefs(store)

// Íconos por defecto que rotan cuando no hay uno asignado en la BD
const iconosPorDefecto = [BarChart3, Coins, ShieldCheck]

// Mapeamos los campos reales de Supabase a lo que necesita el template
const portfoliosMapeados = computed(() =>
  portfolios.value.map((p, i) => ({
    id: p.id,
    name: p.nombre,
    description: p.descripcion ?? '',
    value: p.valorTotal ?? 0,
    change: p.variacion24h ?? 0,
    holdings: p.cantidadActivos ?? 0,
    color: p.color ?? ['#3ECF8E', '#9B7AFF', '#FF5B5B', '#60A5FA', '#F59E0B'][i % 5],
    icon: iconosPorDefecto[i % iconosPorDefecto.length],
    featured: i === 0,
    allocation: p.allocation ?? [],
  }))
)

const metrics = computed(() => {
  const ps = portfoliosMapeados.value
  if (ps.length === 0) return []

  const totalValue = ps.reduce((sum, p) => sum + p.value, 0)
  const bestPortfolio = [...ps].sort((a, b) => b.change - a.change)[0]

  return [
    { label: 'Valor total', value: formatCurrency(totalValue), detail: 'en todos los portafolios', tone: 'muted' },
    { label: 'Portafolios', value: ps.length.toString(), detail: 'estrategias activas', tone: 'muted' },
    { label: 'Mejor rendimiento', value: bestPortfolio.name, detail: bestPortfolio.change !== 0 ? `${bestPortfolio.change > 0 ? '+' : ''}${bestPortfolio.change.toFixed(2)}% hoy` : 'Sin variación', tone: bestPortfolio.change > 0 ? 'positive' : bestPortfolio.change < 0 ? 'negative' : 'muted' },
  ]
})

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>

<style scoped>
.portfolios-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-hero,
.summary-card,
.portfolio-card {
  border: 1px solid var(--border);
  background: var(--card, var(--surface));
  box-shadow: 0 18px 60px color-mix(in srgb, var(--foreground) 10%, transparent);
}

.panel-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  border-radius: var(--radius-xl);
  padding: 24px;
  overflow: hidden;
  position: relative;
}

.panel-hero::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  right: -72px;
  top: -84px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(62, 207, 142, 0.18), transparent 68%);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  max-width: 640px;
  z-index: 1;
}

.eyebrow {
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.panel-hero h2 {
  margin: 6px 0;
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.panel-hero p {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.7;
}

.primary-action,
.icon-action {
  border: 1px solid transparent;
  font-family: var(--font);
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease, background 0.15s ease;
}

.primary-action {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius-lg);
  padding: 10px 16px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-weight: 800;
  white-space: nowrap;
}

.primary-action:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.portfolio-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  border-radius: var(--radius-lg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-card span,
.summary-card small,
.portfolio-card p,
.holdings {
  color: var(--muted-foreground);
}

.summary-card strong {
  font-size: 24px;
  line-height: 1.1;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.portfolio-card {
  border-radius: var(--radius-xl);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 248px;
}

.portfolio-card.featured {
  border-color: rgba(62, 207, 142, 0.28);
  background:
    radial-gradient(circle at 16% 0%, rgba(62, 207, 142, 0.13), transparent 34%),
    color-mix(in srgb, var(--primary) 5%, var(--card, var(--surface)));
}

.portfolio-card-header,
.portfolio-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.portfolio-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: var(--portfolio-color);
  border: 1px solid color-mix(in srgb, var(--portfolio-color) 34%, transparent);
  background: color-mix(in srgb, var(--portfolio-color) 14%, transparent);
}

.icon-action {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  border-color: var(--border);
  color: var(--muted-foreground);
  background: var(--secondary);
}

.icon-action:hover {
  color: var(--foreground);
  background: var(--secondary);
}

.portfolio-card-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
}

.portfolio-card h3 {
  margin: 0 0 6px;
  font-size: 19px;
  font-weight: 800;
}

.portfolio-card p {
  margin: 0;
  line-height: 1.55;
}

.portfolio-card-body > strong {
  font-size: 30px;
  line-height: 1;
}

.change-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.change-pill.positive {
  color: var(--primary);
  background: rgba(62, 207, 142, 0.1);
}

.change-pill.negative {
  color: var(--destructive);
  background: rgba(255, 91, 91, 0.1);
}

.positive { color: var(--primary) !important; }
.muted { color: var(--muted-foreground) !important; }

.allocation-row {
  display: flex;
  gap: 4px;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--muted);
}

.allocation-row span {
  height: 100%;
  border-radius: inherit;
}

@media (max-width: 1100px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .panel-hero,
  .portfolio-card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .portfolio-summary {
    grid-template-columns: 1fr;
  }

  .primary-action {
    justify-content: center;
  }
}

.negative { color: var(--destructive) !important; }
</style>
