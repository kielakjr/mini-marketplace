import { getToken } from './auth.js';
const API_URL = '/api/products';

export const getAllProducts = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

export const addNewProduct = async (productData) => {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getToken()}`,
    },
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to add product');
  }
  return res.json();
};

export const getMyProducts = async () => {
  const res = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch your products');
  }
  return res.json();
};

