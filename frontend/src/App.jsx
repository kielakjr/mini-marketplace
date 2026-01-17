import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login } from './store/auth-slice';

import Root from './pages/Root';
import Home, { loader as productsloader} from './pages/Home';
import ProductDetail, { loader as productDetailLoader } from './pages/ProductDetail';
import Login, {action as loginAction} from './pages/Login';
import Register, {action as registerAction} from './pages/Register';
import Profile from './pages/Profile';

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
      { path: "/register", element: <Register />, action: registerAction },
      { path: "/profile", element: <Profile /> }
    ]
  }
])

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const user = await res.json();
            dispatch(login({
              id: user.id,
              user: user,
              email: user.email,
              role: user.role
            }));
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
    };

    fetchUser();
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
