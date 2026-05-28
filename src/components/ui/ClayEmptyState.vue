<script setup lang="ts">
defineProps<{
  icon?: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="clay-empty">
    <div class="w-16 h-16 rounded-clay bg-clay-primary-light flex items-center justify-center mb-4">
      <svg class="w-8 h-8 text-clay-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
      </svg>
    </div>
    <h3 class="text-lg font-semibold text-clay-ink mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-clay-muted max-w-xs">{{ description }}</p>
    <slot />
  </div>
</template>
