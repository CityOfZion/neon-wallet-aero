import { cloneElement } from 'react'

import type { ComponentProps } from 'react'
import { match } from 'ts-pattern'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbLoader2 from '@renderer/assets/images/tb-loader-2.svg?react'

export type TIconClickableCustomProps = {
  variant?: 'contained' | 'normal' | 'boxed'
  icon: React.JSX.Element
  text?: string
  size?: 'xs' | 'sm' | 'md'
  colorSchema?: 'neon' | 'gray' | 'white' | 'yellow' | 'error'
  disabled?: boolean
  loading?: boolean
  children?: React.ReactNode
}

export type TIconClickableProps = TIconClickableCustomProps & ComponentProps<'div'>

const Base = ({
  icon,
  text,
  colorSchema,
  className,
  disabled,
  size,
  variant: _variant,
  loading,
  children,
  ...props
}: TIconClickableProps) => {
  const isMd = size === 'md'
  const isSm = size === 'sm'
  const isXs = size === 'xs'

  const isNeon = colorSchema === 'neon'
  const isGray = colorSchema === 'gray'
  const isWhite = colorSchema === 'white'
  const isYellow = colorSchema === 'yellow'
  const isError = colorSchema === 'error'

  const fixedIcon = loading ? <TbLoader2 aria-hidden className="animate-spin text-gray-300" /> : icon

  const { className: iconClassName, ...iconProps } = fixedIcon.props

  return (
    <div
      aria-disabled={disabled}
      className={StyleHelper.mergeStyles(
        'flex h-fit cursor-pointer flex-col items-center justify-center transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        { 'gap-y-0.5': isSm || isXs, 'gap-y-1': isMd },
        {
          'text-neon': isNeon,
          'text-gray-100': isGray,
          'text-white': isWhite,
          'text-yellow': isYellow,
          'text-pink': isError,
        },
        className
      )}
      {...props}
    >
      {cloneElement(fixedIcon, {
        className: StyleHelper.mergeStyles(
          'object-contain',
          {
            'w-4 h-4': isXs,
            'w-5 h-5': isSm,
            'w-6 h-6': isMd,
          },
          iconClassName
        ),
        ...iconProps,
      })}
      {children}
    </div>
  )
}

const Normal = ({ className, ...props }: TIconClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'rounded-sm p-1 aria-expanded:bg-gray-300/15 aria-expanded:hover:bg-gray-300/30 aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30 aria-[disabled=false]:hover:bg-gray-300/15',
        className
      )}
      {...props}
    />
  )
}

const Contained = ({ className, ...props }: TIconClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'rounded-lg bg-gray-300/15 p-3.5 aria-selected:bg-gray-300/30 aria-selected:hover:bg-gray-300/45 aria-[disabled=false]:hover:bg-gray-300/30',
        className
      )}
      {...props}
    />
  )
}

const Boxed = ({ text, loading, className, ...props }: TIconClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'h-17 min-w-21.5 truncate rounded-lg bg-gray-300/15 aria-selected:bg-gray-300/30 aria-selected:hover:bg-gray-300/45 aria-[disabled=false]:hover:bg-gray-300/30 aria-[disabled=false]:focus:bg-gray-300/30 aria-[disabled=false]:active:bg-gray-300/45',
        className
      )}
      {...props}
    >
      {text && !loading && <span className="text-sm whitespace-nowrap">{text}</span>}
    </Base>
  )
}

export const IconClickable = ({
  size = 'md',
  colorSchema = 'gray',
  variant = 'normal',
  disabled = false,
  loading = false,
  ...rest
}: TIconClickableProps) => {
  const props = { size, colorSchema, variant, disabled, loading, ...rest }

  return match(props.variant)
    .with('contained', () => <Contained {...props} />)
    .with('boxed', () => <Boxed {...props} />)
    .otherwise(() => <Normal {...props} />)
}
