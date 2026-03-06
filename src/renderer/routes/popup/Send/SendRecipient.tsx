import { useEffect } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
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
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
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
import type { IAccountState } from '@shared/types/store'

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
  selectedAccount?: IAccountState
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
  const { t: commonT } = useTranslation('common')
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
  const isAmountDisabled = isDisabled || !recipient.token || !recipient.address

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

  const handleChangeAmount = (value: string) => {
    try {
      value = StringHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true, allowCommas: true })

      onUpdateRecipient({ amount: value, isAmountLoading: true })

      debounceAmount(() => {
        onUpdateRecipient({
          amount: BSBigNumberHelper.format(value, { decimals: recipient.token?.token?.decimals }),
          isAmountLoading: false,
        })
      })
    } catch (error) {
      LoggerHelper.error(error, { where: 'SendRecipient', operation: 'handleChangeAmount' })
    }
  }

  const handleSelectAccount = (account: IAccountState) => {
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
      style={{
        zIndex: !isPresent ? 0 : 1,
      }}
      transition={{ type: 'spring', stiffness: 900, damping: 40, opacity: { duration: 0.05 } }}
      className={StyleHelper.mergeStyles('w-full rounded bg-gray-300/15', {
        static: isPresent,
        absolute: !isPresent,
      })}
    >
      <div className="flex w-full flex-col items-center rounded px-3.5">
        <ActionStep
          className="px-0"
          title={t('title', { order })}
          leftIcon={<TbStepInto aria-hidden />}
          titleClassName="font-bold text-sm"
        >
          {removable && order > 1 && (
            <IconButton
              aria-label={commonT('general.remove')}
              icon={<TbTrash aria-hidden className="text-pink" />}
              type="button"
              disabled={isDisabled}
              onClick={() => onRemoveRecipient()}
            />
          )}
        </ActionStep>

        <Separator />

        <ActionStep
          className="px-0"
          title={t('tokenToReceiveLabel')}
          leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
        >
          <GreyTokenSelect
            tokens={balance?.data?.tokensBalances.map(tokenBalance => tokenBalance.token) ?? []}
            balance={balance?.data}
            onSelect={handleSelectToken}
            selectedToken={recipient.token?.token}
            loading={balance?.isLoading}
            disabled={isDisabled}
            className="text-sm"
          />
        </ActionStep>

        <Separator />

        <div className="my-5 flex w-full flex-col">
          <div className="flex w-full items-center gap-1.5 pb-5">
            <VscCircleFilled aria-hidden className="mx-1 h-2 w-2 text-gray-300" />
            <span className="text-sm text-white">{t('receivingAddressLabel')}</span>
          </div>
          <div className="flex w-full items-start gap-3">
            <Input
              name="recipient-address"
              id="recipient-address"
              value={recipient.addressInput ?? ''}
              onChange={handleChangeAddress}
              className="w-full"
              placeholder={t('addressPlaceholder')}
              clearable={false}
              pastable
              loading={isValidatingAddressOrDomainAddress}
              errorMessage={isValidAddressOrDomainAddress === false ? t('errors.invalidAddress') : undefined}
              disabled={isDisabled}
            />

            <GreyAccountSelect
              onSelect={handleSelectAccount}
              withoutIndicator
              blockchains={selectedAccount ? [selectedAccount.blockchain] : undefined}
              disabled={isDisabled}
            >
              <Button
                disabled={isDisabled}
                variant="text"
                label={t('myAccountButtonLabel')}
                leftIcon={<TbWallet aria-hidden />}
              />
            </GreyAccountSelect>
          </div>

          {isNameService && <span className="text-neon mt-1 block text-xs">{validatedAddress}</span>}
        </div>

        <Separator />

        <ActionStep
          className="pt-1.5 pb-2.5"
          title={t('amountLabel')}
          leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
        >
          <GreyAmountInput value={recipient.amount ?? ''} onChange={handleChangeAmount} disabled={isAmountDisabled}>
            <Button
              label={t('max')}
              flat
              variant="text"
              colorSchema="neon"
              className="bg-asphalt h-full w-15 rounded-r"
              clickableProps={{ className: 'h-full rounded-r rounded-l-none' }}
              loading={isLoadingMaxAmount}
              disabled={isAmountDisabled}
              onClick={() => onMaxAmount(recipient)}
            />
          </GreyAmountInput>
        </ActionStep>

        <div className="flex w-full justify-between gap-x-4 pb-3 pl-6.5">
          <span className="text-xs text-gray-200 italic">{t('balanceLabel')}</span>
          <span className="truncate text-xs text-gray-100 italic">
            {CurrencyHelper.format(
              recipient.amount && recipient.token
                ? BSBigNumberHelper.fromNumber(recipient.amount)
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
