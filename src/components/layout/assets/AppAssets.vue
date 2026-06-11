<template>
    <section class="app-assets">
        <AssetsHeader :filtro-activo="filtroActivo" @cambiar-filtro="filtroActivo = $event" />
        <AssetsTable :activos="activosFiltrados" />
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import AssetsHeader from '@/components/layout/assets/AssetsHeader.vue'
import AssetsTable from '@/components/layout/assets/AssetsTable.vue'

const filtroActivo = ref('todo')

const activos = [
{
    id: 1,
    ticker: 'BTC',
    nombre: 'Bitcoin',
    tipo: 'Crypto',
    categoria: 'Digital Asset',
    precio: 68240.00,
    variacion24h: 2.14,
    cantidad: 0.45,
    montoActual: 30708.00,
    ppc: 52000.00,
    gananciaPerdida: 7308.00,
    porcentaje: 31.22,
},
{
    id: 2,
    ticker: 'ETH',
    nombre: 'Ethereum',
    tipo: 'Crypto',
    categoria: 'Digital Asset',
    precio: 3820.00,
    variacion24h: 1.88,
    cantidad: 10,
    montoActual: 38200.00,
    ppc: 2900.00,
    gananciaPerdida: 9200.00,
    porcentaje: 31.72,
},
{
    id: 3,
    ticker: 'MSF',
    nombre: 'Microsoft Corp',
    tipo: 'Acción',
    categoria: 'Technology',
    precio: 412.50,
    variacion24h: 0.84,
    cantidad: 45,
    montoActual: 18562.50,
    ppc: 380.00,
    gananciaPerdida: 1462.50,
    porcentaje: 8.55,
},
{
    id: 4,
    ticker: 'AAP',
    nombre: 'Apple Inc',
    tipo: 'Acción',
    categoria: 'ConsumerTech',
    precio: 189.40,
    variacion24h: -0.31,
    cantidad: 78,
    montoActual: 14773.20,
    ppc: 178.00,
    gananciaPerdida: 889.20,
    porcentaje: 6.40,
},
{
    id: 5,
    ticker: 'NVD',
    nombre: 'NVIDIA Corp',
    tipo: 'Acción',
    categoria: 'Semiconductors',
    precio: 875.20,
    variacion24h: 1.42,
    cantidad: 12,
    montoActual: 10502.40,
    ppc: 650.00,
    gananciaPerdida: 2702.40,
    porcentaje: 34.65,
},
{
    id: 6,
    ticker: 'AMZ',
    nombre: 'Amazon.com Inc',
    tipo: 'Acción',
    categoria: 'Consumer Cyclical',
    precio: 183.60,
    variacion24h: 0.24,
    cantidad: 35,
    montoActual: 6426.00,
    ppc: 165.00,
    gananciaPerdida: 651.00,
    porcentaje: 3.94,
}]

const activosFiltrados = computed(() => {
    if (filtroActivo.value === 'todo') return activos
    if (filtroActivo.value === 'crypto') return activos.filter(a => a.tipo === 'Crypto')
    if (filtroActivo.value === 'acciones') return activos.filter(a => a.tipo === 'Acción')
    return activos
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