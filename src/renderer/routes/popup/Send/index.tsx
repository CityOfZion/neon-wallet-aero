import { useEffect, useMemo, useRef } from 'react'

import type { TIntentTransferParam } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { lte } from 'lodash'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { IconButton } from '@renderer/components/IconButton'
import { TransactionFeeActionStep } from '@renderer/components/TransactionFeeActionStep'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { AnalyticsHelper } from '@renderer/helpers/AnalyticsHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { AppError } from '@renderer/helpers/ErrorHelper'
import { ExchangeHelper } from '@renderer/helpers/ExchangeHelper'
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { TransactionHelper } from '@renderer/helpers/TransactionHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBalance } from '@renderer/hooks/useBalances'
import { useConfirmAction } from '@renderer/hooks/useConfirmAction'
import { useExchange } from '@renderer/hooks/useExchange'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdRestart from '@renderer/assets/images/md-restart-alt.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbSend from '@renderer/assets/images/tb-send.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'

import { thunks } from '@renderer/store/thunks'
import type { TUseTransactionsTransaction } from '@shared/types/hooks'
import type { IAccountState } from '@shared/types/store'

import type { TSendRecipient } from './SendRecipient'
import { SendRecipient } from './SendRecipient'
import { SendTip } from './SendTip'

type TActionsData = {
  selectedAccount?: IAccountState
  recipients: TSendRecipient[]
  fee?: string
  isCalculatingFee: boolean
  isLoadingMaxAmount?: boolean
  maxAmountRecipientId?: string
  isTipChecked: boolean
  isTipDisabled: boolean
  tipAmountBn?: BigNumber
  tipFiatPriceBn?: BigNumber
  tipError?: string
}

type TLocationState = {
  account?: IAccountState
}

const SendPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'send' })
  const { t: tCommon } = useTranslation('common')
  const { state } = useLocation() as Location<TLocationState>
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { loginSessionRef } = useLoginSessionSelector()
  const { accountsMapRef } = useAccountsMapSelector()
  const { confirmAction } = useConfirmAction()
  const dispatch = useAppDispatch()

  const { actionData, actionState, setData, setError, clearErrors, handleAct, reset } = useActions<TActionsData>({
    selectedAccount: undefined,
    recipients: [],
    isCalculatingFee: false,
    fee: undefined,
    isTipChecked: false,
    isTipDisabled: true,
  })

  const balanceQuery = useBalance(actionData.selectedAccount)

  const isDisabledMaxAmountRef = useRef(false)

  const service = useMemo(
    () =>
      actionData.selectedAccount
        ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[actionData.selectedAccount.blockchain]
        : undefined,
    [actionData.selectedAccount]
  )

  const tipConfig = useMemo(
    () => (service ? ConstantsHelper.tipConfigByBlockchain.get(service.name) : undefined),
    [service]
  )

  const exchangeQuery = useExchange(
    service && tipConfig ? [{ blockchain: service.name, tokens: [tipConfig.token] }] : []
  )

  const isMainnetNetwork = service ? selectedNetworkByBlockchain[service.name].type === 'mainnet' : false
  const isFeeInvalid = service ? isCalculableFee(service) && (!actionData.fee || !!actionState.errors.fee) : false
  const isCalculatingMaxAmount = isDisabledMaxAmountRef.current || actionData.isLoadingMaxAmount
  const isCalculatingForm = isCalculatingMaxAmount || actionData.isCalculatingFee
  const isAccountDisabled = !actionData.selectedAccount || isCalculatingForm
  const isAmountsLoading = actionData.recipients.some(recipient => !!recipient.isAmountLoading)

  const getSendFields = async () => {
    if (
      !actionData.selectedAccount ||
      !actionData.selectedAccount.encryptedKey ||
      !service ||
      actionState.errors.recipients !== undefined ||
      !actionState.changed.recipients ||
      isAmountsLoading
    )
      return

    const intents: TIntentTransferParam[] = actionData.recipients.map(recipient => ({
      amount: recipient.amount!,
      receiverAddress: recipient.address!,
      token: recipient.token!.token,
    }))

    const { isTipChecked, isTipDisabled, tipAmountBn, tipFiatPriceBn } = actionData
    if (isTipChecked && !isTipDisabled && tipAmountBn && tipFiatPriceBn && tipConfig) {
      intents.push({
        amount: tipAmountBn.toFixed(),
        receiverAddress: tipConfig.address,
        token: tipConfig.token,
      })
    }

    const key = await EncryptionHelper.decrypt(
      actionData.selectedAccount.encryptedKey,
      loginSessionRef.current?.encryptedPassword
    )

    const serviceAccount = await AccountHelper.getServiceAccount({ account: actionData.selectedAccount, key })

    return {
      service,
      serviceAccount,
      selectedAccount: actionData.selectedAccount,
      intents,
    }
  }

  const handleSetRecipients = (setRecipients: (prevRecipients: TSendRecipient[]) => TSendRecipient[]) => {
    setData({ isTipChecked: false })

    let recipients: TSendRecipient[] = []

    setData(state => {
      recipients = setRecipients(state.recipients)

      return { recipients }
    })

    for (const recipient of recipients) {
      if (!recipient.token || !recipient.amount || !recipient.address) {
        if (!recipient.amount) clearErrors('selectedAccount')

        setError('recipients', '')

        return
      }

      const amountNumber = BSBigNumberHelper.fromNumber(recipient.amount)
      const tokenHash = recipient.token?.token?.hash ?? ''
      const tokenBalance = balanceQuery.data?.tokensBalances?.find(tokenBalance =>
        service?.tokenService.predicateByHash(tokenBalance.token, tokenHash)
      )

      if (!tokenBalance || amountNumber.isGreaterThan(tokenBalance.amount)) {
        setError('selectedAccount', t('errors.insufficientFunds'))
        return
      }
    }

    clearErrors(['recipients', 'selectedAccount'])
  }

  const handleSelectAccount = (account?: IAccountState) => {
    handleSetRecipients(() => [{ id: UtilsHelper.uuid() }])
    setData({ selectedAccount: account })
  }

  const handleRemoveRecipient = (id: string) => {
    handleSetRecipients(prev => prev.filter(recipient => recipient.id !== id))
  }

  const handleUpdateRecipient = (id: string, newRecipient: Partial<TSendRecipient>) => {
    handleSetRecipients(prev =>
      prev.map(recipient => (recipient.id === id ? { ...recipient, ...newRecipient } : recipient))
    )
  }

  const handleUpdateRecipientAmount = (id: string, amount: number) => {
    if (lte(amount, 0)) ToastHelper.error({ message: t('errors.amountIsLessOrEqualZero') })
    else {
      try {
        handleUpdateRecipient(id, {
          amount: BSBigNumberHelper.fromNumber(amount).toString(),
        })
      } catch (error) {
        LoggerHelper.error(error, { where: 'SendPage', operation: 'handleUpdateRecipientAmount' })
      }
    }
  }

  const handleAddRecipient = () => {
    handleSetRecipients(prev => [...prev, { id: UtilsHelper.uuid() }])
  }

  const handleMaxAmount = async (recipient: TSendRecipient) => {
    const { selectedAccount } = actionData
    const encryptedKey = selectedAccount?.encryptedKey
    const encryptedPassword = loginSessionRef.current?.encryptedPassword

    if (
      !encryptedPassword ||
      !encryptedKey ||
      !service ||
      !actionState.changed.recipients ||
      !recipient.id ||
      !recipient.address ||
      !recipient.token ||
      isCalculatingMaxAmount
    )
      return

    if (!service.tokenService.predicateByHash(recipient.token.token.hash, service.feeToken.hash)) {
      handleUpdateRecipientAmount(recipient.id, recipient.token.amountNumber)

      return
    }

    if (!isCalculableFee(service)) {
      handleUpdateRecipientAmount(
        recipient.id,
        BSBigNumberHelper.fromNumber(recipient.token.amount)
          .minus(actionData.fee ?? '0')
          .toNumber()
      )

      return
    }

    isDisabledMaxAmountRef.current = true
    setData({ isLoadingMaxAmount: true, maxAmountRecipientId: recipient.id, isTipChecked: false })

    try {
      const intents = actionData.recipients
        .map(currentRecipient => {
          const receiverAddress = currentRecipient.address
          const token = currentRecipient.token?.token
          const amount = currentRecipient.id === recipient.id ? currentRecipient.token?.amount : currentRecipient.amount

          if (!receiverAddress || !token || !amount) return null

          return { receiverAddress, tokenHash: token.hash, amount, token }
        })
        .filter(recipient => recipient !== null) as TIntentTransferParam[]

      const key = await EncryptionHelper.decrypt(encryptedKey, encryptedPassword)

      const senderAccount = await AccountHelper.getServiceAccount({ account: selectedAccount, key })

      const fee = await service.calculateTransferFee({ senderAccount, intents })

      handleUpdateRecipientAmount(
        recipient.id,
        BSBigNumberHelper.fromNumber(recipient.token.amount).minus(fee).toNumber()
      )
    } catch (error) {
      LoggerHelper.error(error, { where: 'SendPage', operation: 'handleMaxAmount' })
      ToastHelper.error({ message: AppError.wrap(error, t('errors.calculateMaxAmount')).message })
    } finally {
      isDisabledMaxAmountRef.current = false
      setData({ isLoadingMaxAmount: false, maxAmountRecipientId: '' })
    }
  }

  const handleToggleTip = (isTipChecked: boolean) => {
    if (isTipChecked && actionData.tipError) {
      ToastHelper.error({ id: 'send-tip-error', message: actionData.tipError })

      return
    }

    setData({ isTipChecked })
  }

  const handleReset = () => {
    reset()
    handleSelectAccount()
  }

  const handleSubmit = async () => {
    const fields = await getSendFields()

    if (!fields || isCalculatingForm || actionState.isActing || isFeeInvalid) return

    await confirmAction({ account: fields.selectedAccount })

    try {
      const transactionHashes = await fields.service.transfer({
        senderAccount: fields.serviceAccount,
        intents: fields.intents,
      })

      const transactions: TUseTransactionsTransaction[] = []

      if (fields.service.isMultiTransferSupported) {
        transactions.push(
          TransactionHelper.buildPendingTransaction({
            fromAccount: fields.selectedAccount,
            txId: transactionHashes[0],
            events: fields.intents.map(intent => ({
              amount: intent.amount,
              toAddress: intent.receiverAddress,
              token: intent.token,
              toAccount: accountsMapRef.current.get(
                AccountHelper.buildAccountKey({
                  address: intent.receiverAddress,
                  blockchain: fields.service.name,
                })
              ),
            })),
          })
        )
      } else {
        transactionHashes.forEach((txId, index) => {
          if (!txId) return

          const intent = fields.intents[index]

          transactions.push(
            TransactionHelper.buildPendingTransaction({
              fromAccount: fields.selectedAccount,
              txId,
              events: [
                {
                  amount: intent.amount,
                  toAddress: intent.receiverAddress,
                  token: intent.token,
                  toAccount: accountsMapRef.current.get(
                    AccountHelper.buildAccountKey({
                      address: intent.receiverAddress,
                      blockchain: fields.service.name,
                    })
                  ),
                },
              ],
            })
          )
        })
      }

      transactions.forEach(transaction => {
        dispatch(
          thunks.waitTransaction({
            transaction,
            successNotification: {
              title: 'pages:send.successNotification.title',
              previewBody: 'pages:send.successNotification.previewBody',
            },
            failureNotification: {
              title: 'pages:send.failureNotification.title',
              previewBody: 'pages:send.failureNotification.previewBody',
            },
          })
        )
      })

      ToastHelper.success({ message: t('sendSuccess.toast') })

      AnalyticsHelper.logEvent('transaction_executed')

      // TODO: Uncomment and it is published to chrome web store
      // modalNavigate('survey')
    } catch (error: any) {
      LoggerHelper.sentry(error, { where: 'SendPage', operation: 'handleSubmit' })
      ToastHelper.error({ message: AppError.wrap(error, t('sendFail.toast')).message })
    } finally {
      handleReset()
    }
  }

  useEffect(() => {
    if (balanceQuery.isLoading || isAmountsLoading) return

    const abortController = new AbortController()

    const handleCalculateFee = async () => {
      try {
        if (abortController.signal.aborted) return

        const fields = await getSendFields()

        if (!fields || !isCalculableFee(fields.service)) {
          setData({ fee: undefined })

          return
        }

        setData({ isCalculatingFee: true })

        const fee = await fields.service.calculateTransferFee({
          senderAccount: fields.serviceAccount,
          intents: fields.intents,
        })

        setData({ fee })

        let totalFeeAmount = BSBigNumberHelper.fromNumber(fee)

        fields.intents.forEach(intent => {
          if (!service?.tokenService.predicateByHash(intent.token, fields.service.feeToken)) return

          totalFeeAmount = totalFeeAmount.plus(intent.amount)
        })

        const feeBalance =
          balanceQuery.data?.tokensBalances?.find(({ token }) =>
            service?.tokenService.predicateByHash(token, fields.service.feeToken)
          )?.amount ?? '0'

        if (totalFeeAmount.isGreaterThan(feeBalance)) {
          setError('fee', t('errors.insufficientFunds'))
        } else {
          clearErrors('fee')
        }
      } catch (error) {
        LoggerHelper.error(error, { where: 'SendPage', operation: 'handleCalculateFee' })
        ToastHelper.error({ message: AppError.wrap(error, t('errors.feeError')).message })
        setError('fee', t('errors.feeError'))
        setData({ fee: undefined })
      } finally {
        setData({ isCalculatingFee: false })
      }
    }

    handleCalculateFee()

    return () => {
      abortController.abort()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.recipients, balanceQuery.data, actionData.isTipChecked])

  useEffect(() => {
    if (!service || !isMainnetNetwork || !tipConfig) {
      setData({
        isTipChecked: false,
        isTipDisabled: true,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: undefined,
      })

      return
    }

    if (exchangeQuery.isLoading || isAmountsLoading || isCalculatingForm || actionState.isActing) {
      setData({ isTipDisabled: true, tipError: undefined })

      return
    }

    let totalFiatPricesBn = BSBigNumberHelper.fromNumber('0')
    let totalAmountsBn = BSBigNumberHelper.fromNumber(
      actionData.fee && service.tokenService.predicateByHash(service.feeToken, tipConfig.token) ? actionData.fee : '0'
    )

    actionData.recipients.forEach(recipient => {
      const amount = recipient.amount
      const tokenBalance = recipient.token
      const token = tokenBalance?.token

      if (!amount || !token) return

      const amountBn = BSBigNumberHelper.fromNumber(BSBigNumberHelper.format(amount, { decimals: token.decimals }))

      totalFiatPricesBn = totalFiatPricesBn.plus(amountBn.multipliedBy(tokenBalance.exchangeConvertedPrice))

      if (service.tokenService.predicateByHash(token, tipConfig.token)) {
        totalAmountsBn = totalAmountsBn.plus(amountBn)
      }
    })

    const isTipDisabled = isFeeInvalid || !actionState.isValid || !!actionState.errors.recipients

    if (totalFiatPricesBn.isLessThanOrEqualTo('0')) {
      setData({
        isTipChecked: false,
        isTipDisabled,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: t('errors.noFiatPriceToTip'),
      })

      return
    }

    const tipTokenBalance = balanceQuery.data?.tokensBalances?.find(tokenBalance =>
      service.tokenService.predicateByHash(tokenBalance.token, tipConfig.token)
    )

    if (!tipTokenBalance) {
      setData({
        isTipChecked: false,
        isTipDisabled,
        tipAmountBn: undefined,
        tipFiatPriceBn: undefined,
        tipError: t('errors.noTokenToTip'),
      })

      return
    }

    const tokenFiatPrice = ExchangeHelper.getExchangeConvertedPrice(
      tipConfig.token.hash,
      service.name,
      exchangeQuery.data
    )

    let tipFiatPriceBn = totalFiatPricesBn.multipliedBy(ConstantsHelper.tipPercentageBn)
    let tipAmountBn = tipFiatPriceBn.div(tokenFiatPrice)

    if (tipAmountBn.isLessThan(tipConfig.minBn)) {
      tipFiatPriceBn = tipConfig.minBn.multipliedBy(tokenFiatPrice)
      tipAmountBn = tipConfig.minBn
    }

    totalAmountsBn = totalAmountsBn.plus(tipAmountBn)

    if (totalAmountsBn.isGreaterThan(tipTokenBalance.amount)) {
      setData({ isTipChecked: false, isTipDisabled, tipAmountBn, tipFiatPriceBn, tipError: t('errors.noAmountToTip') })

      return
    }

    setData({ isTipDisabled, tipAmountBn, tipFiatPriceBn, tipError: undefined })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionData.fee,
    actionData.recipients,
    actionState.errors.recipients,
    actionState.isActing,
    actionState.isValid,
    balanceQuery.data?.tokensBalances,
    exchangeQuery.data,
    exchangeQuery.isLoading,
    isAmountsLoading,
    isCalculatingForm,
    isFeeInvalid,
    isMainnetNetwork,
    service,
    tipConfig,
  ])

  useEffect(() => {
    handleSelectAccount(state?.account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.account])

  return (
    <ScreenLayout heading={t('title')} className="text-white">
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute top-0 right-0 z-10 -mt-13 flex justify-end">
          <IconButton
            icon={<MdRestart className="text-neon" />}
            aria-label={tCommon('general.reset')}
            type="button"
            onClick={handleReset}
          />
        </div>
        <div className="flex w-full flex-col">
          <ActionStep
            className="rounded bg-gray-300/15 px-4"
            title={t('sourceAccountLabel')}
            titleClassName="font-bold text-sm"
            leftIcon={<TbStepOut aria-hidden />}
          >
            <GreyAccountSelect
              selectedAccount={actionData.selectedAccount}
              disabled={isCalculatingForm}
              onSelect={handleSelectAccount}
            />
          </ActionStep>

          <ActionStepSeparator />

          <div className="relative mt-2 flex w-full flex-col gap-3">
            {actionData.recipients.map((recipient, index) => (
              <SendRecipient
                key={recipient.id}
                onRemoveRecipient={() => handleRemoveRecipient(recipient.id)}
                onUpdateRecipient={updatedRecipient => handleUpdateRecipient(recipient.id, updatedRecipient)}
                order={index + 1}
                selectedAccount={actionData.selectedAccount}
                recipient={recipient}
                removable={actionData.recipients.length > 1}
                balance={balanceQuery}
                isLoadingMaxAmount={actionData.maxAmountRecipientId === recipient.id}
                isDisabledMaxAmount={isCalculatingForm}
                onMaxAmount={handleMaxAmount}
              />
            ))}
          </div>
        </div>

        <Button
          leftIcon={<TbPlus aria-hidden />}
          label={t('addRecipientButtonLabel')}
          variant="text"
          iconsOnEdge={false}
          disabled={isAccountDisabled}
          colorSchema={isAccountDisabled ? 'white' : 'neon'}
          className="mt-2 w-64"
          onClick={handleAddRecipient}
        />

        {(!service || (service && isCalculableFee(service))) && (
          <TransactionFeeActionStep
            fee={actionData.fee ?? '0'}
            isCalculatingFee={actionData.isCalculatingFee}
            service={service}
          />
        )}

        {isMainnetNetwork && tipConfig && actionData.tipAmountBn && actionData.tipFiatPriceBn && (
          <SendTip
            className="mt-2"
            amountBn={actionData.tipAmountBn}
            fiatPriceBn={actionData.tipFiatPriceBn}
            token={tipConfig.token}
            isChecked={actionData.isTipChecked}
            isDisabled={actionData.isTipDisabled}
            isLoading={exchangeQuery.isLoading}
            onChange={handleToggleTip}
          />
        )}

        {(actionState.errors.fee || actionState.errors.selectedAccount) && (
          <AlertErrorBanner
            className="mt-2 w-full"
            message={actionState.errors.fee || actionState.errors.selectedAccount || ''}
          />
        )}

        <Button
          label={t('sendTokensButtonLabel')}
          className="mt-8 mb-12 w-full rounded bg-gray-300/15"
          variant="text"
          iconsOnEdge={false}
          loading={actionState.isActing}
          disabled={
            !actionState.isValid ||
            !actionData.selectedAccount ||
            !!actionState.errors.recipients ||
            !service ||
            isCalculatingForm ||
            isFeeInvalid
          }
          leftIcon={<TbSend className="text-neon" />}
          onClick={handleAct(handleSubmit)}
        />
      </div>
    </ScreenLayout>
  )
}

export default SendPage
