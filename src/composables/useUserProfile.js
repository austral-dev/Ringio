import { computed, reactive, ref, watch } from 'vue'
import { currentUser } from '@/composables/useAuth.js'
import { supabase } from '@/lib/supabase.js'

const defaultPreferences = {
  currency: 'USD',
  riskProfile: 'Moderado',
  notifications: true,
  weeklySummary: true,
}

const profile = reactive({
  displayName: 'Usuario Ringio',
  email: '',
  role: 'Inversor',
  plan: 'Pro',
  phone: '',
  location: '',
  avatarUrl: '',
  preferences: { ...defaultPreferences },
})

const isProfilePanelOpen = ref(false)
const avatarFileToUpload = ref(null)

const userInitial = computed(() => profile.displayName.trim().charAt(0).toUpperCase() || 'R')
const profileSubtitle = computed(() => `${profile.plan} · ${profile.role}`)

const normalizeUserProfile = (user) => ({
  displayName: user?.nombre || user?.name || user?.displayName || user?.email?.split('@')[0] || 'Usuario Ringio',
  email: user?.email || '',
  role: user?.role || 'Inversor',
  plan: user?.plan || 'Pro',
  phone: user?.telefono || user?.phone || '',
  location: user?.ubicacion || user?.location || '',
  avatarUrl: user?.avatar_url || user?.avatarUrl || user?.foto_perfil || user?.profile_photo_url || '',
  preferences: {
    currency: user?.currency || defaultPreferences.currency,
    riskProfile: user?.risk_profile || user?.riskProfile || defaultPreferences.riskProfile,
    notifications: user?.notifications ?? defaultPreferences.notifications,
    weeklySummary: user?.weekly_summary ?? user?.weeklySummary ?? defaultPreferences.weeklySummary,
  },
})

const hydrateProfile = (nextProfile) => {
  profile.displayName = nextProfile.displayName
  profile.email = nextProfile.email
  profile.role = nextProfile.role
  profile.plan = nextProfile.plan
  profile.phone = nextProfile.phone
  profile.location = nextProfile.location
  profile.avatarUrl = nextProfile.avatarUrl
  profile.preferences = { ...defaultPreferences, ...nextProfile.preferences }
}

watch(
  currentUser,
  async (user) => {
    if (!user) return
    
    const baseProfile = normalizeUserProfile(user)
    hydrateProfile(baseProfile)

    try {
      const { data: config } = await supabase
        .from('Config')
        .select('perfil_inversor, moneda, alertas, resumen, avatar_url')
        .eq('user_id', user.id)
        .single()

      if (config) {
        profile.avatarUrl = config.avatar_url || ''
        profile.preferences.riskProfile = config.perfil_inversor || defaultPreferences.riskProfile
        profile.preferences.currency = config.moneda || defaultPreferences.currency
        profile.preferences.notifications = config.alertas ?? defaultPreferences.notifications
        profile.preferences.weeklySummary = config.resumen ?? defaultPreferences.weeklySummary
      }
    } catch (err) {
      console.error('Error al complementar los datos de configuración:', err)
    }
  },
  { immediate: true }
)

const openProfilePanel = () => {
  isProfilePanelOpen.value = true
}

const closeProfilePanel = () => {
  isProfilePanelOpen.value = false
}

const setAvatarFileToUpload = (file) => {
  avatarFileToUpload.value = file
}

const clearAvatarFileToUpload = () => {
  avatarFileToUpload.value = null
}

const updateProfile = (nextProfile) => {
  hydrateProfile({
    ...profile,
    ...nextProfile,
    preferences: {
      ...profile.preferences,
      ...nextProfile.preferences,
    },
  })
}


const getAvatarUploadPayload = () => ({
  file: avatarFileToUpload.value,
  suggestedPath: avatarFileToUpload.value ? `users/${currentUser.value?.id ?? 'pending-user'}/avatar-${Date.now()}-${avatarFileToUpload.value.name}` : '',
  previewDataUrl: profile.avatarUrl,
})

const profileToDatabasePayload = () => ({
  nombre: profile.displayName,
  email: profile.email,
  telefono: profile.phone,
  ubicacion: profile.location,
  avatar_url: profile.avatarUrl,
  plan: profile.plan,
  role: profile.role,
  currency: profile.preferences.currency,
  risk_profile: profile.preferences.riskProfile,
  notifications: profile.preferences.notifications,
  weekly_summary: profile.preferences.weeklySummary,
})

export const useUserProfile = () => ({
  profile,
  userInitial,
  profileSubtitle,
  isProfilePanelOpen,
  openProfilePanel,
  closeProfilePanel,
  updateProfile,
  avatarFileToUpload,
  setAvatarFileToUpload,
  clearAvatarFileToUpload,
  getAvatarUploadPayload,
  profileToDatabasePayload,
})
