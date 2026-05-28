import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account } from '@/types'
import { LocalStorageAccountRepository } from '@/repositories'
import { generateId } from '@/utils/id'

const repo = new LocalStorageAccountRepository()

export const useAccountsStore = defineStore('accounts', () => {
  const items = ref<Account[]>([])

  async function load() {
    items.value = await repo.getAll()
  }

  async function create(data: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const item: Account = { ...data, id: generateId(), createdAt: now, updatedAt: now }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<Account>) {
    const now = new Date().toISOString()
    items.value = items.value.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i)
    await repo.update(id, { ...data, id, updatedAt: now } as Account)
  }

  async function setAllData(data: Account[]) {
    items.value = data
    await repo.setAll(data)
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    await repo.delete(id)
  }

  function getById(id: string): Account | undefined {
    return items.value.find(i => i.id === id)
  }

  const getAllRaw = items
  const defaultExpense = computed(() => items.value.find(a => a.isDefaultExpenses))
  const defaultSavings = computed(() => items.value.find(a => a.isDefaultSavings))

  return { items, getAllRaw, defaultExpense, defaultSavings, load, create, update, remove, getById, setAllData }
})
