import type { TCurrency } from '@shared/types/store'

type TCurrencyOptions = {
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showZero?: boolean
  showApproximatedSymbol?: boolean
}

export class NumberHelper {
  static number(input: string | number) {
    if (typeof input === 'number') {
      return input
    }

    return parseFloat(input) || 0
  }

  static currency(input: string | number, currency: TCurrency, options?: TCurrencyOptions) {
    const {
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      showZero = true,
      showApproximatedSymbol = false,
    } = options ?? {}

    const num = Number(input)
    let result = '0'

    try {
      result = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.label,
        minimumFractionDigits,
        maximumFractionDigits,
      })
        .format(isNaN(num) ? 0 : num)
        .replace(/^(\D+)/, '$1 ')
        .replace(/\s+/, ' ')

      if (!showZero && num === 0) result = result.replace('0', '--').replaceAll('0', '-')
    } catch (error) {
      console.error(error)
    }

    if (showApproximatedSymbol) result = `~${result}`

    return result
  }

  private static countDecimals(value: string | number) {
    const [, decimals] = value.toString().split('.')
    return decimals?.length ?? 0
  }

  static formatString(value: string | number, decimals: number = 0, max?: number, removeTrailingZeros = false) {
    let newValue = typeof value === 'number' ? value.toFixed(decimals) : value

    newValue = newValue.replace(/,|\.\.|\.,/g, '.')

    if (decimals === 0) {
      newValue = newValue.replace(/[^\d]/g, '')
    } else {
      newValue = newValue.replace(/[^\d.]/g, '')
      const countDecimals = this.countDecimals(newValue)

      if (countDecimals > decimals) {
        newValue = newValue.slice(0, newValue.length - countDecimals + decimals)
      }
    }

    newValue = newValue.replace(/\s|-/g, '').replace(/^([^.]*\.)(.*)$/, function (_a, b, c) {
      return b + c.replace(/\./g, '')
    })

    if (typeof max === 'number') newValue = newValue.slice(0, max)

    if (removeTrailingZeros) {
      newValue = newValue === '0' ? newValue : newValue.replace(/\.?0+$/, '')
    }

    return newValue
  }
}
