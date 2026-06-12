<template>
    <div class="header-nav">
        <div class="header-title">
            <h1 class="portfolio-name">{{ portfolioName }}</h1>
            <span class="portfolio-subtitle">Vista general del portafolio</span>
        </div>
        <div class="header-actions">
            <button class="btn-add">
                <Plus :size="16" />
                Agregar Transacción
            </button>
            <button class="btn-icon-only" aria-label="Notificaciones">
                <Bell :size="18" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { Bell, Plus } from 'lucide-vue-next'
defineProps({
    portfolioName: {
        type: String,
        default: 'Tech & Growth'
    }
})


const BellIcon = { template: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>` }
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

.btn-icon-only {
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
    transition: color 0.15s ease, background 0.15s ease;
}

.btn-icon-only:hover {
    color: var(--foreground);
    background: var(--muted);
}

@keyframes ring {
    0%   { transform: rotate(0deg); }
    15%  { transform: rotate(15deg); }
    30%  { transform: rotate(-12deg); }
    45%  { transform: rotate(10deg); }
    60%  { transform: rotate(-8deg); }
    75%  { transform: rotate(5deg); }
    90%  { transform: rotate(-3deg); }
    100% { transform: rotate(0deg); }
}

.btn-icon-only:hover :deep(svg) {
    animation: ring 0.6s ease;
    transform-origin: top center;
}

</style>