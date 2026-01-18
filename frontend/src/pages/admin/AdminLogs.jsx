import React from 'react'
import { Suspense } from 'react'
import { Await } from 'react-router-dom';
import Tile from '../../components/ui/Tile'
import { useLoaderData } from 'react-router-dom'
import { getAuditLogs } from '../../api/admin'

const AdminLogs = () => {
  const data = useLoaderData();

  return (
    <Suspense fallback={<div>Loading audit logs...</div>}>
      <Await resolve={data.logs}>
        {(logs) => (
          <Tile>
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold mb-4">Admin - Audit Logs</h1>
              <p>Review the audit logs of administrative actions taken within the application.</p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                  <th className="border border-gray-300 px-4 py-2">User</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.userId}</td>
                    <td className="border border-gray-300 px-4 py-2">{log.action}</td>
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

export default AdminLogs

export async function loader() {
  return {
    logs: getAuditLogs()
  };
}
