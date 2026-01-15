import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { match, P } from 'ts-pattern'

import { Button } from '@renderer/components/Button'
import { IconButton } from '@renderer/components/IconButton'
import { Input } from '@renderer/components/Input'
import { Tooltip } from '@renderer/components/Tooltip'

import { ConstantsHelper } from '@renderer/helpers/ConstantsHelper'
import { StringHelper } from '@renderer/helpers/StringHelper'

import { useAccountsByBlockchainsSelector } from '@renderer/hooks/useAccountSelector'
import { useActions } from '@renderer/hooks/useActions'
import { useBalance } from '@renderer/hooks/useBalances'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useSelectedWalletSelector } from '@renderer/hooks/useSettingsSelector'
import {
  useVoteNeo3CalculateVoteFee,
  useVoteNeo3GetCandidatesToVote,
  useVoteNeo3GetVoteDetailsByAddress,
  useVoteNeo3Validations,
} from '@renderer/hooks/useVoteNeo3'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import MdSearch from '@renderer/assets/images/md-search.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import type { IAccountState, IWalletState } from '@shared/types/store'

import { VoteNeo3AvailableVotes } from './VoteNeo3AvailableVotes'
import { VoteNeo3List } from './VoteNeo3List'

type TLocationState = {
  initialNeo3Account?: IAccountState
  initialWallet?: IWalletState
}

type TActionsData = {
  neo3Account?: IAccountState
  wallet?: IWalletState
  search: string
}

export const VoteNeo3Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'voteNeo3' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { state } = useLocation() as Location<TLocationState>
  const { modalNavigateWrapper, modalNavigate, modalErase } = useModalNavigate()
  const { selectedWallet } = useSelectedWalletSelector()

  const { accountsByBlockchains: neo3Accounts } = useAccountsByBlockchainsSelector(['neo3'])

  const {
    actionData: { neo3Account, wallet, search },
    setData,
    setDataFromEventWrapper,
  } = useActions<TActionsData>({
    neo3Account: state?.initialNeo3Account,
    wallet: state?.initialNeo3Account ? state?.initialWallet : selectedWallet,
    search: '',
  })

  const candidatesToVoteQuery = useVoteNeo3GetCandidatesToVote()

  // We are using COZ address only to calculate the fee
  const calculateVoteFeeQuery = useVoteNeo3CalculateVoteFee({
    neo3Account,
    candidatePubKey: ConstantsHelper.voteNeo3CozPubKey,
  })
  const voteDetailsByAddressQuery = useVoteNeo3GetVoteDetailsByAddress(neo3Account?.address ?? '')
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useVoteNeo3Validations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })

  const isLoading =
    calculateVoteFeeQuery.isLoading ||
    candidatesToVoteQuery.isLoading ||
    voteDetailsByAddressQuery.isLoading ||
    balanceQuery.isLoading

  const neoAmountBn = BSBigNumberHelper.fromNumber(voteDetailsByAddressQuery.data?.neoBalance ?? 0)
  const hasNeoAmount = neoAmountBn.isGreaterThan(0)
  const hasNeo3Accounts = neo3Accounts.length > 0
  const isSearchDisabled = candidatesToVoteQuery.isLoading || !hasNeo3Accounts
  const isWatchAccount = neo3Account?.type === 'watch'
  const canVote = !isLoading && !isWatchAccount && hasNeoAmount && hasEnoughGasToPayFee

  const voteErrorMessage = match({ neo3Account, hasNeoAmount, isWatchAccount, hasEnoughGasToPayFee })
    .with({ neo3Account: P.when(value => !value) }, () => t('voteErrorMessages.selectNeo3AccountLabel'))
    .with({ hasNeoAmount: false }, () => t('voteErrorMessages.thereIsNoNeoLabel'))
    .with({ isWatchAccount: true }, () => t('voteErrorMessages.accountCanNotBeWatchLabel'))
    .with({ hasEnoughGasToPayFee: false }, () => t('voteErrorMessages.shouldHaveEnoughGasToPayFeeLabel'))
    .otherwise(() => undefined)

  const handleSelectAccount = () => {
    if (!wallet) return
    modalNavigate('account-selection-by-blockchain', {
      state: {
        description: t('accountSelectionByBlockchain.description'),
        submitButtonLabel: t('accountSelectionByBlockchain.submitButtonLabel'),
        blockchain: 'neo3',
        selectedWallet: wallet!,
        selectedAccount: neo3Account,
        onSelect: (account, wallet) => {
          setData({ neo3Account: account, wallet })
          modalErase('bottom')
        },
      },
    })
  }

  return (
    <ScreenLayout
      heading={t('title')}
      withBackButton={false}
      rightComponent={
        <IconButton
          aria-label={tCommon('menuIconButtonAriaLabel')}
          className="mb-0.5"
          icon={<TbMenu2 aria-hidden />}
          onClick={modalNavigateWrapper('menu')}
        />
      }
    >
      <div className="flex min-h-0 flex-grow flex-col items-center text-sm text-white">
        <div className="flex w-full items-center justify-between gap-2 pb-9">
          <Button
            leftIcon={<MdInfoOutline aria-hidden className="text-neon" />}
            label={t('howDoesItWorkButtonLabel')}
            colorSchema="white"
            rightIcon={<TbChevronRight aria-hidden className="text-gray-300" />}
            textClassName="text-left"
            onClick={modalNavigateWrapper('vote-neo3-info')}
            className="w-full"
          />
        </div>

        {neo3Account ? (
          <div className="flex w-full gap-2.5 pb-6">
            <div className="bg-lemon mt-0.5 size-4 rounded-full" />

            <div className="flex h-full w-full flex-col items-start justify-around gap-2">
              <p className="uppercase">{StringHelper.truncateMiddle(neo3Account.name, 30)}</p>
              <div className="flex">
                <Tooltip title={neo3Account.address}>
                  <p className="mr-12 text-gray-100">{StringHelper.truncateMiddle(neo3Account.address, 10)}</p>
                </Tooltip>
                <Button
                  variant="text-slim"
                  className="text-neon text-sm"
                  onClick={handleSelectAccount}
                  label={t('changeAccountButtonLabel')}
                />
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="text-slim"
            className="text-neon self-start pb-6 text-sm"
            onClick={handleSelectAccount}
            label={t('selectAccountButtonLabel')}
          />
        )}

        <Input
          placeholder={t('searchPlaceholder')}
          className="placeholder:text-neon"
          contentClassName="h-10"
          containerClassName="w-full max-w-96"
          id="vote-neo3-search-input"
          name="vote-neo3-search-input"
          maxLength={100}
          value={search}
          disabled={isSearchDisabled}
          leftIcon={<MdSearch aria-hidden className="text-neon h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5" />}
          onChange={setDataFromEventWrapper('search')}
        />

        <VoteNeo3AvailableVotes
          neoAmountBn={neoAmountBn}
          voteErrorMessage={voteErrorMessage}
          hasNeoAmount={hasNeoAmount}
          neo3Account={neo3Account}
        />

        <VoteNeo3List neo3Account={neo3Account} search={search} voteErrorMessage={voteErrorMessage} canVote={canVote} />
      </div>
    </ScreenLayout>
  )
}

export default VoteNeo3Page
