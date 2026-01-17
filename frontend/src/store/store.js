import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './products-slice.js'

export default configureStore({
  reducer: {
    products: productsReducer,
  },
})
