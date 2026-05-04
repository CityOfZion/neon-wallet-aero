import { useTranslation } from 'react-i18next'

import { Banner } from '@renderer/components/Banner'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbChartBar from '@renderer/assets/images/tb-chart-bar.svg?react'

export const Neo3VoteInfoModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'neo3VoteInfo' })

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="mb-3 flex grow flex-col justify-between gap-y-4 px-4 text-sm text-white">
        <div className="flex w-full justify-center pb-2">
          <TbChartBar aria-hidden className="text-blue size-20 stroke-1" />
        </div>

        <p className="font-bold">{t('description')}</p>

        <div className="mt-2">
          <p className="font-bold">{t('whyVoteLabel')}</p>
          <p>{t('whyVoteResponseLabel')}</p>
        </div>

        <div className="mt-2 text-gray-100">
          <p className="font-bold">{t('noteLabel')}</p>
          <p>{t('noteResponseLabel')}</p>
        </div>

        <Banner message={t('alertDescription')} type="error" textClassName="my-4 text-sm" />
      </div>
    </BottomModalLayout>
  )
}

export default Neo3VoteInfoModal
