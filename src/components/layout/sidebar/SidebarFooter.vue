<template>
  <div class="footer">
    <div class="user">
      <div class="avatar">
      {{currentUser?.nombre?.charAt(0)?.toUpperCase() || "?"}}
    </div>
      
      <div class="user-details">
        <span class="user-name">{{ currentUser?.nombre }}</span>
        <span class="user-plan">{{ currentUser?.plan }}</span>
      </div>
    </div>
    <button class="settings-button" type="button" aria-label="Abrir perfil" @click="openProfilePanel">
      <Settings class="settings-icon" />
    </button>
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next'
import { currentUser } from "@/composables/useAuth"
import { useUserProfile } from '@/composables/useUserProfile.js'

const { profile, userInitial, profileSubtitle, openProfilePanel } = useUserProfile()
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

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-letter {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
}
.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  line-height: 1.15;
}

.user-name,
.user-plan {
  display: block;
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

.settings-button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
}

.settings-button:hover {
  border-color: var(--border);
  background: var(--secondary);
}

.settings-icon {
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.15s;
}

.settings-button:hover .settings-icon {
  color: var(--foreground);
}
</style>