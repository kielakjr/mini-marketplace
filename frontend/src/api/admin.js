import { getToken } from './auth';

const API_URL = '/api/admin';

/* =========================
   HELPERS
========================= */

const authFetch = async (url, options = {}) => {
  const token = await getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Admin API error');
  }

  return res.json();
};

/* =========================
   USERS
========================= */

export const getAllUsers = () =>
  authFetch(`${API_URL}/users`);

export const updateUserRole = (userId, role) =>
  authFetch(`${API_URL}/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });

export const toggleUserActive = (userId, isActive) =>
  authFetch(`${API_URL}/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });

export const deleteUser = (userId) =>
  authFetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  });

/* =========================
   PRODUCTS
========================= */

export const getAllProductsAdmin = () =>
  authFetch(`${API_URL}/products`);

export const updateProductStatus = (productId, isActive) =>
  authFetch(`${API_URL}/products/${productId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive }),
  });

export const deleteProductAdmin = (productId) =>
  authFetch(`${API_URL}/products/${productId}`, {
    method: 'DELETE',
  });

/* =========================
   CATEGORIES
========================= */

export const getAllCategoriesAdmin = () =>
  authFetch(`${API_URL}/categories`);

export const createCategory = (data) =>
  authFetch(`${API_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(data), // { name, parentId }
  });

export const updateCategory = (categoryId, data) =>
  authFetch(`${API_URL}/categories/${categoryId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const deleteCategory = (categoryId) =>
  authFetch(`${API_URL}/categories/${categoryId}`, {
    method: 'DELETE',
  });

/* =========================
   ORDERS
========================= */

export const getAllOrdersAdmin = () =>
  authFetch(`${API_URL}/orders`);

export const updateOrderStatus = (orderId, status) =>
  authFetch(`${API_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

/* =========================
   PAYMENTS
========================= */

export const getAllPaymentsAdmin = () =>
  authFetch(`${API_URL}/payments`);

export const updatePaymentStatus = (paymentId, status) =>
  authFetch(`${API_URL}/payments/${paymentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

/* =========================
   SHIPMENTS
========================= */

export const getAllShipmentsAdmin = () =>
  authFetch(`${API_URL}/shipments`);

export const updateShipmentStatus = (shipmentId, status) =>
  authFetch(`${API_URL}/shipments/${shipmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

/* =========================
   AUDIT LOGS
========================= */

export const getAuditLogs = () =>
  authFetch(`${API_URL}/audit-logs`);
