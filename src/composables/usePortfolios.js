import { ref } from 'vue'
import { supabase } from '@/lib/supabase.js'
import { currentUser } from './useAuth.js'

export const portfolios = ref([])
export const loadingPortfolios = ref(false)

export const fetchPortfolios = async () => {
    if (!currentUser.value) return

    loadingPortfolios.value = true

    const { data, error } = await supabase
        .from('Portfolio')
        .select('*')
        .eq('user_id', currentUser.value.id)

    if (error) {
        console.error('Error trayendo portfolios:', error)
        loadingPortfolios.value = false
        return
    }

    portfolios.value = data
    loadingPortfolios.value = false
}