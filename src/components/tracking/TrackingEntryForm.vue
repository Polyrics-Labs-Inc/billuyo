<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import type { Frequency, FrequencyUnit } from '@/types'

const { t } = useI18n()

const props = defineProps<{
  initialData?: {
    name: string
    description: string
    frequency: Frequency
    color: string
    icon: string
  }
}>()

const emit = defineEmits<{
  submit: [data: {
    name: string
    description: string
    frequency: Frequency
    color: string
    icon: string
  }]
  cancel: []
}>()

const name = ref(props.initialData?.name ?? '')
const description = ref(props.initialData?.description ?? '')
const freqValue = ref(props.initialData?.frequency?.value ?? 1)
const freqUnit = ref<FrequencyUnit>(props.initialData?.frequency?.unit ?? 'M')
const startDate = ref(props.initialData?.frequency?.startDate ?? new Date().toISOString().slice(0, 10))
const color = ref(props.initialData?.color ?? '#8B5CF6')

const unitOptions = [
  { value: 'D', label: t('frequency.days') },
  { value: 'W', label: t('frequency.weeks') },
  { value: 'M', label: t('frequency.months') },
  { value: 'Y', label: t('frequency.years') },
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
    frequency: {
      value: Number(freqValue.value) || 1,
      unit: freqUnit.value,
      startDate: startDate.value,
    },
    color: color.value,
    icon: 'Target',
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 animate-fade-in">
    <ClayInput v-model="name" :label="t('common.name')" placeholder="e.g. Monthly Budget" />
    <ClayInput v-model="description" :label="t('common.description')" />

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
