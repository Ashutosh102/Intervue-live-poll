import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserState, UserRole } from '../types/user'

const initialState: UserState = {
  role: null,
  name: undefined,
  id: undefined
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload
    },
    setUserInfo: (state, action: PayloadAction<{ name: string; id: string }>) => {
      state.name = action.payload.name
      state.id = action.payload.id
    }
  }
})

export const { setRole, setUserInfo } = userSlice.actions
export default userSlice.reducer

