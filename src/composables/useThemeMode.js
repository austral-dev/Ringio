import { computed, ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { currentUser } from '@/composables/useAuth.js'

const STORAGE_KEY = 'ringio-theme-mode'
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark'
  return window.localStorage.getItem(STORAGE_KEY) || 'dark'
}

const themeMode = ref(getInitialTheme())
const isDarkMode = computed(() => themeMode.value === 'dark')
const themeLabel = computed(() => (isDarkMode.value ? 'Modo oscuro' : 'Modo claro'))

const applyThemeMode = (mode) => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', mode === 'dark')
  document.documentElement.classList.toggle('light', mode === 'light')
}

watch(
  themeMode,
  (mode) => {
    applyThemeMode(mode)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode)
    }
  },
  { immediate: true }
)

const saveThemeToDatabase = async (mode) => {
  const userId = currentUser.value?.id
  if (!userId) return

  try {
    await supabase
      .from('Config')
      .upsert({
        user_id: userId,
        tema: mode === 'dark'
      })
  } catch (err) {
    console.error('Error al guardar el tema en la BD:', err)
  }
}

const fetchSavedTheme = async () => {
  const userId = currentUser.value?.id
  if (!userId) return

  try {
    const { data, error } = await supabase
      .from('Config')
      .select('tema')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    if (data) {
      themeMode.value = data.tema ? 'dark' : 'light'
    }
  } catch (err) {
    console.error('Error al obtener el tema de la BD:', err)
  }
}

watch(currentUser, (user) => {
  if (user) fetchSavedTheme()
})

const toggleThemeMode = async () => {
  const nextMode = isDarkMode.value ? 'light' : 'dark'
  themeMode.value = nextMode
  await saveThemeToDatabase(nextMode)
}

export const useThemeMode = () => ({
  themeMode,
  isDarkMode,
  themeLabel,
  toggleThemeMode,
  fetchSavedTheme
})