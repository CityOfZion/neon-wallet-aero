export class StringHelper {
  static truncateStringMiddle(text: string, maxLength: number) {
    if (text.length > maxLength) {
      const half = maxLength / 2
      return text.substring(0, half) + '…' + text.substring(text.length - half)
    }
    return text
  }
}
