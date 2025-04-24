import { cloneElement, ComponentProps, JSX, ReactNode } from 'react'

import { StyleHelper } from '@/helpers/StyleHelper'

import MdInfoOutline from '@/assets/images/md-info-outline.svg?react'
import MdVerified from '@/assets/images/md-verified.svg?react'
import TbAlertHexagon from '@/assets/images/tb-alert-hexagon.svg?react'
import TbAlertSmall from '@/assets/images/tb-alert-small.svg?react'
import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg?react'
import TbEyePlus from '@/assets/images/tb-eye-plus.svg?react'

type TBannerType = 'info' | 'error' | 'success' | 'warning' | 'warningOrange' | 'watch'

type TBanner = {
  message: ReactNode
  type: TBannerType
  textClassName?: string
  iconClassName?: string
}

type TProps = TBanner & ComponentProps<'div'>

const bannerIconByType: Record<TBannerType, JSX.Element> = {
  error: <TbAlertHexagon aria-hidden={true} className="text-pink h-6 w-6" />,
  info: <MdInfoOutline aria-hidden={true} className="text-blue h-6 w-6" />,
  watch: <TbEyePlus aria-hidden={true} className="text-blue h-6 w-6" />,
  success: <MdVerified aria-hidden={true} className="text-green h-6 w-6" />,
  warning: <TbAlertTriangle aria-hidden={true} className="text-yellow h-6 w-6" />,
  warningOrange: (
    <div className="relative flex h-full items-center justify-center">
      <TbAlertSmall aria-hidden={true} className="text-orange h-6 w-6" />

      <div className="border-orange absolute h-4 w-4 rotate-45 rounded-sm border-2" />
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
