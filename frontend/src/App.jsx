import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'
import Root from './pages/Root';
import Home from './pages/Home';

const router = createBrowserRouter([
  {
    path : '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
