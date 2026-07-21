import { registerLoginHandlers, restoreSession } from './login'
import { registerNeo3DapiHandlers } from './neo3-dapi'
import { registerPopupHandlers } from './popup'
import { registerTabHandlers } from './tab'
import { registerWalletConnectHandlers } from './wallet-connect'

async function init() {
  registerLoginHandlers()
  registerTabHandlers()
  registerWalletConnectHandlers()
  registerPopupHandlers()
  registerNeo3DapiHandlers()
  await restoreSession()
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background initialized')
})

init()
