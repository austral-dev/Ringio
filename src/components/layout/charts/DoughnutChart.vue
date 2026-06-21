<template>
    <div class="dn-chart-container">
        <div class="dn-chart-titles">
            <h2 class="history-title">Asignación</h2>
            <span class="history-subtitle">Distribución de activos</span>
        </div>
        <Doughnut class="dn-chart" :data="chartData" :options="chartOptions"/>
        <div class="chartData-list">
            <div v-for="item in sortedItems" :key="item.label" class="chartData-item">
                <div class="item-name">
                    <span class="item-dot" :style="{backgroundColor: item.color}" />
                    <span>{{ item.label }}</span>
                </div>
                <div class="item-value">
                    <span>{{ item.percentage }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { ref, computed } from 'vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = ref({
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            label: 'Distribución de activos',
            data: [65, 15, 20],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ]
        }
    ]
});

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
    
    const sortedItems = labels.map((label, i) => ({
        label,
        value: values[i],
        percentage: ((values[i] / total) * 100).toFixed(1),
        color: colors[i]
    })).sort((a, b) => b.value - a.value);

    return sortedItems;
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