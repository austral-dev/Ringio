const STORAGE_KEY = 'ringio:user-profile'

const defaultProfile = {
  id: 'demo-user',
  firstName: 'Matías',
  lastName: 'García',
  email: 'matias@ringio.app',
  phone: '+54 11 5555-0198',
  country: 'Argentina',
  city: 'Buenos Aires',
  investorType: 'Inversor moderado',
  plan: 'Pro · Inversor',
  avatarColor: '#9B7AFF',
  bio: 'Inversor enfocado en crecimiento, tecnología y diversificación de largo plazo.',
}

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
}

function getStoredProfile() {
  const storedProfile = window.localStorage.getItem(STORAGE_KEY)
  return storedProfile ? { ...defaultProfile, ...JSON.parse(storedProfile) } : defaultProfile
}

function setStoredProfile(profile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export async function fetchUserProfile(userId = defaultProfile.id) {
  const apiBaseUrl = getApiBaseUrl()

  if (!apiBaseUrl) {
    return getStoredProfile()
  }

  const response = await fetch(`${apiBaseUrl}/users/${userId}/profile`)

  if (!response.ok) {
    throw new Error('No se pudo cargar el perfil del usuario')
  }

  return { ...defaultProfile, ...(await response.json()) }
}

export async function updateUserProfile(profile) {
  const apiBaseUrl = getApiBaseUrl()
  const profileToSave = { ...defaultProfile, ...profile }

  if (!apiBaseUrl) {
    setStoredProfile(profileToSave)
    return profileToSave
  }

  const response = await fetch(`${apiBaseUrl}/users/${profileToSave.id}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileToSave),
  })

  if (!response.ok) {
    throw new Error('No se pudo guardar el perfil del usuario')
  }

  return { ...defaultProfile, ...(await response.json()) }
}

export { defaultProfile }
