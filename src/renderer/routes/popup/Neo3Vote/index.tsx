import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
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
import {
  useNeo3VoteCalculateVoteFee,
  useNeo3VoteGetCandidatesToVote,
  useNeo3VoteGetVoteDetailsByAddress,
  useNeo3VoteValidations,
} from '@renderer/hooks/useNeo3Vote'
import { useSelectedWalletSelector } from '@renderer/hooks/useSettingsSelector'

import { ScreenLayout } from '@renderer/layouts/ScreenLayout'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import MdSearch from '@renderer/assets/images/md-search.svg?react'
import TbChevronRight from '@renderer/assets/images/tb-chevron-right.svg?react'
import TbMenu2 from '@renderer/assets/images/tb-menu-2.svg?react'

import type { TAccount, TWallet } from '@shared/types/store'

import { Neo3VoteAvailableVotes } from './Neo3VoteAvailableVotes'
import { Neo3VoteList } from './Neo3VoteList'

type TLocationState = {
  initialNeo3Account?: TAccount<TBSNeo3Name>
  initialWallet?: TWallet
}

type TActionsData = {
  neo3Account?: TAccount<TBSNeo3Name>
  wallet?: TWallet
  search: string
}

export const Neo3VotePage = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'neo3Vote' })
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

  const candidatesToVoteQuery = useNeo3VoteGetCandidatesToVote()

  // We are using COZ address only to calculate the fee
  const calculateVoteFeeQuery = useNeo3VoteCalculateVoteFee({
    neo3Account,
    candidatePubKey: ConstantsHelper.neo3VoteCozPubKey,
  })

  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address || '')
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useNeo3VoteValidations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })

  const isLoading =
    calculateVoteFeeQuery.isLoading ||
    candidatesToVoteQuery.isLoading ||
    voteDetailsByAddressQuery.isLoading ||
    balanceQuery.isLoading

  const neoAmountBn = BSBigNumberHelper.fromNumber(voteDetailsByAddressQuery.data?.neoBalance || 0)
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
          setData({ neo3Account: account as TAccount<TBSNeo3Name>, wallet })
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
            onClick={modalNavigateWrapper('neo3-vote-info')}
            className="w-full"
          />
        </div>

        {neo3Account ? (
          <div className="flex w-full gap-2.5 pb-6">
            <div className="bg-lemon mt-0.5 size-4 rounded-full" />

            <div className="flex size-full flex-col items-start justify-around gap-2">
              <p className="uppercase">{StringHelper.truncateMiddle(neo3Account.name, 30)}</p>
              <div className="flex">
                <Tooltip title={neo3Account.address}>
                  <p className="mr-8 text-gray-100">{StringHelper.truncateMiddle(neo3Account.address, 10)}</p>
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
          id="neo3-vote-search-input"
          name="neo3-vote-search-input"
          maxLength={100}
          value={search}
          disabled={isSearchDisabled}
          leftIcon={<MdSearch aria-hidden className="text-neon min-size-5 max-size-5 size-5" />}
          onChange={setDataFromEventWrapper('search')}
        />

        <Neo3VoteAvailableVotes
          neoAmountBn={neoAmountBn}
          voteErrorMessage={voteErrorMessage}
          hasNeoAmount={hasNeoAmount}
          neo3Account={neo3Account}
        />

        <Neo3VoteList neo3Account={neo3Account} search={search} voteErrorMessage={voteErrorMessage} canVote={canVote} />
      </div>
    </ScreenLayout>
  )
}

export default Neo3VotePage
