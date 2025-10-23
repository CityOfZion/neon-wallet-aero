import { useTranslation } from 'react-i18next'

import { Button } from '../Button'

type TProps = {
  onDisconnectAll: () => void
}

export const DappConnectionHeader = ({ onDisconnectAll }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'dappConnectionList' })

  return (
    <div className="mt-6 mb-5 flex items-center px-2.5 text-xs font-bold text-gray-100 uppercase">
      <p className="ml-7 min-w-30 uppercase">{t('nameHeaderLabel')}</p>

      <p className="ml-2 min-w-30 uppercase">{t('expiresInHeaderLabel')}</p>

      <div className="flex w-full items-center justify-end">
        <Button
          label={t('disconnectionAllButtonLabel')}
          variant="text-slim"
          colorSchema="error"
          flat
          onClick={onDisconnectAll}
        />
      </div>
    </div>
  )
}
