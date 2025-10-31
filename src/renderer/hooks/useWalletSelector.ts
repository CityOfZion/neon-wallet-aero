import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { IWalletState } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectWallets = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

    return applicationDataByLoginType[loginSession.type].wallets.map(wallet => ({
      ...wallet,
      accounts: AccountHelper.orderAccounts(wallet.accounts),
    }))
  }
)

export const useWalletsSelector = () => {
  const { ref, value } = useAppSelector(selectWallets)

  return {
    wallets: value,
    walletsRef: ref,
  }
}

const selectWalletsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

      return applicationDataByLoginType[loginSession.type].wallets.filter(wallet =>
        wallet.accounts.some(account => blockchains.includes(account.blockchain))
      )
    }
  )

export const useWalletsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: walletsByBlockchains, ref: walletsByBlockchainsRef } = useAppSelector(
    selectWalletsByBlockchains(blockchains)
  )

  return { walletsByBlockchains, walletsByBlockchainsRef }
}
