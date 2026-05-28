import type { Repository } from './interfaces'
import { LocalStorageRepository } from './localStorage'
import type { Account } from '@/types'

export interface IAccountRepository extends Repository<Account> {}

export class LocalStorageAccountRepository
  extends LocalStorageRepository<Account>
  implements IAccountRepository
{
  constructor() {
    super('billuyo:accounts')
  }
}
