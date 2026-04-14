import { useTranslation } from 'react-i18next'

import { BlockchainIcon } from '@renderer/components/BlockchainIcon'
import { IconButton } from '@renderer/components/IconButton'
import { Loader } from '@renderer/components/Loader'
import { Tooltip } from '@renderer/components/Tooltip'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useBalance } from '@renderer/hooks/useBalances'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'

import type { TAccount } from '@shared/types/store'

type TProps = {
  account: TAccount
}

export const BuyAndSellTokensAccordionAccountItem = ({ account }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.accordionAccountItem' })
  const { currency } = useCurrencySelector()
  const { data, isLoading } = useBalance(account)

  const total = CurrencyHelper.format(data?.exchangeTotal || 0, { currency })

  return (
    <section className="flex items-center gap-x-3 px-4 py-3">
      <BlockchainIcon
        className="min-size-4 max-size-4 mt-1 size-4 self-start"
        blockchain={account.blockchain}
        type="gray"
      />

      <div className="flex flex-grow flex-col gap-y-0.5">
        <h5 className="max-w-42 truncate text-xs font-medium text-white">{account.name}</h5>

        <div className="flex items-center gap-x-1 whitespace-nowrap">
          <p className="text-xs text-gray-300">{StringHelper.truncateMiddle(account.address, 16)}</p>

          <Tooltip title={t('copyAddressButtonLabel')} delayDuration={0}>
            <IconButton
              aria-label={t('copyAddressButtonLabel')}
              size="xs"
              icon={<MdContentCopy aria-hidden className="text-neon" />}
              onClick={ClipboardHelper.write.bind(null, account.address)}
            />
          </Tooltip>
        </div>
      </div>

      {isLoading ? (
        <Loader className="size-4 text-white" containerClassName="w-fit" />
      ) : (
        <Tooltip title={total} delayDuration={0}>
          <p className="truncate text-xs whitespace-nowrap text-white">{total}</p>
        </Tooltip>
      )}
    </section>
  )
}
