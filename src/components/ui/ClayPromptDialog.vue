<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Calculator } from 'lucide-vue-next'
import ClayButton from './ClayButton.vue'
import ClayCalculator from './ClayCalculator.vue'

const { t } = useI18n()

const props = defineProps<{
  show: boolean
  title: string
  label: string
  initialValue?: number
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  confirm: [value: number]
  cancel: []
}>()

const input = ref(props.initialValue ?? 0)
const showCalc = ref(false)

watch(() => props.show, (val) => {
  if (val) input.value = props.initialValue ?? 0
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="clay-modal-overlay" @click.self="emit('cancel')">
      <div class="clay-modal max-w-sm">
        <h3 class="text-base font-semibold text-clay-ink mb-4">{{ title }}</h3>

        <div class="flex flex-col gap-1.5 mb-6">
          <label class="text-xs font-medium text-clay-muted">{{ label }}</label>
          <div class="flex gap-2 items-center">
            <div class="flex-1">
              <input
                v-model.number="input"
                type="number"
                step="0.01"
                class="clay-input text-lg text-center font-semibold"
                autofocus
              />
            </div>
            <button
              type="button"
              class="clay-button-ghost w-10 h-10 rounded-clay-sm flex items-center justify-center shrink-0"
              @click="showCalc = true"
            >
              <Calculator class="w-5 h-5 text-clay-muted" />
            </button>
          </div>
        </div>

        <ClayCalculator
          :show="showCalc"
          :initial-value="input"
          @close="showCalc = false"
          @apply="(val: number) => { input = val; showCalc = false }"
        />

        <div class="flex gap-3 justify-end">
          <ClayButton variant="secondary" @click="emit('cancel')">
            {{ cancelLabel || t('common.cancel') }}
          </ClayButton>
          <ClayButton @click="emit('confirm', input)">
            {{ confirmLabel || t('common.done') }}
          </ClayButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
