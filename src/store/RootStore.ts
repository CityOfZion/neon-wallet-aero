import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'

import { authReducer, authReducerConfig } from './reducers/AuthReducer'
import { settingsReducer, settingsReducerConfig } from './reducers/SettingsReducer'
import { utilityReducer, utilityReducerConfig } from './reducers/UtilityReducer'

const persistedAuthReducer = persistReducer(authReducerConfig, authReducer)
const persistedSettingsReducer = persistReducer(settingsReducerConfig, settingsReducer)
const persistedUtilityReducer = persistReducer(utilityReducerConfig, utilityReducer)

export class RootStore {
  static reducers = combineReducers({
    auth: persistedAuthReducer,
    settings: persistedSettingsReducer,
    utility: persistedUtilityReducer,
  })

  static store = configureStore({
    reducer: RootStore.reducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })

  static persistor = persistStore(RootStore.store)
}
