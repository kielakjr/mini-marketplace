import React from 'react'
import Tile from '../components/ui/Tile'
import Line from '../components/ui/Line'
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <Tile>
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <p>Welcome to the Admin Panel. Here you can manage the application settings and user accounts.</p>
      </div>
      <Line />
      <div className="flex gap-4 justify-around text-2xl my-6">
        <NavLink to="/admin/users" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Users</NavLink>
        <NavLink to="/admin/products" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Products</NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Categories</NavLink>
        <NavLink to="/admin/orders" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Orders</NavLink>
        <NavLink to="/admin/payments" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Payments</NavLink>
        <NavLink to="/admin/shipments" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Shipments</NavLink>
        <NavLink to="/admin/logs" className={({isActive}) => isActive ? "text-gray-300 italic" : ""}>Logs</NavLink>
      </div>
      <main>
        <Outlet />
      </main>
    </Tile>
  )
}

export default AdminPanel
