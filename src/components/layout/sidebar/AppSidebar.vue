<template>
  <div>
    <button class="hamburger" @click="isOpen = !isOpen">☰</button>
    <div v-if="isOpen" class="overlay" @click="isOpen = false" />

    <aside class="sidebar" :class="{ open: isOpen }">
      <SidebarLogo />
      <SidebarPortfolioList />
      <SidebarNav />
      <SidebarFooter />
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SidebarPortfolioList from '@/components/layout/sidebar/SidebarPortfolioList.vue'
import SidebarNav from '@/components/layout/sidebar/SidebarNav.vue'
import SidebarLogo from '@/components/layout/sidebar/SidebarLogo.vue'
import SidebarFooter from '@/components/layout/sidebar/SidebarFooter.vue'

const isOpen = ref(false)
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-width: 220px;
  background-color: var(--sidebar);
  border-right: 1px solid var(--sidebar-border);
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--sidebar-border);
}

.logo-img {
  width: 36px;
  height: 36px;
}

.logo-name {
  font-size: 18px;
  font-weight: 500;
  color: var(--foreground);
}

.hamburger {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 200;
  background: var(--secondary);
  border: 1px solid var(--border);
  color: var(--foreground);
  font-size: 18px;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .overlay {
    display: block;
  }

  .sidebar {
    position: fixed;
    left: -220px;
    top: 0;
    z-index: 100;
    transition: left 0.25s ease;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>