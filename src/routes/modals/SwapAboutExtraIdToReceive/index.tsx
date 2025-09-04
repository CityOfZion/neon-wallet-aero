import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/Separator'
import { BottomModalLayout } from '@/layouts/BottomModalLayout'

export const SwapAboutExtraIdToReceiveModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'swapAboutExtraIdToReceiveModal' })

  return (
    <BottomModalLayout heading={t('title')} className="py-6">
      <div className="flex flex-col px-3.5">
        <h3 className="text-sm font-bold text-gray-100 uppercase">{t('what.title')}</h3>
        <p className="mt-3 text-sm text-white">{t('what.description')}</p>

        <Separator containerClassName="my-6" />

        <h3 className="text-sm font-bold text-gray-100 uppercase">{t('why.title')}</h3>
        <p className="mt-3 text-sm text-white">{t('why.description')}</p>

        <Separator containerClassName="my-6" />

        <h3 className="text-sm font-bold text-gray-100 uppercase">{t('where.title')}</h3>
        <p className="mt-3 text-sm text-white">{t('where.description')}</p>
      </div>
    </BottomModalLayout>
  )
}
