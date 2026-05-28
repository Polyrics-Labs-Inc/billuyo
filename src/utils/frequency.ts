import {
  addDays, addWeeks, addMonths, addYears,
  startOfDay, isAfter, isBefore, parseISO, format,
} from 'date-fns'
import type { Frequency, FrequencyUnit, PeriodInfo } from '@/types'

export function addToDate(date: Date, value: number, unit: FrequencyUnit): Date {
  switch (unit) {
    case 'D': return addDays(date, value)
    case 'W': return addWeeks(date, value)
    case 'M': return addMonths(date, value)
    case 'Y': return addYears(date, value)
  }
}

export function getCurrentPeriod(freq: Frequency, now: Date = new Date()): PeriodInfo {
  const start = parseISO(freq.startDate)
  if (isAfter(startOfDay(now), startOfDay(start))) {
    return getPeriodAt(freq, now)
  }
  return { start, end: addToDate(start, freq.value, freq.unit), label: format(start, 'PP') }
}

export function getPeriodAt(freq: Frequency, at: Date): PeriodInfo {
  const startDate = parseISO(freq.startDate)
  const start = startOfDay(startDate)
  const target = startOfDay(at)

  if (!isAfter(target, start) || !isAfter(target, start)) {
    return { start, end: addToDate(start, freq.value, freq.unit), label: format(start, 'PP') }
  }

  let periodStart = start
  let periodEnd = addToDate(start, freq.value, freq.unit)

  while (isAfter(target, periodEnd) || isBefore(target, periodStart)) {
    if (isAfter(target, periodEnd)) {
      periodStart = periodEnd
      periodEnd = addToDate(periodStart, freq.value, freq.unit)
    } else {
      periodEnd = periodStart
      periodStart = addToDate(periodStart, -freq.value, freq.unit)
      if (isBefore(periodStart, start)) {
        periodStart = start
        periodEnd = addToDate(start, freq.value, freq.unit)
        break
      }
    }
  }

  return {
    start: periodStart,
    end: periodEnd,
    label: `${format(periodStart, 'MMM d, yyyy')} - ${format(periodEnd, 'MMM d, yyyy')}`,
  }
}

export function getPreviousPeriod(period: PeriodInfo, freq: Frequency): PeriodInfo {
  const start = addToDate(period.start, -freq.value, freq.unit)
  return {
    start,
    end: addToDate(start, freq.value, freq.unit),
    label: `${format(start, 'MMM d, yyyy')} - ${format(addToDate(start, freq.value, freq.unit), 'MMM d, yyyy')}`,
  }
}

export function getNextPeriod(period: PeriodInfo, freq: Frequency): PeriodInfo {
  const start = period.end
  return {
    start,
    end: addToDate(start, freq.value, freq.unit),
    label: `${format(start, 'MMM d, yyyy')} - ${format(addToDate(start, freq.value, freq.unit), 'MMM d, yyyy')}`,
  }
}

export function formatFrequency(freq: Frequency, t?: (key: string) => string): string {
  const unitLabels: Record<FrequencyUnit, string> = {
    D: 'Day(s)',
    W: 'Week(s)',
    M: 'Month(s)',
    Y: 'Year(s)',
  }
  if (t) {
    unitLabels.D = t('frequency.days')
    unitLabels.W = t('frequency.weeks')
    unitLabels.M = t('frequency.months')
    unitLabels.Y = t('frequency.years')
  }
  return `Every ${freq.value} ${unitLabels[freq.unit]} from ${freq.startDate}`
}
