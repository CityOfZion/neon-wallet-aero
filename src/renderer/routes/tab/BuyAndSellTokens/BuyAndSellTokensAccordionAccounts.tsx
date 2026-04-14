import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'

import { Accordion } from '@renderer/components/Accordion'

import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import type { TAccount } from '@shared/types/store'

import { BuyAndSellTokensAccordionWalletItem } from './BuyAndSellTokensAccordionWalletItem'

type TProps = {
  account?: TAccount
}

export const BuyAndSellTokensAccordionAccounts = ({ account }: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'buyAndSellTokens.accordionAccounts' })
  const { wallets: currentWallets } = useWalletsSelector()

  const wallets = account ? currentWallets.filter(({ id }) => id === account.idWallet) : currentWallets

  return (
    <motion.div
      id="buy-and-sell-tokens-accordion-accounts"
      className="absolute top-14 right-0 h-[calc(100%-3.5rem)] overflow-auto border-l border-gray-300/15 bg-gray-900 px-4 pt-6 pb-12 shadow-[-5px_0px_35px_0px_rgba(26,32,38,0.4)]"
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 364, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: 'spring', duration: 0.4 }}
    >
      <h3 className="mb-4 text-xs text-gray-300 uppercase">{t('title')}</h3>

      {wallets.length > 0 ? (
        <Accordion.Root className="flex flex-col gap-y-4" type="multiple" defaultValue={[wallets[0].id]}>
          {wallets.map(wallet => (
            <BuyAndSellTokensAccordionWalletItem key={`accordion-wallet-${wallet.id}`} wallet={wallet} />
          ))}
        </Accordion.Root>
      ) : (
        <p className="mx-auto mt-8 text-center text-xs text-gray-100">{t('noDataFoundLabel')}</p>
      )}
    </motion.div>
  )
}
