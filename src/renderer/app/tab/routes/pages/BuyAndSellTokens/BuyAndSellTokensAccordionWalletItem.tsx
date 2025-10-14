import { Accordion } from '@renderer/components/Accordion'
import { Loader } from '@renderer/components/Loader'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { useBalances } from '@renderer/hooks/useBalances'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'
import { IWalletState } from '@shared/types/store'

import { BuyAndSellTokensAccordionAccountItem } from './BuyAndSellTokensAccordionAccountItem'

import Wallet from '@renderer/assets/images/wallet.svg?react'

type TProps = {
  wallet: IWalletState
}

export const BuyAndSellTokensAccordionWalletItem = ({ wallet }: TProps) => {
  const balances = useBalances(wallet.accounts)
  const { currency } = useCurrencySelector()

  const total = NumberHelper.currency(balances.exchangeTotal, currency)

  return (
    <Accordion.Item value={wallet.id} className="w-full">
      <Accordion.Trigger
        className="flex items-center justify-between gap-x-2 rounded border-none bg-gray-300/20"
        iconClassName="text-white"
      >
        <Wallet aria-hidden={true} className="text-blue h-7 max-h-7 min-h-7 w-7 max-w-7 min-w-7" />

        <h4 className="flex-grow text-left text-xs font-semibold text-white">{wallet.name}</h4>

        {balances.isLoading ? (
          <Loader className="size-4 text-gray-300" containerClassName="w-fit" />
        ) : (
          <div className="flex w-full max-w-25 items-center justify-end">
            <Tooltip
              title={total}
              contentProps={{ className: 'bg-asphalt' }}
              arrowProps={{ className: 'fill-asphalt' }}
              delayDuration={0}
            >
              <span className="block w-fit truncate text-xs text-gray-300 uppercase">{total}</span>
            </Tooltip>
          </div>
        )}
      </Accordion.Trigger>

      <Accordion.Content asChild className="p-0">
        <ul className="flex flex-col">
          {wallet.accounts.map((account, index) => (
            <li key={`accordion-account-${account.id}`} className="w-full">
              <BuyAndSellTokensAccordionAccountItem account={account} />

              {wallet.accounts.length !== index + 1 && <Separator />}
            </li>
          ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  )
}
