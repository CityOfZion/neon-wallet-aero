import { backgroundApi } from '@shared/message-api/background'
import type { THardwareWalletHelperConnectionType } from '@shared/types/helpers'

let type: THardwareWalletHelperConnectionType | undefined

export function registerHardwareWalletHandlers() {
  backgroundApi.listen('hardware-wallet:save-type', ({ args }) => {
    type = args
  })

  backgroundApi.listen('hardware-wallet:get-type', () => {
    return type
  })
}
