import type { Account } from '@/types'
import { LocalStorageRepository } from './repository'
import type { IAccountRepository } from '../accounts'

export class LocalStorageAccountRepository
  extends LocalStorageRepository<Account>
  implements IAccountRepository
{
  constructor() {
    super('billuyo:accounts')
  }
}
