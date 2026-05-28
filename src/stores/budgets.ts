import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Budget } from '@/types'
import { LocalStorageBudgetRepository } from '@/repositories'
import { generateId } from '@/utils/id'

const repo = new LocalStorageBudgetRepository()

export const useBudgetsStore = defineStore('budgets', () => {
  const items = ref<Budget[]>([])

  async function load() {
    items.value = await repo.getAll()
  }

  async function create(data: Omit<Budget, 'id' | 'updatedAt'>) {
    const item: Budget = { ...data, id: generateId(), updatedAt: new Date().toISOString() }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<Budget>) {
    const now = new Date().toISOString()
    items.value = items.value.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i)
    await repo.update(id, { ...data, id, updatedAt: now } as Budget)
  }

  async function setAllData(data: Budget[]) {
    items.value = data
    await repo.setAll(data)
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    await repo.delete(id)
  }

  function getById(id: string): Budget | undefined {
    return items.value.find(i => i.id === id)
  }

  const getAllRaw = items

  return { items, getAllRaw, load, create, update, remove, getById, setAllData }
})
