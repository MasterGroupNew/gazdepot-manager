<template>
  <!-- Desktop sidebar -->
  <aside class="hidden md:block w-56 bg-white border-r border-gray-200 flex flex-col h-screen">
    
    <!-- Logo -->
    <div class="px-6 py-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <span class="text-lg font-bold text-orange-600">🔥</span>
        </div>
        <div>
          <p class="font-bold text-gray-800">GazDepôt</p>
          <p class="text-xs text-gray-400">Manager</p>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <RouterLink
        v-for="item in visibleMenu"
        :key="item.path"
        :to="item.path"
        class="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="$route.path === item.path
          ? 'bg-orange-100 text-orange-600'
          : 'text-gray-600 hover:bg-gray-50'"
      >
        {{ item.icon }} {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="border-t border-gray-100 px-4 py-4">
      <p class="text-xs text-gray-400 text-center">© 2026 GazDepôt</p>
    </div>

  </aside>

  <!-- Mobile menu button -->
  <button
    @click="menuOuvert = !menuOuvert"
    class="md:hidden fixed top-4 left-4 z-40 bg-orange-500 text-white p-2 rounded-lg"
  >
    {{ menuOuvert ? '✕' : '☰' }}
  </button>

  <!-- Mobile sidebar -->
  <div
    v-if="menuOuvert"
    class="md:hidden fixed inset-0 bg-black/50 z-30"
    @click="menuOuvert = false"
  />
  <aside
    v-if="menuOuvert"
    class="md:hidden fixed left-0 top-0 w-56 bg-white h-screen z-40 flex flex-col"
  >
    
    <!-- Logo -->
    <div class="px-6 py-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <span class="text-lg font-bold text-orange-600">🔥</span>
        </div>
        <div>
          <p class="font-bold text-gray-800">GazDepôt</p>
          <p class="text-xs text-gray-400">Manager</p>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
      <RouterLink
        v-for="item in visibleMenu"
        :key="item.path"
        :to="item.path"
        class="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        :class="$route.path === item.path
          ? 'bg-orange-100 text-orange-600'
          : 'text-gray-600 hover:bg-gray-50'"
        @click="menuOuvert = false"
      >
        {{ item.icon }} {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="border-t border-gray-100 px-4 py-4">
      <p class="text-xs text-gray-400 text-center">© 2026 GazDepôt</p>
    </div>

  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const menuOuvert = ref(false)

const allMenu = [
  { path: '/', label: 'Tableau de bord', icon: '📊' },
  { path: '/stock', label: 'Stock', icon: '📦', requireEditor: true },
  { path: '/transactions', label: 'Transactions', icon: '💳', requireEditor: true },
  { path: '/approvisionnements', label: 'Approvisionnements', icon: '🚚', requireEditor: true },
  { path: '/charges', label: 'Charges', icon: '💰', requireEditor: true },
  { path: '/rapports', label: 'Rapports', icon: '📈' },
  { path: '/parametres', label: 'Paramètres', icon: '⚙️', requireEditor: true },
]

// Afficher le menu selon le rôle
const visibleMenu = computed(() =>
  allMenu.filter(item => !item.requireEditor || authStore.isEditor)
)
</script>