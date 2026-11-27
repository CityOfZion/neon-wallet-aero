import type { TStringHelperCapitalizeOptions, TStringHelperRemoveSpecialCharacterOptions } from '@shared/types/helpers'

export class StringHelper {
  static truncate(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '…'
    }

    return text
  }

  static truncateStart(text: string, maxLength: number) {
    if (text.length > maxLength) {
      const half = maxLength / 2

      return '…' + text.substring(text.length - half)
    }

    return text
  }

  static truncateMiddle(text: string, maxLength: number) {
    if (text.length > maxLength) {
      const half = maxLength / 2

      return text.substring(0, half) + '…' + text.substring(text.length - half)
    }

    return text
  }

  static removeSpecialCharacters(text: string, options?: TStringHelperRemoveSpecialCharacterOptions) {
    options = { allowSpaces: true, trimText: false, ...options }

    let regex = 'a-zA-Z0-9'
    if (options.allowDots) {
      regex += '.'
    }

    if (options.allowCommas) {
      regex += ','
    }

    if (options.allowSpaces) {
      regex += ' '
    }

    text = text.replace(new RegExp(`[^${regex}]`, 'g'), '')

    if (options.trimText) text = text.trim()

    return text
  }

  static getInitials(text: string) {
    const splitName = text.trim().split(' ')
    const initials = `${splitName[0][0]}${splitName[splitName.length - 1][0]}`

    return initials.toUpperCase()
  }

  static capitalize(text: string, { preserveRest = true }: TStringHelperCapitalizeOptions = {}) {
    const rest = text.slice(1)

    return `${text.charAt(0).toUpperCase()}${preserveRest ? rest : rest.toLowerCase()}`
  }

  static normalizeText(text: string) {
    return text.trim().toLowerCase()
  }
}
