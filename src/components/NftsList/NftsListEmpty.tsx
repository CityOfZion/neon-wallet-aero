import { useTranslation } from 'react-i18next'

export const NftsListEmpty = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets.nftsList' })

  return (
    <div className="mt-12 flex justify-center">
      <p className="text-gray-300">{t('empty')}</p>
    </div>
  )
}
