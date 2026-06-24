<template>
    <section class="app-assets">
        <AssetsHeader :filtro-activo="filtroActivo" @cambiar-filtro="filtroActivo = $event" />
        <AssetsTable :activos="activosFiltrados" />
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import AssetsHeader from '@/components/layout/assets/AssetsHeader.vue'
import AssetsTable from '@/components/layout/assets/AssetsTable.vue'
import { assets, fetchAssets } from '@/composables/useAssets.js'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolioStore.js'

const store = usePortfolioStore()
const { activePortfolioId } = storeToRefs(store)

const filtroActivo = ref('todo')

watch(activePortfolioId, (id) => { fetchAssets(id) }, { immediate: true })

const activosFiltrados = computed(() => {
    if (filtroActivo.value === 'todo') return assets.value
    if (filtroActivo.value === 'crypto') return assets.value.filter(a => a.tipo === 'Crypto')
    if (filtroActivo.value === 'acciones') return assets.value.filter(a => a.tipo === 'Acción')
    return assets.value
})
</script>

<style scoped>
.app-assets {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}
</style>