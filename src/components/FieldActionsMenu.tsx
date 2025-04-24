import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ToastHelper } from '@/helpers/ToastHelper'
import { usePressOnce } from '@/hooks/usePressOnce'

import { ContextMenu } from './ContextMenu'

type Props = {
  value: string
  disabled?: boolean
  readOnly?: boolean
  onChange?: (value: string) => void
  children: ReactNode
}

export const FieldActionsMenu = ({ value, disabled = false, readOnly = false, onChange, children }: Props) => {
  const { t } = useTranslation('components', { keyPrefix: 'fieldActionsMenu' })

  const pressOnceCut = usePressOnce(async () => {
    try {
      await navigator.clipboard.writeText(value)
      onChange?.('')
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('messages.error') })
    }
  })

  const pressOnceCopy = usePressOnce(async () => {
    try {
      await navigator.clipboard.writeText(value)

      ToastHelper.success({ message: t('messages.copied') })
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('messages.error') })
    }
  })

  const pressOncePaste = usePressOnce(async () => {
    try {
      const text = await navigator.clipboard.readText()

      onChange?.(`${value}${text.trim()}`)
    } catch (error) {
      console.error(error)
      ToastHelper.error({ message: t('messages.error') })
    }
  })

  const hasValue = value.length > 0
  const isDisabled = disabled || readOnly

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger disabled={isDisabled}>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          disabled={pressOnceCut.isPressing || isDisabled || !hasValue}
          onClick={pressOnceCut.handlePress()}
        >
          {t('cut')}
        </ContextMenu.Item>
        <ContextMenu.Item disabled={pressOnceCopy.isPressing || !hasValue} onClick={pressOnceCopy.handlePress()}>
          {t('copy')}
        </ContextMenu.Item>
        <ContextMenu.Item disabled={pressOncePaste.isPressing || isDisabled} onClick={pressOncePaste.handlePress()}>
          {t('paste')}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
