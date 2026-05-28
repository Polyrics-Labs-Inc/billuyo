<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="clay-modal-overlay" @click.self="emit('close')">
      <div class="clay-modal">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-clay-ink">{{ title }}</h2>
          <button class="p-1 rounded-full hover:bg-clay-primary-light/50 transition-colors" @click="emit('close')">
            <svg class="w-5 h-5 text-clay-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
