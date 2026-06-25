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

export const sendMessage = async (message) => {
    if (!aiToken.value) {
        throw new Error('No hay token de IA disponible todavía')
    }

    const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiToken.value}`
        },
        body: JSON.stringify({ message })
    })

    if (!res.ok) {
        throw new Error('Error en el chat')
    }

    const data = await res.json()
    return data.response
}

export async function registerAI(email, password) {
    const response = await fetch('https://trabajo-integrador-tp2.onrender.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    if (!response.ok) throw new Error('Error en el registro')
        return response.json()
}