import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

import type { TModalState } from '@shared/types/modal'

export const SuccessModal = () => {
  const { heading, content, subtitle, footer, onErase } = useModalState<TModalState<'success'>>()

  return (
    <BottomModalLayout heading={heading} hideBackButton onErase={onErase}>
      <div className="flex min-h-0 flex-grow flex-col items-center">
        <div className="bg-asphalt flex size-28 items-center rounded-full p-2">
          <TbRosetteDiscountCheck aria-hidden className="text-blue size-24" />
        </div>

        <p className="mt-7 px-10 text-center text-lg text-white">{subtitle}</p>

        {content}
      </div>

      {footer}
    </BottomModalLayout>
  )
}

export default SuccessModal
