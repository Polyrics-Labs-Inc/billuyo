<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTrackingStore } from '@/stores/tracking'
import TrackingEntryForm from '@/components/tracking/TrackingEntryForm.vue'
import TopBar from '@/components/layout/TopBar.vue'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const trackingStore = useTrackingStore()

const id = route.params.id as string
const entry = computed(() => trackingStore.getById(id))

onMounted(() => trackingStore.load())

async function handleSubmit(data: any) {
  await trackingStore.update(id, data)
  router.push(`/tracking/${id}`)
}
</script>

<template>
  <div>
    <TopBar :title="t('tracking.editEntry')" showBack />
    <div class="py-4" v-if="entry">
      <TrackingEntryForm
        :initial-data="{
          name: entry.name,
          description: entry.description,
          frequency: entry.frequency,
          color: entry.color,
          icon: entry.icon,
        }"
        @submit="handleSubmit"
        @cancel="router.back()"
      />
    </div>
  </div>
</template>
