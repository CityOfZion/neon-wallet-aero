import { useEffect, useRef } from 'react'

import type { TBalanceResponse, TBridgeToken, TBridgeValidateValue, TBridgeValue } from '@cityofzion/blockchain-service'
import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { Neo3NeoXBridgeOrchestrator } from '@cityofzion/bs-multichain'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import type { BSNeoX } from '@cityofzion/bs-neox'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { AddressSelectionButton } from '@renderer/components/AddressSelectionButton'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { GreyAccountSelect } from '@renderer/components/GreyAccountSelect'
import { GreyAmountInput } from '@renderer/components/GreyAmountInput'
import { GreyTokenSelect } from '@renderer/components/GreyTokenSelect'
import { IconButton } from '@renderer/components/IconButton'
import { Separator } from '@renderer/components/Separator'
import { TransactionFeeActionStep } from '@renderer/components/TransactionFeeActionStep'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useAccountsMapSelector } from '@renderer/hooks/useAccountsMapSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLazyBalance } from '@renderer/hooks/useBalances'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useSelectedAccountSelector, useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdChevronRight from '@renderer/assets/images/md-chevron-right.svg?react'
import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import MdRestartAlt from '@renderer/assets/images/md-restart-alt.svg?react'
import TbArrowsSort from '@renderer/assets/images/tb-arrows-sort.svg?react'
import TbCoin from '@renderer/assets/images/tb-coin.svg?react'
import TbDiamond from '@renderer/assets/images/tb-diamond.svg?react'
import TbLock from '@renderer/assets/images/tb-lock.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'
import TbReplace2 from '@renderer/assets/images/tb-replace-2.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'
import VscCircleFilled from '@renderer/assets/images/vsc-circle-filled.svg?react'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { IAccountState } from '@shared/types/store'

type TActionsData = {
  availableTokensToUse: TBridgeValue<TBridgeToken<TBlockchainServiceKey>[]>
  tokenToUse: TBridgeValue<TBridgeToken<TBlockchainServiceKey>>
  tokenToUseBalance: TBridgeValue<TBalanceResponse | undefined>
  accountToUse: TBridgeValue<IAccountState>
  amountToUse: TBridgeValidateValue<string>
  amountToUseMin: TBridgeValue<string>
  amountToUseMax: TBridgeValue<string>
  tokenToReceive: TBridgeValue<TBridgeToken<TBlockchainServiceKey>>
  accountToReceive: TBridgeValue<IAccountState>
  addressToReceive: TBridgeValidateValue<string>
  amountToReceive: TBridgeValue<string>
  bridgeFee: TBridgeValue<string>
}

const isBridgeValueValid = (value: TBridgeValue<any> | TBridgeValidateValue<any>): boolean => {
  return value.value && !value.error && !value.loading && ('valid' in value ? value.valid === true : true)
}

export const Neo3NeoXBridgePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'neo3NeoXBridge' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()
  const { accountsMapRef } = useAccountsMapSelector()
  const { getBalance } = useLazyBalance()
  const { loginSessionRef } = useLoginSessionSelector()
  const { selectedAccount } = useSelectedAccountSelector()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const isGoingBack = useRef(false)
  const navigate = useNavigate()

  const { actionData, actionState, setData, reset, handleAct } = useActions<TActionsData>({
    availableTokensToUse: { value: null, error: null, loading: false },
    tokenToUse: { value: null, error: null, loading: false },
    tokenToUseBalance: { value: null, error: null, loading: false },
    accountToUse: { value: null, error: null, loading: false },
    amountToUse: { value: null, valid: null, error: null, loading: false },
    amountToUseMin: { value: null, error: null, loading: false },
    amountToUseMax: { value: null, error: null, loading: false },
    tokenToReceive: { value: null, error: null, loading: false },
    accountToReceive: { value: null, error: null, loading: false },
    addressToReceive: { value: null, valid: null, error: null, loading: false },
    amountToReceive: { value: null, error: null, loading: false },
    bridgeFee: { value: null, error: null, loading: false },
  })

  const bridgeOrchestratorRef = useRef({} as Neo3NeoXBridgeOrchestrator<TBlockchainServiceKey>)

  const fromService = bridgeOrchestratorRef.current?.fromService

  const isAddressesDisabled =
    !actionData.tokenToUse.value ||
    actionData.tokenToUse.loading ||
    !actionData.tokenToReceive.value ||
    actionData.tokenToReceive.loading ||
    !actionData.availableTokensToUse.value ||
    actionData.availableTokensToUse.loading

  const isAmountsDisabled =
    isAddressesDisabled ||
    !actionData.accountToUse.value ||
    !actionData.addressToReceive.value ||
    actionData.addressToReceive.valid === false

  const isRestartDisabled = actionData.availableTokensToUse.loading

  const errorCode =
    actionData.availableTokensToUse.error?.code ||
    actionData.tokenToUseBalance.error?.code ||
    actionData.accountToUse.error?.code ||
    actionData.tokenToUse.error?.code ||
    actionData.tokenToReceive.error?.code ||
    actionData.bridgeFee?.error?.code ||
    actionData.amountToUse.error?.code ||
    actionData.amountToUseMin.error?.code ||
    actionData.amountToUseMax.error?.code ||
    actionData.addressToReceive.error?.code ||
    actionData.amountToReceive.error?.code

  const errorMessage = errorCode ? t(`errorsByCode.${errorCode}`, t('errorsByCode.UNEXPECTED_ERROR')) : undefined

  const isBridgeValid =
    !isAmountsDisabled &&
    isBridgeValueValid(actionData.availableTokensToUse) &&
    isBridgeValueValid(actionData.tokenToUse) &&
    isBridgeValueValid(actionData.tokenToUseBalance) &&
    isBridgeValueValid(actionData.accountToUse) &&
    isBridgeValueValid(actionData.amountToUse) &&
    isBridgeValueValid(actionData.amountToUseMin) &&
    isBridgeValueValid(actionData.amountToUseMax) &&
    isBridgeValueValid(actionData.tokenToReceive) &&
    isBridgeValueValid(actionData.addressToReceive) &&
    isBridgeValueValid(actionData.amountToReceive) &&
    isBridgeValueValid(actionData.bridgeFee)

  const initializeOrRestartSwapService = async () => {
    reset()

    const neo3NeoXBridgeOrchestrator = new Neo3NeoXBridgeOrchestrator<TBlockchainServiceKey>({
      neo3Service: bsAggregator.blockchainServicesByName.neo3 as BSNeo3<TBlockchainServiceKey>,
      neoXService: bsAggregator.blockchainServicesByName.neox as BSNeoX<TBlockchainServiceKey>,
      initialFromServiceName:
        selectedAccount?.blockchain === 'neo3' || selectedAccount?.blockchain === 'neox'
          ? selectedAccount.blockchain
          : undefined,
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('availableTokensToUse', availableTokensToUse => {
      setData({ availableTokensToUse })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToUse', tokenToUse => {
      setData({ tokenToUse })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToUseBalance', tokenToUseBalance => {
      setData({ tokenToUseBalance })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('accountToUse', accountToUse => {
      const account = accountToUse.value
        ? accountsMapRef.current.get(AccountHelper.buildAccountKey(accountToUse.value))
        : undefined

      setData({ accountToUse: { ...accountToUse, value: account ?? null } })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUse', amountToUse => {
      setData({ amountToUse })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUseMin', amountToUseMin => {
      setData({ amountToUseMin })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToUseMax', amountToUseMax => {
      setData({ amountToUseMax })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('tokenToReceive', tokenToReceive => {
      setData({ tokenToReceive })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('addressToReceive', addressToReceive => {
      setData({ addressToReceive })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('amountToReceive', amountToReceive => {
      setData({ amountToReceive })
    })

    neo3NeoXBridgeOrchestrator.eventEmitter.on('bridgeFee', bridgeFee => {
      setData({ bridgeFee })
    })

    await neo3NeoXBridgeOrchestrator.init()

    bridgeOrchestratorRef.current = neo3NeoXBridgeOrchestrator

    if (selectedAccount && (selectedAccount.blockchain === 'neo3' || selectedAccount.blockchain === 'neox')) {
      await handleSelectAccountToUse(selectedAccount)
    }
  }

  const handleChangeAmountToUse = (value: string) => {
    try {
      bridgeOrchestratorRef.current.setAmountToUse(value)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSelectTokenToUse = async (token: TBridgeToken<TBlockchainServiceKey>) => {
    await bridgeOrchestratorRef.current.setTokenToUse(token)
  }

  const handleSwitchTokens = async () => {
    await bridgeOrchestratorRef.current.switchTokens()

    setData({
      accountToReceive: { value: null, error: null, loading: false },
    })
  }

  const handleSelectAccountToUse = async (account: IAccountState) => {
    if (!loginSessionRef.current || !account.encryptedKey) return

    const key = await EncryptionHelper.decrypt(account.encryptedKey, loginSessionRef.current.encryptedPassword)

    const serviceAccount = AccountHelper.getServiceAccount({ account, key })

    await bridgeOrchestratorRef.current.setAccountToUse(serviceAccount)

    const data = await getBalance({ address: account.address, blockchain: account.blockchain })

    await bridgeOrchestratorRef.current.setBalances(data.tokensBalances)
  }

  const handleSelectAccountToReceive = async (account: IAccountState) => {
    setData({
      accountToReceive: { value: account, error: null, loading: false },
    })

    bridgeOrchestratorRef.current.setAddressToReceive(account.address)
  }

  const handleChangeAddressToReceive = (address: string) => {
    setData({ accountToReceive: { value: null, loading: false, error: null } })
    bridgeOrchestratorRef.current?.setAddressToReceive(
      UtilsHelper.removeSpecialCharacters(address, { allowSpaces: false })
    )
  }

  const handleMaxAmount = async () => {
    try {
      bridgeOrchestratorRef.current?.setAmountToUse(actionData.amountToUseMax.value ?? '0')
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = async () => {
    if (!isBridgeValid) return

    const tokenToUse = actionData.tokenToUse.value
    const tokenToReceive = actionData.tokenToReceive.value
    const accountToUse = actionData.accountToUse.value
    const addressToReceive = actionData.addressToReceive.value
    const amountToUse = actionData.amountToUse.value
    const amountToReceive = actionData.amountToReceive.value

    if (!tokenToUse || !tokenToReceive || !accountToUse || !addressToReceive || !amountToReceive || !amountToUse) {
      return
    }

    modalNavigate('neo3-neox-bridge-confirmation', {
      state: {
        tokenToUse,
        tokenToReceive,
        accountToUse,
        addressToReceive,
        amountToUse,
        amountToReceive,
        fromService,

        onConfirm: async () => {
          let transactionHash: string | undefined

          try {
            transactionHash = await bridgeOrchestratorRef.current.bridge()
          } catch (error) {
            console.error(error)
          } finally {
            modalNavigate('neo3-neox-bridge-details', {
              replace: true,
              state: {
                tokenToUse,
                tokenToReceive,
                accountToUse,
                addressToReceive,
                amountToUse,
                amountToReceive,
                transactionHash,
                confirmed: !transactionHash ? false : undefined,
              },
            })

            initializeOrRestartSwapService()
          }
        },
      },
    })
  }

  useMountUnsafe(() => {
    initializeOrRestartSwapService()

    return () => {
      bridgeOrchestratorRef.current?.eventEmitter?.removeAllListeners()
    }
  })

  useEffect(() => {
    if (isGoingBack.current) return
    if (selectedNetworkByBlockchain.neo3.type === 'mainnet' && selectedNetworkByBlockchain.neox.type === 'mainnet')
      return

    isGoingBack.current = true

    ToastHelper.info({
      id: 'bridge-neo3-neox-mainnet-info',
      message: t('messages.networksShouldBeMainnet'),
      duration: 8000,
    })

    navigate(-1)
  }, [navigate, selectedNetworkByBlockchain, t])

  return (
    <ScreenLayout
      heading={t('title')}
      rightComponent={
        <IconButton
          aria-label={commonT('menuIconButtonAriaLabel')}
          className="mb-0.5"
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
      leftComponent={
        <IconButton
          aria-label={t('form.restartButtonLabel')}
          icon={<MdRestartAlt aria-hidden />}
          colorSchema={isRestartDisabled ? 'gray' : 'neon'}
          disabled={isRestartDisabled}
          onClick={initializeOrRestartSwapService}
        />
      }
    >
      <div>
        <section className="flex min-h-0 flex-grow flex-col rounded text-white">
          <div className="flex min-h-0 flex-grow flex-col items-center text-sm">
            <Button
              label={t('explanation.title')}
              colorSchema="neon"
              onClick={modalNavigateWrapper('neo3-neox-bridge-info')}
              className="w-full"
              leftIcon={<MdInfoOutline aria-hidden className="size-6" />}
              rightIcon={<MdChevronRight aria-hidden className="size-6" />}
            />

            <Separator />

            <div className="flex w-full flex-grow flex-col items-center py-2">
              <div className="mx-auto flex w-full max-w-[36rem] flex-col items-center pt-2 pb-4">
                <div className="flex w-full flex-col items-center rounded bg-gray-300/15 px-4">
                  <ActionStep title={t('form.assets')} leftIcon={<TbDiamond aria-hidden />} className="font-bold" />

                  <Separator />

                  <ActionStep
                    title={t('form.tokenToUseTitle')}
                    leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
                  >
                    <GreyTokenSelect
                      tokens={actionData.availableTokensToUse.value ?? []}
                      loading={actionData.availableTokensToUse.loading || actionData.tokenToUse.loading}
                      onSelect={handleSelectTokenToUse}
                      selectedToken={actionData.tokenToUse.value ?? undefined}
                      blockchain={actionData.tokenToUse.value?.blockchain}
                    />
                  </ActionStep>

                  <div className="relative z-10 w-full">
                    <IconButton
                      aria-label={t('form.switchTokensButtonLabel')}
                      onClick={handleSwitchTokens}
                      size="sm"
                      className="hover:bg-neon/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      clickableProps={{ className: 'p-1.5 rounded-full text-black bg-neon' }}
                      icon={<TbArrowsSort aria-hidden />}
                    />

                    <Separator />
                  </div>

                  <ActionStep
                    title={t('form.tokenToReceiveTitle')}
                    leftIcon={<TbLock aria-hidden className="text-gray-300" />}
                    className="mb-2"
                  >
                    <GreyTokenSelect
                      disabled
                      tokens={[]}
                      loading={actionData.tokenToReceive.loading}
                      selectedToken={actionData.tokenToReceive.value ?? undefined}
                      blockchain={actionData.tokenToReceive.value?.blockchain}
                    />
                  </ActionStep>
                </div>

                <ActionStepSeparator />

                <div className="mt-2.5 flex w-full flex-col items-center rounded bg-gray-300/15 px-4 pb-4">
                  <ActionStep
                    title={t('form.source')}
                    leftIcon={<TbWallet aria-hidden className="h-6 min-h-6 w-6 min-w-6" />}
                    className="font-bold"
                  />

                  <Separator />

                  <ActionStep
                    title={t('form.accountToUseTitle')}
                    leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
                  >
                    <GreyAccountSelect
                      selectedAccount={actionData.accountToUse.value}
                      onSelect={handleSelectAccountToUse}
                      blockchains={actionData.tokenToUse.value ? [actionData.tokenToUse.value.blockchain] : undefined}
                      disabled={isAddressesDisabled}
                    />
                  </ActionStep>

                  <Separator />

                  <ActionStep
                    title={t('form.receiveHere')}
                    leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
                  >
                    <AddressSelectionButton
                      blockchain={actionData.tokenToReceive.value?.blockchain}
                      address={actionData.accountToReceive.value?.address ?? actionData.addressToReceive.value}
                      disabled={isAddressesDisabled}
                      placeholder={t('form.receiverAddressPlaceholder')}
                      onClick={modalNavigateWrapper('account-receive-selection', {
                        state: {
                          selectedAccount: actionData.accountToReceive.value ?? undefined,
                          selectedAddress: actionData.addressToReceive.value ?? undefined,
                          handleChangeAccount: handleSelectAccountToReceive,
                          handleChangeAddress: handleChangeAddressToReceive,
                          blockchain: actionData.tokenToReceive.value?.blockchain,
                        },
                      })}
                    />
                  </ActionStep>
                </div>

                <ActionStepSeparator />

                <div className="mt-2.5 flex w-full flex-col items-center rounded bg-gray-300/15 px-4">
                  <ActionStep
                    title={t('form.amounts')}
                    className="font-bold"
                    leftIcon={<TbCoin aria-hidden className="h-6 min-h-6 w-6 min-w-6" />}
                  />

                  <Separator />

                  <ActionStep
                    title={
                      <div>
                        <p>{t('form.amountToUseTitle')}</p>
                        <span className="w-full text-left text-xs text-gray-200">
                          {t('form.amountToUseMinimumLabel', {
                            amount: actionData.amountToUseMin.value ?? t('form.amountToUseMinimumPlaceholder'),
                          })}
                        </span>
                      </div>
                    }
                    leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
                  >
                    <div className="flex gap-2.5">
                      <GreyAmountInput
                        className="w-36"
                        value={actionData.amountToUse.value ?? ''}
                        onChange={handleChangeAmountToUse}
                        disabled={isAmountsDisabled}
                        loading={actionData.amountToUse.loading}
                      >
                        <Button
                          label={t('form.max')}
                          flat
                          variant="text"
                          colorSchema="neon"
                          className="bg-asphalt h-full w-16 rounded-r"
                          clickableProps={{ className: 'h-full rounded-r rounded-l-none' }}
                          loading={actionData.amountToUseMax.loading}
                          disabled={isAmountsDisabled}
                          onClick={handleMaxAmount}
                        />
                      </GreyAmountInput>
                    </div>
                  </ActionStep>

                  <div className="flex w-full justify-between pt-2 pb-4 pl-6.5">
                    <span className="text-xs text-gray-200 italic">{t('form.tokenToUseBalanceStepTitle')}</span>
                    <span className="text-xs text-gray-100 italic">
                      {actionData.tokenToUseBalance.value?.amount
                        ? BSBigNumberHelper.fromNumber(actionData.tokenToUseBalance.value?.amount).toFixed()
                        : t('form.tokenToUseBalancePlaceholder')}
                    </span>
                  </div>

                  <Separator />

                  <ActionStep
                    title={
                      <div className="flex flex-wrap items-center gap-1">
                        <p className="text-sm text-white">{t('form.amountToReceiveTitle')}</p>
                        <span className="text-xs text-gray-100">{` ${t('form.amountToReceiveTitleComplement')}`}</span>
                      </div>
                    }
                    leftIcon={<VscCircleFilled aria-hidden className="h-2 w-2 text-gray-300" />}
                  >
                    <GreyAmountInput
                      readOnly
                      className="w-28 bg-transparent"
                      inputClassName="text-right"
                      disabled={isAmountsDisabled}
                      value={actionData.amountToReceive.value ?? t('form.amountToReceivePlaceholder')}
                      loading={actionData.amountToReceive.loading}
                    />
                  </ActionStep>
                </div>

                {errorMessage && <AlertErrorBanner className="mt-2.5 w-full" message={errorMessage} />}

                <TransactionFeeActionStep
                  fee={actionData.bridgeFee?.value ?? undefined}
                  isCalculatingFee={actionData.bridgeFee?.loading}
                  service={fromService}
                  className="mt-1"
                />

                <Button
                  className="mt-8 w-full max-w-87.5"
                  variant="card"
                  iconsOnEdge={false}
                  onClick={handleAct(handleSubmit)}
                  label={t('form.bridgeButtonLabel')}
                  loading={actionState.isActing}
                  leftIcon={<TbReplace2 aria-hidden />}
                  disabled={!isBridgeValid || actionState.isActing}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </ScreenLayout>
  )
}

export default Neo3NeoXBridgePage
