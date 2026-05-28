import type { Transaction } from '@/types'
import { LocalStorageRepository } from './repository'
import type { ITransactionRepository } from '../transactions'

export class LocalStorageTransactionRepository
  extends LocalStorageRepository<Transaction>
  implements ITransactionRepository
{
  constructor() {
    super('billuyo:transactions')
  }
}
