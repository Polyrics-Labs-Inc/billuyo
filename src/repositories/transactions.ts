import type { Repository } from './interfaces'
import { LocalStorageRepository } from './localStorage'
import type { Transaction } from '@/types'

export interface ITransactionRepository extends Repository<Transaction> {}

export class LocalStorageTransactionRepository
  extends LocalStorageRepository<Transaction>
  implements ITransactionRepository
{
  constructor() {
    super('billuyo:transactions')
  }
}
