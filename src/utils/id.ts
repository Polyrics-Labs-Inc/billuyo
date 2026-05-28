import { nanoid } from 'nanoid'

export function generateId(): string {
  return nanoid(16)
}

export function isoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isoTime(): string {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function isoDateTime(): string {
  return new Date().toISOString()
}
