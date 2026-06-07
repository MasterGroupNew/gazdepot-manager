<template>
  <div class="space-y-4 md:space-y-6">

    <!-- Bouton Saisie Vocale -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <button
        @click="speech.isListening ? speech.stopListening() : speech.startListening()"
        :class="speech.isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'"
        class="w-full h-12 md:h-16 text-white rounded-lg font-bold text-lg hover:opacity-90"
      >
        {{ speech.isListening ? '🎤 ÉCOUTE...' : '🎤 PARLER' }}
      </button>
      <p v-if="speech.transcript" class="text-xs text-blue-700 mt-2">
        {{ speech.transcript }}
      </p>
      <p v-if="speech.error" class="text-xs text-red-600 mt-2">
        {{ speech.error }}
      </p>
    </div>

    <!-- Formulaire nouvel échange -->
    <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-5">
      <h2 class="font-semibold text-gray-800 mb-4 text-sm md:text-base">🔄 Nouvel échange client</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Société</label>
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
            <option v-for="t in typesBouteille" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Quantité</label>
          <input
            v-model.number="form.quantite"
            type="number"
            min="1"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-600 block mb-1">Prix unitaire</label>
          <input
            :value="prixUnitaire"
            disabled
            class="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
          />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs font-medium text-gray-600 block mb-1">Montant total</label>
          <input
            :value="formatFCFA(montantTotal) + ' FCFA'"
            disabled
            class="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 font-medium text-green-600"
          />
        </div>

        <div class="md:col-span-2">
          <label class="text-xs font-medium text-gray-600 block mb-1">
            Note (optionnelle)
          </label>
          <input
            v-model="form.note"
            type="text"
            placeholder="Ex : client régulier"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <p v-if="erreur" class="text-xs text-red-500 mt-3">⚠️ {{ erreur }}</p>

      <button
        @click="enregistrerEchange"
        class="mt-4 w-full bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Enregistrer l'échange
      </button>
    </div>

    <!-- Filtres -->
    <div class="flex flex-col md:flex-row gap-3 items-start md:items-center">
      <select
        v-model="filtreType"
        class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
      >
        <option value="">Tous les types</option>
        <option value="echange_client">Échanges client</option>
        <option value="approvisionnement">Approvisionnements</option>
      </select>

      <select
        v-model="filtreSociete"
        class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
      >
        <option value="">Toutes les sociétés</option>
        <option v-for="s in societes" :key="s" :value="s">{{ s }}</option>
      </select>

      <span class="text-xs text-gray-400">
        {{ transactionsFiltrees.length }} résultat(s)
      </span>
    </div>

    <!-- Tableau historique -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table class="w-full text-xs md:text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Date</th>
            <th class="text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Type</th>
            <th class="text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Société</th>
            <th class="hidden md:table-cell text-left px-3 md:px-5 py-3 font-semibold text-gray-400">Type</th>
            <th class="text-right px-3 md:px-5 py-3 font-semibold text-gray-400">Qté</th>
            <th class="text-right px-3 md:px-5 py-3 font-semibold text-gray-400">Montant</th>
            <th class="px-3 md:px-5 py-3"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="tx in transactionsFiltrees"
            :key="tx.id"
            class="hover:bg-gray-50"
          >
            <td class="px-3 md:px-5 py-3 text-gray-500 text-xs">{{ tx.date }}</td>
            <td class="px-3 md:px-5 py-3">
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="
                  tx.type === 'echange_client'
                    ? 'bg-blue-50 text-blue-600'
                    : 'bg-orange-50 text-orange-600'
                "
              >
                {{ tx.type === "echange_client" ? "Échange" : "Appro." }}
              </span>
            </td>
            <td class="px-3 md:px-5 py-3 text-gray-700 text-xs md:text-sm">{{ tx.societe }}</td>
            <td class="hidden md:table-cell px-3 md:px-5 py-3">
              <span
                class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium"
              >
                {{ tx.type_bouteille }}
              </span>
            </td>
            <td class="px-3 md:px-5 py-3 text-right text-gray-700 text-xs md:text-sm">
              {{ tx.quantite }}
            </td>
            <td
              class="px-3 md:px-5 py-3 text-right font-medium text-xs md:text-sm"
              :class="
                tx.type === 'echange_client' ? 'text-green-600' : 'text-red-500'
              "
            >
              {{ tx.type === "echange_client" ? "+" : "−"
              }}{{ formatFCFA(tx.montant_total) }}
            </td>
            <td class="px-3 md:px-5 py-3">
              <button
                @click="supprimer(tx.id)"
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
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useTransactionsStore } from "../stores/transactions.js"
import { useStockStore } from "../stores/stock.js"
import { useSpeechRecognition } from "../composables/useSpeechRecognition.js"

const txStore = useTransactionsStore()
const stockStore = useStockStore()
const speech = useSpeechRecognition()

const societes = ["Orix", "Petro-Ivoire", "SIMAM"]
const typesBouteille = ["B6", "B12"]
const PRIX_VENTE = { B6: 2200, B12: 5500 }

const form = ref({ societe: "", type_bouteille: "B6", quantite: 1, note: "" })
const erreur = ref("")
const filtreType = ref("")
const filtreSociete = ref("")

const prixUnitaire = computed(() => PRIX_VENTE[form.value.type_bouteille])
const montantTotal = computed(() => form.value.quantite * prixUnitaire.value)

const transactionsFiltrees = computed(() =>
  txStore.transactions.filter((tx) => {
    const matchType = filtreType.value ? tx.type === filtreType.value : true
    const matchSociete = filtreSociete.value
      ? tx.societe === filtreSociete.value
      : true
    return matchType && matchSociete
  }),
)

watch(() => speech.transcript, (newTranscript) => {
  if (!newTranscript) return

  if (newTranscript.includes('orix')) form.societe = 'Orix'
  if (newTranscript.includes('petro')) form.societe = 'Petro-Ivoire'
  if (newTranscript.includes('simam')) form.societe = 'SIMAM'

  if (newTranscript.includes('b6') || newTranscript.includes('petite')) form.type_bouteille = 'B6'
  if (newTranscript.includes('b12') || newTranscript.includes('grande')) form.type_bouteille = 'B12'

  const nombres = ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix']
  nombres.forEach((nombre, index) => {
    if (newTranscript.includes(nombre)) form.quantite = index + 1
  })

  if (newTranscript.includes('valider') || newTranscript.includes('confirmer') || newTranscript.includes('ok')) {
    enregistrerEchange()
  }
})

function enregistrerEchange() {
  erreur.value = ""

  if (!form.value.societe) {
    erreur.value = "Veuillez sélectionner une société."
    return
  }

  const stock = stockStore.getStock(form.value.societe, form.value.type_bouteille)
  if (!stock || stock.qte_chargees < form.value.quantite) {
    erreur.value = `Stock insuffisant — ${stock?.qte_chargees ?? 0} bouteille(s) disponible(s).`
    return
  }

  txStore.ajouterTransaction({
    type: "echange_client",
    societe: form.value.societe,
    type_bouteille: form.value.type_bouteille,
    quantite: form.value.quantite,
    prix_unitaire: prixUnitaire.value,
    montant_total: montantTotal.value,
    date: new Date().toISOString().split("T")[0],
    note: form.value.note,
  })

  stockStore.ajusterStock(
    stock.id,
    stock.qte_chargees - form.value.quantite,
    stock.qte_vides + form.value.quantite
  )

  form.value = { societe: "", type_bouteille: "B6", quantite: 1, note: "" }
  speech.transcript = ""
}

function supprimer(id) {
  if (confirm("Confirmer la suppression ?")) {
    txStore.supprimerTransaction(id)
  }
}

function formatFCFA(montant) {
  return montant.toLocaleString("fr-FR")
}
</script>