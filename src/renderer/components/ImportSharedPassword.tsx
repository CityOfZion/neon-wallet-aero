import { AlertErrorBanner } from '@renderer/components/AlertErrorBanner'
import { Input } from '@renderer/components/Input'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useActions } from '@renderer/hooks/useActions'

type TProps = {
  inputLabel: string
  inputPlaceholder: string
  error: string
  onSubmit: (password: string) => Promise<void>
}

type TActionsData = {
  password: string
}

export const ImportSharedPassword = ({ inputLabel, inputPlaceholder, error, onSubmit }: TProps) => {
  const { actionData, actionState, setDataFromEventWrapper, setError, handleAct, clearErrors } =
    useActions<TActionsData>({
      password: '',
    })

  const handleSubmit = async (data: TActionsData) => {
    await UtilsHelper.sleep(100)

    try {
      await onSubmit(data.password)
      clearErrors('password')
    } catch {
      setError('password', error)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-1 px-2 py-4">
      <Input
        name="shared-password"
        id="shared-password"
        label={inputLabel}
        placeholder={inputPlaceholder}
        type="password"
        value={actionData.password}
        onChange={setDataFromEventWrapper('password')}
        onBlur={handleAct(handleSubmit)}
        error={!!actionState.errors.password}
        loading={actionState.isActing}
        compacted
        readOnly={actionState.hasActed && actionState.isValid}
      />

      {!!actionState.errors.password && <AlertErrorBanner message={actionState.errors.password} className="mt-2" />}
    </div>
  )
}
