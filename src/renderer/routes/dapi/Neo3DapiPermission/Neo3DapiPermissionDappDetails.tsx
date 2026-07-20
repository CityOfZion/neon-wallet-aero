import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import { Details } from '@renderer/components/Details'
import { ImageWithFallback } from '@renderer/components/ImageWithFallback'

import TbPlug from '@renderer/assets/images/tb-plug.svg?react'

import { ConstantsURLHelper } from '@shared/helpers/ConstantsURLHelper'
import type { TDapiRequest } from '@shared/types/dapi'

type TProps = {
  request: TDapiRequest
} & ComponentProps<typeof Details.Root>

export const Neo3DapiPermissionDappDetails = ({ request, ...props }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'dapiPermission.dappDetails' })

  return (
    <Details.Root {...props}>
      <Details.Header
        leftElement={<TbPlug aria-hidden />}
        rightElement={
          <div className="flex items-center gap-2">
            <div className="min-size-6 mx-auto flex size-6 items-center justify-center overflow-hidden rounded-full bg-gray-700/60 p-1">
              <ImageWithFallback
                src={request.icon || ''}
                alt={request.name || ''}
                fallbackSrc={`${ConstantsURLHelper.neonIconsUrl}/dapps/default-dapp.png`}
                className="size-full rounded-full object-contain"
                containerClassName="size-full"
              />
            </div>
            <span className="text-sm font-bold text-white capitalize">{request.name}</span>
          </div>
        }
      >
        <span className="text-sm text-white">{t('dappLabel')}</span>
      </Details.Header>
    </Details.Root>
  )
}
