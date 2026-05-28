import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import { LocalStorageRepository } from '@/repositories'
import { generateId } from '@/utils/id'

const repo = new LocalStorageRepository<Category>('billuyo:categories')

const DEFAULT_CATEGORIES: Category[] = [
  { id: generateId(), name: 'Salary', icon: 'Wallet', defaultDirection: 'credit', color: '#10B981', order: 0 },
  { id: generateId(), name: 'Freelance', icon: 'Briefcase', defaultDirection: 'credit', color: '#0EA5E9', order: 1 },
  { id: generateId(), name: 'Food', icon: 'UtensilsCrossed', defaultDirection: 'debit', color: '#F43F5E', order: 2 },
  { id: generateId(), name: 'Transport', icon: 'Car', defaultDirection: 'debit', color: '#F59E0B', order: 3 },
  { id: generateId(), name: 'Shopping', icon: 'ShoppingBag', defaultDirection: 'debit', color: '#EC4899', order: 4 },
  { id: generateId(), name: 'Bills', icon: 'FileText', defaultDirection: 'debit', color: '#8B5CF6', order: 5 },
  { id: generateId(), name: 'Entertainment', icon: 'Tv', defaultDirection: 'debit', color: '#F97316', order: 6 },
  { id: generateId(), name: 'Health', icon: 'Heart', defaultDirection: 'debit', color: '#EF4444', order: 7 },
  { id: generateId(), name: 'Transfer', icon: 'ArrowLeftRight', defaultDirection: 'credit', color: '#6366F1', order: 8 },
  { id: generateId(), name: 'Savings', icon: 'PiggyBank', defaultDirection: 'debit', color: '#14B8A6', order: 9 },
  { id: generateId(), name: 'Income', icon: 'TrendingUp', defaultDirection: 'credit', color: '#22C55E', order: 10 },
  { id: generateId(), name: 'Expense', icon: 'TrendingDown', defaultDirection: 'debit', color: '#FB7185', order: 11 },
]

export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<Category[]>([])

  async function load() {
    items.value = await repo.getAll()
    if (items.value.length === 0) {
      await repo.setAll(DEFAULT_CATEGORIES)
      items.value = DEFAULT_CATEGORIES
    }
  }

  async function create(data: Omit<Category, 'id'>) {
    const item: Category = { ...data, id: generateId() }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<Category>) {
    items.value = items.value.map(i => i.id === id ? { ...i, ...data } : i)
    await repo.update(id, { ...data, id } as Category)
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
