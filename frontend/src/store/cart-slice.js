import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload
    },
    addItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    removeItem(state, action) {
      const existing = state.items.find(i => i.id === action.payload)
      if (existing) {
        existing.quantity -= 1
        if (existing.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload)
        }
      }
    },
    updateQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload.id)
      if (item) item.quantity = action.payload.quantity
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { setCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
