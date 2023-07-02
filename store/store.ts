
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { userSlice } from './user'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
})
})
