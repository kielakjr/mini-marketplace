import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'

import Root from './pages/Root';
import Home, { loader as productsloader} from './pages/Home';
import ProductDetail, { loader as productDetailLoader } from './pages/ProductDetail';
import Login, {action as loginAction} from './pages/Login';
import Register, {action as registerAction} from './pages/Register';

const router = createBrowserRouter([
  {
    path : '/',
    element: <Root />,
    children: [
      { index: true, element: <Home />, loader: productsloader },
      {
        path: "/products",
        children: [
          { index: true, element: <Home />, loader: productsloader },
          { path: ":productId", element: <ProductDetail />, loader: productDetailLoader }
        ]
      },
      { path: "/login", element: <Login />, action: loginAction },
      { path: "/register", element: <Register />, action: registerAction }
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
