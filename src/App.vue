<template>
  <LoginPanel v-if="!isAuthenticated" @login="handleLogin" />

  <template v-else>
    <div v-if="pageLoading" class="dashboard-loading-overlay">
      <AppLoader />
    </div>

    <div class="app-layout">
      <AppSidebar />
      <div class="main-header">
        <AppHeader />
        <main class="main-content">
          <MyPortfoliosPanel />
          <AppCharts />
          <AppAssets />
        </main>
      </div>
    </div>
  </template>

  <AssetSearchModal />
  <UserProfilePanel />
</template>

<script setup>
import { ref } from 'vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import AppHeader from '@/components/layout/header/AppHeader.vue'
import MyPortfoliosPanel from '@/components/portfolio/MyPortfoliosPanel.vue'
import AppCharts from '@/components/layout/charts/AppCharts.vue'
import AppAssets from '@/components/layout/assets/AppAssets.vue'
import AssetSearchModal from '@/components/transaction/AssetSearchModal.vue'
import UserProfilePanel from '@/components/profile/UserProfilePanel.vue'
import AppLoader from '@/components/AppLoader.vue'

const isAuthenticated = ref(false)
const pageLoading = ref(true)

const handleLogin = async () => {
  isAuthenticated.value = true
  pageLoading.value = true
  
  try {
    await new Promise((resolve) => setTimeout(resolve, 2500))
  } catch (err) {
    console.error('Error al procesar la entrada al dashboard:', err)
  } finally {
    pageLoading.value = false
  }
}
</script>

<style scoped>
.dashboard-loading-overlay {
  position: fixed; 
  inset: 0;
  background-color: #0b0f19; 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999; 
}

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