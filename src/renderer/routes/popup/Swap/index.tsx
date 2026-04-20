import { Fragment, useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import type {
  TBSAccount,
  TSwapLoadableValue,
  TSwapMinMaxAmount,
  TSwapToken,
  TSwapValidateValue,
} from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { SimpleSwapOrchestrator } from '@cityofzion/bs-multichain'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { AddressSelectionButton } from '@renderer/components/AddressSelectionButton'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { GreyAmountInput } from '@renderer/components/GreyAmountInput'
import { GreyTokenSelect } from '@renderer/components/GreyTokenSelect'
import { IconButton } from '@renderer/components/IconButton'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'
import { TransactionFeeActionStep } from '@renderer/components/TransactionFeeActionStep'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { SwapHelper } from '@renderer/helpers/SwapHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBalance } from '@renderer/hooks/useBalances'
import { useIsFocused } from '@renderer/hooks/useIsFocused'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import MdRestartAlt from '@renderer/assets/images/md-restart-alt.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'
import TbHelp from '@renderer/assets/images/tb-help.svg?react'
import TbReplace from '@renderer/assets/images/tb-replace.svg?react'
import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'
import TbWand from '@renderer/assets/images/tb-wand.svg?react'
import VscCircleFilled from '@renderer/assets/images/vsc-circle-filled.svg?react'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TAccount, TSwapRecord } from '@shared/types/store'

type TLocationState = {
  account?: TAccount
}

type TActionsData = {
  availableTokensToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]>
  selectedTokenToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>>
  selectedAccountToUse: TSwapValidateValue<TAccount>
  selectedAmountToUse: TSwapLoadableValue<string | null>
  availableTokensToReceive: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]>
  selectedTokenToReceive: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>>
  selectedAmountToReceive: TSwapLoadableValue<string | null>
  selectedAccountToReceive: TSwapValidateValue<TAccount>
  selectedAddressToReceive: TSwapValidateValue<string | null>
  selectedExtraIdToReceive: TSwapValidateValue<string | null>
  selectAmountToUseMinMax: TSwapLoadableValue<TSwapMinMaxAmount>
  fee?: string
  isCalculatingFee: boolean
}

export const SwapPage = () => {
  const { state } = useLocation() as Location<TLocationState>
  const { t } = useTranslation('pages', { keyPrefix: 'swap' })
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { loginSessionRef } = useLoginSessionSelector()
  const { accountsRef } = useAccountsSelector()
  const { isFocused: isAmountInputFocused, ref: amountInputRef } = useIsFocused<HTMLInputElement>()

  const swapChainsByServiceName = useMemo(
    () => SwapHelper.getNetworks(selectedNetworkByBlockchain),
    [selectedNetworkByBlockchain]
  )

  const swapOrchestratorRef = useRef<SimpleSwapOrchestrator<TBlockchainServiceKey>>(null)

  const { actionData, actionState, setData, setError, clearErrors, reset, handleAct } = useActions<TActionsData>(
    {
      availableTokensToUse: { loading: true, value: [] },
      selectedTokenToUse: { loading: false, value: null },
      selectedAccountToUse: { loading: false, value: null, valid: null },
      selectedAmountToUse: { loading: false, value: null },
      availableTokensToReceive: { loading: false, value: [] },
      selectedTokenToReceive: { loading: false, value: null },
      selectedAmountToReceive: { loading: false, value: null },
      selectedAccountToReceive: { loading: false, value: null, valid: null },
      selectedAddressToReceive: { loading: false, value: null, valid: null },
      selectedExtraIdToReceive: { loading: false, value: null, valid: null },
      selectAmountToUseMinMax: { loading: false, value: null },
      fee: undefined,
      isCalculatingFee: false,
    },
    { clearErrorsOnChange: false }
  )

  const tokenToReceiveBlockchain = actionData.selectedTokenToReceive.value?.blockchain

  const isRestartDisabled = actionData.availableTokensToUse.loading || actionState.hasChanged

  const isAddressesDisabled =
    !actionData.selectedTokenToUse.value ||
    !actionData.selectedTokenToReceive.value ||
    actionData.availableTokensToReceive.loading ||
    actionData.availableTokensToUse.loading ||
    actionData.selectedTokenToUse.loading

  const isAmountsDisabled =
    isAddressesDisabled ||
    !actionData.selectedAccountToUse.value ||
    actionData.selectedAccountToUse.valid === false ||
    !actionData.selectedAddressToReceive.value ||
    actionData.selectedAddressToReceive.valid === false

  const isAccountsSelectionDisabled = !tokenToReceiveBlockchain ? true : !actionData.selectedAccountToUse.value

  const hasExtraIdToReceive = !!actionData.selectedTokenToReceive.value?.hasExtraId

  const isExtraIdToReceiveInvalid =
    hasExtraIdToReceive &&
    (!actionData.selectedExtraIdToReceive.valid || !actionData.selectedExtraIdToReceive.value?.trim())

  const isExtraIdToReceiveWrong = hasExtraIdToReceive && actionData.selectedExtraIdToReceive.valid === false

  const balanceQuery = useBalance(actionData.selectedAccountToUse.value || undefined)

  const errorMessage = useMemo(() => {
    if (isExtraIdToReceiveWrong) return t('form.errors.invalidExtraIdToReceive')

    return actionState.errors.selectedAmountToUse || actionState.errors.fee
  }, [actionState.errors.fee, actionState.errors.selectedAmountToUse, isExtraIdToReceiveWrong, t])

  const service = useMemo(
    () =>
      actionData.selectedAccountToUse.value
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[
            actionData.selectedAccountToUse.value.blockchain
          ]
        : undefined,
    [actionData.selectedAccountToUse.value]
  )

  const selectedTokenBalance = useMemo(() => {
    if (!service || !balanceQuery.data || !actionData.selectedTokenToUse.value) return

    const tokenHash = service.tokenService.normalizeHash(actionData.selectedTokenToUse.value!.hash!)

    return balanceQuery.data?.tokensBalances.find(tokenBalance =>
      service.tokenService.predicateByHash(tokenBalance.token.hash, tokenHash)
    )
  }, [actionData.selectedTokenToUse.value, balanceQuery.data, service])

  const initializeOrRestartSwapService = () => {
    reset()

    const swapService = new SimpleSwapOrchestrator({
      blockchainServicesByName: BlockchainServiceHelper.bsAggregator.blockchainServicesByName,
      chainsByServiceName: swapChainsByServiceName,
    })

    swapService.eventEmitter.on(
      'availableTokensToUse',
      (availableTokensToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]> | undefined) => {
        if (!availableTokensToUse) availableTokensToUse = { loading: false, value: [] }

        if (!availableTokensToUse.value) availableTokensToUse.value = []

        setData({ availableTokensToUse })
      }
    )

    swapService.eventEmitter.on(
      'tokenToUse',
      (tokenToUse: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>> | undefined) => {
        setData({ selectedTokenToUse: tokenToUse })
      }
    )

    swapService.eventEmitter.on(
      'accountToUse',
      (accountToUse?: TSwapValidateValue<TBSAccount<TBlockchainServiceKey>>) => {
        if (!accountToUse) accountToUse = { value: null, loading: false, valid: null }

        const account = accountToUse.value
          ? accountsRef.current.find(AccountHelper.predicate(accountToUse.value!))
          : undefined

        setData({ selectedAccountToUse: { ...accountToUse, value: account || null } })
      }
    )

    swapService.eventEmitter.on('amountToUse', (amountToUse?: TSwapLoadableValue<string | null>) => {
      if (!amountToUse) amountToUse = { loading: false, value: null }

      setData({ selectedAmountToUse: amountToUse })
    })

    swapService.eventEmitter.on(
      'availableTokensToReceive',
      (availableTokensToReceive?: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>[]>) => {
        if (!availableTokensToReceive) availableTokensToReceive = { loading: false, value: [] }

        if (!availableTokensToReceive.value) availableTokensToReceive.value = []

        setData({ availableTokensToReceive: availableTokensToReceive })
      }
    )

    swapService.eventEmitter.on(
      'tokenToReceive',
      (tokenToReceive?: TSwapLoadableValue<TSwapToken<TBlockchainServiceKey>>) => {
        setData({ selectedTokenToReceive: tokenToReceive })
      }
    )

    swapService.eventEmitter.on('amountToReceive', (amountToReceive?: TSwapLoadableValue<string | null>) => {
      setData({ selectedAmountToReceive: amountToReceive })
    })

    swapService.eventEmitter.on('addressToReceive', (addressToReceive?: TSwapValidateValue<string | null>) => {
      setData({ selectedAddressToReceive: addressToReceive })
    })

    swapService.eventEmitter.on('extraIdToReceive', (selectedExtraIdToReceive?: TSwapValidateValue<string | null>) => {
      setData({ selectedExtraIdToReceive })
    })

    swapService.eventEmitter.on('amountToUseMinMax', (amountToUseMinMax: TSwapLoadableValue<TSwapMinMaxAmount>) => {
      setData({ selectAmountToUseMinMax: amountToUseMinMax })
    })

    swapService.eventEmitter.on('error', (error: string) => {
      ToastHelper.error({ message: error, duration: 6000 })
    })

    swapOrchestratorRef.current = swapService

    swapService.init()
  }

  const clearReceiverData = () => {
    setData({
      selectedAccountToReceive: { value: null, loading: false, valid: null },
      selectedAddressToReceive: { value: null, loading: false, valid: null },
    })

    swapOrchestratorRef.current?.setAddressToReceive(null)
    swapOrchestratorRef.current?.setExtraIdToReceive(null)
    swapOrchestratorRef.current?.setAmountToUse(null)
  }

  const handleSelectTokenToUse = (token: TSwapToken<TBlockchainServiceKey>) => {
    clearReceiverData()

    swapOrchestratorRef.current?.setTokenToUse(token)
  }

  const handleSelectTokenToReceive = (token: TSwapToken<TBlockchainServiceKey>) => {
    clearReceiverData()

    swapOrchestratorRef.current?.setTokenToReceive(token)
  }

  const handleSelectAccountToUse = async (account: TAccount) => {
    if (!loginSessionRef.current || !account.encryptedKey) return

    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSessionRef.current.encryptedPassword)

    const serviceAccount = await AccountHelper.getServiceAccount({ account, key })

    swapOrchestratorRef.current?.setAccountToUse(serviceAccount)
  }

  const handleSelectAccountToReceive = (account: TAccount) => {
    setData({ selectedAccountToReceive: { value: account, loading: false, valid: true } })
    swapOrchestratorRef.current?.setAddressToReceive(account.address)
  }

  const handleChangeAddressToReceive = (address: string) => {
    setData({ selectedAccountToReceive: { value: null, loading: false, valid: null } })
    swapOrchestratorRef.current?.setAddressToReceive(
      StringHelper.removeSpecialCharacters(address, { allowSpaces: false })
    )
  }

  const handleChangeExtraIdToReceive = (event: ChangeEvent<HTMLInputElement>) => {
    swapOrchestratorRef.current?.setExtraIdToReceive(event.target.value)
  }

  const handleChangeAmountToUse = (value: string) => {
    try {
      value = StringHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true, allowCommas: true })

      swapOrchestratorRef.current?.setAmountToUse(value)
    } catch (error) {
      LoggerHelper.error(error, { where: 'SwapPage', operation: 'handleChangeAmountToUse' })
    }
  }

  const handleSubmit = async () => {
    const account = actionData.selectedAccountToUse.value

    if (
      !swapOrchestratorRef.current ||
      !service ||
      !actionData.selectedTokenToUse.value ||
      !actionData.selectedTokenToUse.value.hash ||
      actionData.selectedTokenToUse.value.decimals === undefined ||
      !actionData.selectedTokenToReceive.value ||
      !actionData.selectedAmountToUse.value ||
      !actionData.selectedAmountToReceive.value ||
      !account ||
      !actionData.selectedAddressToReceive.value ||
      !actionData.selectedAddressToReceive.valid ||
      !actionData.selectAmountToUseMinMax.value ||
      isExtraIdToReceiveInvalid
    )
      return

    const swapRecord: TSwapRecord = {
      account,
      addressTo: actionData.selectedAddressToReceive.value,
      extraIdTo: actionData.selectedExtraIdToReceive.value || undefined,
      amountFrom: actionData.selectedAmountToUse.value,
      amountTo: actionData.selectedAmountToReceive.value,
      tokenFrom: actionData.selectedTokenToUse.value,
      tokenTo: actionData.selectedTokenToReceive.value,
      swapStatus: 'confirming',
      swapProvider: 'simpleswap',
      fee: actionData.fee,
    }

    modalNavigate('swap-confirmation', {
      state: {
        swapRecord,
        swapOrchestrator: swapOrchestratorRef.current,
      },
    })
  }

  const handleMaxAmount = async () => {
    try {
      swapOrchestratorRef.current?.setAmountToUse(actionData.selectAmountToUseMinMax.value?.max || '0')
    } catch (error) {
      LoggerHelper.error(error, { where: 'SwapPage', operation: 'handleMaxAmount' })
    }
  }

  useEffect(() => {
    if (balanceQuery.isLoading) return

    const handleCalculateFee = async () => {
      try {
        if (
          !swapOrchestratorRef.current ||
          !service ||
          !actionData.selectedTokenToUse.value ||
          !actionData.selectedTokenToUse.value.hash ||
          actionData.selectedTokenToUse.value.decimals === undefined ||
          !actionData.selectedTokenToReceive.value ||
          !actionData.selectedAmountToUse.value ||
          !actionData.selectedAmountToReceive.value ||
          !actionData.selectedAccountToUse.value ||
          !actionData.selectedAddressToReceive.value ||
          !actionData.selectedAddressToReceive.valid ||
          !actionData.selectAmountToUseMinMax.value ||
          !selectedTokenBalance
        ) {
          setData({ fee: undefined })
          return
        }

        setData({ isCalculatingFee: true })

        const fee = await swapOrchestratorRef.current.calculateFee()

        setData({ fee })

        let totalFeeAmount = BSBigNumberHelper.fromNumber(fee)

        if (service.tokenService.predicateByHash(actionData.selectedTokenToUse.value.hash, service.feeToken)) {
          totalFeeAmount = BSBigNumberHelper.fromNumber(actionData.selectedAmountToUse.value).plus(totalFeeAmount)
        }

        const feeBalanceNumber =
          balanceQuery.data?.tokensBalances?.find(({ token }) =>
            service.tokenService.predicateByHash(token, service.feeToken)
          )?.amountNumber || 0

        if (totalFeeAmount.isGreaterThan(feeBalanceNumber)) {
          setError('fee', t('form.errors.insufficientFundsFee'))
        } else {
          clearErrors('fee')
        }
      } catch {
        setError('fee', t('form.errors.insufficientFundsFee'))
      } finally {
        setData({ isCalculatingFee: false })
      }
    }

    handleCalculateFee()
  }, [
    actionData.selectAmountToUseMinMax.value,
    actionData.selectedAccountToUse.value,
    actionData.selectedAddressToReceive.valid,
    actionData.selectedAddressToReceive.value,
    actionData.selectedAmountToReceive.value,
    actionData.selectedAmountToUse.value,
    actionData.selectedTokenToReceive.value,
    actionData.selectedTokenToUse.value,
    balanceQuery.data?.tokensBalances,
    balanceQuery.isLoading,
    clearErrors,
    selectedTokenBalance,
    service,
    setData,
    setError,
    t,
  ])

  useEffect(() => {
    const validateAmount = () => {
      if (!actionData.selectedTokenToUse.value) return

      if (!actionData.selectedAmountToUse.value) {
        clearErrors('selectedAmountToUse')

        return
      }

      try {
        const decimals = actionData.selectedTokenToUse.value.decimals

        if (decimals === undefined || decimals === null) return

        const amountNumber = BSBigNumberHelper.fromDecimals(actionData.selectedAmountToUse.value, decimals)

        if (actionData.selectAmountToUseMinMax.value) {
          const minNumber = BSBigNumberHelper.fromDecimals(actionData.selectAmountToUseMinMax.value?.min || 0, decimals)

          if (amountNumber.isLessThan(minNumber)) {
            throw new AppError(
              t('form.errors.amountMin', { amount: BSBigNumberHelper.format(minNumber, { decimals }) })
            )
          }

          if (actionData.selectAmountToUseMinMax.value?.max) {
            const maxNumber = BSBigNumberHelper.fromDecimals(actionData.selectAmountToUseMinMax.value.max, decimals)

            if (amountNumber.isGreaterThan(maxNumber)) {
              throw new AppError(
                t('form.errors.amountMax', { amount: BSBigNumberHelper.format(maxNumber, { decimals }) })
              )
            }
          }
        }

        if (
          actionData.selectedAccountToUse.value &&
          actionData.selectedTokenToUse.value &&
          (!selectedTokenBalance ||
            BSBigNumberHelper.fromDecimals(
              selectedTokenBalance.amountNumber,
              selectedTokenBalance.token.decimals
            ).isLessThan(amountNumber))
        ) {
          throw new AppError(t('form.errors.insufficientFunds'))
        }

        clearErrors('selectedAmountToUse')
      } catch (error) {
        setError('selectedAmountToUse', AppError.wrap(error).message)
      }
    }

    validateAmount()
  }, [
    actionData.selectAmountToUseMinMax.value,
    actionData.selectedAccountToUse.value,
    actionData.selectedAmountToUse.value,
    actionData.selectedTokenToUse.value,
    clearErrors,
    selectedTokenBalance,
    setError,
    t,
  ])

  useLayoutEffect(() => {
    if (!state?.account) return

    handleSelectAccountToUse(state.account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.account])

  useEffect(() => {
    initializeOrRestartSwapService()

    return () => {
      swapOrchestratorRef.current?.eventEmitter.removeAllListeners()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScreenLayout
      heading={t('title')}
      rightComponent={
        <IconButton
          className="pr-2"
          onClick={initializeOrRestartSwapService}
          colorSchema={isRestartDisabled ? 'gray' : 'neon'}
          disabled={isRestartDisabled}
          icon={<MdRestartAlt aria-hidden className="text-neon size-6" />}
        />
      }
    >
      <div className="flex min-h-0 grow flex-col items-center pr-2 text-sm text-white">
        <div className="flex w-full items-center justify-between gap-2 pb-3">
          <Button
            leftIcon={
              <div className="flex w-full items-center gap-1.5">
                <MdInfoOutline aria-hidden className="text-neon" />
                {t('howDoesItWorkButtonLabel')}
              </div>
            }
            colorSchema="white"
            rightIcon={<TbChevronRight aria-hidden className="text-gray-300" />}
            onClick={modalNavigateWrapper('swap-info')}
            className="w-full"
          />
        </div>

        <div className="flex w-full grow flex-col items-center pt-2">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center pt-2 pb-12">
            <div className="flex w-full flex-col items-center rounded bg-gray-300/15 px-4">
              <ActionStep title={t('form.assets')} leftIcon={<TbDiamond aria-hidden />} className="font-bold" />

              <Separator />

              <ActionStep
                title={t('form.tokenToUseTitle')}
                leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
              >
                <GreyTokenSelect
                  tokens={actionData.availableTokensToUse.value || []}
                  loading={actionData.availableTokensToUse.loading || actionData.selectedTokenToUse.loading}
                  onSelect={handleSelectTokenToUse}
                  selectedToken={actionData.selectedTokenToUse.value || undefined}
                  balance={balanceQuery.data}
                  blockchain={actionData.selectedAccountToUse.value?.blockchain}
                />
              </ActionStep>

              <Separator />

              <ActionStep
                title={t('form.tokenToReceiveTitle')}
                leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
                className="mb-2"
              >
                <GreyTokenSelect
                  tokens={actionData.availableTokensToReceive.value || []}
                  loading={actionData.availableTokensToReceive.loading}
                  onSelect={handleSelectTokenToReceive}
                  selectedToken={actionData.selectedTokenToReceive.value || undefined}
                  disabled={!actionData.selectedTokenToUse.value}
                />
              </ActionStep>
            </div>

            <ActionStepSeparator />

            <div className="mt-2.5 flex w-full flex-col items-center rounded bg-gray-300/15 px-4 pb-4">
              <ActionStep
                title={t('form.source')}
                leftIcon={<TbWallet aria-hidden className="min-size-6 size-6" />}
                className="font-bold"
              />

              <Separator />

              <ActionStep
                title={t('form.accountToUseTitle')}
                leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
              >
                <GreyAccountSelect
                  selectedAccount={actionData.selectedAccountToUse.value}
                  onSelect={handleSelectAccountToUse}
                  blockchains={
                    actionData.selectedTokenToUse.value?.blockchain
                      ? [actionData.selectedTokenToUse.value.blockchain]
                      : (Object.keys(swapChainsByServiceName) as TBlockchainServiceKey[])
                  }
                  disabled={isAddressesDisabled}
                />
              </ActionStep>

              <Separator />

              <div className="mt-1 ml-1 flex w-full pr-0.5">
                <div className="flex w-full items-center gap-1.5">
                  <VscCircleFilled aria-hidden className="mx-1 size-2 text-gray-300" />
                  <span className="text-sm text-white">{t('form.receiveHere')}</span>
                </div>

                <AddressSelectionButton
                  blockchain={tokenToReceiveBlockchain}
                  address={
                    actionData.selectedAccountToReceive.value?.address || actionData.selectedAddressToReceive.value
                  }
                  disabled={isAccountsSelectionDisabled}
                  placeholder={t('form.receiverAddressPlaceholder')}
                  onClick={modalNavigateWrapper('account-receive-selection', {
                    state: {
                      selectedAccount: actionData.selectedAccountToReceive.value || undefined,
                      selectedAddress: actionData.selectedAddressToReceive.value || undefined,
                      handleChangeAccount: handleSelectAccountToReceive,
                      handleChangeAddress: handleChangeAddressToReceive,
                      blockchain: tokenToReceiveBlockchain,
                    },
                  })}
                />
              </div>

              {hasExtraIdToReceive && (
                <Fragment>
                  <Separator />

                  <ActionStep
                    title={
                      <div className="flex items-center gap-2">
                        <p>{t('form.extraIdToReceive')}</p>

                        <IconButton
                          aria-label={t('form.openSwapAboutExtraIdToReceiveModal')}
                          colorSchema="neon"
                          type="button"
                          icon={<TbHelp aria-hidden className="min-size-5 size-5" />}
                          onClick={modalNavigateWrapper('swap-about-extra-id-to-receive')}
                        />
                      </div>
                    }
                    leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
                  >
                    <Input
                      name="extra-id"
                      id="extra-id"
                      aria-label={t('form.extraIdToReceive')}
                      placeholder={t('form.extraIdToReceivePlaceholder')}
                      compacted
                      className="text-center text-white"
                      contentClassName="px-4 h-9"
                      containerClassName="w-42"
                      error={actionData.selectedExtraIdToReceive.valid === false}
                      value={actionData.selectedExtraIdToReceive.value || ''}
                      required
                      disabled={!actionData.selectedAccountToUse.value || isAddressesDisabled}
                      onChange={handleChangeExtraIdToReceive}
                    />
                  </ActionStep>
                </Fragment>
              )}
            </div>

            <ActionStepSeparator />

            <div className="mt-2.5 flex w-full flex-col items-center rounded bg-gray-300/15 px-4">
              <ActionStep
                title={t('form.amounts')}
                className="font-bold"
                leftIcon={<TbStepInto aria-hidden className="min-size-6 size-6" />}
              />

              <Separator />

              <ActionStep
                title={
                  <Tooltip title={actionData.selectAmountToUseMinMax.value?.min || '0'}>
                    <div>
                      <p>{t('form.amountToUseTitle')}</p>
                      <span className="w-full text-left text-sm text-gray-200 italic">
                        {t('form.minimumAmountToUseLabel', {
                          amount: StringHelper.truncate(
                            actionData.selectAmountToUseMinMax.value?.min || t('form.minimumAmountToUsePlaceholder'),
                            8
                          ),
                        })}
                      </span>
                    </div>
                  </Tooltip>
                }
                leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
              >
                <div className="flex items-center gap-2.5">
                  <Tooltip
                    title={t('form.amountToUseTooltipLabel')}
                    icon={<TbWand aria-hidden className="text-blue size-6" />}
                    open={isAmountInputFocused}
                    contentProps={{ side: 'top', className: 'text-center' }}
                  >
                    <GreyAmountInput
                      className="w-36"
                      ref={amountInputRef}
                      value={actionData.selectedAmountToUse.value || ''}
                      onChange={handleChangeAmountToUse}
                      disabled={isAmountsDisabled}
                      loading={actionData.selectedAmountToUse.loading}
                    >
                      <Button
                        label={t('form.max')}
                        flat
                        variant="text"
                        colorSchema="neon"
                        className="bg-asphalt h-full w-16 rounded-r"
                        clickableProps={{ className: 'h-full rounded-r rounded-l-none' }}
                        loading={actionData.selectAmountToUseMinMax.loading}
                        disabled={isAmountsDisabled}
                        onClick={handleMaxAmount}
                      />
                    </GreyAmountInput>
                  </Tooltip>
                </div>
              </ActionStep>

              <div className="flex w-full justify-between pb-4 pl-6.5">
                <span className="text-sm text-gray-200 italic">{t('form.balanceLabel')}</span>
                <span className="text-sm text-gray-100 italic">
                  {selectedTokenBalance?.amount
                    ? BSBigNumberHelper.fromNumber(selectedTokenBalance?.amount).toFixed()
                    : t('form.balancePlaceholder')}
                </span>
              </div>

              <Separator />

              <ActionStep
                title={
                  <div className="text-sm">
                    <span className="text-white">{t('form.amountToReceiveTitle')}</span>
                    <span className="text-gray-100">{` ${t('form.amountToReceiveTitleComplement')}`}</span>
                  </div>
                }
                leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
              >
                <p className="text-right text-sm text-white">{actionData.selectedAmountToReceive.value || 0}</p>
              </ActionStep>
            </div>

            {errorMessage && <AlertErrorBanner className="mt-2.5 w-full" message={errorMessage} />}

            {(!service || (service && isCalculableFee(service))) && (
              <TransactionFeeActionStep
                fee={actionData.fee}
                isCalculatingFee={actionData.isCalculatingFee}
                service={service}
                className="mt-1 text-white"
              />
            )}

            <Button
              className="mt-8 w-full max-w-[20rem]"
              iconsOnEdge={false}
              onClick={handleAct(handleSubmit)}
              label={t('form.submitLabel')}
              loading={actionState.isActing}
              leftIcon={<TbReplace aria-hidden />}
              disabled={
                !actionState.isValid ||
                !actionData.selectAmountToUseMinMax.value ||
                !actionData.selectedAmountToUse.value ||
                !actionData.selectedAmountToReceive.value ||
                !actionData.selectedTokenToUse.value ||
                !actionData.selectedTokenToReceive.value ||
                !actionData.selectedAccountToUse.value ||
                !actionData.selectedAddressToReceive.value ||
                isExtraIdToReceiveInvalid ||
                !service ||
                (isCalculableFee(service) && !actionData.fee)
              }
            />
          </div>
        </div>
      </div>
    </ScreenLayout>
  )
}

export default SwapPage
