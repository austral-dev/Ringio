<template>
  <div class="app-layout">
    <AppSidebar />
    <div class="main-header">
      <AppHeader />
      <main class="main-content">
        <AppContent />
        <AppAssets />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import AppHeader from '@/components/layout/header/AppHeader.vue'
import AppContent from '@/components/layout/content/AppContent.vue';
import AppAssets from '@/components/layout/assets/AppAssets.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
}

.main-header {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}
</style>