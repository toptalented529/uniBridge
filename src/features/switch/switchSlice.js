import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 5,
}

export const switchsSlice = createSlice({
  name: 'switchs',
  initialState,
  reducers: {
 
    switchNetwork: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { switchNetwork } = switchsSlice.actions

export default switchsSlice.reducer