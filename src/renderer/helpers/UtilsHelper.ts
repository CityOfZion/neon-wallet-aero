import { getI18n } from 'react-i18next'
import { ACCOUNT_COLOR_SKINS } from '@shared/constants/skins'
import { TColorSkin } from '@shared/types/store'
import { format } from 'date-fns'
import * as uuid from 'uuid'

import { ToastHelper } from './ToastHelper'

type TRemoveSpecialCharacterOptions = {
  allowSpaces?: boolean
  allowDots?: boolean
  allowCommas?: boolean
  trimText?: boolean
}

export class UtilsHelper {
  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static uuid() {
    return uuid.v4()
  }

  static downloadSVGToPng(elementId: string, suggestedFileName?: string) {
    return new Promise<void>((resolve, reject) => {
      const svg = document.getElementById(elementId)
      if (!svg) {
        reject()
        return
      }

      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject()
        return
      }

      const img = new Image()

      const fileName = suggestedFileName || `neon3-qr-code-${format(new Date(), 'yyyy-MM-dd')}.png`

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')

        downloadLink.download = fileName
        downloadLink.href = pngFile
        downloadLink.click()

        canvas.remove()
        downloadLink.remove()
        img.remove()

        resolve()
      }

      img.onerror = () => {
        reject()
      }

      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    })
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

  static isHexadecimal(hexadecimal: string) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hexadecimal)
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
    const { t } = getI18n()

    ToastHelper.success({ message: t('common:general.successfullyCopied') })
    return await navigator.clipboard.writeText(text)
  }

  static removeSpecialCharacters(text: string, options?: TRemoveSpecialCharacterOptions) {
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
}
