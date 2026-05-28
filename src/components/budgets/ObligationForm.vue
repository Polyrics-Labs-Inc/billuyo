<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import type { ObligationType, Frequency, FrequencyUnit, Account, Category } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  accounts: Account[]
  categories: Category[]
  defaultCurrency: string
  initialData?: {
    name: string
    type: ObligationType
    expectedValue: number
    currency: string
    frequency: Frequency
    accountId: string
    categoryId: string
    color: string
  }
}>()

const emit = defineEmits<{
  submit: [data: {
    name: string
    type: ObligationType
    expectedValue: number
    currency: string
    frequency: Frequency
    accountId: string
    categoryId: string
    color: string
  }]
  cancel: []
}>()

const name = ref(props.initialData?.name ?? '')
const type = ref<ObligationType>(props.initialData?.type ?? 'expense')
const expectedValue = ref(props.initialData?.expectedValue ?? 0)
const currency = ref(props.initialData?.currency ?? props.defaultCurrency)
const freqValue = ref(props.initialData?.frequency?.value ?? 1)
const freqUnit = ref<FrequencyUnit>(props.initialData?.frequency?.unit ?? 'M')
const startDate = ref(props.initialData?.frequency?.startDate ?? new Date().toISOString().slice(0, 10))
const accountId = ref(props.initialData?.accountId ?? '')
const categoryId = ref(props.initialData?.categoryId ?? '')
const color = ref(props.initialData?.color ?? '#F59E0B')

const typeOptions = [
  { value: 'income', label: t('obligations.type_income') },
  { value: 'expense', label: t('obligations.type_expense') },
  { value: 'savings', label: t('obligations.type_savings') },
]

const unitOptions = [
  { value: 'D', label: t('frequency.days') },
  { value: 'W', label: t('frequency.weeks') },
  { value: 'M', label: t('frequency.months') },
  { value: 'Y', label: t('frequency.years') },
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

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name: name.value.trim(),
    type: type.value,
    expectedValue: Number(expectedValue.value) || 0,
    currency: currency.value,
    frequency: {
      value: Number(freqValue.value) || 1,
      unit: freqUnit.value,
      startDate: startDate.value,
    },
    accountId: accountId.value,
    categoryId: categoryId.value,
    color: color.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 animate-fade-in">
    <ClayInput v-model="name" :label="t('common.name')" placeholder="e.g. Rent" />
    <ClaySelect v-model="type" :label="t('obligations.selectType')" :options="typeOptions" />

    <div class="grid grid-cols-2 gap-3">
      <ClayInput v-model.number="expectedValue" :label="t('common.expectedValue')" type="number" step="0.01" placeholder="0.00" />
      <ClaySelect v-model="currency" :label="t('common.currency')" :options="currencyOptions" />
    </div>

    <div>
      <label class="text-xs font-medium text-clay-muted block mb-1.5">{{ t('common.frequency') }}</label>
      <div class="flex gap-2">
        <div class="w-24 shrink-0">
          <input v-model.number="freqValue" type="number" min="1" class="clay-input text-center" placeholder="1" />
        </div>
        <div class="flex-1">
          <select v-model="freqUnit" class="clay-select">
            <option v-for="opt in unitOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>
    </div>

    <ClayInput v-model="startDate" type="date" :label="t('common.startDate')" />

    <ClaySelect
      v-model="accountId"
      :label="t('obligations.associatedAccount')"
      :placeholder="t('obligations.associatedAccount')"
      :options="accounts.map(a => ({ value: a.id, label: a.name }))"
    />

    <ClaySelect
      v-model="categoryId"
      :label="t('transactions.selectCategory')"
      :placeholder="t('transactions.selectCategory')"
      :options="categories.map(c => ({ value: c.id, label: c.name }))"
    />

    <div class="flex gap-3 pt-2">
      <ClayButton variant="secondary" type="button" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </ClayButton>
      <ClayButton type="submit" class="flex-1">
        {{ t('common.save') }}
      </ClayButton>
    </div>
  </form>
</template>
