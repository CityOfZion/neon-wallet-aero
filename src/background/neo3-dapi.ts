import { wallet } from '@cityofzion/neon-core'
import { DapiError, DapiErrorCode, DapiOperations, type DapiProvider } from '@cityofzion/neon-dapi'
import { localStorage } from 'redux-persist-webextension-storage'

import { DapiHelper } from '@shared/helpers/DapiHelper'
import { Neo3DapiHelper } from '@shared/helpers/Neo3DapiHelper'
import type { TMessageApiListenerOptions } from '@shared/message-api/api'
import { backgroundApi } from '@shared/message-api/background'
import { EDapiMessageTypes, type TDapiConnectedDapp, type TDapiRequest } from '@shared/types/dapi'
import type { TAccount, TApplicationDataByLoginType, TSelectedNetworks } from '@shared/types/store'

import { getSession } from './login'

const BASE_URL = chrome.runtime.getURL('src/renderer/dapi.html')

async function ensureLogin() {
  const session = await getSession()
  if (!session) {
    throw new DapiError(DapiErrorCode.INVALID, 'User is not logged in')
  }
  return session
}

async function ensureConnectedDapp(origin: string) {
  const connectedDapps = await DapiHelper.getConnectedDapps()
  const connectedDapp = connectedDapps[origin]
  if (!connectedDapp) {
    throw new DapiError(DapiErrorCode.INVALID, 'User is not connected to this dapp. Call authenticate first.')
  }

  const auth = await localStorage.getItem('persist:authReducer')
  const parsedAuth = JSON.parse(JSON.parse(auth).data).applicationDataByLoginType as TApplicationDataByLoginType

  const loginSession = await ensureLogin()
  const authData = parsedAuth[loginSession.type]

  let account: TAccount<'neo3'> | undefined

  authData.wallets.forEach(wallet => {
    const accountIndex = wallet.accounts.findIndex(account => account.address === connectedDapp.address)
    if (accountIndex !== -1) {
      account = wallet.accounts[accountIndex] as TAccount<'neo3'>
    }
  })

  if (!account) {
    throw new DapiError(DapiErrorCode.INVALID, 'User is not connected to this dapp. Call authenticate first.')
  }

  const readonlyNeonJsAccount = new wallet.Account(account.address)

  return { readonlyNeonJsAccount, connectedDapp, account }
}

async function getNetwork() {
  const settings = await localStorage.getItem('persist:settingsReducer')
  const parsedSettings = JSON.parse(JSON.parse(settings).data).selectedNetworkByBlockchain as TSelectedNetworks
  const appNetwork = parsedSettings.neo3

  const dapiNetwork = Neo3DapiHelper.getDapiNetwork(appNetwork.type)

  return { dapiNetwork, appNetwork }
}

async function ensureNetwork(connectedDapp: TDapiConnectedDapp) {
  const { dapiNetwork, appNetwork } = await getNetwork()

  if (connectedDapp.networks && !connectedDapp.networks.includes(dapiNetwork.toString())) {
    throw new DapiError(
      DapiErrorCode.INVALID,
      `Dapp is not authorized to use the current wallet selected network. Network: ${dapiNetwork}`
    )
  }

  const neonJsRpcClient = await Neo3DapiHelper.getNeonJsRpcClient(appNetwork.url)

  return { dapiNetwork, neonJsRpcClient }
}

async function sendResultToContentScript(sender: chrome.runtime.MessageSender, request: TDapiRequest, response: any) {
  await chrome.tabs.sendMessage(sender.tab!.id!, {
    type: EDapiMessageTypes.NEON_WALLET_APP_RESULT,
    response,
    request,
  })
}

async function sendErrorToContentScript(sender: chrome.runtime.MessageSender, request: TDapiRequest, error: any) {
  await chrome.tabs.sendMessage(sender.tab!.id!, {
    type: EDapiMessageTypes.NEON_WALLET_APP_RESULT,
    error: {
      code: error.code || DapiErrorCode.INVALID,
      message: error.message || 'Unknown error',
    },
    request,
  })
}

async function openApprovalWindow(request: TDapiRequest) {
  const [tab] = await chrome.tabs.query({ url: `${BASE_URL}*` })
  if (tab?.id) {
    await chrome.windows.update(tab.windowId, { focused: true, drawAttention: true })
    return
  }

  const params = new URLSearchParams({ request: JSON.stringify(request) })

  const currentWindow = await chrome.windows.getLastFocused()
  const top = Math.max(currentWindow.top || 0, 0)
  const left = Math.max((currentWindow.left || 0) + (currentWindow.width || 0) - 400, 0)

  await chrome.windows.create({
    url: `${BASE_URL}?${params}#neo3-dapi-permission`,
    type: 'popup',
    width: 400,
    height: 640,
    top,
    left,
    focused: true,
  })
}

async function openAuthenticatedApprovalWindow({ args, sender }: TMessageApiListenerOptions<TDapiRequest>) {
  try {
    await ensureLogin()
    const { account, connectedDapp } = await ensureConnectedDapp(args.origin)
    await ensureNetwork(connectedDapp)

    openApprovalWindow({ ...args, account })
  } catch (error) {
    await sendErrorToContentScript(sender, args, error)
  }
}

export function registerNeo3DapiHandlers() {
  backgroundApi.listen('dapi:neo3:approval-result', async ({ args: { request, response, error } }) => {
    const [tab] = await chrome.tabs.query({ url: `${request.origin}/*` })
    if (!tab?.id) return

    await chrome.tabs.sendMessage(tab.id, { type: EDapiMessageTypes.NEON_WALLET_APP_RESULT, request, response, error })
  })

  backgroundApi.listen('dapi:neo3:get-accounts', async ({ args: request, sender }) => {
    try {
      await ensureLogin()
      const connectAccount = await Neo3DapiHelper.getConnectedDapiAccounts(request.origin)
      await sendResultToContentScript(sender, request, connectAccount)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-network', async ({ args: request, sender }) => {
    try {
      await ensureLogin()
      const { dapiNetwork } = await getNetwork()
      await sendResultToContentScript(sender, request, dapiNetwork)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-block-count', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getBlockCount()
      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-balance', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getBalance(...(request.args as Parameters<DapiProvider['getBalance']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-block', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getBlock(...(request.args as Parameters<DapiProvider['getBlock']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-application-log', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getApplicationLog(
        ...(request.args as Parameters<DapiProvider['getApplicationLog']>)
      )

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-token-info', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getTokenInfo(...(request.args as Parameters<DapiProvider['getTokenInfo']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-storage', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getStorage(...(request.args as Parameters<DapiProvider['getStorage']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:get-transaction', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.getTransaction(...(request.args as Parameters<DapiProvider['getTransaction']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:relay', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.relay(...(request.args as Parameters<DapiProvider['relay']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:call', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.call(...(request.args as Parameters<DapiProvider['call']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:make-transaction', async ({ args: request, sender }) => {
    try {
      await ensureLogin()

      const { connectedDapp, readonlyNeonJsAccount } = await ensureConnectedDapp(request.origin)

      const { dapiNetwork, neonJsRpcClient } = await ensureNetwork(connectedDapp)

      const operations = new DapiOperations({
        rpcClient: neonJsRpcClient,
        network: dapiNetwork,
        account: readonlyNeonJsAccount,
      })

      const result = await operations.makeTransaction(...(request.args as Parameters<DapiProvider['makeTransaction']>))

      await sendResultToContentScript(sender, request, result)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:authenticate', async ({ args: request, sender }) => {
    try {
      await ensureLogin()
      openApprovalWindow(request)
    } catch (error) {
      await sendErrorToContentScript(sender, request, error)
    }
  })

  backgroundApi.listen('dapi:neo3:send', openAuthenticatedApprovalWindow)

  backgroundApi.listen('dapi:neo3:invoke', openAuthenticatedApprovalWindow)

  backgroundApi.listen('dapi:neo3:sign', openAuthenticatedApprovalWindow)

  backgroundApi.listen('dapi:neo3:sign-message', openAuthenticatedApprovalWindow)

  backgroundApi.listen('dapi:neo3:pick-address', openAuthenticatedApprovalWindow)
}
