import { forwardRef, Fragment } from 'react'

import type { KeyboardEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { FieldActionsMenu } from '@renderer/components/FieldActionsMenu'
import { Loader } from '@renderer/components/Loader'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

type TProps = {
  autoFocus?: boolean
  'aria-label'?: string
  placeholder?: string
  className?: string
  inputClassName?: string
  value?: string
  maxLength?: number
  disabled?: boolean
  loading?: boolean
  readOnly?: boolean
  onChange?: (value: string) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  children?: ReactNode
}

export const GreyAmountInput = forwardRef<HTMLInputElement, TProps>(
  (
    {
      autoFocus,
      'aria-label': ariaLabel,
      placeholder,
      className,
      inputClassName,
      value,
      maxLength,
      disabled,
      loading,
      readOnly,
      onKeyDown,
      onChange,
      children,
    },
    ref
  ) => {
    const { t } = useTranslation('components', { keyPrefix: 'greyAmountInput' })
    const isDisabled = loading || disabled

    return (
      <div
        className={StyleHelper.mergeStyles(
          'flex h-12 w-36 items-center justify-center rounded bg-gray-300/15 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
          className
        )}
        aria-disabled={isDisabled}
      >
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <FieldActionsMenu value={value || ''} disabled={isDisabled} readOnly={readOnly} onChange={onChange}>
              <input
                ref={ref}
                autoFocus={autoFocus}
                aria-label={ariaLabel}
                placeholder={placeholder || t('placeholder')}
                className={StyleHelper.mergeStyles(
                  'text-neon size-full [appearance:textfield] bg-transparent px-2 text-center outline-none disabled:cursor-not-allowed',
                  inputClassName
                )}
                value={value}
                maxLength={maxLength}
                disabled={isDisabled}
                readOnly={readOnly}
                onKeyDown={onKeyDown}
                onChange={event => onChange?.(event.target.value)}
              />
            </FieldActionsMenu>

            {children}
          </Fragment>
        )}
      </div>
    )
  }
)
