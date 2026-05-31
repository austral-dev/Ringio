<template>
    <div class="stat-cards">
        <div class="stat-card" v-for="card in cards" :key="card.id">
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value" :class="{ positive: card.positive }">{{ card.value }}</span>
            <span class="stat-change" :class="card.positive ? 'positive' : 'muted'">
                <component :is="card.icon" :size="13" />
                {{ card.sub }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { TrendingUp, Layers } from 'lucide-vue-next'

const cards = [
{
    id: 'valor',
    label: 'VALOR TOTAL',
    value: '$127,431',
    sub: '+2.28% hoy',
    positive: true,
    icon: TrendingUp,
},
{
    id: 'beneficio',
    label: 'BENEFICIO HISTÓRICO',
    value: '+$28,431',
    sub: '+28.7% desde inicio',
    positive: true,
    icon: TrendingUp,
},
{
    id: 'posiciones',
    label: 'POSICIONES',
    value: '6',
    sub: 'acciones · criptos',
    positive: null,
    icon: Layers,
},
]
</script>

<style scoped>
.stat-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    padding-bottom: 1.25rem;
}

.stat-card {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.stat-label {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--muted-foreground);
    text-transform: uppercase;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--foreground);
    line-height: 1.2;
}

.stat-value.positive {
    color: var(--primary);
}

.stat-change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.8125rem;
    font-weight: 500;
}

.stat-change.positive {
    color: var(--primary);
}

.stat-change.muted {
    color: var(--muted-foreground);
}
</style>