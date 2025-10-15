import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

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
