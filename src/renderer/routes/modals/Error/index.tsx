import { useModalState } from '@renderer/hooks/useModalRouter'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdOutlineCancel from '@renderer/assets/images/md-outline-cancel.svg?react'

import type { TModalState } from '@shared/types/modal'

export const ErrorModal = () => {
  const { heading, subtitle, content } = useModalState<TModalState<'error'>>()

  return (
    <BottomModalLayout heading={heading} contentClassName="items-center">
      <div className="bg-asphalt flex size-28 items-center rounded-full p-2">
        <MdOutlineCancel aria-hidden className="text-pink size-24" />
      </div>

      <p className="mt-8 text-lg text-white">{subtitle}</p>

      {content}
    </BottomModalLayout>
  )
}

export default ErrorModal
