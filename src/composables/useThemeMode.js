import { computed, ref, watch } from 'vue'

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

const toggleThemeMode = () => {
  themeMode.value = isDarkMode.value ? 'light' : 'dark'
}

export const useThemeMode = () => ({
  themeMode,
  isDarkMode,
  themeLabel,
  toggleThemeMode,
})
