import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { ImageWithFallback } from '@renderer/components/ImageWithFallback'

import { NumberHelper } from '@renderer/helpers/NumberHelper'

import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { NEON_ICONS_URL } from '@shared/constants/urls'
import type { TTokenBalance } from '@shared/types/query'

type TProps = {
  tokenBalance: TTokenBalance
}

export const TokenListItem = ({ tokenBalance }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'tokenList' })
  const { t: commonT } = useTranslation('common')
  const { currency } = useCurrencySelector()

  return (
    <div className="flex gap-5 px-2 py-3">
      <div className="flex min-w-0 flex-1 gap-2.5">
        <ImageWithFallback
          src={`${NEON_ICONS_URL}/tokens/${tokenBalance.blockchain}/${tokenBalance.token.hash}.png`}
          alt={tokenBalance.token.name || tokenBalance.token.symbol}
          fallbackSrc={`${NEON_ICONS_URL}/tokens/default-token.png`}
          containerClassName="mt-1 size-4.5 min-size-4.5 max-size-4.5"
        />

        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="min-w-0 truncate text-sm leading-5 text-white uppercase">{tokenBalance.token.symbol}</p>

          <p className="truncate text-xs leading-4 text-gray-100 uppercase">
            {commonT(`blockchain.${tokenBalance.blockchain}`)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-1xs leading-5 text-gray-300">{t('holdingsLabel')}</p>

        <p className="text-1xs leading-4 text-gray-300">{t('valueLabel')}</p>
      </div>

      <div className="flex w-26 flex-col gap-0.5">
        <p className="truncate text-right text-sm leading-5 text-white">
          {BSBigNumberHelper.format(tokenBalance.amountNumber, { decimals: tokenBalance.token.decimals })}
        </p>

        <p className="text-neon truncate text-right text-xs leading-4">
          {NumberHelper.currency(tokenBalance.exchangeAmount, currency)}
        </p>
      </div>
    </div>
  )
}
