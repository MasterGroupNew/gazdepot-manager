import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useTransactionsStore = defineStore('transactions', () => {

  const transactions = ref([])
  const loading = ref(false)

  // Convertir une date en YYYY-MM-DD
  function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  const recettesJour = computed(() => {
    const aujourd_hui = formatDate(new Date())
    return transactions.value
      .filter(t => 
        t.type === 'echange_client' && 
        formatDate(t.date) === aujourd_hui
      )
      .reduce((sum, t) => sum + t.montant_total, 0)
  })

  const echangesJour = computed(() => {
  const aujourd_hui = formatDate(new Date())
  const result = transactions.value.filter(t => {
    const dateFormatee = formatDate(t.date)
    const typeMatch = t.type === 'echange_client'
    const dateMatch = dateFormatee === aujourd_hui
    
    console.log('Transaction:', {
      id: t.id,
      type: t.type,
      typeMatch,
      date: t.date,
      dateFormatee,
      aujourd_hui,
      dateMatch
    })
    
    return typeMatch && dateMatch
  })
  
  console.log('Échanges du jour:', result.length)
  return result
})

  const coutsFournisseursMois = computed(() => {
    const mois = new Date().toISOString().slice(0, 7)
    return transactions.value
      .filter(t => 
        t.type === 'approvisionnement' && 
        formatDate(t.date).startsWith(mois)
      )
      .reduce((sum, t) => sum + t.montant_total, 0)
  })

  async function fetchTransactions() {
    loading.value = true
    try {
      const { data } = await api.getTransactions()
      transactions.value = data
    } catch (error) {
      console.error('Erreur fetch transactions:', error)
    } finally {
      loading.value = false
    }
  }

  async function ajouterTransaction(transaction) {
    try {
      const { data } = await api.createTransaction(transaction)
      transactions.value.unshift(data)
    } catch (error) {
      console.error('Erreur create transaction:', error)
      throw error
    }
  }

  async function supprimerTransaction(id) {
    try {
      await api.deleteTransaction(id)
      transactions.value = transactions.value.filter(t => t.id !== id)
    } catch (error) {
      console.error('Erreur delete transaction:', error)
    }
  }

  return {
    transactions,
    loading,
    recettesJour,
    echangesJour,
    coutsFournisseursMois,
    fetchTransactions,
    ajouterTransaction,
    supprimerTransaction,
  }
})