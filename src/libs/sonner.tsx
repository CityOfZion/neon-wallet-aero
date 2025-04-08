import { cloneElement, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, Toaster } from 'sonner'

import { Loader } from '@/components/Loader'
import { StyleHelper } from '@/helpers/StyleHelper'

import MdCheckCircleOutline from '@/assets/images/md-check-circle-outline.svg?react'
import MdClose from '@/assets/images/md-close.svg?react'
import MdErrorOutline from '@/assets/images/md-error-outline.svg?react'

export type TBaseToastProps = {
  message: ReactNode
  className?: string
  sonnerId: string | number
  icon?: React.JSX.Element
  closeable?: boolean
}

const BaseToast = ({ message, className, sonnerId, icon, closeable = true }: TBaseToastProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'baseToast' })
  return (
    <div
      className={StyleHelper.mergeStyles(
        'flex w-[var(--width)] items-center gap-5 rounded p-5 text-sm font-medium shadow-lg',
        className
      )}
    >
      {icon &&
        cloneElement(icon, {
          className: StyleHelper.mergeStyles(
            'w-[1.5rem] h-[1.5rem] min-w-[1.5rem] min-h-[1.5rem]',
            icon.props.className
          ),
        })}

      <div className="flex-grow">{message}</div>

      {closeable && (
        <button
          aria-label={t('closeIconButtonLabel')}
          onClick={() => toast.dismiss(sonnerId)}
          className="h-[1.5rem] min-h-[1.5rem] w-[1.5rem] min-w-[1.5rem] opacity-50"
        >
          <MdClose aria-hidden className="h-full w-full" />
        </button>
      )}
    </div>
  )
}

export const SuccessToast = ({ message, sonnerId }: Pick<TBaseToastProps, 'message' | 'sonnerId'>) => {
  return (
    <BaseToast
      className="text-neon bg-green-700"
      message={message}
      sonnerId={sonnerId}
      icon={<MdCheckCircleOutline aria-hidden />}
    />
  )
}

export const ErrorToast = ({ message, sonnerId }: Pick<TBaseToastProps, 'message' | 'sonnerId'>) => {
  return (
    <BaseToast
      className="bg-pink-700 text-white"
      message={message}
      sonnerId={sonnerId}
      icon={<MdErrorOutline aria-hidden className="text-magenta" />}
    />
  )
}

export const InfoToast = ({ message, sonnerId }: Pick<TBaseToastProps, 'message' | 'sonnerId'>) => {
  return (
    <BaseToast
      className="bg-orange text-white"
      message={message}
      sonnerId={sonnerId}
      icon={<MdErrorOutline aria-hidden className="text-white" />}
    />
  )
}

export const PromiseToast = ({ message, sonnerId }: Pick<TBaseToastProps, 'message' | 'sonnerId'>) => {
  return (
    <BaseToast
      className="bg-orange text-white"
      message={message}
      sonnerId={sonnerId}
      icon={<Loader containerClassName="w-min" />}
      closeable={false}
    />
  )
}

export const ToastProvider = () => <Toaster position="bottom-center" expand gap={10} />
