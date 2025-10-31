import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { IAccountState, TAccountWithWallet } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet => wallet.accounts)

    return AccountHelper.orderAccounts(accounts)
  }
)

const selectAccountsWithWallet = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccountWithWallet>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet =>
      wallet.accounts.map(account => ({ ...account, wallet }))
    )

    return AccountHelper.orderAccounts<TAccountWithWallet>(accounts)
  }
)

const selectAccountsByWalletId = (walletId: string) =>
  createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

      const wallet = applicationDataByLoginType[loginSession.type].wallets.find(wallet => wallet.id === walletId)

      return AccountHelper.orderAccounts(SelectorHelper.fallbackToEmptyArray<IAccountState>(wallet?.accounts))
    }
  )

export const useAccountsSelector = () => {
  const { ref, value } = useAppSelector(selectAccounts)

  return {
    accounts: value,
    accountsRef: ref,
  }
}

export const useAccountsWithWalletSelector = () => {
  const { ref, value } = useAppSelector(selectAccountsWithWallet)

  return {
    accountsWithWallet: value,
    accountsWithWalletRef: ref,
  }
}

export const useAccountsByWalletIdSelector = (walletId: string) => {
  const { value, ref } = useAppSelector(selectAccountsByWalletId(walletId))

  return {
    accountsByWalletId: value,
    accountsByWalletIdRef: ref,
  }
}

const selectAccountsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IAccountState>()

      return applicationDataByLoginType[loginSession.type].wallets
        .flatMap(wallet => wallet.accounts)
        .filter(account => blockchains.some(blockchain => blockchain === account.blockchain))
    }
  )

export const useAccountsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: accountsByBlockchains, ref: accountsByBlockchainsRef } = useAppSelector(
    selectAccountsByBlockchains(blockchains)
  )

  return { accountsByBlockchains, accountsByBlockchainsRef }
}
