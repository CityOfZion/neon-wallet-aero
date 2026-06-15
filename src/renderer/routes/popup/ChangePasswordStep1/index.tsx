import { useState } from 'react'

import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { PasswordStrength } from '@renderer/components/PasswordStrength'
import { Separator } from '@renderer/components/Separator'

import { PasswordHelper } from '@renderer/helpers/PasswordHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useLoginSessionSelector } from '@renderer/hooks/useAuthSelector'
import { useLogin } from '@renderer/hooks/useLogin'

import TbArrowLeft from '@renderer/assets/images/tb-arrow-left.svg?react'

type TFormData = {
  newPassword: string
  currentPassword: string
}

export const ChangePasswordStep1Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'changePassword.step1' })
  const navigate = useNavigate()
  const { loginSessionRef } = useLoginSessionSelector()
  const { encryptPassword } = useLogin()
  const [isPasswordValid, setIsPasswordValid] = useState(false)

  const { handleAct, actionState, actionData, setData, setDataFromEventWrapper, setError } = useActions<TFormData>({
    newPassword: '',
    currentPassword: '',
  })

  const handleSubmit = async (data: TFormData) => {
    const encryptedCurrentPassword = await encryptPassword(data.currentPassword)

    if (loginSessionRef.current?.encryptedPassword !== encryptedCurrentPassword) {
      setError('currentPassword', t('error'))
      return
    }

    navigate('/settings/change-password/2', { state: { newPassword: data.newPassword }, replace: true })
  }

  const handlePassword = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setData({ newPassword: value })

    setIsPasswordValid(PasswordHelper.isWeakPassword(value))
  }

  return (
    <div className="flex size-full flex-col items-center">
      <form className="flex h-full grow flex-col items-center" onSubmit={handleAct(handleSubmit)}>
        <span className="mb-6 text-sm">{t('subtitle')}</span>
        <div className="flex size-full flex-col justify-between">
          <div className="flex h-full flex-col">
            <span className="mb-2 text-xs font-bold text-gray-100 uppercase">{t('titleInput1')}</span>
            <div className="mb-5 flex flex-col items-center">
              <Input
                name="new-password"
                id="new-password"
                type="password"
                placeholder={t('inputNewPasswordPlaceholder')}
                onChange={handlePassword}
                value={actionData.newPassword}
                errorMessage={actionState.errors.newPassword}
                compacted
                containerClassName="bg-gray-800"
              />
              <PasswordStrength password={actionData.newPassword} />
            </div>
            <Separator />
            <div className="mt-5 mb-2 flex w-full">
              <span className="text-xs font-bold text-gray-100 uppercase">{t('titleInput2')}</span>
            </div>
            <div className="mb-5 flex flex-col items-center">
              <Input
                name="password"
                id="password"
                type="password"
                placeholder={t('inputCurrentPasswordPlaceholder')}
                onChange={setDataFromEventWrapper('currentPassword')}
                value={actionData.currentPassword}
                errorMessage={actionState.errors.currentPassword}
                compacted
                containerClassName="bg-gray-800"
              />
              <div className="mt-3 w-full">
                {actionState.errors.currentPassword && (
                  <AlertErrorBanner message={actionState.errors.currentPassword} />
                )}
              </div>
            </div>
          </div>
          <div className="mb-8 flex w-full justify-center">
            <Button
              clickableProps={{ className: 'w-full h-12' }}
              type="submit"
              label={t('buttonContinue')}
              loading={actionState.isActing}
              disabled={!isPasswordValid || !actionData.currentPassword}
              rightIcon={<TbArrowLeft aria-hidden className="rotate-180" />}
              iconsOnEdge={false}
              className="w-full"
              variant="card"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordStep1Page
