import CoZLogo from '@/assets/images/coz-logo.svg?react'
import NeonWalletFull from '@/assets/images/neon-wallet-full.svg?react'
import NeonWalletIcon from '@/assets/images/neon-wallet-icon.svg?react'

export function SplashScreen() {
  return (
    <div className="flex h-full flex-col items-center justify-between bg-gradient-to-b from-gray-800 to-gray-900 p-11">
      <div className="flex h-full flex-col items-center justify-center">
        <NeonWalletFull className="h-15.5 w-82.5 flex-grow" aria-hidden />
        <div className="flex flex-col gap-2">
          <span className="text-xs text-gray-300">Developed by</span>
          <CoZLogo className="h-6.5 w-22.5" aria-hidden />
        </div>
      </div>
      <NeonWalletIcon className="text-asphalt/30 absolute -top-21 -right-33 h-60 w-68.5" aria-hidden={true} />
      <NeonWalletIcon className="absolute -bottom-20.5 -left-25.5 h-61.5 w-68.5 text-gray-800/20" aria-hidden={true} />
    </div>
  )
}
