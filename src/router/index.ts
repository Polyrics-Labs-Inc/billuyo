import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/pages/OnboardingPage.vue'),
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', name: 'dashboard', component: () => import('@/pages/DashboardPage.vue') },
      { path: 'transactions', name: 'transactions', component: () => import('@/pages/TransactionsPage.vue') },
      { path: 'transactions/new', name: 'transaction-new', component: () => import('@/pages/TransactionNewPage.vue') },
      { path: 'transactions/:id', name: 'transaction-detail', component: () => import('@/pages/TransactionDetailPage.vue') },
      { path: 'transactions/:id/edit', name: 'transaction-edit', component: () => import('@/pages/TransactionEditPage.vue') },
      { path: 'accounts', name: 'accounts', component: () => import('@/pages/AccountsPage.vue') },
      { path: 'accounts/new', name: 'account-new', component: () => import('@/pages/AccountNewPage.vue') },
      { path: 'accounts/:id', name: 'account-detail', component: () => import('@/pages/AccountDetailPage.vue') },
      { path: 'tracking', name: 'tracking', component: () => import('@/pages/TrackingPage.vue') },
      { path: 'tracking/new', name: 'tracking-new', component: () => import('@/pages/TrackingNewPage.vue') },
      { path: 'tracking/:id', name: 'tracking-detail', component: () => import('@/pages/TrackingDetailPage.vue') },
      { path: 'tracking/:id/edit', name: 'tracking-edit', component: () => import('@/pages/TrackingEditPage.vue') },
      { path: 'categories', name: 'categories', component: () => import('@/pages/CategoriesPage.vue') },
      { path: 'settings', name: 'settings', component: () => import('@/pages/SettingsPage.vue') },
      { path: 'obligations', name: 'obligations', component: () => import('@/pages/ObligationsPage.vue') },
      { path: 'obligations/new', name: 'obligation-new', component: () => import('@/pages/ObligationNewPage.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
