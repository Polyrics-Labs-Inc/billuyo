<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetsStore } from '@/stores/budgets'
import BudgetForm from '@/components/budgets/BudgetForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const budgetsStore = useBudgetsStore()

async function handleSubmit(data: any) {
  await budgetsStore.create(data)
  router.push('/budgets')
}
</script>

<template>
  <div>
    <TopBar :title="t('budgets.newBudget')" showBack />
    <div class="py-4">
      <BudgetForm @submit="handleSubmit" @cancel="router.back()" />
    </div>
  </div>
</template>
