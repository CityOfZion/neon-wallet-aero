import { useAppSelector } from './useRedux'

export const useLoginSessionSelector = () => {
  const { ref, value } = useAppSelector(state => state.auth.inMemoryData.loginSession)

  return {
    loginSession: value,
    loginSessionRef: ref,
  }
}
