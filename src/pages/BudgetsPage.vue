<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useBudgetsStore } from '@/stores/budgets'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { Plus, Target } from 'lucide-vue-next'
import { formatFrequency } from '@/utils/frequency'

const { t } = useI18n()
const router = useRouter()
const budgetsStore = useBudgetsStore()

onMounted(() => budgetsStore.load())
</script>

<template>
  <div>
    <TopBar :title="t('budgets.title')" :right-action="t('common.add')" @right-click="router.push('/budgets/new')" />

    <div class="py-4 space-y-3">
      <div v-if="budgetsStore.items.length === 0">
        <ClayEmptyState
          :title="t('budgets.noBudgets')"
          :description="t('empty.startAdding')"
        >
          <ClayButton class="mt-3" @click="router.push('/budgets/new')">
            <Plus class="w-4 h-4" /> {{ t('budgets.newBudget') }}
          </ClayButton>
        </ClayEmptyState>
      </div>

      <ClayCard
        v-for="entry in budgetsStore.items"
        :key="entry.id"
        hover
        @click="router.push(`/budgets/${entry.id}`)"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-clay-sm flex items-center justify-center"
            :style="{ backgroundColor: entry.color + '20' }"
          >
            <Target class="w-6 h-6" :style="{ color: entry.color }" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-clay-ink">{{ entry.name }}</p>
            <p class="text-xs text-clay-muted">{{ formatFrequency(entry.frequency, t) }}</p>
          </div>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
