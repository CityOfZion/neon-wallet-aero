import { BSKeychainHelper } from '@cityofzion/blockchain-service'
import type { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'

import { BlockchainServiceHelper } from '@renderer/helpers/BlockchainServiceHelper'

import { AppError } from '@shared/helpers/ErrorHelper'
import type { TUseImportActionInputType } from '@shared/types/hooks'

import { useAccountUtils } from './useAccountUtils'
import { useActions } from './useActions'

type TFormData = {
  text: string
  inputType?: TUseImportActionInputType
}

type TImportActionOptions = {
  verifyIfAddressAlreadyExists?: boolean
}

export const useImportActions = (
  submitByInputType: Partial<
    Record<TUseImportActionInputType, (value: string, inputType: TUseImportActionInputType) => Promise<void>>
  >,
  options: TImportActionOptions = {}
) => {
  const { verifyIfAddressAlreadyExists = true } = options
  const { t } = useTranslation('hooks', { keyPrefix: 'useImportActions' })
  const { doesAccountExist } = useAccountUtils()
  const { handleAct, setError, actionState, actionData, setData, clearErrors, reset } = useActions<TFormData>({
    text: '',
  })

  const validateMnemonic = (value: string) => {
    const isValid = BSKeychainHelper.isValidMnemonic(value)
    if (!isValid) throw new AppError(t('errors.mnemonicIncomplete'))
  }

  const isValidAddress = (address: string) =>
    Object.values(BlockchainServiceHelper.bsAggregator.blockchainServicesByName).some(service => {
      if (!service.validateAddress(address)) return false
      if (verifyIfAddressAlreadyExists && doesAccountExist({ address, blockchain: service.name })) return false

      return true
    })

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setData({ text: value, inputType: undefined })

    try {
      const checkFunctionsByInputType: Record<TUseImportActionInputType, (value: string) => boolean> = {
        key: BlockchainServiceHelper.bsAggregator.validateKeyAllBlockchains.bind(BlockchainServiceHelper.bsAggregator),
        mnemonic: BSKeychainHelper.isMnemonic,
        encrypted: BlockchainServiceHelper.bsAggregator.validateEncryptedAllBlockchains.bind(
          BlockchainServiceHelper.bsAggregator
        ),
        address: isValidAddress,
      }

      const functionsByInputType = Object.entries(checkFunctionsByInputType).find(([, checkFunc]) => {
        try {
          return checkFunc(value)
        } catch {
          return false
        }
      })

      if (!functionsByInputType) throw new AppError(t('errors.typeNotSupported'))
      const inputType = functionsByInputType[0] as TUseImportActionInputType

      setData({ inputType })

      const validationByInputType: Partial<Record<TUseImportActionInputType, (value: string) => void>> = {
        mnemonic: validateMnemonic,
      }
      const validateFunc = validationByInputType[inputType]
      validateFunc?.(value)

      clearErrors()
    } catch (error: any) {
      setError('text', AppError.wrap(error, t('errors.invalid')).message)
    }
  }

  const handleSubmit = async (data: TFormData) => {
    try {
      if (!data.text.length) {
        throw new AppError(t('errors.empty'))
      }

      if (!data.inputType) {
        throw new AppError(t('errors.invalid'))
      }

      const trimmedText = data.text.trim()
      const submit = submitByInputType[data.inputType]

      if (!submit) throw new AppError(t('errors.invalid'))

      await submit(trimmedText, data.inputType)
    } catch (error) {
      setError('text', AppError.wrap(error).message)
    }
  }

  return { actionData, actionState, handleAct, handleChange, handleSubmit, reset }
}
