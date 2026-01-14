import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import type { WalletConnectError } from '@renderer/helpers/ErrorHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

type TProps = {
  error: WalletConnectError
}

export const DappPermissionErrorContent = ({ error }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission.errorContent' })
  const { modalEraseWrapper } = useModalNavigate()

  return (
    <div className="flex w-full grow flex-col">
      <p className="mt-2 text-center text-xs text-gray-300">{t('description')}</p>

      <div className="my-8 flex min-h-0 w-full grow flex-col gap-1.5 text-sm">
        <p className="font-bold text-gray-300 uppercase">{t('errorMessageLabel')}</p>

        <p className="bg-asphalt max-h-64 w-full overflow-y-auto rounded p-2 font-medium break-words whitespace-pre-wrap text-white">
          {error.message}
        </p>
      </div>

      <Button label={t('doneButtonLabel')} className="mt-auto w-full" onClick={modalEraseWrapper('bottom')} />
    </div>
  )
}
