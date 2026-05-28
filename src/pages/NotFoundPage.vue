<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ClayButton from '@/components/ui/ClayButton.vue'
import { Frown } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center">
    <div class="w-20 h-20 rounded-clay-xl bg-clay-primary-light flex items-center justify-center mb-6">
      <Frown class="w-10 h-10 text-clay-primary" />
    </div>
    <h1 class="text-2xl font-bold text-clay-ink mb-2">404</h1>
    <p class="text-sm text-clay-muted mb-6">Page not found</p>
    <ClayButton @click="router.push('/')">Go Home</ClayButton>
  </div>
</template>
