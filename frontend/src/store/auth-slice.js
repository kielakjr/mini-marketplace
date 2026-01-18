import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  user: null,
  email: null,
  role: null,
  isLoggedIn: false,
  loading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.id = action.payload.id
      state.user = action.payload.user
      state.email = action.payload.email
      state.role = action.payload.role
      state.isLoggedIn = true
    },
    logout(state) {
      state.id = null
      state.user = null
      state.email = null
      state.role = null
      state.isLoggedIn = false
    },
    load(state) {
      state.loading = false
    }
  },
})

export const { login, logout, load } = authSlice.actions
export default authSlice.reducer
