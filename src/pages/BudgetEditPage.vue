<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetsStore } from '@/stores/budgets'
import BudgetForm from '@/components/budgets/BudgetForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const budgetsStore = useBudgetsStore()

const id = route.params.id as string
const budget = computed(() => budgetsStore.getById(id))

onMounted(() => budgetsStore.load())

async function handleSubmit(data: any) {
  await budgetsStore.update(id, data)
  router.push(`/budgets/${id}`)
}
</script>

<template>
  <div>
    <TopBar :title="t('budgets.editBudget')" showBack />
    <div class="py-4" v-if="budget">
      <BudgetForm
        :initial-data="{
          name: budget.name,
          description: budget.description,
          frequency: budget.frequency,
          color: budget.color,
          icon: budget.icon,
        }"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
