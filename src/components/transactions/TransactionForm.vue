<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, X } from 'lucide-vue-next'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import type { Account, Category, TransactionEffect } from '@/types'
import { generateId } from '@/utils/id'

const { t } = useI18n()

const props = defineProps<{
  accounts: Account[]
  categories: Category[]
  defaultCurrency: string
  initialData?: {
    amount: number
    currency: string
    date: string
    time: string
    description: string
    effects: TransactionEffect[]
  }
}>()

const emit = defineEmits<{
  submit: [data: {
    amount: number
    currency: string
    date: string
    time: string
    description: string
    effects: Omit<TransactionEffect, 'id' | 'transactionId'>[]
  }]
  cancel: []
}>()

const now = new Date()
const dateStr = now.toISOString().slice(0, 10)
const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const amount = ref(props.initialData?.amount ?? 0)
const currency = ref(props.initialData?.currency ?? props.defaultCurrency)
const date = ref(props.initialData?.date ?? dateStr)
const time = ref(props.initialData?.time ?? timeStr)
const description = ref(props.initialData?.description ?? '')

interface EffectRow {
  localId: number
  accountId: string
  direction: 'credit' | 'debit'
  amount: number
  categoryId: string
}

const effects = ref<EffectRow[]>(
  props.initialData?.effects?.map(e => ({
    localId: Date.now() + Math.random(),
    accountId: e.accountId,
    direction: e.direction,
    amount: e.amount,
    categoryId: e.categoryId,
  })) ?? [{ localId: 1, accountId: '', direction: 'debit', amount: 0, categoryId: '' }]
)

let nextId = Date.now()
function addEffect() {
  effects.value.push({ localId: ++nextId, accountId: '', direction: 'debit', amount: 0, categoryId: '' })
}

function removeEffect(localId: number) {
  if (effects.value.length <= 1) return
  effects.value = effects.value.filter(e => e.localId !== localId)
}

function handleSubmit() {
  const errors: string[] = []
  if (!amount.value || amount.value <= 0) errors.push('Amount must be > 0')
  if (effects.value.some(e => !e.accountId)) errors.push('All effects need an account')
  if (effects.value.some(e => !e.categoryId)) errors.push('All effects need a category')
  if (effects.value.some(e => e.amount <= 0)) errors.push('All effect amounts must be > 0')
  if (errors.length) {
    alert(errors.join('\n'))
    return
  }

  emit('submit', {
    amount: amount.value,
    currency: currency.value,
    date: date.value,
    time: time.value,
    description: description.value,
    effects: effects.value.map(e => ({
      accountId: e.accountId,
      direction: e.direction,
      amount: e.amount,
      categoryId: e.categoryId,
    })),
  })
}

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
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 animate-fade-in">
    <ClayInput v-model="description" :label="t('common.description')" placeholder="e.g. Groceries" />

    <div class="grid grid-cols-2 gap-3">
      <ClayInput v-model.number="amount" :label="t('common.amount')" type="number" step="0.01" placeholder="0.00" />
      <ClaySelect v-model="currency" :label="t('common.currency')" :options="currencyOptions" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <ClayInput v-model="date" type="date" :label="t('common.date')" />
      <ClayInput v-model="time" type="time" :label="t('common.time')" />
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-clay-muted">{{ t('transactions.transactionEffects') }}</span>
        <button type="button" class="clay-button-ghost text-xs text-clay-primary p-1 flex items-center gap-1" @click="addEffect">
          <Plus class="w-3.5 h-3.5" /> {{ t('transactions.addEffect') }}
        </button>
      </div>

      <div
        v-for="(effect, idx) in effects"
        :key="effect.localId"
        class="clay-card p-3 flex flex-col gap-2 relative"
      >
        <button
          v-if="effects.length > 1"
          type="button"
          class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-clay-expense text-white flex items-center justify-center"
          @click="removeEffect(effect.localId)"
        >
          <X class="w-3 h-3" />
        </button>

        <ClaySelect
          v-model="effect.accountId"
          :label="t('transactions.selectAccount')"
          :placeholder="t('transactions.selectAccount')"
          :options="accounts.map(a => ({ value: a.id, label: a.name }))"
        />

        <div class="grid grid-cols-2 gap-2">
          <ClaySelect
            v-model="effect.direction"
            :label="t('transactions.direction')"
            :options="[
              { value: 'debit', label: t('transactions.debit') },
              { value: 'credit', label: t('transactions.credit') },
            ]"
          />
          <ClayInput v-model.number="effect.amount" type="number" step="0.01" :label="t('common.amount')" />
        </div>

        <ClaySelect
          v-model="effect.categoryId"
          :label="t('transactions.selectCategory')"
          :placeholder="t('transactions.selectCategory')"
          :options="categories.map(c => ({ value: c.id, label: c.name }))"
        />
      </div>
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
