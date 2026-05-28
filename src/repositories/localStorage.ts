import type { Repository } from './interfaces'

export class LocalStorageRepository<T extends { id: string }> implements Repository<T> {
  constructor(private storageKey: string) {}

  private async readAll(): Promise<T[]> {
    try {
      const raw = localStorage.getItem(this.storageKey)
      if (!raw) return []
      return JSON.parse(raw) as T[]
    } catch {
      console.warn(`Corrupted data for key "${this.storageKey}", resetting.`)
      localStorage.removeItem(this.storageKey)
      return []
    }
  }

  private async writeAll(items: T[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  async getAll(): Promise<T[]> {
    return this.readAll()
  }

  async getById(id: string): Promise<T | undefined> {
    const items = await this.readAll()
    return items.find(i => i.id === id)
  }

  async create(item: T): Promise<T> {
    const items = await this.readAll()
    items.push(item)
    await this.writeAll(items)
    return item
  }

  async update(id: string, item: Partial<T> & Pick<T, 'id'>): Promise<T> {
    const items = await this.readAll()
    const index = items.findIndex(i => i.id === id)
    if (index === -1) throw new Error(`Item with id "${id}" not found`)
    items[index] = { ...items[index], ...item }
    await this.writeAll(items)
    return items[index]
  }

  async delete(id: string): Promise<void> {
    const items = await this.readAll()
    const filtered = items.filter(i => i.id !== id)
    if (filtered.length === items.length) return // not found, silently ignore
    await this.writeAll(filtered)
  }

  async setAll(items: T[]): Promise<void> {
    await this.writeAll(items)
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey)
  }
}
