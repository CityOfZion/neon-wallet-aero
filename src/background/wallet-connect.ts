import type { IWalletKit } from '@reown/walletkit'
import { WalletKit } from '@reown/walletkit'
import { Core } from '@walletconnect/core'
import type { ProposalTypes } from '@walletconnect/types'

import { COZ_LINK } from '@shared/constants/links'
import { backgroundApi } from '@shared/message-api/background'

import pkg from '../../package.json'

let walletKit: IWalletKit

async function setupWalletKit() {
  const core = new Core({
    projectId: '1531da330101557460594663b324bc4f',
    logger: 'silent',
  })

  walletKit = await WalletKit.init({
    core,
    metadata: {
      name: pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1),
      description: pkg.description,
      url: COZ_LINK,
      icons: ['https://raw.githubusercontent.com/CityOfZion/neon-icons/refs/heads/main/neon-logo/128x128.png'],
    },
  })

  walletKit.on('session_request', request => {
    chrome.action.openPopup()
    backgroundApi.send('wallet-connect:session_request', request)
  })

  walletKit.on('session_request_expire', ({ id }) => {
    backgroundApi.send('wallet-connect:session_request_expire', id)
  })
}

export async function registerWalletConnectHandlers() {
  setupWalletKit()

  backgroundApi.listen('wallet-connect:pair', async ({ args }) => {
    return new Promise<ProposalTypes.Struct>((resolve, reject) => {
      walletKit.once('session_proposal', proposal => {
        resolve(proposal.params)
      })

      setTimeout(() => {
        reject(new Error('Timeout waiting for session proposal'))
      }, 6000)

      walletKit.pair({ uri: args })
    })
  })

  backgroundApi.listen('wallet-connect:disconnect', async ({ args }) => {
    await walletKit.disconnectSession(args)
  })

  backgroundApi.listen('wallet-connect:reject-proposal', async ({ args }) => {
    await walletKit.rejectSession(args)
  })

  backgroundApi.listen('wallet-connect:approve-proposal', async ({ args }) => {
    await walletKit.approveSession(args)
  })

  backgroundApi.listen('wallet-connect:respond-request', async ({ args }) => {
    await walletKit.respondSessionRequest(args)
  })

  backgroundApi.listen('wallet-connect:get-sessions', async () => {
    return walletKit.getActiveSessions()
  })

  backgroundApi.listen('wallet-connect:get-requests', async () => {
    return walletKit.getPendingSessionRequests()
  })
}
