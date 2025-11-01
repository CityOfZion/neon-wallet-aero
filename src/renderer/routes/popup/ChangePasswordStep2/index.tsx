import { cloneDeep } from 'lodash'
import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { DownloadQRCodePasswordButton } from '@renderer/components/DownloadQRCodePasswordButton'

import { EncryptionHelper } from '@renderer/helpers/EncryptionHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useAccountsSelector } from '@renderer/hooks/useAccountSelector'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'
import { useNewPassword } from '@renderer/hooks/useNewPassword'
import { usePressOnce } from '@renderer/hooks/usePressOnce'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import TbDownload from '@renderer/assets/images/tb-download.svg?react'
import TbQrCode from '@renderer/assets/images/tb-qrcode.svg?react'

import { authReducerActions } from '@renderer/store/reducers/auth'

type TLocationState = {
  newPassword: string
}

export const ChangePasswordStep2Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword.step2' })
  const { t: tHookUseLogin } = useTranslation('hooks', { keyPrefix: 'useLogin' })
  const { loginSessionRef } = useLoginSessionSelector()
  const { wallets } = useWalletsSelector()
  const { accounts } = useAccountsSelector()
  const { setNewPassword } = useNewPassword()
  const { encryptPassword } = useLogin()
  const dispatch = useAppDispatch()
  const {
    state: { newPassword },
  } = useLocation() as Location<TLocationState>
  const navigate = useNavigate()

  const [isDownloading, startDownload] = usePressOnce(async () => {
    try {
      const loginSession = loginSessionRef.current

      if (!loginSession) throw new Error(tHookUseLogin('controlIsNotSet'))

      const encryptedNewPassword = await encryptPassword(newPassword)

      const walletPromises = wallets.map(async wallet => {
        const clonedWallet = cloneDeep(wallet)

        const accountPromises = accounts
          .filter(({ idWallet }) => idWallet === clonedWallet.id)
          .map(async account => {
            const { encryptedKey } = account

            if (!encryptedKey) return account

            const key = await EncryptionHelper.decrypt(encryptedKey, loginSession.encryptedPassword)

            const newEncryptedKey = await EncryptionHelper.encrypt(key, encryptedNewPassword)

            return { ...account, encryptedKey: newEncryptedKey }
          })

        const newAccounts = await Promise.all(accountPromises)
        const encryptedMnemonic = clonedWallet.encryptedMnemonic

        if (encryptedMnemonic) {
          const mnemonic = await EncryptionHelper.decrypt(encryptedMnemonic, loginSession.encryptedPassword)

          clonedWallet.encryptedMnemonic = await EncryptionHelper.encrypt(mnemonic, encryptedNewPassword)
        }

        dispatch(authReducerActions.saveWallet({ ...clonedWallet, accounts: newAccounts }))
      })

      await Promise.all(walletPromises)

      await setNewPassword(newPassword)

      navigate('/settings/change-password/3')
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('error') })
    }
  })

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-5 pb-10">
      <div className="flex flex-col items-center gap-5 pt-9">
        <div className="flex items-center justify-center rounded-full">
          <TbQrCode aria-hidden className="text-blue h-20 w-20" />
        </div>
        <span className="max-w-[16.8rem] text-center text-[1.2rem]">{t('subtitle')}</span>
        <span className="text-center text-xs text-gray-100">{t('description')}</span>
      </div>

      <DownloadQRCodePasswordButton
        label={t('buttonDownload')}
        type="button"
        variant="card"
        className="w-full"
        password={newPassword}
        loading={isDownloading}
        rightIcon={<TbDownload aria-hidden />}
        onDownload={startDownload}
      />
    </div>
  )
}

export default ChangePasswordStep2Page
