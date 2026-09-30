import { useEffect } from 'react'

import { BSBigHumanAmount, type TBSToken } from '@cityofzion/blockchain-service'
import { motion, useIsPresent } from 'motion/react'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionStep } from '@renderer/components/ActionStep'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { GreyAmountInput } from '@renderer/components/GreyAmountInput'
import { GreyTokenSelect } from '@renderer/components/GreyTokenSelect'
import { IconButton } from '@renderer/components/IconButton'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { CurrencyHelper } from '@renderer/helpers/CurrencyHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useDebounceFunction } from '@renderer/hooks/useDebounceFunction'
import { useNameService } from '@renderer/hooks/useNameService'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'
import VscCircleFilled from '@renderer/assets/images/vsc-circle-filled.svg?react'

import type { TTokenBalance, TUseBalanceResult } from '@shared/types/query'
import type { TAccount } from '@shared/types/store'

export type TSendRecipient = {
  id: string
  token?: TTokenBalance
  amount?: string
  address?: string
  addressInput?: string
  isAmountLoading?: boolean
}

type TProps = {
  order: number
  selectedAccount?: TAccount
  recipient: TSendRecipient
  onUpdateRecipient: (recipient: Partial<TSendRecipient>) => void
  onRemoveRecipient: () => void
  removable?: boolean
  balance?: TUseBalanceResult
  isLoadingMaxAmount: boolean
  isDisabledMaxAmount: boolean
  onMaxAmount: (recipient: TSendRecipient) => void
}

export const SendRecipient = ({
  order,
  selectedAccount,
  recipient,
  onUpdateRecipient,
  onRemoveRecipient,
  removable = false,
  balance,
  isLoadingMaxAmount,
  isDisabledMaxAmount,
  onMaxAmount,
}: TProps) => {
  const { t } = useTranslation('pages', { keyPrefix: 'send.sendRecipient' })
  const { t: tCommon } = useTranslation('common')
  const { currency } = useCurrencySelector()
  const debounceAmount = useDebounceFunction()
  const isPresent = useIsPresent()

  const {
    isNameService,
    validatedAddress,
    isValidAddressOrDomainAddress,
    isValidatingAddressOrDomainAddress,
    validateAddressOrNS,
  } = useNameService()

  const isDisabled = !selectedAccount || isDisabledMaxAmount
  const isReceiverAddressDisabled = isDisabled || !recipient.token
  const isAmountDisabled = isReceiverAddressDisabled || !recipient.address

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = StringHelper.removeSpecialCharacters(event.target.value, { allowSpaces: false, allowDots: true })

    onUpdateRecipient({ addressInput: address, address: undefined })
  }

  const handleSelectToken = (token: TBSToken) => {
    const blockchain = balance?.data?.blockchain

    if (!blockchain) return

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

    const tokenBalance = balance.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(token, tokenBalance.token)
    )

    onUpdateRecipient({ token: tokenBalance, amount: undefined })
  }

  const handleChangeAmount = (amount: string) => {
    amount = amount.trim()

    const isAmountLoading = !!amount

    onUpdateRecipient({ amount, isAmountLoading })

    debounceAmount(() => {
      if (!isAmountLoading) return

      onUpdateRecipient({
        amount: new BSBigHumanAmount(amount, recipient.token?.token?.decimals).toFormatted(),
        isAmountLoading: false,
      })
    })
  }

  const handleSelectAccount = (account: TAccount) => {
    const newAddress = account.address

    onUpdateRecipient({
      addressInput: newAddress,
      address: !!validatedAddress && newAddress === validatedAddress ? validatedAddress : undefined,
    })
  }

  useEffect(() => {
    if (recipient.addressInput === undefined || !selectedAccount || !isPresent) return

    validateAddressOrNS(recipient.addressInput, selectedAccount.blockchain)
  }, [recipient.addressInput, selectedAccount, validateAddressOrNS, isPresent])

  useEffect(() => {
    if (!isPresent) return

    onUpdateRecipient({ address: validatedAddress })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatedAddress, isPresent])

  return (
    <motion.div
      initial={removable ? { scale: 0, opacity: 0 } : undefined}
      animate={removable ? { scale: 1, opacity: 1 } : undefined}
      exit={removable ? { scale: 0, opacity: 0 } : undefined}
      layout={order > 1}
      style={{ zIndex: !isPresent ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 900, damping: 40, opacity: { duration: 0.05 } }}
      className={StyleHelper.mergeStyles('w-full rounded bg-gray-300/15', {
        static: isPresent,
        absolute: !isPresent,
      })}
    >
      <div className="flex w-full flex-col items-center rounded px-3.5">
        <ActionStep
          title={t('title', { order })}
          titleClassName="font-bold text-sm"
          className="px-0"
          leftIcon={<TbStepInto aria-hidden />}
        >
          {removable && order > 1 && (
            <IconButton
              aria-label={tCommon('general.remove')}
              type="button"
              disabled={isDisabled}
              icon={<TbTrash aria-hidden className="text-pink" />}
              onClick={() => onRemoveRecipient()}
            />
          )}
        </ActionStep>

        <Separator />

        <ActionStep
          title={t('tokenToReceiveLabel')}
          className="px-0"
          leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
        >
          <GreyTokenSelect
            className="text-sm"
            balance={balance?.data}
            selectedToken={recipient.token?.token}
            tokens={balance?.data?.tokensBalances.map(tokenBalance => tokenBalance.token) || []}
            loading={balance?.isLoading}
            disabled={isDisabled}
            onSelect={handleSelectToken}
          />
        </ActionStep>

        <Separator />

        <div className="my-5 flex w-full flex-col">
          <div className="flex w-full items-center gap-1.5 pb-5">
            <VscCircleFilled aria-hidden className="mx-1 size-2 text-gray-300" />
            <span className="text-sm text-white">{t('receivingAddressLabel')}</span>
          </div>
          <div className="flex w-full items-start gap-3">
            <Input
              id="recipient-address"
              name="recipient-address"
              placeholder={t('addressPlaceholder')}
              className="w-full"
              value={recipient.addressInput || ''}
              errorMessage={isValidAddressOrDomainAddress === false ? t('errors.invalidAddress') : undefined}
              clearable={false}
              pastable
              loading={isValidatingAddressOrDomainAddress}
              disabled={isReceiverAddressDisabled}
              onChange={handleChangeAddress}
            />

            <GreyAccountSelect
              blockchains={selectedAccount ? [selectedAccount.blockchain] : undefined}
              withoutIndicator
              disabled={isReceiverAddressDisabled}
              onSelect={handleSelectAccount}
            >
              <Button
                label={t('myAccountButtonLabel')}
                variant="text"
                disabled={isReceiverAddressDisabled}
                leftIcon={<TbWallet aria-hidden />}
              />
            </GreyAccountSelect>
          </div>

          {isNameService && <span className="text-neon mt-1 block text-xs">{validatedAddress}</span>}
        </div>

        <Separator />

        <ActionStep
          title={t('amountLabel')}
          className="pt-1.5 pb-2.5"
          leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
        >
          <GreyAmountInput value={recipient.amount || ''} onChange={handleChangeAmount} disabled={isAmountDisabled}>
            <Button
              label={t('max')}
              variant="text"
              colorSchema="neon"
              className="bg-asphalt h-full w-15 rounded-r"
              flat
              loading={isLoadingMaxAmount}
              disabled={isAmountDisabled}
              clickableProps={{ className: 'h-full rounded-r rounded-l-none' }}
              onClick={() => onMaxAmount(recipient)}
            />
          </GreyAmountInput>
        </ActionStep>

        <div className="flex w-full justify-between gap-x-4 pb-3 pl-6.5 text-xs text-gray-100 italic">
          <span className="whitespace-nowrap">{t('balanceLabel')}</span>
          <span className="truncate">
            {CurrencyHelper.format(
              recipient.amount && recipient.token
                ? new BSBigHumanAmount(recipient.amount, recipient.token.token.decimals)
                    .multipliedBy(recipient.token.exchangeConvertedPrice)
                    .toFixed()
                : 0,
              { currency, maximumFractionDigits: 6 }
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
