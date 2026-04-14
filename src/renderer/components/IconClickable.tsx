import { cloneElement } from 'react'

import type { ComponentProps } from 'react'
import { match } from 'ts-pattern'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import TbLoader2 from '@renderer/assets/images/tb-loader-2.svg?react'

export type TIconClickableCustomProps = {
  variant?: 'contained' | 'normal' | 'boxed'
  icon: React.JSX.Element
  size?: 'xs' | 'sm' | 'md'
  colorSchema?: 'neon' | 'gray' | 'white' | 'yellow' | 'error' | 'solid-gray'
  disabled?: boolean
  loading?: boolean
}

export type TIconClickableProps = TIconClickableCustomProps & ComponentProps<'div'>

const Base = ({
  icon,
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

  const fixedIcon = loading ? <TbLoader2 aria-hidden className="animate-spin text-gray-300" /> : icon

  const { className: iconClassName, ...iconProps } = fixedIcon.props

  const isNeonColorSchema = colorSchema === 'neon'
  const isGrayColorSchema = colorSchema === 'gray'
  const isWhiteColorSchema = colorSchema === 'white'
  const isYellowColorSchema = colorSchema === 'yellow'
  const isErrorColorSchema = colorSchema === 'error'
  const isSolidGrayColorSchema = colorSchema === 'solid-gray'

  return (
    <div
      aria-disabled={disabled}
      className={StyleHelper.mergeStyles(
        'flex h-fit cursor-pointer flex-col items-center justify-center truncate rounded-lg transition-all aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        'bg-gray-300/15 aria-[disabled=false]:hover:bg-gray-300/30 aria-[disabled=false]:focus:bg-gray-300/30 aria-[disabled=false]:active:bg-gray-300/45',
        {
          'gap-y-0.5': isSm || isXs,
          'gap-y-1': isMd,
          'text-neon': isNeonColorSchema,
          'text-gray-200': isGrayColorSchema,
          'text-white': isWhiteColorSchema,
          'text-yellow': isYellowColorSchema,
          'text-pink': isErrorColorSchema,
          'text-asphalt bg-gray-200 aria-[disabled=false]:hover:bg-gray-200/80 aria-[disabled=false]:focus:bg-gray-200/80 aria-[disabled=false]:active:bg-gray-200/60':
            isSolidGrayColorSchema,
        },
        className
      )}
      {...props}
    >
      {cloneElement(fixedIcon, {
        className: StyleHelper.mergeStyles(
          'object-contain',
          {
            'size-4': isXs,
            'size-5': isSm,
            'size-6': isMd,
          },
          iconClassName
        ),
        ...iconProps,
      })}

      {children && !loading && <span className="text-sm whitespace-nowrap">{children}</span>}
    </div>
  )
}

const Normal = ({ className, colorSchema, ...props }: TIconClickableProps) => {
  return (
    <Base
      className={StyleHelper.mergeStyles(
        'rounded-sm p-1',
        'bg-transparent aria-[disabled=false]:hover:bg-gray-300/15 aria-[disabled=false]:focus:bg-gray-300/15 aria-[disabled=false]:active:bg-gray-300/30',
        className
      )}
      colorSchema={colorSchema}
      {...props}
    />
  )
}

const Contained = ({ className, ...props }: TIconClickableProps) => {
  return <Base className={StyleHelper.mergeStyles('p-3', className)} {...props} />
}

const Boxed = ({ className, ...props }: TIconClickableProps) => {
  return <Base className={StyleHelper.mergeStyles('h-17 min-w-21.5', className)} {...props} />
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
