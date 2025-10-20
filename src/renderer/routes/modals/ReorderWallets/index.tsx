import { useState } from 'react'

import type { DragEndEvent } from '@dnd-kit/core'
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTranslation } from 'react-i18next'

import { Button } from '@renderer/components/Button'

import { useModalNavigate } from '@renderer/hooks/useModalRouter'
import { useAppDispatch } from '@renderer/hooks/useRedux'
import { useWalletsSelector } from '@renderer/hooks/useWalletSelector'

import { BottomModalLayout } from '@renderer/layouts/BottomModalLayout'

import MdCheck from '@renderer/assets/images/md-check.svg?react'
import TbWallet from '@renderer/assets/images/tb-wallet.svg?react'

import { authReducerActions } from '@renderer/store/reducers/auth'
import type { IWalletState } from '@shared/types/store'

import { ReorderWalletsItem } from './ReorderWalletsItem'

export const ReorderWalletsModal = () => {
  const { t } = useTranslation('modals', { keyPrefix: 'reorderWallets' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'general' })
  const { modalErase, modalEraseWrapper } = useModalNavigate()
  const { wallets } = useWalletsSelector()
  const dispatch = useAppDispatch()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12,
        delay: 100,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [reorderedWallets, setReorderedWallets] = useState<IWalletState[]>(wallets)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setReorderedWallets(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    dispatch(authReducerActions.reorderWallets(reorderedWallets))
    modalErase('bottom')
  }

  return (
    <BottomModalLayout heading={t('title')}>
      <div className="bg-asphalt flex items-center gap-4 rounded px-3.5 py-2">
        <TbWallet className="text-blue size-6" aria-hidden />
        <h3 className="text-blue text-sm">{t('subtitle')}</h3>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <div className="my-2.5 min-h-0 overflow-y-auto rounded">
          <SortableContext
            items={reorderedWallets.map(reorderedWallet => reorderedWallet.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col">
              {reorderedWallets.map((wallet, index, array) => (
                <ReorderWalletsItem key={wallet.id} wallet={wallet} index={index} arrayLength={array.length} />
              ))}
            </ul>
          </SortableContext>
        </div>
      </DndContext>

      <div className="mt-auto flex gap-2.5">
        <Button
          variant="card"
          label={commonT('cancel')}
          colorSchema="gray"
          onClick={modalEraseWrapper('bottom')}
          clickableProps={{ className: 'px-4' }}
        />
        <Button
          className="w-full"
          variant="card"
          label={commonT('confirm')}
          rightIcon={<MdCheck aria-hidden />}
          iconsOnEdge={false}
          onClick={handleSave}
        />
      </div>
    </BottomModalLayout>
  )
}

export default ReorderWalletsModal
