import type { TFileHelperPickOptions, TFileHelperPickResult } from '@shared/types/helpers'

export class FileHelper {
  static async pick(options?: TFileHelperPickOptions): Promise<TFileHelperPickResult | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'

      if (options?.accept) {
        input.accept = options.accept
      }

      input.onchange = async () => {
        try {
          const file = input.files?.[0]

          if (!file) {
            resolve(null)
            return
          }

          const content = await file.text()

          resolve({
            name: file.name,
            content,
            size: file.size,
          })
        } catch (error) {
          reject(error)
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
      input.remove()
    })
  }

  static download(content: string, options: BlobPropertyBag, fileName: string) {
    const blob = new Blob([content], options)

    const url = URL.createObjectURL(blob)

    try {
      chrome.downloads.download({
        url: url,
        filename: fileName,
        saveAs: true,
      })
    } catch {
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    setTimeout(() => URL.revokeObjectURL(url), 100)
  }
}
