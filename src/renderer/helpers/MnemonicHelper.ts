import { generateMnemonic } from '@cityofzion/bs-asteroid-sdk'

export class MnemonicHelper {
  private static getWords(words: string | string[]) {
    return Array.isArray(words) ? words : words.trim().split(' ')
  }

  static isMnemonic(words: string | string[]) {
    return MnemonicHelper.getWords(words).length > 1
  }

  static isValidMnemonic(words: string | string[]) {
    const wordArray = MnemonicHelper.getWords(words)
    return wordArray.length === 12 || wordArray.length === 24
  }

  static generateMnemonic() {
    return generateMnemonic()
  }
}
