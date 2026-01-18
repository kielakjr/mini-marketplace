import React from 'react'
import { getMyOrders } from '../api/orders';
import { useLoaderData } from 'react-router-dom';

const ProfileOrders = () => {
  const orders = useLoaderData();

  console.log('Loaded orders:', orders);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <ul>
        {orders.length === 0 ? (
          <li>No orders found.</li>
        ) : (
          orders.map((order) => (
            <li key={order.id} className="mb-4 p-4 border rounded">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default ProfileOrders

export async function loader() {
  try {
    const orders = await getMyOrders();
    return orders;
  } catch (error) {
    console.error('Failed to load orders:', error);
    throw error;
  }
}
