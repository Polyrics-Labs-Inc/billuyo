<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '@/stores/accounts'
import { useAppStore } from '@/stores/app'
import AccountForm from '@/components/accounts/AccountForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const accountsStore = useAccountsStore()
const appStore = useAppStore()

async function handleSubmit(data: any) {
  await accountsStore.create(data)
  router.push('/accounts')
}
</script>

<template>
  <div>
    <TopBar :title="t('accounts.newAccount')" showBack />
    <div class="py-4">
      <AccountForm
        :default-currency="appStore.settings.defaultCurrency"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
