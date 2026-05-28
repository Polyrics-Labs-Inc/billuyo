<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAccountsStore } from '@/stores/accounts'
import { useDataExport } from '@/composables/useDataExport'
import { validateAppData, createEmptyAppData } from '@/utils/validation'
import { useCategoriesStore } from '@/stores/categories'
import { useTransactionsStore } from '@/stores/transactions'
import { useBudgetsStore } from '@/stores/budgets'
import { useObligationsStore } from '@/stores/obligations'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import { FileUp, Sparkles, ArrowRight, Check } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()
const transactionsStore = useTransactionsStore()
const budgetsStore = useBudgetsStore()
const obligationsStore = useObligationsStore()
const { importFile } = useDataExport()

const step = ref<'welcome' | 'import' | 'create-account' | 'done'>('welcome')
const importError = ref('')
const importSuccess = ref(false)

// Account creation
const accountName = ref('')
const accountCurrency = ref('USD')

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'MXN', label: 'MXN ($)' },
  { value: 'COP', label: 'COP ($)' },
  { value: 'ARS', label: 'ARS ($)' },
  { value: 'BRL', label: 'BRL (R$)' },
  { value: 'CLP', label: 'CLP ($)' },
  { value: 'PEN', label: 'PEN (S/)' },
]

async function startFresh() {
  step.value = 'create-account'
}

async function doImport() {
  try {
    const content = await importFile()
    const parsed = JSON.parse(content)
    const result = validateAppData(parsed)
    if (!result.valid || !result.data) {
      importError.value = t('onboarding.importError')
      return
    }
    const data = result.data
    await categoriesStore.setAllData(data.categories)
    await accountsStore.setAllData(data.accounts)
    await transactionsStore.setAllData(data.transactions)
    await budgetsStore.setAllData(data.budgets)
    await obligationsStore.setAllData(data.obligations ?? [], data.obligationActions ?? [])
    appStore.resetSettings(data.settings)
    appStore.setOnboarded()
    importSuccess.value = true
    step.value = 'done'
  } catch {
    importError.value = t('onboarding.importError')
  }
}

async function createAccountAndFinish() {
  if (!accountName.value.trim()) return
  await accountsStore.create({
    name: accountName.value.trim(),
    description: '',
    currency: accountCurrency.value,
    color: '#8B5CF6',
    icon: 'Wallet',
    initialBalance: 0,
    isDefaultExpenses: true,
    isDefaultSavings: true,
  })
  appStore.setOnboarded()
  step.value = 'done'
}

function goToDashboard() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 bg-clay-bg">
    <!-- Welcome -->
    <div v-if="step === 'welcome'" class="text-center max-w-sm animate-fade-in">
      <div class="w-20 h-20 rounded-clay-xl bg-clay-primary-light flex items-center justify-center mx-auto mb-6">
        <Sparkles class="w-10 h-10 text-clay-primary" />
      </div>
      <h1 class="text-2xl font-bold text-clay-ink mb-2">{{ t('onboarding.welcome') }}</h1>
      <p class="text-sm text-clay-muted mb-8">{{ t('onboarding.welcomeDesc') }}</p>

      <div class="flex flex-col gap-3">
        <ClayButton class="w-full" @click="startFresh">
          <FileUp class="w-4 h-4" />
          {{ t('onboarding.startFresh') }}
        </ClayButton>

        <ClayButton variant="secondary" class="w-full" @click="step = 'import'">
          {{ t('onboarding.importData') }}
        </ClayButton>

        <p class="text-xs text-clay-muted mt-2">{{ t('onboarding.importDataDesc') }}</p>
      </div>
    </div>

    <!-- Import step -->
    <div v-else-if="step === 'import'" class="text-center max-w-sm animate-fade-in">
      <ClayButton @click="doImport">
        <FileUp class="w-4 h-4" />
        {{ t('onboarding.importData') }}
      </ClayButton>
      <p v-if="importError" class="text-sm text-clay-expense mt-3">{{ importError }}</p>
      <button class="text-sm text-clay-muted mt-4 underline" @click="step = 'welcome'">
        {{ t('common.back') }}
      </button>
    </div>

    <!-- Create account -->
    <div v-else-if="step === 'create-account'" class="w-full max-w-sm animate-fade-in">
      <h2 class="text-lg font-bold text-clay-ink mb-2">{{ t('onboarding.createFirstAccount') }}</h2>
      <p class="text-sm text-clay-muted mb-6">{{ t('onboarding.createFirstAccountDesc') }}</p>

      <div class="flex flex-col gap-4">
        <ClayInput v-model="accountName" :label="t('onboarding.accountName')" placeholder="e.g. Main Account" />
        <ClaySelect v-model="accountCurrency" :label="t('onboarding.accountCurrency')" :options="currencyOptions" />

        <ClayButton @click="createAccountAndFinish">
          <ArrowRight class="w-4 h-4" />
          {{ t('common.next') }}
        </ClayButton>
      </div>
    </div>

    <!-- Done -->
    <div v-else-if="step === 'done'" class="text-center max-w-sm animate-fade-in">
      <div class="w-20 h-20 rounded-clay-xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
        <Check class="w-10 h-10 text-clay-income" />
      </div>
      <h2 class="text-xl font-bold text-clay-ink mb-2">
        {{ t('onboarding.setupComplete') }}
      </h2>
      <p class="text-sm text-clay-muted mb-8">{{ t('onboarding.setupCompleteDesc') }}</p>
      <ClayButton @click="goToDashboard">
        {{ t('onboarding.goToDashboard') }}
      </ClayButton>
    </div>
  </div>
</template>
