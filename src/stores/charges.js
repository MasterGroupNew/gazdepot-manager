import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useChargesStore = defineStore('charges', () => {

  const charges = ref([])
  const prix = ref([])
  const loading = ref(false)

  const totalChargesMois = computed(() => {
    const mois = new Date().toISOString().slice(0, 7)
    return charges.value
      .filter(c => c.periode === mois)
      .reduce((sum, c) => sum + c.montant, 0)
  })

  async function fetchCharges() {
    loading.value = true
    try {
      const { data } = await api.getCharges()
      charges.value = data
    } catch (error) {
      console.error('Erreur fetch charges:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchPrix() {
    try {
      const { data } = await api.getPrix()
      prix.value = data
    } catch (error) {
      console.error('Erreur fetch prix:', error)
    }
  }

  async function ajouterCharge(charge) {
    try {
      const { data } = await api.createCharge(charge)
      charges.value.unshift(data)
    } catch (error) {
      console.error('Erreur create charge:', error)
      throw error
    }
  }

  async function supprimerCharge(id) {
    try {
      await api.deleteCharge(id)
      charges.value = charges.value.filter(c => c.id !== id)
    } catch (error) {
      console.error('Erreur delete charge:', error)
    }
  }

  function getPrixSociete(societe, type) {
    return prix.value.find(p => p.societe === societe && p.type_bouteille === type)?.valeur ?? 0
  }

  async function modifierPrix(id, valeur) {
    try {
      const { data } = await api.updatePrix(id, { valeur })
      const idx = prix.value.findIndex(p => p.id === id)
      if (idx >= 0) prix.value[idx] = data
    } catch (error) {
      console.error('Erreur update prix:', error)
    }
  }

  return {
    charges,
    prix,
    loading,
    totalChargesMois,
    fetchCharges,
    fetchPrix,
    ajouterCharge,
    supprimerCharge,
    getPrixSociete,
    modifierPrix,
  }
})