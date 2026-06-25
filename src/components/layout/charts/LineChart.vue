<template>
    <div class="line-chart-container">
        <div class="line-chart-titles">
            <h2 class="history-title">Historia</h2>
            <span class="history-subtitle">Evolución del valor</span>
        </div>
        <Line class="line-chart" :data="chartData" :options="chartOptions"/>
    </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler} from 'chart.js';
import { ref, computed, watch } from 'vue';
import { supabase } from '@/lib/supabase.js'
import { storeToRefs } from 'pinia'
import { usePortfolioStore } from '@/stores/portfolioStore.js'

Chart.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

const store = usePortfolioStore()
const { activePortfolioId } = storeToRefs(store)

function getGradient(ctx, chartArea) {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(62, 207, 142, 0.01)');
    gradient.addColorStop(1, 'rgba(62, 207, 142, 0.3)');
    return gradient;
}


const historial = ref([])

const fetchTransacciones = async (portfolioId) => {
    const { data } = await supabase
        .from('Transaccion')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .order('fecha', { ascending: true })
    return data ?? []
}

const fetchActivos = async (activoIds) => {
    const { data } = await supabase
        .from('Activo')
        .select('id, valor')
        .in('id', activoIds)
    return data ?? []
}

const calcularPuntos = (transacciones, preciosPorId) => {
    const fechasUnicas = [...new Set(transacciones.map(tx => tx.fecha))]

    return fechasUnicas.map(fecha => {
        const txsHastaFecha = transacciones.filter(tx => tx.fecha <= fecha)
        const cantidades = {}

        for (const tx of txsHastaFecha) {
            if (!cantidades[tx.activo_id]) cantidades[tx.activo_id] = 0
            if (tx.tipo === 'compra' || tx.tipo === 'rendimiento') {
                cantidades[tx.activo_id] += tx.cantidad
            } else if (tx.tipo === 'venta') {
                cantidades[tx.activo_id] -= tx.cantidad
            }
        }

        const valorTotal = Object.entries(cantidades).reduce((sum, [id, cantidad]) => {
            return sum + (cantidad * (preciosPorId[id] ?? 0))
        }, 0)

        return { fecha, valorTotal }
    })
}

const fetchHistorial = async (portfolioId) => {
    if (!portfolioId) { historial.value = []; return }

    const transacciones = await fetchTransacciones(portfolioId)
    if (transacciones.length === 0) { historial.value = []; return }

    const activoIds = [...new Set(transacciones.map(tx => tx.activo_id))]
    const activos = await fetchActivos(activoIds)
    const preciosPorId = Object.fromEntries(activos.map(a => [a.id, a.valor]))

    historial.value = calcularPuntos(transacciones, preciosPorId)
}

watch(activePortfolioId, fetchHistorial, { immediate: true })

const chartData = computed(() => ({
    labels: historial.value.map(p => p.fecha),
    datasets: [{
        label: 'Evolución del valor',
        backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return;
            return getGradient(ctx, chartArea);
        },
        data: historial.value.map(p => p.valorTotal),
        fill: true,
        borderColor: '#3ecf8e',
        tension: 0.1,
        pointStyle: 'circle',
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3ecf8e',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
    }]
}))

const chartOptions = ref({
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            enabled: true,
            callbacks: {
                label: (context) => ` $${context.parsed.y.toLocaleString()}`
            }
        }
    },
    scales: {
        x: {
            ticks: {
                callback: function(value, index) {
                    const fecha = historial.value[index]?.fecha
                    if (!fecha) return ''
                    const [year, month] = fecha.split('-')
                    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
                    return `${meses[parseInt(month) - 1]} ${year}`
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(148, 148, 148, 0.2)',
                tickColor: 'none'
            },
            ticks: {
                callback: (value) => `$${value.toLocaleString()}`
            }
        },
    }
})
</script>

<style scoped>
.history-subtitle{
    color: var(--muted-foreground);
}

.line-chart-container{
    width: 60%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.line-chart{
    width: 100%;
    height: auto;
}
</style>