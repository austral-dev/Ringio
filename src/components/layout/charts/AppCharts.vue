<template>
    <div class="app-charts">
        <LineChart />
        <DoughnutChart />
    </div>
</template>

<script setup>
import LineChart from './LineChart.vue';
import DoughnutChart from './DoughnutChart.vue';
</script>

<style scoped>
.app-charts{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>