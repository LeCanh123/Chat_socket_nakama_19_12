import { configureStore } from '@reduxjs/toolkit'
import groupSlice from './groupSlice'



export const store = configureStore({
  reducer: {groupSlice},
})