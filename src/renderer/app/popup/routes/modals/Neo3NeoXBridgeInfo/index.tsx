import { useTranslation } from 'react-i18next'
import { Banner } from '@renderer/components/Banner'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'

export const Neo3NeoXBridgeInfoModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3NeoXBridgeInfo' })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="my-3 flex flex-grow flex-col items-center justify-between px-4">
        <TbReplace2 aria-hidden className="text-blue h-21 w-21" />

        <div className="flex flex-col gap-4 text-sm text-white">
          <p className="font-bold">{t('description1')}</p>
          <p>{t('description2')}</p>
          <p>{t('description3')}</p>

          <Banner type="warningOrange" message={t('alert')} className="mt-4" textClassName="text-sm py-4 px-8" />
        </div>
      </div>
    </BottomModalLayout>
  )
}

export default Neo3NeoXBridgeInfoModal
