import type { Repository } from './interfaces'
import type { Obligation, ObligationAction } from '@/types'

export interface IObligationRepository extends Repository<Obligation> {}

export interface IObligationActionRepository extends Repository<ObligationAction> {}
