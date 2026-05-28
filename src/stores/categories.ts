import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import { LocalStorageCategoryRepository } from '@/repositories'
import { generateId } from '@/utils/id'
import { i18n } from '@/i18n'

const repo = new LocalStorageCategoryRepository()

function getDefaultCategories(): Category[] {
  const make = (key: string, icon: string, direction: 'credit' | 'debit', color: string, order: number): Category => {
    const name = i18n.global.t(key)
    return { id: generateId(), name: name !== key ? name : key.split('.').pop() || key, nameKey: key, icon, defaultDirection: direction, color, order, updatedAt: new Date().toISOString() }
  }
  return [
    make('categories.default.salary', 'Wallet', 'credit', '#10B981', 0),
    make('categories.default.freelance', 'Briefcase', 'credit', '#0EA5E9', 1),
    make('categories.default.food', 'UtensilsCrossed', 'debit', '#F43F5E', 2),
    make('categories.default.transport', 'Car', 'debit', '#F59E0B', 3),
    make('categories.default.shopping', 'ShoppingBag', 'debit', '#EC4899', 4),
    make('categories.default.bills', 'FileText', 'debit', '#8B5CF6', 5),
    make('categories.default.entertainment', 'Tv', 'debit', '#F97316', 6),
    make('categories.default.health', 'Heart', 'debit', '#EF4444', 7),
    make('categories.default.transfer', 'ArrowLeftRight', 'credit', '#6366F1', 8),
    make('categories.default.savings', 'PiggyBank', 'debit', '#14B8A6', 9),
    make('categories.default.income', 'TrendingUp', 'credit', '#22C55E', 10),
    make('categories.default.expense', 'TrendingDown', 'debit', '#FB7185', 11),
  ]
}

export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<Category[]>([])

  async function load() {
    items.value = await repo.getAll()
    if (items.value.length === 0) {
      const defaults = getDefaultCategories()
      await repo.setAll(defaults)
      items.value = defaults
    }
  }

  async function create(data: Omit<Category, 'id' | 'updatedAt'>) {
    const item: Category = { ...data, id: generateId(), updatedAt: new Date().toISOString() }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<Category>) {
    const now = new Date().toISOString()
    items.value = items.value.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i)
    await repo.update(id, { ...data, id, updatedAt: now } as Category)
  }

  async function setAllData(data: Category[]) {
    items.value = data
    await repo.setAll(data)
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    await repo.delete(id)
  }

  function getById(id: string): Category | undefined {
    return items.value.find(i => i.id === id)
  }

  const getAllRaw = items

  return { items, getAllRaw, load, create, update, remove, getById, setAllData }
})
