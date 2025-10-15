import { Suspense, useLayoutEffect, useState } from 'react'

import { FocusScope } from '@radix-ui/react-focus-scope'
import { motion, useAnimate, usePresence } from 'motion/react'

import { StyleHelper } from '@renderer/helpers/StyleHelper'

import { useModalHistories } from '@renderer/hooks/useModalRouter'

import { ModalRouterCurrentHistoryProvider } from '@renderer/contexts/ModalRouterCurrentHistoryContext'
import type { THistory } from '@shared/types/modal'

import { ScreenLoader } from '../ScreenLoader'
import { ModalContainer } from './ModalContainer'

export const BottomModal = () => {
  const { histories } = useModalHistories()
  const [isPresent, safeToRemove] = usePresence()
  const [scope, animate] = useAnimate()

  const [bottomHistories, setBottomHistories] = useState<THistory[]>([])

  useLayoutEffect(() => {
    if (!isPresent) return
    setBottomHistories(histories.filter(history => history.route.type === 'bottom'))
  }, [histories, isPresent])

  useLayoutEffect(() => {
    if (isPresent) {
      animate(
        scope.current,
        { height: 'var(--spacing-modal-bottom-height)' },
        { type: 'spring', damping: 27, stiffness: 300 }
      )

      return
    }

    animate(scope.current, { height: 0 }, { duration: 0.2 }).then(safeToRemove)
  }, [isPresent, animate, scope, safeToRemove])

  return (
    <ModalContainer className="flex items-end">
      <motion.div
        className="relative w-full overflow-hidden rounded-t-2xl bg-gray-700"
        ref={scope}
        initial={{ height: 0 }}
      >
        {bottomHistories.map((history, index) => (
          <FocusScope
            key={history.id}
            loop
            className={StyleHelper.mergeStyles(`min-h-modal-bottom-height h-full w-full`, {
              'invisible hidden': index !== bottomHistories.length - 1,
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
