<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'income' | 'expense' | 'savings'
  size?: 'sm' | 'md'
}>(), {
  variant: 'default',
  size: 'sm',
})
</script>

<template>
  <span
    class="clay-badge"
    :class="{
      'bg-clay-primary-light text-clay-primary': variant === 'primary',
      'bg-emerald-50 text-clay-income': variant === 'income',
      'bg-rose-50 text-clay-expense': variant === 'expense',
      'bg-amber-50 text-clay-savings': variant === 'savings',
      'bg-clay-bg text-clay-muted': variant === 'default',
      'px-2 py-0.5 text-[10px]': size === 'sm',
      'px-3 py-1 text-xs': size === 'md',
    }"
  >
    <slot />
  </span>
</template>
