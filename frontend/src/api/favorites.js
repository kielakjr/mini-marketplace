import { getToken } from "./auth";

export const fetchFavorites = async () => {
  const token = await getToken();
  const response = await fetch('/api/favorites', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
      throw new Error('Failed to fetch favorites');
  }
  return await response.json();
}

export const addFavorite = async (itemId) => {
  const token = await getToken();
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({productId: itemId})
  });
  if (!response.ok) {
      throw new Error('Failed to add favorite');
  }
  return await response.json();
}

export const removeFavorite = async (itemId) => {
  const token = await getToken();
  const response = await fetch(`/api/favorites/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
      throw new Error('Failed to remove favorite');
  }
  return await response.json();
}
