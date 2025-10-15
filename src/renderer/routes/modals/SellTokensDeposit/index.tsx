import { useEffect, useMemo } from 'react'

import type { IBlockchainService, IBSWithFee, TBSToken, TIntentTransferParam } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { GreyAmountInput } from '@renderer/components/GreyAmountInput'
import { GreyTokenSelect } from '@renderer/components/GreyTokenSelect'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'
import { TransactionFeeActionStep } from '@renderer/components/TransactionFeeActionStep'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBalance } from '@renderer/hooks/useBalances'
import { useDebounceFunction } from '@renderer/hooks/useDebounceFunction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useCurrencySelector } from '@renderer/hooks/useSettingsSelector'

import { SideModalLayout } from '@renderer/layouts/SideModalLayout'

import type { TBuyAndSellTokensDepositActionsData } from '@renderer/routes/tab/BuyAndSellTokens'

import TbStepInto from '@renderer/assets/images/tb-step-into.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'
import VscCircleFilled from '@renderer/assets/images/vsc-circle-filled.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { thunks } from '@renderer/store/thunks'
import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { TModalState } from '@shared/types/modal'
import type { IAccountState } from '@shared/types/store'

export const SellTokensDepositModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'sellTokensDeposit' })
  const { account, depositActions } = useModalState<TModalState<'sell-tokens-deposit'>>()
  const { modalNavigate } = useModalNavigate()
  const { loginSessionRef } = useLoginSessionSelector()
  const { accountsRef } = useAccountsSelector()
  const { currency } = useCurrencySelector()
  const dispatch = useAppDispatch()
  const debounceAddress = useDebounceFunction()
  const debounceAmount = useDebounceFunction()

  const { actionData, actionState, setData, setError, clearErrors, handleAct, reset } =
    useActions<TBuyAndSellTokensDepositActionsData>(
      Object.assign(
        {
          isAmountLoading: false,
          amount: '',
          isAddressLoading: false,
          address: '',
          isFeeLoading: false,
          account,
        },
        depositActions.actionData
      )
    )

  const balanceQuery = useBalance(actionData.account)

  const service = useMemo(() => {
    const account = actionData.account

    return account ? bsAggregator.blockchainServicesByName[account.blockchain] : undefined
  }, [actionData.account])

  const alertErrorMessage = actionState.errors.fee || actionState.errors.account || actionState.errors.amount
  const isBalanceLoading = balanceQuery.isLoading || balanceQuery.isRefetching
  const isServiceCalculableFee = service ? isCalculableFee(service) : false
  const isRecipientDisabled = !actionData.account

  const isInvalidForm =
    isRecipientDisabled || !actionData.address || !actionData.amount || !actionData.token || !service

  const isDisabled =
    isBalanceLoading ||
    actionState.isActing ||
    !actionState.isValid ||
    actionData.isFeeLoading ||
    actionData.isAmountLoading ||
    isInvalidForm ||
    (isServiceCalculableFee && !actionData.fee) ||
    Object.values(actionState.errors ?? {}).length > 0

  const buildTransferParams = async () => {
    if (isInvalidForm) return

    const account = actionData.account!
    const token = actionData.token!.token!
    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSessionRef.current!.encryptedPassword)
    const serviceAccount = AccountHelper.getServiceAccount({ account, key })

    const intent: TIntentTransferParam = {
      amount: actionData.amount,
      receiverAddress: actionData.address,
      tokenHash: token.hash,
      tokenDecimals: token.decimals,
    }

    return { serviceAccount, intent }
  }

  const handleClose = () => {
    depositActions.setData({
      ...actionData,
      isAddressLoading: false,
      isAmountLoading: false,
      isFeeLoading: false,
      fee: undefined,
    })
  }

  const handleChangeToken = (token: TBSToken) => {
    if (!service) return

    const tokenBalance = balanceQuery.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(token, tokenBalance.token)
    )

    setData({ token: tokenBalance, amount: '' })
  }

  const handleChangeAccount = (account: IAccountState) => {
    setData({
      account,
      ...(account.blockchain === actionData.account?.blockchain
        ? undefined
        : {
            token: undefined,
            isAddressLoading: false,
            isAmountLoading: false,
            amount: '',
            isFeeLoading: false,
            fee: undefined,
          }),
    })
  }

  const handleChangeAmount = (value: string) => {
    value = UtilsHelper.removeSpecialCharacters(value, { allowSpaces: false, allowDots: true, allowCommas: true })

    setData({ amount: value, isAmountLoading: !!value })

    debounceAmount(() => {
      const token = actionData.token
      const nextValue = BSBigNumberHelper.format(value, { decimals: token?.token?.decimals })
      const tokenAmount = token?.amount

      setData({
        amount: nextValue === '0' ? '' : nextValue,
        isAmountLoading: false,
      })

      if (
        service &&
        tokenAmount &&
        !service.tokenService.predicateByHash(service.feeToken, token.token.hash) &&
        BSBigNumberHelper.fromNumber(nextValue).isGreaterThan(tokenAmount)
      ) {
        setError('amount', t('messages.insufficientFunds'))
      } else {
        clearErrors('amount')
      }
    })
  }

  const handleChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
    const address = UtilsHelper.removeSpecialCharacters(event.target.value, { allowSpaces: false })

    setData({ address })
  }

  const handleSubmit = async () => {
    const transferParams = await buildTransferParams()

    if (!transferParams || isDisabled) return

    try {
      const account = actionData.account!
      const address = actionData.address
      const token = actionData.token!.token!

      const [transactionHash] = await service.transfer({
        senderAccount: transferParams.serviceAccount,
        intents: [transferParams.intent],
      })

      const transaction: TTransactionsTransfer = {
        account,
        amount: actionData.amount,
        asset: token.symbol,
        assetHash: token.hash,
        token,
        to: address,
        from: account.address,
        hash: transactionHash,
        time: DateHelper.getNowUnix(),
        fromAccount: account,
        toAccount: accountsRef.current.find(AccountHelper.predicate({ address, blockchain: account.blockchain })),
        isPending: true,
      }

      dispatch(thunks.waitTransaction({ transaction }))

      modalNavigate('sell-tokens-deposit-success', {
        replace: true,
        state: { transaction },
      })
    } catch (error: any) {
      console.error(error)

      modalNavigate('sell-tokens-deposit-error', {
        replace: true,
        state: { errorMessage: error?.message },
      })
    } finally {
      reset()
      depositActions.reset()
    }
  }

  useEffect(() => {
    if (actionData.address) setData({ isAddressLoading: true })

    debounceAddress(() => {
      try {
        if (!actionData.address || !actionData.account || !service || service.validateAddress(actionData.address)) {
          clearErrors('address')

          return
        }

        setError('address', t('messages.invalidAddress'))
      } catch (error) {
        console.error(error)
      } finally {
        setData({ isAddressLoading: false })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.address, actionData.account, service])

  useEffect(() => {
    const handleCalculateFee = async () => {
      try {
        if (isBalanceLoading || actionData.isAmountLoading || !isServiceCalculableFee) return

        setData({ isFeeLoading: true })

        if (isInvalidForm) {
          setData({ fee: undefined })

          return
        }

        const transferParams = await buildTransferParams()

        if (!transferParams) {
          setData({ fee: undefined })

          return
        }

        const { serviceAccount, intent } = transferParams

        const fee = await (service as IBlockchainService & IBSWithFee).calculateTransferFee({
          senderAccount: serviceAccount,
          intents: [intent],
        })

        setData({ fee })

        let feeTotal = BSBigNumberHelper.fromNumber(fee)

        if (service.tokenService.predicateByHash(service.feeToken, intent.tokenHash)) {
          feeTotal = feeTotal.plus(intent.amount)
        }

        const feeAmount =
          balanceQuery.data?.tokensBalances?.find(({ token }) =>
            service.tokenService.predicateByHash(service.feeToken, token)
          )?.amount || '0'

        if (feeTotal.isGreaterThan(feeAmount)) {
          setError('fee', t('messages.insufficientFunds'))
        } else {
          clearErrors('fee')
        }
      } catch (error) {
        console.error(error)

        const errorMessage = t('messages.feeError')

        ToastHelper.error({ id: 'sell-tokens-deposit-error-message', message: errorMessage })

        setError('fee', errorMessage)
        setData({ fee: undefined })
      } finally {
        setData({ isFeeLoading: false })
      }
    }

    handleCalculateFee()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionData.account,
    actionData.amount,
    actionData.isAmountLoading,
    actionData.address,
    actionData.token,
    isBalanceLoading,
    isInvalidForm,
    isServiceCalculableFee,
    service,
    balanceQuery.data?.tokensBalances,
  ])

  return (
    <SideModalLayout heading={t('title')} icon={<TbStepOut aria-hidden />} onClose={handleClose}>
      <div className="flex w-full flex-col gap-y-6">
        <Separator className="bg-gray-300/30" />

        <p className="text-xs font-bold">{t('description')}</p>

        <p className="text-xs">{t('observation')}</p>

        <Separator />

        <form className="flex flex-col" onSubmit={handleAct(handleSubmit)}>
          <h3 className="mb-2 font-bold text-gray-100 uppercase">{t('form.title')}</h3>

          <ActionStep
            title={t('form.sourceLabel')}
            className="rounded bg-gray-800/60 px-4"
            titleClassName="font-bold"
            leftIcon={<TbStepOut aria-hidden />}
          >
            <GreyAccountSelect
              selectedAccount={actionData.account}
              triggerClassName="h-10 w-28 max-w-28 min-w-28 text-xs"
              onSelect={handleChangeAccount}
            />
          </ActionStep>

          <div className="relative top-1 z-10 mx-auto flex items-center justify-center">
            <div className="absolute flex size-10 items-center justify-center rounded-full bg-gray-700">
              <ActionStepSeparator className="top-0 border-6 border-gray-700 bg-gray-800/60" />
            </div>
          </div>

          <div className="relative mt-2 flex w-full flex-col gap-3">
            <div className="w-full rounded bg-gray-800/60">
              <div className="flex w-full flex-col items-center rounded px-3.5">
                <ActionStep
                  title={t('form.receiveLabel')}
                  titleClassName="font-bold"
                  leftIcon={<TbStepInto aria-hidden />}
                />

                <Separator />

                <ActionStep
                  title={t('form.tokenLabel')}
                  titleClassName="text-xs"
                  leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
                >
                  <GreyTokenSelect
                    className="h-10 w-28 max-w-28 min-w-28 text-xs"
                    textClassName="text-xs"
                    selectedToken={actionData.token?.token}
                    tokens={(balanceQuery.data?.tokensBalances ?? []).map(tokenBalance => tokenBalance.token)}
                    balance={balanceQuery.data}
                    sideOffset={-40}
                    loading={isBalanceLoading}
                    disabled={isRecipientDisabled}
                    onSelect={handleChangeToken}
                  />
                </ActionStep>

                <Separator />

                <ActionStep
                  title={t('form.addressLabel')}
                  className="py-2.5 whitespace-nowrap"
                  titleClassName="text-xs"
                  leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
                >
                  <Input
                    aria-label={t('form.addressLabel')}
                    placeholder={t('form.addressPlaceholder')}
                    className="w-full"
                    contentClassName="pl-3 bg-asphalt"
                    containerClassName="max-w-44"
                    value={actionData.address ?? ''}
                    compacted
                    pastable
                    disabled={isRecipientDisabled}
                    loading={actionData.isAddressLoading}
                    errorMessage={actionState.errors.address}
                    onChange={handleChangeAddress}
                  />
                </ActionStep>

                <Separator />

                <ActionStep
                  title={t('form.amountLabel')}
                  titleClassName="text-xs"
                  leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
                  footer={
                    <div className="flex w-full justify-between gap-x-2 pt-1 pb-4 pl-6.5 text-xs text-gray-100 italic">
                      <p className="whitespace-nowrap">{t('form.fiatLabel', { currencyLabel: currency.label })}</p>

                      <p className="truncate">
                        {NumberHelper.currency(
                          actionData.amount && actionData.token
                            ? BSBigNumberHelper.fromNumber(actionData.amount)
                                .multipliedBy(actionData.token.exchangeConvertedPrice)
                                .toFixed()
                            : 0,
                          currency,
                          { maximumFractionDigits: 6 }
                        )}
                      </p>
                    </div>
                  }
                >
                  <GreyAmountInput
                    value={actionData.amount}
                    className="h-10 w-28 max-w-28 min-w-28"
                    disabled={isRecipientDisabled || !actionData.token}
                    onChange={handleChangeAmount}
                  />
                </ActionStep>
              </div>
            </div>
          </div>

          {isServiceCalculableFee && (
            <TransactionFeeActionStep
              containerClassName="bg-gray-800/60"
              fee={actionData.fee}
              isCalculatingFee={actionData.isFeeLoading || (!isInvalidForm && actionData.isAmountLoading)}
              service={service}
            />
          )}

          {!!alertErrorMessage && <AlertErrorBanner className="mt-2 w-full" message={alertErrorMessage} />}

          <Button
            label={t('form.submitButtonLabel')}
            type="submit"
            className="mx-auto mt-8 mb-12 w-full max-w-64"
            flat
            iconsOnEdge={false}
            loading={actionState.isActing}
            disabled={isDisabled}
            leftIcon={<TbStepOut aria-hidden />}
          />
        </form>
      </div>
    </SideModalLayout>
  )
}

export default SellTokensDepositModal
