<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import type { Account } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  initialData?: Account
  defaultCurrency: string
}>()

const emit = defineEmits<{
  submit: [data: {
    name: string
    description: string
    currency: string
    color: string
    icon: string
    initialBalance: number
    isDefaultExpenses: boolean
    isDefaultSavings: boolean
  }]
  cancel: []
}>()

const name = ref(props.initialData?.name ?? '')
const description = ref(props.initialData?.description ?? '')
const currency = ref(props.initialData?.currency ?? props.defaultCurrency)
const color = ref(props.initialData?.color ?? '#8B5CF6')
const icon = ref(props.initialData?.icon ?? 'Wallet')
const initialBalance = ref(props.initialData?.initialBalance ?? 0)
const isDefaultExpenses = ref(props.initialData?.isDefaultExpenses ?? false)
const isDefaultSavings = ref(props.initialData?.isDefaultSavings ?? false)

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

const colorOptions = [
  '#8B5CF6', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B',
  '#F43F5E', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
]

function handleSubmit() {
  if (!name.value.trim()) return
  emit('submit', {
    name: name.value.trim(),
    description: description.value.trim(),
    currency: currency.value,
    color: color.value,
    icon: icon.value,
    initialBalance: Number(initialBalance.value) || 0,
    isDefaultExpenses: isDefaultExpenses.value,
    isDefaultSavings: isDefaultSavings.value,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 animate-fade-in">
    <ClayInput v-model="name" :label="t('common.name')" placeholder="e.g. Main Account" />
    <ClayInput v-model="description" :label="t('common.description')" />

    <ClaySelect v-model="currency" :label="t('common.currency')" :options="currencyOptions" />

    <ClayInput v-model.number="initialBalance" :label="t('accounts.initialBalance')" type="number" step="0.01" placeholder="0.00" />

    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium text-clay-muted">{{ t('common.color') }}</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="c in colorOptions"
          :key="c"
          type="button"
          class="w-8 h-8 rounded-full border-2 transition-all"
          :class="color === c ? 'border-clay-ink scale-110 shadow-clay-button' : 'border-transparent'"
          :style="{ backgroundColor: c }"
          @click="color = c"
        />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" v-model="isDefaultExpenses" class="w-4 h-4 rounded text-clay-primary focus:ring-clay-primary/30" />
        <span class="text-sm text-clay-ink">{{ t('accounts.defaultExpense') }}</span>
      </label>
    </div>

    <div class="flex items-center gap-3">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" v-model="isDefaultSavings" class="w-4 h-4 rounded text-clay-primary focus:ring-clay-primary/30" />
        <span class="text-sm text-clay-ink">{{ t('accounts.defaultSavings') }}</span>
      </label>
    </div>

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
