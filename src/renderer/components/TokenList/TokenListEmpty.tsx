import { useTranslation } from 'react-i18next'

export const TokenListEmpty = () => {
  const { t } = useTranslation('components', { keyPrefix: 'tokenList' })

  return (
    <div className="mt-8 flex justify-center">
      <p className="text-gray-300">{t('empty')}</p>
    </div>
  )
}
