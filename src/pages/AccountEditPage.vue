<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAccountsStore } from '@/stores/accounts'
import { useAppStore } from '@/stores/app'
import AccountForm from '@/components/accounts/AccountForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const accountsStore = useAccountsStore()
const appStore = useAppStore()

const id = route.params.id as string
const account = computed(() => accountsStore.getById(id))

onMounted(() => accountsStore.load())

async function handleSubmit(data: any) {
  await accountsStore.update(id, data)
  router.push(`/accounts/${id}`)
}
</script>

<template>
  <div>
    <TopBar :title="t('accounts.editAccount')" showBack />
    <div class="py-4" v-if="account">
      <AccountForm
        :initial-data="account"
        :default-currency="appStore.settings.defaultCurrency"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
