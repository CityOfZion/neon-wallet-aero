import { Suspense, useLayoutEffect, useState } from 'react'
import { FocusScope } from '@radix-ui/react-focus-scope'
import { ModalRouterCurrentHistoryProvider } from '@renderer/contexts/ModalRouterCurrentHistoryContext'
import { StyleHelper } from '@renderer/helpers/StyleHelper'
import { useModalHistories } from '@renderer/hooks/useModalRouter'
import { THistory } from '@shared/types/modal'
import { motion, useAnimate, usePresence } from 'motion/react'

import { ScreenLoader } from '../ScreenLoader'

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
      <motion.div className="relative h-full bg-gray-700" ref={scope} initial={{ width: 0 }}>
        {sideHistories.map((history, index) => (
          <FocusScope
            key={history.id}
            loop
            className={StyleHelper.mergeStyles(`min-w-modal-side-width h-full`, {
              'invisible hidden': index !== sideHistories.length - 1,
            })}
          >
            <ModalRouterCurrentHistoryProvider value={history} isFocused={index === histories.length - 1}>
              <Suspense fallback={<ScreenLoader />}>
                <history.route.element />
              </Suspense>
            </ModalRouterCurrentHistoryProvider>
          </FocusScope>
        ))}
      </motion.div>
    </ModalContainer>
  )
}
