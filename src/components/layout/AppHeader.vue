<template>
    <header class="app-header">
        <HeaderNav />
        <HeaderStatCards />
    </header>
</template>

<script setup>
import HeaderNav from './HeaderNav.vue'
import HeaderStatCards from './HeaderStatCards.vue'
</script>

<style scoped>
.app-header {
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
    padding: 20px 24px 0 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>