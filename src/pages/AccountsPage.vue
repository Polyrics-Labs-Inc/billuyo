<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { useAppStore } from '@/stores/app'
import { formatCurrency } from '@/utils/currency'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { Plus, Wallet } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const appStore = useAppStore()

onMounted(async () => {
  await Promise.all([
    accountsStore.load(),
    transactionsStore.load(),
  ])
})

function getBalance(accountId: string): number {
  const account = accountsStore.getById(accountId)
  let balance = account?.initialBalance ?? 0
  for (const txn of transactionsStore.items) {
    for (const effect of txn.effects) {
      if (effect.accountId === accountId) {
        balance += effect.direction === 'credit' ? effect.amount : -effect.amount
      }
    }
  }
  return balance
}
</script>

<template>
  <div>
    <TopBar :title="t('accounts.title')" :right-action="t('common.add')" @right-click="router.push('/accounts/new')" />

    <div class="py-4 space-y-3">
      <div v-if="accountsStore.items.length === 0">
        <ClayEmptyState
          :title="t('accounts.noAccounts')"
          :description="t('empty.startAdding')"
        >
          <ClayButton class="mt-3" @click="router.push('/accounts/new')">
            <Plus class="w-4 h-4" /> {{ t('accounts.newAccount') }}
          </ClayButton>
        </ClayEmptyState>
      </div>

      <ClayCard
        v-for="account in accountsStore.items"
        :key="account.id"
        hover
        @click="router.push(`/accounts/${account.id}`)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-clay-sm flex items-center justify-center"
            :style="{ backgroundColor: account.color + '20' }"
          >
            <Wallet class="w-6 h-6" :style="{ color: account.color }" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-clay-ink">{{ account.name }}</p>
            <p class="text-xs text-clay-muted">{{ account.currency }} · {{ account.description || t('common.noDescription') || '' }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-clay-ink">
              {{ formatCurrency(getBalance(account.id), account.currency, appStore.locale) }}
            </p>
            <p class="text-[10px] text-clay-muted">{{ t('accounts.balance') }}</p>
          </div>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
