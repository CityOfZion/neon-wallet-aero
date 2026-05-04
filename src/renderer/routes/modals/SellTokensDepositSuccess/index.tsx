import type { TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { Details } from '@renderer/components/Details'
import { Separator } from '@renderer/components/Separator'

import { AccountHelper } from '@renderer/helpers/AccountHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useModalState } from '@renderer/hooks/useModalRouter'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import PiSealCheck from '@renderer/assets/images/pi-seal-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'

import type { TModalState } from '@shared/types/modal'
import type { TAccount } from '@shared/types/store'

export const SellTokensDepositSuccessModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccess' })
  const { transaction } = useModalState<TModalState<'sell-tokens-deposit-success'>>()
  const { accountsMapRef } = useAccountsMapSelector()

  let token: TBSToken | undefined
  let amount: string | undefined
  let receiverAddress: string | undefined
  let receiverAccount: TAccount | undefined

  if (transaction.view === 'utxo') {
    const output = transaction.outputs.at(-1)
    token = output?.token
    amount = output?.amount
    receiverAddress = output?.address
    receiverAccount = output?.address
      ? accountsMapRef.current.get(
          AccountHelper.buildAccountKey({ address: output.address, blockchain: transaction.blockchain })
        )
      : undefined
  } else {
    const event = transaction.events.at(-1)
    token = event?.eventType === 'token' ? event.token : undefined
    amount = event?.amount
    receiverAddress = event?.to
    receiverAccount = event?.to
      ? accountsMapRef.current.get(
          AccountHelper.buildAccountKey({ address: event.to, blockchain: transaction.blockchain })
        )
      : undefined
  }

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
              <Details.Item label={t('recipientLabel')} copyable={receiverAddress}>
                {receiverAccount?.name ? `${receiverAccount.name} (${receiverAccount.address})` : receiverAddress}
              </Details.Item>

              <Details.Item label={t('amountLabel')}>
                {amount} {token && <span className="font-normal text-gray-100">{token.symbol}</span>}
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
