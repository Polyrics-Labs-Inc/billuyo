import type { AppData, Obligation, ObligationAction, AppSettings } from '@/types'

const CURRENT_VERSION = '0.1.0'

const REQUIRED_KEYS: (keyof AppData)[] = [
  'version', 'exportedAt', 'settings',
  'categories', 'accounts', 'transactions',
  'trackingEntries', 'obligations', 'obligationActions',
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

export function validateAppData(raw: unknown): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!isObject(raw)) {
    return { valid: false, errors: ['Root must be a JSON object'], warnings: [], data: null }
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

  for (const listKey of ['categories', 'accounts', 'transactions', 'trackingEntries', 'obligations', 'obligationActions'] as const) {
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

  try {
    const data = raw as unknown as AppData
    return { valid: true, errors, warnings, data }
  } catch {
    return { valid: false, errors: ['Failed to parse data'], warnings, data: null }
  }
}

export function createEmptyAppData(settings?: Partial<AppSettings>): AppData {
  return {
    version: CURRENT_VERSION,
    exportedAt: new Date().toISOString(),
    settings: {
      language: 'en',
      defaultCurrency: 'USD',
      onboarded: false,
      ...settings,
    },
    categories: [],
    accounts: [],
    transactions: [],
    trackingEntries: [],
    obligations: [],
    obligationActions: [],
  }
}

export function exportData(data: AppData): string {
  data.version = CURRENT_VERSION
  data.exportedAt = new Date().toISOString()
  return JSON.stringify(data, null, 2)
}
