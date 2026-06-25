<template>
    <div class="dn-chart-container">
        <div class="dn-chart-titles">
            <h2 class="history-title">Asignación</h2>
            <span class="history-subtitle">Distribución de activos</span>
        </div>
        <Doughnut class="dn-chart" :data="chartData" :options="chartOptions"/>
        <div class="chartData-list">
            <div v-for="item in sortedItems" :key="item.label" class="chartData-item" @click="toggleItem(item.label)" style="cursor: pointer">
                <div class="item-name">
                    <span class="item-dot" :style="{backgroundColor: item.color}" />
                    <span :style="{ textDecoration: hiddenItems.has(item.label) ? 'line-through' : 'none', opacity: hiddenItems.has(item.label) ? 0.4 : 1 }">{{ item.label }}</span>
                </div>
                <div class="item-value">
                    <span>{{ item.percentage }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { assets } from '@/composables/useAssets.js'
import { ref, computed, defineComponent } from 'vue';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'vue-chartjs'

const components = { Doughnut }
Chart.register(ArcElement, Tooltip, Legend);

const COLORES = ['#fe6b5b', '#9a7afe', '#3ece8d', '#60a4f9', '#f49d0b', '#1a1a29']


const hiddenItems = ref(new Set())

function toggleItem(label) {
    if (hiddenItems.value.has(label)) {
        hiddenItems.value.delete(label)
    } else {
        hiddenItems.value.add(label)
    }
    hiddenItems.value = new Set(hiddenItems.value)
}

const chartData = computed(() => {
    const total = assets.value.reduce((sum, a) => sum + a.montoActual, 0)
    const sorted = [...assets.value]
        .filter(a => !hiddenItems.value.has(a.ticker))
        .sort((a, b) => b.montoActual - a.montoActual)
    
    return {
        labels: sorted.map(a => a.ticker),
        datasets: [{
            label: 'Distribución de activos',
            data: sorted.map(a => parseFloat(((a.montoActual / total) * 100).toFixed(1))),
            backgroundColor: sorted.map((_, i) => COLORES[i % COLORES.length])
        }]
    }
})

const chartOptions = ref({
    responsive: true,
    plugins: {
        legend: {
        display: false
        },
    },
});

const sortedItems = computed(() => {
    const labels = chartData.value.labels;
    const values = chartData.value.datasets[0].data;
    const colors = chartData.value.datasets[0].backgroundColor;
    const total = values.reduce((acc, value) => acc + value, 0);
    
    const visible = labels.map((label, i) => ({
        label,
        value: values[i],
        percentage: values[i].toFixed(1),
        color: colors[i]
    }))

    const hidden = [...hiddenItems.value].map(label => ({
        label,
        value: 0,
        percentage: '0.0',
        color: '#555'
    }))

    return [...visible, ...hidden]
});
</script>

<style scoped>
.history-subtitle{
    color: var(--muted-foreground);
}

.dn-chart-container{
    width: 35%;
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    border: 1px solid var(--border);
    border-radius: 30px;
    background-color: var(--surface);
}

.chartData-list{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.chartData-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    font-size: large;
}

.item-name{
    display: flex;
    align-items: center;
    gap: 10px;
}

.item-dot{
    width: 15px;
    height: 15px;
    border-radius: 50%;
}

.item-value{
    font-weight: bold;
}
</style>