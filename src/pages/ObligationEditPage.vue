<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useObligationsStore } from '@/stores/obligations'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useAppStore } from '@/stores/app'
import ObligationForm from '@/components/budgets/ObligationForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const obligationsStore = useObligationsStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const appStore = useAppStore()

const id = route.params.id as string
const obligation = computed(() => obligationsStore.getObligationById(id))

onMounted(async () => {
  await Promise.all([
    obligationsStore.load(),
    accountsStore.load(),
    categoriesStore.load(),
  ])
})

async function handleSubmit(data: any) {
  await obligationsStore.updateObligation(id, data)
  router.push('/obligations')
}
</script>

<template>
  <div>
    <TopBar :title="t('obligations.editObligation')" showBack />
    <div class="py-4" v-if="obligation">
      <ObligationForm
        :accounts="accountsStore.items"
        :categories="categoriesStore.items"
        :default-currency="appStore.settings.defaultCurrency"
        :initial-data="{
          name: obligation.name,
          type: obligation.type,
          expectedValue: obligation.expectedValue,
          currency: obligation.currency,
          frequency: obligation.frequency,
          accountId: obligation.accountId,
          categoryId: obligation.categoryId,
          color: obligation.color,
        }"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
