import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './products-slice.js'
import authReducer from './auth-slice.js'

export default configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
  },
})
