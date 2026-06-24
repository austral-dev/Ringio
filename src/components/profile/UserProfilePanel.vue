<template>
  <section class="profile-panel" aria-labelledby="profile-title">
    <div class="profile-hero">
      <div class="profile-avatar" :style="{ background: form.avatarColor }">
        {{ initials }}
      </div>

      <div class="profile-heading">
        <span class="eyebrow">Perfil de usuario</span>
        <h2 id="profile-title">{{ fullName || 'Completá tus datos' }}</h2>
        <p>Actualizá tus datos personales y preferencias. El formulario ya está preparado para guardarse contra una API.</p>
      </div>

      <button class="secondary-action" type="button" @click="resetForm">
        <RotateCcw :size="16" />
        Deshacer
      </button>
    </div>

    <form class="profile-card" @submit.prevent="saveProfile">
      <div class="card-header">
        <div>
          <h3>Datos personales</h3>
          <p>Estos datos se pueden persistir en la base de datos desde el servicio de perfil.</p>
        </div>
        <span class="status-pill" :class="statusType">{{ statusMessage }}</span>
      </div>

      <div class="form-grid">
        <label class="field-group" for="first-name">
          Nombre
          <input id="first-name" v-model.trim="form.firstName" type="text" autocomplete="given-name" required />
        </label>

        <label class="field-group" for="last-name">
          Apellido
          <input id="last-name" v-model.trim="form.lastName" type="text" autocomplete="family-name" required />
        </label>

        <label class="field-group" for="email">
          Email
          <input id="email" v-model.trim="form.email" type="email" autocomplete="email" required />
        </label>

        <label class="field-group" for="phone">
          Teléfono
          <input id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel" />
        </label>

        <label class="field-group" for="country">
          País
          <input id="country" v-model.trim="form.country" type="text" autocomplete="country-name" />
        </label>

        <label class="field-group" for="city">
          Ciudad
          <input id="city" v-model.trim="form.city" type="text" autocomplete="address-level2" />
        </label>

        <label class="field-group" for="investor-type">
          Perfil inversor
          <select id="investor-type" v-model="form.investorType">
            <option>Inversor conservador</option>
            <option>Inversor moderado</option>
            <option>Inversor agresivo</option>
            <option>Trader activo</option>
          </select>
        </label>

        <label class="field-group" for="plan">
          Plan
          <select id="plan" v-model="form.plan">
            <option>Free · Explorador</option>
            <option>Pro · Inversor</option>
            <option>Team · Portfolio Manager</option>
          </select>
        </label>

        <label class="field-group color-field" for="avatar-color">
          Color avatar
          <input id="avatar-color" v-model="form.avatarColor" type="color" />
        </label>

        <label class="field-group full-width" for="bio">
          Bio
          <textarea id="bio" v-model.trim="form.bio" rows="4" maxlength="180" />
          <small>{{ form.bio.length }}/180 caracteres</small>
        </label>
      </div>

      <div class="form-actions">
        <button class="ghost-action" type="button" @click="loadProfile">
          <RefreshCw :size="16" />
          Recargar
        </button>
        <button class="primary-action" type="submit" :disabled="isSaving || !canSave">
          <Save :size="16" />
          {{ isSaving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { RefreshCw, RotateCcw, Save } from 'lucide-vue-next'
import { defaultProfile, fetchUserProfile, updateUserProfile } from '@/services/userProfileService.js'

const emit = defineEmits(['profile-updated'])

const savedProfile = ref({ ...defaultProfile })
const isSaving = ref(false)
const statusType = ref('muted')
const statusMessage = ref('Sin cambios')

const form = reactive({ ...defaultProfile })

const fullName = computed(() => `${form.firstName} ${form.lastName}`.trim())
const initials = computed(() => {
  const firstInitial = form.firstName?.charAt(0) ?? ''
  const lastInitial = form.lastName?.charAt(0) ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase() || 'U'
})
const canSave = computed(() => form.firstName.length > 0 && form.lastName.length > 0 && form.email.length > 0)

onMounted(loadProfile)

function applyProfile(profile) {
  Object.assign(form, profile)
  savedProfile.value = { ...profile }
  emit('profile-updated', { ...profile })
}

async function loadProfile() {
  statusType.value = 'muted'
  statusMessage.value = 'Cargando...'

  try {
    const profile = await fetchUserProfile(savedProfile.value.id)
    applyProfile(profile)
    statusMessage.value = 'Perfil cargado'
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = error.message
  }
}

function resetForm() {
  Object.assign(form, savedProfile.value)
  statusType.value = 'muted'
  statusMessage.value = 'Cambios descartados'
}

async function saveProfile() {
  if (!canSave.value) return

  isSaving.value = true
  statusType.value = 'muted'
  statusMessage.value = 'Guardando...'

  try {
    const updatedProfile = await updateUserProfile({ ...form })
    applyProfile(updatedProfile)
    statusType.value = 'success'
    statusMessage.value = 'Cambios guardados'
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.profile-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.profile-hero,
.profile-card {
  border: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.016)), var(--card, var(--surface));
  border-radius: var(--radius-xl);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.22);
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 24px;
}

.profile-avatar {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.28);
  flex-shrink: 0;
}

.profile-heading {
  flex: 1;
  min-width: 0;
}

.eyebrow {
  color: var(--primary);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.profile-heading h2,
.card-header h3 {
  margin: 5px 0;
  font-weight: 800;
}

.profile-heading h2 {
  font-size: clamp(28px, 4vw, 42px);
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.profile-heading p,
.card-header p,
.field-group small {
  margin: 0;
  color: var(--muted-foreground);
  line-height: 1.65;
}

.profile-card {
  padding: 22px;
}

.card-header,
.form-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.card-header {
  margin-bottom: 20px;
}

.status-pill {
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.status-pill.muted {
  color: var(--muted-foreground);
  background: rgba(255, 255, 255, 0.05);
}

.status-pill.success {
  color: var(--primary);
  background: rgba(62, 207, 142, 0.1);
}

.status-pill.error {
  color: var(--destructive);
  background: rgba(255, 91, 91, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--foreground);
  font-size: 14px;
  font-weight: 700;
}

.field-group input,
.field-group select,
.field-group textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--input, rgba(255, 255, 255, 0.05));
  color: var(--foreground);
  font-family: var(--font);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.field-group input,
.field-group select {
  height: 44px;
  padding: 0 12px;
}

.field-group textarea {
  resize: vertical;
  padding: 12px;
}

.field-group input:focus,
.field-group select:focus,
.field-group textarea:focus {
  border-color: rgba(62, 207, 142, 0.52);
  box-shadow: 0 0 0 4px rgba(62, 207, 142, 0.08);
}

.field-group select option {
  background: var(--card);
  color: var(--foreground);
}

.color-field input {
  padding: 5px;
}

.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  margin-top: 22px;
}

.primary-action,
.secondary-action,
.ghost-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  cursor: pointer;
  font-family: var(--font);
  font-weight: 800;
  min-height: 42px;
  padding: 0 14px;
  transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
}

.primary-action {
  border-color: transparent;
  background: var(--primary);
  color: var(--primary-foreground);
}

.secondary-action,
.ghost-action {
  background: var(--secondary);
  color: var(--foreground);
}

.primary-action:not(:disabled):hover,
.secondary-action:hover,
.ghost-action:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.primary-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 820px) {
  .profile-hero,
  .card-header,
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
