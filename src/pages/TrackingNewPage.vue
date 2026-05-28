<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTrackingStore } from '@/stores/tracking'
import TrackingEntryForm from '@/components/tracking/TrackingEntryForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const trackingStore = useTrackingStore()

async function handleSubmit(data: any) {
  await trackingStore.create(data)
  router.push('/tracking')
}
</script>

<template>
  <div>
    <TopBar :title="t('tracking.newEntry')" showBack />
    <div class="py-4">
      <TrackingEntryForm @submit="handleSubmit" @cancel="router.back()" />
    </div>
  </div>
</template>
