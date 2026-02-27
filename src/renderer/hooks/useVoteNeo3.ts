import { useCallback, useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'

import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useSelectedNetworkByBlockchainSelector } from '@renderer/hooks/useSettingsSelector'

import type { TNetwork } from '@shared/types/blockchain'
import type { TUseBalanceResult } from '@shared/types/query'
import type { IAccountState } from '@shared/types/store'

type TCalculateVoteFeeParams = {
  neo3Account?: IAccountState
  candidatePubKey: string
}

type TBuildVoteNeo3GetCandidatesToVoteQueryKeyParams = {
  neo3Network: TNetwork
}

type TBuildVoteNeo3CalculateVoteFeeQueryKeyParams = {
  neo3Network: TNetwork
  candidatePubKey: string
  neo3Account?: IAccountState
}

type TBuildVoteNeo3GetVoteDetailsByAddressQueryKeyParams = {
  neo3Network: TNetwork
  address: string
}

type TValidationsParams = {
  balanceQuery: TUseBalanceResult
  gasFee?: string
}

const buildVoteNeo3GetCandidatesToVoteQueryKey = ({
  neo3Network,
}: TBuildVoteNeo3GetCandidatesToVoteQueryKeyParams): any[] => ['vote-neo3-get-candidates-to-vote', neo3Network]

export const buildVoteNeo3GetVoteDetailsByAddressQueryKey = ({
  neo3Network,
  address,
}: TBuildVoteNeo3GetVoteDetailsByAddressQueryKeyParams) => {
  return ['vote-neo3-get-vote-details-by-address', neo3Network, address]
}

const buildVoteNeo3CalculateVoteFeeQueryKey = ({
  neo3Network,
  candidatePubKey,
  neo3Account,
}: TBuildVoteNeo3CalculateVoteFeeQueryKeyParams) => {
  const key: any[] = ['vote-neo3-calculate-vote-fee', neo3Network]

  if (candidatePubKey) key.push(candidatePubKey)
  if (neo3Account) key.push(neo3Account)

  return key
}

export const useVoteNeo3GetCandidatesToVote = () => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildVoteNeo3GetCandidatesToVoteQueryKey({ neo3Network }),
    queryFn: () => blockchainService.voteService.getCandidatesToVote(),
  })
}

export const useVoteNeo3CalculateVoteFee = ({ neo3Account, candidatePubKey }: TCalculateVoteFeeParams) => {
  const { loginSessionRef } = useLoginSessionSelector()

  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildVoteNeo3CalculateVoteFeeQueryKey({ neo3Network, candidatePubKey, neo3Account }),
    queryFn: async () => {
      const key = await EncryptionHelper.decrypt(neo3Account?.encryptedKey, loginSessionRef.current?.encryptedPassword)

      const account = await AccountHelper.getServiceAccount({ account: neo3Account!, key })

      return await blockchainService.voteService.calculateVoteFee({ account, candidatePubKey })
    },
    enabled: neo3Account && neo3Account.type !== 'watch' && !!candidatePubKey && neo3Network.type === 'mainnet',
    staleTime: 0,
    gcTime: 0,
  })
}

export const useVoteNeo3GetVoteDetailsByAddress = (address: string) => {
  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address }),
    queryFn: () => blockchainService.voteService.getVoteDetailsByAddress(address!),
    enabled: !!address && neo3Network.type === 'mainnet',
  })
}

export const useLazyVoteNeo3GetVoteDetailsByAddress = () => {
  const queryClient = useQueryClient()
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()

  const getVoteDetails = useCallback(
    async (address: string) => {
      const neo3Network = selectedNetworkByBlockchain.neo3

      if (!address || neo3Network.type !== 'mainnet') return

      const blockchainService = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.neo3 as BSNeo3

      return await queryClient.ensureQueryData({
        queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address }),
        queryFn: () => blockchainService.voteService.getVoteDetailsByAddress(address),
      })
    },
    [selectedNetworkByBlockchain, queryClient]
  )

  return { getVoteDetails }
}

export const useVoteNeo3Validations = ({ balanceQuery, gasFee }: TValidationsParams) => {
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
