import type { ReactNode } from 'react'
import type { ToastT } from 'sonner'
import { toast } from 'sonner'

import { UtilsHelper } from '@renderer/helpers/UtilsHelper'

import { ErrorToast, InfoToast, PromiseToast, SuccessToast } from '@renderer/libs/sonner'

type TToastOptions = Omit<ToastT, 'id'> & {
  message: ReactNode
  id?: string | number
}

export class ToastHelper {
  static dismiss(id: string | number) {
    toast.dismiss(id)
  }

  static success({ id, message, ...props }: TToastOptions) {
    const customId = id ?? UtilsHelper.uuid()
    toast.custom(sonnerId => <SuccessToast sonnerId={sonnerId} message={message} />, {
      ...props,
      id: customId,
      unstyled: true,
    })
  }

  static error({ id, message, ...props }: TToastOptions) {
    const customId = id ?? UtilsHelper.uuid()
    toast.custom(sonnerId => <ErrorToast sonnerId={sonnerId} message={message} />, {
      ...props,
      id: customId,
      unstyled: true,
    })
  }

  static info({ id, message, ...props }: TToastOptions) {
    const customId = id ?? UtilsHelper.uuid()
    toast.custom(sonnerId => <InfoToast sonnerId={sonnerId} message={message} />, {
      ...props,
      id: customId,
      unstyled: true,
    })
  }

  static async loading({ id, message, ...props }: TToastOptions) {
    const customId = id ?? UtilsHelper.uuid()

    toast.custom(sonnerId => <PromiseToast sonnerId={sonnerId} message={message} />, {
      ...props,
      id: customId,
      unstyled: true,
      duration: Infinity,
    })
  }
}
