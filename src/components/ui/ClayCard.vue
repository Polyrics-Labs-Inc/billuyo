<script setup lang="ts">
withDefaults(defineProps<{
  padding?: string
  hover?: boolean
}>(), {
  padding: 'p-5',
  hover: false,
})
</script>

<template>
  <div
    class="clay-card"
    :class="[padding, { 'clay-card-hover': hover }]"
  >
    <slot />
  </div>
</template>
