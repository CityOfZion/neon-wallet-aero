import { useTranslation } from 'react-i18next'
import { Location, useLocation } from 'react-router-dom'
import { IconButton } from '@renderer/components/IconButton'
import { Tooltip } from '@renderer/components/Tooltip'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { ScreenLayout } from '@renderer/layouts/ScreenLayout'
import { IAccountState } from '@shared/types/store'

import { SwapPageContent } from './SwapPageContent'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'

type TLocationState = {
  account?: IAccountState
}

export const SwapPage = () => {
  const { state } = useLocation() as Location<TLocationState>
  const { t } = useTranslation('pages', { keyPrefix: 'swap' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <ScreenLayout
      heading={t('title')}
      rightComponent={
        <Tooltip
          title={t('infoTooltip')}
          contentProps={{ className: 'bg-asphalt' }}
          arrowProps={{ className: 'fill-asphalt' }}
          delayDuration={0}
        >
          <IconButton
            onClick={modalNavigateWrapper('swap-info')}
            icon={<MdInfoOutline aria-hidden={true} className="text-neon h-6 w-6" />}
          />
        </Tooltip>
      }
    >
      <SwapPageContent account={state?.account} />
    </ScreenLayout>
  )
}
