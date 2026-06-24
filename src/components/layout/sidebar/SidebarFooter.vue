<template>
  <div class="footer">
    <button class="user" type="button" @click="$emit('open-profile')">
      <div class="avatar" :style="{ background: userProfile.avatarColor }">
        <span class="avatar-letter">{{ initials }}</span>
      </div>

      <div class="user-details">
        <span class="user-name">{{ displayName }}</span>
        <span class="user-plan">{{ userProfile.plan }}</span>
      </div>
    </button>
    <button class="settings-button" type="button" aria-label="Editar perfil" @click="$emit('open-profile')">
      <Settings class="settings-icon" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Settings } from 'lucide-vue-next'

const props = defineProps({
  userProfile: {
    type: Object,
    required: true,
  },
})

defineEmits(['open-profile'])

const displayName = computed(() => `${props.userProfile.firstName} ${props.userProfile.lastName}`.trim() || 'Usuario')
const initials = computed(() => {
  const firstInitial = props.userProfile.firstName?.charAt(0) ?? ''
  const lastInitial = props.userProfile.lastName?.charAt(0) ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U'
})
</script>

<style scoped>
.footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--sidebar-border);
}

.user {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-family: var(--font);
  padding: 0;
  text-align: left;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-letter {
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
}
.user-details {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-plan {
  font-size: 11px;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.settings-button {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
}

.settings-button:hover {
  background: var(--secondary);
}

.settings-icon {
  width: 16px;
  height: 16px;
  color: var(--muted-foreground);
  transition: color 0.15s;
}

.settings-button:hover .settings-icon,
.user:hover + .settings-button .settings-icon {
  color: var(--foreground);
}
</style>
