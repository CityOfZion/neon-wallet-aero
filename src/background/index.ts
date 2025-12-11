import { registerHardwareWalletHandlers } from './hardware-wallet'
import { registerLoginHandlers } from './login'
import { registerTabHandlers } from './tab'
import { registerWalletConnectHandlers } from './wallet-connect'

registerLoginHandlers()
registerTabHandlers()
registerWalletConnectHandlers()
registerHardwareWalletHandlers()

chrome.runtime.onInstalled.addListener(() => {
  console.log('Background initialized')
})
