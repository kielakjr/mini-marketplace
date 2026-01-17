import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'

import Root from './pages/Root';
import Home, { loader as Productsloader} from './pages/Home';
import ProductDetail, { loader as ProductDetailLoader } from './pages/ProductDetail';

const router = createBrowserRouter([
  {
    path : '/',
    element: <Root />,
    children: [
      { index: true, element: <Home />, loader: Productsloader },
      {
        path: "/products",
        children: [
          { index: true, element: <Home />, loader: Productsloader },
          { path: ":productId", element: <ProductDetail />, loader: ProductDetailLoader }
        ]
      }
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
