import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Location, useLocation, useNavigate } from 'react-router-dom'
import { Progress } from '@renderer/components/Progress'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'
import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useMountUnsafe } from '@renderer/hooks/useMountUnsafe'
import { useNewPassword } from '@renderer/hooks/useNewPassword'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { utilityReducerActions } from '@renderer/store/reducers/UtilityReducer'
import { TCreateWalletAndAccountParam } from '@shared/types/blockchain'
import { TContactState, TMigrationsNeo3, TSwapRecord } from '@shared/types/store'

import NeonWalletIcon from '@renderer/assets/images/neon-wallet-icon.svg?react'

type TLocationState = {
  wallets: TCreateWalletAndAccountParam[]
  swapRecords?: TSwapRecord[]
  migrationsNeo3?: TMigrationsNeo3
  contacts?: TContactState[]
  password: string
}

export const OnboardingImportWalletStep4 = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step4' })
  const { state } = useLocation() as Location<TLocationState>
  const navigate = useNavigate()
  const { createWallet, importAccounts, saveContacts } = useBlockchainActions()
  const { setNewPassword } = useNewPassword()
  const dispatch = useAppDispatch()

  const [progress, setProgress] = useState(0)

  const isImporting = useRef(false)

  const handleImport = async () => {
    if (isImporting.current) return
    isImporting.current = true

    try {
      const { wallets, contacts, password, swapRecords, migrationsNeo3 } = state
      const progressByStep = 100 / (wallets.length + 3)

      await setNewPassword(password)

      setProgress(progress => progress + progressByStep)

      if (swapRecords) swapRecords.forEach(swapRecord => dispatch(utilityReducerActions.persistSwapRecord(swapRecord)))
      if (migrationsNeo3) dispatch(utilityReducerActions.mergeMigrationsNeo3(migrationsNeo3))
      if (contacts) saveContacts(contacts)

      await UtilsHelper.sleep(250)

      setProgress(progress => progress + progressByStep)

      for (const { name, mnemonic, type, id, accounts } of wallets) {
        const wallet = await createWallet({ name, mnemonic, type, id })

        await importAccounts({ accounts, wallet })

        await UtilsHelper.sleep(250)

        setProgress(progress => progress + progressByStep)
      }

      await UtilsHelper.sleep(250)

      setProgress(progress => progress + progressByStep)

      await UtilsHelper.sleep(250)

      navigate('/onboarding-import-wallet/5', {
        state: { password: state.password },
      })
    } catch (error: any) {
      ToastHelper.error({ message: error.message })
      navigate(-1)
    } finally {
      isImporting.current = false
    }
  }

  useMountUnsafe(() => handleImport())

  return (
    <Fragment>
      <p className="mt-15 text-sm text-white">{t('title')}</p>

      <Progress value={progress} className="mt-7" />

      <NeonWalletIcon
        aria-hidden={true}
        className="absolute -bottom-11 -left-11 h-[12.5rem] w-[13.75rem] fill-gray-700/30"
      />
    </Fragment>
  )
}
