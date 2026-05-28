import type { Category } from '@/types'

export function categoryDisplayName(cat: Category, t: (key: string) => string): string {
  if (cat.nameKey) return t(cat.nameKey)
  return cat.name
}
