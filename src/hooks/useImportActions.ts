import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { MnemonicHelper } from '@/helpers/MnemonicHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { bsAggregator } from '@/libs/blockchainService'

import { useAccountUtils } from './useAccountUtils'
import { useActions } from './useActions'

type TType = 'key' | 'mnemonic' | 'encryptedKey' | 'address'

type TActionsData = {
  value: string
  type?: TType
}

type TOptions = {
  submitByType: Record<TType, (value: string) => Promise<void>>
  verifyIfAddressAlreadyExists?: boolean
}

export const useImportActions = ({ submitByType, verifyIfAddressAlreadyExists = true }: TOptions) => {
  const { t } = useTranslation('hooks', { keyPrefix: 'useImportActions' })
  const { doesAccountExist } = useAccountUtils()

  const { actionData, actionState, setData, setError, clearErrors, handleAct } = useActions<TActionsData>({
    value: '',
  })

  const isValidAddress = (address: string) =>
    Object.values(bsAggregator.blockchainServicesByName).some(service => {
      if (!service.validateAddress(address)) return false
      if (verifyIfAddressAlreadyExists && doesAccountExist({ address, blockchain: service.name })) return false

      return true
    })

  const validateMnemonic = (value: string) => {
    const isValid = MnemonicHelper.isValidMnemonic(value)

    if (!isValid) throw new Error(t('errors.invalidMnemonic'))
  }

  const handleChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    const value = StringHelper.removeSpecialCharacters(target.value)

    setData({ value, type: undefined })

    try {
      const checkFunctionsByInputType: Record<TType, (value: string) => boolean> = {
        address: isValidAddress,
        key: bsAggregator.validateKeyAllBlockchains.bind(bsAggregator),
        encryptedKey: bsAggregator.validateEncryptedAllBlockchains.bind(bsAggregator),
        mnemonic: MnemonicHelper.isMnemonic,
      }

      const functionsByType = Object.entries(checkFunctionsByInputType).find(([, checkFunction]) => {
        try {
          return checkFunction(value)
        } catch {
          return false
        }
      })

      if (!functionsByType) throw new Error()

      const type = functionsByType[0] as TType

      setData({ type })

      const validationsByType: Partial<Record<TType, (value: string) => void>> = { mnemonic: validateMnemonic }
      const validate = validationsByType[type]

      validate?.(value)

      clearErrors()
    } catch (error: any) {
      setError('value', error.message || t('errors.invalid'))
    }
  }

  const handleSubmit = async ({ value, type }: TActionsData) => {
    try {
      if (!value.length) throw new Error(t('errors.empty'))
      if (!type) throw new Error(t('errors.invalid'))

      const fixedValue = StringHelper.removeSpecialCharacters(value, { trimText: true })

      const submit = submitByType[type]

      if (!submit) throw new Error(t('errors.invalid'))

      await submit(fixedValue)
    } catch (error: any) {
      setError('value', error.message)
    }
  }

  return { actionData, actionState, handleAct, handleChange, handleSubmit }
}
