import { SyncQueue } from './queue'
import { ApiClient } from '../client'
import type { EntityName, SyncOperation, SyncEntry } from './types'
import { MAX_RETRIES } from './types'

export class SyncEngine {
  private started = false
  private timerId: number | null = null
  private processing = false

  constructor(
    private client: ApiClient,
    private queue: SyncQueue,
  ) {}

  enqueue(entity: EntityName, operation: SyncOperation, entityId: string, data?: unknown): void {
    if (!this.client.isEnabled) return
    this.ensureStarted()
    this.queue.push(entity, operation, entityId, data)
  }

  private ensureStarted(): void {
    if (this.started) return
    this.started = true

    if (this.queue.size() > 0 && navigator.onLine) {
      this.processQueue()
    }

    window.addEventListener('online', this.onOnline)
    window.addEventListener('offline', this.onOffline)

    this.timerId = window.setInterval(() => {
      if (navigator.onLine && this.queue.size() > 0) {
        this.processQueue()
      }
    }, 30_000)
  }

  stop(): void {
    if (!this.started) return
    window.removeEventListener('online', this.onOnline)
    window.removeEventListener('offline', this.onOffline)
    if (this.timerId !== null) clearInterval(this.timerId)
    this.started = false
  }

  private onOnline = (): void => {
    if (this.queue.size() > 0) {
      this.processQueue()
    }
  }

  private onOffline = (): void => {
    // queue is already persisted
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return
    this.processing = true

    try {
      while (this.queue.size() > 0 && navigator.onLine) {
        const entry = this.queue.peek()
        if (!entry) break

        const success = await this.processEntry(entry)
        if (success) {
          this.queue.shift()
        } else {
          entry.retries++
          this.queue.updateFirst({ retries: entry.retries })
          if (entry.retries >= MAX_RETRIES) {
            this.queue.moveToDeadLetter()
          }
          break
        }
      }
    } finally {
      this.processing = false
    }
  }

  private async processEntry(entry: SyncEntry): Promise<boolean> {
    try {
      const path = `/${entry.entity}/${entry.entityId}`
      switch (entry.operation) {
        case 'create':
          await this.client.request('POST', `/${entry.entity}`, entry.data)
          break
        case 'update':
          await this.client.request('PUT', path, entry.data)
          break
        case 'delete':
          await this.client.request('DELETE', path)
          break
      }
      return true
    } catch {
      return false
    }
  }
}
