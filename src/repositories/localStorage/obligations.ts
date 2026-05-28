import type { Obligation, ObligationAction } from '@/types'
import { LocalStorageRepository } from './repository'
import type { IObligationRepository, IObligationActionRepository } from '../obligations'

export class LocalStorageObligationRepository
  extends LocalStorageRepository<Obligation>
  implements IObligationRepository
{
  constructor() {
    super('billuyo:obligations')
  }
}

export class LocalStorageObligationActionRepository
  extends LocalStorageRepository<ObligationAction>
  implements IObligationActionRepository
{
  constructor() {
    super('billuyo:obligationActions')
  }
}
