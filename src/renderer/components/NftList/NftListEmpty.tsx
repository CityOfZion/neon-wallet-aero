import { useTranslation } from 'react-i18next'

export const NftListEmpty = () => {
  const { t } = useTranslation('components', { keyPrefix: 'nftList' })

  return (
    <div className="flex justify-center">
      <p className="text-center text-gray-300">{t('empty')}</p>
    </div>
  )
}
