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
}
