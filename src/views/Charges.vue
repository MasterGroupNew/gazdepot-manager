<template>
  <div class="space-y-6">

    <!-- Résumé du mois -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-400 mb-1">Total charges du mois</p>
        <p class="text-2xl font-semibold text-red-500">
          {{ formatFCFA(chargesStore.totalChargesMois) }}
        </p>
        <p class="text-xs text-gray-400 mt-1">FCFA</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-400 mb-1">Charges fixes</p>
        <p class="text-2xl font-semibold text-gray-800">
          {{ formatFCFA(totalFixes) }}
        </p>
        <p class="text-xs text-gray-400 mt-1">FCFA</p>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-xs text-gray-400 mb-1">Charges ponctuelles</p>
        <p class="text-2xl font-semibold text-gray-800">
          {{ formatFCFA(totalPonctuelles) }}
        </p>
        <p class="text-xs text-gray-400 mt-1">FCFA</p>
      </div>
    </div>

    <!-- Formulaire ajout charge -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-4">💸 Ajouter une charge</h2>

      <div class="grid grid-cols-2 gap-4">

        <div class="col-span-2">
          <label class="text-xs font-medium text-gray-600 block mb-1">Libellé</label>
          <input
            v-model="form.libelle"
            type="text"
            placeholder="Ex : Loyer, Transport, Entretien..."
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
          <label class="text-xs font-medium text-gray-600 block mb-1">Période</label>
          <input
            v-model="form.periode"
            type="month"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div class="col-span-2 flex items-center gap-3">
          <input
            v-model="form.recurrente"
            type="checkbox"
            id="recurrente"
            class="w-4 h-4 accent-orange-500"
          />
          <label for="recurrente" class="text-sm text-gray-600">
            Charge fixe mensuelle récurrente
          </label>
        </div>

      </div>

      <p v-if="erreur" class="text-xs text-red-500 mt-3">⚠️ {{ erreur }}</p>

      <button
        @click="ajouterCharge"
        class="mt-4 bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Ajouter la charge
      </button>

    </div>

    <!-- Filtre par période -->
    <div class="flex items-center gap-3">
      <label class="text-xs text-gray-500">Période :</label>
      <input
        v-model="filtrePeriode"
        type="month"
        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
      />
      <span class="text-xs text-gray-400 ml-auto">
        {{ chargesFiltrees.length }} charge(s)
      </span>
    </div>

    <!-- Liste des charges -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Libellé</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Période</th>
            <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Type</th>
            <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Montant</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="c in chargesFiltrees"
            :key="c.id"
            class="hover:bg-gray-50"
          >
            <td class="px-5 py-3 text-gray-700 font-medium">{{ c.libelle }}</td>
            <td class="px-5 py-3 text-gray-500">{{ c.periode }}</td>
            <td class="px-5 py-3">
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="c.recurrente
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-100 text-gray-500'"
              >
                {{ c.recurrente ? '🔁 Fixe' : '📌 Ponctuelle' }}
              </span>
            </td>
            <td class="px-5 py-3 text-right font-medium text-red-500">
              −{{ formatFCFA(c.montant) }} FCFA
            </td>
            <td class="px-5 py-3 text-right">
              <button
                @click="supprimer(c.id)"
                class="text-gray-300 hover:text-red-500 transition-colors"
              >
                🗑️
              </button>
            </td>
          </tr>

          <!-- Ligne total -->
          <tr class="bg-gray-50 font-semibold">
            <td class="px-5 py-3 text-gray-700" colspan="3">Total</td>
            <td class="px-5 py-3 text-right text-red-500">
              −{{ formatFCFA(totalFiltree) }} FCFA
            </td>
            <td></td>
          </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useChargesStore } from '../stores/charges.js'

const chargesStore = useChargesStore()

const moisCourant = new Date().toISOString().slice(0, 7)

const form = ref({
  libelle: '',
  montant: 0,
  periode: moisCourant,
  recurrente: false,
})

const erreur = ref('')
const filtrePeriode = ref(moisCourant)

// Charges filtrées par période
const chargesFiltrees = computed(() => {
  if (!filtrePeriode.value) return chargesStore.charges
  return chargesStore.charges.filter(c => c.periode === filtrePeriode.value)
})

// Total des charges filtrées
const totalFiltree = computed(() =>
  chargesFiltrees.value.reduce((sum, c) => sum + c.montant, 0)
)

// Charges fixes du mois courant
const totalFixes = computed(() =>
  chargesStore.charges
    .filter(c => c.periode === moisCourant && c.recurrente)
    .reduce((sum, c) => sum + c.montant, 0)
)

// Charges ponctuelles du mois courant
const totalPonctuelles = computed(() =>
  chargesStore.charges
    .filter(c => c.periode === moisCourant && !c.recurrente)
    .reduce((sum, c) => sum + c.montant, 0)
)

function ajouterCharge() {
  erreur.value = ''

  if (!form.value.libelle.trim()) {
    erreur.value = 'Le libellé est obligatoire.'
    return
  }
  if (form.value.montant <= 0) {
    erreur.value = 'Le montant doit être supérieur à 0.'
    return
  }
  if (!form.value.periode) {
    erreur.value = 'La période est obligatoire.'
    return
  }

  chargesStore.ajouterCharge({ ...form.value })

  form.value = {
    libelle: '',
    montant: 0,
    periode: moisCourant,
    recurrente: false,
  }
}

function supprimer(id) {
  if (confirm('Confirmer la suppression ?')) {
    chargesStore.supprimerCharge(id)
  }
}

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}
</script>