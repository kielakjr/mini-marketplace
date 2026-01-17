const API_URL = 'http://mini-marketplace-api:3000';

export const getAllProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Nie udało się pobrać produktów');
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Nie znaleziono produktu');
  return res.json();
};



