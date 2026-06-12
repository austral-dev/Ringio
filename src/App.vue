<template>
  <LoginPanel v-if="!isAuthenticated" @login="isAuthenticated = true" />

  <div v-else class="app-layout">
    <AppSidebar />
    <div class="main-header">
      <AppHeader />
      <main class="main-content">
        <MyPortfoliosPanel />
        <AssetsPanel />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import MyPortfoliosPanel from '@/components/portfolio/MyPortfoliosPanel.vue'
import AssetsPanel from '@/components/assets/AssetsPanel.vue'
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import AppHeader from '@/components/layout/header/AppHeader.vue'

const isAuthenticated = ref(false)
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
}

.main-header {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 76px 16px 20px;
  }
}
</style>
