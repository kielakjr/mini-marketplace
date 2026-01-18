import React from 'react'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { login, load } from './store/auth-slice';
import { setCart } from './store/cart-slice';
import { getCart } from './api/cart';
import { setFavorites } from './store/favorites-slice';
import { fetchFavorites } from './api/favorites';
import { fetchCategories } from './api/categories';
import { setCategories } from './store/products-slice';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';

import Root from './pages/Root';
import Error from './pages/Error';
import Home, { loader, loader as productsloader} from './pages/Home';
import ProductDetail, { loader as productDetailLoader } from './pages/ProductDetail';
import Login, { action as loginAction} from './pages/Login';
import Register, {action as registerAction} from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout, {action as checkoutAction} from './pages/Checkout';
import ProfileOrders, {loader as profileOrdersLoader} from './pages/ProfileOrders';
import Favorites, {loader as favoritesLoader} from './pages/Favorites';
import AddProduct, {action as addProductAction} from './pages/AddProduct';
import MyProducts, {loader as myProductsLoader} from './pages/MyProducts';
import AdminPanel from './pages/AdminPanel';

import AdminProducts, {loader as adminProductsLoader} from './pages/admin/AdminProducts';
import AdminUsers, {loader as adminUsersLoader} from './pages/admin/AdminUsers';
import AdminCategories, {loader as adminCategoriesLoader} from './pages/admin/AdminCategories';
import AdminOrders, {loader as adminOrdersLoader} from './pages/admin/AdminOrders';
import AdminPayments, {loader as adminPaymentsLoader} from './pages/admin/AdminPayments';
import AdminShipments, {loader as adminShipmentsLoader} from './pages/admin/AdminShipments';
import AdminLogs, {loader as logsLoader} from './pages/admin/AdminLogs';

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
          { path: ":productId", element: <ProductDetail />, loader: productDetailLoader },
          { path: "new", element: <ProtectedUserRoute><AddProduct /></ProtectedUserRoute>, action: addProductAction },
          { path: "my", element: <ProtectedUserRoute><MyProducts /></ProtectedUserRoute>, loader: myProductsLoader }
        ]
      },
      { path: "/login", element: <Login />, action: loginAction },
      { path: "/register", element: <Register />, action: registerAction },
      { path: "/profile",
        element: <ProtectedUserRoute><Profile /></ProtectedUserRoute>,
        children: [
          { index: true, element: <MyProducts />, loader: myProductsLoader },
          { path: "orders", element: <ProfileOrders />, loader: profileOrdersLoader },
          { path: "favorites", element: <Favorites />, loader: favoritesLoader },
          { path: "my-products", element: <MyProducts />, loader: myProductsLoader },
        ]
      },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <ProtectedUserRoute><Checkout /></ProtectedUserRoute>, action: checkoutAction },
      { path: "/favorites", element: <ProtectedUserRoute><Favorites /></ProtectedUserRoute>, loader: favoritesLoader },
      { path: "/admin",
        element: <ProtectedAdminRoute><AdminPanel /></ProtectedAdminRoute>,
        children: [
          { index: true, element: <AdminUsers />, loader: adminUsersLoader },
          { path: "users", element: <AdminUsers />, loader: adminUsersLoader },
          { path: "categories", element: <AdminCategories />, loader: adminCategoriesLoader },
          { path: "orders", element: <AdminOrders />, loader: adminOrdersLoader },
          { path: "payments", element: <AdminPayments />, loader: adminPaymentsLoader },
          { path: "shipments", element: <AdminShipments />, loader: adminShipmentsLoader },
          { path: "logs", element: <AdminLogs />, loader: logsLoader },
          { path: "products", element: <AdminProducts />, loader: adminProductsLoader }
        ]
      }
    ]
  }
])

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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
    if (!isLoggedIn) return;
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

  React.useEffect(() => {
    if (!isLoggedIn) return;
    const loadFavorites = async () => {
      try {
        const favoritesData = await fetchFavorites();
        dispatch(setFavorites(favoritesData));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();
  }, [dispatch]);

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        dispatch(setCategories(categoriesData));
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, [dispatch]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
