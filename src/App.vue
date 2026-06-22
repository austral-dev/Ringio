<template>
  <LoginPanel v-if="!isAuthenticated" @login="isAuthenticated = true" />

  <div v-else class="app-layout">
    <AppSidebar />
    <div class="main-header">
      <AppHeader />
<<<<<<< HEAD
      <main class="main-content">Contenido</main>
=======
      <main class="main-content">
        <MyPortfoliosPanel />
        <AppCharts />
        <AppAssets />
      </main>
>>>>>>> main
    </div>
  </div>
  <AssetSearchModal />
</template>

<script setup>
<<<<<<< HEAD
import AppSidebar from "@/components/layout/sidebar/AppSidebar.vue";
import AppHeader from "@/components/layout/header/AppHeader.vue";
import AssetSearchModal from "@/components/transaction/AssetSearchModal.vue";
=======
import { ref } from 'vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import MyPortfoliosPanel from '@/components/portfolio/MyPortfoliosPanel.vue'
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import AppHeader from '@/components/layout/header/AppHeader.vue'

const isAuthenticated = ref(false)
import AppCharts from '@/components/layout/charts/AppCharts.vue';
import AppAssets from '@/components/layout/assets/AppAssets.vue'
import { supabase } from '@/lib/supabase.js'
>>>>>>> main
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
<<<<<<< HEAD
=======

@media (max-width: 768px) {
  .main-content {
    padding: 76px 16px 20px;
  }
}
>>>>>>> main
</style>
