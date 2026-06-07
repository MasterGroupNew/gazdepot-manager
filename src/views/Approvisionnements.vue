<template>
  <div class="space-y-6">

    <!-- Formulaire -->
    <div class="bg-white rounded-xl border border-gray-200 p-5">
      <h2 class="font-semibold text-gray-800 mb-4">🚚 Nouvel approvisionnement</h2>

      <div class="grid grid-cols-2 gap-4">

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Fournisseur</label>
          <select
            v-model="form.societe"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          >
            <option value="">-- Choisir --</option>
            <option v-for="s in societes" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div>
  <label class="text-xs font-medium text-gray-600 block mb-1">Type bouteille</label>
  <select
    v-model="form.type_bouteille"
    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
  >
    <option value="B6">B6</option>
    <option value="B12">B12</option>
  </select>
</div>
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Quantité reçue
          </label>
          <input
            v-model.number="form.quantite"
            type="number"
            min="1"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Prix recharge fournisseur
          </label>
          <input
            :value="prixUnitaire ? formatFCFA(prixUnitaire) + ' FCFA' : '—'"
            disabled
            class="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Coût total
          </label>
          <input
            :value="formatFCFA(coutTotal) + ' FCFA'"
            disabled
            class="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 font-medium text-red-500"
          />
        </div>

        <div class="col-span-2">
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Note (optionnelle)
          </label>
          <input
            v-model="form.note"
            type="text"
            placeholder="Ex : recharge mensuelle"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

      </div>

      <p v-if="erreur" class="text-xs text-red-500 mt-3">⚠️ {{ erreur }}</p>

      <button
        @click="enregistrerAppro"
        class="mt-4 bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Enregistrer l'approvisionnement
      </button>

    </div>

    <!-- Résumé coûts par fournisseur ce mois -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Coûts fournisseurs — mois en cours
      </h2>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="s in societes"
          :key="s"
          class="bg-white rounded-xl border border-gray-200 p-4"
        >
          <p class="text-sm font-semibold text-gray-700 mb-3">{{ s }}</p>
          <p class="text-2xl font-semibold text-red-500">
            {{ formatFCFA(coutParSociete(s)) }}
          </p>
          <p class="text-xs text-gray-400 mt-1">FCFA dépensés</p>
          <div class="border-t border-gray-100 mt-3 pt-3">
            <p class="text-xs text-gray-400">
              Prix recharge :
              <span class="font-medium text-gray-600">
                {{ formatFCFA(chargesStore.getPrixSociete(s)) }} FCFA
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique approvisionnements -->
    <div>
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Historique
      </h2>
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Date</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Fournisseur</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Type</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Qté</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Prix unit.</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-400">Coût total</th>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-400">Note</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="tx in approvisionnements"
              :key="tx.id"
              class="hover:bg-gray-50"
            >
              <td class="px-5 py-3 text-gray-500">{{ tx.date }}</td>
              <td class="px-5 py-3 text-gray-700">{{ tx.societe }}</td>
              <td class="px-5 py-3">
                <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {{ tx.type_bouteille }}
                </span>
                </td>
              <td class="px-5 py-3 text-right text-gray-700">{{ tx.quantite }}</td>
              <td class="px-5 py-3 text-right text-gray-500">
                {{ formatFCFA(tx.prix_unitaire) }}
              </td>
              <td class="px-5 py-3 text-right font-medium text-red-500">
                −{{ formatFCFA(tx.montant_total) }}
              </td>
              <td class="px-5 py-3 text-gray-400 text-xs">{{ tx.note || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions.js'
import { useStockStore } from '../stores/stock.js'
import { useChargesStore } from '../stores/charges.js'

const txStore = useTransactionsStore()
const stockStore = useStockStore()
const chargesStore = useChargesStore()

const societes = ['Orix', 'Petro-Ivoire', 'SIMAM']

const form = ref({ societe: '', quantite: 1, note: '' })
const erreur = ref('')

const prixUnitaire = computed(() =>
  form.value.societe && form.value.type_bouteille
    ? chargesStore.getPrixSociete(form.value.societe, form.value.type_bouteille)
    : 0
)

const coutTotal = computed(() => form.value.quantite * prixUnitaire.value)

// Historique approvisionnements uniquement
const approvisionnements = computed(() =>
  txStore.transactions.filter(t => t.type === 'approvisionnement')
)

// Coût par société ce mois
function coutParSociete(societe) {
  const mois = new Date().toISOString().slice(0, 7)
  return txStore.transactions
    .filter(t =>
      t.type === 'approvisionnement' &&
      t.societe === societe &&
      t.date.startsWith(mois)
    )
    .reduce((sum, t) => sum + t.montant_total, 0)
}

function enregistrerAppro() {
  erreur.value = ''

  if (!form.value.societe) {
    erreur.value = 'Veuillez sélectionner un fournisseur.'
    return
  }
  if (form.value.quantite < 1) {
    erreur.value = 'La quantité doit être supérieure à 0.'
    return
  }

  // Enregistrer la transaction
  txStore.ajouterTransaction({
  type: 'approvisionnement',
  societe: form.value.societe,
  type_bouteille: form.value.type_bouteille,  // ✅ Ajoute ça
  quantite: form.value.quantite,
  prix_unitaire: prixUnitaire.value,
  montant_total: coutTotal.value,
  date: new Date().toISOString().split('T')[0],
  note: form.value.note,
})

// Et aussi update le stock avec l'ID et le type
const stock = stockStore.stocks.find(s => 
  s.societe === form.value.societe && s.type_bouteille === form.value.type_bouteille
)
if (stock) {
  stockStore.ajusterStock(
    stock.id,
    stock.qte_chargees + form.value.quantite,
    Math.max(0, stock.qte_vides - form.value.quantite)
  )
}

  form.value = { societe: '', quantite: 1, note: '' }
}

function formatFCFA(montant) {
  return montant.toLocaleString('fr-FR')
}
</script>