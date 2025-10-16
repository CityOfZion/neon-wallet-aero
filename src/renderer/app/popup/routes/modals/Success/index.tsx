import { useModalState } from '@renderer/hooks/useModalRouter'
import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'
import { TModalState } from '@shared/types/modal'

import TbRosetteDiscountCheck from '@renderer/assets/images/tb-rosette-discount-check.svg?react'

export const SuccessModal = () => {
  const { heading, content, subtitle, footer } = useModalState<TModalState<'success'>>()

  return (
    <BottomModalLayout heading={heading} hideBackButton>
      <div className="flex min-h-0 flex-grow flex-col items-center">
        <div className="bg-asphalt flex h-28 w-28 items-center rounded-full p-2">
          <TbRosetteDiscountCheck aria-hidden className="text-blue h-24 w-24" />
        </div>

        <p className="mt-7 text-center text-lg text-white">{subtitle}</p>

        {content}
      </div>

      {footer}
    </BottomModalLayout>
  )
}

export default SuccessModal
