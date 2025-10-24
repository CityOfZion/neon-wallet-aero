type TRemoveSpecialCharacterOptions = {
  allowSpaces?: boolean
  trimText?: boolean
}

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

  static removeSpecialCharacters(text: string, options?: TRemoveSpecialCharacterOptions) {
    const { allowSpaces = true, trimText = false } = options ?? {}

    text = text.replace(allowSpaces ? /[^a-zA-Z0-9 ]/g : /[^a-zA-Z0-9]/g, '')

    if (trimText) text = text.trim()

    return text
  }

  static getInitials(text: string) {
    const splitName = text.trim().split(' ')
    const initials = `${splitName[0][0]}${splitName[splitName.length - 1][0]}`

    return initials.toUpperCase()
  }

  static normalizeText(text: string) {
    return text.trim().toLowerCase()
  }
}
