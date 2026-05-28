export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>
  getById(id: string): Promise<T | undefined>
  create(item: T): Promise<T>
  update(id: string, item: Partial<T> & Pick<T, 'id'>): Promise<T>
  delete(id: string): Promise<void>
  setAll(items: T[]): Promise<void>
  clear(): Promise<void>
}
