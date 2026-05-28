<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { useAppStore } from '@/stores/app'
import { formatCurrency } from '@/utils/currency'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayConfirmDialog from '@/components/ui/ClayConfirmDialog.vue'
import TopBar from '@/components/layout/TopBar.vue'
import TransactionCard from '@/components/transactions/TransactionCard.vue'
import { Trash2, Wallet, Pencil } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const appStore = useAppStore()

const id = route.params.id as string
const account = computed(() => accountsStore.getById(id))
const showDeleteConfirm = ref(false)
const showDeleteWarning = ref(false)

onMounted(async () => {
  await Promise.all([
    accountsStore.load(),
    transactionsStore.load(),
  ])
})

const balance = computed(() => {
  if (!account.value) return 0
  let bal = account.value.initialBalance
  for (const txn of transactionsStore.items) {
    for (const effect of txn.effects) {
      if (effect.accountId === id) {
        bal += effect.direction === 'credit' ? effect.amount : -effect.amount
      }
    }
  }
  return bal
})

const accountTransactions = computed(() =>
  transactionsStore.sorted.filter(t => t.effects.some(e => e.accountId === id))
)

function promptDelete() {
  if (accountTransactions.value.length > 0) {
    showDeleteWarning.value = true
    return
  }
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  await accountsStore.remove(id)
  router.push('/accounts')
}
</script>

<template>
  <div v-if="account">
    <TopBar :title="account.name" showBack />

    <div class="py-4 space-y-4 animate-fade-in">
      <ClayCard>
        <div class="flex flex-col items-center text-center">
          <div
            class="w-16 h-16 rounded-clay-lg flex items-center justify-center mb-3"
            :style="{ backgroundColor: account.color + '20' }"
          >
            <Wallet class="w-8 h-8" :style="{ color: account.color }" />
          </div>
          <p class="text-xs text-clay-muted">{{ account.currency }}</p>
          <p class="text-2xl font-bold text-clay-ink mt-1">
            {{ formatCurrency(balance, account.currency, appStore.locale) }}
          </p>
          <p v-if="account.description" class="text-sm text-clay-muted mt-2">{{ account.description }}</p>
        </div>
      </ClayCard>

      <div>
        <h3 class="text-sm font-semibold text-clay-ink mb-3">{{ t('transactions.title') }}</h3>
        <div class="space-y-2">
          <TransactionCard
            v-for="txn in accountTransactions"
            :key="txn.id"
            :transaction="txn"
            @click="router.push(`/transactions/${txn.id}`)"
          />
          <p v-if="accountTransactions.length === 0" class="text-sm text-clay-muted text-center py-4">
            {{ t('transactions.noTransactions') }}
          </p>
        </div>
      </div>

      <div class="flex gap-3">
        <ClayButton variant="secondary" class="flex-1" @click="router.push(`/accounts/${id}/edit`)">
          <Pencil class="w-4 h-4" /> {{ t('common.edit') }}
        </ClayButton>
        <ClayButton variant="danger" class="flex-1" @click="promptDelete">
          <Trash2 class="w-4 h-4" /> {{ t('common.delete') }}
        </ClayButton>
      </div>
    </div>

    <ClayConfirmDialog
      :show="showDeleteWarning"
      :title="t('accounts.deleteWarning')"
      :message="t('accounts.deleteWarning')"
      :hide-confirm="true"
      cancel-label="OK"
      @cancel="showDeleteWarning = false"
    />

    <ClayConfirmDialog
      :show="showDeleteConfirm"
      :title="t('common.delete')"
      :message="t('common.confirmDelete')"
      variant="danger"
      @confirm="confirmDelete()"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
