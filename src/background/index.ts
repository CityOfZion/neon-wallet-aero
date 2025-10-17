import { registerLoginHandlers } from './login'
import { registerTabHandlers } from './tab'
import { registerWalletConnectHandlers } from './wallet-connect'

registerLoginHandlers()
registerTabHandlers()
registerWalletConnectHandlers()

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background initialized')
})
