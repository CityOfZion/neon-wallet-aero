import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { EncryptionHelper } from '@/helpers/EncryptionHelper'
import { useBeforeLogin } from '@/hooks/useBeforeLogin'
import { useAppDispatch } from '@/hooks/useRedux'
import { authReducerActions } from '@/store/reducers/AuthReducer'

// It should be a different component because the contexts are in the parent component
export const Child = () => {
  useBeforeLogin()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function handle() {
      // TODO: Change it when we have a login page
      const encryptedPassword = await EncryptionHelper.encryptedPassword('password')
      dispatch(authReducerActions.setLoginSession({ encryptedPassword, type: 'password' }))

      navigate('/app/wallets')
    }

    handle()
  }, [dispatch, navigate])

  return <Outlet />
}
