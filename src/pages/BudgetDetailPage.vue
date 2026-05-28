<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetsStore } from '@/stores/budgets'
import { useObligationsStore } from '@/stores/obligations'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useTransactionsStore } from '@/stores/transactions'
import { useAppStore } from '@/stores/app'
import { formatCurrency } from '@/utils/currency'
import {
  getCurrentPeriod, getPreviousPeriod, getNextPeriod,
} from '@/utils/frequency'
import { isoDate, isoTime } from '@/utils/id'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayBadge from '@/components/ui/ClayBadge.vue'
import ClayPromptDialog from '@/components/ui/ClayPromptDialog.vue'
import ClayConfirmDialog from '@/components/ui/ClayConfirmDialog.vue'
import TopBar from '@/components/layout/TopBar.vue'
import type { PeriodInfo, Obligation } from '@/types'
import { ChevronLeft, ChevronRight, Check, Circle, TrendingUp, TrendingDown, PiggyBank, Pencil, RotateCcw } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const budgetsStore = useBudgetsStore()
const obligationsStore = useObligationsStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()
const appStore = useAppStore()

const id = route.params.id as string
const entry = computed(() => budgetsStore.getById(id))

const currentPeriod = ref<PeriodInfo>({ start: new Date(), end: new Date(), label: '' })

onMounted(async () => {
  await Promise.all([
    budgetsStore.load(),
    obligationsStore.load(),
    accountsStore.load(),
    categoriesStore.load(),
    transactionsStore.load(),
  ])
  if (entry.value) {
    currentPeriod.value = getCurrentPeriod(entry.value.frequency)
  }
})

function goPrevious() {
  if (entry.value) {
    currentPeriod.value = getPreviousPeriod(currentPeriod.value, entry.value.frequency)
  }
}

function goNext() {
  if (entry.value) {
    const next = getNextPeriod(currentPeriod.value, entry.value.frequency)
    const now = new Date()
    if (next.start > now) return
    currentPeriod.value = next
  }
}

const obligationsForPeriod = computed(() => {
  if (!entry.value) return []
  return obligationsStore.obligations.filter(o =>
    !o.budgetId || o.budgetId === entry.value!.id
  )
})

function getActionForObligation(obligation: Obligation) {
  return obligationsStore.getActionForObligationInPeriod(obligation.id, currentPeriod.value)
}

const incomeObligations = computed(() =>
  obligationsForPeriod.value.filter(o => o.type === 'income')
)
const expenseObligations = computed(() =>
  obligationsForPeriod.value.filter(o => o.type === 'expense')
)
const savingsObligations = computed(() =>
  obligationsForPeriod.value.filter(o => o.type === 'savings')
)

const showPrompt = ref(false)
const pendingObligation = ref<Obligation | null>(null)
const promptInitialValue = ref(0)

function markObligationDone(obligation: Obligation) {
  const existing = getActionForObligation(obligation)
  if (existing) return
  pendingObligation.value = obligation
  promptInitialValue.value = obligation.expectedValue
  showPrompt.value = true
}

async function handlePromptConfirm(amount: number) {
  showPrompt.value = false
  const obligation = pendingObligation.value
  if (!obligation) return
  if (isNaN(amount) || amount <= 0) return
  pendingObligation.value = null

  const action = await obligationsStore.createAction({
    obligationId: obligation.id,
    actualAmount: amount,
    date: isoDate(),
    time: isoTime(),
    periodStart: currentPeriod.value.start.toISOString(),
    periodEnd: currentPeriod.value.end.toISOString(),
    completed: true,
  })

  const account = accountsStore.getById(obligation.accountId)
  if (!account) return

  let direction: 'credit' | 'debit'
  if (obligation.type === 'income') {
    direction = 'credit'
  } else {
    direction = 'debit'
  }

  const effects = []
  if (obligation.type === 'savings') {
    const savingsTarget = accountsStore.defaultSavings
    if (savingsTarget) {
      effects.push(
        { accountId: obligation.accountId, direction: 'debit' as const, amount, categoryId: obligation.categoryId },
        { accountId: savingsTarget.id, direction: 'credit' as const, amount, categoryId: obligation.categoryId },
      )
    }
  } else {
    effects.push({ accountId: obligation.accountId, direction, amount, categoryId: obligation.categoryId })
  }

  if (effects.length > 0) {
    const txn = await transactionsStore.create({
      amount,
      currency: obligation.currency,
      date: isoDate(),
      time: isoTime(),
      description: `${obligation.name} - ${t('budgets.obligationCompleted')}`,
      effects,
      obligationActionId: action.id,
    })
    await obligationsStore.updateAction(action.id, { transactionId: txn.id })
  }
}

const undoAction = ref<{ actionId: string; obligation: Obligation } | null>(null)

async function confirmUndo() {
  if (!undoAction.value) return
  const { actionId, obligation } = undoAction.value
  const action = getActionForObligation(obligation)
  if (action?.transactionId) {
    await transactionsStore.remove(action.transactionId)
  }
  await obligationsStore.removeAction(actionId)
  undoAction.value = null
}

function getSummary() {
  const incomeTotal = incomeObligations.value.reduce((sum, o) => {
    const action = getActionForObligation(o)
    return sum + (action ? action.actualAmount : 0)
  }, 0)
  const expenseTotal = expenseObligations.value.reduce((sum, o) => {
    const action = getActionForObligation(o)
    return sum + (action ? action.actualAmount : 0)
  }, 0)
  const savingsTotal = savingsObligations.value.reduce((sum, o) => {
    const action = getActionForObligation(o)
    return sum + (action ? action.actualAmount : 0)
  }, 0)
  return { incomeTotal, expenseTotal, savingsTotal }
}

const summary = computed(() => getSummary())
</script>

<template>
  <div v-if="entry">
    <TopBar :title="entry.name" showBack />

    <div class="py-4 space-y-4 animate-fade-in">
      <ClayCard>
        <div class="flex items-center justify-between">
          <button class="clay-button-ghost p-2" @click="goPrevious">
            <ChevronLeft class="w-5 h-5 text-clay-muted" />
          </button>
          <div class="text-center">
            <p class="text-xs text-clay-muted">{{ t('budgets.currentPeriod') }}</p>
            <p class="text-sm font-medium text-clay-ink">{{ currentPeriod.label }}</p>
          </div>
          <button class="clay-button-ghost p-2" @click="goNext">
            <ChevronRight class="w-5 h-5 text-clay-muted" />
          </button>
        </div>
      </ClayCard>

      <div v-if="incomeObligations.length">
        <h3 class="text-sm font-semibold text-clay-ink mb-2 flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-clay-income" />
          {{ t('budgets.incomeSection') }}
        </h3>
        <div class="space-y-2">
          <ClayCard v-for="obl in incomeObligations" :key="obl.id" padding="p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-clay-ink">{{ obl.name }}</p>
                <p class="text-xs text-clay-muted">{{ formatCurrency(obl.expectedValue, obl.currency, appStore.locale) }}</p>
              </div>
              <button
                v-if="!getActionForObligation(obl)"
                class="clay-button-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                @click="markObligationDone(obl)"
              >
                <Check class="w-3.5 h-3.5" />
                {{ t('budgets.markDone') }}
              </button>
              <button
                v-else
                class="clay-button-ghost text-xs px-2 py-1 flex items-center gap-1 text-clay-income"
                @click="undoAction = { actionId: getActionForObligation(obl)!.id, obligation: obl }"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                {{ t('budgets.obligationCompleted') }}
              </button>
            </div>
          </ClayCard>
        </div>
      </div>

      <div v-if="expenseObligations.length">
        <h3 class="text-sm font-semibold text-clay-ink mb-2 flex items-center gap-2">
          <TrendingDown class="w-4 h-4 text-clay-expense" />
          {{ t('budgets.expenseSection') }}
        </h3>
        <div class="space-y-2">
          <ClayCard v-for="obl in expenseObligations" :key="obl.id" padding="p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-clay-ink">{{ obl.name }}</p>
                <p class="text-xs text-clay-muted">{{ formatCurrency(obl.expectedValue, obl.currency, appStore.locale) }}</p>
              </div>
              <button
                v-if="!getActionForObligation(obl)"
                class="clay-button-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                @click="markObligationDone(obl)"
              >
                <Check class="w-3.5 h-3.5" />
                {{ t('budgets.markPaid') }}
              </button>
              <button
                v-else
                class="clay-button-ghost text-xs px-2 py-1 flex items-center gap-1 text-clay-expense"
                @click="undoAction = { actionId: getActionForObligation(obl)!.id, obligation: obl }"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                {{ t('budgets.obligationCompleted') }}
              </button>
            </div>
          </ClayCard>
        </div>
      </div>

      <div v-if="savingsObligations.length">
        <h3 class="text-sm font-semibold text-clay-ink mb-2 flex items-center gap-2">
          <PiggyBank class="w-4 h-4 text-clay-savings" />
          {{ t('budgets.savingsSection') }}
        </h3>
        <div class="space-y-2">
          <ClayCard v-for="obl in savingsObligations" :key="obl.id" padding="p-3">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-clay-ink">{{ obl.name }}</p>
                <p class="text-xs text-clay-muted">{{ formatCurrency(obl.expectedValue, obl.currency, appStore.locale) }}</p>
              </div>
              <button
                v-if="!getActionForObligation(obl)"
                class="clay-button-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                @click="markObligationDone(obl)"
              >
                <Check class="w-3.5 h-3.5" />
                {{ t('budgets.markPaid') }}
              </button>
              <button
                v-else
                class="clay-button-ghost text-xs px-2 py-1 flex items-center gap-1 text-clay-savings"
                @click="undoAction = { actionId: getActionForObligation(obl)!.id, obligation: obl }"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                {{ t('budgets.obligationCompleted') }}
              </button>
            </div>
          </ClayCard>
        </div>
      </div>

      <div v-if="obligationsForPeriod.length === 0" class="text-center py-8">
        <Circle class="w-8 h-8 text-clay-muted/40 mx-auto mb-2" />
        <p class="text-sm text-clay-muted">{{ t('budgets.noObligations') }}</p>
      </div>

      <ClayCard v-if="obligationsForPeriod.length">
        <h3 class="text-sm font-semibold text-clay-ink mb-3">{{ t('budgets.summary') }}</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-clay-income">{{ t('budgets.totalIncome') }}</span>
            <span class="font-medium">{{ formatCurrency(summary.incomeTotal, appStore.settings.defaultCurrency, appStore.locale) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-clay-expense">{{ t('budgets.totalExpenses') }}</span>
            <span class="font-medium">{{ formatCurrency(summary.expenseTotal, appStore.settings.defaultCurrency, appStore.locale) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-clay-savings">{{ t('budgets.totalSavings') }}</span>
            <span class="font-medium">{{ formatCurrency(summary.savingsTotal, appStore.settings.defaultCurrency, appStore.locale) }}</span>
          </div>
        </div>
      </ClayCard>

      <ClayButton variant="secondary" class="w-full" @click="router.push(`/budgets/${id}/edit`)">
        <Pencil class="w-4 h-4" /> {{ t('common.edit') }}
      </ClayButton>
    </div>

    <ClayPromptDialog
      :show="showPrompt"
      :title="t('budgets.markDone')"
      :label="t('common.actualAmount')"
      :initial-value="promptInitialValue"
      @confirm="handlePromptConfirm"
      @cancel="showPrompt = false; pendingObligation = null"
    />

    <ClayConfirmDialog
      :show="!!undoAction"
      :title="t('budgets.undoComplete') || 'Undo completion'"
      :message="t('budgets.undoCompleteDesc') || 'This will remove the transaction and unmark this obligation.'"
      variant="danger"
      confirm-label="Undo"
      @confirm="confirmUndo()"
      @cancel="undoAction = null"
    />
  </div>
</template>
