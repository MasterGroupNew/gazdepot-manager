<template>
  <header class="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
    <div class="flex items-center justify-between">
      
      <!-- Logo mobile -->
      <div class="md:hidden flex items-center gap-2">
        <span class="text-2xl">🔥</span>
        <span class="font-bold text-gray-800">GazDepôt</span>
      </div>

      <!-- Date -->
      <span class="text-xs md:text-sm text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
        📅 {{ today }}
      </span>

      <!-- Logout -->
      <button
        @click="logout"
        class="text-xs md:text-sm px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
      >
        🚪 <span class="hidden md:inline">Déconnexion</span>
      </button>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const today = ref(new Date().toLocaleDateString('fr-FR', { 
  weekday: 'short', 
  year: 'numeric', 
  month: 'short', 
  day: 'numeric' 
}))

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>