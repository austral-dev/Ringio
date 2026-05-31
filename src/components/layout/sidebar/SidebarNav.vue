<template>
  <div class="section">
    <span class="section-label">Menú</span>
    <nav class="nav">
      <a class="nav-item active" href="#">
        <LayoutDashboard class="nav-icon" /> Dashboard
      </a>
      <a class="nav-item" href="#">
        <TrendingUp class="nav-icon" /> Mercados
      </a>
      <a class="nav-item" href="#">
        <Newspaper class="nav-icon" /> Noticias
      </a>
      <a class="nav-item" href="#">
        <Bell class="nav-icon" /> Alertas
        <span class="nav-badge">3</span>
      </a>
    </nav>
  </div>
</template>

<script setup>
import { LayoutDashboard, TrendingUp, Newspaper, Bell } from 'lucide-vue-next'
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

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: var(--radius-md);
  color: var(--muted-foreground);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
}

.nav-item:hover {
  background: var(--secondary);
  color: var(--foreground);
}

.nav-item.active {
  background: var(--secondary);
  color: var(--foreground);
}

.nav-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--muted-foreground);
}

.nav-badge {
  margin-left: auto;
  background: var(--primary);
  color: #021A0E;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 99px;
}
</style>