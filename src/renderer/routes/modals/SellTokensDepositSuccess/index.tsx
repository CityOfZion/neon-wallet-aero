import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { Details } from '@renderer/components/Details'
import { Separator } from '@renderer/components/Separator'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import PiSealCheck from '@renderer/assets/images/pi-seal-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'

import type {
  TUseTransactionsTransactionEvent,
  TUseTransactionsTransactionEventToken,
  TUseTransactionsTransactionInputOutput,
} from '@shared/types/hooks'
import type { TModalState } from '@shared/types/modal'

export const SellTokensDepositSuccessModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccess' })
  const { transaction } = useModalState<TModalState<'sell-tokens-deposit-success'>>()

  const isUtxo = transaction.view === 'utxo'
  const item = isUtxo ? transaction.outputs.at(-1)! : transaction.events.at(-1)!

  const { address, account } = match(isUtxo)
    .with(true, () => {
      const { address, account } = item as TUseTransactionsTransactionInputOutput

      return { address, account }
    })
    .otherwise(() => {
      const { to, toAccount } = item as TUseTransactionsTransactionEvent

      return { address: to, account: toAccount }
    })

  const token = match({ isUtxo, item })
    .with({ isUtxo: true }, () => {
      return (item as TUseTransactionsTransactionInputOutput).token
    })
    .with(
      { item: P.when(value => (value as TUseTransactionsTransactionEvent).eventType === 'token') },
      () => (item as TUseTransactionsTransactionEventToken).token
    )
    .otherwise(() => undefined)

  return (
    <SideModalLayout heading={t('title')} icon={<TbStepInto aria-hidden />}>
      <div className="flex min-h-0 grow flex-col items-center">
        <Separator className="bg-gray-300/30" />

        <div className="bg-asphalt mt-8 flex size-28 items-center rounded-full p-2">
          <PiSealCheck aria-hidden className="text-blue size-24" />
        </div>

        <p className="my-6 text-center text-lg text-white">{t('subtitle')}</p>

        <Details.Root>
          <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('details')}</Details.Header>
          <Details.HeaderSeparator />

          <Details.Body>
            <Details.Panel label={t('transactionLabel')}>
              <Details.Item label={t('recipientLabel')} copyable={address}>
                {account?.name ? `${account.name} (${address})` : address}
              </Details.Item>

              <Details.Item label={t('amountLabel')}>
                {item.amount} {token && <span className="font-normal text-gray-100">{token.symbol}</span>}
              </Details.Item>

              <Details.Item label={t('transactionHashLabel')} copyable={transaction.txId}>
                {transaction.txId}
              </Details.Item>
            </Details.Panel>
          </Details.Body>
        </Details.Root>
      </div>
    </SideModalLayout>
  )
}

export default SellTokensDepositSuccessModal
