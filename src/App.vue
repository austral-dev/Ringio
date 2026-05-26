<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="main-content">
      Contenido
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './components/layout/AppSidebar.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>