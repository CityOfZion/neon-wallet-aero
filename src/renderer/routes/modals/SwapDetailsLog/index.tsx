import { Fragment } from 'react'

import { SimpleSwapService } from '@cityofzion/bs-multichain'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { IconButton } from '@renderer/components/IconButton'
import { Loader } from '@renderer/components/Loader'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

import type { TModalState } from '@shared/types/modal'

const swapService = new SimpleSwapService()

export const SwapDetailsLogModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsLog' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })

  const {
    swapRecord: { swapId, ...swapRecord },
  } = useModalState<TModalState<'swap-details-log'>>()

  const { isLoading, data: log } = useQuery({
    queryKey: ['swap-details-log', swapId, swapRecord.txFrom, swapRecord.txTo],
    queryFn: async () => {
      let finalLog = swapRecord.log

      if (!finalLog && swapId) {
        const response = await swapService.getStatus(swapId)
        if (response.log) finalLog = response.log
      }

      return JSON.stringify(JSON.parse(finalLog ?? ''), null, 4)
    },
  })

  const handleCopyLogToClipboard = () => {
    if (!log) return
    UtilsHelper.copyToClipboard(log)
  }

  return (
    <BottomModalLayout heading={t('title')} contentClassName="flex flex-col pt-6">
      {match({ isLoading, log })
        .with({ isLoading: true }, () => <Loader className="size-8" />)
        .with({ log: P.when(value => !!value && typeof value === 'string') }, () => (
          <Fragment>
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-300">{t('copySwapLogLabel')}</p>

              <IconButton
                aria-label={tCommon('copy')}
                size="sm"
                icon={<MdContentCopy aria-hidden className="text-neon" />}
                onClick={handleCopyLogToClipboard}
              />
            </div>

            <div className="mt-4 w-full flex-grow overflow-y-auto rounded bg-gray-900/75 p-4 break-words whitespace-pre-wrap">
              <p className="text-sm text-white">{log}</p>
            </div>
          </Fragment>
        ))
        .otherwise(() => (
          <p className="w-full text-center text-lg font-medium text-gray-300">{t('thereIsNoLogLabel')}</p>
        ))}
    </BottomModalLayout>
  )
}

export default SwapDetailsLogModal
