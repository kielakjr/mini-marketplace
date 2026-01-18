import React from 'react'
import Tile from '../../components/ui/Tile'
import { useLoaderData } from 'react-router-dom'
import { Suspense } from 'react'
import { Await } from 'react-router-dom';
import {getAllShipmentsAdmin} from '../../api/admin'

const AdminShipments = () => {
  const data = useLoaderData();
  return (
    <Suspense fallback={<div>Loading shipments...</div>}>
      <Await resolve={data.shipments}>
        {(shipments) => (
          <Tile>
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold mb-4">Admin - Shipment Management</h1>
              <p>Manage all shipments in the application.</p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Order ID</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Tracking Number</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="border border-gray-300 px-4 py-2">{shipment.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{shipment.orderId}</td>
                    <td className="border border-gray-300 px-4 py-2">{shipment.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{shipment.trackingNumber}</td>
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

export default AdminShipments

export async function loader() {
  return {
    shipments: getAllShipmentsAdmin()
  };
}
