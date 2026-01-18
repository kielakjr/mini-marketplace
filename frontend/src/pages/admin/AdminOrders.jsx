import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { Await } from 'react-router-dom';
import Tile from '../../components/ui/Tile'
import {getAllOrdersAdmin} from '../../api/admin'

const AdminOrders = () => {
  const data = useLoaderData();

  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <Await resolve={data.orders}>
        {(orders) => (
          <Tile>
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold mb-4">Admin - Order Management</h1>
              <p>Manage all orders placed in the application.</p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Order ID</th>
                  <th className="border border-gray-300 px-4 py-2">User</th>
                  <th className="border border-gray-300 px-4 py-2">Total Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.userId}</td>
                    <td className="border border-gray-300 px-4 py-2">${order.totalPrice}</td>
                    <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tile>
        )}
      </Await>
    </Suspense>
  )
}

export default AdminOrders

export async function loader() {
  return {
    orders: getAllOrdersAdmin()
  };
}
