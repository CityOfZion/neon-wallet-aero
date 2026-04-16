import type { SessionTypes } from '@walletconnect/types'
import { useTranslation } from 'react-i18next'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'

import { useLanguageSelector } from '@renderer/hooks/useSettingsSelector'

import TbPlugX from '@renderer/assets/images/tb-plug-x.svg?react'

import { IconButton } from '../IconButton'
import { ImageWithFallback } from '../ImageWithFallback'
import { Tooltip } from '../Tooltip'

type TProps = {
  session: SessionTypes.Struct
  onDisconnect?: () => void
}

export const DappConnectionItem = ({ session, onDisconnect }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'dappConnectionList' })
  const { language } = useLanguageSelector()

  return (
    <li className="flex items-center gap-2 p-2.5 py-1.5 text-xs font-medium odd:bg-gray-300/15">
      <ImageWithFallback
        src={session.peer.metadata.icons[0]}
        alt={session.peer.metadata.name}
        fallbackSrc={`${ConstantsHelper.neonIconsUrl}/dapps/default-dapp.png`}
        className="min-size-5 size-5 rounded-full bg-gray-300/15"
      />

      <p className="min-w-30 text-white">{session.peer.metadata.name}</p>

      <p className="min-w-30 text-gray-100">{DateHelper.formatLocalized(session.expiry, { format: 'Pp', language })}</p>

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
