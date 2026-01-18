import React, { useState } from 'react';
import Tile from '../../components/ui/Tile';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import {
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api/admin';

const AdminCategories = () => {
  const data = useLoaderData();
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    data.categories.then((cats) => setCategories(cats));
  }, [data.categories]);

  const handleDelete = async (categoryId) => {
    if (!confirm('Na pewno usunąć kategorię?')) return;
    await deleteCategory(categoryId);
    setCategories(categories.filter(c => c.id !== categoryId));
  };

  const handleUpdate = async (categoryId, newName) => {
    await updateCategory(categoryId, { name: newName });
    setCategories(categories.map(c => c.id === categoryId ? { ...c, name: newName } : c));
  };

  const handleCreate = async () => {
  const name = prompt('Nazwa nowej kategorii:');
  if (!name) return;
  const parentId = prompt('ID kategorii nadrzędnej (opcjonalnie):') || null;

  await createCategory({ name, parentId });

  const updatedCategories = await getAllCategoriesAdmin();
  setCategories(updatedCategories);
};


  return (
    <Suspense fallback={<div>Loading categories...</div>}>
      <Await resolve={data.categories}>
        {() => (
          <Tile>
            <div className="text-center mb-4 flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold">Admin - Category Management</h1>
              <p>Manage all product categories in the application.</p>
              <button
                onClick={handleCreate}
                className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>

            <table className="w-full table-auto border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Parent</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="border px-2 py-1 text-xs">{category.id}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => setCategories(categories.map(c =>
                          c.id === category.id ? { ...c, name: e.target.value } : c
                        ))}
                        onBlur={(e) => handleUpdate(category.id, e.target.value)}
                        className="w-full border px-1 py-0.5 rounded"
                      />
                    </td>
                    <td className="border px-2 py-1">{category.parentId || '-'}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => handleDelete(category.id)}
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

export default AdminCategories;

export async function loader() {
  return {
    categories: getAllCategoriesAdmin()
  };
}
