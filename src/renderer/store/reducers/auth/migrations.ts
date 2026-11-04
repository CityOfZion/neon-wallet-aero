import type { TApplicationDataByLoginType, TLoginSessionType } from '@shared/types/store'

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
  1: (state: any) => {
    const currentApplicationDataByLoginType = state.data.applicationDataByLoginType
    const applicationDataByLoginType = Object.keys(currentApplicationDataByLoginType).reduce((accumulator, key) => {
      const loginType = key as TLoginSessionType
      const applicationData = currentApplicationDataByLoginType[loginType]

      accumulator[loginType] = {
        ...applicationData,
        notifications: applicationData.notifications.map((notification: any) => ({
          ...notification,
          date: new Date(notification.date * 1000).toJSON(),
        })),
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
