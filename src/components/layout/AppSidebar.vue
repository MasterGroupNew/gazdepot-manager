<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">

    <!-- Logo -->
    <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
      <div class="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
        <span class="text-orange-500 text-lg">🔥</span>
      </div>
      <div>
        <p class="font-semibold text-gray-800 text-sm">GazDepôt</p>
        <p class="text-xs text-gray-400">Manager</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
        :class="isActive(item.path)
          ? 'bg-orange-50 text-orange-600 font-medium'
          : 'text-gray-600 hover:bg-gray-100'"
      >
        <span class="text-base">{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-gray-200">
      <p class="text-xs text-gray-400">Version 1.0 — Mai 2026</p>
    </div>

  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { path: '/',                   icon: '📊', label: 'Tableau de bord' },
  { path: '/stock',              icon: '🫙', label: 'Stock' },
  { path: '/transactions',       icon: '🔄', label: 'Transactions' },
  { path: '/approvisionnements', icon: '🚚', label: 'Approvisionnements' },
  { path: '/charges',            icon: '💸', label: 'Charges' },
  { path: '/rapports',           icon: '📋', label: 'Rapports' },
  { path: '/parametres',         icon: '⚙️', label: 'Paramètres' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>