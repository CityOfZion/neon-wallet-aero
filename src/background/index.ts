import { registerHardwareWalletHandlers } from './hardware-wallet'
import { registerLoginHandlers } from './login'
import { registerPopupHandlers } from './popup'
import { registerTabHandlers } from './tab'
import { registerWalletConnectHandlers } from './wallet-connect'

registerLoginHandlers()
registerTabHandlers()
registerWalletConnectHandlers()
registerHardwareWalletHandlers()
registerPopupHandlers()

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background initialized')
})
