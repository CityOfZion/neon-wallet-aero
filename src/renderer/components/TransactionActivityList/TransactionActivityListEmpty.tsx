import { useTranslation } from 'react-i18next'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

export const TransactionActivityListEmpty = () => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.empty' })

  return (
    <section className="mt-6 mb-8 flex flex-col items-center text-center">
      <TbAlertTriangle aria-hidden className="text-blue mb-1 size-14" />
      <h3 className="text-sm text-white">{t('notFoundTitle')}</h3>
      <p className="text-xs text-gray-300">{t('notFoundDescription')}</p>
    </section>
  )
}
