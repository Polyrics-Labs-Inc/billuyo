<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useCategoriesStore } from '@/stores/categories'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { useTrackingStore } from '@/stores/tracking'
import { useObligationsStore } from '@/stores/obligations'

const router = useRouter()
const { locale } = useI18n()
const appStore = useAppStore()
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const trackingStore = useTrackingStore()
const obligationsStore = useObligationsStore()

onMounted(async () => {
  locale.value = appStore.settings.language

  await Promise.all([
    categoriesStore.load(),
    accountsStore.load(),
    transactionsStore.load(),
    trackingStore.load(),
    obligationsStore.load(),
  ])

  if (!appStore.settings.onboarded) {
    router.replace('/onboarding')
  }
})
</script>

<template>
  <div class="bg-clay-bg min-h-screen relative">
    <div class="clay-blob w-64 h-64 bg-clay-primary/30 -top-20 -left-20" />
    <div class="clay-blob w-80 h-80 bg-clay-secondary/20 bottom-40 -right-20" />
    <div class="clay-blob w-48 h-48 bg-sky-400/20 top-1/2 -left-32" />
    <RouterView />
  </div>
</template>
