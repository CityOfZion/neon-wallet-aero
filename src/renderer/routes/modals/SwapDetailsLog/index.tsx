import { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { IconButton } from '@renderer/components/IconButton'
import { Loader } from '@renderer/components/Loader'
import { Tooltip } from '@renderer/components/Tooltip'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'

import { useModalState } from '@renderer/hooks/useModalRouter'
import { useSwapOrder } from '@renderer/hooks/useSwapOrder'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

import type { TModalState } from '@shared/types/modal'

export const SwapDetailsLogModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetailsLog' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { orderId } = useModalState<TModalState<'swap-details-log'>>()

  const swapOrderQuery = useSwapOrder(orderId)

  return (
    <BottomModalLayout heading={t('title')} contentClassName="flex flex-col pt-6">
      {match(swapOrderQuery)
        .with({ isLoading: true }, () => <Loader className="size-8" />)
        .with({ data: P.select({ log: P.string }) }, ({ log }) => (
          <Fragment>
            <div className="flex w-full items-center justify-between gap-2">
              <p className="text-sm font-medium text-gray-300">{t('copySwapLogLabel')}</p>

              <Tooltip title={tCommon('copy')}>
                <IconButton
                  aria-label={tCommon('copy')}
                  size="sm"
                  icon={<MdContentCopy aria-hidden className="text-neon" />}
                  onClick={ClipboardHelper.write.bind(null, log)}
                />
              </Tooltip>
            </div>

            <div className="mt-4 w-full grow overflow-y-auto rounded bg-gray-900/75 p-4 wrap-break-word whitespace-pre-wrap">
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
