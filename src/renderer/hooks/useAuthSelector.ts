import { useAppSelector } from './useRedux'

export const useLoginSessionSelector = () => {
  const { value, ref } = useAppSelector(state => state.auth.memoryData.loginSession)

  return {
    loginSession: value,
    loginSessionRef: ref,
  }
}
