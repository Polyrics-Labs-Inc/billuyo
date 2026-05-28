import type { Category } from '@/types'
import { LocalStorageRepository } from './repository'
import type { ICategoryRepository } from '../categories'

export class LocalStorageCategoryRepository
  extends LocalStorageRepository<Category>
  implements ICategoryRepository
{
  constructor() {
    super('billuyo:categories')
  }
}
