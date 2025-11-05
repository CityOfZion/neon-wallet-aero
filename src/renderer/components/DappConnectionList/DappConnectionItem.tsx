import type { SessionTypes } from '@walletconnect/types'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'

import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

import { NEON_ICONS_URL } from '@shared/constants/urls'

import { IconButton } from '../IconButton'
import { ImageWithFallback } from '../ImageWithFallback'
import { Tooltip } from '../Tooltip'

type TProps = {
  session: SessionTypes.Struct
  onDisconnect?: () => void
}

export const DappConnectionItem = ({ session, onDisconnect }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'dappConnectionList' })

  return (
    <li className="flex items-center gap-2 p-2.5 py-1.5 text-xs font-medium odd:bg-gray-300/15">
      <ImageWithFallback
        src={session.peer.metadata.icons[0]}
        alt={session.peer.metadata.name}
        fallbackSrc={`${NEON_ICONS_URL}/dapps/default-dapp.png`}
        className="h-5 min-h-5 w-5 min-w-5 rounded-full bg-gray-300/15"
      />

      <p className="min-w-30 text-white">{session.peer.metadata.name}</p>

      <p className="min-w-30 text-gray-100">{format(session.expiry * 1000, t('dappDateFormat'))}</p>

      <div className="flex w-full items-center justify-end">
        <Tooltip title={t('disconnectButtonLabel')}>
          <IconButton
            size="sm"
            aria-label={t('disconnectButtonLabel')}
            colorSchema="error"
            icon={<TbPlugX aria-hidden />}
            onClick={onDisconnect}
          />
        </Tooltip>
      </div>
    </li>
  )
}
