import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Obligation, ObligationAction, PeriodInfo } from '@/types'
import { LocalStorageObligationRepository, LocalStorageObligationActionRepository } from '@/repositories'
import { SyncedRepository, syncEngine } from '@/api/sync'
import { generateId } from '@/utils/id'
import { isAfter, parseISO } from 'date-fns'

const obligationRepo = new SyncedRepository(new LocalStorageObligationRepository(), 'obligation', syncEngine)
const actionRepo = new SyncedRepository(new LocalStorageObligationActionRepository(), 'obligationAction', syncEngine)

export const useObligationsStore = defineStore('obligations', () => {
  const obligations = ref<Obligation[]>([])
  const actions = ref<ObligationAction[]>([])

  async function load() {
    obligations.value = await obligationRepo.getAll()
    actions.value = await actionRepo.getAll()
  }

  async function createObligation(data: Omit<Obligation, 'id' | 'updatedAt'>) {
    const item: Obligation = { ...data, id: generateId(), updatedAt: new Date().toISOString() }
    obligations.value.push(item)
    await obligationRepo.create(item)
    return item
  }

  async function updateObligation(id: string, data: Partial<Obligation>) {
    const now = new Date().toISOString()
    obligations.value = obligations.value.map(i => i.id === id ? { ...i, ...data, updatedAt: now } : i)
    await obligationRepo.update(id, { ...data, id, updatedAt: now } as Obligation)
  }

  async function removeObligation(id: string) {
    obligations.value = obligations.value.filter(i => i.id !== id)
    actions.value = actions.value.filter(a => a.obligationId !== id)
    await obligationRepo.delete(id)
    await actionRepo.setAll(actions.value)
  }

  function getObligationById(id: string): Obligation | undefined {
    return obligations.value.find(i => i.id === id)
  }

  async function createAction(data: Omit<ObligationAction, 'id' | 'updatedAt'>) {
    const item: ObligationAction = { ...data, id: generateId(), updatedAt: new Date().toISOString() }
    actions.value.push(item)
    await actionRepo.create(item)
    return item
  }

  async function updateAction(id: string, data: Partial<ObligationAction>) {
    const now = new Date().toISOString()
    actions.value = actions.value.map(a => a.id === id ? { ...a, ...data, updatedAt: now } : a)
    await actionRepo.update(id, { ...data, id, updatedAt: now } as ObligationAction)
  }

  async function removeAction(id: string) {
    actions.value = actions.value.filter(a => a.id !== id)
    await actionRepo.delete(id)
  }

  function clearActions() {
    actions.value = []
    actionRepo.clear()
  }

  function getObligationsForPeriod(budgetId: string, period: PeriodInfo): Obligation[] {
    return obligations.value.filter(o => {
      if (o.budgetId && o.budgetId !== budgetId) return false
      const start = parseISO(o.frequency.startDate)
      return !isAfter(start, period.end)
    })
  }

  function getActionForObligationInPeriod(obligationId: string, period: PeriodInfo): ObligationAction | undefined {
    return actions.value.find(a =>
      a.obligationId === obligationId &&
      a.periodStart === period.start.toISOString() &&
      a.periodEnd === period.end.toISOString()
    )
  }

  function getActionsForPeriod(period: PeriodInfo): ObligationAction[] {
    return actions.value.filter(a =>
      a.periodStart === period.start.toISOString() &&
      a.periodEnd === period.end.toISOString()
    )
  }

  async function setAllData(obligationsData: Obligation[], actionsData: ObligationAction[]) {
    obligations.value = obligationsData
    actions.value = actionsData
    await obligationRepo.setAll(obligationsData)
    await actionRepo.setAll(actionsData)
  }

  return {
    obligations,
    actions,
    load,
    createObligation, updateObligation, removeObligation, getObligationById,
    createAction, updateAction, removeAction, clearActions,
    getObligationsForPeriod, getActionForObligationInPeriod, getActionsForPeriod,
    setAllData,
  }
})
