<template>
    <div class="app-charts">
        <LineChart />
    </div>
</template>

<script setup>
import LineChart from './LineChart.vue';
</script>

<style scoped>
.app-charts{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>