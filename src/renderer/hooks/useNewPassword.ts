import { BackgroundHelper } from '@renderer/helpers/BackgroundHelper'
import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'

import { useAppDispatch } from '@renderer/hooks/useRedux'

import { authReducerActions } from '@renderer/store/reducers/auth'
import { utilityReducerActions } from '@renderer/store/reducers/utility'
import { LOGIN_CONTROL_VALUE } from '@shared/constants/password'
import type { TBackgroundSaveLoginSessionMessage } from '@shared/types/background-events'
import type { TLoginSession } from '@shared/types/store'

export const useNewPassword = () => {
  const dispatch = useAppDispatch()

  const setNewPassword = async (password: string) => {
    const encryptedPassword = await EncryptionHelper.encryptedPassword(password)
    const encryptedLoginControl = await EncryptionHelper.encrypt(LOGIN_CONTROL_VALUE, encryptedPassword)

    const loginSession: TLoginSession = {
      type: 'password',
      encryptedPassword,
    }

    await BackgroundHelper.send<TBackgroundSaveLoginSessionMessage>({
      type: 'save-login-session',
      payload: { loginSession },
    })

    dispatch(utilityReducerActions.setEncryptedLoginControl(encryptedLoginControl))
    dispatch(authReducerActions.setLoginSession(loginSession))
  }

  return { setNewPassword }
}
