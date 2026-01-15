import { Fragment, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import type { Location } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

import { Progress } from '@renderer/components/Progress'

import { AppError } from '@renderer/helpers/ErrorHelper'
import { ToastHelper } from '@renderer/helpers/ToastHelper'
import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { useBlockchainActions } from '@renderer/hooks/useBlockchainActions'
import { useSignup } from '@renderer/hooks/useLogin'
import { useMountUnsafe } from '@renderer/hooks/useMount'
import { useAppDispatch } from '@renderer/hooks/useRedux'

import NeonWalletIcon from '@renderer/assets/images/neon-wallet-icon.svg?react'

import { utilityReducerActions } from '@renderer/store/reducers/utility'
import type { TCreateWalletAndAccountParam } from '@shared/types/blockchain'
import type { TContactState, TSwapRecord } from '@shared/types/store'

type TLocationState = {
  wallets: TCreateWalletAndAccountParam[]
  swapRecords?: TSwapRecord[]
  contacts?: TContactState[]
  password: string
}

export const OnboardingImportWalletStep4Page = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'onboardingImportWallet.step4' })
  const { state } = useLocation() as Location<TLocationState>
  const navigate = useNavigate()
  const { createWallet, importAccounts, saveContacts } = useBlockchainActions()
  const { signup } = useSignup()
  const dispatch = useAppDispatch()

  const [progress, setProgress] = useState(0)

  const isImporting = useRef(false)

  const handleImport = async () => {
    if (isImporting.current) return
    isImporting.current = true

    try {
      const { wallets, contacts, password, swapRecords } = state
      const progressByStep = 100 / (wallets.length + 3)

      await signup(password)

      setProgress(progress => progress + progressByStep)

      if (swapRecords) swapRecords.forEach(swapRecord => dispatch(utilityReducerActions.persistSwapRecord(swapRecord)))
      if (contacts) saveContacts(contacts)

      await UtilsHelper.sleep(250)

      setProgress(progress => progress + progressByStep)

      for (const { accounts, ...newWallet } of wallets) {
        const wallet = await createWallet(newWallet)

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
    } catch (error) {
      ToastHelper.error({ message: AppError.wrap(error).message })
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

      <NeonWalletIcon aria-hidden className="absolute -bottom-11 -left-11 h-[12.5rem] w-[13.75rem] fill-gray-700/30" />
    </Fragment>
  )
}

export default OnboardingImportWalletStep4Page
