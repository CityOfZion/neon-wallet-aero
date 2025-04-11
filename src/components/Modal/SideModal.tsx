import { useLayoutEffect, useState } from 'react'
import { FocusScope } from '@radix-ui/react-focus-scope'
import { motion, useAnimate, usePresence } from 'motion/react'

import { ModalRouterCurrentHistoryProvider } from '@/contexts/ModalRouterCurrentHistoryContext'
import { StyleHelper } from '@/helpers/StyleHelper'
import { useModalHistories } from '@/hooks/useModalRouter'
import { THistory } from '@/types/modal'

import { ModalContainer } from './ModalContainer'

export const SideModal = () => {
  const { histories } = useModalHistories()
  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate()

  const [sideHistories, setSideHistories] = useState<THistory[]>([])

  useLayoutEffect(() => {
    if (!isPresent) return
    setSideHistories(histories.filter(history => history.route.type === 'side'))
  }, [histories, isPresent])

  useLayoutEffect(() => {
    if (isPresent) {
      animate(scope.current, { width: 'var(--spacing-modal-side-width)' }, { type: 'spring', damping: 17 })
      return
    }

    animate(scope.current, { width: 0 }, { duration: 0.2 }).then(safeToRemove)
  }, [isPresent, animate, scope, safeToRemove])

  return (
    <ModalContainer className="flex justify-end">
      <motion.div className="relative h-full" ref={scope} initial={{ width: 0 }}>
        {sideHistories.map((history, index) => (
          <FocusScope
            key={history.id}
            loop
            className={StyleHelper.mergeStyles(`min-w-modal-side-width h-full`, {
              'invisible hidden': index !== sideHistories.length - 1,
            })}
          >
            <ModalRouterCurrentHistoryProvider value={history}>
              {history.route.element}
            </ModalRouterCurrentHistoryProvider>
          </FocusScope>
        ))}
      </motion.div>
    </ModalContainer>
  )
}
