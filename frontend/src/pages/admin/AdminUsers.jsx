import React, { Suspense } from 'react'
import Tile from '../../components/ui/Tile'
import { getAllUsers } from '../../api/admin'
import { useLoaderData } from 'react-router-dom'
import { Await } from 'react-router-dom';
import { updateUserRole, toggleUserActive } from '../../api/admin';

const AdminUsers = () => {
  const data = useLoaderData();

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      alert('User role updated successfully');
    } catch (error) {
      alert(`Error updating user role: ${error.message}`);
    }
  }

  const handleIsActiveChange = async (userId, isActive) => {
    try {
      await toggleUserActive(userId, isActive);
      alert('User active status updated successfully');
    } catch (error) {
      alert(`Error updating user active status: ${error.message}`);
    }
  }

  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <Await resolve={data.users}>
        {(users) => (
          <Tile>
            <div className="text-center mb-3">
              <h1 className="text-2xl font-bold mb-4">Admin - User Management</h1>
              <p>Manage all registered users in the application.</p>
            </div>
            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">ID</th>
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Email</th>
                  <th className="border border-gray-300 px-4 py-2">Role</th>
                  <th className="border border-gray-300 px-4 py-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center">
                        <select defaultValue={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex items-center justify-center">
                        <input type="checkbox" defaultChecked={user.isActive} onChange={(e) => handleIsActiveChange(user.id, e.target.checked)} />
                      </div>
                    </td>
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

export default AdminUsers

export async function loader() {
  return{
    users: getAllUsers()
  }
}
