import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './products-slice.js'
import authReducer from './auth-slice.js'
import cartReducer from './cart-slice.js'
import favoritesReducer from './favorites-slice.js'

export default configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
})
