<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useAppStore } from '@/stores/app'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const transactionsStore = useTransactionsStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const appStore = useAppStore()

onMounted(async () => {
  await Promise.all([
    accountsStore.load(),
    categoriesStore.load(),
  ])
})

async function handleSubmit(data: any) {
  await transactionsStore.create(data)
  router.push('/transactions')
}
</script>

<template>
  <div>
    <TopBar :title="t('transactions.newTransaction')" showBack />
    <div class="py-4">
      <TransactionForm
        :accounts="accountsStore.items"
        :categories="categoriesStore.items"
        :default-currency="appStore.settings.defaultCurrency"
        :default-account-id="accountsStore.defaultExpense?.id"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
