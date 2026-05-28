<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useCategoriesStore } from '@/stores/categories'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'
import { useTrackingStore } from '@/stores/tracking'
import { useObligationsStore } from '@/stores/obligations'
import { collectAllData } from '@/stores/collectAll'
import { useDataExport } from '@/composables/useDataExport'
import { validateAppData } from '@/utils/validation'
import { exportData } from '@/utils/validation'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayModal from '@/components/ui/ClayModal.vue'
import TopBar from '@/components/layout/TopBar.vue'
import type { Language } from '@/types'
import {
  Download, Upload, Globe, Banknote, Info, Trash2, AlertTriangle,
} from 'lucide-vue-next'

const { t, locale } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const categoriesStore = useCategoriesStore()
const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()
const trackingStore = useTrackingStore()
const obligationsStore = useObligationsStore()
const { download, importFile } = useDataExport()

const showImportConfirm = ref(false)
const showClearConfirm = ref(false)
const importError = ref('')
const importSuccess = ref(false)

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
]

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

function handleLanguageChange(lang: Language) {
  appStore.setLanguage(lang)
  locale.value = lang
}

async function handleExport() {
  const data = collectAllData()
  const json = exportData(data)
  download(json)
}

async function handleImportClick() {
  importError.value = ''
  importSuccess.value = false
  showImportConfirm.value = true
}

async function confirmImport() {
  showImportConfirm.value = false
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
    await trackingStore.setAllData(data.trackingEntries)
    await obligationsStore.setAllData(
      data.obligations ?? (data as any).budgets ?? [],
      data.obligationActions ?? (data as any).budgetActions ?? [],
    )
    if (data.settings) {
      appStore.resetSettings(data.settings)
    }
    importSuccess.value = true
  } catch {
    importError.value = t('onboarding.importError')
  }
}

async function confirmClear() {
  showClearConfirm.value = false
  await categoriesStore.setAllData([])
  await accountsStore.setAllData([])
  await transactionsStore.setAllData([])
  await trackingStore.setAllData([])
  await obligationsStore.setAllData([], [])
  localStorage.clear()
  appStore.resetSettings()
  router.push('/onboarding')
}
</script>

<template>
  <div>
    <TopBar :title="t('settings.title')" />

    <div class="py-4 space-y-4 animate-fade-in">
      <!-- Language -->
      <ClayCard padding="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Globe class="w-5 h-5 text-clay-muted" />
            <span class="text-sm font-medium text-clay-ink">{{ t('settings.language') }}</span>
          </div>
          <select
            class="text-sm bg-transparent border border-clay-border/50 rounded-clay-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-clay-primary/30"
            :value="appStore.settings.language"
            @change="handleLanguageChange(($event.target as HTMLSelectElement).value as Language)"
          >
            <option v-for="opt in languageOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </ClayCard>

      <!-- Default Currency -->
      <ClayCard padding="p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Banknote class="w-5 h-5 text-clay-muted" />
            <span class="text-sm font-medium text-clay-ink">{{ t('settings.defaultCurrency') }}</span>
          </div>
          <select
            class="text-sm bg-transparent border border-clay-border/50 rounded-clay-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-clay-primary/30"
            :value="appStore.settings.defaultCurrency"
            @change="appStore.setDefaultCurrency(($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </ClayCard>

      <!-- Export -->
      <ClayCard padding="p-4" hover @click="handleExport">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-clay-sm bg-clay-primary-light flex items-center justify-center">
            <Download class="w-5 h-5 text-clay-primary" />
          </div>
          <div>
            <p class="text-sm font-medium text-clay-ink">{{ t('settings.exportData') }}</p>
            <p class="text-xs text-clay-muted">{{ t('settings.exportDataDesc') }}</p>
          </div>
        </div>
      </ClayCard>

      <!-- Import -->
      <ClayCard padding="p-4" hover @click="handleImportClick">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-clay-sm bg-amber-50 flex items-center justify-center">
            <Upload class="w-5 h-5 text-clay-savings" />
          </div>
          <div>
            <p class="text-sm font-medium text-clay-ink">{{ t('settings.importData') }}</p>
            <p class="text-xs text-clay-muted">{{ t('settings.importDataDesc') }}</p>
          </div>
        </div>
      </ClayCard>

      <p v-if="importError" class="text-sm text-clay-expense text-center">{{ importError }}</p>
      <p v-if="importSuccess" class="text-sm text-clay-income text-center">{{ t('onboarding.importSuccess') }}</p>

      <!-- About -->
      <ClayCard padding="p-4">
        <div class="flex items-center gap-3">
          <Info class="w-5 h-5 text-clay-muted" />
          <div>
            <p class="text-sm font-medium text-clay-ink">{{ t('settings.about') }}</p>
            <p class="text-xs text-clay-muted">{{ t('settings.version') }} 0.1.0</p>
            <p class="text-xs text-clay-muted mt-1">{{ t('settings.dataStorage') }}</p>
          </div>
        </div>
      </ClayCard>

      <!-- Clear Data -->
      <ClayButton variant="danger" class="w-full" @click="showClearConfirm = true">
        <Trash2 class="w-4 h-4" /> {{ t('settings.clearData') }}
      </ClayButton>
    </div>

    <!-- Import Warning Modal -->
    <ClayModal :show="showImportConfirm" :title="t('settings.importData')" @close="showImportConfirm = false">
      <div class="flex flex-col gap-4">
        <div class="flex items-start gap-3 p-3 bg-amber-50 rounded-clay-sm">
          <AlertTriangle class="w-5 h-5 text-clay-savings shrink-0 mt-0.5" />
          <p class="text-sm text-clay-ink">{{ t('settings.importWarning') }}</p>
        </div>
        <div class="flex gap-3">
          <ClayButton variant="secondary" class="flex-1" @click="showImportConfirm = false">
            {{ t('common.cancel') }}
          </ClayButton>
          <ClayButton class="flex-1" @click="confirmImport">
            {{ t('settings.importConfirm') }}
          </ClayButton>
        </div>
      </div>
    </ClayModal>

    <!-- Clear Confirm Modal -->
    <ClayModal :show="showClearConfirm" :title="t('settings.clearData')" @close="showClearConfirm = false">
      <div class="flex flex-col gap-4">
        <p class="text-sm text-clay-ink">{{ t('settings.clearConfirm') }}</p>
        <div class="flex gap-3">
          <ClayButton variant="secondary" class="flex-1" @click="showClearConfirm = false">
            {{ t('common.cancel') }}
          </ClayButton>
          <ClayButton variant="danger" class="flex-1" @click="confirmClear">
            {{ t('common.confirm') }}
          </ClayButton>
        </div>
      </div>
    </ClayModal>
  </div>
</template>
