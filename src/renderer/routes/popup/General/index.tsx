import { useTranslation } from 'react-i18next'

import { Checkbox } from '@renderer/components/Checkbox'

import { useLoginSessionSelector, useShouldConfirmActionSelector } from '@renderer/hooks/useAuthSelector'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import { SettingsLayout } from '@renderer/layouts/Settings'

import { authReducerActions } from '@renderer/store/reducers/auth'

const SettingsGeneral = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'settings.general' })
  const { shouldConfirmAction } = useShouldConfirmActionSelector()
  const { loginSession } = useLoginSessionSelector()
  const dispatch = useAppDispatch()

  const isLoginSessionHardware = loginSession?.type === 'hardware'

  const handleIsShouldConfirmActionChange = (value: boolean) => {
    dispatch(authReducerActions.setShouldConfirmAction(value))
  }

  return (
    <SettingsLayout title={t('title')}>
      <div className="mt-2 ml-2 flex items-center gap-2">
        <Checkbox
          id="should-confirm-action"
          checked={shouldConfirmAction}
          onCheckedChange={handleIsShouldConfirmActionChange}
          disabled={isLoginSessionHardware}
        />
        <label htmlFor="should-confirm-action">
          {loginSession?.type === 'password'
            ? t('shouldConfirmActionPasswordCheckbox')
            : t('shouldConfirmActionKeyCheckbox')}
        </label>
      </div>
    </SettingsLayout>
  )
}

export default SettingsGeneral
