import { DapiHelper } from '@shared/helpers/DapiHelper'
import { EDapiMessageTypes, type TDapiRequest } from '@shared/types/dapi'

const requestQueue: TDapiRequest[] = []

function processQueue() {
  if (requestQueue.length === 0) return
  const request = requestQueue[0]
  chrome.runtime.sendMessage({ type: `dapi:${request.event}`, from: 'content-script', args: request })
}

// This listener is for handling results from the background script
chrome.runtime.onMessage.addListener(message => {
  if (message.type !== EDapiMessageTypes.NEON_WALLET_APP_RESULT) return
  const { response, error, request } = message
  window.postMessage(
    { request, type: EDapiMessageTypes.NEON_WALLET_INJECTED_RESULT, response, error },
    window.location.origin
  )

  requestQueue.shift()
  processQueue()
})

// This listener is for handling requests from the injected dapi provider in the MAIN world(neo3-injected-dapi-provider.iife.ts)
window.addEventListener('message', event => {
  if (event.source !== window || event.data?.type !== EDapiMessageTypes.NEON_WALLET_INJECTED_REQUEST) return

  requestQueue.push({
    id: event.data.id,
    method: event.data.method,
    event: event.data.event,
    args: event.data.args,
    origin: event.origin,
    type: event.data.type,
    icon: DapiHelper.getDappIcon(),
    name: location.hostname,
  })

  if (requestQueue.length === 1) {
    processQueue()
  }
})
