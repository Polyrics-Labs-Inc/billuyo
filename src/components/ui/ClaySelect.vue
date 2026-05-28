<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  options: { value: string; label: string }[]
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium text-clay-muted">{{ label }}</label>
    <div class="relative">
      <select
        :value="modelValue"
        class="clay-select"
        :class="{ 'ring-2 ring-red-300 border-red-300': error }"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-clay-muted">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </div>
    </div>
    <p v-if="error" class="text-xs text-red-400 ml-1">{{ error }}</p>
  </div>
</template>
