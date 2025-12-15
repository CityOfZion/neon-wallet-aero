import { useRef } from 'react'

import { useSelector } from 'react-redux'

import { AccountHelper } from '@renderer/helpers/AccountHelper'
import { SelectorHelper } from '@renderer/helpers/SelectorHelper'

import type { TBlockchainServiceKey } from '@shared/types/blockchain'
import type { TRootState } from '@shared/types/redux'
import type { IWalletState } from '@shared/types/store'

import { createAppSelector, useAppSelector } from './useRedux'

const normalizeWallet = (wallet: IWalletState) => ({
  ...wallet,
  accounts: AccountHelper.orderAccounts(wallet.accounts),
})

const selectWallets = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

    const wallets = applicationDataByLoginType[loginSession.type].wallets

    if (wallets.length === 0) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

    return wallets.map(normalizeWallet)
  }
)

export const selectWalletById = (walletId: string) =>
  createAppSelector(
    [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return undefined

      const wallet = applicationDataByLoginType[loginSession.type].wallets.find(wallet => wallet.id === walletId)

      if (!wallet) return undefined

      return normalizeWallet(wallet)
    }
  )

const selectWalletsByBlockchains = (blockchains: TBlockchainServiceKey[]) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) => {
      if (!loginSession?.type) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

      const wallets = applicationDataByLoginType[loginSession.type].wallets.filter(wallet =>
        wallet.accounts.some(account => blockchains.includes(account.blockchain))
      )

      if (wallets.length === 0) return SelectorHelper.fallbackToEmptyArray<IWalletState>()

      return wallets.map(normalizeWallet)
    }
  )

export const useWalletsSelector = () => {
  const { ref, value } = useAppSelector(selectWallets)

  return {
    wallets: value,
    walletsRef: ref,
  }
}

export const useWalletByIdSelector = (walletId: string) => {
  const { value, ref } = useAppSelector(selectWalletById(walletId))

  return {
    wallet: value,
    walletRef: ref,
  }
}

export const useWalletsByBlockchainsSelector = (blockchains: TBlockchainServiceKey[]) => {
  const { value: walletsByBlockchains, ref: walletsByBlockchainsRef } = useAppSelector(
    selectWalletsByBlockchains(blockchains)
  )

  return { walletsByBlockchains, walletsByBlockchainsRef }
}

export const useWalletsMapSelector = () => {
  const walletsMapRef = useRef<Map<string, IWalletState>>(new Map())

  useSelector((state: TRootState) => {
    const wallets = selectWallets(state)

    walletsMapRef.current.clear()

    wallets.forEach(wallet => {
      walletsMapRef.current.set(wallet.id, wallet)
    })
  })

  return { walletsMapRef }
}
