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
import { ref } from 'vue';

Chart.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

function getGradient(ctx, chartArea) {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(62, 207, 142, 0.01)');
    gradient.addColorStop(1, 'rgba(62, 207, 142, 0.3)');

    return gradient;
}

const chartData = ref({
    labels: [ 'January', 'February', 'March'],
    datasets: [
        {
            label: 'Evolución del valor',
            backgroundColor: (context) => {
                const chart = context.chart;
                const {ctx, chartArea} = chart;

                if (!chartArea) {
                // This case happens on initial chart load
                return;
                }
                return getGradient(ctx, chartArea);
            },
            data: [40, 20, 12],
            fill: true,
            borderColor: '#3ecf8e',
            tension: 0.1,
            pointStyle: false
        }
    ]
});

const chartOptions = ref({
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
            color: 'rgba(148, 148, 148, 0.2)',
            tickColor: 'none'
        },
        ticks: {
            callback: (value) => `$${value}`
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
    width: 50%;
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