import type { SyncEntry } from './types'
import { generateId } from '@/utils/id'

const STORAGE_KEY = 'billuyo:syncQueue'
const DL_KEY = 'billuyo:syncDeadLetter'

export class SyncQueue {
  private entries: SyncEntry[] = []

  constructor() {
    this.load()
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) this.entries = JSON.parse(raw)
    } catch {
      this.entries = []
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries))
  }

  push(entity: SyncEntry['entity'], operation: SyncEntry['operation'], entityId: string, data?: unknown): SyncEntry {
    const entry: SyncEntry = {
      id: generateId(),
      entity,
      operation,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    }
    this.entries.push(entry)
    this.save()
    return entry
  }

  peek(): SyncEntry | undefined {
    return this.entries[0]
  }

  shift(): SyncEntry | undefined {
    const entry = this.entries.shift()
    if (entry) this.save()
    return entry
  }

  updateFirst(updates: Partial<SyncEntry>): void {
    if (this.entries.length > 0) {
      Object.assign(this.entries[0], updates)
      this.save()
    }
  }

  moveToDeadLetter(): void {
    const entry = this.entries.shift()
    if (!entry) return
    try {
      const raw = localStorage.getItem(DL_KEY)
      const deadLetter: SyncEntry[] = raw ? JSON.parse(raw) : []
      deadLetter.push(entry)
      localStorage.setItem(DL_KEY, JSON.stringify(deadLetter))
    } catch {
      // silent
    }
    this.save()
  }

  size(): number {
    return this.entries.length
  }

  getAll(): SyncEntry[] {
    return [...this.entries]
  }

  clear(): void {
    this.entries = []
    localStorage.removeItem(STORAGE_KEY)
  }
}
