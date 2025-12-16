import { useCallback } from 'react'

import { BSNeo3NeonDappKitSingletonHelper, BSNeo3NeonJsSingletonHelper } from '@cityofzion/bs-neo3'
import { useQueryClient } from '@tanstack/react-query'

import { bsAggregator } from '@renderer/libs/blockchain-service'
import type { IAccountState, TNftSkin } from '@shared/types/store'

const fetchOwnerOfNftSkin = async (account: IAccountState, nftSkin: TNftSkin) => {
  if (account.blockchain !== 'neo3') throw new Error('Only Neo 3 blockchain is supported')

  const neo3Service = bsAggregator.blockchainServicesByName.neo3

  if (neo3Service.network.type !== 'mainnet') throw new Error('Only Neo 3 mainnet is supported')

  const { NeonInvoker, NeonParser } = BSNeo3NeonDappKitSingletonHelper.getInstance()

  const invoker = await NeonInvoker.init({ rpcAddress: neo3Service.network.url })

  const ownerOfResult = await invoker.testInvoke({
    invocations: [
      {
        scriptHash: nftSkin.contractHash,
        operation: 'ownerOf',
        args: [{ type: 'Integer', value: nftSkin.id }],
      },
    ],
  })

  const response = NeonParser.parseRpcResponse(ownerOfResult.stack[0])

  const { u, wallet } = BSNeo3NeonJsSingletonHelper.getInstance()

  const { address } = new wallet.Account(u.reverseHex(u.HexString.fromBase64(response).toString()))

  return address
}

export const useLazyGetOwnerOfNftSkin = () => {
  const queryClient = useQueryClient()

  const getOwnerOfNftSkin = useCallback(
    async (account: IAccountState, nftSkin: TNftSkin) =>
      await queryClient.ensureQueryData({
        queryKey: ['get-owner-of-nft-skin', nftSkin.contractHash, nftSkin.id],
        queryFn: fetchOwnerOfNftSkin.bind(null, account, nftSkin),
      }),
    [queryClient]
  )

  return { getOwnerOfNftSkin }
}
