export function formatCurrency(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export function formatNumber(amount: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(amount)
  } catch {
    return String(amount)
  }
}
