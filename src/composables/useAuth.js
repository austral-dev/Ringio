import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'

export const currentUser = ref(null)

export const loginWithCredentials = async (email, password) => {
    const { data, error } = await supabase
        .from('Usuario')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single()

    if (error || !data) {
        throw new Error('Email o contraseña incorrectos')
    }

    currentUser.value = data
    return data
}