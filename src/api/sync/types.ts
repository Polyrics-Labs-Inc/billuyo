export type EntityName =
  | 'category'
  | 'account'
  | 'transaction'
  | 'budget'
  | 'obligation'
  | 'obligationAction'

export type SyncOperation = 'create' | 'update' | 'delete'

export const MAX_RETRIES = 5

export interface SyncEntry {
  id: string
  entity: EntityName
  operation: SyncOperation
  entityId: string
  data?: unknown
  timestamp: string
  retries: number
}
