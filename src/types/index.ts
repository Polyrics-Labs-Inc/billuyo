export type Language = 'en' | 'es'

export type ObligationType = 'income' | 'savings' | 'expense'

export type Direction = 'credit' | 'debit'

export type FrequencyUnit = 'D' | 'W' | 'M' | 'Y'

export interface Frequency {
  value: number
  unit: FrequencyUnit
  startDate: string
}

export interface Category {
  id: string
  name: string
  icon: string
  defaultDirection: Direction
  color: string
  order: number
}

export interface Account {
  id: string
  name: string
  description: string
  currency: string
  color: string
  icon: string
  initialBalance: number
  isDefaultSavings: boolean
  isDefaultExpenses: boolean
  createdAt: string
}

export interface TransactionEffect {
  id: string
  transactionId: string
  accountId: string
  direction: Direction
  amount: number
  categoryId: string
}

export interface Transaction {
  id: string
  amount: number
  currency: string
  date: string
  time: string
  description: string
  effects: TransactionEffect[]
  obligationActionId?: string
  createdAt: string
}

export interface TrackingEntry {
  id: string
  name: string
  description: string
  frequency: Frequency
  endDate?: string
  color: string
  icon: string
}

export interface Obligation {
  id: string
  name: string
  type: ObligationType
  expectedValue: number
  currency: string
  frequency: Frequency
  accountId: string
  categoryId: string
  trackingEntryId?: string
  color: string
}

export interface ObligationAction {
  id: string
  obligationId: string
  actualAmount: number
  date: string
  time: string
  periodStart: string
  periodEnd: string
  completed: boolean
  transactionId?: string
}

export interface AppSettings {
  language: Language
  defaultCurrency: string
  onboarded: boolean
}

export interface AppData {
  version: string
  exportedAt: string
  settings: AppSettings
  categories: Category[]
  accounts: Account[]
  transactions: Transaction[]
  trackingEntries: TrackingEntry[]
  obligations: Obligation[]
  obligationActions: ObligationAction[]
}

export interface PeriodInfo {
  start: Date
  end: Date
  label: string
}
