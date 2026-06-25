<template>
    <div class="assets-header">
        <div class="assets-title">
            <h3 class="title">Activos</h3>
        </div>
        <div class="assets-filters">
            <button v-for="filtro in filtros":key="filtro.value" class="filter-btn":class="{ active: filtroActivo === filtro.value }" @click="$emit('cambiar-filtro', filtro.value)">
                {{ filtro.label }}
            </button>
            <button class="btn-agregar" @click="store.openTransactionModal()">
                <Plus :size="14" />
                Agregar
            </button>
        </div>
    </div>
</template>

<script setup>
import { Plus } from 'lucide-vue-next'
import { usePortfolioStore } from '@/stores/portfolioStore'

const store = usePortfolioStore()

defineProps({
    filtroActivo: {
    type: String,
    default: 'todo'
    }
})

defineEmits(['cambiar-filtro'])

const filtros = [
    { label: 'Todo', value: 'todo' },
    { label: 'Criptomonedas', value: 'crypto' },
    { label: 'Acciones', value: 'acciones' },
]
</script>

<style scoped>
.assets-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--foreground);
    margin: 0;
}

.assets-filters {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.filter-btn {
    background: transparent;
    border: none;
    color: var(--muted-foreground);
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
}

.filter-btn:hover {
    color: var(--foreground);
    background: var(--secondary);
}

.filter-btn.active {
    color: var(--foreground);
    font-weight: 600;
}

.btn-agregar {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--muted-foreground);
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    cursor: pointer;
    transition: color 0.15s ease, background 0.15s ease;
    margin-left: 0.5rem;
}

.btn-agregar:hover {
    color: var(--foreground);
    background: var(--secondary);
}
</style>
