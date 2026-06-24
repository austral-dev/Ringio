<template>
  <LoginPanel v-if="!isAuthenticated" @login="isAuthenticated = true" />

  <div v-else class="app-layout">
    <AppSidebar
      :user-profile="userProfile"
      :active-view="activeView"
      @open-dashboard="activeView = 'dashboard'"
      @open-profile="activeView = 'profile'"
    />
    <div class="main-header">
      <AppHeader />
      <main class="main-content">
        <UserProfilePanel v-if="activeView === 'profile'" @profile-updated="userProfile = $event" />
        <MyPortfoliosPanel v-else />
      </main>
    </div>
  </div>
  <AssetSearchModal />
</template>

<script setup>
import { ref } from 'vue'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import UserProfilePanel from '@/components/profile/UserProfilePanel.vue'
import MyPortfoliosPanel from '@/components/portfolio/MyPortfoliosPanel.vue'
import AppSidebar from '@/components/layout/sidebar/AppSidebar.vue'
import AppHeader from '@/components/layout/header/AppHeader.vue'
import { defaultProfile } from '@/services/userProfileService.js'

const isAuthenticated = ref(false)
const activeView = ref('dashboard')
const userProfile = ref({ ...defaultProfile })
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

@media (max-width: 768px) {
  .main-content {
    padding: 76px 16px 20px;
  }
}
</style>
