<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useAppStore } from '@/stores/app'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { generateId } from '@/utils/id'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const transactionsStore = useTransactionsStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const appStore = useAppStore()

const id = route.params.id as string
const transaction = computed(() => transactionsStore.getById(id))

onMounted(async () => {
  await Promise.all([
    transactionsStore.load(),
    accountsStore.load(),
    categoriesStore.load(),
  ])
})

async function handleSubmit(data: {
  amount: number
  currency: string
  date: string
  time: string
  description: string
  effects: { accountId: string; direction: 'credit' | 'debit'; amount: number; categoryId: string }[]
}) {
  const existing = transaction.value
  const effects = data.effects.map((e, i) => ({
    ...e,
    id: existing?.effects[i]?.id ?? generateId(),
    transactionId: id,
  }))
  await transactionsStore.update(id, { ...data, effects })
  router.push(`/transactions/${id}`)
}
</script>

<template>
  <div>
    <TopBar :title="t('transactions.editTransaction')" showBack />
    <div class="py-4" v-if="transaction">
      <TransactionForm
        :accounts="accountsStore.items"
        :categories="categoriesStore.items"
        :default-currency="appStore.settings.defaultCurrency"
        :initial-data="{
          amount: transaction.amount,
          currency: transaction.currency,
          date: transaction.date,
          time: transaction.time,
          description: transaction.description,
          effects: transaction.effects,
        }"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
