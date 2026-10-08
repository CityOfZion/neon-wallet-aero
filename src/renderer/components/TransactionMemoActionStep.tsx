import { useEffect, useRef, useState } from 'react'

import type { IBSWithMemo } from '@cityofzion/blockchain-service'
import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useDebounceFunction } from '@renderer/hooks/useDebounceFunction'

import TbNotes from '@renderer/assets/images/tb-notes.svg?react'

import { ActionStep } from './ActionStep'
import { Input } from './Input'
import { Separator } from './Separator'

export type TTransactionMemo = {
  isReady: boolean
  value?: string
}

type TProps = {
  service: IBSWithMemo
  memo?: TTransactionMemo
  className?: string
  disabled?: boolean
  errorMessage?: string
  onChange: (memo: TTransactionMemo) => void
}

export const TransactionMemoActionStep = ({ className, service, memo, disabled, errorMessage, onChange }: TProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'transactionMemoActionStep' })
  const debounce = useDebounceFunction()

  const [value, setValue] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const latestValueRef = useRef<string | null>('')

  const handleChange = (newValue: string) => {
    const trimmedValue = newValue.trim() || undefined
    const isValid = !trimmedValue || service.validateMemo(trimmedValue)

    latestValueRef.current = newValue
    setValue(newValue)
    setIsInvalid(!isValid)
    onChange({ value: memo?.value, isReady: false })

    if (!isValid) return

    debounce(() => {
      if (latestValueRef.current !== newValue) return

      onChange({ value: trimmedValue, isReady: true })
    })
  }

  useEffect(() => {
    if (memo) return

    latestValueRef.current = ''
    setValue('')
    setIsInvalid(false)
  }, [memo])

  useEffect(() => {
    return () => {
      latestValueRef.current = null
    }
  }, [])

  return (
    <div className={StyleHelper.mergeStyles('mt-2 flex w-full flex-col rounded bg-gray-300/15 px-4', className)}>
      <ActionStep className="px-0" title={t('title')} leftIcon={<TbNotes aria-hidden />}>
        <span className="text-xs text-gray-100 italic">{t('optionalLabel')}</span>
      </ActionStep>

      <Separator />

      <div className="my-4 flex w-full flex-col">
        <Input
          id="memo"
          value={value}
          placeholder={t('placeholder')}
          className="w-full"
          errorMessage={isInvalid ? t('invalidMemo') : errorMessage}
          pastable
          disabled={disabled}
          onChange={event => handleChange(event.target.value)}
        />
      </div>
    </div>
  )
}
