import { BSUtilsHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { BuyAndSellTokensHelper } from '@renderer/helpers/BuyAndSellTokensHelper'

import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import type { TBuyAndSellTokensHelperType } from '@shared/types/helpers'
import type { TAccount } from '@shared/types/store'

type TProps = {
  type: TBuyAndSellTokensHelperType
  id: string
  hasError: boolean
  account?: TAccount
  onLoad: () => void
  onError: () => void
}

export const BuyAndSellTokensIframe = ({ type, id, hasError, account, onLoad, onError }: TProps) => {
  const isBuy = type === 'buy'

  const { t } = useTranslation('pages', { keyPrefix: `buyAndSellTokens.${isBuy ? 'buyContent' : 'sellContent'}` })

  const { currency } = useCurrencySelector()

  const url = BuyAndSellTokensHelper.buildUrl({
    type,
    currency,
    merchantTransactionId: id,
    ...(isBuy ? { address: account?.address } : { refundAddress: account?.address }),
  })

  const handleLoad = async () => {
    await BSUtilsHelper.wait(4000)

    onLoad()
  }

  return (
    <div className="buy-and-sell-tokens-iframe-container mx-auto my-4">
      {hasError ? (
        <p className="flex size-full items-center justify-center p-4 text-center text-2xl text-white">
          {t('iframeError')}
        </p>
      ) : (
        <iframe
          key={id}
          src={url}
          allow="clipboard-read; clipboard-write; payment; camera"
          onLoad={handleLoad}
          onError={onError}
        />
      )}
    </div>
  )
}
