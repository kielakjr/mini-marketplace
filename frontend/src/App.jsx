import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { login, load } from './store/auth-slice';
import { setCart } from './store/cart-slice';
import { getCart } from './api/cart';
import ProtectedUserRoute from './components/ProtectedUserRoute';

import Root from './pages/Root';
import Error from './pages/Error';
import Home, { loader as productsloader} from './pages/Home';
import ProductDetail, { loader as productDetailLoader } from './pages/ProductDetail';
import Login, {action as loginAction} from './pages/Login';
import Register, {action as registerAction} from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout, {action as checkoutAction} from './pages/Checkout';
import ProfileOrders, {loader as profileOrdersLoader} from './pages/ProfileOrders';

const router = createBrowserRouter([
  {
    path : '/',
    element: <Root />,
    errorElement: <Error />,
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
      { path: "/profile",
        element: <ProtectedUserRoute><Profile /></ProtectedUserRoute>,
        children: [
          { path: "orders", element: <ProfileOrders />, loader: profileOrdersLoader }
        ]
      },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <ProtectedUserRoute><Checkout /></ProtectedUserRoute>, action: checkoutAction }
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
      dispatch(load());
    };

    fetchUser();
  }, [dispatch]);

  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getCart();
        dispatch(setCart(cartData));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadCart();
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
