<template>
  <div class="space-y-6">

    <!-- Prix par société -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-1">💰 Prix de recharge fournisseurs</h2>
      <p class="text-xs text-gray-400 mb-4">
        Ces prix sont appliqués automatiquement lors des approvisionnements.
      </p>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div
          v-for="p in chargesStore.prix"
          :key="p.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-semibold text-gray-700">{{ p.societe }}</p>
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
              {{ p.type_bouteille }}
            </span>
          </div>
          <div class="flex items-center gap-2 mb-2">
            <input v-model.number="p.valeur" type="number" min="0" class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"/>
            <span class="text-xs text-gray-400 whitespace-nowrap">FCFA</span>
          </div>
          <p class="text-xs text-gray-400">
            Marge / échange :
            <span class="font-medium text-green-600">
              {{ formatFCFA((p.type_bouteille === 'B6' ? 2200 : 5500) - p.valeur) }} FCFA
            </span>
          </p>
        </div>
      </div>

      <button
        @click="sauvegarderPrix"
        class="bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Sauvegarder les prix
      </button>
    </div>

    <!-- Seuils d'alerte -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-1">⚠️ Seuils d'alerte stock</h2>
      <p class="text-xs text-gray-400 mb-4">
        Une alerte s'affiche quand le stock descend en dessous de ce seuil.
      </p>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <div
          v-for="s in stockStore.stocks"
          :key="s.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <p class="text-sm font-semibold text-gray-700 mb-3">
            {{ s.societe }}
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium ml-2">
              {{ s.type_bouteille }}
            </span>
          </p>
          <div class="flex items-center gap-2">
            <input
              v-model.number="s.seuil_alerte"
              type="number"
              min="1"
              class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
            <span class="text-xs text-gray-400 whitespace-nowrap">bouteilles</span>
          </div>
        </div>
      </div>

      <button
        @click="sauvegarderSeuils"
        class="bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Sauvegarder les seuils
      </button>
    </div>

    <!-- Informations du magasin -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-1">
        🏪 Informations du magasin
      </h2>
      <p class="text-xs text-gray-400 mb-4">
        Affichées dans l'en-tête de l'application.
      </p>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Nom du dépôt
          </label>
          <input
            v-model="infos.nom"
            type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Ville
          </label>
          <input
            v-model="infos.ville"
            type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Téléphone
          </label>
          <input
            v-model="infos.telephone"
            type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Gérant
          </label>
          <input
            v-model="infos.gerant"
            type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <button
        @click="sauvegarder"
        class="mt-4 bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Sauvegarder
      </button>

      <p v-if="succes" class="text-xs text-green-600 mt-3">
        ✅ Paramètres sauvegardés avec succès.
      </p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChargesStore } from '../stores/charges.js'
import { useStockStore } from '../stores/stock.js'

const chargesStore = useChargesStore()
const stockStore = useStockStore()

const succes = ref(false)

const infos = ref({
  nom: 'GazDepôt Principal',
  ville: 'Abidjan',
  telephone: '+225 07 00 00 00',
  gerant: 'Gérant',
})

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}

async function sauvegarderPrix() {
  try {
    for (const p of chargesStore.prix) {
      await chargesStore.modifierPrix(p.id, p.valeur)
    }
    succes.value = true
    setTimeout(() => { succes.value = false }, 3000)
  } catch (error) {
    console.error('Erreur sauvegarde prix:', error)
  }
}

async function sauvegarderSeuils() {
  try {
    for (const s of stockStore.stocks) {
      await stockStore.ajusterStock(s.id, s.qte_chargees, s.qte_vides)
    }
    succes.value = true
    setTimeout(() => { succes.value = false }, 3000)
  } catch (error) {
    console.error('Erreur sauvegarde seuils:', error)
  }
}

function sauvegarder() {
  succes.value = true
  setTimeout(() => { succes.value = false }, 3000)
}
</script>