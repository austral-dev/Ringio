import { computed, reactive, ref, watch } from 'vue'
import { currentUser } from '@/composables/useAuth.js'

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
  preferences: { ...defaultPreferences },
})

const isProfilePanelOpen = ref(false)

const userInitial = computed(() => profile.displayName.trim().charAt(0).toUpperCase() || 'R')
const profileSubtitle = computed(() => `${profile.plan} · ${profile.role}`)

const normalizeUserProfile = (user) => ({
  displayName: user?.nombre || user?.name || user?.displayName || user?.email?.split('@')[0] || 'Usuario Ringio',
  email: user?.email || '',
  role: user?.role || 'Inversor',
  plan: user?.plan || 'Pro',
  phone: user?.telefono || user?.phone || '',
  location: user?.ubicacion || user?.location || '',
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
  profile.preferences = { ...defaultPreferences, ...nextProfile.preferences }
}

watch(
  currentUser,
  (user) => {
    if (!user) return
    hydrateProfile(normalizeUserProfile(user))
  },
  { immediate: true }
)

const openProfilePanel = () => {
  isProfilePanelOpen.value = true
}

const closeProfilePanel = () => {
  isProfilePanelOpen.value = false
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

export const useUserProfile = () => ({
  profile,
  userInitial,
  profileSubtitle,
  isProfilePanelOpen,
  openProfilePanel,
  closeProfilePanel,
  updateProfile,
})
