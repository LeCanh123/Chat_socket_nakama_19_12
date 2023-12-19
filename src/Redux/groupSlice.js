import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
  setGroupId:null,
}

export const groupSlice = createSlice({
  name: 'groupslice',
  initialState,
  reducers: {
    setGroupId: (state,action) => {
      state.setGroupId = action.payload.id
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setGroupId, decrement, incrementByAmount } = groupSlice.actions

export default groupSlice.reducer