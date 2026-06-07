<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-sm">

      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span class="text-4xl">🔥</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">GazDepôt Manager</h1>
        <p class="text-xs text-gray-400 mt-1">Connexion sécurisée</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="viewer@test.com"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="password123"
            class="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <p v-if="erreur" class="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          ⚠️ {{ erreur }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-orange-500 text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm md:text-base"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-gray-100">
        <p class="text-xs text-gray-400 text-center mb-3">Comptes de test</p>
        <div class="space-y-2 text-xs">
          <div class="bg-blue-50 rounded-lg p-3">
            <p class="font-medium text-blue-700">👤 Viewer</p>
            <p class="text-blue-600 truncate">viewer@test.com / password123</p>
          </div>
          <div class="bg-green-50 rounded-lg p-3">
            <p class="font-medium text-green-700">✏️ Editor</p>
            <p class="text-green-600 truncate">editor@test.com / password123</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({ email: '', password: '' })
const erreur = ref('')
const loading = ref(false)

async function handleLogin() {
  erreur.value = ''
  loading.value = true

  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/')
  } catch (error) {
    erreur.value = error.message || 'Erreur de connexion'
  } finally {
    loading.value = false
  }
}
</script>