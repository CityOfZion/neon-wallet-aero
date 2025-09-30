import { ComponentProps, ReactNode } from 'react'
import dappFallbackIcon from '@renderer/assets/images/dapp-fallback-icon.png'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { ImageWithFallback } from './ImageWithFallback'

import NeonWalletLogo from '@renderer/assets/images/neon-wallet-full.svg?react'
import WalletConnectLogo from '@renderer/assets/images/wallet-connect.svg?react'

type TProps = {
  proposerUri: string
  proposerName: string
  description?: ReactNode
} & ComponentProps<'div'>

export const DappConnectionHeader = ({ proposerUri, proposerName, description, className, ...props }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex flex-col items-center gap-6', className)} {...props}>
      <div className="flex w-full items-center gap-x-12">
        <NeonWalletLogo aria-hidden className="h-min w-full" />
        <WalletConnectLogo aria-hidden className="h-min w-full text-white opacity-60" />
      </div>

      <div className="flex items-center justify-center rounded-full bg-gray-900/40 px-4 py-2">
        <ImageWithFallback
          src={proposerUri}
          alt={proposerName}
          fallbackSrc={dappFallbackIcon}
          className="h-full max-h-16 w-full max-w-16 rounded-sm object-contain"
        />
      </div>

      {description && <p className="text-center text-sm text-gray-100">{description}</p>}
    </div>
  )
}
