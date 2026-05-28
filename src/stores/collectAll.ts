import { useAppStore } from './app'
import { useCategoriesStore } from './categories'
import { useAccountsStore } from './accounts'
import { useTransactionsStore } from './transactions'
import { useTrackingStore } from './tracking'
import { useObligationsStore } from './obligations'
import type { AppData } from '@/types'

export function collectAllData(): AppData {
  const app = useAppStore()
  const cat = useCategoriesStore()
  const acc = useAccountsStore()
  const txn = useTransactionsStore()
  const trk = useTrackingStore()
  const obl = useObligationsStore()
  return {
    version: '0.1.0',
    exportedAt: new Date().toISOString(),
    settings: { ...app.settings },
    categories: cat.items,
    accounts: acc.items,
    transactions: txn.items,
    trackingEntries: trk.items,
    obligations: obl.obligations,
    obligationActions: obl.actions,
  }
}
