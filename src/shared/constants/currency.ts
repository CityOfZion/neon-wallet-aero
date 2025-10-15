import type { TCurrency } from '@shared/types/store'

export const AVAILABLE_CURRENCIES: TCurrency[] = [
  { symbol: 'U$', label: 'USD' },
  { symbol: '€', label: 'EUR' },
  { symbol: '£', label: 'GBP' },
  { symbol: 'R$', label: 'BRL' },
  { symbol: '¥', label: 'CNY' },
]
