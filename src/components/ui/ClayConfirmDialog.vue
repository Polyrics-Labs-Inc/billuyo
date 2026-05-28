<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ClayButton from './ClayButton.vue'
import { AlertTriangle } from 'lucide-vue-next'

const { t } = useI18n()

defineProps<{
  show: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  hideCancel?: boolean
  hideConfirm?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="clay-modal-overlay" @click.self="emit('cancel')">
      <div class="clay-modal max-w-sm">
        <div class="flex items-start gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-clay-sm flex items-center justify-center shrink-0"
            :class="variant === 'danger' ? 'bg-rose-50' : 'bg-clay-primary-light'"
          >
            <AlertTriangle
              class="w-5 h-5"
              :class="variant === 'danger' ? 'text-clay-expense' : 'text-clay-primary'"
            />
          </div>
          <div>
            <h3 class="text-base font-semibold text-clay-ink">{{ title }}</h3>
            <p class="text-sm text-clay-muted mt-1">{{ message }}</p>
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <ClayButton v-if="!hideCancel" variant="secondary" @click="emit('cancel')">
            {{ cancelLabel || t('common.cancel') }}
          </ClayButton>
          <ClayButton v-if="!hideConfirm" :variant="variant === 'danger' ? 'danger' : 'primary'" @click="emit('confirm')">
            {{ confirmLabel || t('common.confirm') }}
          </ClayButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
