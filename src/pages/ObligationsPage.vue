<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useObligationsStore } from '@/stores/obligations'
import { useAccountsStore } from '@/stores/accounts'
import { useAppStore } from '@/stores/app'
import { formatCurrency } from '@/utils/currency'
import { formatFrequency } from '@/utils/frequency'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayBadge from '@/components/ui/ClayBadge.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { Plus, TrendingUp, TrendingDown, PiggyBank, Trash2 } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const obligationsStore = useObligationsStore()
const accountsStore = useAccountsStore()
const appStore = useAppStore()

onMounted(async () => {
  await Promise.all([
    obligationsStore.load(),
    accountsStore.load(),
  ])
})

function getAccountName(id: string) {
  return accountsStore.getById(id)?.name ?? 'Unknown'
}

async function handleDelete(id: string) {
  if (!confirm(t('common.confirmDelete'))) return
  await obligationsStore.removeObligation(id)
}

const typeIcon: Record<string, any> = {
  income: TrendingUp,
  expense: TrendingDown,
  savings: PiggyBank,
}
</script>

<template>
  <div>
    <TopBar :title="t('obligations.title')" :right-action="t('common.add')" @right-click="router.push('/obligations/new')" />

    <div class="py-4 space-y-3">
      <div v-if="obligationsStore.obligations.length === 0">
        <ClayEmptyState
          :title="t('obligations.noObligations')"
          :description="t('empty.startAdding')"
        >
          <ClayButton class="mt-3" @click="router.push('/obligations/new')">
            <Plus class="w-4 h-4" /> {{ t('obligations.newObligation') }}
          </ClayButton>
        </ClayEmptyState>
      </div>

      <ClayCard
        v-for="obl in obligationsStore.obligations"
        :key="obl.id"
        padding="p-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-clay-sm flex items-center justify-center"
            :class="{
              'bg-emerald-50': obl.type === 'income',
              'bg-rose-50': obl.type === 'expense',
              'bg-amber-50': obl.type === 'savings',
            }"
          >
            <component
              :is="typeIcon[obl.type]"
              class="w-5 h-5"
              :class="{
                'text-clay-income': obl.type === 'income',
                'text-clay-expense': obl.type === 'expense',
                'text-clay-savings': obl.type === 'savings',
              }"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="text-sm font-medium text-clay-ink">{{ obl.name }}</p>
              <ClayBadge
                :variant="obl.type === 'income' ? 'income' : obl.type === 'expense' ? 'expense' : 'savings'"
              >
                {{ t(`obligations.type_${obl.type}`) }}
              </ClayBadge>
            </div>
            <p class="text-xs text-clay-muted mt-0.5">
              {{ formatCurrency(obl.expectedValue, obl.currency, appStore.locale) }}
            </p>
            <p class="text-xs text-clay-muted/70">{{ formatFrequency(obl.frequency, t) }}</p>
            <p class="text-xs text-clay-muted/70">{{ t('obligations.associatedAccount') }}: {{ getAccountName(obl.accountId) }}</p>
          </div>
          <button class="clay-button-ghost p-1.5" @click="handleDelete(obl.id)">
            <Trash2 class="w-4 h-4 text-clay-expense" />
          </button>
        </div>
      </ClayCard>
    </div>
  </div>
</template>
