import { ComponentProps } from 'react'

import { IconButton } from '@/components/IconButton'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalHistories, useModalNavigate } from '@/hooks/useModalRouter'

import TbArrowLeft from '@/assets/images/tb-arrow-left.svg?react'
import TbX from '@/assets/images/tb-x.svg?react'

type TProps = { heading: string } & ComponentProps<'div'>

export const BottomModalLayout = ({ children, heading, className, ...props }: TProps) => {
  const { modalEraseWrapper, modalNavigateWrapper } = useModalNavigate()
  const { histories } = useModalHistories()

  const withBackButton = histories.filter(history => history.route.type === 'bottom').length > 1

  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex h-full min-h-0 w-full flex-col rounded-t-2xl bg-gray-700 px-4 py-5',
        className
      )}
      {...props}
    >
      <header className="relative mb-5 flex w-full items-center justify-center text-white">
        {withBackButton && (
          <IconButton
            icon={<TbArrowLeft aria-hidden />}
            onClick={modalNavigateWrapper(-1)}
            className="absolute top-1/2 left-0 -translate-y-1/2"
          />
        )}

        <h2 className="text-sm font-bold">{heading}</h2>

        <IconButton
          className="absolute top-1/2 right-0 -translate-y-1/2"
          icon={<TbX aria-hidden />}
          onClick={modalEraseWrapper('bottom')}
        />
      </header>

      {children}
    </div>
  )
}
