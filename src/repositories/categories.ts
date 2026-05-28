import type { Repository } from './interfaces'
import { LocalStorageRepository } from './localStorage'
import type { Category } from '@/types'

export interface ICategoryRepository extends Repository<Category> {}

export class LocalStorageCategoryRepository
  extends LocalStorageRepository<Category>
  implements ICategoryRepository
{
  constructor() {
    super('billuyo:categories')
  }
}
