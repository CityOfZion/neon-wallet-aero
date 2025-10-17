import { useTranslation } from 'react-i18next'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbTransform from '@renderer/assets/images/tb-transform.svg?react'

export const SwapInfoModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapInfo' })
  return (
    <BottomModalLayout heading={t('title')}>
      <div className="mb-3 flex flex-grow flex-col items-center justify-between px-4">
        <div className="flex flex-col gap-4 text-sm text-white">
          <div className="flex w-full justify-center pb-8">
            <TbTransform aria-hidden className="text-blue h-20 w-20" />
          </div>

          <p className="font-bold">{t('description1')}</p>

          <p>{t('description2')}</p>
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default SwapInfoModal
