import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TrackingEntry } from '@/types'
import { LocalStorageRepository } from '@/repositories'
import { generateId } from '@/utils/id'

const repo = new LocalStorageRepository<TrackingEntry>('billuyo:tracking')

export const useTrackingStore = defineStore('tracking', () => {
  const items = ref<TrackingEntry[]>([])

  async function load() {
    items.value = await repo.getAll()
  }

  async function create(data: Omit<TrackingEntry, 'id'>) {
    const item: TrackingEntry = { ...data, id: generateId() }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<TrackingEntry>) {
    items.value = items.value.map(i => i.id === id ? { ...i, ...data } : i)
    await repo.update(id, { ...data, id } as TrackingEntry)
  }

  async function setAllData(data: TrackingEntry[]) {
    items.value = data
    await repo.setAll(data)
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    await repo.delete(id)
  }

  function getById(id: string): TrackingEntry | undefined {
    return items.value.find(i => i.id === id)
  }

  const getAllRaw = items

  return { items, getAllRaw, load, create, update, remove, getById, setAllData }
})
