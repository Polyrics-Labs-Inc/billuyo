<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { useBudgetsStore } from '@/stores/budgets'
import { useObligationsStore } from '@/stores/obligations'
import { useCategoriesStore } from '@/stores/categories'
import { formatCurrency } from '@/utils/currency'
import { Plus, TrendingUp, TrendingDown, PiggyBank, Target, Wallet, Settings } from 'lucide-vue-next'
import TransactionCard from '@/components/transactions/TransactionCard.vue'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'

const { t, locale } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const budgetsStore = useBudgetsStore()
const obligationsStore = useObligationsStore()
const categoriesStore = useCategoriesStore()

onMounted(async () => {
  await Promise.all([
    accountsStore.load(),
    transactionsStore.load(),
    budgetsStore.load(),
    obligationsStore.load(),
    categoriesStore.load(),
  ])
})

const totalBalance = computed(() => {
  // This is a simplified balance: sum all credits minus debits by account
  const txns = transactionsStore.items
  const balanceMap = new Map<string, number>()

  for (const acct of accountsStore.items) {
    balanceMap.set(acct.id, acct.initialBalance)
  }

  for (const txn of txns) {
    for (const effect of txn.effects) {
      const current = balanceMap.get(effect.accountId) ?? 0
      if (effect.direction === 'credit') {
        balanceMap.set(effect.accountId, current + effect.amount)
      } else {
        balanceMap.set(effect.accountId, current - effect.amount)
      }
    }
  }

  return Array.from(balanceMap.values()).reduce((a, b) => a + b, 0)
})

const recentTransactions = computed(() => transactionsStore.recent)

const hasTransactions = computed(() => transactionsStore.items.length > 0)
const hasAccounts = computed(() => accountsStore.items.length > 0)

const totalIncome = computed(() => {
  return transactionsStore.items
    .filter(t => t.effects.some(e => e.direction === 'credit'))
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return transactionsStore.items
    .filter(t => t.effects.some(e => e.direction === 'debit'))
    .reduce((sum, t) => sum + t.amount, 0)
})
</script>

<template>
  <div class="py-4 space-y-5">
    <!-- Header greeting -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-bold text-clay-ink">{{ t('app.name') }}</h1>
        <p class="text-xs text-clay-muted">{{ t('app.tagline') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="clay-button-ghost w-10 h-10 rounded-full flex items-center justify-center"
          @click="router.push('/settings')"
        >
          <Settings class="w-5 h-5 text-clay-muted" />
        </button>
        <button
          class="clay-button-primary w-12 h-12 rounded-full flex items-center justify-center"
          @click="router.push('/transactions/new')"
        >
          <Plus class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Balance Card -->
    <ClayCard>
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-clay-muted">{{ t('dashboard.totalBalance') }}</span>
        <Wallet class="w-4 h-4 text-clay-muted" />
      </div>
      <p class="text-2xl font-bold text-clay-ink">
        {{ formatCurrency(totalBalance, appStore.settings.defaultCurrency, appStore.locale) }}
      </p>

      <div class="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-clay-border/30">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <TrendingUp class="w-4 h-4 text-clay-income" />
          </div>
          <div>
            <p class="text-[10px] text-clay-muted">{{ t('dashboard.incomeTotal') }}</p>
            <p class="text-sm font-semibold text-clay-income">
              {{ formatCurrency(totalIncome, appStore.settings.defaultCurrency, appStore.locale) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
            <TrendingDown class="w-4 h-4 text-clay-expense" />
          </div>
          <div>
            <p class="text-[10px] text-clay-muted">{{ t('dashboard.expenseTotal') }}</p>
            <p class="text-sm font-semibold text-clay-expense">
              {{ formatCurrency(totalExpenses, appStore.settings.defaultCurrency, appStore.locale) }}
            </p>
          </div>
        </div>
      </div>
    </ClayCard>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 gap-3">
      <ClayCard padding="p-4" hover>
        <div class="flex items-center gap-2 mb-1">
          <Target class="w-4 h-4 text-clay-primary" />
          <span class="text-xs text-clay-muted">{{ t('dashboard.activeBudgets') }}</span>
        </div>
        <p class="text-lg font-bold text-clay-ink">{{ budgetsStore.items.length }}</p>
      </ClayCard>

      <ClayCard padding="p-4" hover @click="router.push('/obligations')">
        <div class="flex items-center gap-2 mb-1">
          <PiggyBank class="w-4 h-4 text-clay-savings" />
          <span class="text-xs text-clay-muted">{{ t('dashboard.pendingObligations') }}</span>
        </div>
        <p class="text-lg font-bold text-clay-ink">{{ obligationsStore.obligations.length }}</p>
      </ClayCard>
    </div>

    <!-- Recent Transactions -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold text-clay-ink">{{ t('dashboard.recentTransactions') }}</h2>
        <button
          v-if="hasTransactions"
          class="text-xs text-clay-primary font-medium"
          @click="router.push('/transactions')"
        >
          {{ t('common.viewAll') }}
        </button>
      </div>

      <div v-if="!hasTransactions" class="clay-card py-8">
        <ClayEmptyState
          :title="t('dashboard.noTransactions')"
          icon="ArrowLeftRight"
        >
          <ClayButton size="sm" class="mt-3" @click="router.push('/transactions/new')">
            <Plus class="w-4 h-4" /> {{ t('transactions.newTransaction') }}
          </ClayButton>
        </ClayEmptyState>
      </div>

      <div v-else class="space-y-2">
        <TransactionCard
          v-for="txn in recentTransactions"
          :key="txn.id"
          :transaction="txn"
          @click="router.push(`/transactions/${txn.id}`)"
        />
      </div>
    </div>
  </div>
</template>
