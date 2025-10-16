import { useTranslation } from 'react-i18next'

import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'

export const TransactionActivityListEmpty = () => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionActivityList.empty' })

  return (
    <section className="mt-2 mb-8 flex flex-col items-center text-center">
      <TbAlertTriangle aria-hidden className="text-blue mb-2 h-16 w-16" />
      <h3 className="text-lg text-white">{t('notFoundTitle')}</h3>
      <p className="text-gray-300">{t('notFoundDescription')}</p>
    </section>
  )
}
