import { useTranslation } from 'react-i18next'
import { IconButton } from '@renderer/components/IconButton'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useModalState } from '@renderer/hooks/useModalRouter'
import { SideModalLayout } from '@renderer/layouts/SideModalLayout'
import { TModalState } from '@shared/types/modal'

import MdContentCopy from '@renderer/assets/images/md-content-copy.svg?react'
import PiSealCheck from '@renderer/assets/images/pi-seal-check.svg?react'
import TbReceipt from '@renderer/assets/images/tb-receipt.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'

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

        <div className="bg-asphalt mt-8 flex w-full flex-col rounded p-3 pb-5">
          <div className="flex items-center gap-2.5 text-sm text-white">
            <TbReceipt aria-hidden className="text-blue size-6" />

            <p className="font-medium">{t('details')}</p>
          </div>

          <Separator className="mt-3" />

          <div className="mt-4 flex flex-col gap-3.5">
            <p className="text-blue bg-gray-300/15 px-3.5 py-1.5 text-xs">{t('transactionLabel')}</p>

            <div className="flex flex-col gap-2 px-3">
              <p className="text-xs text-gray-100 uppercase">{t('recipientLabel')}</p>

              <div className="flex items-center gap-2">
                <p className="flex-grow text-sm font-medium break-all text-white">{name ? `${name} (${to})` : to}</p>

                <Tooltip title={t('copyAddressLabel')} delayDuration={0}>
                  <IconButton
                    aria-label={t('copyAddressLabel')}
                    size="sm"
                    icon={<MdContentCopy aria-hidden className="text-neon" />}
                    onClick={UtilsHelper.copyToClipboard.bind(null, to!)}
                  />
                </Tooltip>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 px-3 uppercase">
              <p className="text-xs text-gray-100">{t('amountLabel')}</p>

              <p className="font-medium break-all text-white">
                {transaction.amount} <span className="font-normal text-gray-100">{transaction.asset}</span>
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-y-2 px-3">
              <p className="text-xs text-gray-100 uppercase">{t('transactionHashLabel')}</p>

              <div className="flex items-center gap-x-2">
                <p className="flex-grow font-medium break-all text-white">{hash}</p>

                <Tooltip title={t('copyTransactionHashLabel')} delayDuration={0}>
                  <IconButton
                    aria-label={t('copyTransactionHashLabel')}
                    size="sm"
                    icon={<MdContentCopy aria-hidden className="text-neon" />}
                    onClick={UtilsHelper.copyToClipboard.bind(null, hash)}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideModalLayout>
  )
}
