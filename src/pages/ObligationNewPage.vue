<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useObligationsStore } from '@/stores/obligations'
import { useAccountsStore } from '@/stores/accounts'
import { useCategoriesStore } from '@/stores/categories'
import { useAppStore } from '@/stores/app'
import ObligationForm from '@/components/tracking/ObligationForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const obligationsStore = useObligationsStore()
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
  await obligationsStore.createObligation(data)
  router.push('/obligations')
}
</script>

<template>
  <div>
    <TopBar :title="t('obligations.newObligation')" showBack />
    <div class="py-4">
      <ObligationForm
        :accounts="accountsStore.items"
        :categories="categoriesStore.items"
        :default-currency="appStore.settings.defaultCurrency"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
