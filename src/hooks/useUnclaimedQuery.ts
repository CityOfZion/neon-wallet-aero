import { isCalculableFee, isClaimable } from '@cityofzion/blockchain-service'
import { useQuery } from '@tanstack/react-query'

import { AccountHelper } from '@/helpers/AccountHelper'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { bsAggregator } from '@/libs/blockchainService'
import { getI18next } from '@/libs/i18next'
import { TBlockchainServiceKey, TNetwork } from '@/types/blockchain'
import { TUseUnclaimedResult } from '@/types/query'
import { IAccountState } from '@/types/store'

import { useLoginSessionSelector } from './useAuthSelector'
import { useSelectedNetworkByBlockchainSelector } from './useSettingsSelector'
import { useHasClaimPendingTransactionSelector } from './useUtilitySelector'

const { t } = getI18next()

export const buildQueryKeyUnclaimed = (account: IAccountState, network?: TNetwork<TBlockchainServiceKey>) => {
  const key: any[] = ['unclaimed', account.address]

  if (network) {
    key.push(network.id)
  }

  return key
}

const getUnclaimedInfos = async (
  account: IAccountState,
  hasClaimPendingTransaction: boolean,
  encryptedPassword?: string
): Promise<TUseUnclaimedResult> => {
  const blockchainService = bsAggregator.blockchainServicesByName[account.blockchain]

  if (!isClaimable(blockchainService)) {
    throw new Error(
      t('hooks:useUnclaimedQuery.errors.blockchainIsNotClaimable', {
        address: account.address,
        blockchain: account.blockchain,
      })
    )
  }

  let unclaimed = '0'

  if (!hasClaimPendingTransaction) {
    unclaimed = await blockchainService.blockchainDataService.getUnclaimed(account.address)
  }

  const unclaimedNumber = parseFloat(unclaimed)

  let fee = '0'

  if (isCalculableFee(blockchainService) && unclaimedNumber > 0) {
    const key = await EncryptionHelper.decrypt(account.encryptedKey, encryptedPassword)

    if (!key) {
      throw new Error(t('hooks:useUnclaimedQuery.errors.noKey', { address: account.address }))
    }

    const serviceAccount = AccountHelper.getServiceAccount({ account, key })

    fee = await blockchainService.calculateTransferFee({
      senderAccount: serviceAccount,
      intents: [
        {
          amount: '0',
          receiverAddress: account.address,
          tokenHash: blockchainService.burnToken.hash,
          tokenDecimals: blockchainService.burnToken.decimals,
        },
      ],
    })
  }

  return { unclaimed, unclaimedNumber, fee, feeNumber: parseFloat(fee) }
}

export const useUnclaimed = (account: IAccountState) => {
  const { hasClaimPendingTransactionRef } = useHasClaimPendingTransactionSelector(account)
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { loginSessionRef } = useLoginSessionSelector()

  return useQuery({
    queryKey: buildQueryKeyUnclaimed(account, selectedNetworkByBlockchain[account.blockchain]),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    queryFn: getUnclaimedInfos.bind(
      null,
      account,
      hasClaimPendingTransactionRef.current,
      loginSessionRef.current?.encryptedPassword
    ),
  })
}
