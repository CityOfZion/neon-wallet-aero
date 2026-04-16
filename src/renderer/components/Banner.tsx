import { cloneElement } from 'react'

import type { ComponentProps, JSX, ReactNode } from 'react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import MdInfoOutline from '@renderer/assets/images/md-info-outline.svg?react'
import MdVerified from '@renderer/assets/images/md-verified.svg?react'
import TbAlertHexagon from '@renderer/assets/images/tb-alert-hexagon.svg?react'
import TbAlertSmall from '@renderer/assets/images/tb-alert-small.svg?react'
import TbAlertTriangle from '@renderer/assets/images/tb-alert-triangle.svg?react'
import TbEyePlus from '@renderer/assets/images/tb-eye-plus.svg?react'

type TBannerType = 'info' | 'error' | 'success' | 'warning' | 'warningOrange' | 'watch'

type TBanner = {
  message: ReactNode
  type: TBannerType
  textClassName?: string
  iconClassName?: string
}

type TProps = TBanner & ComponentProps<'div'>

const bannerIconByType: Record<TBannerType, JSX.Element> = {
  error: <TbAlertHexagon aria-hidden className="text-pink size-6" />,
  info: <MdInfoOutline aria-hidden className="text-blue size-6" />,
  watch: <TbEyePlus aria-hidden className="text-blue size-6" />,
  success: <MdVerified aria-hidden className="text-green size-6" />,
  warning: <TbAlertTriangle aria-hidden className="text-yellow size-6" />,
  warningOrange: (
    <div className="relative flex h-full items-center justify-center">
      <TbAlertSmall aria-hidden className="text-orange size-6" />

      <div className="border-orange absolute size-4 rotate-45 rounded-sm border-2" />
    </div>
  ),
}

export const Banner = ({ message, type, className, textClassName, iconClassName, ...props }: TProps) => {
  const icon = bannerIconByType[type]

  return (
    <div className={StyleHelper.mergeStyles('flex items-center rounded bg-gray-300/15', className)} {...props}>
      <div className="flex h-full items-center justify-center rounded-l bg-gray-300/30 px-4 py-3">
        {cloneElement(icon, { className: StyleHelper.mergeStyles(icon.props.className, iconClassName) })}
      </div>

      <p className={StyleHelper.mergeStyles('px-5 py-2 text-xs text-white', textClassName)}>{message}</p>
    </div>
  )
}
