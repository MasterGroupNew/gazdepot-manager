<template>
  <div class="space-y-4 md:space-y-6">

    <!-- Cartes stock avec ajustement -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <div
        v-for="s in stockStore.stocks"
        :key="s.id"
        class="bg-white rounded-xl border border-gray-200 p-4 md:p-5"
      >
        <!-- En-tête -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-gray-800 text-sm md:text-base">{{ s.societe }}</h3>
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

        <!-- Chiffres -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-2xl md:text-3xl font-semibold text-gray-800">{{ s.qte_chargees }}</p>
            <p class="text-xs text-gray-400 mt-1">Chargées</p>
          </div>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <p class="text-2xl md:text-3xl font-semibold text-gray-500">{{ s.qte_vides }}</p>
            <p class="text-xs text-gray-400 mt-1">Vides</p>
          </div>
        </div>

        <!-- Seuil alerte -->
        <div class="flex items-center justify-between mb-4 text-xs text-gray-400">
          <span>Seuil d'alerte</span>
          <span class="font-medium text-gray-600">{{ s.seuil_alerte }} bouteilles</span>
        </div>

        <!-- Bouton ajustement -->
        <button
          @click="ouvrirAjustement(s)"
          class="w-full text-sm border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ✏️ Ajuster
        </button>

      </div>
    </div>

    <!-- Modal ajustement -->
    <div
      v-if="modalOuverte"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="fermerModal"
    >
      <div class="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-sm">

        <h3 class="font-semibold text-gray-800 mb-1">
          Ajuster — {{ stockSelectionne?.societe }} {{ stockSelectionne?.type_bouteille }}
        </h3>
        <p class="text-xs text-gray-400 mb-5">Correction manuelle d'inventaire</p>

        <div class="space-y-4">
          <div>
            <label class="text-xs font-medium text-gray-600 block mb-1">
              Bouteilles chargées
            </label>
            <input
              v-model.number="form.qte_chargees"
              type="number"
              min="0"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <div>
            <label class="text-xs font-medium text-gray-600 block mb-1">
              Bouteilles vides
            </label>
            <input
              v-model.number="form.qte_vides"
              type="number"
              min="0"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="fermerModal"
            class="flex-1 border border-gray-200 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            @click="confirmerAjustement"
            class="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600"
          >
            Confirmer
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStockStore } from '../stores/stock.js'

const stockStore = useStockStore()

const modalOuverte = ref(false)
const stockSelectionne = ref(null)
const form = ref({ qte_chargees: 0, qte_vides: 0 })

function ouvrirAjustement(s) {
  stockSelectionne.value = s
  form.value = { qte_chargees: s.qte_chargees, qte_vides: s.qte_vides }
  modalOuverte.value = true
}

function fermerModal() {
  modalOuverte.value = false
  stockSelectionne.value = null
}

function confirmerAjustement() {
  stockStore.ajusterStock(
    stockSelectionne.value.id,
    form.value.qte_chargees,
    form.value.qte_vides
  )
  fermerModal()
}
</script>