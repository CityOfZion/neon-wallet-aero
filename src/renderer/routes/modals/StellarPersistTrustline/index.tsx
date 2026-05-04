import { BSBigNumber, BSBigNumberHelper, type TBSToken } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { SearchableTokenSelect } from '@renderer/components/SearchableTokenSelect'

import { useActions } from '@renderer/hooks/useActions'
import { useDebounceFunction } from '@renderer/hooks/useDebounceFunction'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useLazyStellarGetTrustlineTokens, usePersistTrustlineMutation } from '@renderer/hooks/useStellarTrustline'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  token: TBSToken | undefined
  limit: string
  isLimitFormatting: boolean
}

const StellarPersistTrustlines = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'stellarPersistTrustlines' })
  const { stellarAccount, token, limit } = useModalState<TModalState<'stellar-persist-trustline'>>()
  const { modalErase } = useModalNavigate()
  const debounce = useDebounceFunction()

  const { getTrustlineTokens } = useLazyStellarGetTrustlineTokens()
  const trustlineMutation = usePersistTrustlineMutation()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TActionsData>({
    token,
    limit: limit || '',
    isLimitFormatting: false,
  })

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = event.target.value

    setData({ limit, isLimitFormatting: true })

    debounce(() => {
      setData({
        limit: BSBigNumberHelper.format(limit, { decimals: actionData.token?.decimals }),
        isLimitFormatting: false,
      })
    })
  }

  const handleSubmit = async () => {
    if (!actionData.token) return

    if (actionData.limit) {
      const limitBn = new BSBigNumber(actionData.limit)
      if (limit && limitBn.isLessThanOrEqualTo(limit)) {
        setError('limit', t('errors.invalidLimit'))
        return
      }
    }

    await trustlineMutation.mutateAsync({ stellarAccount, token: actionData.token, limit: actionData.limit })

    modalErase('bottom')
  }

  return (
    <BottomModalLayout heading={t('title')} contentClassName="flex flex-col text-gray-100">
      <form className="flex grow flex-col justify-between gap-5" onSubmit={handleAct(handleSubmit)}>
        <div className="w-full">
          <span className="mb-2 block text-xs font-bold text-gray-100 uppercase" id="token">
            {t('tokenLabel')}
          </span>

          <SearchableTokenSelect.Root
            value={actionData.token}
            onValueChange={token => setData({ token })}
            onSearch={getTrustlineTokens}
          >
            <SearchableTokenSelect.Trigger
              aria-labelledby="token"
              className="w-full"
              disabled={!!token || actionState.isActing}
            >
              <SearchableTokenSelect.Value />
            </SearchableTokenSelect.Trigger>

            <SearchableTokenSelect.Content>
              <SearchableTokenSelect.Input />

              <SearchableTokenSelect.List />
            </SearchableTokenSelect.Content>
          </SearchableTokenSelect.Root>
        </div>

        <Input
          label={t('limitLabel')}
          placeholder={t('limitPlaceholder')}
          type="text"
          id="limit"
          inputMode="decimal"
          name="limit"
          compacted
          contentClassName="bg-asphalt"
          disabled={!actionData.token || actionState.isActing}
          value={actionData.limit}
          onChange={handleLimitChange}
          errorMessage={actionState.errors.limit}
          loading={actionData.isLimitFormatting}
        />

        <Button type="submit" className="mt-auto" label={t('saveButtonLabel')} loading={actionState.isActing} flat />
      </form>
    </BottomModalLayout>
  )
}

export default StellarPersistTrustlines
