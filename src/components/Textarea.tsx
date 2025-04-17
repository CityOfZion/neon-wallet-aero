import {
  ChangeEventHandler,
  ComponentProps,
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { useTranslation } from 'react-i18next'

import { FieldActionsMenu } from '@/components/FieldActionsMenu'
import { StyleHelper } from '@/helpers/StyleHelper'

import { IconButton } from './IconButton'

import MdCancel from '@/assets/images/md-cancel.svg?react'
import MdContentPasteGo from '@/assets/images/md-content-paste-go.svg?react'

type TProps = ComponentProps<'textarea'> & {
  label?: string
  containerClassName?: string
  errorMessage?: string
  error?: boolean
  clearable?: boolean
  pastable?: boolean
  compacted?: boolean
  multiline?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TProps>(
  (
    {
      label,
      className,
      containerClassName,
      errorMessage,
      pastable,
      error,
      compacted,
      clearable,
      onChange,
      multiline = true,
      ...props
    },
    ref
  ) => {
    const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })
    const internalRef = useRef<HTMLTextAreaElement>(null)

    const calculateHeight = useCallback(() => {
      if (!internalRef.current) return

      internalRef.current.style.height = '0px'

      const { scrollHeight } = internalRef.current

      internalRef.current.style.height = `${scrollHeight}px`
    }, [])

    const handleSetValue = (value: string) => {
      if (!internalRef.current) return

      const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!

      nativeSetter.call(internalRef.current, value)

      const event = new Event('input', { bubbles: true })

      internalRef.current.dispatchEvent(event)
      internalRef.current.focus()
    }

    const handlePaste = async () => {
      const text = await navigator.clipboard.readText()

      handleSetValue(text.trim())
    }

    const handleClear = () => {
      handleSetValue('')
      calculateHeight()
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== 'Enter') return

      event.preventDefault()
      event.stopPropagation()
    }

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
      calculateHeight()

      onChange?.(event)
    }

    useImperativeHandle(ref, () => internalRef.current!, [])

    useEffect(() => {
      calculateHeight()
    }, [multiline, calculateHeight])

    return (
      <div className={StyleHelper.mergeStyles('flex w-full flex-col', containerClassName)}>
        {label && (
          <label htmlFor={props.id} className="mb-2 block text-xs font-bold text-gray-100 uppercase">
            {label}
          </label>
        )}

        <div
          className={StyleHelper.mergeStyles(
            'bg-asphalt flex w-full cursor-text items-center gap-x-3 rounded px-5 font-medium text-white ring-2 ring-transparent transition-colors outline-none placeholder:text-white/50',
            {
              'min-h-8.5 py-1.5 text-xs': compacted,
              'min-h-12 py-2.5 text-sm': !compacted,
              'pr-3': clearable || pastable,
              'focus:ring-neon': !errorMessage || error === false,
              'ring-pink': !!errorMessage || error === true,
            }
          )}
        >
          <FieldActionsMenu
            value={['string', 'number'].includes(typeof props.value) ? props.value!.toString() : ''}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onChange={handleSetValue}
          >
            <textarea
              ref={internalRef}
              className={StyleHelper.mergeStyles(
                'w-full flex-grow resize-none [appearance:textfield] overflow-hidden bg-transparent outline-none disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                { 'whitespace-nowrap': !multiline },
                className
              )}
              rows={1}
              autoComplete="off"
              spellCheck={false}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              {...props}
            />
          </FieldActionsMenu>

          {(pastable || clearable) && (
            <div className="flex flex-row items-center gap-x-1">
              {pastable && (
                <IconButton
                  aria-label={tCommonGeneral('pasteFromClipboard')}
                  type="button"
                  colorSchema="neon"
                  size="sm"
                  disabled={props.disabled}
                  icon={<MdContentPasteGo aria-hidden={true} className="text-neon" />}
                  onClick={handlePaste}
                />
              )}

              {clearable && (
                <IconButton
                  aria-label={tCommonGeneral('clear')}
                  type="button"
                  size="sm"
                  disabled={props.disabled}
                  icon={<MdCancel aria-hidden={true} />}
                  onClick={handleClear}
                />
              )}
            </div>
          )}
        </div>

        {errorMessage && <span className="text-pink mt-1 block text-xs">{errorMessage}</span>}
      </div>
    )
  }
)
