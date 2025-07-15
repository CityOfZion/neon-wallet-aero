import { useAppSelector } from './useRedux'

export const useLoginSessionSelector = () => {
  const { ref, value } = useAppSelector(state => state.auth.inMemoryData.loginSession)
  return {
    loginSession: value,
    loginSessionRef: ref,
  }
}

export const useCurrentLoginSessionSelector = () => {
  const { ref, value } = useAppSelector(state => state.auth.inMemoryData.loginSession)
  return {
    currentLoginSession: value,
    currentLoginSessionRef: ref,
  }
}
