import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import Tile from '../../components/ui/Tile';
import {
  getAllProductsAdmin,
  updateProductStatus,
  deleteProductAdmin
} from '../../api/admin';

const AdminProducts = () => {
  const data = useLoaderData();

  const handleToggleActive = async (product) => {
    await updateProductStatus(product.id, !product.isActive);
    window.location.reload();
  };

  const handleDelete = async (productId) => {
    if (!confirm('Na pewno usunąć produkt?')) return;
    await deleteProductAdmin(productId);
    window.location.reload();
  };

  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <Await resolve={data.products}>
        {(products) => (
          <Tile>
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Admin - Product Management</h1>
              <p>Manage all products listed in the application.</p>
            </div>

            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Title</th>
                  <th className="border px-2 py-1">Price</th>
                  <th className="border px-2 py-1">Category</th>
                  <th className="border px-2 py-1">Active</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="border px-2 py-1 text-xs">{product.id}</td>
                    <td className="border px-2 py-1">{product.title}</td>
                    <td className="border px-2 py-1">{product.price} zł</td>
                    <td className="border px-2 py-1">{product.category || '-'}</td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={product.isActive}
                        onChange={() => handleToggleActive(product)}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tile>
        )}
      </Await>
    </Suspense>
  );
};

export default AdminProducts;

export async function loader() {
  return {
    products: getAllProductsAdmin()
  };
}
