import CoZLogo from '@renderer/assets/images/coz-logo.svg?react'
import NeonWalletFull from '@renderer/assets/images/neon-wallet-full.svg?react'
import NeonWalletIcon from '@renderer/assets/images/neon-wallet-icon.svg?react'

export const SplashScreen = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 p-11">
      <NeonWalletFull className="h-auto w-82.5" aria-hidden />

      <div className="absolute bottom-11 flex flex-col items-center justify-end gap-2">
        {/* It needs to be hardcoded because it is used before i18n is initialized */}
        <p className="text-xs text-gray-300">Developed by</p>
        <CoZLogo className="h-6.5 w-22.5" aria-hidden />
      </div>

      <NeonWalletIcon className="text-asphalt/30 absolute -top-21 -right-33 h-60 w-68.5" aria-hidden />

      <NeonWalletIcon className="absolute -bottom-20.5 -left-25.5 h-61.5 w-68.5 text-gray-800/20" aria-hidden />
    </div>
  )
}
