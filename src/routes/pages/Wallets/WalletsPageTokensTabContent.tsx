import { useTranslation } from 'react-i18next'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useVirtualizer } from '@tanstack/react-virtual'

import { BlockchainIcon } from '@/components/BlockchainIcon'
import { Separator } from '@/components/Separator'
import { NumberHelper } from '@/helpers/NumberHelper'
import { useBalance } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { IAccountState } from '@/types/store'

type TProps = {
  selectedAccount: IAccountState
}

export const WalletsPageTokensTabContent = ({ selectedAccount }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'wallets.tokenTab' })
  const { t: commonT } = useTranslation('common')
  const { currency } = useCurrencySelector()
  const balanceQuery = useBalance(selectedAccount)

  const tokenBalances = balanceQuery.data?.tokensBalances ?? []

  const rowVirtualizer = useVirtualizer({
    count: tokenBalances.length,
    estimateSize: () => 62,
    getScrollElement: () => document.querySelector('#popup-root'),
    overscan: 10,
  })

  return (
    <ul
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem, _, array) => {
        const row = tokenBalances[virtualItem.index]

        return (
          <li
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <div className="flex gap-5 px-2 py-3">
              <div className="flex min-w-0 flex-1 gap-2.5">
                {/* TODO: Replace by token icon  */}
                <BlockchainIcon
                  blockchain={row.blockchain}
                  className="text-green mt-1 h-3.5 min-h-3.5 w-3.5 min-w-3.5"
                />

                <div className="flex min-w-0 flex-col gap-0.5">
                  <p className="min-w-0 truncate text-sm leading-5 text-white uppercase">{row.token.symbol}</p>

                  <p className="truncate text-xs leading-4 text-gray-100 uppercase">
                    {commonT(`blockchain.${row.blockchain}`)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <p className="text-1xs leading-5 text-gray-300">{t('holdingsLabel')}</p>

                <p className="text-1xs leading-4 text-gray-300">{t('valueLabel')}</p>
              </div>

              <div className="flex w-20 flex-col gap-0.5">
                <p className="truncate text-right text-sm leading-5 text-white">
                  {BSBigNumberHelper.format(row.amountNumber, { decimals: row.token.decimals })}
                </p>

                <p className="text-neon truncate text-right text-xs leading-4">
                  {NumberHelper.currency(row.exchangeAmount, currency)}
                </p>
              </div>
            </div>

            {virtualItem.index + 1 !== array.length && <Separator />}
          </li>
        )
      })}
    </ul>
  )
}
