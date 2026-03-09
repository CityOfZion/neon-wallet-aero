import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { ClipboardHelper } from '@renderer/helpers/ClipboardHelper'

import { usePressOnce } from '@renderer/hooks/usePressOnce'

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

  const [isPressingCut, startPressCut] = usePressOnce(async () => {
    await ClipboardHelper.write(value)
    onChange?.('')
  })

  const [isPressingCopy, startPressCopy] = usePressOnce(async () => {
    await ClipboardHelper.write(value)
  })

  const [isPressingPaste, startPressPaste] = usePressOnce(async () => {
    const text = await ClipboardHelper.read()
    onChange?.(`${value}${text.trim()}`)
  })

  const hasValue = value.length > 0
  const isDisabled = disabled || readOnly

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger disabled={isDisabled}>{children}</ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item disabled={isPressingCut || isDisabled || !hasValue} onClick={startPressCut}>
          {t('cut')}
        </ContextMenu.Item>

        <ContextMenu.Item disabled={isPressingCopy || !hasValue} onClick={startPressCopy}>
          {t('copy')}
        </ContextMenu.Item>

        <ContextMenu.Item disabled={isPressingPaste || isDisabled} onClick={startPressPaste}>
          {t('paste')}
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}
