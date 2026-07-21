import type { TDapiConnectedDapp, TDapiRequest } from '@shared/types/dapi'

const DAPI_CONNECTED_APPS_KEY = 'dapi:connected-dapps'

export class DapiHelper {
  static getDappIcon() {
    const faviconElement: HTMLLinkElement | null = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    )

    if (faviconElement) {
      return faviconElement?.href
    }

    return `${location.origin}/favicon.ico`
  }

  static async getConnectedDapps(): Promise<Record<string, TDapiConnectedDapp>> {
    const object = await chrome.storage.local.get(DAPI_CONNECTED_APPS_KEY)
    return (object[DAPI_CONNECTED_APPS_KEY] as Record<string, TDapiConnectedDapp>) || {}
  }

  static async storeConnectedDapp(request: TDapiRequest, networks: string[], address: string) {
    const connectedDapps = await this.getConnectedDapps()
    const updated = { ...connectedDapps, [request.origin]: { address, networks } }
    await chrome.storage.local.set({ [DAPI_CONNECTED_APPS_KEY]: updated })
  }

  static getRequestFromQuery() {
    const params = new URLSearchParams(window.location.search)
    const request = params.get('request')
    if (!request) return undefined
    const parsedRequest = JSON.parse(request) as TDapiRequest

    return {
      ...parsedRequest,
      args: parsedRequest.args.filter(Boolean),
    }
  }
}
