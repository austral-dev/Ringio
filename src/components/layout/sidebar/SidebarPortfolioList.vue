<template>
  <div class="section">
    <span class="section-label">Mis portafolios</span>
    <div
      v-for="portfolio in portfolios"
      :key="portfolio.id"
      class="portfolio-item"
    >
      <span
        class="portfolio-dot"
        :style="{ backgroundColor: portfolio.color }"
      />
      <div class="portfolio-info">
        <span class="portfolio-name">{{ portfolio.name }}</span>
        <span class="portfolio-value"
          >${{ portfolio.value?.toLocaleString() ?? "—" }}</span
        >
      </div>
      <span
        class="portfolio-change"
        :class="portfolio.change >= 0 ? 'positive' : 'negative'"
      >
        {{
          portfolio.change != null
            ? (portfolio.change >= 0 ? "+" : "") + portfolio.change + "%"
            : "—"
        }}
      </span>
    </div>
    <button class="new-portfolio-btn">+ Nuevo portafolio</button>
  </div>
</template>

<script setup>
import { usePortfolioStore } from "@/stores/portfolioStore";

const store = usePortfolioStore();
const portfolios = store.portfolios;
</script>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 20px;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}

.portfolio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.15s;
}

.portfolio-item:hover {
  background: var(--secondary);
}

.portfolio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.portfolio-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.portfolio-name {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portfolio-value {
  font-size: 12px;
  color: var(--muted-foreground);
}

.positive {
  color: var(--primary);
  font-size: 12px;
  font-weight: 500;
}
.negative {
  color: var(--destructive);
  font-size: 12px;
  font-weight: 500;
}

.new-portfolio-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 8px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--muted-foreground);
  font-size: 13px;
  font-family: var(--font);
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
}

.new-portfolio-btn:hover {
  color: var(--foreground);
  background: var(--secondary);
}
</style>
