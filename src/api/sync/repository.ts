import type { Repository } from '@/repositories/interfaces'
import type { SyncEngine } from './engine'
import type { EntityName } from './types'

export class SyncedRepository<T extends { id: string }> implements Repository<T> {
  constructor(
    private inner: Repository<T>,
    private entityName: EntityName,
    private engine: SyncEngine,
  ) {}

  async create(item: T): Promise<T> {
    const result = await this.inner.create(item)
    this.engine.enqueue(this.entityName, 'create', item.id, item)
    return result
  }

  async update(id: string, item: Partial<T> & Pick<T, 'id'>): Promise<T> {
    const result = await this.inner.update(id, item)
    this.engine.enqueue(this.entityName, 'update', id, item)
    return result
  }

  async delete(id: string): Promise<void> {
    await this.inner.delete(id)
    this.engine.enqueue(this.entityName, 'delete', id)
  }

  async getAll(): Promise<T[]> { return this.inner.getAll() }
  async getById(id: string): Promise<T | undefined> { return this.inner.getById(id) }
  async setAll(items: T[]): Promise<void> { return this.inner.setAll(items) }
  async clear(): Promise<void> { return this.inner.clear() }
}
