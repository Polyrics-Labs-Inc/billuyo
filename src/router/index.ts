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
      { path: 'accounts/:id/edit', name: 'account-edit', component: () => import('@/pages/AccountEditPage.vue') },
      { path: 'budgets', name: 'budgets', component: () => import('@/pages/BudgetsPage.vue') },
      { path: 'budgets/new', name: 'budget-new', component: () => import('@/pages/BudgetNewPage.vue') },
      { path: 'budgets/:id', name: 'budget-detail', component: () => import('@/pages/BudgetDetailPage.vue') },
      { path: 'budgets/:id/edit', name: 'budget-edit', component: () => import('@/pages/BudgetEditPage.vue') },
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
