<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

    <h1 class="text-base font-semibold text-gray-800">
      {{ pageTitle }}
    </h1>

    <div class="flex items-center gap-3">
  <span class="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
    📅 {{ today }}
  </span>
  <button
    @click="logout"
    class="text-xs px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
  >
    🚪 Déconnexion
  </button>
  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
    <span class="text-orange-600 text-xs font-semibold">G</span>
  </div>
</div>

  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>