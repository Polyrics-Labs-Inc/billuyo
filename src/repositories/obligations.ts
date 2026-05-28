import type { Repository } from './interfaces'
import { LocalStorageRepository } from './localStorage'
import type { Obligation, ObligationAction } from '@/types'

export interface IObligationRepository extends Repository<Obligation> {}

export interface IObligationActionRepository extends Repository<ObligationAction> {}

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
