<template>
  <div class="header-nav">
    <div class="header-title">
      <h1 class="portfolio-name">{{ store.activePortfolio?.nombre ?? '—' }}</h1>
      <span class="portfolio-subtitle">Vista general del portafolio</span>
    </div>
    <div class="header-actions">
      <button class="btn-add" @click="store.openTransactionModal()">
        <Plus :size="16" />
        Agregar Transacción
      </button>
      <div class="notifications-wrapper">
        <button class="btn-icon-only" type="button" aria-label="Notificaciones" @click="isNotificationsOpen = !isNotificationsOpen">
          <Bell :size="18" />
          <span v-if="unreadCount" class="notification-dot">{{ unreadCount }}</span>
        </button>
        <section v-if="isNotificationsOpen" class="notifications-popover" aria-label="Notificaciones recientes">
          <header>
            <strong>Notificaciones</strong>
            <button type="button" @click="markAllAsRead">Marcar leídas</button>
          </header>
          <article v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
            <span class="notification-status" />
            <div>
              <strong>{{ notification.title }}</strong>
              <p>{{ notification.description }}</p>
              <small>{{ notification.time }}</small>
            </div>
          </article>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bell, Plus } from 'lucide-vue-next'
import { usePortfolioStore } from '@/stores/portfolioStore'

const store = usePortfolioStore()
const isNotificationsOpen = ref(false)
const notifications = ref([
  {
    id: 1,
    title: 'Portfolio actualizado',
    description: 'Ya tenés disponibles los últimos valores de tus activos.',
    time: 'Hace 5 min',
    read: false,
  },
  {
    id: 2,
    title: 'Nueva oportunidad',
    description: 'Hay movimientos relevantes en activos de tu watchlist.',
    time: 'Hoy',
    read: false,
  },
  {
    id: 3,
    title: 'Resumen semanal listo',
    description: 'Revisá el rendimiento consolidado de tus portafolios.',
    time: 'Ayer',
    read: true,
  },
])

const unreadCount = computed(() => notifications.value.filter((notification) => !notification.read).length)

const markAllAsRead = () => {
  notifications.value = notifications.value.map((notification) => ({ ...notification, read: true }))
}
</script>

<style scoped>
.header-nav {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1.25rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.portfolio-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.portfolio-subtitle {
  font-size: 13px;
  color: var(--muted-foreground);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: var(--radius-md);
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.btn-add:hover {
  opacity: 0.88;
}

.notifications-wrapper {
  position: relative;
}

.btn-icon-only {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.notification-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--destructive);
  color: var(--destructive-foreground);
  font-size: 10px;
  font-weight: 700;
}

.btn-icon-only:hover {
  color: var(--foreground);
  background: var(--muted);
}

.notifications-popover {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  z-index: 250;
  width: min(340px, calc(100vw - 32px));
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--popover);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
}

.notifications-popover header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.notifications-popover header button {
  border: none;
  background: transparent;
  color: var(--primary);
  cursor: pointer;
  font-size: 12px;
}

.notification-item {
  display: grid;
  grid-template-columns: 8px 1fr;
  gap: 10px;
  padding: 12px 0;
  border-top: 1px solid var(--border);
}

.notification-status {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--muted-foreground);
}

.notification-item.unread .notification-status {
  background: var(--primary);
}

.notification-item strong,
.notification-item p {
  margin: 0;
}

.notification-item p,
.notification-item small {
  color: var(--muted-foreground);
  font-size: 12px;
}

.notification-item p {
  margin-top: 4px;
}

@keyframes ring {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-12deg);
  }
  45% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(5deg);
  }
  90% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.btn-icon-only:hover :deep(svg) {
  animation: ring 0.6s ease;
  transform-origin: top center;
}
</style>
