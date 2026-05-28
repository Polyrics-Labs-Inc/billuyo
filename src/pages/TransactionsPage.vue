<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTransactionsStore } from '@/stores/transactions'
import { Plus } from 'lucide-vue-next'
import TransactionCard from '@/components/transactions/TransactionCard.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'
import ClayButton from '@/components/ui/ClayButton.vue'

const { t } = useI18n()
const router = useRouter()
const transactionsStore = useTransactionsStore()

onMounted(() => transactionsStore.load())

function goNew() {
  router.push('/transactions/new')
}
</script>

<template>
  <div class="py-4 space-y-3">
    <div v-if="transactionsStore.items.length === 0" class="mt-8">
      <ClayEmptyState
        :title="t('transactions.noTransactions')"
        :description="t('empty.startAdding')"
      >
        <ClayButton class="mt-3" @click="goNew">
          <Plus class="w-4 h-4" /> {{ t('transactions.newTransaction') }}
        </ClayButton>
      </ClayEmptyState>
    </div>

    <div v-else class="space-y-2">
      <TransactionCard
        v-for="txn in transactionsStore.sorted"
        :key="txn.id"
        :transaction="txn"
        @click="router.push(`/transactions/${txn.id}`)"
      />
    </div>

    <!-- FAB -->
    <button
      class="fixed bottom-20 right-4 z-30 clay-button-primary w-14 h-14 rounded-full flex items-center justify-center shadow-clay-float"
      @click="goNew"
    >
      <Plus class="w-6 h-6" />
    </button>
  </div>
</template>
