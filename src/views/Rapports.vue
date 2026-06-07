<template>
  <div class="space-y-6">

    <!-- Sélecteur de période -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-4">📋 Générer un rapport</h2>

      <div class="flex items-center gap-4">
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Type</label>
          <select
            v-model="typeRapport"
            class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          >
            <option value="journalier">Rapport journalier</option>
            <option value="mensuel">Rapport mensuel</option>
          </select>
        </div>

        <div v-if="typeRapport === 'journalier'">
          <label class="text-xs font-medium text-gray-600 block mb-1">Date</label>
          <input
            v-model="filtreDate"
            type="date"
            class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div v-if="typeRapport === 'mensuel'">
          <label class="text-xs font-medium text-gray-600 block mb-1">Mois</label>
          <input
            v-model="filtreMois"
            type="month"
            class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>
    </div>

    <!-- Rapport journalier -->
    <div v-if="typeRapport === 'journalier'" class="space-y-4">

      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Journée du {{ filtreDate }}
      </h3>

      <!-- KPIs jour -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Échanges du jour</p>
          <p class="text-2xl font-semibold text-gray-800">{{ echangesJour.length }}</p>
          <p class="text-xs text-gray-400 mt-1">transactions</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Recettes du jour</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ formatFCFA(recettesJour) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Bouteilles échangées</p>
          <p class="text-2xl font-semibold text-gray-800">{{ totalBouteillesJour }}</p>
          <p class="text-xs text-gray-400 mt-1">bouteilles</p>
        </div>
      </div>

      <!-- Détail par société -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Société</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Échanges</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Bouteilles</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Recettes</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="s in detailJourParSociete" :key="s.societe" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-700">{{ s.societe }}</td>
              <td class="px-5 py-3 text-right text-gray-600">{{ s.nb }}</td>
              <td class="px-5 py-3 text-right text-gray-600">{{ s.bouteilles }}</td>
              <td class="px-5 py-3 text-right font-medium text-green-600">
                +{{ formatFCFA(s.recettes) }} FCFA
              </td>
            </tr>
            <tr v-if="echangesJour.length === 0">
              <td colspan="4" class="px-5 py-4 text-center text-gray-400 text-xs">
                Aucun échange ce jour
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Approvisionnements du jour -->
      <div v-if="approsJour.length > 0">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Approvisionnements du jour
        </h3>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Fournisseur</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Qté</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Coût</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="a in approsJour" :key="a.id" class="hover:bg-gray-50">
                <td class="px-5 py-3 text-gray-700">{{ a.societe }}</td>
                <td class="px-5 py-3 text-right text-gray-600">{{ a.quantite }}</td>
                <td class="px-5 py-3 text-right font-medium text-red-500">
                  −{{ formatFCFA(a.montant_total) }} FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Rapport mensuel -->
    <div v-if="typeRapport === 'mensuel'" class="space-y-4">

      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Bilan — {{ filtreMois }}
      </h3>

      <!-- KPIs mois -->
      <div class="grid grid-cols-4 gap-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Recettes brutes</p>
          <p class="text-2xl font-semibold text-green-600">
            {{ formatFCFA(recettesMois) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Coûts fournisseurs</p>
          <p class="text-2xl font-semibold text-red-500">
            {{ formatFCFA(coutsFournisseursMois) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Charges du mois</p>
          <p class="text-2xl font-semibold text-red-500">
            {{ formatFCFA(chargesMois) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs text-gray-400 mb-1">Bénéfice net</p>
          <p
            class="text-2xl font-semibold"
            :class="beneficeNet >= 0 ? 'text-green-600' : 'text-red-500'"
          >
            {{ beneficeNet >= 0 ? '+' : '' }}{{ formatFCFA(beneficeNet) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA</p>
        </div>
      </div>

      <!-- Détail par société -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Société</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Échanges</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Recettes</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Coûts appro.</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Marge brute</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="s in detailMoisParSociete" :key="s.societe" class="hover:bg-gray-50">
              <td class="px-5 py-3 font-medium text-gray-700">{{ s.societe }}</td>
              <td class="px-5 py-3 text-right text-gray-600">{{ s.nb }}</td>
              <td class="px-5 py-3 text-right text-green-600 font-medium">
                +{{ formatFCFA(s.recettes) }}
              </td>
              <td class="px-5 py-3 text-right text-red-500 font-medium">
                −{{ formatFCFA(s.couts) }}
              </td>
              <td
                class="px-5 py-3 text-right font-semibold"
                :class="s.marge >= 0 ? 'text-green-600' : 'text-red-500'"
              >
                {{ s.marge >= 0 ? '+' : '' }}{{ formatFCFA(s.marge) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Détail charges -->
      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Charges du mois
        </h3>
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Libellé</th>
                <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Type</th>
                <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Montant</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="c in chargesDetailMois" :key="c.id" class="hover:bg-gray-50">
                <td class="px-5 py-3 text-gray-700">{{ c.libelle }}</td>
                <td class="px-5 py-3">
                  <span
                    class="text-xs px-2 py-1 rounded-full"
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
              </tr>
              <tr v-if="chargesDetailMois.length === 0">
                <td colspan="3" class="px-5 py-4 text-center text-gray-400 text-xs">
                  Aucune charge ce mois
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions.js'
import { useChargesStore } from '../stores/charges.js'

const txStore = useTransactionsStore()
const chargesStore = useChargesStore()

const societes = ['Orix', 'Petro-Ivoire', 'SIMAM']
const typeRapport = ref('journalier')
const filtreDate = ref(new Date().toISOString().split('T')[0])
const filtreMois = ref(new Date().toISOString().slice(0, 7))

// ---- Rapport journalier ----

const echangesJour = computed(() =>
  txStore.transactions.filter(t =>
    t.type === 'echange_client' && t.date === filtreDate.value
  )
)

const approsJour = computed(() =>
  txStore.transactions.filter(t =>
    t.type === 'approvisionnement' && t.date === filtreDate.value
  )
)

const recettesJour = computed(() =>
  echangesJour.value.reduce((sum, t) => sum + t.montant_total, 0)
)

const totalBouteillesJour = computed(() =>
  echangesJour.value.reduce((sum, t) => sum + t.quantite, 0)
)

const detailJourParSociete = computed(() =>
  societes.map(s => {
    const txs = echangesJour.value.filter(t => t.societe === s)
    return {
      societe: s,
      nb: txs.length,
      bouteilles: txs.reduce((sum, t) => sum + t.quantite, 0),
      recettes: txs.reduce((sum, t) => sum + t.montant_total, 0),
    }
  }).filter(s => s.nb > 0)
)

// ---- Rapport mensuel ----

const recettesMois = computed(() =>
  txStore.transactions
    .filter(t => t.type === 'echange_client' && t.date.startsWith(filtreMois.value))
    .reduce((sum, t) => sum + t.montant_total, 0)
)

const coutsFournisseursMois = computed(() =>
  txStore.transactions
    .filter(t => t.type === 'approvisionnement' && t.date.startsWith(filtreMois.value))
    .reduce((sum, t) => sum + t.montant_total, 0)
)

const chargesDetailMois = computed(() =>
  chargesStore.charges.filter(c => c.periode === filtreMois.value)
)

const chargesMois = computed(() =>
  chargesDetailMois.value.reduce((sum, c) => sum + c.montant, 0)
)

const beneficeNet = computed(() =>
  recettesMois.value - coutsFournisseursMois.value - chargesMois.value
)

const detailMoisParSociete = computed(() =>
  societes.map(s => {
    const echanges = txStore.transactions.filter(t =>
      t.type === 'echange_client' &&
      t.societe === s &&
      t.date.startsWith(filtreMois.value)
    )
    const appros = txStore.transactions.filter(t =>
      t.type === 'approvisionnement' &&
      t.societe === s &&
      t.date.startsWith(filtreMois.value)
    )
    const recettes = echanges.reduce((sum, t) => sum + t.montant_total, 0)
    const couts = appros.reduce((sum, t) => sum + t.montant_total, 0)
    return {
      societe: s,
      nb: echanges.length,
      recettes,
      couts,
      marge: recettes - couts,
    }
  }).filter(s => s.nb > 0 || s.couts > 0)
)

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}
</script>