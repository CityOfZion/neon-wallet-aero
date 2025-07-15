export type TFilePickerOptions = {
  accept?: string
}

export type TFileResult = {
  name: string
  content: string
  size: number
}

export class FileHelper {
  static async pickFiles(options: TFilePickerOptions = {}): Promise<TFileResult | null> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'

      if (options.accept) {
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
    })
  }
}
