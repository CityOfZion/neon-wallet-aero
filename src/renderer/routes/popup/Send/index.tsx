import { useEffect, useMemo, useRef } from 'react'

import type { TIntentTransferParam } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper, isCalculableFee } from '@cityofzion/blockchain-service'
import { lte } from 'lodash'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { IconButton } from '@renderer/components/IconButton'
import { TransactionFeeActionStep } from '@renderer/components/TransactionFeeActionStep'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { DateHelper } from '@renderer/helpers/DateHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { NumberHelper } from '@renderer/helpers/NumberHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountsMapSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useBalance } from '@renderer/hooks/useBalances'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdRestart from '@renderer/assets/images/md-restart-alt.svg?react'
import TbPlus from '@renderer/assets/images/tb-plus.svg?react'
import TbSend from '@renderer/assets/images/tb-send.svg?react'
import TbStepOut from '@renderer/assets/images/tb-step-out.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import { thunks } from '@renderer/store/thunks'
import type { TTransactionsTransfer } from '@shared/types/hooks'
import type { IAccountState } from '@shared/types/store'

import type { TSendRecipient } from './SendRecipient'
import { SendRecipient } from './SendRecipient'

type TActionsData = {
  selectedAccount?: IAccountState
  recipients: TSendRecipient[]
  fee?: string
  isCalculatingFee: boolean
  isLoadingMaxAmount?: boolean
  maxAmountRecipientId?: string
  tip?: string
  tipIsChecked?: boolean
  tipIsDisabled?: boolean
}

type TLocationState = {
  account?: IAccountState
}

export const SendPage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'send' })
  const { t: tCommon } = useTranslation('common')
  const { state } = useLocation() as Location<TLocationState>
  const { loginSessionRef } = useLoginSessionSelector()
  const { accountsMapRef } = useAccountsMapSelector()
  const dispatch = useAppDispatch()

  const currentRecipientAddress = useRef(undefined)
  const isDisabledMaxAmountRef = useRef(false)

  const { actionData, actionState, setData, setError, clearErrors, handleAct, reset } = useActions<TActionsData>({
    selectedAccount: undefined,
    recipients: [],
    isCalculatingFee: false,
    fee: undefined,
    tip: undefined,
    tipIsChecked: undefined,
    tipIsDisabled: undefined,
  })

  const isCalculatingMaxAmount = isDisabledMaxAmountRef.current || actionData.isLoadingMaxAmount
  const isCalculatingForm = isCalculatingMaxAmount || actionData.isCalculatingFee
  const isAccountDisabled = !actionData.selectedAccount || isCalculatingForm
  const balance = useBalance(actionData.selectedAccount)

  const service = useMemo(
    () =>
      actionData.selectedAccount
        ? bsAggregator.blockchainServicesByName[actionData.selectedAccount.blockchain]
        : undefined,
    [actionData.selectedAccount]
  )

  const getSendFields = async () => {
    if (
      !actionData.selectedAccount ||
      !actionData.selectedAccount.encryptedKey ||
      !service ||
      actionState.errors.recipients !== undefined ||
      !actionState.changed.recipients ||
      actionData.recipients.some(recipient => !!recipient.isAmountLoading)
    )
      return

    const intents: TIntentTransferParam[] = actionData.recipients.map(recipient => ({
      amount: recipient.amount!,
      receiverAddress: recipient.address!,
      tokenHash: recipient.token!.token.hash,
      tokenDecimals: recipient.token!.token.decimals,
    }))

    const key = await EncryptionHelper.decrypt(
      actionData.selectedAccount.encryptedKey,
      loginSessionRef.current?.encryptedPassword
    )

    const serviceAccount = AccountHelper.getServiceAccount({ account: actionData.selectedAccount, key })

    return {
      service,
      serviceAccount,
      selectedAccount: actionData.selectedAccount,
      intents,
    }
  }

  const handleSetRecipients = (setRecipients: (prevRecipients: TSendRecipient[]) => TSendRecipient[]) => {
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

      const amountNumber = NumberHelper.number(recipient.amount)
      const tokenHash = recipient.token?.token?.hash ?? ''
      const tokenBalance = balance.data?.tokensBalances?.find(tokenBalance =>
        service?.tokenService.predicateByHash(tokenBalance.token, tokenHash)
      )

      if (!tokenBalance || amountNumber > tokenBalance.amountNumber) {
        setError('selectedAccount', t('errors.insufficientFunds'))
        return
      }
    }

    clearErrors(['recipients', 'selectedAccount'])
  }

  const handleSelectAccount = (account?: IAccountState) => {
    handleSetRecipients(() => [{ id: UtilsHelper.uuid(), addressInput: currentRecipientAddress.current }])
    setData({ selectedAccount: account })
  }

  const handleRemoveRecipient = (id: string) => {
    handleSetRecipients(prev => prev.filter(recipient => recipient.id !== id))
  }

  const handleUpdateRecipient = (id: string, newRecipient: Partial<TSendRecipient>) => {
    if (newRecipient.address) currentRecipientAddress.current = undefined

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
        console.error(error)
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
        recipient.token.amountNumber - NumberHelper.number(actionData.fee ?? '0')
      )

      return
    }

    isDisabledMaxAmountRef.current = true
    setData({ isLoadingMaxAmount: true, maxAmountRecipientId: recipient.id })

    try {
      const intents = actionData.recipients
        .map(currentRecipient => {
          const receiverAddress = currentRecipient.address
          const tokenHash = currentRecipient.token?.token?.hash
          const amount = currentRecipient.id === recipient.id ? currentRecipient.token?.amount : currentRecipient.amount

          if (!receiverAddress || !tokenHash || !amount) return null

          return { receiverAddress, tokenHash, amount, tokenDecimals: currentRecipient.token!.token.decimals }
        })
        .filter(recipient => recipient !== null) as TIntentTransferParam[]

      const key = await EncryptionHelper.decrypt(encryptedKey, encryptedPassword)

      const senderAccount = AccountHelper.getServiceAccount({ account: selectedAccount, key })

      const fee = await service.calculateTransferFee({ intents, senderAccount })

      handleUpdateRecipientAmount(recipient.id, recipient.token.amountNumber - NumberHelper.number(fee))
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('errors.calculateMaxAmount') })
    } finally {
      isDisabledMaxAmountRef.current = false
      setData({ isLoadingMaxAmount: false, maxAmountRecipientId: '' })
    }
  }

  const handleReset = () => {
    reset()
    currentRecipientAddress.current = undefined
    handleSelectAccount()
  }

  const handleSubmit = async () => {
    const fields = await getSendFields()

    if (!fields || isCalculatingForm || actionState.isActing) return

    try {
      const transactionHashes = await fields.service.transfer({
        senderAccount: fields.serviceAccount,
        intents: fields.intents,
      })

      transactionHashes.forEach((hash, index) => {
        if (!hash) return

        const recipient = actionData.recipients[index]
        const address = recipient.address!
        const token = recipient.token!.token

        const transaction: TTransactionsTransfer = {
          account: fields.selectedAccount,
          amount: recipient.amount!,
          asset: token.symbol,
          assetHash: token.hash,
          token,
          to: address,
          from: fields.selectedAccount.address,
          hash,
          time: DateHelper.getNowUnix(),
          fromAccount: fields.selectedAccount,
          toAccount: accountsMapRef.current.get(
            AccountHelper.buildAccountKey({ address, blockchain: fields.service.name })
          ),
          isPending: true,
        }

        dispatch(thunks.waitTransaction({ transaction }))
      })

      ToastHelper.success({ message: t('sendSuccess.toast') })
    } catch (error: any) {
      console.error(error)
      ToastHelper.error({ message: t('sendFail.toast') })
    } finally {
      handleReset()
    }
  }

  useEffect(() => {
    if (balance.isLoading) return

    const abortController = new AbortController()

    const handleCalculateFee = async () => {
      try {
        // It works as a debounce
        await UtilsHelper.sleep(1500)

        if (abortController.signal.aborted) return

        const fields = await getSendFields()

        if (!fields || !isCalculableFee(fields.service)) {
          setData({ fee: undefined })

          return
        }

        setData({ isCalculatingFee: true })

        const fee = await fields.service.calculateTransferFee({
          intents: fields.intents,
          senderAccount: fields.serviceAccount,
        })

        setData({ fee })

        let totalFeeAmount = NumberHelper.number(fee)

        fields.intents.forEach(intent => {
          if (!service?.tokenService.predicateByHash(intent.tokenHash, fields.service.feeToken)) return

          totalFeeAmount += NumberHelper.number(intent.amount)
        })

        const feeBalanceNumber =
          balance.data?.tokensBalances?.find(({ token }) =>
            service?.tokenService.predicateByHash(token, fields.service.feeToken)
          )?.amountNumber ?? 0

        if (totalFeeAmount > feeBalanceNumber) {
          setError('fee', t('errors.insufficientFunds'))
        } else {
          clearErrors('fee')
        }
      } catch (error) {
        console.error(error)
        ToastHelper.error({ message: t('errors.feeError') })
        setError('fee', t('errors.feeError'))
        setData({ fee: undefined })
        throw error
      } finally {
        setData({ isCalculatingFee: false })
      }
    }

    handleCalculateFee()

    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData.recipients, balance.data])

  useEffect(() => {
    handleSelectAccount(state.account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.account])

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
              triggerClassName="text-xs"
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
                balance={balance}
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
          flat
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

        <Button
          onClick={handleAct(handleSubmit)}
          variant="text"
          iconsOnEdge={false}
          disabled={
            !actionState.isValid ||
            !actionData.selectedAccount ||
            !!actionState.errors.fee ||
            !!actionState.errors.recipients ||
            !service ||
            isCalculatingForm ||
            (isCalculableFee(service) && !actionData.fee) ||
            actionState.isActing
          }
          loading={actionState.isActing}
          className="mt-8 mb-5 w-full rounded bg-gray-300/15"
          leftIcon={<TbSend className="text-neon" />}
          label={t('sendTokensButtonLabel')}
        />
      </div>
    </ScreenLayout>
  )
}

export default SendPage
