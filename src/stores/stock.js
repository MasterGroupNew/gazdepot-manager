import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useStockStore = defineStore('stock', () => {

  const stocks = ref([])
  const loading = ref(false)

  const alertes = computed(() =>
    stocks.value.filter(s => s.qte_chargees <= s.seuil_alerte)
  )

  const totalChargees = computed(() =>
    stocks.value.reduce((sum, s) => sum + s.qte_chargees, 0)
  )

  async function fetchStock() {
    loading.value = true
    try {
      const { data } = await api.getStock()
      stocks.value = data
    } catch (error) {
      console.error('Erreur fetch stock:', error)
    } finally {
      loading.value = false
    }
  }

  function getStock(societe, type_bouteille) {
    return stocks.value.find(s => s.societe === societe && s.type_bouteille === type_bouteille)
  }

  async function ajusterStock(id, qte_chargees, qte_vides) {
    try {
      const { data } = await api.updateStock(id, { qte_chargees, qte_vides })
      const idx = stocks.value.findIndex(s => s.id === id)
      if (idx >= 0) stocks.value[idx] = data
    } catch (error) {
      console.error('Erreur update stock:', error)
      throw error
    }
  }

  return {
    stocks,
    loading,
    alertes,
    totalChargees,
    fetchStock,
    getStock,
    ajusterStock,
  }
})