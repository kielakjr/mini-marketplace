import React from 'react'
import Tile from '../../components/ui/Tile'
import { useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { Await } from 'react-router-dom';
import {getAllPaymentsAdmin} from '../../api/admin'

const AdminPayments = () => {
  const data = useLoaderData();
  return (
    <Suspense fallback={<div>Loading payments...</div>}>
      <Await resolve={data.payments}>
        {(payments) => (
          <Tile>
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold mb-4">Admin - Payment Management</h1>
              <p>Manage all payments processed in the application.</p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Order ID</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="border border-gray-300 px-4 py-2">{payment.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment.orderId}</td>
                    <td className="border border-gray-300 px-4 py-2">${payment.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
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

export default AdminPayments

export async function loader() {
  return {
    payments: getAllPaymentsAdmin()
  };
}
