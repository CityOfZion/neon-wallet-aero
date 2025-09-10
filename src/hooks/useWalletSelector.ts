import { createAppSelector, useAppSelector } from './useRedux'

const selectWallets = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    return applicationDataByLoginType[loginSession?.type ?? 'password'].wallets
  }
)

const selectWalletById = (id: string) =>
  createAppSelector(
    [({ auth }) => auth.data.applicationDataByLoginType, ({ auth }) => auth.inMemoryData.loginSession],
    (applicationDataByLoginType, loginSession) =>
      applicationDataByLoginType[loginSession?.type ?? 'password'].wallets.find(wallet => wallet.id === id)
  )

export const useWalletsSelector = () => {
  const { ref, value } = useAppSelector(selectWallets)

  return {
    wallets: value,
    walletsRef: ref,
  }
}

export const useWalletByIdSelector = (id: string) => {
  const { value, ref } = useAppSelector(selectWalletById(id))
  return { wallet: value, walletRef: ref }
}
