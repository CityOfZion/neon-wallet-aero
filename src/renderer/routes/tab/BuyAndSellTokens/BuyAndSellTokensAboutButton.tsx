import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'

type TProps = {
  className?: string
}

export const BuyAndSellTokensAboutButton = ({ className }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens' })
  const { modalNavigateWrapper } = useModalNavigate()

  return (
    <Button
      label={t('aboutButtonLabel')}
      colorSchema="neon"
      variant="text-slim"
      className={StyleHelper.mergeStyles('w-fit', className)}
      clickableProps={{ className: 'text-xs' }}
      onClick={modalNavigateWrapper('buy-and-sell-tokens-about')}
    />
  )
}
