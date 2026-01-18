import { getToken } from './auth';

const API_URL = '/api/orders';

export async function getAllOrders() {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  if (!res.ok) throw new Error('Could not fetch orders');
  return res.json();
}

export async function getMyOrders() {
  const res = await fetch(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  if (!res.ok) throw new Error('Could not fetch your orders');
  return res.json();
}

export async function getOrder(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${await getToken()}`,
    },
  });
  if (!res.ok) throw new Error('Could not fetch order');
  return res.json();
}
