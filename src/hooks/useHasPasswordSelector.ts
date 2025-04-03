import { useDispatch } from 'react-redux'

import { LOGIN_CONTROL_VALUE } from '@/constants/password'
import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { authReducerActions } from '@/store/reducers/AuthReducer'
import { utilityReducerActions } from '@/store/reducers/UtilityReducer'

export const useNewPassword = () => {
  const dispatch = useDispatch()

  const setNewPassword = async (password: string) => {
    const encryptedPassword = await EncryptionHelper.encryptedPassword(password)
    const encryptedLoginControl = await EncryptionHelper.encrypt(LOGIN_CONTROL_VALUE, encryptedPassword)

    dispatch(utilityReducerActions.setHasPassword(true))
    dispatch(utilityReducerActions.setEncryptedLoginControl(encryptedLoginControl))
    dispatch(authReducerActions.setLoginSession({ type: 'password', encryptedPassword }))
  }

  return {
    setNewPassword,
  }
}
