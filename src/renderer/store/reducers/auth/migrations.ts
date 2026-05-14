import type { TLoginSessionType } from '@shared/types/store'

import type { TApplicationDataByLoginType } from '.'

export const authMigrations = {
  0: (state: any) => {
    const currentApplicationDataByLoginType = state.data.applicationDataByLoginType
    const applicationDataByLoginType = Object.keys(currentApplicationDataByLoginType).reduce((accumulator, key) => {
      const loginType = key as TLoginSessionType
      const applicationData = currentApplicationDataByLoginType[loginType]

      accumulator[loginType] = {
        ...applicationData,
        shouldConfirmAction: loginType !== 'hardware',
      }

      return accumulator
    }, {} as TApplicationDataByLoginType)

    return {
      ...state,
      data: {
        ...state.data,
        applicationDataByLoginType,
      },
    }
  },
}
