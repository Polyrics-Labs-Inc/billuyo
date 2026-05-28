<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/currency'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/categories'
import { useAccountsStore } from '@/stores/accounts'
import { ArrowRight, ArrowLeft, CornerDownRight } from 'lucide-vue-next'
import type { Transaction } from '@/types'
import { useAppStore } from '@/stores/app'

const props = defineProps<{
  transaction: Transaction
}>()

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const appStore = useAppStore()

const directionIcon = computed(() => {
  const first = props.transaction.effects[0]
  return first?.direction === 'credit' ? 'credit' : 'debit'
})

const primaryCategory = computed(() => {
  const catId = props.transaction.effects[0]?.categoryId
  return categoriesStore.getById(catId ?? '')
})

const accountNames = computed(() => {
  return props.transaction.effects.map(e => {
    const account = accountsStore.getById(e.accountId)
    return account?.name ?? 'Unknown'
  }).join(', ')
})

const formattedAmount = computed(() =>
  formatCurrency(props.transaction.amount, props.transaction.currency, appStore.locale)
)
</script>

<template>
  <div class="clay-card-hover p-4 flex items-start gap-3 cursor-pointer">
    <div
      class="w-10 h-10 rounded-clay-sm flex items-center justify-center shrink-0"
      :class="directionIcon === 'credit' ? 'bg-emerald-50' : 'bg-rose-50'"
    >
      <component
        :is="directionIcon === 'credit' ? ArrowLeft : ArrowRight"
        class="w-5 h-5"
        :class="directionIcon === 'credit' ? 'text-clay-income' : 'text-clay-expense'"
      />
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <p class="font-medium text-sm text-clay-ink truncate">{{ transaction.description || t('common.noData') }}</p>
        <span class="text-sm font-semibold" :class="directionIcon === 'credit' ? 'text-clay-income' : 'text-clay-expense'">
          {{ directionIcon === 'credit' ? '+' : '-' }}{{ formattedAmount }}
        </span>
      </div>
      <div class="flex items-center gap-2 mt-1 text-xs text-clay-muted">
        <span>{{ transaction.date }}</span>
        <span v-if="primaryCategory" class="clay-badge" :style="{ backgroundColor: primaryCategory.color + '20', color: primaryCategory.color }">
          {{ primaryCategory.name }}
        </span>
      </div>
      <p class="text-[11px] text-clay-muted/70 mt-0.5 truncate">{{ accountNames }}</p>
    </div>
  </div>
</template>
