<template>
  <div class="space-y-4 md:space-y-6">

    <!-- Formulaire nouvel charge -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
      <h2 class="font-semibold text-gray-800 mb-4 text-sm md:text-base">💰 Nouvelle charge</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Libellé</label>
          <input
            v-model="form.libelle"
            type="text"
            placeholder="Ex : Loyer, Transport..."
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Montant (FCFA)</label>
          <input
            v-model.number="form.montant"
            type="number"
            min="0"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Mois (YYYY-MM)</label>
          <input
            v-model="form.periode"
            type="text"
            placeholder="2026-06"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div class="flex items-end">
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="form.recurrente"
              type="checkbox"
              class="rounded border-gray-200"
            />
            <span class="text-xs text-gray-600">Charge récurrente</span>
          </label>
        </div>
      </div>

      <p v-if="erreur" class="text-xs text-red-500 mt-3">⚠️ {{ erreur }}</p>

      <button
        @click="ajouterCharge"
        class="mt-4 w-full bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Ajouter la charge
      </button>
    </div>

    <!-- Résumé charges ce mois -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Total charges — mois en cours
      </h2>
      <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <p class="text-xs text-gray-400 mb-2">Total FCFA</p>
        <p class="text-3xl md:text-4xl font-bold text-red-500">
          {{ formatFCFA(chargesStore.totalChargesMois) }}
        </p>
      </div>
    </div>

    <!-- Historique charges -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Historique
      </h2>
      <div class="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table class="w-full text-xs md:text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Libellé</th>
              <th class="text-right px-3 md:px-5 py-3 font-semibold text-gray-400">Montant</th>
              <th class="text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Période</th>
              <th class="hidden md:table-cell text-center px-3 md:px-5 py-3 font-semibold text-gray-400">Récurrente</th>
              <th class="px-3 md:px-5 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="c in chargesStore.charges"
              :key="c.id"
              class="hover:bg-gray-50"
            >
              <td class="px-3 md:px-5 py-3 text-gray-700 text-xs md:text-sm">{{ c.libelle }}</td>
              <td class="px-3 md:px-5 py-3 text-right font-medium text-red-500 text-xs md:text-sm">
                {{ formatFCFA(c.montant) }}
              </td>
              <td class="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm">{{ c.periode }}</td>
              <td class="hidden md:table-cell px-3 md:px-5 py-3 text-center text-xs">
                {{ c.recurrente ? '✅' : '—' }}
              </td>
              <td class="px-3 md:px-5 py-3">
                <button
                  @click="supprimerCharge(c.id)"
                  class="text-gray-300 hover:text-red-500 transition-colors text-xs"
                >
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useChargesStore } from '../stores/charges.js'

const chargesStore = useChargesStore()

const form = ref({
  libelle: '',
  montant: 0,
  periode: new Date().toISOString().slice(0, 7),
  recurrente: false,
})
const erreur = ref('')

function ajouterCharge() {
  erreur.value = ''

  if (!form.value.libelle) {
    erreur.value = 'Veuillez entrer un libellé.'
    return
  }
  if (form.value.montant < 1) {
    erreur.value = 'Le montant doit être supérieur à 0.'
    return
  }

  chargesStore.ajouterCharge({
    libelle: form.value.libelle,
    montant: form.value.montant,
    periode: form.value.periode,
    recurrente: form.value.recurrente,
  })

  form.value = {
    libelle: '',
    montant: 0,
    periode: new Date().toISOString().slice(0, 7),
    recurrente: false,
  }
}

function supprimerCharge(id) {
  if (confirm('Confirmer la suppression ?')) {
    chargesStore.supprimerCharge(id)
  }
}

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}
</script>