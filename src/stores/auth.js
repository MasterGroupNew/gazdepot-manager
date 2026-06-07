import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wnedokisaxshktwdcrxl.supabase.co',
  'sb_publishable_tHsPkrPPwFFyRXCx85rIHQ_zlJr8bgj'
)

export const useAuthStore = defineStore('auth', () => {

  const user = ref(null)
  const role = ref(null)
  const isAuthenticated = computed(() => user.value !== null)
  const isEditor = computed(() => role.value === 'editor')
  const isViewer = computed(() => role.value === 'viewer')

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    user.value = data.user
    await fetchUserRole()
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    role.value = null
  }

  async function fetchUserRole() {
    // Pour cet MVP, on va définir le rôle côté client basé sur l'email
    // En prod, tu pourrais avoir une table Supabase pour les rôles
    if (user.value?.email === 'editor@test.com') {
      role.value = 'editor'
    } else {
      role.value = 'viewer'
    }
  }

  async function initializeAuth() {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      user.value = data.session.user
      await fetchUserRole()
    }
  }

  return {
    user,
    role,
    isAuthenticated,
    isEditor,
    isViewer,
    login,
    logout,
    initializeAuth,
  }
})