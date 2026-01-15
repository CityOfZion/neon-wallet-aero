import { cloneElement } from 'react'

import { toast as sonner, Toaster as SonnerToaster } from 'sonner'

import { Loader } from '@renderer/components/Loader'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import MdCheckCircleOutline from '@renderer/assets/images/md-check-circle-outline.svg?react'
import MdClose from '@renderer/assets/images/md-close.svg?react'
import MdErrorOutline from '@renderer/assets/images/md-error-outline.svg?react'

import type { TToastHelperToastOptions, TToastHelperToastProps } from '@shared/types/helpers'

import { I18nextHelper } from './I18nextHelper'
import { StyleHelper } from './StyleHelper'

const { t } = I18nextHelper.get()

export class ToastHelper {
  private static Toast({ message, className, sonnerId, icon, closeable = true }: TToastHelperToastProps) {
    return (
      <div
        className={StyleHelper.mergeStyles(
          'mx-auto flex w-[var(--width)] items-center gap-5 rounded p-5 text-sm font-medium shadow-lg',
          className
        )}
      >
        {icon &&
          cloneElement(icon, {
            className: StyleHelper.mergeStyles('size-6 min-size-6 max-size-6', icon.props.className),
          })}

        <div className="flex-grow">{message}</div>

        {closeable && (
          <button
            type="button"
            aria-label={t('components:baseToast.closeIconButtonLabel')}
            onClick={() => sonner.dismiss(sonnerId)}
            className="min-size-6 max-size-6 size-6 cursor-pointer opacity-50"
          >
            <MdClose aria-hidden className="h-full w-full" />
          </button>
        )}
      </div>
    )
  }

  static Provider() {
    return <SonnerToaster position="bottom-center" expand gap={10} />
  }

  static dismiss(id: string | number) {
    sonner.dismiss(id)
  }

  static success({ id, message, ...props }: TToastHelperToastOptions) {
    const customId = id ?? UtilsHelper.uuid()

    sonner.custom(
      sonnerId => (
        <this.Toast
          className="text-neon bg-green-700"
          message={message}
          sonnerId={sonnerId}
          icon={<MdCheckCircleOutline aria-hidden />}
        />
      ),
      {
        ...props,
        id: customId,
        unstyled: true,
      }
    )
  }

  static error({ id, message, ...props }: TToastHelperToastOptions) {
    const customId = id ?? UtilsHelper.uuid()
    sonner.custom(
      sonnerId => (
        <this.Toast
          className="bg-pink-700 text-white"
          message={message}
          sonnerId={sonnerId}
          icon={<MdErrorOutline aria-hidden className="text-magenta" />}
        />
      ),
      {
        ...props,
        id: customId,
        unstyled: true,
      }
    )
  }

  static info({ id, message, ...props }: TToastHelperToastOptions) {
    const customId = id ?? UtilsHelper.uuid()
    sonner.custom(
      sonnerId => (
        <this.Toast
          className="bg-orange text-white"
          message={message}
          sonnerId={sonnerId}
          icon={<MdErrorOutline aria-hidden className="text-white" />}
        />
      ),
      {
        ...props,
        id: customId,
        unstyled: true,
      }
    )
  }

  static async loading({ id, message, ...props }: TToastHelperToastOptions) {
    const customId = id ?? UtilsHelper.uuid()

    sonner.custom(
      sonnerId => (
        <this.Toast
          className="bg-orange text-white"
          message={message}
          sonnerId={sonnerId}
          icon={<Loader containerClassName="w-min" />}
          closeable={false}
        />
      ),
      {
        ...props,
        id: customId,
        unstyled: true,
        duration: Infinity,
      }
    )
  }
}
