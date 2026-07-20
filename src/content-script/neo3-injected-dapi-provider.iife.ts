import type {
  Account,
  Address,
  ApplicationLog,
  Argument,
  AuthenticationChallengePayload,
  AuthenticationResponsePayload,
  Base64Encoded,
  Block,
  ContractParametersContext,
  DapiProvider,
  Integer,
  InvocationArguments,
  InvocationResult,
  SignedMessage,
  Signer,
  SignOptions,
  Token,
  Transaction,
  TransactionAttribute,
  TransactionOptions,
  UInt160,
  UInt256,
} from '@cityofzion/neon-dapi'
import { DapiError, DapiErrorCode, DapiNetwork } from '@cityofzion/neon-dapi'
import EventEmitter from 'events'

import { ConstantsURLHelper } from '@shared/helpers/ConstantsURLHelper'
import { neo3DapiProviderArgsSchemaByMethod } from '@shared/schemas/neo3-dapi-provider'
import { EDapiMessageTypes } from '@shared/types/dapi'

import pkg from '../../package.json'

// Runs in page world (MAIN world content script)
// TODO: Add support to on/emit events
class Neo3DapiProvider extends EventEmitter implements DapiProvider {
  name = pkg.name
  version = pkg.version
  dapiVersion = '1.0'
  compatibility = ['NEP-11', 'NEP-17', 'NEP-20', 'NEP-21']
  supportedNetworks = [DapiNetwork.MAINNET, DapiNetwork.TESTNET]
  icon = `${ConstantsURLHelper.neonIconsUrl}/neon-logo/128x128.png`
  website = ConstantsURLHelper.cozWebsiteUrl
  extra = null
  connected = false
  network = DapiNetwork.MAINNET

  constructor() {
    super()
    this.#init()
  }

  // Send a message to content script (in isolated world) to be processed
  #post(event: string, method: string, args: unknown[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const schema = neo3DapiProviderArgsSchemaByMethod[method as keyof typeof neo3DapiProviderArgsSchemaByMethod]
      if (schema) {
        const result = schema.safeParse(args)
        if (!result.success) {
          return reject(new DapiError(DapiErrorCode.INVALID, result.error.message))
        }
      }

      const id = crypto.randomUUID()
      window.postMessage(
        { id, method, args, event, type: EDapiMessageTypes.NEON_WALLET_INJECTED_REQUEST },
        window.location.origin
      )

      function handler(event: MessageEvent) {
        if (event.origin !== window.location.origin) return

        if (
          !event.data ||
          !('request' in event.data) ||
          !('type' in event.data) ||
          (!('response' in event.data) && !('error' in event.data))
        )
          return

        if (event.data.type !== EDapiMessageTypes.NEON_WALLET_INJECTED_RESULT || event.data.request?.id !== id) return

        window.removeEventListener('message', handler)

        if (event.data.error) {
          reject(
            new DapiError(event.data.error.code || DapiErrorCode.UNKNOWN, event.data.error.message || 'Unknown error')
          )
        } else {
          resolve(event.data.response)
        }
      }

      window.addEventListener('message', handler)
    })
  }

  async #init() {
    const accounts = await this.getAccounts()
    this.connected = accounts.length > 0

    const network = await this.#post('neo3:get-network', 'getNetwork', [])
    this.network = network
  }

  async authenticate(payload: AuthenticationChallengePayload): Promise<AuthenticationResponsePayload> {
    const response = await this.#post('neo3:authenticate', 'authenticate', [payload])
    this.connected = true
    this.network = response.network
    return response
  }

  getAccounts(): Promise<Account[]> {
    return this.#post('neo3:get-accounts', 'getAccounts', [])
  }

  pickAddress(prompt?: string): Promise<Address> {
    return this.#post('neo3:pick-address', 'pickAddress', [prompt])
  }

  getBalance(asset: UInt160, account: UInt160): Promise<Integer> {
    return this.#post('neo3:get-balance', 'getBalance', [asset, account])
  }

  send(asset: UInt160, from: UInt160, to: UInt160, amount: Integer, data?: Argument): Promise<UInt256> {
    return this.#post('neo3:send', 'send', [asset, from, to, amount, data])
  }

  call(invocation: InvocationArguments): Promise<InvocationResult> {
    return this.#post('neo3:call', 'call', [invocation])
  }

  invoke(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions
  ): Promise<UInt256> {
    return this.#post('neo3:invoke', 'invoke', [invocations, signers, attributes, options])
  }

  makeTransaction(
    invocations: InvocationArguments[],
    signers?: Signer[],
    attributes?: TransactionAttribute[],
    options?: TransactionOptions
  ): Promise<ContractParametersContext> {
    return this.#post('neo3:make-transaction', 'makeTransaction', [invocations, signers, attributes, options])
  }

  sign(context: ContractParametersContext): Promise<ContractParametersContext> {
    return this.#post('neo3:sign', 'sign', [context])
  }

  signMessage(message: string | Base64Encoded, account?: UInt160, options?: SignOptions): Promise<SignedMessage> {
    return this.#post('neo3:sign-message', 'signMessage', [message, account, options])
  }

  relay(context: ContractParametersContext): Promise<UInt256> {
    return this.#post('neo3:relay', 'relay', [context])
  }

  getBlock(index: unknown): Promise<Block> {
    return this.#post('neo3:get-block', 'getBlock', [index])
  }

  getBlockCount(): Promise<number> {
    return this.#post('neo3:get-block-count', 'getBlockCount', [])
  }

  getTransaction(txid: UInt256): Promise<Transaction> {
    return this.#post('neo3:get-transaction', 'getTransaction', [txid])
  }

  getApplicationLog(txid: UInt256): Promise<ApplicationLog> {
    return this.#post('neo3:get-application-log', 'getApplicationLog', [txid])
  }

  getStorage(hash: UInt160, key: Base64Encoded): Promise<Base64Encoded> {
    return this.#post('neo3:get-storage', 'getStorage', [hash, key])
  }

  getTokenInfo(hash: UInt160): Promise<Token> {
    return this.#post('neo3:get-token-info', 'getTokenInfo', [hash])
  }
}

console.log('[Neon Wallet] Neo3DapiProvider injected successfully')

const provider = new Neo3DapiProvider()

function dispatchReady() {
  window.dispatchEvent(new CustomEvent('Neo.DapiProvider.ready', { detail: Object.freeze({ provider }) }))
}

window.addEventListener('Neo.DapiProvider.request', dispatchReady)

dispatchReady()
