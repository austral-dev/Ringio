<template>
    <div class="dn-chart-container">
        <div class="dn-chart-titles">
            <h2 class="history-title">Asignación</h2>
            <span class="history-subtitle">Distribución de activos</span>
        </div>
        <Doughnut class="dn-chart" :data="chartData" :options="chartOptions"/>
    </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { ref } from 'vue';

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
        position: 'bottom',
        align: 'center',
        labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
                size: 18,
            },
        },
      },
    },
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
</style>