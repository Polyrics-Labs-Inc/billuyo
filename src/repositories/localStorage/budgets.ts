import type { Budget } from '@/types'
import { LocalStorageRepository } from './repository'
import type { IBudgetRepository } from '../budgets'

export class LocalStorageBudgetRepository
  extends LocalStorageRepository<Budget>
  implements IBudgetRepository
{
  constructor() {
    super('billuyo:budgets')
  }
}
