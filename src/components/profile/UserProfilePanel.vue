<template>
  <Teleport to="body">
    <div v-if="isProfilePanelOpen" class="profile-overlay" @click.self="closeProfilePanel">
      <aside class="profile-panel" aria-labelledby="profile-title">
        <header class="profile-header">
          <div>
            <span class="eyebrow">Perfil de usuario</span>
            <h2 id="profile-title">Tus datos y preferencias</h2>
            <p>Actualizá cómo querés ver Ringio dentro de la app.</p>
          </div>
          <button class="icon-button" type="button" aria-label="Cerrar perfil" @click="closeProfilePanel">
            <X :size="18" />
          </button>
        </header>

        <form class="profile-form" @submit.prevent="saveProfile">
          <section class="profile-card identity-card">
            <label class="avatar-upload" for="avatar-upload">
              <img v-if="draft.avatarUrl" :src="draft.avatarUrl" alt="Foto de perfil" />
              <span v-else>{{ userInitial }}</span>
              <small>Cambiar foto</small>
              <input id="avatar-upload" type="file" accept="image/*" @change="handleAvatarUpload" />
            </label>
            <div>
              <strong>{{ profile.displayName }}</strong>
              <span>{{ profileSubtitle }}</span>
            </div>
          </section>

          <section class="profile-card fields-grid">
            <label>
              Nombre visible
              <input v-model="draft.displayName" type="text" placeholder="Tu nombre" required />
            </label>
            <label>
              Email
              <input v-model="draft.email" type="email" placeholder="tu@email.com" />
            </label>
            <label>
              Teléfono
              <input v-model="draft.phone" type="tel" placeholder="+54 11 0000 0000" />
            </label>
            <label>
              Ubicación
              <input v-model="draft.location" type="text" placeholder="Buenos Aires, AR" />
            </label>
          </section>

          <section class="profile-card fields-grid">
            <label>
              Plan
              <select v-model="draft.plan">
                <option>Free</option>
                <option>Pro</option>
                <option>Premium</option>
              </select>
            </label>
            <label>
              Perfil inversor
              <select v-model="draft.preferences.riskProfile">
                <option>Conservador</option>
                <option>Moderado</option>
                <option>Agresivo</option>
              </select>
            </label>
            <label>
              Moneda principal
              <select v-model="draft.preferences.currency">
                <option>USD</option>
                <option>ARS</option>
                <option>EUR</option>
                <option>BRL</option>
              </select>
            </label>
          </section>

          <section class="profile-card options-card">
            <h3>Opciones</h3>
            <label class="toggle-row">
              <span>
                Alertas del portafolio
                <small>Recibir avisos cuando haya movimientos importantes.</small>
              </span>
              <input v-model="draft.preferences.notifications" type="checkbox" />
            </label>
            <label class="toggle-row">
              <span>
                Resumen semanal
                <small>Ver un digest de rendimiento y oportunidades.</small>
              </span>
              <input v-model="draft.preferences.weeklySummary" type="checkbox" />
            </label>
          </section>

          <footer class="profile-actions">
            <button class="secondary-button" type="button" @click="resetDraft">Restaurar</button>
            <button class="primary-button" type="submit">
              <Save :size="17" />
              Guardar cambios
            </button>
          </footer>
        </form>
      </aside>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { Save, X } from 'lucide-vue-next'
import { useUserProfile } from '@/composables/useUserProfile.js'

const { profile, userInitial, profileSubtitle, isProfilePanelOpen, closeProfilePanel, updateProfile, setAvatarFileToUpload } = useUserProfile()

const createDraft = () => ({
  displayName: profile.displayName,
  email: profile.email,
  phone: profile.phone,
  location: profile.location,
  avatarUrl: profile.avatarUrl,
  plan: profile.plan,
  preferences: { ...profile.preferences },
})

const draft = reactive(createDraft())

const resetDraft = () => {
  Object.assign(draft, createDraft())
}

const handleAvatarUpload = (event) => {
  const [file] = event.target.files
  if (!file) return

  setAvatarFileToUpload(file)

  const reader = new FileReader()
  reader.onload = () => {
    draft.avatarUrl = reader.result
  }
  reader.readAsDataURL(file)
}

const saveProfile = () => {
  updateProfile(draft)
  closeProfilePanel()
}

watch(isProfilePanelOpen, (isOpen) => {
  if (isOpen) resetDraft()
})
</script>

<style scoped>
.profile-overlay { position: fixed; inset: 0; z-index: 400; display: flex; justify-content: flex-end; background: rgba(0, 0, 0, 0.58); backdrop-filter: blur(8px); }
.profile-panel { width: min(520px, 100%); min-height: 100vh; padding: 28px; overflow-y: auto; background: var(--card); border-left: 1px solid var(--border); box-shadow: -28px 0 80px rgba(0, 0, 0, 0.36); }
.profile-header, .profile-actions, .identity-card, .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.eyebrow { color: var(--primary); font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.profile-header h2 { margin: 6px 0 4px; }
.profile-header p, .identity-card span, .toggle-row small { color: var(--muted-foreground); }
.icon-button, .secondary-button, .primary-button { border: 1px solid var(--border); border-radius: var(--radius-md); cursor: pointer; }
.icon-button { width: 38px; height: 38px; display: grid; place-items: center; background: var(--secondary); color: var(--foreground); }
.profile-form { display: grid; gap: 16px; margin-top: 24px; }
.profile-card { padding: 18px; border: 1px solid var(--border); border-radius: 20px; background: rgba(255, 255, 255, 0.035); }
.avatar-upload { position: relative; width: 64px; height: 64px; display: grid; place-items: center; flex-shrink: 0; border-radius: 20px; overflow: hidden; background: rgba(62, 207, 142, 0.12); border: 1px solid rgba(62, 207, 142, 0.28); color: var(--primary); font-weight: 800; font-size: 22px; cursor: pointer; }
.avatar-upload img { width: 100%; height: 100%; object-fit: cover; }
.avatar-upload small { position: absolute; left: 0; right: 0; bottom: 0; padding: 3px; background: rgba(0, 0, 0, 0.62); color: var(--foreground); font-size: 10px; text-align: center; }
.avatar-upload input { display: none; }
.avatar-preview { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 18px; background: rgba(62, 207, 142, 0.12); border: 1px solid rgba(62, 207, 142, 0.28); color: var(--primary); font-weight: 800; font-size: 22px; }
.fields-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
label { display: grid; gap: 8px; color: var(--foreground); font-size: 13px; }
input, select { width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--input-background); color: var(--foreground); padding: 11px 12px; }
.options-card h3 { margin: 0 0 12px; }
.toggle-row { padding: 12px 0; border-top: 1px solid var(--border); }
.toggle-row span { display: grid; gap: 3px; }
.toggle-row input { width: 18px; height: 18px; accent-color: var(--primary); }
.secondary-button, .primary-button { padding: 11px 14px; }
.secondary-button { background: transparent; color: var(--foreground); }
.primary-button { display: inline-flex; align-items: center; gap: 8px; background: var(--primary); color: var(--primary-foreground); }
@media (max-width: 560px) { .profile-panel { padding: 22px 16px; } .fields-grid { grid-template-columns: 1fr; } .profile-actions { align-items: stretch; flex-direction: column-reverse; } }
</style>
