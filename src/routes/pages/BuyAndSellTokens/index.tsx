import { useTranslation } from 'react-i18next'

import { ScreenLayout } from '@/layouts/ScreenLayout'

// TODO: implement this feature in another issue
export const BuyAndSellTokens = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens' })

  return <ScreenLayout heading={t('title')} hasBack={false} />
}
