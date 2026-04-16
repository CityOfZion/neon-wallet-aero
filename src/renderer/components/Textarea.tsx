import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import type { ChangeEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import MdCancel from '@renderer/assets/images/md-cancel.svg?react'
import MdContentPasteGo from '@renderer/assets/images/md-content-paste-go.svg?react'

import { FieldActionsMenu } from './FieldActionsMenu'
import { IconButton } from './IconButton'

type TProps = React.ComponentProps<'textarea'> & {
  containerClassName?: string
  errorMessage?: string
  id: string
  error?: boolean
  clearable?: boolean
  pastable?: boolean
  compacted?: boolean
  multiline?: boolean
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TProps>(
  (
    {
      className,
      containerClassName,
      errorMessage,
      id,
      pastable,
      error,
      compacted,
      clearable,
      onChange,
      multiline = true,
      label,
      ...props
    },
    ref
  ) => {
    const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
    const internalRef = useRef<HTMLTextAreaElement>(null)

    const setValue = (value: string) => {
      if (!internalRef.current) return

      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!

      nativeSetter.call(internalRef.current, value)

      const event = new Event('input', { bubbles: true })

      internalRef.current.dispatchEvent(event)
      internalRef.current.focus()
    }

    const handlePaste = async () => {
      setValue(await navigator.clipboard.readText())
    }

    const clear = () => {
      setValue('')
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !multiline) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
      onChange?.(event)
    }

    useImperativeHandle(ref, () => internalRef.current!, [])

    useEffect(() => {
      setTimeout(() => {
        // To avoid a bug with Firefox where the height of the textarea does not update correctly
        if (!internalRef.current) return

        internalRef.current.style.height = '0px'

        const scrollHeight = internalRef.current.scrollHeight

        internalRef.current.style.height = scrollHeight + 'px'
      }, 0)
    }, [multiline, props.value])

    return (
      <div className={StyleHelper.mergeStyles('w-full', containerClassName)}>
        {label && (
          <label htmlFor={id} className="mb-2 block text-xs font-bold text-gray-100 uppercase">
            {label}
          </label>
        )}

        <div
          className={StyleHelper.mergeStyles(
            'bg-asphalt flex w-full items-center gap-x-1 rounded px-5 font-medium text-white ring-2 ring-transparent outline-none placeholder:text-white/50',
            {
              'py-[0.3125rem] text-xs': compacted,
              'py-3 text-sm': !compacted,
              'ring-pink': !!errorMessage || error === true,
              'focus:ring-neon': !errorMessage || error === false,
              'pr-3': clearable,
            }
          )}
        >
          <FieldActionsMenu
            value={['string', 'number'].includes(typeof props.value) ? props.value!.toString() : ''}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={setValue}
          >
            <textarea
              id={id}
              className={StyleHelper.mergeStyles(
                'min-h-4 w-full flex-grow resize-none overflow-hidden bg-transparent outline-none',
                {
                  'whitespace-nowrap': !multiline,
                },
                className
              )}
              ref={internalRef}
              rows={1}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              {...props}
            />
          </FieldActionsMenu>

          {pastable && (
            <IconButton
              aria-label={tCommonGeneral('pasteFromClipboard')}
              type="button"
              colorSchema="neon"
              disabled={props.disabled}
              icon={<MdContentPasteGo aria-hidden className="text-neon" />}
              onClick={handlePaste}
            />
          )}

          {clearable && <IconButton icon={<MdCancel aria-hidden />} type="button" onClick={clear} />}
        </div>

        {errorMessage && <span className="text-pink mt-1 block text-xs">{errorMessage}</span>}
      </div>
    )
  }
)
