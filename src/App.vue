<template>
  <div class="flex h-screen bg-gray-50">

    <AppSidebar />

    <div class="flex flex-col flex-1 overflow-hidden">
      <AppTopbar />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppTopbar from './components/layout/AppTopbar.vue'
import { useAuthStore } from './stores/auth'
import { useStockStore } from './stores/stock'
import { useTransactionsStore } from './stores/transactions'
import { useChargesStore } from './stores/charges'

const authStore = useAuthStore()
const stockStore = useStockStore()
const txStore = useTransactionsStore()
const chargesStore = useChargesStore()

onMounted(async () => {
  await authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    await stockStore.fetchStock()
    await txStore.fetchTransactions()
    await chargesStore.fetchCharges()
    await chargesStore.fetchPrix()
    
    // Rafraîchir toutes les 30 secondes
    setInterval(async () => {
      await stockStore.fetchStock()
      await txStore.fetchTransactions()
    }, 30000)
  }
})
</script>