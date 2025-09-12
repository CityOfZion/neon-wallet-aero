import { ChangeEvent, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BSBigNumberHelper, Token } from '@cityofzion/blockchain-service'
import { motion, useIsPresent } from 'framer-motion'

import { ActionStep } from '@/components/ActionStep'
import { Button } from '@/components/Button'
import { GreyAccountSelect } from '@/components/GreyAccountSelect'
import { GreyAmountInput } from '@/components/GreyAmountInput'
import { GreyTokenSelect } from '@/components/GreyTokenSelect'
import { IconButton } from '@/components/IconButton'
import { Input } from '@/components/Input'
import { Separator } from '@/components/Separator'
import { NumberHelper } from '@/helpers/NumberHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useDebounceFunction } from '@/hooks/useDebounceFunction'
import { useNameService } from '@/hooks/useNameService'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'
import { bsAggregator } from '@/libs/blockchainService'
import { TTokenBalance, TUseBalanceResult } from '@/types/query'
import { IAccountState } from '@/types/store'

import TbStepInto from '@/assets/images/tb-step-into.svg?react'
import TbTrash from '@/assets/images/tb-trash.svg?react'
import TbWallet from '@/assets/images/tb-wallet.svg?react'
import VscCircleFilled from '@/assets/images/vsc-circle-filled.svg?react'

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
    const address = UtilsHelper.removeSpecialCharacters(event.target.value, { allowSpaces: false, allowDots: true })

    onUpdateRecipient({ addressInput: address, address: undefined })
  }

  const handleSelectToken = (token: Token) => {
    const blockchain = balance?.data?.blockchain

    if (!blockchain) return

    const service = bsAggregator.blockchainServicesByName[blockchain]

    const tokenBalance = balance.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(token, tokenBalance.token)
    )

    onUpdateRecipient({ token: tokenBalance, amount: undefined })
  }

  const handleChangeAmount = (value: string) => {
    try {
      onUpdateRecipient({ amount: value, isAmountLoading: true })
      debounceAmount(() => {
        onUpdateRecipient({
          amount: BSBigNumberHelper.format(value, { decimals: recipient.token?.token?.decimals }),
          isAmountLoading: false,
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectAccount = (account: IAccountState) => {
    onUpdateRecipient({ addressInput: account.address, address: undefined })
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
          leftIcon={<TbStepInto aria-hidden={true} />}
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
          leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
        >
          <GreyTokenSelect
            tokens={balance?.data?.tokensBalances.map(tokenBalance => tokenBalance.token) ?? []}
            balance={balance?.data}
            onSelect={handleSelectToken}
            selectedToken={recipient.token?.token}
            loading={balance?.isLoading}
            disabled={isDisabled}
          />
        </ActionStep>

        <Separator />

        <div className="my-5 flex w-full flex-col">
          <div className="flex w-full items-center gap-1.5 pb-5">
            <VscCircleFilled aria-hidden={true} className="mx-1 h-2 w-2 text-gray-300" />
            <span className="text-sm text-white">{t('receivingAddressLabel')}</span>
          </div>
          <div className="flex w-full items-start gap-3">
            <Input
              value={recipient.addressInput ?? ''}
              onChange={handleChangeAddress}
              compacted
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
                leftIcon={<TbWallet aria-hidden={true} />}
                flat
              />
            </GreyAccountSelect>
          </div>

          {isNameService && <span className="text-neon mt-1 block text-xs">{validatedAddress}</span>}
        </div>

        <Separator />

        <ActionStep
          className="pt-1.5 pb-2.5"
          title={t('amountLabel')}
          leftIcon={<VscCircleFilled aria-hidden={true} className="h-2 w-2 text-gray-300" />}
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

        <div className="flex w-full justify-between pb-3 pl-8">
          <span className="text-xs text-gray-200 italic">{t('balanceLabel')}</span>
          <span className="text-xs text-gray-100 italic">
            {NumberHelper.currency(
              recipient.amount && recipient.token
                ? BSBigNumberHelper.fromNumber(recipient.amount)
                    .multipliedBy(recipient.token.exchangeConvertedPrice)
                    .toNumber()
                : 0,
              currency,
              2,
              6
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
