import { useCallback, useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import type {
  TUseNeo3VoteBuildNeo3VoteCalculateVoteFeeQueryKeyParams,
  TUseNeo3VoteBuildNeo3VoteGetCandidatesToVoteQueryKeyParams,
  TUseNeo3VoteBuildNeo3VoteGetVoteDetailsByAddressQueryKeyParams,
  TUseNeo3VoteCalculateVoteFeeParams,
  TUseNeo3VoteValidationsParams,
} from '@shared/types/hooks'

const buildNeo3VoteGetCandidatesToVoteQueryKey = ({
  neo3Network,
}: TUseNeo3VoteBuildNeo3VoteGetCandidatesToVoteQueryKeyParams): any[] => [
  'neo3-vote-get-candidates-to-vote',
  neo3Network,
]

export const buildNeo3VoteGetVoteDetailsByAddressQueryKey = ({
  neo3Network,
  address,
}: TUseNeo3VoteBuildNeo3VoteGetVoteDetailsByAddressQueryKeyParams) => {
  return ['neo3-vote-get-vote-details-by-address', neo3Network, address]
}

const buildNeo3VoteCalculateVoteFeeQueryKey = ({
  neo3Network,
  candidatePubKey,
  neo3Account,
}: TUseNeo3VoteBuildNeo3VoteCalculateVoteFeeQueryKeyParams) => {
  const key: any[] = ['neo3-vote-calculate-vote-fee', neo3Network]

  if (candidatePubKey) key.push(candidatePubKey)
  if (neo3Account) key.push(neo3Account)

  return key
}

export const useNeo3VoteGetCandidatesToVote = () => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildNeo3VoteGetCandidatesToVoteQueryKey({ neo3Network }),
    queryFn: () => blockchainService.voteService.getCandidatesToVote(),
  })
}

export const useNeo3VoteCalculateVoteFee = ({ neo3Account, candidatePubKey }: TUseNeo3VoteCalculateVoteFeeParams) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildNeo3VoteCalculateVoteFeeQueryKey({ neo3Network, candidatePubKey, neo3Account }),
    queryFn: async () => {
      const account = await BlockchainServiceHelper.getServiceAccount(neo3Account!)
      return await blockchainService.voteService.calculateVoteFee({ account, candidatePubKey })
    },
    enabled: neo3Account && neo3Account.type !== 'watch' && !!candidatePubKey && neo3Network.type === 'mainnet',
    staleTime: 0,
    gcTime: 0,
  })
}

export const useNeo3VoteGetVoteDetailsByAddress = (address: string) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network, address }),
    queryFn: () => blockchainService.voteService.getVoteDetailsByAddress(address!),
    enabled: !!address && neo3Network.type === 'mainnet',
  })
}

export const useLazyNeo3VoteGetVoteDetailsByAddress = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const getVoteDetails = useCallback(
    async (address: string) => {
      const neo3Network = selectedNetworkByBlockchain.neo3

      if (!address || neo3Network.type !== 'mainnet') return

      const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

      return await queryClient.ensureQueryData({
        queryKey: buildNeo3VoteGetVoteDetailsByAddressQueryKey({ neo3Network, address }),
        queryFn: () => blockchainService.voteService.getVoteDetailsByAddress(address),
      })
    },
    [selectedNetworkByBlockchain, queryClient]
  )

  return { getVoteDetails }
}

export const useNeo3VoteValidations = ({ balanceQuery, gasFee }: TUseNeo3VoteValidationsParams) => {
  const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3

  const hasEnoughGasToPayFee = useMemo(() => {
    const gasAmount = balanceQuery.data?.tokensBalances?.find(({ token }) =>
      service.tokenService.predicateByHash(service.feeToken, token)
    )?.amount

    if (gasAmount === undefined || gasFee === undefined) return false

    const bnGasAmount = BSBigNumberHelper.fromNumber(gasAmount)

    return bnGasAmount.isGreaterThanOrEqualTo(gasFee)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceQuery.data?.tokensBalances, gasFee])

  return { hasEnoughGasToPayFee }
}
