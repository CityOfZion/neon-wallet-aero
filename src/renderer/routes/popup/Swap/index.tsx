import { Fragment, useEffect, useMemo, useState, useSyncExternalStore } from 'react'

import type { BSError } from '@cityofzion/blockchain-service'
import { hasMemo, isCalculableFee } from '@cityofzion/blockchain-service'
import type { ISwapOrchestrator, TSwapToken, TSwapTokenToUse } from '@cityofzion/bs-multichain'
import { SwapHelper, SwapOrchestrator } from '@cityofzion/bs-multichain'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { match } from 'ts-pattern'

import { ActionStep } from '@renderer/components/ActionStep'
import { ActionStepSeparator } from '@renderer/components/ActionStepSeparator'
import { AddressSelectionButton } from '@renderer/components/AddressSelectionButton'
import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Banner } from '@renderer/components/Banner'
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
import { LoggerHelper } from '@renderer/helpers/LoggerHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useBalance, useLazyBalance } from '@renderer/hooks/useBalances'
import { useIsFocused } from '@renderer/hooks/useIsFocused'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

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

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TAccount } from '@shared/types/store'

type TLocationState = {
  account?: TAccount
}

const createSwapOrchestrator = (): ISwapOrchestrator => new SwapOrchestrator(BlockchainServiceHelper.bsAggregator)

const isNonNativeStellarToken = (token: TSwapToken) => {
  const stellarService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

  return token.blockchain === 'stellar' && !!token.hash && !stellarService.tokenService.isNativeToken(token.hash)
}

export const SwapPage = () => {
  const location = useLocation() as Location<TLocationState>
  const { t } = useTranslation('pages', { keyPrefix: 'swap' })
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()
  const { accounts } = useAccountsSelector()
  const { getBalance } = useLazyBalance()
  const { isFocused: isAmountInputFocused, ref: amountInputRef } = useIsFocused<HTMLInputElement>()

  const [swapOrchestrator, setSwapOrchestrator] = useState(createSwapOrchestrator)

  const state = useSyncExternalStore(swapOrchestrator.store.subscribe, swapOrchestrator.store.getState)

  const serviceAccountToUse = state.accountToUse.value

  const accountToUse = useMemo(
    () => (serviceAccountToUse ? accounts.find(AccountHelper.predicate(serviceAccountToUse)) : undefined),
    [accounts, serviceAccountToUse]
  )

  const balanceQuery = useBalance(accountToUse)

  const tokenToUse = state.tokenToUse.value
  const tokenToReceive = state.tokenToReceive.value
  const tokenToReceiveBlockchain = tokenToReceive?.blockchain

  const service = accountToUse
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[accountToUse.blockchain]
    : undefined

  const tokenToReceiveService = tokenToReceiveBlockchain
    ? BlockchainServiceHelper.bsAggregator.blockchainServicesByName[tokenToReceiveBlockchain]
    : undefined

  // The swap backend does not tell which tokens need a destination tag/memo, so it is shown for blockchains with memo support and blockchains not supported by Neon
  const hasExtraIdToReceive = !!tokenToReceive && (!tokenToReceiveService || hasMemo(tokenToReceiveService))

  const supportedBlockchains = BlockchainServiceHelper.blockchainNames.filter(blockchain =>
    SwapHelper.isBlockchainSupported(blockchain, BlockchainServiceHelper.bsAggregator)
  )

  const tokenToUseBalance = balanceQuery.data?.tokensBalances.find(({ token }) => token.hash === tokenToUse?.hash)

  const getErrorMessage = (error: BSError | null) => {
    if (!error) return

    return match(error.code)
      .with('AMOUNT_BELOW_ZERO', () => t('form.errors.amountZero'))
      .with('AMOUNT_BELOW_MINIMUM', () => t('form.errors.amountMin', { amount: error.metadata?.minAmount }))
      .with('AMOUNT_ABOVE_MAXIMUM', () => t('form.errors.amountMax', { amount: error.metadata?.maxAmount }))
      .with('AMOUNT_EXCEEDS_BALANCE', () => t('form.errors.insufficientFunds'))
      .with('FEE_EXCEEDS_BALANCE', 'FEE_CALCULATION_FAILED', () => t('form.errors.insufficientFundsFee'))
      .with('NO_QUOTES_AVAILABLE', () => t('form.errors.noQuotesAvailable'))
      .otherwise(() => error.message)
  }

  const isLoadingOrValidating = Object.values(state).some(
    field => ('loading' in field && field.loading) || ('validating' in field && field.validating)
  )

  const errorMessage = isLoadingOrValidating
    ? undefined
    : [
        state.accountToUse.error,
        state.availableTokensToReceive.error,
        state.amountToUse.error,
        state.quote.error,
        state.fee.error,
      ]
        .map(getErrorMessage)
        .find(Boolean) || (state.addressToReceive.valid === false ? t('form.errors.invalidAddress') : undefined)

  const isAbleToSwap = swapOrchestrator.isAbleToSwap()

  const handleSelectAccountToUse = async (account: TAccount) => {
    if (!account.encryptedKey) return

    try {
      const serviceAccount = await BlockchainServiceHelper.getServiceAccount(account)
      await swapOrchestrator.setAccountToUse(serviceAccount)

      const balance = await getBalance(account)
      await swapOrchestrator.setAccountToUseBalances(balance.tokensBalances)
    } catch (error) {
      LoggerHelper.error(error, { where: 'SwapPage', operation: 'handleSelectAccountToUse' })
      ToastHelper.error({ message: AppError.wrap(error).message })
    }
  }

  const handleSelectTokenToUse = async (token: TSwapTokenToUse) => {
    await swapOrchestrator.setAmountToUse(null)
    await swapOrchestrator.setTokenToUse(token)
  }

  const handleSelectTokenToReceive = (token: TSwapToken) => {
    swapOrchestrator.setTokenToReceive(token)
  }

  const handleSelectAccountToReceive = (account: TAccount) => {
    swapOrchestrator.setAddressToReceive(account.address)
  }

  const handleChangeAddressToReceive = (address: string) => {
    swapOrchestrator.setAddressToReceive(StringHelper.removeSpecialCharacters(address, { allowSpaces: false }) || null)
  }

  const handleChangeExtraIdToReceive = (event: ChangeEvent<HTMLInputElement>) => {
    swapOrchestrator.setExtraId(event.target.value || null)
  }

  const handleChangeAmountToUse = (value: string) => {
    swapOrchestrator.setAmountToUse(value || null)
  }

  const handleRestart = () => {
    swapOrchestrator.cleanup()
    setSwapOrchestrator(createSwapOrchestrator())
  }

  const handleSwap = () => {
    if (!accountToUse || !isAbleToSwap) return

    modalNavigate('swap-confirmation', { state: { account: accountToUse, swapOrchestrator } })
  }

  // The orchestrator is recreated on restart, so the initial account must be selected again
  useEffect(() => {
    if (location.state?.account) handleSelectAccountToUse(location.state.account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.account, swapOrchestrator])

  return (
    <ScreenLayout
      heading={t('title')}
      rightComponent={
        <Tooltip title={t('form.restart')}>
          <IconButton
            aria-label={t('form.restart')}
            className="pr-2"
            onClick={handleRestart}
            colorSchema="neon"
            icon={<MdRestartAlt aria-hidden className="text-neon size-6" />}
          />
        </Tooltip>
      }
    >
      <div className="flex min-h-0 grow flex-col items-center pr-2 text-sm text-white">
        <div className="flex w-full items-center justify-between gap-2">
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

        <div className="mx-auto flex w-full max-w-xl grow flex-col items-center pt-6 pb-12">
          <div className="flex w-full flex-col items-center rounded bg-gray-300/15 px-4 pb-2">
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
                selectedAccount={accountToUse}
                onSelect={handleSelectAccountToUse}
                blockchains={supportedBlockchains}
              />
            </ActionStep>
          </div>

          <ActionStepSeparator />

          <div className="mt-2.5 flex w-full flex-col items-center rounded bg-gray-300/15 px-4 pb-4">
            <ActionStep title={t('form.assets')} leftIcon={<TbDiamond aria-hidden />} className="font-bold" />

            <Separator />

            <ActionStep
              title={t('form.tokenToUseTitle')}
              leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
            >
              <GreyTokenSelect
                tokens={state.availableTokensToUse.value || []}
                loading={state.availableTokensToUse.loading || (!!accountToUse && balanceQuery.isLoading)}
                onSelect={handleSelectTokenToUse}
                selectedToken={tokenToUse || undefined}
                balance={balanceQuery.data}
                disabled={!serviceAccountToUse}
              />
            </ActionStep>

            <Separator />

            <ActionStep
              title={t('form.tokenToReceiveTitle')}
              leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
            >
              <GreyTokenSelect
                tokens={state.availableTokensToReceive.value || []}
                loading={state.availableTokensToReceive.loading}
                onSelect={handleSelectTokenToReceive}
                selectedToken={tokenToReceive || undefined}
                disabled={!tokenToUse}
              />
            </ActionStep>

            <Separator />

            <div className="my-1 ml-1 flex w-full pr-0.5">
              <div className="flex w-full items-center gap-1.5">
                <VscCircleFilled aria-hidden className="mx-1 size-2 text-gray-300" />
                <span className="text-sm text-white">{t('form.receiveHere')}</span>
              </div>

              <AddressSelectionButton
                blockchain={tokenToReceiveBlockchain}
                address={state.addressToReceive.value}
                disabled={!tokenToReceive}
                placeholder={t('form.receiverAddressPlaceholder')}
                onClick={modalNavigateWrapper('account-receive-selection', {
                  state: {
                    selectedAddress: state.addressToReceive.value || undefined,
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

                      <Tooltip title={t('form.openSwapAboutExtraIdToReceiveModal')}>
                        <IconButton
                          aria-label={t('form.openSwapAboutExtraIdToReceiveModal')}
                          colorSchema="neon"
                          type="button"
                          icon={<TbHelp aria-hidden className="min-size-5 size-5" />}
                          onClick={modalNavigateWrapper('swap-about-extra-id-to-receive')}
                        />
                      </Tooltip>
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
                    value={state.extraId.value || ''}
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
              title={t('form.amountToUseTitle')}
              leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
            >
              <Tooltip
                title={t('form.amountToUseTooltipLabel')}
                variant="black"
                icon={<TbWand aria-hidden className="text-blue size-6" />}
                open={isAmountInputFocused}
                contentProps={{ side: 'top', className: 'text-center' }}
              >
                <GreyAmountInput
                  aria-label={t('form.amountToUseTitle')}
                  className="w-36"
                  ref={amountInputRef}
                  value={state.amountToUse.value || ''}
                  onChange={handleChangeAmountToUse}
                  disabled={!tokenToReceive || state.addressToReceive.valid !== true}
                  loading={state.amountToUse.formatting || state.amountToUse.validating}
                />
              </Tooltip>
            </ActionStep>

            <div className="flex w-full justify-between pb-4 pl-6.5">
              <span className="text-sm text-gray-200 italic">{t('form.balanceLabel')}</span>
              <span className="text-sm text-gray-100 italic">
                {tokenToUseBalance?.amount || t('form.balancePlaceholder')}
              </span>
            </div>

            <Separator />

            <ActionStep
              title={
                <div className="text-sm text-white">
                  <span>{t('form.amountToReceiveTitle')}</span>
                  <span className="text-gray-100">{` ${t('form.amountToReceiveTitleComplement')}`}</span>
                </div>
              }
              leftIcon={<VscCircleFilled aria-hidden className="size-2 text-gray-300" />}
            >
              <GreyAmountInput
                disabled={!tokenToReceive || state.addressToReceive.valid !== true}
                readOnly
                className="w-36 bg-transparent"
                value={state.quote.value?.amountToReceive || ''}
                loading={state.quote.loading}
              />
            </ActionStep>
          </div>

          {!!tokenToUse && isNonNativeStellarToken(tokenToUse) && (
            <Banner
              type="warning"
              className="mt-2.5 w-full"
              message={t('form.stellarTrustlineWarnings.source', { token: tokenToUse.symbol.toUpperCase() })}
            />
          )}

          {!!tokenToReceive && isNonNativeStellarToken(tokenToReceive) && (
            <Banner
              type="warning"
              className="mt-2.5 w-full"
              message={t('form.stellarTrustlineWarnings.receiver', { token: tokenToReceive.symbol.toUpperCase() })}
            />
          )}

          {errorMessage && <AlertErrorBanner className="mt-2.5 w-full" message={errorMessage} />}

          {(!service || isCalculableFee(service)) && (
            <TransactionFeeActionStep
              fee={state.fee.value || undefined}
              isCalculatingFee={state.fee.loading}
              service={service}
              containerClassName="mt-2.5"
              className="mt-1 text-white"
            />
          )}

          <Button
            className="mt-8 w-full max-w-[20rem]"
            iconsOnEdge={false}
            onClick={handleSwap}
            label={t('form.submitLabel')}
            leftIcon={<TbReplace aria-hidden />}
            disabled={!isAbleToSwap}
          />
        </div>
      </div>
    </ScreenLayout>
  )
}

export default SwapPage
