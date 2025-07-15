import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertErrorBanner } from '@/components/AlertErrorBanner'
import { Input } from '@/components/Input'
import { UtilsHelper } from '@/helpers/UtilsHelper'
import { useActions } from '@/hooks/useActions'
import { TUseNeonMigrateAccountsSchema } from '@/hooks/useNeonMigrate'

import MdCheck from '@/assets/images/md-check.svg?react'
import MdChevronRight from '@/assets/images/md-chevron-right.svg?react'
import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg?react'

type TProps = {
  accountToMigrate: TUseNeonMigrateAccountsSchema
  onSubmit: (accountToMigrate: TUseNeonMigrateAccountsSchema, password: string) => Promise<void>
}

type TActionData = {
  password: string
}

export const MigrateAccountsPassword = ({ accountToMigrate, onSubmit }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step4' })

  const { actionData, actionState, setDataFromEventWrapper, setError, handleAct, clearErrors } =
    useActions<TActionData>({
      password: '',
    })

  const handleSubmit = async (data: TActionData) => {
    await UtilsHelper.sleep(100)
    try {
      await onSubmit(accountToMigrate, data.password)
      clearErrors('password')
    } catch {
      setError('password', t('passwordError'))
    }
  }

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-2.5 py-4">
      <div className="flex h-full w-6 items-start">
        <MdChevronRight aria-hidden={true} className="text-blue h-6 w-full" />
      </div>

      <div className="flex min-w-0 flex-grow flex-col gap-1">
        <p className="text-sm text-white">{accountToMigrate.label}</p>
        <p className="truncate text-xs text-gray-300">{accountToMigrate.address}</p>

        <Input
          label={t('inputLabel')}
          containerClassName="mt-1.5"
          placeholder={t('inputPlaceholder')}
          type="password"
          value={actionData.password}
          onChange={setDataFromEventWrapper('password')}
          onBlur={handleAct(handleSubmit)}
          error={!!actionState.errors.password}
          loading={actionState.isActing}
          compacted
          readOnly={actionState.hasActed && actionState.isValid}
        />
        {!!actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} className="mt-2.5" />}
      </div>

      <div className="flex h-full w-6 items-start">
        {actionState.hasActed && (
          <Fragment>
            {actionState.isValid ? (
              <MdCheck aria-hidden={true} className="text-green h-6 w-6" />
            ) : (
              <TbAlertTriangle aria-hidden={true} className="text-pink h-6 w-6" />
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}
