// it is mandatory to have the index file inside the store folder
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import bookReducer from './books/booksSlice'
import cartReducer from './Cart/cartSlice'
import categoryReducer from './Categories/categorySlice'
import bookalertReducer from './books/booksAlertSlice'
import React from 'react'

const store = configureStore({
  reducer: {
    auth: authReducer,
    book: bookReducer,
    cart: cartReducer,
    categories: categoryReducer,
    bookAlert: bookalertReducer
  }
})
export default store
