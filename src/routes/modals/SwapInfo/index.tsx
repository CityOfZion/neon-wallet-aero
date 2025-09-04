import { useTranslation } from 'react-i18next'

import { BottomModalLayout } from '@/layouts/BottomModalLayout'

export const SwapInfoModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapInfoModal' })
  return (
    <BottomModalLayout heading={t('title')}>
      <div className="my-3 flex flex-grow flex-col items-center justify-between px-4">
        <div className="flex flex-col gap-4 text-sm text-white">
          <p className="font-bold">{t('description1')}</p>

          <p>{t('description2')}</p>
        </div>
      </div>
    </BottomModalLayout>
  )
}
