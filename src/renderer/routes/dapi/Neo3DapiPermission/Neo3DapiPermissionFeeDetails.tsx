import { BSNeo3Constants } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'

import { Details } from '@renderer/components/Details'
import { Loader } from '@renderer/components/Loader'

import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'

type TProps = {
  fee?: string | number
  isLoading: boolean
}

export const Neo3DapiPermissionFeeDetails = ({ isLoading, fee }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { t: tCommon } = useTranslation('common')

  return (
    <Details.Root className="mt-3">
      <Details.Header
        leftElement={<TbReceipt aria-hidden className="text-blue" />}
        rightElement={
          <div>
            {isLoading ? (
              <Loader />
            ) : (
              <p className="text-sm font-semibold text-gray-100">
                {fee || tCommon('general.emptyColumn')} {BSNeo3Constants.GAS_TOKEN.symbol}
              </p>
            )}
          </div>
        }
      >
        <p className="text-sm text-white">{t('feeLabel')}</p>
      </Details.Header>
    </Details.Root>
  )
}
