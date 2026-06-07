import axios from 'axios'

const API_BASE = 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export default {
  // Stock
  getStock: () => api.get('/stock'),
  updateStock: (id, data) => api.patch(`/stock/${id}`, data),

  // Transactions
  getTransactions: () => api.get('/transactions'),
  createTransaction: (data) => {
    // Convertir la date en DateTime avant d'envoyer
    const payload = {
      ...data,
      date: new Date(data.date),
    }
    return api.post('/transactions', payload)
  },
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),

  // Charges
  getCharges: () => api.get('/charges'),
  createCharge: (data) => {
    const payload = {
      ...data,
    }
    return api.post('/charges', payload)
  },
  deleteCharge: (id) => api.delete(`/charges/${id}`),

  // Prix
  getPrix: () => api.get('/prix'),
  updatePrix: (id, data) => api.patch(`/prix/${id}`, data),

  // Rapports
  getRapportJour: (date) => api.get(`/rapports/jour?date=${date}`),
  getRapportMois: (mois) => api.get(`/rapports/mois?mois=${mois}`),
}