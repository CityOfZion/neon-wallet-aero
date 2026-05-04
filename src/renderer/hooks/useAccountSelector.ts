import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TAccount, TAccountWithWallet } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

export const selectAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccount>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet => wallet.accounts)

    return SelectorHelper.fallbackToEmptyArray(AccountHelper.orderAccounts(accounts))
  }
)

const selectAccountsWithWallet = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccountWithWallet>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap<TAccountWithWallet>(wallet =>
      wallet.accounts.map(account => ({ ...account, wallet }))
    )

    return SelectorHelper.fallbackToEmptyArray(AccountHelper.orderAccounts(accounts))
  }
)

const selectAccountsByWalletId = (walletId: string) =>
  createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccount>()

      const accounts =
        applicationDataByLoginType[loginSession.type].wallets.find(({ id }) => id === walletId)?.accounts || []

      return SelectorHelper.fallbackToEmptyArray(AccountHelper.orderAccounts(accounts))
    }
  )

const selectAccountsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.memoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccount>()

      return SelectorHelper.fallbackToEmptyArray(
        applicationDataByLoginType[loginSession.type].wallets
          .flatMap(wallet => wallet.accounts)
          .filter(account => blockchains.some(blockchain => blockchain === account.blockchain))
      )
    }
  )

const selectHasHardwareAccount = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return false

    return applicationDataByLoginType[loginSession.type].wallets.some(wallet =>
      wallet.accounts.some(account => account.type === 'hardware')
    )
  }
)

const selectHardwareAccounts = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.memoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<TAccount>()

    const accounts = applicationDataByLoginType[loginSession.type].wallets.flatMap(wallet => wallet.accounts)
    const hardwareAccounts = accounts.filter(account => account.type === 'hardware')

    return SelectorHelper.fallbackToEmptyArray(AccountHelper.orderAccounts(hardwareAccounts))
  }
)

const selectOwnAccounts = createAppSelector(
  [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.memoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession) return SelectorHelper.fallbackToEmptyArray<TAccount>()

    const { wallets } = applicationDataByLoginType[loginSession.type]
    const accounts: TAccount[] = []

    wallets
      .flatMap(wallet => wallet.accounts)
      .forEach(account => {
        const wallet = wallets.find(wallet => wallet.id === account.idWallet)

        if (account.type === 'watch' && (!wallet || wallet.type !== 'hardware')) return

        accounts.push(account)
      })

    return SelectorHelper.fallbackToEmptyArray(AccountHelper.orderAccounts(accounts))
  }
)

const selectAccountsWithWalletMap = createAppSelector([selectAccountsWithWallet], accountsWithWallet => {
  const map = new Map<string, TAccountWithWallet>()
  accountsWithWallet.forEach(account => {
    map.set(AccountHelper.buildAccountKey(account), account)
  })
  return map
})

const selectAccountsMap = createAppSelector([selectAccounts], accounts => {
  const map = new Map<string, TAccount>()
  accounts.forEach(account => {
    map.set(AccountHelper.buildAccountKey(account), account)
  })
  return map
})

export const useAccountsSelector = () => {
  const { value, ref } = useAppSelector(selectAccounts)

  return {
    accounts: value,
    accountsRef: ref,
  }
}

export const useAccountsWithWalletSelector = () => {
  const { value, ref } = useAppSelector(selectAccountsWithWallet)

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

export const useAccountsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: accountsByBlockchains, ref: accountsByBlockchainsRef } = useAppSelector(
    selectAccountsByBlockchains(blockchains)
  )

  return { accountsByBlockchains, accountsByBlockchainsRef }
}

export const useAccountsMapSelector = () => {
  const { value, ref } = useAppSelector(selectAccountsMap)
  return { accountsMap: value, accountsMapRef: ref }
}

export const useAccountsWithWalletMapSelector = () => {
  const { value, ref } = useAppSelector(selectAccountsWithWalletMap)
  return { accountsWithWalletMap: value, accountsWithWalletMapRef: ref }
}

export const useHardwareAccountsSelector = () => {
  const { value, ref } = useAppSelector(selectHardwareAccounts)

  return {
    hardwareAccounts: value,
    hardwareAccountsRef: ref,
  }
}

export const useHasHardwareAccountSelector = () => {
  const { value, ref } = useAppSelector(selectHasHardwareAccount)

  return {
    hasHardwareAccount: value,
    hasHardwareAccountRef: ref,
  }
}

export const useOwnAccountsSelector = () => {
  const { value: ownAccounts, ref: ownAccountsRef } = useAppSelector(selectOwnAccounts)

  return { ownAccounts, ownAccountsRef }
}
