export class MnemonicHelper {
  private static getWords(words: string | string[]) {
    return Array.isArray(words) ? words : words.trim().split(' ')
  }

  static isMnemonic(words: string | string[]) {
    return MnemonicHelper.getWords(words).length > 1
  }

  static isValidMnemonic(words: string | string[]) {
    return MnemonicHelper.getWords(words).length === 12
  }
}
