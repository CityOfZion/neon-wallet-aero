import { type DapiError, DapiOperations, type DapiProvider } from '@cityofzion/neon-dapi'
import { useQuery } from '@tanstack/react-query'

import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import { Neo3DapiHelper } from '@shared/helpers/Neo3DapiHelper'
import type { TDapiPermissionContentProps } from '@shared/types/dapi'

import { Neo3DapiPermissionFeeDetails } from './Neo3DapiPermissionFeeDetails'
import { Neo3DapiPermissionSignableContent } from './Neo3DapiPermissionSignableContent'

export const Neo3DapiPermissionInvokeContent = ({ request, sendResult }: TDapiPermissionContentProps) => {
  const { network } = useSelectedNetworkSelector('neo3')

  const args = request.args as Parameters<DapiProvider['invoke']>

  const [isAccepting, startAccept] = usePressOnce(async () => {
    try {
      const neonJsAccount = await Neo3DapiHelper.getNeonJsAccount(request.account!)
      const neonJsRpcClient = await Neo3DapiHelper.getNeonJsRpcClient(network.url)
      const dapiNetwork = Neo3DapiHelper.getDapiNetwork(network.type)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        account: neonJsAccount,
        network: dapiNetwork,
      })

      const response = await operations.invoke(...args)

      sendResult(response)
    } catch (error) {
      sendResult(undefined, error)
    }
  })

  const [isRejecting, startReject] = usePressOnce((error: DapiError) => {
    sendResult(undefined, error)
  })

  const feeQuery = useQuery({
    queryKey: ['fee', request.id],
    queryFn: async () => {
      const neonJsAccount = await Neo3DapiHelper.getNeonJsAccount(request.account!)
      const neonJsRpcClient = await Neo3DapiHelper.getNeonJsRpcClient(network.url)
      const dapiNetwork = Neo3DapiHelper.getDapiNetwork(network.type)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        account: neonJsAccount,
        network: dapiNetwork,
      })

      return await operations.calculateInvokeFee(...args)
    },
    gcTime: 0,
    staleTime: 0,
  })

  return (
    <Neo3DapiPermissionSignableContent
      request={request}
      isAccepting={isAccepting}
      isRejecting={isRejecting}
      onAccept={startAccept}
      onReject={startReject}
    >
      <Neo3DapiPermissionFeeDetails isLoading={feeQuery.isLoading} fee={feeQuery.data} />
    </Neo3DapiPermissionSignableContent>
  )
}
