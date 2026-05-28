<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  icon?: string
  error?: string
}>(), {
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-xs font-medium text-clay-muted">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="clay-input"
      :class="{ 'ring-2 ring-red-300 border-red-300': error }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-400 ml-1">{{ error }}</p>
  </div>
</template>
