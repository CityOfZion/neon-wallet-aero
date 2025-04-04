import { createAppSelector, useAppSelector } from './useRedux'

const selectWallets = createAppSelector(
  [state => state.auth.data.applicationDataByLoginType, state => state.auth.inMemoryData.loginSession],
  (applicationDataByLoginType, loginSession) => {
    return applicationDataByLoginType[loginSession?.type ?? 'password'].wallets
  }
)

export const useWalletsSelector = () => {
  const { ref, value } = useAppSelector(selectWallets)

  return {
    wallets: value,
    walletsRef: ref,
  }
}
