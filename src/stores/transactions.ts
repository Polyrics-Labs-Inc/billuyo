import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, TransactionEffect } from '@/types'
import { LocalStorageTransactionRepository } from '@/repositories'
import { generateId } from '@/utils/id'

const repo = new LocalStorageTransactionRepository()

export const useTransactionsStore = defineStore('transactions', () => {
  const items = ref<Transaction[]>([])

  async function load() {
    items.value = await repo.getAll()
  }

  async function create(data: {
    amount: number
    currency: string
    date: string
    time: string
    description: string
    effects: Omit<TransactionEffect, 'id' | 'transactionId'>[]
    obligationActionId?: string
  }) {
    const transactionId = generateId()
    const effects: TransactionEffect[] = data.effects.map(e => ({
      ...e,
      id: generateId(),
      transactionId,
    }))
    const now = new Date().toISOString()
    const item: Transaction = {
      id: transactionId,
      amount: data.amount,
      currency: data.currency,
      date: data.date,
      time: data.time,
      description: data.description,
      effects,
      obligationActionId: data.obligationActionId,
      createdAt: now,
      updatedAt: now,
    }
    items.value.push(item)
    await repo.create(item)
    return item
  }

  async function update(id: string, data: Partial<Transaction>) {
    const now = new Date().toISOString()
    if (data.effects) {
      data.effects = data.effects.map(e => ({
        ...e,
        id: e.id || generateId(),
        transactionId: id,
      }))
    }
    items.value = items.value.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i)
    await repo.update(id, { ...data, id, updatedAt: now } as Transaction)
  }

  async function setAllData(data: Transaction[]) {
    items.value = data
    await repo.setAll(data)
  }

  async function remove(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    await repo.delete(id)
  }

  function getById(id: string): Transaction | undefined {
    return items.value.find(i => i.id === id)
  }

  const getAllRaw = items as unknown as Transaction[]

  const sorted = computed(() =>
    [...items.value].sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date)
      if (dateCmp !== 0) return dateCmp
      return b.time.localeCompare(a.time)
    })
  )

  const recent = computed(() => sorted.value.slice(0, 10))

  function getByDateRange(from: string, to: string): Transaction[] {
    return items.value.filter(t => t.date >= from && t.date <= to)
  }

  return { items, getAllRaw, sorted, recent, getByDateRange, getById, load, create, update, remove, setAllData }
})
