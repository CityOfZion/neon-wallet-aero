import { LOGIN_CONTROL_VALUE } from '@/constants/password'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { WorkerHelper } from '@/helpers/WorkerHelper'
import { useAppDispatch } from '@/hooks/useRedux'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { utilityReducerActions } from '@/store/reducers/UtilityReducer'
import { TLoginSession } from '@/types/store'
import { TWorkerSaveLoginSessionMessage } from '@/types/worker-events'

export const useNewPassword = () => {
  const dispatch = useAppDispatch()

  const setNewPassword = async (password: string) => {
    const encryptedPassword = await EncryptionHelper.encryptedPassword(password)
    const encryptedLoginControl = await EncryptionHelper.encrypt(LOGIN_CONTROL_VALUE, encryptedPassword)

    const loginSession: TLoginSession = {
      type: 'password',
      encryptedPassword,
    }

    await WorkerHelper.send<TWorkerSaveLoginSessionMessage>({
      type: 'save-login-session',
      payload: { loginSession },
    })

    dispatch(utilityReducerActions.setEncryptedLoginControl(encryptedLoginControl))
    dispatch(authReducerActions.setLoginSession(loginSession))
  }

  return { setNewPassword }
}
