import { ComponentProps, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'

import { StyleHelper } from '@/helpers/StyleHelper'

export type TModalContainerProps = {
  children: ReactNode
} & ComponentProps<'div'>

export const ModalContent = ({ children, className }: TModalContainerProps) => (
  <div
    role="dialog"
    aria-modal="true"
    className={StyleHelper.mergeStyles(
      `w-popup-w-screen h-popup-h-screen absolute top-0 left-0 z-[1000] overflow-hidden`,
      className
    )}
  >
    <motion.div
      className="absolute top-0 left-0 h-full w-full bg-gray-900/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />

    {children}
  </div>
)

export const ModalContainer = (props: TModalContainerProps) => {
  const modalRoot = document.querySelector('#popup-root') as HTMLDivElement

  return createPortal(<ModalContent {...props} />, modalRoot)
}
