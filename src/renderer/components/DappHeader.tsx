import type { ComponentProps } from 'react'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import NeonWalletLogo from '@renderer/assets/images/neon-wallet-full.svg?react'
import WalletConnectLogo from '@renderer/assets/images/wallet-connect.svg?react'

import { ImageWithFallback } from './ImageWithFallback'

type TProps = {
  proposerUri: string
  proposerName: string
} & ComponentProps<'div'>

export const DappHeader = ({ proposerUri, proposerName, className, ...props }: TProps) => {
  return (
    <div className={StyleHelper.mergeStyles('flex flex-col items-center gap-6', className)} {...props}>
      <div className="flex w-full items-center gap-x-12">
        <NeonWalletLogo aria-hidden className="h-min w-full" />
        <WalletConnectLogo aria-hidden className="h-min w-full text-white opacity-60" />
      </div>

      <div className="bg-asphalt/50 flex size-14 items-center justify-center overflow-hidden rounded-full p-2">
        <ImageWithFallback
          src={proposerUri}
          alt={proposerName}
          fallbackSrc={`${ConstantsHelper.neonIconsUrl}/dapps/default-dapp.png`}
          className="size-full rounded-full object-contain"
          containerClassName="size-full"
        />
      </div>
    </div>
  )
}
