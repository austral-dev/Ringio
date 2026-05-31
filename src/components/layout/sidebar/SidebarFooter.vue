<template>
  <div class="footer">
    <div class="user">
      <div class="avatar">
        <span class="avatar-letter">M</span>
      </div>
      
      <div class="user-details">
        <span class="user-name">Matías</span>
        <span class="user-plan">Pro · Inversor</span>
      </div>
    </div>
    <Settings class="settings-icon" />
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next'
</script>

<style scoped>
.footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--sidebar-border);
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--muted);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-letter {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
}

.user-plan {
  font-size: 11px;
  color: var(--muted-foreground);
}

.settings-icon {
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.15s;
}

.settings-icon:hover {
  color: var(--foreground);
}
</style>