import React from 'react'
import Tile from '../components/ui/Tile'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from '../store/auth-slice'
import Button from '../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import Line from '../components/ui/Line'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { logoutUser } from '../api/auth'

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Tile className="mx-auto mt-8 p-6">
      <div className="flex items-center justify-between mb-6 text-3xl">
        <h2 className="text-5xl font-semibold mb-4">Profile</h2>
        <Button onClick={() => {
          dispatch(logout());
          logoutUser();
          navigate('/');
        }}>Logout</Button>
      </div>
      <div className="flex flex-col gap-2 mb-6 text-2xl">
        <p><strong>Name:</strong> {auth.user.name}</p>
        <p><strong>Email:</strong> {auth.user.email}</p>
        <p><strong>Role:</strong> {auth.user.role}</p>
      </div>
      <Line />
      <div className="my-6 text-2xl flex gap-4">
        <NavLink to="/profile/my-products" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>My Products</NavLink>
        <NavLink to="/profile/orders" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Orders</NavLink>
        <NavLink to="/profile/favorites" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Favorites</NavLink>
      </div>
      <Line />
      <main className="mt-6">
        <Outlet />
      </main>
    </Tile>
  )
}

export default Profile
