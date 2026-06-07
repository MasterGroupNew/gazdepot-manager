import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Stock from '../views/Stock.vue'
import Transactions from '../views/Transactions.vue'
import Approvisionnements from '../views/Approvisionnements.vue'
import Charges from '../views/Charges.vue'
import Rapports from '../views/Rapports.vue'
import Parametres from '../views/Parametres.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Dashboard, meta: { requireAuth: true } },
  { path: '/stock', component: Stock, meta: { requireAuth: true, requireEditor: true } },
  { path: '/transactions', component: Transactions, meta: { requireAuth: true, requireEditor: true } },
  { path: '/approvisionnements', component: Approvisionnements, meta: { requireAuth: true, requireEditor: true } },
  { path: '/charges', component: Charges, meta: { requireAuth: true, requireEditor: true } },
  { path: '/rapports', component: Rapports, meta: { requireAuth: true } },
  { path: '/parametres', component: Parametres, meta: { requireAuth: true, requireEditor: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.initializeAuth()

  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requireEditor && !authStore.isEditor) {
    next('/')
  } else {
    next()
  }
})

export default router