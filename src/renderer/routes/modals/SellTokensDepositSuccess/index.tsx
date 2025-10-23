import { useTranslation } from 'react-i18next'

import { Details } from '@renderer/components/Details'
import { Separator } from '@renderer/components/Separator'

import { useModalState } from '@renderer/hooks/useModalRouter'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import PiSealCheck from '@renderer/assets/images/pi-seal-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'

import type { TModalState } from '@shared/types/modal'

export const SellTokensDepositSuccessModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDepositSuccess' })
  const { transaction } = useModalState<TModalState<'sell-tokens-deposit-success'>>()

  const { hash, to, toAccount } = transaction
  const name = toAccount?.name

  return (
    <SideModalLayout heading={t('title')} icon={<TbStepInto aria-hidden />}>
      <div className="flex min-h-0 flex-grow flex-col items-center">
        <Separator className="bg-gray-300/30" />

        <div className="bg-asphalt mt-8 flex size-28 items-center rounded-full p-2">
          <PiSealCheck aria-hidden className="text-blue size-24" />
        </div>

        <p className="mt-6 text-center text-lg text-white">{t('subtitle')}</p>

        <Details.Root>
          <Details.Header leftElement={<TbReceipt aria-hidden />}>{t('details')}</Details.Header>
          <Details.HeaderSeparator />
          <Details.Body>
            <Details.Panel label={t('transactionLabel')}>
              <Details.Item label={t('recipientLabel')} copyable={to}>
                {name ? `${name} (${to})` : to}
              </Details.Item>

              <Details.Item label={t('amountLabel')}>
                {transaction.amount} <span className="font-normal text-gray-100">{transaction.asset}</span>
              </Details.Item>

              <Details.Item label={t('transactionHashLabel')} copyable={hash}>
                {hash}
              </Details.Item>
            </Details.Panel>
          </Details.Body>
        </Details.Root>
      </div>
    </SideModalLayout>
  )
}

export default SellTokensDepositSuccessModal
