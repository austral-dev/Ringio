import { ref } from 'vue'

export const aiToken = ref(null)

const API_BASE = 'https://trabajo-integrador-tp2.onrender.com/api/v1'

export const loginAI = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!res.ok) {
        throw new Error('Login a API de IA falló')
    }

    const data = await res.json()
    aiToken.value = data.token
    return data.token
}