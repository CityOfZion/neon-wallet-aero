import { ComponentProps, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { motion } from 'motion/react'

type TProps = {
  children: ReactNode
} & ComponentProps<'div'>

export const ModalContent = ({ children, className }: TProps) => (
  <div
    role="dialog"
    aria-modal="true"
    className={StyleHelper.mergeStyles('absolute top-0 left-0 z-[1000] h-full w-full overflow-hidden', className)}
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

export const ModalContainer = (props: TProps) => {
  const rootElement = document.querySelector('#neon-root')!

  return createPortal(<ModalContent {...props} />, rootElement)
}
