import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'
import { Input } from '@renderer/components/Input'
import { Separator } from '@renderer/components/Separator'
import { Tooltip } from '@renderer/components/Tooltip'

import { StringHelper } from '@renderer/helpers/StringHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'

import { useActions } from '@renderer/hooks/useActions'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useModalNavigate, useModalState } from '@renderer/hooks/useModalRouter'
import { useWalletByIdSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import TbTrash from '@renderer/assets/images/tb-trash.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import type { TModalState } from '@shared/types/modal'

type TActionsData = {
  accountName: string
}

export const AccountEditModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'accountEdit' })
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'general' })
  const { account } = useModalState<TModalState<'account-edit'>>()
  const { wallet } = useWalletByIdSelector(account.idWallet)
  const { modalNavigateWrapper, modalNavigate } = useModalNavigate()
  const { editAccount } = useBlockchainActions()

  const { actionData, actionState, setData, setError, handleAct } = useActions<TActionsData>({
    accountName: account.name,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const accountName = event.target.value
    setData({ accountName })

    if (accountName.trim().length === 0) {
      setError('accountName', t('errors.accountNameEmpty'))
    }
  }

  const handleSubmit = async () => {
    if (account) {
      await editAccount({ account, data: { name: actionData.accountName.trim() } })

      ToastHelper.success({ message: t('messages.accountNameUpdated') })

      modalNavigate(-2)
    }
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" aria-hidden />
        <p className="text-blue truncate text-sm">{wallet?.name}</p>
      </div>

      <form className="mt-6 flex flex-1 flex-col gap-y-4 px-4" onSubmit={handleAct(handleSubmit)}>
        <Input
          contentClassName="bg-asphalt"
          maxLength={20}
          value={actionData.accountName}
          errorMessage={actionState.errors.accountName}
          autoFocus
          label={t('accountNameLabel')}
          onChange={handleChange}
          clearable
        />

        <div className="flex flex-col gap-y-2">
          <p className="text-xs font-bold text-gray-100 uppercase">{t('accountAddressLabel')}</p>

          <Tooltip
            title={account.address}
            contentProps={{ className: 'bg-asphalt' }}
            arrowProps={{ className: 'fill-asphalt' }}
            delayDuration={200}
          >
            <p className="inline-block w-fit text-base break-all">{StringHelper.truncateMiddle(account.address, 36)}</p>
          </Tooltip>
        </div>

        <div className="mt-auto mb-6 flex w-full items-center gap-3">
          <Button label={tCommon('cancel')} variant="card" colorSchema="gray" onClick={modalNavigateWrapper(-1)} />

          <Button
            label={tCommon('save')}
            variant="card"
            colorSchema="neon"
            type="submit"
            leftIcon={<MdCheck aria-hidden />}
            iconsOnEdge={false}
            className="w-full"
            disabled={!actionState.isValid}
          />
        </div>
      </form>

      <Separator className="mt-auto mb-2" />

      <div className="flex flex-col gap-y-4 px-4">
        <p className="mt-2 text-xs font-bold text-gray-300 uppercase">{t('deleteAccountLabel')}</p>
        <p className="text-sm">{t('deleteAccountDescription')}</p>

        <Button
          label={t('deleteAccountButtonLabel')}
          variant="outlined"
          colorSchema="error"
          leftIcon={<TbTrash aria-hidden />}
          iconsOnEdge={false}
          onClick={modalNavigateWrapper('account-deletion', {
            state: {
              account,
              wallet: wallet!,
            },
          })}
        />
      </div>
    </BottomModalLayout>
  )
}

export default AccountEditModal
