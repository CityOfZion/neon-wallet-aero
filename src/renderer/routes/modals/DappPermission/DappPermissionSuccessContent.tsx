import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

type TProps = {
  response?: any
}

export const DappPermissionSuccessContent = ({ response }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission.successContent' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { modalEraseWrapper } = useModalNavigate()

  const stringifiedResponse = typeof response === 'string' ? response : JSON.stringify(response, null, 2)

  return (
    <div className="mt-8 flex min-h-0 w-full grow flex-col">
      {response && (
        <div className="mb-4 flex min-h-0 w-full grow flex-col gap-1.5 text-sm">
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-300 uppercase">{t('resultBoxLabel')}</p>

            <IconButton
              aria-label={commonT('copyToClipboard')}
              size="xs"
              colorSchema="neon"
              icon={<MdContentCopy aria-hidden />}
              onClick={ClipboardHelper.write.bind(null, stringifiedResponse)}
            />
          </div>

          <p className="bg-asphalt max-h-64 w-full overflow-y-auto rounded p-2 font-medium break-words whitespace-pre-wrap text-white">
            {stringifiedResponse}
          </p>
        </div>
      )}

      <Button label={t('doneButtonLabel')} className="mt-auto w-full" onClick={modalEraseWrapper('bottom')} />
    </div>
  )
}
