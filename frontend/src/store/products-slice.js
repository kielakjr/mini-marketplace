import { createSlice } from '@reduxjs/toolkit'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
  },
  reducers: {
    setProducts(state, action) {
      state.items = action.payload
    },
    setCategories(state, action) {
      state.categories = action.payload
    }
  },
})

export const { setProducts, setCategories } = productsSlice.actions
export default productsSlice.reducer
