import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Loader } from '@renderer/components/Loader'

import { useModalState } from '@renderer/hooks/useModalRouter'
import { useSwapOrder } from '@renderer/hooks/useSwapOrder'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'

import { SwapDetailsModalContent } from './SwapDetailsModalContent'

export const SwapDetailsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapDetails' })
  const { orderId } = useModalState<TModalState<'swap-details'>>()

  const swapOrderQuery = useSwapOrder(orderId)

  return (
    <BottomModalLayout heading={t('title')}>
      {match(swapOrderQuery)
        .with({ isLoading: true }, () => <Loader className="size-8" />)
        .with({ data: P.nonNullable }, ({ data }) => <SwapDetailsModalContent orderId={orderId} swapResult={data} />)
        .otherwise(() => (
          <p className="w-full text-center text-lg font-medium text-gray-300">{t('notFound')}</p>
        ))}
    </BottomModalLayout>
  )
}

export default SwapDetailsModal
