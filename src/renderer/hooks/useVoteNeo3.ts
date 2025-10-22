import { useMemo } from 'react'

import { BSBigNumberHelper } from '@cityofzion/blockchain-service'
import type { BSNeo3 } from '@cityofzion/bs-neo3'
import { useQuery } from '@tanstack/react-query'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import type { TNetwork } from '@shared/types/blockchain'
import type { TUseBalanceResult } from '@shared/types/query'
import type { IAccountState } from '@shared/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'

type TCalculateVoteFeeParams = {
  neo3Account?: IAccountState
  candidatePubKey: string
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

const buildVoteNeo3GetVoteDetailsByAddressQueryKey = ({
  neo3Network,
  address,
}: TBuildVoteNeo3GetVoteDetailsByAddressQueryKeyParams) => {
  const key: any[] = ['vote-neo3-get-vote-details-by-address', neo3Network]

  if (address) key.push(address)

  return key
}

export const useVoteNeo3CalculateVoteFee = ({ neo3Account, candidatePubKey }: TCalculateVoteFeeParams) => {
  const { loginSessionRef } = useLoginSessionSelector()

  const {
    selectedNetworkByBlockchain: { neo3: neo3Network },
  } = useSelectedNetworkByBlockchainSelector()

  const blockchainService = bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildVoteNeo3CalculateVoteFeeQueryKey({ neo3Network, candidatePubKey, neo3Account }),
    queryFn: async () => {
      const key = await EncryptionHelper.decrypt(neo3Account?.encryptedKey, loginSessionRef.current?.encryptedPassword)

      const account = AccountHelper.getServiceAccount({ account: neo3Account!, key })

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

  const blockchainService = bsAggregator.blockchainServicesByName.neo3 as BSNeo3

  return useQuery({
    queryKey: buildVoteNeo3GetVoteDetailsByAddressQueryKey({ neo3Network, address }),
    queryFn: () => blockchainService.voteService.getVoteDetailsByAddress(address!),
    enabled: !!address && neo3Network.type === 'mainnet',
  })
}

export const useVoteNeo3Validations = ({ balanceQuery, gasFee }: TValidationsParams) => {
  const service = bsAggregator.blockchainServicesByName.neo3

  const hasEnoughGasToPayFee = useMemo(() => {
    const gasAmount = balanceQuery.data?.tokensBalances?.find(({ token }) =>
      service.tokenService.predicateByHash(service.feeToken, token)
    )?.amount

    if (gasAmount === undefined || gasFee === undefined) return undefined

    const bnGasAmount = BSBigNumberHelper.fromNumber(gasAmount)

    return bnGasAmount.isGreaterThanOrEqualTo(gasFee)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceQuery.data?.tokensBalances, gasFee])

  return { hasEnoughGasToPayFee }
}
