import { cloneElement, JSX, useTransition } from 'react'
import { Separator } from '@renderer/components/Separator'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useModalNavigate } from '@renderer/hooks/useModalRouter'

import TbExternalLink from '@renderer/assets/images/tb-external-link.svg?react'

type TProps = {
  label: string
  icon: JSX.Element
  onClick: (() => void) | (() => Promise<void>)
  hasSeparator?: boolean
  isExternal?: boolean
  isDisabled?: boolean
}

export const MenuItemButton = ({
  label,
  icon,
  onClick,
  hasSeparator = true,
  isExternal = false,
  isDisabled = false,
}: TProps) => {
  const { modalErase } = useModalNavigate()

  const [isLoading, startIsLoading] = useTransition()

  const disabled = isDisabled || isLoading

  const handleClick = () => {
    if (disabled) return

    startIsLoading(async () => {
      await onClick()

      modalErase('side')
    })
  }

  return (
    <li className="-mx-4 w-auto">
      <button
        className={StyleHelper.mergeStyles(
          'relative flex w-full cursor-pointer flex-col px-3 transition-opacity duration-200 hover:opacity-75 focus:opacity-75 active:opacity-60',
          {
            'pointer-events-none cursor-default opacity-40': disabled,
          }
        )}
        disabled={disabled}
        onClick={handleClick}
      >
        <div className="flex w-full flex-row items-center gap-x-3.5 py-3.5">
          {cloneElement(icon, {
            ...icon.props,
            className: StyleHelper.mergeStyles('text-neon ml-2 size-6', icon.props.className),
          })}

          <p className="flex-grow truncate text-left text-sm text-white">{label}</p>

          {isExternal && <TbExternalLink aria-hidden className="size-6 text-gray-300" />}
        </div>
      </button>

      {hasSeparator && <Separator containerClassName="px-3" />}
    </li>
  )
}
