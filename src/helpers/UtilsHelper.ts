import * as uuid from 'uuid'

import { ACCOUNT_COLOR_SKINS } from '@/constants/skins'
import { TColorSkin } from '@/types/store'

export class UtilsHelper {
  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static uuid() {
    return uuid.v4()
  }

  static getRandomNumber(max: number) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  static getSkinColor(index?: number) {
    const newIndex = index ?? UtilsHelper.getRandomNumber(7)

    return ACCOUNT_COLOR_SKINS[newIndex]?.id ?? ACCOUNT_COLOR_SKINS[0].id
  }

  static generateColorSkin(colorIndex?: number): TColorSkin {
    return { id: UtilsHelper.getSkinColor(colorIndex), type: 'color' }
  }

  static normalizeHash(hash: string) {
    return hash.replace('0x', '').toLowerCase()
  }

  static async promiseAll<T, R>(array: T[], callback: (item: T) => Promise<R> | R): Promise<R[]> {
    const results: R[] = []

    const promises = array.map(async item => {
      try {
        const result = await callback(item)

        results.push(result)
      } catch {
        /* empty */
      }
    })

    await Promise.all(promises)

    return results
  }

  static async copyToClipboard(text: string): Promise<void> {
    return await navigator.clipboard.writeText(text)
  }
}
