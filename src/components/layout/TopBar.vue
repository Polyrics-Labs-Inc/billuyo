<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

defineProps<{
  title?: string
  showBack?: boolean
  rightAction?: string
}>()

const emit = defineEmits<{
  'right-click': []
}>()
</script>

<template>
  <header class="sticky top-0 z-30 bg-clay-bg/90 backdrop-blur-md pt-safe">
    <div class="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
      <div class="flex items-center gap-2 min-w-0">
        <button
          v-if="showBack"
          class="clay-button-ghost p-1.5 -ml-1.5"
          @click="router.back()"
        >
          <ArrowLeft class="w-5 h-5 text-clay-ink" />
        </button>
        <h1 class="text-lg font-bold text-clay-ink truncate">{{ title }}</h1>
      </div>
      <button
        v-if="rightAction"
        class="clay-button-secondary text-xs px-3 py-1.5"
        @click="emit('right-click')"
      >
        {{ rightAction }}
      </button>
    </div>
  </header>
</template>
