import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Separator } from '@renderer/components/Separator'

import IoReorderTwo from '@renderer/assets/images/io-reorder-two.svg?react'

import type { IWalletState } from '@shared/types/store'

type TProps = {
  wallet: IWalletState
  index: number
  arrayLength: number
}

export const ReorderWalletsItem = ({ wallet, index, arrayLength }: TProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: wallet.id,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex h-13 w-full cursor-grab items-center justify-between gap-2.5 px-2.5 transition-colors hover:bg-gray-300/15 active:cursor-grabbing aria-selected:bg-gray-300/15 aria-selected:hover:bg-gray-300/30"
      >
        <p className="truncate text-sm text-white">{wallet.name}</p>
        <IoReorderTwo className="text-neon h-6 max-h-6 min-h-6 w-6 max-w-6 min-w-6" aria-hidden />
      </button>
      {index + 1 !== arrayLength && <Separator />}
    </li>
  )
}
