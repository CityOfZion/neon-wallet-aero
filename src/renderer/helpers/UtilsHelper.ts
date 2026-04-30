import * as uuid from 'uuid'

import { DateHelper } from '@renderer/helpers/DateHelper'

export class UtilsHelper {
  static sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static uuid() {
    return uuid.v4()
  }

  static downloadSVGToPng(elementId: string) {
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

      const fileName = `NEON-qr-code-${DateHelper.getNowUnix()}.png`

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

  static parseJsonSafely(value: any): any {
    if (typeof value !== 'string') return value

    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
}
