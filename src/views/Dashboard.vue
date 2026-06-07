<template>
  <div class="space-y-4 md:space-y-6">

    <!-- Alerte stock faible -->
    <div
      v-if="stockStore.alertes.length > 0"
      class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-3 text-sm md:text-base"
    >
      <span class="text-lg flex-shrink-0">⚠️</span>
      <div>
        <p class="font-medium text-red-700">Stock faible détecté</p>
        <p class="text-xs text-red-500 mt-1">
          {{ stockStore.alertes.map(a => `${a.societe} ${a.type_bouteille}`).join(', ') }}
        </p>
      </div>
    </div>

    <!-- Cartes stock -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Stock en temps réel
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div
          v-for="s in stockStore.stocks"
          :key="s.id"
          class="bg-white rounded-xl border p-4 md:p-5"
          :class="s.qte_chargees <= s.seuil_alerte
            ? 'border-red-200 bg-red-50'
            : 'border-gray-200'"
        >
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm md:text-base font-semibold text-gray-700">{{ s.societe }}</p>
              <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium mt-1 inline-block">
                {{ s.type_bouteille }}
              </span>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full font-medium"
              :class="s.qte_chargees <= s.seuil_alerte
                ? 'bg-red-100 text-red-600'
                : 'bg-green-100 text-green-600'"
            >
              {{ s.qte_chargees <= s.seuil_alerte ? '⚠️ Faible' : '✓ OK' }}
            </span>
          </div>
          <p
            class="text-3xl md:text-4xl font-semibold mb-1"
            :class="s.qte_chargees <= s.seuil_alerte ? 'text-red-500' : 'text-gray-800'"
          >
            {{ s.qte_chargees }}
          </p>
          <p class="text-xs text-gray-400 mb-3">bouteilles chargées</p>
          <div class="border-t border-gray-100 pt-3 flex justify-between text-xs">
            <span class="text-gray-400">Vides en stock</span>
            <span class="font-medium text-gray-600">{{ s.qte_vides }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Aujourd'hui
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <p class="text-xs text-gray-400 mb-1">Échanges</p>
          <p class="text-xl md:text-2xl font-semibold text-gray-800">
            {{ txStore.echangesJour.length }}
          </p>
          <p class="text-xs text-gray-400 mt-1">transactions</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <p class="text-xs text-gray-400 mb-1">Recettes</p>
          <p class="text-xl md:text-2xl font-semibold text-green-600">
            {{ formatFCFA(txStore.recettesJour) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <p class="text-xs text-gray-400 mb-1">Coûts</p>
          <p class="text-xl md:text-2xl font-semibold text-red-500">
            {{ formatFCFA(txStore.coutsFournisseursMois) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA mois</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 md:p-4">
          <p class="text-xs text-gray-400 mb-1">Total stock</p>
          <p class="text-xl md:text-2xl font-semibold text-gray-800">
            {{ stockStore.totalChargees }}
          </p>
          <p class="text-xs text-gray-400 mt-1">bouteilles</p>
        </div>
      </div>
    </div>

    <!-- Dernières transactions -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Dernières transactions
      </h2>
      <div class="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div
          v-for="tx in dernieresTx"
          :key="tx.id"
          class="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-5 py-3 gap-2"
        >
          <div class="min-w-0">
            <p class="text-sm text-gray-700">
              {{ tx.type === 'echange_client' ? 'Échange' : 'Appro.' }}
              — {{ tx.societe }} {{ tx.type_bouteille }} × {{ tx.quantite }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(tx.date) }}</p>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span
              class="text-xs px-2 py-1 rounded-full font-medium"
              :class="tx.type === 'echange_client'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-orange-50 text-orange-600'"
            >
              {{ tx.type === 'echange_client' ? 'Échange' : 'Appro.' }}
            </span>
            <span
              class="font-medium"
              :class="tx.type === 'echange_client' ? 'text-green-600' : 'text-red-500'"
            >
              {{ tx.type === 'echange_client' ? '+' : '−' }}{{ formatFCFA(tx.montant_total) }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStockStore } from '../stores/stock.js'
import { useTransactionsStore } from '../stores/transactions.js'

const stockStore = useStockStore()
const txStore = useTransactionsStore()

const dernieresTx = computed(() => txStore.transactions.slice(0, 5))

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
}
</script>