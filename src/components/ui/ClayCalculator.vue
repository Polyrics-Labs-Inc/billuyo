<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { X, Delete, Equal, Plus, Minus, Divide, X as Multiply } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
  initialValue?: number
}>()

const emit = defineEmits<{
  close: []
  apply: [value: number]
}>()

const expression = ref('')
const result = ref<string | null>(null)
const error = ref('')

watch(() => props.show, (val) => {
  if (val) {
    expression.value = props.initialValue && props.initialValue !== 0 ? String(props.initialValue) : ''
    result.value = null
    error.value = ''
  }
})

const display = computed(() => {
  if (result.value !== null) {
    return expression.value
  }
  return expression.value || '0'
})

const resultDisplay = computed(() => {
  if (error.value) return error.value
  if (result.value !== null) return result.value
  return ''
})

function press(val: string) {
  error.value = ''
  result.value = null
  expression.value += val
}

function pressOperator(op: string) {
  error.value = ''
  result.value = null
  const last = expression.value.slice(-1)
  if (['+', '-', '*', '/'].includes(last)) {
    expression.value = expression.value.slice(0, -1) + op
  } else {
    expression.value += op
  }
}

function clear() {
  expression.value = ''
  result.value = null
  error.value = ''
}

function backspace() {
  expression.value = expression.value.slice(0, -1)
  result.value = null
  error.value = ''
}

function calculate() {
  if (!expression.value) return
  try {
    const sanitized = expression.value.replace(/×/g, '*').replace(/÷/g, '/')
    const evaluated = Function(`"use strict"; return (${sanitized})`)()
    if (!isFinite(evaluated)) {
      error.value = t('calculator.error') || 'Error'
      return
    }
    result.value = formatResult(evaluated)
  } catch {
    error.value = t('calculator.error') || 'Error'
  }
}

function formatResult(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

function applyResult() {
  if (result.value === null && expression.value) {
    calculate()
  }
  if (result.value === null && error.value) return
  const val = result.value !== null ? parseFloat(result.value) : 0
  if (!isNaN(val) && isFinite(val)) {
    emit('apply', val)
  }
  expression.value = ''
  result.value = null
  error.value = ''
  emit('close')
}

const buttons = [
  { label: 'C', action: 'clear', variant: 'function' as const, span: 1 },
  { label: '±', action: 'negate', variant: 'function' as const, span: 1 },
  { label: '%', action: 'percent', variant: 'function' as const, span: 1 },
  { label: '÷', action: 'op', value: '/', variant: 'operator' as const, span: 1 },
  { label: '7', action: 'num', value: '7', variant: 'number' as const, span: 1 },
  { label: '8', action: 'num', value: '8', variant: 'number' as const, span: 1 },
  { label: '9', action: 'num', value: '9', variant: 'number' as const, span: 1 },
  { label: '×', action: 'op', value: '*', variant: 'operator' as const, span: 1 },
  { label: '4', action: 'num', value: '4', variant: 'number' as const, span: 1 },
  { label: '5', action: 'num', value: '5', variant: 'number' as const, span: 1 },
  { label: '6', action: 'num', value: '6', variant: 'number' as const, span: 1 },
  { label: '−', action: 'op', value: '-', variant: 'operator' as const, span: 1 },
  { label: '1', action: 'num', value: '1', variant: 'number' as const, span: 1 },
  { label: '2', action: 'num', value: '2', variant: 'number' as const, span: 1 },
  { label: '3', action: 'num', value: '3', variant: 'number' as const, span: 1 },
  { label: '+', action: 'op', value: '+', variant: 'operator' as const, span: 1 },
  { label: '', action: 'empty', variant: 'number' as const, span: 1 },
  { label: '0', action: 'num', value: '0', variant: 'number' as const, span: 1 },
  { label: '.', action: 'num', value: '.', variant: 'number' as const, span: 1 },
  { label: '=', action: 'equals', variant: 'equals' as const, span: 1 },
]

function handleButtonClick(btn: typeof buttons[0]) {
  if (btn.action === 'num' && btn.value) {
    if (result.value !== null) { expression.value = ''; result.value = null }
    press(btn.value)
  } else if (btn.action === 'op' && btn.value) {
    pressOperator(btn.value)
  } else if (btn.action === 'clear') {
    clear()
  } else if (btn.action === 'negate') {
    if (result.value !== null) {
      expression.value = String(-parseFloat(result.value))
      result.value = null
    } else if (expression.value) {
      if (expression.value.startsWith('-')) {
        expression.value = expression.value.slice(1)
      } else {
        expression.value = '-' + expression.value
      }
    }
  } else if (btn.action === 'percent') {
    if (result.value !== null) {
      expression.value = String(parseFloat(result.value) / 100)
      result.value = null
    } else if (expression.value) {
      expression.value = String(parseFloat(expression.value) / 100)
    }
  } else if (btn.action === 'equals') {
    calculate()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="clay-modal-overlay z-50" @click.self="emit('close')">
      <div class="bg-clay-surface w-full max-w-sm mx-auto rounded-t-clay-lg sm:rounded-clay-lg shadow-clay-float overflow-hidden animate-slide-up" @click.stop>
        <!-- Display -->
        <div class="px-5 pt-6 pb-3 bg-clay-bg/60">
          <div class="text-right min-h-[2.5rem]">
            <p class="text-sm text-clay-muted break-all">{{ display }}</p>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-clay-ink break-all" :class="{ 'text-clay-expense': error }">
              {{ resultDisplay || (expression ? '' : '0') }}
            </p>
          </div>
        </div>

        <!-- Buttons grid -->
        <div class="grid grid-cols-4 gap-2 p-3">
          <button
            v-for="(btn, i) in buttons"
            :key="i"
            v-show="btn.label !== '' || btn.action !== 'empty'"
            :class="{
              'col-span-1': (btn.span || 1) === 1,
              'bg-clay-bg hover:bg-clay-border/40 text-clay-ink': btn.variant === 'number',
              'bg-clay-primary-light text-clay-primary hover:bg-violet-200': btn.variant === 'function',
              'bg-clay-primary text-white hover:bg-clay-primary-hover': btn.variant === 'operator' || btn.variant === 'equals',
              'rounded-clay-sm text-lg font-semibold h-14 active:scale-[0.95] transition-all duration-100': true,
              'invisible': btn.action === 'empty',
            }"
            @click="handleButtonClick(btn)"
          >
            <span v-if="btn.action !== 'backspace'">{{ btn.label }}</span>
          </button>
        </div>

        <!-- Use button -->
        <div class="px-3 pb-4">
          <button
            class="clay-button-primary w-full py-3 rounded-clay-sm text-sm font-semibold"
            @click="applyResult"
          >
            {{ t('calculator.use') || 'Use' }} {{ resultDisplay || expression || '0' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
