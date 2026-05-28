<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
}>(), {
  variant: 'primary',
  type: 'button',
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'clay-button-primary': variant === 'primary',
      'clay-button-secondary': variant === 'secondary',
      'clay-button-danger': variant === 'danger',
      'clay-button-ghost': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
