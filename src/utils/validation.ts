import type { AppData, Obligation, ObligationAction, AppSettings } from '@/types'
import { generateId } from '@/utils/id'

const CURRENT_VERSION = '0.1.0'

const REQUIRED_KEYS: (keyof AppData)[] = [
  'version', 'exportedAt', 'settings',
  'categories', 'accounts', 'transactions',
  'budgets', 'obligations', 'obligationActions',
]

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  data: AppData | null
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function migrateLegacy(raw: Record<string, unknown>): void {
  // v0.1.0: trackingEntries → budgets
  if ('trackingEntries' in raw && !('budgets' in raw)) {
    raw.budgets = raw.trackingEntries
  }

  // v0.1.0: trackingEntryId → budgetId in obligations
  if (Array.isArray(raw.obligations)) {
    for (const obl of raw.obligations) {
      if (obl && typeof obl === 'object' && 'trackingEntryId' in obl && !('budgetId' in obl)) {
        ;(obl as any).budgetId = (obl as any).trackingEntryId
        delete (obl as any).trackingEntryId
      }
    }
  }
}

export function validateAppData(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!isObject(raw)) {
    return { valid: false, errors: ['Root must be a JSON object'], warnings: [], data: null }
  }

  // Run migration before validation
  const needsMigration = 'trackingEntries' in raw
  if (needsMigration) {
    warnings.push('Legacy data detected — migrating from v0.1.0 format')
    migrateLegacy(raw)
  }

  for (const key of REQUIRED_KEYS) {
    if (!(key in raw)) {
      errors.push(`Missing required key: "${key}"`)
    }
  }

  if (!errors.length && typeof raw.version !== 'string') {
    errors.push('"version" must be a string')
  }

  if (raw.settings && !isObject(raw.settings)) {
    errors.push('"settings" must be an object')
  }

  for (const listKey of ['categories', 'accounts', 'transactions', 'budgets', 'obligations', 'obligationActions'] as const) {
    const arr = raw[listKey]
    if (!Array.isArray(arr)) {
      if (!errors.includes(`Missing required key: "${listKey}"`)) {
        errors.push(`"${listKey}" must be an array`)
      }
    }
  }

  if (errors.length) {
    return { valid: false, errors, warnings, data: null }
  }

  const data = raw as unknown as AppData

  if (data.settings && !data.settings.userId) {
    data.settings.userId = generateId()
    warnings.push('No userId found in imported data — generated a new one')
  }

  return { valid: true, errors, warnings, data }
}

export function createEmptyAppData(settings?: Partial<AppSettings>): AppData {
  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    userId: generateId(),
    settings: {
      userId: generateId(),
      language: 'en',
      defaultCurrency: 'USD',
      onboarded: false,
      ...settings,
    },
    categories: [],
    accounts: [],
    transactions: [],
    budgets: [],
    obligations: [],
    obligationActions: [],
  }
}

export function exportData(data: AppData): string {
  data.version = CURRENT_VERSION
  data.exportedAt = new Date().toISOString()
  return JSON.stringify(data, null, 2)
}
