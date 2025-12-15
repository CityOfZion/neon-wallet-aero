import { useTranslation } from 'react-i18next'

export const NftListEmpty = () => {
  const { t } = useTranslation('components', { keyPrefix: 'nftList' })

  return (
    <div className="mt-10 flex justify-center">
      <p className="text-gray-300">{t('empty')}</p>
    </div>
  )
}
