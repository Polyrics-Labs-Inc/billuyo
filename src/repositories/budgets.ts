import type { Repository } from './interfaces'
import { LocalStorageRepository } from './localStorage'
import type { Budget } from '@/types'

export interface IBudgetRepository extends Repository<Budget> {}

export class LocalStorageBudgetRepository
  extends LocalStorageRepository<Budget>
  implements IBudgetRepository
{
  constructor() {
    super('billuyo:budgets')
  }
}
