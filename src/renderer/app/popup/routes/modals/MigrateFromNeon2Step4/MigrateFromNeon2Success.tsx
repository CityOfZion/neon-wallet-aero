import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@renderer/components/Button'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { IAccountState } from '@shared/types/store'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import MdOutlineRemoveRedEye from '@renderer/assets/images/md-outline-remove-red-eye.svg?react'

type TProps = {
  accounts: IAccountState[]
}

export const MigrateFromNeon2Success = ({ accounts }: TProps) => {
  const { t } = useTranslation('modals', { keyPrefix: 'migrateWallets.step4.success' })
  const { modalErase } = useModalNavigate()
  const navigate = useNavigate()

  const handleView = () => {
    modalErase('bottom')
    navigate('/wallets')
  }

  return (
    <div className="mt-7 flex min-h-0 w-full flex-grow flex-col justify-between">
      <div className="flex min-h-0 w-full flex-col gap-1.5 overflow-auto">
        {accounts.map(account => (
          <div key={account.id} className="flex items-center rounded bg-gray-300/15 px-5 py-2">
            <div className="flex min-w-0 flex-grow flex-col gap-1">
              <p className="text-sm text-white">{account.name}</p>
              <p className="truncate text-xs text-gray-300">{account.address}</p>
            </div>

            <MdCheck aria-hidden className="text-green h-4.5 w-4.5" />
          </div>
        ))}
      </div>

      <Button
        label={t('viewButtonLabel')}
        iconsOnEdge={false}
        variant="card"
        leftIcon={<MdOutlineRemoveRedEye aria-hidden />}
        onClick={handleView}
      />
    </div>
  )
}
