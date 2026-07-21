import { type DapiError, DapiOperations, type DapiProvider } from '@cityofzion/neon-dapi'

import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useSelectedNetworkSelector } from '@renderer/hooks/useSettingsSelector'

import { Neo3DapiHelper } from '@shared/helpers/Neo3DapiHelper'
import type { TDapiPermissionContentProps } from '@shared/types/dapi'

import { Neo3DapiPermissionSignableContent } from './Neo3DapiPermissionSignableContent'

export const Neo3DapiPermissionSignMessageContent = ({ request, sendResult }: TDapiPermissionContentProps) => {
  const { network } = useSelectedNetworkSelector('neo3')

  const args = request.args as Parameters<DapiProvider['signMessage']>

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

      const response = await operations.signMessage(...args)
      sendResult(response)
    } catch (error) {
      sendResult(undefined, error)
    }
  })

  const [isRejecting, startReject] = usePressOnce((error: DapiError) => {
    sendResult(undefined, error)
  })

  return (
    <Neo3DapiPermissionSignableContent
      request={request}
      isAccepting={isAccepting}
      isRejecting={isRejecting}
      onAccept={startAccept}
      onReject={startReject}
    />
  )
}
