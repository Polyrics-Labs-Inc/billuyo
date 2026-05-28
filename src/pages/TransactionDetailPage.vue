<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useObligationsStore } from '@/stores/obligations'
import { useAppStore } from '@/stores/app'
import { formatCurrency } from '@/utils/currency'
import { categoryDisplayName } from '@/utils/category'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayConfirmDialog from '@/components/ui/ClayConfirmDialog.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { Trash2, Pencil } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const transactionsStore = useTransactionsStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const obligationsStore = useObligationsStore()
const appStore = useAppStore()

const id = route.params.id as string
const transaction = computed(() => transactionsStore.getById(id))
const showDeleteConfirm = ref(false)

onMounted(async () => {
  await Promise.all([
    transactionsStore.load(),
    accountsStore.load(),
    categoriesStore.load(),
  ])
})

function getAccountName(id: string) {
  return accountsStore.getById(id)?.name ?? 'Unknown'
}

function getCategoryName(id: string) {
  const cat = categoriesStore.getById(id)
  return cat ? categoryDisplayName(cat, t) : 'Unknown'
}

async function confirmDelete() {
  const txn = transaction.value
  if (txn?.obligationActionId) {
    await obligationsStore.removeAction(txn.obligationActionId)
  }
  await transactionsStore.remove(id)
  router.push('/transactions')
}
</script>

<template>
  <div v-if="transaction">
    <TopBar :title="t('transactions.title')" showBack />

    <div class="py-4 space-y-4 animate-fade-in">
      <ClayCard>
        <div class="text-center">
          <p class="text-3xl font-bold mb-1">
            {{ formatCurrency(transaction.amount, transaction.currency, appStore.locale) }}
          </p>
          <p class="text-lg text-clay-ink">{{ transaction.description }}</p>
          <p class="text-sm text-clay-muted mt-1">{{ transaction.date }} · {{ transaction.time }}</p>
        </div>
      </ClayCard>

      <ClayCard>
        <h3 class="text-sm font-semibold text-clay-ink mb-3">{{ t('transactions.transactionEffects') }}</h3>
        <div class="space-y-2">
          <div
            v-for="effect in transaction.effects"
            :key="effect.id"
            class="flex items-center justify-between p-3 bg-clay-bg rounded-clay-sm"
          >
            <div>
              <p class="text-sm font-medium text-clay-ink">{{ getAccountName(effect.accountId) }}</p>
              <p class="text-xs text-clay-muted">{{ t(effect.direction === 'credit' ? 'transactions.credit' : 'transactions.debit') }} · {{ getCategoryName(effect.categoryId) }}</p>
            </div>
            <span
              class="text-sm font-semibold"
              :class="effect.direction === 'credit' ? 'text-clay-income' : 'text-clay-expense'"
            >
              {{ effect.direction === 'credit' ? '+' : '-' }}{{ formatCurrency(effect.amount, transaction.currency, appStore.locale) }}
            </span>
          </div>
        </div>
      </ClayCard>

      <div class="flex gap-3">
        <ClayButton variant="secondary" class="flex-1" @click="router.push(`/transactions/${id}/edit`)">
          <Pencil class="w-4 h-4" /> {{ t('common.edit') }}
        </ClayButton>
        <ClayButton variant="danger" class="flex-1" @click="showDeleteConfirm = true">
          <Trash2 class="w-4 h-4" /> {{ t('common.delete') }}
        </ClayButton>
      </div>
    </div>

    <ClayConfirmDialog
      :show="showDeleteConfirm"
      :title="t('common.delete')"
      :message="t('common.confirmDelete')"
      variant="danger"
      @confirm="confirmDelete()"
      @cancel="showDeleteConfirm = false"
    />
  </div>
  <div v-else>
    <TopBar showBack />
    <p class="text-center text-clay-muted mt-8">{{ t('common.loading') }}</p>
  </div>
</template>
