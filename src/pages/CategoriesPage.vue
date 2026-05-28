<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCategoriesStore } from '@/stores/categories'
import { useAppStore } from '@/stores/app'
import ClayCard from '@/components/ui/ClayCard.vue'
import ClayButton from '@/components/ui/ClayButton.vue'
import ClayInput from '@/components/ui/ClayInput.vue'
import ClaySelect from '@/components/ui/ClaySelect.vue'
import ClayModal from '@/components/ui/ClayModal.vue'
import ClayEmptyState from '@/components/ui/ClayEmptyState.vue'
import TopBar from '@/components/layout/TopBar.vue'
import { Plus, Edit2, Trash2, ChevronRight } from 'lucide-vue-next'
import type { Category, Direction } from '@/types'

const { t } = useI18n()
const categoriesStore = useCategoriesStore()
const appStore = useAppStore()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const formName = ref('')
const formIcon = ref('Wallet')
const formDirection = ref<Direction>('debit')
const formColor = ref('#8B5CF6')

onMounted(() => categoriesStore.load())

const iconOptions = [
  'Wallet', 'Briefcase', 'UtensilsCrossed', 'Car', 'ShoppingBag',
  'FileText', 'Tv', 'Heart', 'ArrowLeftRight', 'PiggyBank',
  'TrendingUp', 'TrendingDown', 'Home', 'Book', 'Gift',
  'Coffee', 'Plane', 'Dumbbell', 'Smartphone', 'Shirt',
]

const colorOptions = [
  '#8B5CF6', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B',
  '#F43F5E', '#6366F1', '#14B8A6', '#F97316', '#84CC16',
  '#E11D48', '#7C3AED', '#2563EB', '#059669', '#D97706',
]

function openCreate() {
  editingId.value = null
  formName.value = ''
  formIcon.value = 'Wallet'
  formDirection.value = 'debit'
  formColor.value = '#8B5CF6'
  showModal.value = true
}

function openEdit(cat: Category) {
  editingId.value = cat.id
  formName.value = cat.name
  formIcon.value = cat.icon
  formDirection.value = cat.defaultDirection
  formColor.value = cat.color
  showModal.value = true
}

async function handleSave() {
  if (!formName.value.trim()) return
  if (editingId.value) {
    await categoriesStore.update(editingId.value, {
      name: formName.value.trim(),
      icon: formIcon.value,
      defaultDirection: formDirection.value,
      color: formColor.value,
    })
  } else {
    await categoriesStore.create({
      name: formName.value.trim(),
      icon: formIcon.value,
      defaultDirection: formDirection.value,
      color: formColor.value,
      order: categoriesStore.items.length,
    })
  }
  showModal.value = false
}

async function handleDelete(id: string) {
  if (!confirm(t('common.confirmDelete'))) return
  await categoriesStore.remove(id)
}
</script>

<template>
  <div>
    <TopBar :title="t('categories.title')" :right-action="t('common.add')" @right-click="openCreate" />

    <div class="py-4 space-y-2">
      <div v-if="categoriesStore.items.length === 0">
        <ClayEmptyState :title="t('categories.noCategories')" />
      </div>

      <ClayCard
        v-for="cat in categoriesStore.items"
        :key="cat.id"
        padding="p-3"
        hover
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-clay-sm flex items-center justify-center shrink-0"
            :style="{ backgroundColor: cat.color + '20' }"
          >
            <span class="text-lg" :style="{ color: cat.color }">●</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-clay-ink">{{ cat.name }}</p>
            <p class="text-xs text-clay-muted">
              {{ cat.defaultDirection === 'credit' ? t('categories.receivesMoney') : t('categories.sendsMoney') }}
            </p>
          </div>
          <div class="flex items-center gap-1">
            <button class="clay-button-ghost p-1.5" @click="openEdit(cat)">
              <Edit2 class="w-4 h-4 text-clay-muted" />
            </button>
            <button class="clay-button-ghost p-1.5" @click="handleDelete(cat.id)">
              <Trash2 class="w-4 h-4 text-clay-expense" />
            </button>
          </div>
        </div>
      </ClayCard>
    </div>

    <ClayModal :show="showModal" :title="editingId ? t('categories.editCategory') : t('categories.newCategory')" @close="showModal = false">
      <div class="flex flex-col gap-4">
        <ClayInput v-model="formName" :label="t('common.name')" />
        <ClaySelect v-model="formDirection" :label="t('categories.defaultDirection')" :options="[
          { value: 'credit', label: t('categories.receivesMoney') },
          { value: 'debit', label: t('categories.sendsMoney') },
        ]" />
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-medium text-clay-muted">{{ t('common.color') }}</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="c in colorOptions"
              :key="c"
              type="button"
              class="w-7 h-7 rounded-full border-2 transition-all"
              :class="formColor === c ? 'border-clay-ink scale-110' : 'border-transparent'"
              :style="{ backgroundColor: c }"
              @click="formColor = c"
            />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <ClayButton variant="secondary" @click="showModal = false">{{ t('common.cancel') }}</ClayButton>
          <ClayButton class="flex-1" @click="handleSave">{{ t('common.save') }}</ClayButton>
        </div>
      </div>
    </ClayModal>
  </div>
</template>
