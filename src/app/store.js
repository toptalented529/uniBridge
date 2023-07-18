import { configureStore } from '@reduxjs/toolkit'
import switchsReducer from '../features/switch/switchSlice'

export const store = configureStore({
  reducer: {
    switchs:switchsReducer,
  },
})