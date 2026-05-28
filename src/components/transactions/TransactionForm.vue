<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus, X, ChevronDown, ChevronUp, Calculator } from 'lucide-vue-next'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayCalculator from '@/components/ui/ClayCalculator.vue'
import { categoryDisplayName } from '@/utils/category'
import type { Account, Category, TransactionEffect, Direction } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  accounts: Account[]
  categories: Category[]
  defaultCurrency: string
  defaultAccountId?: string
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

const validationError = ref('')
const showCalculator = ref(false)
const calculatorTarget = ref<number | 'main'>('main')

const now = new Date()
const dateStr = now.toISOString().slice(0, 10)
const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const amount = ref(props.initialData?.amount ?? 0)
const currency = ref(props.initialData?.currency ?? props.defaultCurrency)
const date = ref(props.initialData?.date ?? dateStr)
const time = ref(props.initialData?.time ?? timeStr)
const description = ref(props.initialData?.description ?? '')

const hasInitialEffects = props.initialData && props.initialData.effects.length > 0
const showAdvanced = ref(hasInitialEffects ? props.initialData!.effects.length > 1 : false)

const selectedAccountId = ref(
  props.initialData?.effects[0]?.accountId ?? props.defaultAccountId ?? (props.accounts[0]?.id ?? ''),
)
const selectedCategoryId = ref(props.initialData?.effects[0]?.categoryId ?? '')

const selectedCategory = computed(() =>
  props.categories.find(c => c.id === selectedCategoryId.value)
)

const autoDirection = computed<Direction>(() =>
  selectedCategory.value?.defaultDirection ?? 'debit'
)

watch(selectedCategoryId, () => {
  if (showAdvanced.value) return
  effects.value[0].direction = autoDirection.value
  effects.value[0].categoryId = selectedCategoryId.value
})

watch(selectedAccountId, (val) => {
  if (showAdvanced.value) return
  effects.value[0].accountId = val
})

watch(amount, (val) => {
  if (showAdvanced.value) return
  if (effects.value[0]) effects.value[0].amount = val
})

interface EffectRow {
  localId: number
  accountId: string
  direction: Direction
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
  })) ?? [
    {
      localId: 1,
      accountId: selectedAccountId.value,
      direction: autoDirection.value,
      amount: amount.value,
      categoryId: selectedCategoryId.value,
    },
  ]
)

let nextId = Date.now()

function addEffect() {
  effects.value.push({
    localId: ++nextId,
    accountId: '',
    direction: 'debit',
    amount: 0,
    categoryId: '',
  })
}

function removeEffect(localId: number) {
  if (effects.value.length <= 1) return
  effects.value = effects.value.filter(e => e.localId !== localId)
}

function syncToAdvanced() {
  if (effects.value.length === 0) {
    effects.value.push({
      localId: ++nextId,
      accountId: selectedAccountId.value,
      direction: autoDirection.value,
      amount: amount.value,
      categoryId: selectedCategoryId.value,
    })
    return
  }
  effects.value[0].accountId = selectedAccountId.value
  effects.value[0].direction = autoDirection.value
  effects.value[0].amount = amount.value
  effects.value[0].categoryId = selectedCategoryId.value
}

function toggleAdvanced() {
  showAdvanced.value = !showAdvanced.value
}

function handleSubmit() {
  const errors: string[] = []
  if (!amount.value || amount.value <= 0) errors.push('Amount must be > 0')
  if (effects.value.some(e => !e.accountId)) errors.push('All effects need an account')
  if (effects.value.some(e => !e.categoryId)) errors.push('All effects need a category')
  if (effects.value.some(e => e.amount <= 0)) errors.push('All effect amounts must be > 0')
  if (errors.length) {
    validationError.value = errors.join('\n')
    return
  }
  validationError.value = ''

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

const accountOptions = computed(() =>
  props.accounts.map(a => ({ value: a.id, label: a.name }))
)

const categoryOptions = computed(() =>
  props.categories.map(c => ({ value: c.id, label: categoryDisplayName(c, t) }))
)
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 animate-fade-in">
    <ClayInput v-model="description" :label="t('common.description')" placeholder="e.g. Groceries" />

    <div class="grid grid-cols-2 gap-3">
      <div class="flex gap-2 items-end">
        <div class="flex-1">
          <ClayInput v-model.number="amount" :label="t('common.amount')" type="number" step="0.01" placeholder="0.00" />
        </div>
        <button
          type="button"
          class="clay-button-ghost w-10 h-10 rounded-clay-sm flex items-center justify-center mb-0.5 shrink-0"
          @click="showCalculator = true"
        >
          <Calculator class="w-5 h-5 text-clay-muted" />
        </button>
      </div>
      <ClaySelect v-model="currency" :label="t('common.currency')" :options="currencyOptions" />
    </div>

    <div class="grid grid-cols-2 gap-3">
      <ClayInput v-model="date" type="date" :label="t('common.date')" />
      <ClayInput v-model="time" type="time" :label="t('common.time')" />
    </div>

    <div v-if="!showAdvanced" class="flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-3">
        <ClaySelect
          v-model="selectedAccountId"
          :label="t('transactions.selectAccount')"
          :options="accountOptions"
        />
        <ClaySelect
          v-model="selectedCategoryId"
          :label="t('transactions.selectCategory')"
          :options="categoryOptions"
        />
      </div>

      <div class="flex items-center justify-between px-1">
        <span class="text-xs text-clay-muted">
          {{ t(autoDirection === 'credit' ? 'transactions.credit' : 'transactions.debit') }}
          <span v-if="selectedCategory" class="font-medium">· {{ categoryDisplayName(selectedCategory, t) }}</span>
        </span>
        <button type="button" class="clay-button-ghost text-xs text-clay-primary flex items-center gap-1 p-1" @click="toggleAdvanced">
          {{ t('transactions.addEffect') }}
          <ChevronDown class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <div v-if="showAdvanced" class="flex flex-col gap-3">
      <button type="button" class="clay-button-ghost text-xs text-clay-primary self-start flex items-center gap-1 p-1" @click="toggleAdvanced">
        <ChevronUp class="w-3.5 h-3.5" />
        {{ t('common.simple') }}
      </button>

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
          :options="accountOptions"
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
          <div class="flex gap-1 items-end">
            <div class="flex-1">
              <ClayInput v-model.number="effect.amount" type="number" step="0.01" :label="t('common.amount')" />
            </div>
            <button
              type="button"
              class="clay-button-ghost w-8 h-8 rounded-clay-sm flex items-center justify-center mb-0.5 shrink-0"
              @click="showCalculator = true; calculatorTarget = effect.localId"
            >
              <Calculator class="w-4 h-4 text-clay-muted" />
            </button>
          </div>
        </div>

        <ClaySelect
          v-model="effect.categoryId"
          :label="t('transactions.selectCategory')"
          :placeholder="t('transactions.selectCategory')"
          :options="categoryOptions"
        />
      </div>
    </div>

    <ClayCalculator
      :show="showCalculator"
      :initial-value="calculatorTarget === 'main' ? amount : (effects.find((e: any) => e.localId === calculatorTarget)?.amount ?? 0)"
      @close="showCalculator = false; calculatorTarget = 'main'"
      @apply="(val: number) => {
        if (calculatorTarget === 'main') {
          amount = val
        } else {
          const found = effects.find((e: EffectRow) => e.localId === calculatorTarget)
          if (found) found.amount = val
        }
        showCalculator = false
        calculatorTarget = 'main'
      }"
    />

    <p v-if="validationError" class="text-sm text-clay-expense bg-rose-50 rounded-clay-sm px-4 py-3 text-center">
      {{ validationError }}
    </p>

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
