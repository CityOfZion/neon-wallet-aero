type TRemoveSpecialCharacterOptions = {
  allowSpaces?: boolean
  trimText?: boolean
}

export class StringHelper {
  static truncateStringMiddle(text: string, maxLength: number) {
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
}
